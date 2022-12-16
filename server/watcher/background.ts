import { getTask, getTasks } from "../db/tasks";
import { moveFiles } from "../folders/moveFiles";

export function initWatcher() {
  console.log("Starting background task");

  checkAllTasks();

  setInterval(() => {
    checkAllTasks();
  }, (+process?.env?.INTERVAL as number | undefined) || 60 * 1000);
}

async function checkAllTasks() {
  console.log("Check If Task Should Run");
  const tasks = await getTasks();
  const completedTasks = [];

  let index = 0;
  for (const task of tasks) {
    if (Date.now() > task.nextRun && !task.isRunning && task.runEvery > 0) {
      console.log("RUNNING TASK", task);
      const filesUpdated = await moveFiles(index);
      completedTasks.push({ filesMoved: filesUpdated, task: await getTask(index) });
    }
    index++;
  }

  console.log("COMPLETE TASKS", completedTasks);

  return completedTasks;
}
