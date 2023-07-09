export type VehicleMake = {
  data: {
    id: String;
    type: String;
    attributes: {
      name: String;
      number_of_models: Number;
    };
  };
};

export type VehicleModel = {
  data: {
    id: String;
    type: String;
    attributes: {
      name: String;
      year: Number;
      vehicle_make: String;
    };
  };
};
