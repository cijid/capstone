/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable("informational_awareness", (table) => {
    table.string("id").primary();
    table.string("terrain").notNullable();
    table.string("intelligence").notNullable();
    table.string("devices").notNullable();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("informational_awareness");
};
