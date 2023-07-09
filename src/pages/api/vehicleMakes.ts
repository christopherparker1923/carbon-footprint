// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "process";

//config();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("key: ", process.env.CARBON_API_KEY);
  const data = await fetch(
    "https://www.carboninterface.com/api/v1/vehicle_makes",
    {
      // body: JSON.stringify({
      //   // type: req.body.type,
      //   // distance_unit: req.body.distance_unit,
      //   // distance_value: req.body.distance_value,
      //   // vehicle_model_id: req.body.vehicle_model_id,
      // }),
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
