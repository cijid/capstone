/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable("missions", (table) => {
    table.string("id").primary();
    table.string("name").notNullable();
    table.string("required_devices").notNullable();
    table.string("mission_description").notNullable();
    table.string("location_ids").notNullable();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("missions");
};
