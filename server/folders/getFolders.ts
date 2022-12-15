import { readdirSync } from "fs";
import { getDatabase } from "../db/database";

function getFolderInDirectory(path: string, regex: RegExp) {
  return readdirSync(path, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && !regex.test(dirent.name))
    .map((dirent) => dirent.name);
}

export async function getFolders(path: string) {
  const db = await getDatabase();
  const foldersToExclude = await db.getData("/settings/excludeFolders");
  const regex = new RegExp(foldersToExclude);

  const allFolders = [];
  const foldersToVisit = [path];

  while (foldersToVisit.length > 0) {
    const currentFolder = foldersToVisit.pop() as string;
    allFolders.push(currentFolder);

    const folders = getFolderInDirectory(currentFolder, regex);

    for (const folder of folders) {
      const folderPath = `${currentFolder}/${folder}`;
      foldersToVisit.push(folderPath);
    }
  }

  return allFolders;
}
