import { NextApiRequest, NextApiResponse } from "next";
import {
  checkProxyConnection,
  installProxy,
} from "../../server/folders/moveFiles";

async function get(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    isProxyActive: await checkProxyConnection(),
  });
}

export default async function isProxyActive(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    await get(req, res);
  }
}
