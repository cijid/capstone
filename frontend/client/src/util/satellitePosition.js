import * as satellite from "satellite.js";

export function createSatrec(tleLine1, tleLine2) {
  return satellite.twoline2satrec(tleLine1, tleLine2);
}

export function getSatellitePosition(satrec, date = new Date()) {
  const positionAndVelocity = satellite.propagate(satrec, date);

  if (!positionAndVelocity.position) {
    return null;
  }

  const gmst = satellite.gstime(date);

  const geodetic = satellite.eciToGeodetic(positionAndVelocity.position, gmst);

  return {
    latitude: satellite.degreesLat(geodetic.latitude),

    longitude: satellite.degreesLong(geodetic.longitude),

    altitude: geodetic.height,
  };
}

export function getSatelliteEciPosition(satrec, date = new Date()) {
  const positionAndVelocity = satellite.propagate(satrec, date);

  if (!positionAndVelocity.position) {
    return null;
  }

  return positionAndVelocity.position;
}

export function latLonAltToVector3(
  latitude,
  longitude,
  altitude,
  earthRadius = 2,
) {
  const lat = latitude * (Math.PI / 180);

  const lon = longitude * (Math.PI / 180);

  const earthRadiusKm = 6371;

  const radius = earthRadius * (1 + altitude / earthRadiusKm);

  const x = radius * Math.cos(lat) * Math.cos(lon);

  const y = radius * Math.sin(lat);

  const z = -radius * Math.cos(lat) * Math.sin(lon);

  return [x, y, z];
}

export function eciToVector3(eciPosition, earthRadius = 2) {
  const earthRadiusKm = 6371;

  const scale = earthRadius / earthRadiusKm;

  return [eciPosition.x * scale, eciPosition.z * scale, -eciPosition.y * scale];
}

export function getEarthRotation(date = new Date()) {
  const gmst = satellite.gstime(date);

  return gmst;
}

export function earthFixedToInertialVector3(vector, earthRotation) {
  const [x, y, z] = vector;

  const cos = Math.cos(earthRotation);

  const sin = Math.sin(earthRotation);

  return [x * cos + z * sin, y, -x * sin + z * cos];
}

export function getSatelliteLookAngles(satrec, observer, date = new Date()) {
  const positionAndVelocity = satellite.propagate(satrec, date);

  if (!positionAndVelocity.position) {
    return null;
  }

  const gmst = satellite.gstime(date);

  const satelliteEcf = satellite.eciToEcf(positionAndVelocity.position, gmst);

  const observerGd = {
    latitude: observer.latitude * (Math.PI / 180),

    longitude: observer.longitude * (Math.PI / 180),

    height: observer.altitude || 0,
  };

  const lookAngles = satellite.ecfToLookAngles(observerGd, satelliteEcf);

  return {
    azimuth: lookAngles.azimuth * (180 / Math.PI),

    elevation: lookAngles.elevation * (180 / Math.PI),

    range: lookAngles.rangeSat,
  };
}

export function getCoverageAngularRadius(
  altitudeKm,
  minimumElevationDegrees = 10,
) {
  const earthRadiusKm = 6371;

  const satelliteRadius = earthRadiusKm + altitudeKm;

  const minimumElevation = minimumElevationDegrees * (Math.PI / 180);

  return (
    Math.acos((earthRadiusKm / satelliteRadius) * Math.cos(minimumElevation)) -
    minimumElevation
  );
}

function destinationPoint(centerLat, centerLon, angularDistance, bearing) {
  const lat = Math.asin(
    Math.sin(centerLat) * Math.cos(angularDistance) +
      Math.cos(centerLat) * Math.sin(angularDistance) * Math.cos(bearing),
  );

  const lon =
    centerLon +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(centerLat),

      Math.cos(angularDistance) - Math.sin(centerLat) * Math.sin(lat),
    );

  return {
    latitude: lat,
    longitude: lon,
  };
}

function radiansToVector3(latitude, longitude, radius) {
  const x = radius * Math.cos(latitude) * Math.cos(longitude);

  const y = radius * Math.sin(latitude);

  const z = -radius * Math.cos(latitude) * Math.sin(longitude);

  return [x, y, z];
}

export function getCoverageFootprintPoints(
  centerLatitude,
  centerLongitude,
  altitudeKm,
  minimumElevationDegrees = 10,
  earthRadius = 2,
  numberOfPoints = 180,
) {
  const angularRadius = getCoverageAngularRadius(
    altitudeKm,
    minimumElevationDegrees,
  );

  const centerLat = centerLatitude * (Math.PI / 180);

  const centerLon = centerLongitude * (Math.PI / 180);

  const points = [];

  const footprintRadius = earthRadius + 0.012;

  for (let i = 0; i <= numberOfPoints; i++) {
    const bearing = (i / numberOfPoints) * Math.PI * 2;

    const point = destinationPoint(
      centerLat,
      centerLon,
      angularRadius,
      bearing,
    );

    points.push(
      radiansToVector3(point.latitude, point.longitude, footprintRadius),
    );
  }

  return points;
}

export function getCoverageFootprintMesh(
  centerLatitude,
  centerLongitude,
  altitudeKm,
  minimumElevationDegrees = 10,
  earthRadius = 2,
  radialSegments = 24,
  angularSegments = 96,
) {
  const angularRadius = getCoverageAngularRadius(
    altitudeKm,
    minimumElevationDegrees,
  );

  const centerLat = centerLatitude * (Math.PI / 180);

  const centerLon = centerLongitude * (Math.PI / 180);

  // Slightly farther from the surface
  // than the Earth to prevent z-fighting.
  const radius = earthRadius + 0.008;

  const vertices = [];
  const indices = [];

  // Center vertex
  const centerVector = radiansToVector3(centerLat, centerLon, radius);

  vertices.push(...centerVector);

  /*
   * Build concentric rings extending
   * from the sub-satellite point to
   * the edge of the coverage region.
   */
  for (let ring = 1; ring <= radialSegments; ring++) {
    const ringDistance = angularRadius * (ring / radialSegments);

    for (let segment = 0; segment < angularSegments; segment++) {
      const bearing = (segment / angularSegments) * Math.PI * 2;

      const point = destinationPoint(
        centerLat,
        centerLon,
        ringDistance,
        bearing,
      );

      const vector = radiansToVector3(point.latitude, point.longitude, radius);

      vertices.push(...vector);
    }
  }

  /*
   * Connect the center vertex
   * to the first ring.
   */
  for (let segment = 0; segment < angularSegments; segment++) {
    const current = 1 + segment;

    const next = 1 + ((segment + 1) % angularSegments);

    indices.push(0, current, next);
  }

  /*
   * Connect each remaining pair
   * of concentric rings.
   */
  for (let ring = 1; ring < radialSegments; ring++) {
    const currentRingStart = 1 + (ring - 1) * angularSegments;

    const nextRingStart = 1 + ring * angularSegments;

    for (let segment = 0; segment < angularSegments; segment++) {
      const nextSegment = (segment + 1) % angularSegments;

      const a = currentRingStart + segment;

      const b = currentRingStart + nextSegment;

      const c = nextRingStart + segment;

      const d = nextRingStart + nextSegment;

      indices.push(a, c, b);

      indices.push(b, c, d);
    }
  }

  return {
    vertices,
    indices,
  };
}
