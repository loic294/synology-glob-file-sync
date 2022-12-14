import { Settings } from "../../types/Settings";
import { getDatabase } from "./database";
import { defaultContent } from "./defaultContent";

export async function getSettings(): Promise<Settings> {
  const db = await getDatabase();
  return (await db.getData("/settings")) || defaultContent.settings;
}

export async function setSettings(newSettings: any): Promise<Settings> {
  const db = await getDatabase();

  await db.push("/settings", newSettings);

  return getSettings();
}
