import { NextApiRequest, NextApiResponse } from "next";
import { getTasks, setTasks } from "../../../server/db/tasks";

async function get(req: NextApiRequest, res: NextApiResponse) {
  const tasks = await getTasks();

  res.status(200).json(tasks);
}

async function post(req: NextApiRequest, res: NextApiResponse) {
  const task = req.body;

  await setTasks(task);

  res.status(200).json(await getTasks());
}

export default async function tasks(req: NextApiRequest, res: NextApiResponse) {
  console.log("TASK INDEX", req);
  if (req.method === "GET") {
    await get(req, res);
  } else if (req.method === "POST") {
    await post(req, res);
  }
}
