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

export async function getTask(index: number): Promise<Settings> {
  const db = await getDatabase();

  return await db.getData(`/tasks[${index}]`);
}

export async function updateTask(index: number, task: any): Promise<Settings> {
  const db = await getDatabase();
  const path = `/tasks[${index}]`;

  console.log("UPDATE TASK", path);

  await db.push(path, task);

  return db.getData(path);
}

export async function deleteTask(index: number): Promise<Settings> {
  const db = await getDatabase();

  await db.delete(`/tasks[${index}]`);

  return getTasks();
}
