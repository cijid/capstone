/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable("user", (table) => {
    table.string("id").primary();
    table.string("name").notNullable();
    table.string("rank").notNullable();
    table.boolean("admin").notNullable();
    table.string("device_ids").notNullable();
    table.string("unit_id").notNullable();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("user");
};
