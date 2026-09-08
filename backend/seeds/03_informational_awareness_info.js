/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('informational_awareness_info').del()
  await knex('informational_awareness_info').insert([
    {id: "infoAw1", terrain: 'N/A', intelligence: "China", devices: JSON.stringify(["device-1", "device-2"])},
    {id: "infoAw2", terrain: 'N/A', intelligence: "Russia", devices: JSON.stringify(["device-1", "device-2"])},
    {id: "infoAw3", terrain: 'N/A', intelligence: "North Korea", devices: JSON.stringify(["device-1", "device-2"])},
  ]);
};
