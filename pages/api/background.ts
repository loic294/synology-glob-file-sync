import { NextApiRequest, NextApiResponse } from "next";
import { initWatcher } from "../../server/watcher/background";

export default async function background(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    await initWatcher();
  }
}
