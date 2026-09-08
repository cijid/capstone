import * as satellite from "satellite.js";
import { Cartesian3, Matrix3, Transforms, JulianDate } from "cesium";

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

export function latLonAltToCartesian(latitude, longitude, altitudeKm = 0) {
  return Cartesian3.fromDegrees(longitude, latitude, altitudeKm * 1000);
}

export function eciToCesiumFixed(eciPosition, date = new Date()) {
  if (!eciPosition) {
    return null;
  }

  const julianDate = JulianDate.fromDate(date);

  const rotation = Transforms.computeIcrfToFixedMatrix(julianDate);

  if (!rotation) {
    return null;
  }

  const inertialPosition = new Cartesian3(
    eciPosition.x * 1000,
    eciPosition.y * 1000,
    eciPosition.z * 1000,
  );

  return Matrix3.multiplyByVector(rotation, inertialPosition, new Cartesian3());
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

export function getCoverageFootprintPositions(
  centerLatitude,
  centerLongitude,
  altitudeKm,
  minimumElevationDegrees = 10,
  numberOfPoints = 120,
) {
  const angularRadius = getCoverageAngularRadius(
    altitudeKm,
    minimumElevationDegrees,
  );

  const centerLat = centerLatitude * (Math.PI / 180);

  const centerLon = centerLongitude * (Math.PI / 180);

  const positions = [];

  for (let i = 0; i < numberOfPoints; i++) {
    const bearing = (i / numberOfPoints) * Math.PI * 2;

    const latitude = Math.asin(
      Math.sin(centerLat) * Math.cos(angularRadius) +
        Math.cos(centerLat) * Math.sin(angularRadius) * Math.cos(bearing),
    );

    const longitude =
      centerLon +
      Math.atan2(
        Math.sin(bearing) * Math.sin(angularRadius) * Math.cos(centerLat),

        Math.cos(angularRadius) - Math.sin(centerLat) * Math.sin(latitude),
      );

    positions.push(Cartesian3.fromRadians(longitude, latitude, 1000));
  }

  return positions;
}

export function getOrbitPositions(
  satrec,
  currentTime = new Date(),
  numberOfSamples = 180,
) {
  if (!satrec?.no) {
    return [];
  }

  const orbitalPeriodMinutes = (2 * Math.PI) / satrec.no;

  const startMinutes = -orbitalPeriodMinutes / 2;

  const stepMinutes = orbitalPeriodMinutes / numberOfSamples;

  const positions = [];

  /* preserves the appearance of the
   * orbital plane instead of drawing a
   * ground track caused by Earth's rotation.
   */
  const julianDate = JulianDate.fromDate(currentTime);

  const rotation = Transforms.computeIcrfToFixedMatrix(julianDate);

  if (!rotation) {
    return [];
  }

  for (let i = 0; i <= numberOfSamples; i++) {
    const minutes = startMinutes + i * stepMinutes;

    const sampleTime = new Date(currentTime.getTime() + minutes * 60 * 1000);

    const eciPosition = getSatelliteEciPosition(satrec, sampleTime);

    if (!eciPosition) {
      continue;
    }

    const inertialPosition = new Cartesian3(
      eciPosition.x * 1000,
      eciPosition.y * 1000,
      eciPosition.z * 1000,
    );

    const fixedPosition = Matrix3.multiplyByVector(
      rotation,
      inertialPosition,
      new Cartesian3(),
    );

    positions.push(fixedPosition);
  }

  return positions;
}
