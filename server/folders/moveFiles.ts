import { Tasks } from "../../types/Tasks";
import { getDatabase } from "../db/database";
import { findFiles } from "../task/findFiles";
const fs = require("fs-extra");

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

    const promises = files.map((file) => moveFilePromise(file, task, source, target, index));

    console.log("PROMISES", promises);

    await Promise.all(promises);

    const date = new Date();
    const nextRun = new Date(date.getTime() + task.runEvery * 60000);

    await db.push(`/tasks[${index}]`, {
      ...task,
      isRunning: false,
      nextRun: nextRun.getTime(),
      nextRunReadable: nextRun.toLocaleString(),
    });

    return files.length;
  } catch (e) {
    console.error(e);
    await db.push(`/tasks[${index}]`, { ...task, isRunning: false });
  }
}

async function moveFilePromise(file: string, task: Tasks, source: string, target: string, index: number) {
  const db = await getDatabase();

  const relativePath = file.replace(source, "");
  console.log("RELATIVE PATH", relativePath);

  const src = file;
  const dest = `${target}${relativePath}`;

  await moveFile(src, dest);
}

async function moveFile(src: string, dest: string) {
  try {
    await fs.move(src, dest);
    console.log("Success moving file", src, dest);
  } catch (err) {
    console.log("Failed moving file", src, dest);
    console.error(err);
  }
}
