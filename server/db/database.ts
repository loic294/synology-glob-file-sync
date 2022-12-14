import { existsSync, writeFileSync } from "fs";
import { JsonDB, Config } from "node-json-db";
import { dirname, join } from "path";
import { getVolumes } from "../folders/volumes";
import { defaultContent } from "./defaultContent";

const volumes = getVolumes();
const file = join(volumes.settings, "/db.json");

console.log("FILE", file);

if (!existsSync(file)) {
  writeFileSync(file, JSON.stringify(defaultContent));
}

// The first argument is the database filename. If no extension, '.json' is assumed and automatically added.
// The second argument is used to tell the DB to save after each push
// If you put false, you'll have to call the save() method.
// The third argument is to ask JsonDB to save the database in an human readable format. (default false)
// The last argument is the separator. By default it's slash (/)
var db = new JsonDB(new Config(file, true, false, "/", true));

export async function getDatabase() {
  return db;
}
