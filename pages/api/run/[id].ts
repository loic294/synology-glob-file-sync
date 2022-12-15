import { NextApiRequest, NextApiResponse } from "next";
import { getTasks, setTasks } from "../../../server/db/tasks";
import { moveFiles } from "../../../server/folders/moveFiles";
import { findFiles } from "../../../server/task/findFiles";

async function get(req: NextApiRequest, res: NextApiResponse) {
  const index = req.query.id as unknown as number;
  const files = await findFiles(index);

  res.status(200).json(files);
}

async function post(req: NextApiRequest, res: NextApiResponse) {
  const index = req.query.id as unknown as number;

  const files = await moveFiles(index);

  res.status(200).json(files);
}

export default async function tasks(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    await get(req, res);
  } else if (req.method === "POST") {
    await post(req, res);
  }
}
