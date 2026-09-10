/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("location_capability_dependency").del();

  await knex("location_capability_dependency").insert([
    {
      location_id: "location3",
      space_capability_id: "CAP-SPACE-SATCOM-BLOS-001",
      required: true,
      priority: "critical",
    },
    {
      location_id: "location3",
      space_capability_id: "CAP-SPACE-SATCOM-DATA-002",
      required: true,
      priority: "high",
    },
    {
      location_id: "location3",
      space_capability_id: "CAP-SPACE-SATCOM-C2-007",
      required: true,
      priority: "critical",
    },
    {
      location_id: "location3",
      space_capability_id: "CAP-SPACE-SATCOM-BACKUP-008",
      required: false,
      priority: "high",
    },
  ]);
};
