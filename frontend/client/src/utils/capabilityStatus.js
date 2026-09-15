export const capabilityCategories = [
  { id: "PNT", name: "PNT" },
  { id: "SATCOM", name: "SATCOM" },
  { id: "MW-MT", name: "MW/MT" },
];

function makesUnavailable(effect) {
  const severity = String(effect.severity ?? "").toLowerCase();

  return (
    ["critical", "catastrophic", "4", "5"].includes(severity) ||
    Number(effect.severity) >= 4
  );
}

export function calculateCapabilityStatuses(effects) {
  return capabilityCategories.map((capability) => {
    const activeEffects = effects.filter(
      (effect) =>
        effect.capabilityCategory === capability.name &&
        effect.status === "Active",
    );

    return {
      ...capability,
      activeEffects: activeEffects.length,
      status: activeEffects.some(makesUnavailable)
        ? "Unavailable"
        : activeEffects.length > 0
          ? "Degraded"
          : "Operational",
    };
  });
}