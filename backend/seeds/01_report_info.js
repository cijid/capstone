/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('report').del()
  await knex('report').insert([
    {id: "Report-1", 
      name: 'Remote Voice Connectivity Check', 
      space_capability_id: "CAP-SPACE-SATCOM-COMMS-001", 
      status: 4, location_id: "location1", 
      severity: 2, 
      start_time:"2026-10-10 15:30:00", end_time: "2026-10-10 16:30:00",
      confidence: 90, 
      description: "Routine satellite voice check between Anchorage and Fairbanks using Iridium Extreme 9575 and AN/PRC-163 equipment.", 
      recommended_action: "Confirm two-way voice connectivity and record signal quality during scheduled check-ins.",
      user_submitted: "Ray Lowe"
    },
     {id: "Report-2", 
      name: 'Missile Detection and Tracking Check', 
      space_capability_id: "CAP-SPACE-MW-WARNING-002", 
      status: 4, location_id: "location3", 
      severity: 1, 
      start_time:"2026-10-17 08:00:00", end_time: "2026-10-17  08:30:00",
      confidence: 95, 
      description: "Scheduled exercise using simulated infrared and radar observations to validate detection and tracking workflows between Colorado Springs and San Diego", 
      recommended_action: "Verify that the Seed MW Processing Unit receives and processes test observations from the infrared sensor and tracking radar.",
      user_submitted: "Jordan Ellis"
    },
     {id: "Report-3", 
      name: 'Intermittent Mobile SATCOM Connection', 
      space_capability_id: "CAP-SPACE-SATCOM-COMMS-001", 
      status: 2, location_id: "location5", 
      severity: 3, 
      start_time:"2026-10-18 10:15:00", end_time: "2026-10-19 11:00:00",
      confidence: 82, 
      description: "Intermittent communications observed between the convoy near Tucson and the Phoenix operations center during testing with Hughes 9450 and AN/PRC-167 equipment.", 
      recommended_action: "Check antenna visibility, equipment connections, and terminal status, then repeat voice and data connectivity tests.",
      user_submitted: "Morgan Reed"
    },
    {id: "Report-4", 
      name: 'Missile Warning Alert Validation', 
      space_capability_id: "CAP-SPACE-MW-WARNING-002", 
      status: 3, location_id: "location7", 
      severity: 2, 
      start_time:"2026-10-23 12:00:00", end_time: "2026-10-23  12:45:00",
      confidence: 88, 
      description: "Validation requested for receipt and display of simulated missile warning alerts at the temporary field site near Barstow and the support center in San Diego.", 
      recommended_action: "Send a labeled exercise alert and confirm receipt on the Seed MW Alert Receiver and display on the Seed MW Operator Terminal",
      user_submitted: "Casey Brooks"
    },
     {id: "Report-5", 
      name: 'Missile Warning Report Processing Delay', 
      space_capability_id: "CAP-SPACE-MW-WARNING-002", 
      status: 2, location_id: "location8", 
      severity: 3, 
      start_time:"2026-10-27 13:30:00", end_time: "2026-10-28 14:15:00",
      confidence: 95, 
      description: "Delays observed while transferring and processing simulated missile warning sensor reports between the field team near Yuma and Colorado Springs.", 
      recommended_action: "Check the Seed MW Sensor Gateway, Processing Unit, and Operator Terminal logs to identify delays and repeat the test.",
      user_submitted: "Taylor Hayes"
    },
     {id: "Report-6", 
      name: 'Position and Navigation Consistency Check', 
      space_capability_id: "CAP-SPACE-PNT-POSNAVTIME-003", 
      status: 1, location_id: "location9", 
      severity: 2, 
      start_time:"2026-10-30  09:00:00", end_time: "2026-10-30 09:40:00",
      confidence: 78, 
      description: "Differences reported between GNSS position readings and inertial navigation outputs at the remote site near Nome, with results submitted to Anchorage for review.", 
      recommended_action: "Verify GNSS reception and navigation unit initialization, then compare time-aligned readings on the Seed PNT Navigation Terminal.",
      user_submitted: "Avery Collins"
    },
    {id: "Report-7", 
      name: 'Timing Synchronization Discrepancy', 
      space_capability_id: "CAP-SPACE-PNT-POSNAVTIME-003", 
      status: 2, location_id: "location10", 
      severity: 4, 
      start_time:"2026-11-03 17:00:00", end_time: "2026-11-04 18:00:00",
      confidence: 93, 
      description: "Timestamp discrepancies observed during an exercise comparing timing receiver outputs and reference clocks at field headquarters near Fayetteville and the coordination center in Arlington.", 
      recommended_action: "Verify timing source status and clock settings, measure the offset at each site, and repeat the synchronization check.",
      user_submitted: "Cameron Price"
    },
     {id: "Report-8", 
      name: 'Emergency Satellite Communications Restored', 
      space_capability_id: "CAP-SPACE-SATCOM-COMMS-001", 
      status: 4, location_id: "location13", 
      severity: 1, 
      start_time:"2026-11-10 19:15:00", end_time: "2026-11-10 19:45:00",
      confidence: 97, 
      description: "Backup satellite voice connectivity restored between the San Juan response team and the Miami emergency operations center using Iridium equipment during a simulated terrestrial network outage.", 
      recommended_action: "Confirm two-way voice connectivity and monitor connection stability throughout the exercise.",
      user_submitted: "Riley Bennett"
    },
    
    
  ]);
};
