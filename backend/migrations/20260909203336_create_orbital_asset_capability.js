/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("orbital_asset_capability", (table) => {
    table.increments("id").primary();

    table
      .string("orbital_asset_id")
      .notNullable()
      .references("id")
      .inTable("orbital_asset")
      .onDelete("CASCADE");

    table
      .string("space_capability_id")
      .notNullable()
      .references("id")
      .inTable("space_capability")
      .onDelete("CASCADE");

    table.unique(["orbital_asset_id", "space_capability_id"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("orbital_asset_capability");
};
