const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function getData(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(
      `Request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

export function getLocations() {
  return getData("/location");
}

export function getReports() {
  return getData("/report");
}

export function getSpaceCapabilities() {
  return getData("/space_capability");
}

export function getMissions() {
  return getData("/mission");
}

export function getLocationCapabilityDependencies() {
  return getData("/location_capability_dependency");
}

export function getOrbitalAssets() {
  return getData("/orbital_asset");
}

export function getOrbitalAssetCapabilities() {
  return getData("/orbital_asset_capability");
}

export function getAmsatSatellites() {
  return getData("/satellites/amsat");
}
