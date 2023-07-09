import { VehicleEstimate, VehicleMake, VehicleModel } from "@/types/types";
import { Inter } from "next/font/google";
import { useState, useEffect, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

// const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [vehicleMakes, setVehicleMakes] = useState<VehicleMake[]>([]);
  const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>([]);
  const [vehicleEstimate, setVehicleEstimate] = useState<VehicleEstimate[]>([]);
  const [isMakeLoading, setMakeLoading] = useState(false);
  const [isModelLoading, setModelLoading] = useState(false);
  const [isVehicleEstimateLoading, setVehicleEstimateLoading] = useState(false);
  const [selectedMake, setSelectedMake] = useState<VehicleMake>();
  const [selectedModel, setSelectedModel] = useState<VehicleModel>();

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
        console.log(error);
        // Handle error
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
        console.log(error);
        // Handle error
      }
    };
    if (selectedMake) fetchModels();
  }, [selectedMake]);

  //Get vehicle estimate
  const fetchVehicleEstimate = async () => {
    const requestBody = {
      type: "vehicle",
      distance_unit: "km",
      distance_value: "100", //TODO replace with front end input
      vehicle_model_id: "7268a9b7-17e8-4c8d-acca-57059252afe9", //TODO replace
    };
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
      console.log(error);
      // Handle error
    }
  };

  //Get flight estimate TODO all this
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

  //console.log(vehicleMakes);
  //<div>{data.base_experience}</div>;

  return (
    <div>hello</div>

    // <main>
    //   <header className="flex items-center justify-center text-black dark:text-white  w-full h-10 bg-slate-400 dark:bg-slate-900 shadow-md">
    //     <h1>Carbon Footprint Calculator</h1>
    //   </header>
    //   <body className="h-screen">
    //     <div className="grid grid-cols-1 lg:flex h-full">
    //       <div className=" hidden lg:block bg-green-100 dark:bg-green-950 p-4 w-40" />
    //       <div className="bg-green-50 dark:bg-slate-800 p-4 flex-grow">
    //         <form className="bg-transparent rounded px-8 pt-6 pb-8 mb-4">
    //           <div className="mb-4">
    //             <label
    //               className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2"
    //               form="username"
    //             >
    //               Username
    //             </label>
    //             <input
    //               className="shadow appearance-none border dark:bg-slate-200 text-black  rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
    //               id="username"
    //               type="text"
    //               placeholder="Username"
    //             />
    //           </div>
    //           <div className="mb-6">
    //             <label
    //               className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2"
    //               form="password"
    //             >
    //               Password
    //             </label>
    //             <input
    //               className="shadow appearance-none border rounded w-full py-2 px-3 dark:bg-slate-200 text-black mb-3 leading-tight focus:outline-none focus:shadow-outline"
    //               id="password"
    //               type="password"
    //               placeholder="******************"
    //             />
    //           </div>
    //           <div className="flex items-center justify-between">
    //             <button
    //               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    //               type="button"
    //             >
    //               Sign In
    //             </button>
    //             <a
    //               className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
    //               href="#"
    //             >
    //               Forgot Password?
    //             </a>
    //           </div>
    //         </form>
    //         <p className="text-center text-gray-500 text-xs">
    //           &copy;2023 CParker. All rights reserved. Powered by Carbon
    //           Interface
    //         </p>
    //       </div>
    //       <div className="hidden lg:block bg-green-100 dark:bg-green-950 p-4 w-40" />
    //     </div>
    //   </body>
    // </main>
  );
}

//             {/* <Listbox value={selectedMake} onChange={setSelectedMake}>
//               {({ open }) => (
//                 <>
//                   <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
//                     Assigned to
//                   </Listbox.Label>
//                   <div className="relative mt-2">
//                     <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
//                       <span className="flex items-center">
//                         <span className="ml-3 block truncate">
//                           {selectedMake?.data.attributes.name}
//                         </span>
//                       </span>
//                       <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
//                         <ChevronUpDownIcon
//                           className="h-5 w-5 text-gray-400"
//                           aria-hidden="true"
//                         />
//                       </span>
//                     </Listbox.Button>

//                     <Transition
//                       show={open}
//                       as={Fragment}
//                       leave="transition ease-in duration-100"
//                       leaveFrom="opacity-100"
//                       leaveTo="opacity-0"
//                     >
//                       <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
//                         {vehicleMakes.map((make) => (
//                           <Listbox.Option
//                             //key={make.data.id}
//                             className={({ active }) =>
//                               `${
//                                 active
//                                   ? "bg-indigo-600 text-white"
//                                   : "text-gray-900"
//                               } relative cursor-default select-none py-2 pl-3 pr-9`
//                             }
//                             value={make}
//                           >
//                             {({ selected, active }) => (
//                               <>
//                                 <div className="flex items-center">
//                                   <span
//                                     className={`${
//                                       selected
//                                         ? "font-semibold"
//                                         : "font-normal"
//                                     } ml-3 block truncate`}
//                                   >
//                                     {make.data.attributes.name}
//                                   </span>
//                                 </div>

//                                 {selected ? (
//                                   <span
//                                     className={`${
//                                       active
//                                         ? "text-white"
//                                         : "text-indigo-600"
//                                     } absolute inset-y-0 right-0 flex items-center pr-4`}
//                                   >
//                                     <CheckIcon
//                                       className="h-5 w-5"
//                                       aria-hidden="true"
//                                     />
//                                   </span>
//                                 ) : null}
//                               </>
//                             )}
//                           </Listbox.Option>
//                         ))}
//                       </Listbox.Options>
//                     </Transition>
//                   </div>
//                 </>
//               )}
//             </Listbox> */}
