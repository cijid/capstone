/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("orbital_asset_capability").del();

  await knex("orbital_asset_capability").insert([
    {
      orbital_asset_id: "orbital-iss",
      space_capability_id: "CAP-SPACE-SATCOM-BLOS-001",
    },
    {
      orbital_asset_id: "orbital-iss",
      space_capability_id: "CAP-SPACE-SATCOM-DATA-002",
    },
    {
      orbital_asset_id: "orbital-so50",
      space_capability_id: "CAP-SPACE-SATCOM-C2-007",
    },
    {
      orbital_asset_id: "orbital-qo100",
      space_capability_id: "CAP-SPACE-SATCOM-BACKUP-008",
    },
  ]);
};
