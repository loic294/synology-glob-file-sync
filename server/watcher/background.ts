import { getTasks } from "../db/tasks";
import { moveFiles } from "../folders/moveFiles";

export function initWatcher() {
  console.log("INIT WATCHER");

  setInterval(() => {
    checkAllTasks();
  }, (+process?.env?.INTERVAL as number | undefined) || 1000);
}

async function checkAllTasks() {
  console.log("Running Task");
  const tasks = await getTasks();
  const now = Date.now();
  const promises = [];

  let index = 0;
  for (const task of tasks) {
    if (now > task.nextRun && !task.isRunning) {
      console.log("RUNNING TASK", task);
      promises.push(async () => moveFiles(index));
    }
    index++;
  }

  return Promise.all(promises);
}
