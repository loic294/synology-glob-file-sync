import { Settings } from "../../types/Settings";
import { Tasks } from "../../types/Tasks";
import { getDatabase } from "./database";
import { defaultContent } from "./defaultContent";

export async function getTasks(): Promise<Tasks[]> {
  const db = await getDatabase();
  return ((await db.getData("/tasks")) as Tasks[]) || defaultContent.tasks;
}

export async function setTasks(newTask: any): Promise<Tasks[]> {
  const db = await getDatabase();

  const date = new Date();
  const nextRun = new Date(date.getTime() + newTask.runEvery * 60000);
  newTask.nextRun = nextRun.getTime();
  newTask.nextRunReadable = nextRun.toLocaleString();
  newTask.isRunning = false;

  await db.push("/tasks[]", newTask);

  return getTasks();
}

export async function getTask(index: number): Promise<Tasks> {
  const db = await getDatabase();

  return await db.getData(`/tasks[${index}]`);
}

export async function updateTask(index: number, task: any): Promise<Tasks> {
  const db = await getDatabase();
  const path = `/tasks[${index}]`;

  await db.push(path, task);

  return db.getData(path);
}

export async function deleteTask(index: number): Promise<Tasks[]> {
  const db = await getDatabase();

  await db.delete(`/tasks[${index}]`);

  return getTasks();
}
