/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("space_capability").del();
  await knex("space_capability").insert([
    {
      id: "CAP-SPACE-MW-WARNING-002",
      name: "Missle Warning",
      location_ids: JSON.stringify(["location1", "location2"]),
    },
    {
      id: "CAP-SPACE-SATCOM-COMMS-001",
      name: "SATCOM",
      location_ids: JSON.stringify(["location3", "location4"]),
    },
    {
      id: "CAP-SPACE-PNT-POSNAVTIME-003",
      name: "PNT",
      location_ids: JSON.stringify(["location5", "location6"]),
    },
  ]);
};
