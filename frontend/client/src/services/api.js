const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

async function fetchData(
  endpoint,
  options = {}
) {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    options
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => null);

    throw new Error(
      errorData?.message ||
        `API request failed with status ${response.status}`
    );
  }

  return response.json();
}

export function getReports() {
  return fetchData("/report");
}

export function getCapabilities() {
  return fetchData(
    "/space_capability"
  );
}

export function getLocations() {
  return fetchData("/location");
}

export function createLocation(
  location
) {
  return fetchData("/location", {
    method: "POST",
    headers: {
      "Content-Type":
        "application/json",
    },
    body: JSON.stringify(location),
  });
}

export function updateLocation(
  id,
  location
) {
  return fetchData(
    `/location/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(
        location
      ),
    }
  );
}

export function createReport(report) {
  return fetchData("/report", {
    method: "POST",
    headers: {
      "Content-Type":
        "application/json",
    },
    body: JSON.stringify(report),
  });
}

export function updateReport(
  id,
  report
) {
  return fetchData(
    `/report/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(
        report
      ),
    }
  );
}

export function deleteReport(id) {
  return fetchData(
    `/report/${id}`,
    {
      method: "DELETE",
    }
  );
}