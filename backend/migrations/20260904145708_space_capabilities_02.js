/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable("space_capabilities", (table) => {
    table.string("id").primary();
    table.string("name").notNullable();
    table.string("informational_awareness").notNullable();
    table.string("location_ids").notNullable();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.scheme.dropTableIfExsist("space_capabilities");
};
