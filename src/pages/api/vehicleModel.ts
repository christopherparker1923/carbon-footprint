// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ReformatModels, VehicleModel } from "@/types/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sortReformatModelsByModel = (
    reformatModels: ReformatModels
  ): ReformatModels => {
    const sortedReformatModels: ReformatModels = {};

    const sortedModels = Object.keys(reformatModels).sort((modelA, modelB) =>
      modelA.localeCompare(modelB)
    );

    sortedModels.forEach((model) => {
      sortedReformatModels[model] = reformatModels[model];
    });

    return sortedReformatModels;
  };
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
  const processData: VehicleModel[] = await data.json();
  const refactoredData: ReformatModels = {};

  processData.forEach((make) => {
    if (refactoredData[make.data.attributes.name]) {
      refactoredData[make.data.attributes.name][make.data.attributes.year] =
        make.data.id;
    } else {
      refactoredData[make.data.attributes.name] = {
        [make.data.attributes.year]: make.data.id,
      };
    }
  });

  const responseData = sortReformatModelsByModel(refactoredData);
  res.status(data.status).send(responseData);
}
