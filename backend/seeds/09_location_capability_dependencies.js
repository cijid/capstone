/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("location_capability_dependency").del();

  await knex("location_capability_dependency").insert([
    {
      location_id: "location3",
      space_capability_id: "CAP-SPACE-SATCOM-COMMS-001",
      required: true,
      priority: "critical",
    },
  ]);
};