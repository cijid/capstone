const EARTH_RADIUS_KM = 6371;

function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

export function satelliteGeometry(observer, satellite) {
  const observerLatitude = toRadians(observer.latitude);
  const satelliteLatitude = toRadians(satellite.latitude);

  const longitudeDifference = toRadians(
    satellite.longitude - observer.longitude
  );

  // Angle between the observer and satellite ground point,
  // measured from Earth's center.
  const cosineOfAngle =
    Math.sin(observerLatitude) * Math.sin(satelliteLatitude) +
    Math.cos(observerLatitude) *
      Math.cos(satelliteLatitude) *
      Math.cos(longitudeDifference);

  // Protect against tiny rounding errors.
  const clampedCosine = Math.max(
    -1,
    Math.min(1, cosineOfAngle)
  );

  const satelliteRadius =
    EARTH_RADIUS_KM + satellite.altitudeKm;

  // Components of the observer-to-satellite direction,
  // relative to the observer's local horizon.
  const verticalDistance =
    satelliteRadius * clampedCosine - EARTH_RADIUS_KM;

  const horizontalDistance =
    satelliteRadius *
    Math.sqrt(Math.max(0, 1 - clampedCosine ** 2));

  const distanceKm = Math.hypot(
    verticalDistance,
    horizontalDistance
  );

  const elevationDeg =
    Math.atan2(verticalDistance, horizontalDistance) *
    180 / Math.PI;

// Direction toward the satellite in the observer's local
// east and north directions.
const east =
  Math.cos(satelliteLatitude) *
  Math.sin(longitudeDifference);

const north =
  Math.cos(observerLatitude) *
    Math.sin(satelliteLatitude) -
  Math.sin(observerLatitude) *
    Math.cos(satelliteLatitude) *
    Math.cos(longitudeDifference);

// Azimuth is undefined directly overhead or directly below.
const azimuthDeg =
  Math.hypot(east, north) < 1e-12
    ? null
    : (
        Math.atan2(east, north) * 180 / Math.PI + 360
      ) % 360;

return {
  distanceKm,
  elevationDeg,
  azimuthDeg,
  hasLineOfSight: elevationDeg > 0,
};
}