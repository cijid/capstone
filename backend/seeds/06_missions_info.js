/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('missions_info').del()
  await knex('missions_info').insert([
    { id: "mission1", 
      name: 'rowValue1', 
      required_devices: JSON.stringly(["device-1", "device-2"]), 
      mission_description: "Attack, destory, kill", 
      location_ids: JSON.stringify(["location-1", "location-2"])},

    { id: "mission2", 
      name: 'rowValue1', 
      required_devices: JSON.stringly(["device-1", "device-2"]), 
      mission_description: "Attack, destory, kill", 
      location_ids: JSON.stringify(["location-1", "location-2"])},

    { id: "mission3", 
      name: 'rowValue1', 
      required_devices: JSON.stringly(["device-1", "device-2"]), 
      mission_description: "Attack, destory, kill", 
      location_ids: JSON.stringify(["location-1", "location-2"])},
  ]);
};
