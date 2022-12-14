import { Settings } from "../../types/Settings";
import { getDatabase } from "./database";
import { defaultContent } from "./defaultContent";

export async function getTasks(): Promise<Settings> {
  const db = await getDatabase();
  return (await db.getData("/tasks")) || defaultContent.tasks;
}

export async function setTasks(newTask: any): Promise<Settings> {
  const db = await getDatabase();

  await db.push("/tasks[]", newTask);

  return getTasks();
}
