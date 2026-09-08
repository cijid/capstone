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
        location: "Training Area Alpha",
        description: "GPS accuracy degraded",
        recommendedAction: "Execute PNT PACE",
        startTime: "2026-05-01T09:30",
        endTime: "",
    },
];