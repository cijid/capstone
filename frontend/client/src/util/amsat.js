const AMSAT_TLE_URL = "https://www.amsat.org/tle/dailytle.txt";

export async function fetchAmsatSatellites() {
  const response = await fetch(AMSAT_TLE_URL);

  if (!response.ok) {
    throw new Error("Unable to fetch AMSAT satellite data");
  }

  const text = await response.text();

  return parseTleData(text);
}

function parseTleData(text) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const satellites = [];

  for (let i = 0; i < lines.length; i += 3) {
    const name = lines[i];
    const tleLine1 = lines[i + 1];
    const tleLine2 = lines[i + 2];

    if (!name || !tleLine1 || !tleLine2) {
      continue;
    }

    satellites.push({
      name,
      tleLine1,
      tleLine2,
    });
  }

  return satellites;
}
