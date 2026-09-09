/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('informational_awareness').del()
  await knex('informational_awareness').insert([
    {id: "infoAw1", terrain: 'N/A', intelligence: "China", device_ids: JSON.stringify(["device1", "device2"])},
    {id: "infoAw2", terrain: 'N/A', intelligence: "Russia", device_ids: JSON.stringify(["device1", "device3"])},
    {id: "infoAw3", terrain: 'N/A', intelligence: "North Korea", device_ids: JSON.stringify(["device1", "device2"])},
  ]);
};
