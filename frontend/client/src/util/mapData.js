export function locationToMapLocation(location) {
  return {
    id: location.id,

    name: location.name,

    latitude: Number(location.y_coord),

    longitude: Number(location.x_coord),

    altitude: Number(location.altitude ?? 0),

    radius: location.radius !== undefined ? Number(location.radius) : null,

    lineOfSight:
      location.line_of_sight !== undefined
        ? Number(location.line_of_sight)
        : null,
  };
}

export function reportToMapReport(report) {
  return {
    id: report.id,

    locationId: report.location_id,

    capabilityId: report.space_capability_id,

    status: report.status,

    description: report.description,

    createdAt: report.created_at,

    updatedAt: report.updated_at,

    original: report,
  };
}
