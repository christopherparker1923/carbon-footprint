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

export type VehicleEstimate = {
  data: {
    id: String;
    type: String;
    attributes: {
      distance_value: Number;
      vehicle_make: String;
      vehicle_model: String;
      vehicle_year: Number;
      vehicle_model_id: String;
      distance_unit: String;
      estimated_at: String;
      carbon_g: Number;
      carbon_lb: Number;
      carbon_kg: Number;
      carbon_mt: Number;
    };
  };
};
