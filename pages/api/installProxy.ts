import { NextApiRequest, NextApiResponse } from "next";
import { installProxy } from "../../server/folders/moveFiles";

async function post(req: NextApiRequest, res: NextApiResponse) {
  await installProxy();

  res.status(200).json({
    settings,
  });
}

export default async function settings(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    await post(req, res);
  }
}
