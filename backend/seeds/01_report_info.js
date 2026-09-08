/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('reports').del()
  await knex('reports').insert([
    {id: "rep1", 
      name: 'Report 1', 
      space_capability_id: "spc1", 
      status: 0, location_id: "location1", 
      severity: 3, 
      start_time:"15:30:00", end_time: "16:00:00",
      confidence: 82, 
      description: "N/A", 
      recommended_action: "N/A",
      user_submitted: "user01"
    },
     {id: "rep2", 
      name: 'Report 2', 
      space_capability_id: "spc2", 
      status: 0, location_id: "location2", 
      severity: 3, 
      start_time:"15:30:00", end_time: "16:00:00",
      confidence: 82, 
      description: "N/A", 
      recommended_action: "N/A",
      user_submitted: "user02"
    },
     {id: "rep3", 
      name: 'Report 3', 
      space_capability_id: "spc3", 
      status: 0, location_id: "location3", 
      severity: 3, 
      start_time:"15:30:00", end_time: "16:00:00",
      confidence: 82, 
      description: "N/A", 
      recommended_action: "N/A",
      user_submitted: "user03"
    },
    
  ]);
};
