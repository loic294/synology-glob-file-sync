import path from "path";
import { isDevEnv } from "../../utils/isDevEnv";

export function getVolumes() {
  return isDevEnv()
    ? {
        settings: path.join(__dirname, "../../../../.dev/settings"),
        source: path.join(__dirname, "../../../../.dev/source"),
        target: path.join(__dirname, "../../../../.dev/target"),
      }
    : {
        settings: "/settings",
        source: "/source",
        target: "/target",
      };
}
