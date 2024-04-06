// https://<your-site.com>/api/revalidate?secret=<token>
// http://localhost/api/revalidate?secret=MySecretPassword
// http://localhost/api/revalidate?path=/&secret=MySecretPassword //add more path for this

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const fromQuery = req.query.secret;
  const fromEnv = process.env.MY_SECRET_TOKEN;
  if (fromQuery != fromEnv) {
    console.log(process.env.MY_SECRET_TOKEN);
    console.log(req.query.secret);
    return res.status(401).json({ message: "Invalid token" });
  }

  const path = req.query.path as string;

  await res.revalidate(path);
  return res.json({ revalidated: true });
}
