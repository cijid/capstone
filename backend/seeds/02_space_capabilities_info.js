/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('space_capabilities_info').del()
  await knex('space_capabilities_info').insert([
    { id: "spc1", 
      name: 'rowValue1', 
      informational_awareness: "N/A", 
      location_ids: JSON.stringify(["location_1", "location_2"]) },
   { id: "spc2", 
      name: 'rowValue1', 
      informational_awareness: "N/A", 
      location_ids: JSON.stringify(["location_1", "location_2"]) },
      { id: "spc3", 
      name: 'rowValue1', 
      informational_awareness: "N/A", 
      location_ids: JSON.stringify(["location_1", "location_2"]) }
  ]);
};
