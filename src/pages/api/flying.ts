// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const data = await fetch("https://pokeapi.co/api/v2/pokemon/ditto").then(
    (res) => res.json()
  );

  res.status(200).json(data);
}
