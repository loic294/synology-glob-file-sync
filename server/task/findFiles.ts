import { globby } from "globby";
import { getDatabase } from "../db/database";

export async function findFiles(index: number) {
  const db = await getDatabase();
  const excludeFolders = await db.getData(`/settings/excludeFolders`);
  console.log("EXCLUDE FOLDERS", excludeFolders);
  const regex = new RegExp(excludeFolders, "gi");
  const task = await db.getData(`/tasks[${index}]`);

  const patterns = task.defaultGlob.split(",").map((pattern) => `${task.source}/${pattern.trim()}`);
  console.log("PATTERNS", patterns);

  const files = await globby(patterns);
  console.log("FILES", files);
  const filtered = files.filter((file) => !regex.test(file));
  console.log("FILTERED", filtered);

  return filtered;
}
