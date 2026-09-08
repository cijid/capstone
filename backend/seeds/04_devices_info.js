/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('devices_info').del()
  await knex('devices_info').insert([
    {id: "device_001", name: 'rowValue1', space_capability_id: "N/A"},
    {id: "device_002", name: 'rowValue1', space_capability_id: "N/A"},
    {id: "device_003", name: 'rowValue1', space_capability_id: "N/A"}
  ]);
};
