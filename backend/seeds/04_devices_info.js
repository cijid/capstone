/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('device').del()
  await knex('device').insert([
    {id: "device1", name: 'Device 1', space_capability_id: "spc1"},
    {id: "device2", name: 'Device 2', space_capability_id: "spc2"},
    {id: "device3", name: 'Device 3', space_capability_id: "spc3"},
    {id: "device4", name: 'Device 4', space_capability_id: "spc1"},
    {id: "device5", name: 'Device 5', space_capability_id: "spc2"},
    {id: "device6", name: 'Device 6', space_capability_id: "spc3"},
    {id: "device7", name: 'Device 7', space_capability_id: "spc1"},
    {id: "device8", name: 'Device 8', space_capability_id: "spc2"}
  ]);
};
