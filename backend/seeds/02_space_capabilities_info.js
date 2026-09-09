/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('space_capability').del()
  await knex('space_capability').insert([
    { id: "CAP-SPACE-SATCOM-BLOS-001", 
      name: 'Beyond-Line-of-Sight Voice Communications', 
      informational_awareness_id: "infoAw1", 
      location_ids: JSON.stringify(["location1", "location2"]) },
   { id: "CAP-SPACE-SATCOM-DATA-002", 
      name: 'Tactical Data Exchange', 
      informational_awareness_id: "infoAw2", 
      location_ids: JSON.stringify(["location3", "location4"]) },
      { id: "CAP-SPACE-SATCOM-SOTM-003", 
      name: 'SATCOM on the Move', 
      informational_awareness_id: "infoAw3", 
      location_ids: JSON.stringify(["location5", "location6"]) }, 
       { id: "CAP-SPACE-SATCOM-SATH-004", 
      name: 'SATCOM at the Halt', 
      informational_awareness_id: "infoAw4", 
      location_ids: JSON.stringify(["location7", "location4"]) },
   { id: "CAP-SPACE-SATCOM-VIDEO-005", 
      name: 'Tactical Video Transmission', 
      informational_awareness_id: "infoAw5", 
      location_ids: JSON.stringify(["location8", "location3"]) },
      { id: "CAP-SPACE-SATCOM-SENSOR-006", 
      name: 'Remote Sensor Data Relay', 
      informational_awareness_id: "infoAw6", 
      location_ids: JSON.stringify(["location9", "location1"]) },
       { id: "CAP-SPACE-SATCOM-C2-007", 
      name: 'Tactical Command and Control Connectivity', 
      informational_awareness_id: "infoAw7", 
      location_ids: JSON.stringify(["location10", "location11"]) },
   { id: "CAP-SPACE-SATCOM-BACKUP-008", 
      name: 'Emergency SATCOM Backup', 
      informational_awareness_id: "infoAw8", 
      location_ids: JSON.stringify(["location12", "location13"]) },
  ]);
};
