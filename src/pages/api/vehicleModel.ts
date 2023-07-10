// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { VehicleModel } from "@/types/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "process";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("key: ", process.env.CARBON_API_KEY);
  const { makeId } = req.query;
  const data = await fetch(
    `https://www.carboninterface.com/api/v1/vehicle_makes/${makeId}/vehicle_models`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CARBON_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    }
  );
  const responseData = await data.json();

  res.status(data.status).send(responseData);
}
