/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('reports_info').del()
  await knex('reports_info').insert([
    {id: "rep1", 
      name: 'rowValue1', 
      space_capability_id: "blank", 
      status: 0, location_id: "location", 
      severity: 3, 
      start_time:"15:30:00", end_time: "16:00:00",
      confidence: 82, 
      description: "N/A", 
      recommended_action: "N/A",
      user_submitted: "N/A"
    },
     {id: "rep2", 
      name: 'rowValue1', 
      space_capability_id: "blank", 
      status: 0, location_id: "location", 
      severity: 3, 
      start_time:"15:30:00", end_time: "16:00:00",
      confidence: 82, 
      description: "N/A", 
      recommended_action: "N/A",
      user_submitted: "N/A"
    },
     {id: "rep3", 
      name: 'rowValue1', 
      space_capability_id: "blank", 
      status: 0, location_id: "location", 
      severity: 3, 
      start_time:"15:30:00", end_time: "16:00:00",
      confidence: 82, 
      description: "N/A", 
      recommended_action: "N/A",
      user_submitted: "N/A"
    },
    
  ]);
};
