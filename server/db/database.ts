import { existsSync, readFileSync, writeFileSync } from "fs";
import { JsonDB, Config } from "node-json-db";
import { dirname, join } from "path";
import { getVolumes } from "../folders/volumes";
import { defaultContent } from "./defaultContent";
import merge from "lodash/merge";

const volumes = getVolumes();
const file = join(volumes.settings, "/db.json");

console.log("FILE", file);

if (!existsSync(file)) {
  console.log("WRITING NEW FILE", JSON.stringify(defaultContent));
  writeFileSync(file, JSON.stringify(defaultContent));
} else {
  const content = JSON.parse(readFileSync(file, "utf8"));
  const merged = merge({}, defaultContent, content);
  writeFileSync(file, JSON.stringify(merged));
}

// The first argument is the database filename. If no extension, '.json' is assumed and automatically added.
// The second argument is used to tell the DB to save after each push
// If you put false, you'll have to call the save() method.
// The third argument is to ask JsonDB to save the database in an human readable format. (default false)
// The last argument is the separator. By default it's slash (/)
var db = new JsonDB(new Config(file, true, true, "/", true));

export async function getDatabase() {
  return db;
}
