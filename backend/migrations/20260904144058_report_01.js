/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable("reports", (table) => {
    table.string("id").primary();
    table.string("name").notNullable();
    table.string("space_capability_id").notNullable();
    table.string("status").notNullable();
    table.string("location_id").nullable();
    table.integer("severity").notNullable();
    table.time("start_time").notNullable();
    table.time("end_time").notNullable();
    table.integer("confidence").notNullable();
    table.string("description").notNullable();
    table.string("recommended_action").notNullable();
    table.string("user_submitted").notNullable();

  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("reports")
};
