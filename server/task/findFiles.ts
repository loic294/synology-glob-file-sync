import { getDatabase } from "../db/database";
import fg from "fast-glob";

export async function findFiles(index: number) {
  const db = await getDatabase();
  const excludeFolders = await db.getData(`/settings/excludeFolders`);
  const regex = new RegExp(excludeFolders, "gi");
  const task = await db.getData(`/tasks[${index}]`);

  const patterns = task.defaultGlob.split(",").map((pattern) => `${task.source}/${pattern.trim()}`);

  const files = await fg(patterns);
  const filtered = files.filter((file) => !regex.test(file));

  return filtered;
}
