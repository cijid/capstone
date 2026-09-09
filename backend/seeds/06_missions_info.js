/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('mission').del()
  await knex('mission').insert([
    { id: "mission1", 
      name: 'Mission 1', 
      device_ids: JSON.stringify(["device1", "device2"]), 
      mission_description: "Attack, destory, kill", 
      location_ids: JSON.stringify(["location1", "location2"])},

    { id: "mission2", 
      name: 'Mission 2', 
      device_ids: JSON.stringify(["device1", "device2"]), 
      mission_description: "Attack, destory, kill", 
      location_ids: JSON.stringify(["location1", "location2"])},

    { id: "mission3", 
      name: 'Mission 3', 
      device_ids: JSON.stringify(["device1", "device2"]), 
      mission_description: "Attack, destory, kill", 
      location_ids: JSON.stringify(["location1", "location2"])},
  ]);
};
