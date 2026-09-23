export const FACTORS = {
  electricityKwh: 0.708,
  petrolLitre: 2.31,
  dieselLitre: 2.68,
  lpgKg: 3.0,
  solarCapacityFactor: 0.2,
  windCapacityFactor: 0.35,
} as const;

export const SOURCES = [
  "IPCC AR6 WGIII (2022), lifecycle emissions context",
  "IEA, Global Energy Review (2024), system context",
  "US EPA, Emission Factors for Greenhouse Gas Inventories (2024)",
  "Illustrative assumptions are versioned in this app for learning, not billing",
];

export const technologies = [
  { id: "solar", name: "Solar", color: "#FFB627", icon: "☼", tagline: "Photons → electrons", body: "Photovoltaic cells use semiconductor layers to release electrons when sunlight arrives. Output follows the sun and is strongest around midday." },
  { id: "wind", name: "Wind", color: "#00D9FF", icon: "↝", tagline: "Airflow → rotation", body: "Moving air turns blades, the rotor spins a generator, and power electronics shape the output for the grid." },
  { id: "hydro", name: "Hydropower", color: "#10B981", icon: "≈", tagline: "Water height → torque", body: "Stored elevation becomes moving water. A turbine converts that flow into rotational energy with dispatchable timing." },
  { id: "biomass", name: "Biomass", color: "#84CC16", icon: "❋", tagline: "Organic matter → heat", body: "Plant or waste material can be converted to heat, biogas, or liquid fuels. Sustainable feedstock is the key constraint." },
  { id: "geothermal", name: "Geothermal", color: "#F43F5E", icon: "⌁", tagline: "Earth heat → steam", body: "Heat from below the surface can drive a turbine or warm buildings. Location and drilling conditions shape feasibility." },
  { id: "hydrogen", name: "Green hydrogen", color: "#A855F7", icon: "H₂", tagline: "Electricity → stored molecule", body: "An electrolyser splits water using electricity. Hydrogen can store energy for long periods, but conversion losses matter." },
  { id: "tidal", name: "Tidal power", color: "#38BDF8", icon: "≋", tagline: "Tides → predictable flow", body: "Tidal range and currents offer unusually predictable renewable power, though marine construction and ecology require care." },
] as const;

export const gameRules = {
  solar: { cost: 12, capacity: 18, emissions: 1, reliability: 55 },
  wind: { cost: 15, capacity: 22, emissions: 1, reliability: 60 },
  coal: { cost: 20, capacity: 34, emissions: 28, reliability: 92 },
  battery: { cost: 10, capacity: 12, emissions: 0, reliability: 72 },
} as const;

export type GameBuild = keyof typeof gameRules;