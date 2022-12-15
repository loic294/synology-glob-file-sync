import { getDatabase } from "../db/database";
import { findFiles } from "../task/findFiles";

const fs = require("fs-extra");

export async function moveFiles(index: number) {
  const db = await getDatabase();
  const task = await db.getData(`/tasks[${index}]`);

  await db.push(`/tasks[${index}]`, { isRunning: true });

  const source = task.source;
  const target = task.target;
  const files = await findFiles(index);

  const promises = files.map(async (file) => {
    const relativePath = file.replace(source, "");
    console.log("RELATIVE PATH", relativePath);

    const src = file;
    const dest = `${target}${relativePath}`;

    await moveFile(src, dest);

    const date = new Date();
    const nextRun = new Date(date.getTime() + task.runEvery * 60000);

    await db.push(`/tasks[${index}]`, {
      isRunning: false,
      nextRun: nextRun.getTime(),
      nextRunReadable: nextRun.toLocaleString(),
    });

    return files;
  });

  return Promise.all(promises);
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
