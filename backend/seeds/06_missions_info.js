/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('missions').del()
  await knex('missions').insert([
    { id: "mission1", 
      name: 'Mission 1', 
      required_devices: JSON.stringify(["device1", "device2"]), 
      mission_description: "Attack, destory, kill", 
      location_ids: JSON.stringify(["location1", "location2"])},

    { id: "mission2", 
      name: 'Mission 2', 
      required_devices: JSON.stringify(["device1", "device2"]), 
      mission_description: "Attack, destory, kill", 
      location_ids: JSON.stringify(["location1", "location2"])},

    { id: "mission3", 
      name: 'Mission 3', 
      required_devices: JSON.stringify(["device1", "device2"]), 
      mission_description: "Attack, destory, kill", 
      location_ids: JSON.stringify(["location1", "location2"])},
  ]);
};
