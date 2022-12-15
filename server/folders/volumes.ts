import path from "path";
import { isDevEnv } from "../../utils/isDevEnv";

var appRoot = require("app-root-path").toString();

export function getVolumes() {
  return isDevEnv()
    ? {
        settings: path.join(appRoot, "/.dev/settings"),
        source: path.join(appRoot, "/.dev/source"),
        target: path.join(appRoot, "/.dev/target"),
      }
    : {
        settings: "/settings",
        source: "/source",
        target: "/target",
      };
}
