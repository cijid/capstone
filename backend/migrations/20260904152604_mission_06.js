/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable("mission", (table) => {
    table.string("id").primary();
    table.string("name").notNullable();
    table.string("device_ids").notNullable();
    table.string("mission_description").notNullable();
    table.string("location_ids").notNullable();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("mission");
};
