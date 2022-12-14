import { readdirSync } from "fs";

function getFolderInDirectory(path: string) {
  return readdirSync(path, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

export function getFolders(path: string) {
  const allFolders = [];
  const foldersToVisit = [path];

  while (foldersToVisit.length > 0) {
    const currentFolder = foldersToVisit.pop() as string;
    allFolders.push(currentFolder);

    const folders = getFolderInDirectory(currentFolder);

    for (const folder of folders) {
      const folderPath = `${currentFolder}/${folder}`;
      foldersToVisit.push(folderPath);
    }
  }

  return allFolders;
}
