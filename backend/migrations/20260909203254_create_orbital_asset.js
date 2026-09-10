/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("orbital_asset", (table) => {
    table.string("id").primary();
    table.string("name").notNullable();
    table.integer("norad_id").notNullable().unique();
    table.text("tle_line1").notNullable();
    table.text("tle_line2").notNullable();
    table.boolean("active").notNullable().defaultTo(true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("orbital_asset");
};
