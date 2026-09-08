//Retrieve Locations, Reports, and Capabilities from API
const API_URL = "http://localhost:3000";

export async function getLocations() {
  const response = await fetch(`${API_URL}/locations`);

  if (!response.ok) {
    throw new Error("Failed to load locations");
  }

  return response.json();
}

export async function getReports() {
  const response = await fetch(`${API_URL}/reports`);

  if (!response.ok) {
    throw new Error("Failed to load reports");
  }

  return response.json();
}

export async function getSpaceCapabilities() {
  const response = await fetch(`${API_URL}/space_capabilities`);

  if (!response.ok) {
    throw new Error("Failed to load space capabilities");
  }

  return response.json();
}
