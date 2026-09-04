/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable("locations", (table) => {
    table.string("id").primary();
    table.string("name").notNullable();
    table.float("x_coord").notNullable();
    table.float("y_coord").notNullable();
    table.float("line_of_sight").notNullable();
    table.float("radius").notNullable();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("locations");
};
