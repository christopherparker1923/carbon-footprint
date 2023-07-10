// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { VehicleMake } from "@/types/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sortVehicleMakesById = (vehicleMakes: VehicleMake[]): VehicleMake[] => {
    return vehicleMakes.slice().sort((a, b) => {
      if (a.data.attributes.name < b.data.attributes.name) {
        return -1;
      }
      if (a.data.attributes.name > b.data.attributes.name) {
        return 1;
      }
      return 0;
    });
  };
  console.log("key: ", process.env.CARBON_API_KEY);
  const data = await fetch(
    "https://www.carboninterface.com/api/v1/vehicle_makes",
    {
      headers: {
        Authorization: `Bearer ${process.env.CARBON_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    }
  );

  const responseData = sortVehicleMakesById(await data.json());
  res.status(data.status).send(responseData);
}
