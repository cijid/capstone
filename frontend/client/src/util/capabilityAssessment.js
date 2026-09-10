import { getNextCapabilityCoverage } from "./satellitePosition";

export function getCapabilityReports(capabilityId, location) {
  if (!location?.reports) {
    return [];
  }

  return location.reports.filter(
    (report) => report.spaceCapabilityId === capabilityId,
  );
}

export function getCapabilityAssets(capabilityId, satellites) {
  if (!satellites) {
    return [];
  }

  return satellites.filter((satellite) =>
    satellite.capabilities?.some(
      (capability) => capability.spaceCapabilityId === capabilityId,
    ),
  );
}

export function getVisibleCapabilityAssets(capabilityId, satellites) {
  return getCapabilityAssets(capabilityId, satellites).filter(
    (satellite) => satellite.visible,
  );
}

export function assessCapability({
  dependency,
  location,
  satellites,
  now = new Date(),
}) {
  if (!dependency) {
    return {
      status: "UNKNOWN",
      reason: "Capability dependency information is unavailable.",
      supportingAssets: [],
      visibleAssets: [],
      reports: [],
      highestSeverity: 0,
      nextCoverage: null,
    };
  }

  const supportingAssets = getCapabilityAssets(
    dependency.spaceCapabilityId,
    satellites,
  );

  const visibleAssets = supportingAssets.filter(
    (satellite) => satellite.visible,
  );

  const reports = getCapabilityReports(dependency.spaceCapabilityId, location);

  const activeReports = reports.filter((report) => !report.endTime);

  const highestSeverity =
    activeReports.length > 0
      ? Math.max(...activeReports.map((report) => Number(report.severity ?? 0)))
      : 0;

  if (highestSeverity >= 4) {
    return {
      status: "UNAVAILABLE",

      reason: "An active critical report indicates loss of this capability.",

      supportingAssets,
      visibleAssets,
      reports: activeReports,
      highestSeverity,
      nextCoverage: null,
    };
  }

  if (highestSeverity >= 2) {
    return {
      status: "DEGRADED",

      reason: "An active report indicates degraded capability performance.",

      supportingAssets,
      visibleAssets,
      reports: activeReports,
      highestSeverity,
      nextCoverage: null,
    };
  }

  if (supportingAssets.length === 0) {
    return {
      status: "UNKNOWN",

      reason:
        "No orbital assets are currently mapped as providers of this capability.",

      supportingAssets,
      visibleAssets,
      reports: activeReports,
      highestSeverity,
      nextCoverage: null,
    };
  }

  if (visibleAssets.length === 0) {
    const nextCoverage = getNextCapabilityCoverage(supportingAssets, location, {
      startDate: now,
      minimumElevation: 10,
      searchHours: 24,
      stepSeconds: 30,
    });

    return {
      status: "NO COVERAGE",

      reason:
        "Mapped orbital assets exist, but none currently meet the modeled visibility threshold.",

      supportingAssets,
      visibleAssets,
      reports: activeReports,
      highestSeverity,
      nextCoverage,
    };
  }

  return {
    status: "AVAILABLE",

    reason:
      "At least one mapped supporting asset currently meets the visibility threshold and no active degradation report is present.",

    supportingAssets,
    visibleAssets,
    reports: activeReports,
    highestSeverity,
    nextCoverage: null,
  };
}

export function assessLocationCapabilities(
  location,
  satellites,
  now = new Date(),
) {
  if (!location?.capabilities) {
    return [];
  }

  return location.capabilities.map((dependency) => ({
    dependency,

    assessment: assessCapability({
      dependency,
      location,
      satellites,
      now,
    }),
  }));
}

export function assessLocationMission(capabilityAssessments) {
  if (!capabilityAssessments || capabilityAssessments.length === 0) {
    return {
      status: "UNKNOWN",

      reason: "No capability dependencies are defined for this location.",

      total: 0,
      available: 0,
      degraded: 0,
      noCoverage: 0,
      unavailable: 0,
      unknown: 0,
    };
  }

  const requiredAssessments = capabilityAssessments.filter(
    ({ dependency }) => dependency.required,
  );

  const assessments =
    requiredAssessments.length > 0
      ? requiredAssessments
      : capabilityAssessments;

  const counts = {
    available: 0,
    degraded: 0,
    noCoverage: 0,
    unavailable: 0,
    unknown: 0,
  };

  assessments.forEach(({ assessment }) => {
    switch (assessment.status) {
      case "AVAILABLE":
        counts.available += 1;
        break;

      case "DEGRADED":
        counts.degraded += 1;
        break;

      case "NO COVERAGE":
        counts.noCoverage += 1;
        break;

      case "UNAVAILABLE":
        counts.unavailable += 1;
        break;

      default:
        counts.unknown += 1;
    }
  });

  let status = "AVAILABLE";

  let reason = "All modeled required capabilities are currently available.";

  if (counts.unavailable > 0) {
    status = "MISSION IMPACT";

    reason =
      counts.unavailable === 1
        ? "1 required capability is reported unavailable."
        : `${counts.unavailable} required capabilities are reported unavailable.`;
  } else if (counts.degraded > 0) {
    status = "DEGRADED";

    reason =
      counts.degraded === 1
        ? "1 required capability is currently degraded."
        : `${counts.degraded} required capabilities are currently degraded.`;
  } else if (counts.noCoverage > 0) {
    status = "COVERAGE GAP";

    reason =
      counts.noCoverage === 1
        ? "1 required capability currently has no modeled orbital coverage."
        : `${counts.noCoverage} required capabilities currently have no modeled orbital coverage.`;
  } else if (counts.unknown > 0) {
    status = "UNKNOWN";

    reason =
      counts.unknown === 1
        ? "1 required capability cannot currently be assessed."
        : `${counts.unknown} required capabilities cannot currently be assessed.`;
  }

  return {
    status,
    reason,
    total: assessments.length,
    ...counts,
  };
}
