export const capabilities = [
  {
    id: 1,
    name: "PNT",
    status: "Degraded",
    activeEffects: 1,
  },
  {
    id: 2,
    name: "SATCOM",
    status: "Available",
    activeEffects: 0,
  },
  {
    id: 3,
    name: "MW/MT",
    status: "Available",
    activeEffects: 0,
  },
];

export const effects = [
  {
    id: 1,
    capability: "PNT",
    title: "PNT Interference",
    status: "Active",
    severity: "High",
    confidence: "High",
    location: "Training Area Alpha",
    description: "GPS accuracy degraded",
    recommendedAction: "Execute PNT PACE",
    startTime: "2026-05-01T09:30",
    endTime: "",
  },
];

export const mockSatellites = [
  {
    name: "ISS",
    noradId: 25544,
    tleLine1:
      "1 25544U 98067A   26249.72428942  .00004390  00000-0  87774-4 0  9994",
    tleLine2:
      "2 25544  51.6308 256.5398 0005013 114.0700 246.0813 15.49009087584391",
  },

  {
    name: "SO-50",
    noradId: 27607,
    tleLine1:
      "1 27607U 02058C   26249.33963231  .00000557  00000-0  83495-4 0  9990",
    tleLine2:
      "2 27607  64.5505 237.8704 0072473 247.5693 111.7726 14.83196424276494",
  },

  {
    name: "AO-91",
    noradId: 43017,
    tleLine1:
      "1 43017U 17073E   26249.60883797  .00005390  00000-0  22969-3 0  9992",
    tleLine2:
      "2 43017  97.4582 115.1617 0148955  47.6724 313.7015 15.13786057477704",
  },

  {
    name: "AO-07",
    noradId: 7530,
    tleLine1:
      "1 07530U 74089B   26249.62928978 -.00000035  00000-0  71293-4 0  9992",
    tleLine2:
      "2 07530 101.9922 263.7276 0012115 337.5402 141.8267 12.53699428370725",
  },

  {
    name: "FO-29",
    noradId: 24278,
    tleLine1:
      "1 24278U 96046B   26249.48922176 -.00000024  00000-0  14294-4 0  9991",
    tleLine2:
      "2 24278  98.5177  87.2160 0348918 245.3832 111.0589 13.53277695484162",
  },

  {
    name: "QO-100",
    noradId: 43700,
    tleLine1:
      "1 43700U 18090A   26249.66817531  .00000128  00000-0  00000 0 0  9992",
    tleLine2:
      "2 43700   0.0163 153.2658 0002545  51.2806  47.5400  1.00270612 28496",
  },
];

export const groundLocations = [
  {
    id: 1,
    name: "Colorado Springs",
    latitude: 38.8339,
    longitude: -104.8214,
    altitude: 0,
  },
];
