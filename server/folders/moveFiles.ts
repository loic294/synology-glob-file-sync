import axios from "axios";
import { Tasks } from "../../types/Tasks";
import { getDatabase } from "../db/database";
import { findFiles } from "../task/findFiles";
import { getVolumes } from "./volumes";
import { getSettings } from "../db/settings";
const fs = require("fs-extra");
const path = require("path");

var appRoot = require("app-root-path").toString();

const localProxy = "http://localhost:3939";

export async function moveFiles(index: number) {
  const db = await getDatabase();
  const task = await db.getData(`/tasks[${index}]`);

  console.log("IS RUNNING?", task.isRunning);

  if (task.isRunning) {
    return 0;
  }

  try {
    await db.push(`/tasks[${index}]`, { ...task, isRunning: true });

    console.log("UPDATED TASK", task);

    const source = task.source;
    const target = task.target;
    const files = await findFiles(index);

    console.log("FILES TO MOVE", files);

    const promises = files.map((file) => moveFilePromise(file, source, target));

    console.log("PROMISES", promises);

    const filesMoved = await Promise.all(promises);

    const date = new Date();
    const nextRun = new Date(date.getTime() + task.runEvery * 60000);

    await db.push(`/tasks[${index}]`, {
      ...task,
      isRunning: false,
      nextRun: nextRun.getTime(),
      nextRunReadable: nextRun.toLocaleString(),
    });

    console.log("SUCCESS MOVING FILES", filesMoved);

    return filesMoved;
  } catch (e) {
    console.error(e);
    await db.push(`/tasks[${index}]`, { ...task, isRunning: false });
  }
}

async function moveFilePromise(file: string, source: string, target: string) {
  const relativePath = file.replace(source, "");

  const src = file;
  const dest = `${target}${relativePath}`;

  await moveFile(src, dest);

  return dest;
}

async function moveFile(src: string, dest: string) {
  const proxyExist = await checkProxyConnection();
  console.log("PROXY EXIST", proxyExist);

  if (!proxyExist) {
    await installProxy();
    throw new Error("Proxy was installed");
  }

  const settings = await getSettings();

  const data = {
    source: src.startsWith("/source")
      ? src.replace("/source", settings.baseSource)
      : src,
    target: dest.startsWith("/target")
      ? dest.replace("/target", settings.baseTarget)
      : dest,
  };

  await axios.post(`${localProxy}/moveFile`, data);
}

async function checkProxyConnection() {
  try {
    const response = await axios.get(`${localProxy}/health`);
    return response.data.message === "ok";
  } catch (e) {
    return false;
  }
}

export async function installProxy() {
  const proxyFileName = "fileMove.js";
  const volumes = getVolumes();
  const prxoyFileInSettings = path.join(volumes.settings, "/", proxyFileName);
  const proxyFile = path.join(appRoot, "/runnable/", proxyFileName);

  console.log("PROXY FILE", proxyFile);
  console.log("PROXY DEST", prxoyFileInSettings);

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(prxoyFileInSettings)) {
      fs.readFile(proxyFile, { encoding: "utf8" }, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        fs.writeFile(prxoyFileInSettings, data, (err) => {
          if (err) {
            reject(err);
          }

          console.log("Proxy File Copied to", prxoyFileInSettings);

          resolve(true);
        });
      });
    } else {
      resolve(false);
    }
  });
}
