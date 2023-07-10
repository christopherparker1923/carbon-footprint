import {
  ReformatModels,
  SelectedCar,
  VehicleEstimate,
  VehicleMake,
  VehicleModel,
} from "@/types/types";
import { Inter } from "next/font/google";
import { useState, useEffect, Fragment, Key } from "react";
import { Listbox, Transition, RadioGroup } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Slider } from "@/components/SliderOut";
//import { ArrowUp } from "@SvgList";

// TODO submit hard and fast -> server side error handling in case of API down or similar
// add forest picture in background
// radio buttons for km/mi
// add a proper header component
// add flights
// make the main area look less bad (blocky); maybe a subtle gradient
// add notifications
// add required messages for missing fields
// add constant for 2* AVG_CO2_KG
// add variable for estimatee return value
// refactor state
// refatcor components
// use loadings to add loading circles

const AVG_CO2_KG = 4600;

export default function Home() {
  const [vehicleMakes, setVehicleMakes] = useState<VehicleMake[]>();
  const [vehicleModels, setVehicleModels] = useState<ReformatModels>();
  const [vehicleEstimate, setVehicleEstimate] = useState<VehicleEstimate>();
  const [isMakeLoading, setMakeLoading] = useState(false);
  const [isModelLoading, setModelLoading] = useState(false);
  const [isVehicleEstimateLoading, setVehicleEstimateLoading] = useState(false);
  const [selectedMake, setSelectedMake] = useState<VehicleMake>();
  const [selectedModel, setSelectedModel] = useState<string>();
  const [selectedYear, setSelectedYear] = useState<string>();
  const [mileage, setMileage] = useState(0);
  //const form = document.querySelector("form");
  //const mileageInput = document.querySelector<HTMLInputElement>("#mileage");

  //Get all make data
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        setMakeLoading(true);
        const response = await fetch("/api/vehicleMakes");
        const data = await response.json();
        setVehicleMakes(data);
        setMakeLoading(false);
        console.log("makes", data);
        console.log("vehicleMakes", vehicleMakes);
      } catch (error) {
        console.log("GET Make error: ", error);
      }
    };

    fetchMakes();
  }, []);

  //Get models by makeId
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setModelLoading(true);
        const response = await fetch(
          `/api/vehicleModel?makeId=${selectedMake?.data.id}`
        );
        const data = await response.json();
        setVehicleModels(data);
        setModelLoading(false);
        console.log("models", data);
        console.log("vehicleModels", vehicleMakes);
      } catch (error) {
        console.log("GET Model error: ", error);
      }
    };
    if (selectedMake) fetchModels();
  }, [selectedMake]);

  //Get vehicle estimate
  const fetchVehicleEstimate = async () => {
    if (!mileage || !selectedModel || !vehicleModels || !selectedYear) return;
    const requestBody = {
      type: "vehicle",
      distance_unit: "km",
      distance_value: mileage,
      vehicle_model_id: vehicleModels[selectedModel][selectedYear],
    };

    console.log(
      "fetchVehicleEstimate",
      requestBody.type,
      requestBody.distance_unit,
      requestBody.distance_value,
      requestBody.vehicle_model_id
    );
    try {
      setVehicleEstimateLoading(true);
      const response = await fetch(`/api/vehicleEstimate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      setVehicleEstimate(data);
      setVehicleEstimateLoading(false);
      console.log("estimate", data);
      console.log("vehicleEstimate", vehicleEstimate);
    } catch (error) {
      console.log("POST Vehicle error: ", error);
    }
  };

  // Get flight estimate TODO all this
  // const fetchFlightEstimate = async () => {
  //   const requestBody = {
  //     type: "vehicle",
  //     distance_unit: "km",
  //     distance_value: "100", //TODO replace with front end input
  //     vehicle_model_id: "7268a9b7-17e8-4c8d-acca-57059252afe9", //TODO replace
  //   };
  //   try {
  //     setVehicleEstimateLoading(true);
  //     const response = await fetch(`/api/vehicleEstimate`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(requestBody),
  //     });
  //     const data = await response.json();
  //     setVehicleEstimate(data);
  //     setVehicleEstimateLoading(false);
  //     console.log("estimate", data);
  //     console.log("vehicleEstimate", vehicleEstimate);
  //   } catch (error) {
  //     console.log(error);
  //     // Handle error
  //   }
  // };

  if (isMakeLoading) return <p>Loading...</p>;
  if (!vehicleMakes) return <p>No profile data</p>;
  console.log("selected make: ", selectedMake);
  console.log("makes after load:", vehicleMakes);
  console.log("models after load: ", vehicleModels);
  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-center text-black dark:text-white  w-full h-10 bg-slate-400 dark:bg-slate-900 shadow-md">
        <h1>Carbon Footprint Calculator</h1>
      </header>
      <main className="flex-grow">
        <div className="grid grid-cols-1 lg:flex h-full">
          <div className=" hidden lg:block bg-green-100 dark:bg-green-950 p-4 w-40" />
          <div className="bg-green-50 dark:bg-slate-800 p-4 flex-grow">
            <form
              className="bg-transparent rounded px-8 pt-6 pb-8 mb-4"
              onSubmit={(e) => {
                e.preventDefault();
                fetchVehicleEstimate();
              }}
            >
              <div>
                <Listbox
                  value={selectedMake}
                  onChange={(e) => {
                    setSelectedYear("");
                    setSelectedModel("");
                    setVehicleModels({});
                    setSelectedMake(e);
                  }}
                >
                  {({ open }) => (
                    <>
                      <Listbox.Label className="block text-sm font-medium leading-6 text-slate-700 dark:text-slate-300">
                        Vehicle Make
                      </Listbox.Label>
                      <div className="relative mt-2">
                        <Listbox.Button className="dark:bg-slate-200 h-10 relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                          <span className="flex items-center">
                            <span className="ml-3 block truncate">
                              {selectedMake?.data.attributes.name}
                            </span>
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>

                        <Transition
                          show={open}
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {vehicleMakes.map((make) => (
                              <Listbox.Option
                                key={make.data.id as Key}
                                className={({ active }) =>
                                  `${
                                    active
                                      ? "bg-indigo-600 text-white"
                                      : "text-gray-900"
                                  } relative cursor-default select-none py-2 pl-3 pr-9`
                                }
                                value={make}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <div className="flex items-center">
                                      <span
                                        className={`${
                                          selected
                                            ? "font-semibold"
                                            : "font-normal"
                                        } ml-3 block truncate`}
                                      >
                                        {make.data.attributes.name}
                                      </span>
                                    </div>

                                    {selected ? (
                                      <span
                                        className={`${
                                          active
                                            ? "text-white"
                                            : "text-indigo-600"
                                        } absolute inset-y-0 right-0 flex items-center pr-4`}
                                      >
                                        <CheckIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </>
                  )}
                </Listbox>
              </div>
              {selectedMake && vehicleModels && (
                <div>
                  <Listbox
                    value={selectedModel}
                    onChange={(e) => {
                      setSelectedYear("");
                      setSelectedModel(e);
                    }}
                  >
                    {({ open }) => (
                      <>
                        <Listbox.Label className="block text-sm font-medium leading-6 text-slate-700 dark:text-slate-300">
                          Vehicle Model
                        </Listbox.Label>
                        <div className="relative mt-2">
                          <Listbox.Button className="dark:bg-slate-200 h-10 relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                            <span className="flex items-center">
                              <span className="ml-3 block truncate">
                                {selectedModel ? selectedModel : ""}
                              </span>
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                              <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </span>
                          </Listbox.Button>

                          <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {Object.keys(vehicleModels).map((model) => (
                                <Listbox.Option
                                  key={model as Key}
                                  className={({ active }) =>
                                    `${
                                      active
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-900"
                                    } relative cursor-default select-none py-2 pl-3 pr-9`
                                  }
                                  value={model}
                                >
                                  {({ selected, active }) => (
                                    <>
                                      <div className="flex items-center">
                                        <span
                                          className={`${
                                            selected
                                              ? "font-semibold"
                                              : "font-normal"
                                          } ml-3 block truncate`}
                                        >
                                          {model}
                                        </span>
                                      </div>

                                      {selected ? (
                                        <span
                                          className={`${
                                            active
                                              ? "text-white"
                                              : "text-indigo-600"
                                          } absolute inset-y-0 right-0 flex items-center pr-4`}
                                        >
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Listbox>
                </div>
              )}
              {selectedModel && vehicleModels && (
                <div>
                  <Listbox value={selectedYear} onChange={setSelectedYear}>
                    {({ open }) => (
                      <>
                        <Listbox.Label className="block text-sm font-medium leading-6 text-slate-700 dark:text-slate-300">
                          Vehicle Year
                        </Listbox.Label>
                        <div className="relative mt-2">
                          <Listbox.Button className="dark:bg-slate-200 h-10 relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                            <span className="flex items-center">
                              <span className="ml-3 block truncate">
                                {selectedYear ? selectedYear : ""}
                              </span>
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                              <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </span>
                          </Listbox.Button>

                          <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {Object.keys(vehicleModels[selectedModel]).map(
                                (year) => (
                                  <Listbox.Option
                                    key={year as Key}
                                    className={({ active }) =>
                                      `${
                                        active
                                          ? "bg-indigo-600 text-white"
                                          : "text-gray-900"
                                      } relative cursor-default select-none py-2 pl-3 pr-9`
                                    }
                                    value={year}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <div className="flex items-center">
                                          <span
                                            className={`${
                                              selected
                                                ? "font-semibold"
                                                : "font-normal"
                                            } ml-3 block truncate`}
                                          >
                                            {year}
                                          </span>
                                        </div>

                                        {selected ? (
                                          <span
                                            className={`${
                                              active
                                                ? "text-white"
                                                : "text-indigo-600"
                                            } absolute inset-y-0 right-0 flex items-center pr-4`}
                                          >
                                            <CheckIcon
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                )
                              )}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Listbox>
                </div>
              )}
              <div className="mb-4">
                <label
                  className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2"
                  form="username"
                >
                  Annual Mileage (kms)
                </label>
                <input
                  className="shadow appearance-none border dark:bg-slate-200 text-black  rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  id="mileage"
                  form="mileage"
                  type="number"
                  placeholder="mileage"
                  value={mileage}
                  onChange={(e) => {
                    setMileage(parseInt(e.target.value));
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Submit
                </button>
              </div>
              {vehicleEstimate && (
                <div className="mt-5 relative">
                  <p>
                    {`Your annual carbon emissions are: ${vehicleEstimate?.data.attributes.carbon_kg} kg`}
                  </p>
                  <Slider
                    className="bg-gradient-to-r"
                    value={[vehicleEstimate.data.attributes.carbon_kg]}
                    min={0}
                    max={
                      vehicleEstimate.data.attributes.carbon_kg > AVG_CO2_KG * 2
                        ? vehicleEstimate.data.attributes.carbon_kg
                        : AVG_CO2_KG * 2
                    }
                  />
                  <div
                    style={{
                      left:
                        vehicleEstimate.data.attributes.carbon_kg >
                        AVG_CO2_KG * 2
                          ? `${Math.round(
                              (AVG_CO2_KG /
                                vehicleEstimate.data.attributes.carbon_kg) *
                                100
                            )}%`
                          : "50%",
                    }}
                    className={`absolute flex flex-col`}
                  >
                    <span>^</span>
                    <span className="relative right-1/2 ">{`Average: ${AVG_CO2_KG} kg`}</span>
                  </div>
                </div>
              )}
            </form>
            <p className="text-center text-gray-500 p-4 text-xs">
              &copy;2023 CParker. All rights reserved. Powered by Carbon
              Interface
            </p>
          </div>
          <div className="hidden lg:block bg-green-100 dark:bg-green-950 p-4 w-40" />
        </div>
      </main>
    </div>
  );
}
