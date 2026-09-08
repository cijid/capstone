/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('space_capability').del()
  await knex('space_capability').insert([
    { id: "spc1", 
      name: 'Capability 1', 
      informational_awareness_id: "infoAw1", 
      location_ids: JSON.stringify(["location1", "location2"]) },
   { id: "spc2", 
      name: 'Capability 2', 
      informational_awareness_id: "infoAw2", 
      location_ids: JSON.stringify(["location1", "location2"]) },
      { id: "spc3", 
      name: 'Capability 3', 
      informational_awareness_id: "infoAw3", 
      location_ids: JSON.stringify(["location1", "location3"]) }
  ]);
};
