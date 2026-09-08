/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('information_info').del()
  await knex('information_info').insert([
    {id: "location1", name: 'rowValue1', x_coord: 24.25, y_coord: 18.75, line_of_sight: 120.0, radius: 50.0},
    {id: "location2", name: 'rowValue1', x_coord: 24.25, y_coord: 18.75, line_of_sight: 120.0, radius: 50.0},
    {id: "location3", name: 'rowValue1', x_coord: 24.25, y_coord: 18.75, line_of_sight: 120.0, radius: 50.0},
  ]);
};
