import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const fromQuery = req.query.secret;
  const fromEnv = process.env.MY_SECRET_TOKEN;
  if (fromQuery != fromEnv) {
    return res.status(401).json({ message: "Invalid token" });
  }
  try {
    const path = req.query.path as string;

    await res.revalidate(path);
    return res.json({ revalidated: true });
  } catch (e) {
    return res.status(500).send("Error revalidating");
  }
}
