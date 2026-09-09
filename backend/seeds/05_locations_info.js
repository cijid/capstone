/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('location').del()
  await knex('location').insert([
    {id: "location1", name: 'Location 1', x_coord: 24.25, y_coord: 18.75, line_of_sight: 120.0, radius: 50.0},
    {id: "location2", name: 'Location 2', x_coord: 56.25, y_coord: 87.75, line_of_sight: 120.0, radius: 50.0},
    {id: "location3", name: 'Location 3', x_coord: 34.25, y_coord: 54.75, line_of_sight: 120.0, radius: 50.0},
  ]);
};
