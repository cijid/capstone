/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("location_capability_dependency", (table) => {
    table.increments("id").primary();

    table
      .string("location_id")
      .notNullable()
      .references("id")
      .inTable("location")
      .onDelete("CASCADE");

    table
      .string("space_capability_id")
      .notNullable()
      .references("id")
      .inTable("space_capability")
      .onDelete("CASCADE");

    table.boolean("required").notNullable().defaultTo(true);

    table.string("priority", 20).notNullable().defaultTo("normal");

    table.unique(["location_id", "space_capability_id"]);
  });

  await knex.raw(`
    ALTER TABLE location_capability_dependency
    ADD CONSTRAINT valid_dependency_priority
    CHECK (
      priority IN ('low', 'normal', 'high', 'critical')
    )
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("location_capability_dependency");
};
