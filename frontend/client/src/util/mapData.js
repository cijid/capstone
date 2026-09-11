export function reportToMapReport(report) {
  return {
    id: report.id,

    name: report.name,

    locationId: report.location_id,

    spaceCapabilityId: report.space_capability_id,

    capabilityName:
      report.space_capability?.name ?? report.spaceCapability?.name ?? null,

    status: Number(report.status ?? 0),

    severity: Number(report.severity ?? 0),

    confidence: Number(report.confidence ?? 0),

    description: report.description ?? "",

    recommendedAction: report.recommended_action ?? "",

    userSubmitted: report.user_submitted ?? "",

    startTime: report.start_time ?? null,

    endTime: report.end_time ?? null,

    original: report,
  };
}

export function locationToMapLocation(location) {
  return {
    id: location.id,

    name: location.name,

    longitude: Number(location.x_coord),

    latitude: Number(location.y_coord),

    altitude: 0,

    lineOfSight: Number(location.line_of_sight ?? 0),

    radius: Number(location.radius ?? 0),

    reports: [],

    capabilities: [],
  };
}

export function dependencyToMapDependency(dependency, spaceCapabilities) {
  const capability = spaceCapabilities.find(
    (spaceCapability) => spaceCapability.id === dependency.space_capability_id,
  );

  return {
    id: dependency.id,

    locationId: dependency.location_id,

    spaceCapabilityId: dependency.space_capability_id,

    name:
      capability?.name ??
      dependency.space_capability?.name ??
      "Unknown Capability",

    required: dependency.required,

    priority: dependency.priority,

    capability: capability ?? dependency.space_capability ?? null,
  };
}

export function orbitalAssetToMapAsset(asset) {
  return {
    id: asset.id,

    name: asset.name,

    noradId: Number(asset.norad_id),

    tleLine1: asset.tle_line1,

    tleLine2: asset.tle_line2,

    active: asset.active ?? true,

    tleSource: asset.tle_source ?? "database",

    tleCurrent: asset.tle_current ?? false,

    capabilities: [],

    original: asset,
  };
}

export function orbitalAssetCapabilityToMapCapability(
  relationship,
  spaceCapabilities,
) {
  const capability = spaceCapabilities.find(
    (spaceCapability) =>
      spaceCapability.id === relationship.space_capability_id,
  );

  return {
    id: relationship.id,

    orbitalAssetId: relationship.orbital_asset_id,

    spaceCapabilityId: relationship.space_capability_id,

    name:
      capability?.name ??
      relationship.space_capability?.name ??
      "Unknown Capability",

    capability: capability ?? relationship.space_capability ?? null,

    original: relationship,
  };
}

export function joinReportsToLocations(locations, reports) {
  return locations.map((location) => {
    const locationReports = reports.filter(
      (report) => report.locationId === location.id,
    );

    return {
      ...location,

      reports: locationReports,
    };
  });
}

export function joinCapabilitiesToLocations(locations, dependencies) {
  return locations.map((location) => {
    const capabilities = dependencies.filter(
      (dependency) => dependency.locationId === location.id,
    );

    return {
      ...location,

      capabilities,
    };
  });
}

export function joinCapabilitiesToOrbitalAssets(orbitalAssets, relationships) {
  return orbitalAssets.map((orbitalAsset) => {
    const capabilities = relationships.filter(
      (relationship) => relationship.orbitalAssetId === orbitalAsset.id,
    );

    return {
      ...orbitalAsset,

      capabilities,
    };
  });
}

export function getLocationSeverity(location) {
  if (!location?.reports?.length) {
    return 0;
  }

  return Math.max(
    ...location.reports.map((report) => Number(report.severity ?? 0)),
  );
}

export function getSupportingAssets(capabilityId, orbitalAssets) {
  return orbitalAssets.filter((asset) =>
    asset.capabilities?.some(
      (capability) => capability.spaceCapabilityId === capabilityId,
    ),
  );
}

export function getRequiredCapabilities(location) {
  return (
    location?.capabilities?.filter((capability) => capability.required) ?? []
  );
}

export function getSupportingAssetsForLocation(location, orbitalAssets) {
  if (!location) {
    return [];
  }

  const requiredCapabilityIds =
    location.capabilities?.map((capability) => capability.spaceCapabilityId) ??
    [];

  return orbitalAssets.filter((asset) =>
    asset.capabilities?.some((capability) =>
      requiredCapabilityIds.includes(capability.spaceCapabilityId),
    ),
  );
}

export function getMatchingCapabilities(location, orbitalAsset) {
  if (!location || !orbitalAsset) {
    return [];
  }

  const locationCapabilityIds =
    location.capabilities?.map((capability) => capability.spaceCapabilityId) ??
    [];

  return (
    orbitalAsset.capabilities?.filter((capability) =>
      locationCapabilityIds.includes(capability.spaceCapabilityId),
    ) ?? []
  );
}

export function assetProvidesCapability(orbitalAsset, capabilityId) {
  return (
    orbitalAsset?.capabilities?.some(
      (capability) => capability.spaceCapabilityId === capabilityId,
    ) ?? false
  );
}
