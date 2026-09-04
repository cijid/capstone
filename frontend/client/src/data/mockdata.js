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
        severity: "High"
    }
]