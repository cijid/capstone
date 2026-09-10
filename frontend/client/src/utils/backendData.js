export function getStatusLabel(status) {
  const statusCode = String(status);

  const statusLabels = {
    1: "Active",
    2: "Active",
    3: "Monitoring",
    4: "Resolved",
  };

  return statusLabels[statusCode] || "Unknown";
}

export function getCapabilityCategory(capabilityId) {
  if (!capabilityId) {
    return "Unknown";
  }

  const id = capabilityId.toUpperCase();

  if (id.includes("SATCOM")) {
    return "SATCOM";
  }

  if (id.includes("PNT")) {
    return "PNT";
  }

  if (
    id.includes("MW") ||
    id.includes("MT") ||
    id.includes("MISSILE")
  ) {
    return "MW/MT";
  }

  return "Unknown";
}

export function transformReport(report) {
  const category = getCapabilityCategory(
    report.space_capability_id
  );

  return {
    id: report.id,

    title: report.name,

    capability:
      report.space_capability?.name ||
      report.space_capability_id ||
      "Unknown Capability",

    capabilityId: report.space_capability_id,

    capabilityCategory: category,

    status: getStatusLabel(report.status),
    statusCode: report.status,

    location:
      report.location?.name ||
      "Unknown Location",

    locationData: report.location || null,

    severity: report.severity,
    confidence: report.confidence,

    description: report.description,

    recommendedAction:
      report.recommended_action,

    startTime: report.start_time,
    endTime: report.end_time,

    userSubmitted:
      report.user_submitted,
  };
}

export function transformCapability(capability) {
  return {
    id: capability.id,
    name: capability.name,

    category: getCapabilityCategory(
      capability.id
    ),

    informationalAwareness:
      capability.informational_awareness || null,

    locations:
      capability.location || [],
  };
}