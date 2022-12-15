import { NextApiRequest, NextApiResponse } from "next";
import { getSettings, setSettings } from "../../server/db/settings";
import { getFolders } from "../../server/folders/getFolders";
import { getVolumes } from "../../server/folders/volumes";

async function get(req: NextApiRequest, res: NextApiResponse) {
  const volumes = getVolumes();
  const settings = await getSettings();

  res.status(200).json({
    ...settings,
    source: await getFolders(volumes.source),
    target: await getFolders(volumes.target),
  });
}

async function post(req: NextApiRequest, res: NextApiResponse) {
  const settings = req.body;

  await setSettings(settings);

  res.status(200).json({
    settings,
  });
}

export default async function hello(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    await get(req, res);
  } else if (req.method === "POST") {
    await post(req, res);
  }
}
