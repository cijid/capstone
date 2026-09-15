/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("informational_awareness").del();
  await knex("informational_awareness").insert([
    {
      id: "infoAw1",
      terrain: "Open plains",
      intelligence: "Human Intelligence (HUMINT)",
      device_ids: JSON.stringify(["device2", "device4"]),
    },
    {
      id: "infoAw2",
      terrain: "Desert Terrain",
      intelligence: "Signals Intelligence (SIGINT)",
      device_ids: JSON.stringify(["device5", "device6"]),
    },
    {
      id: "infoAw3",
      terrain: "Desert roads, rolling hills, and urban routes",
      intelligence: "Geospatial Intelligence (GEOINT)",
      device_ids: JSON.stringify(["device7", "device8"]),
    },
    {
      id: "infoAw4",
      terrain: "Open fields, clearings, and hilltops",
      intelligence: "Measurement and Signature Intelligence (MASINT)",
      device_ids: JSON.stringify(["device9", "device10"]),
    },
    {
      id: "infoAw5",
      terrain: "Urban areas and rugged terrain",
      intelligence: "Imagery Intelligence (IMINT)",
      device_ids: JSON.stringify(["device11", "device12"]),
    },
    {
      id: "infoAw6",
      terrain: "Sparse grasslands",
      intelligence: "Electronic Intelligence (ELINT)",
      device_ids: JSON.stringify(["device15", "device13"]),
    },
    {
      id: "infoAw7",
      terrain: "Open plains",
      intelligence: "All-Source Intelligence",
      device_ids: JSON.stringify(["device14"]),
    },
    {
      id: "infoAw8",
      terrain: "Urban environments",
      intelligence: "Open-Source Intelligence (OSINT)",
      device_ids: JSON.stringify(["device16"]),
    },
  ]);
};
