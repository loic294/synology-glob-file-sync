import { NextApiRequest, NextApiResponse } from "next";
import { deleteTask, getTask, getTasks, updateTask } from "../../../server/db/tasks";

async function get(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as unknown as number;

  const task = await getTask(id);

  res.status(200).json(task);
}

async function put(req: NextApiRequest, res: NextApiResponse) {
  const task = req.body;
  const id = req.query.id as unknown as number;

  const updatedTask = await updateTask(id, task);

  res.status(200).json(updatedTask);
}

async function deleteMethod(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as unknown as number;

  const tasks = await deleteTask(id);

  res.status(200).json(tasks);
}

export default async function singleTask(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    await get(req, res);
  } else if (req.method === "POST") {
    await put(req, res);
  } else if (req.method === "DELETE") {
    await deleteMethod(req, res);
  }
}
