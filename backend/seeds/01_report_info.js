/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('report').del()
  await knex('report').insert([
    {id: "Report-1", 
      name: 'Routine Comms Shot', 
      space_capability_id: "CAP-SPACE-SATCOM-BLOS-001", 
      status: 4, location_id: "location10", 
      severity: 2, 
      start_time:"2026-10-10 15:30:00", end_time: "2026-10-10 16:30:00",
      confidence: 90, 
      description: "SATCOM shot with a 167 to Fort Brag", 
      recommended_action: "Use sat U32",
      user_submitted: "Ray Lowe"
    },
     {id: "Report-2", 
      name: 'Scheduled Comms Check', 
      space_capability_id: "CAP-SPACE-SATCOM-C2-007", 
      status: 4, location_id: "location11", 
      severity: 1, 
      start_time:"2026-10-17 08:00:00", end_time: "2026-10-17  08:30:00",
      confidence: 95, 
      description: "Routine SATCOM connectivity check with terminal T204.", 
      recommended_action: "Use sat U33 and verify signal quality.",
      user_submitted: "Jordan Ellis"
    },
     {id: "Report-3", 
      name: 'Intermittent Signal Loss', 
      space_capability_id: "CAP-SPACE-SATCOM-VIDEO-005", 
      status: 2, location_id: "location3", 
      severity: 3, 
      start_time:"2026-10-18 10:15:00", end_time: "2026-10-19 11:00:00",
      confidence: 82, 
      description: "Intermittent signal loss detected during a scheduled SATCOM session with terminal T118", 
      recommended_action: "Switch to sat U34 and repeat the connectivity test.",
      user_submitted: "Morgan Reed"
    },
    {id: "Report-4", 
      name: 'Backup Link Validation', 
      space_capability_id: "CAP-SPACE-SATCOM-SATH-004", 
      status: 3, location_id: "location7", 
      severity: 2, 
      start_time:"2026-10-23 12:00:00", end_time: "2026-10-23  12:45:00",
      confidence: 88, 
      description: "Backup SATCOM link validation requested for terminal T305 before scheduled maintenance", 
      recommended_action: "Test sat U35 and record link availability.",
      user_submitted: "Casey Brooks"
    },
     {id: "Report-5", 
      name: 'Elevated Link Latency', 
      space_capability_id: "CAP-SPACE-SATCOM-DATA-002", 
      status: 2, location_id: "location4", 
      severity: 3, 
      start_time:"2026-10-27 13:30:00", end_time: "2026-10-28 14:15:00",
      confidence: 95, 
      description: "Higher-than-expected latency observed on terminal T212 during routine data transfer", 
      recommended_action: "Evaluate sat U36 and compare latency against the current link",
      user_submitted: "Taylor Hayes"
    },
     {id: "Report-6", 
      name: 'Antenna Alignment Check', 
      space_capability_id: "CAP-SPACE-SATCOM-BACKUP-008", 
      status: 1, location_id: "location12", 
      severity: 2, 
      start_time:"2026-10-30  09:00:00", end_time: "2026-10-30 09:40:00",
      confidence: 78, 
      description: "Reduced signal strength reported on terminal T409 following equipment relocation.", 
      recommended_action: "Verify antenna alignment and retest with sat U37.",
      user_submitted: "Avery Collins"
    },
    {id: "Report-7", 
      name: 'Primary Link Outage', 
      space_capability_id: "CAP-SPACE-SATCOM-BLOS-001", 
      status: 2, location_id: "location2", 
      severity: 4, 
      start_time:"2026-11-03 17:00:00", end_time: "2026-11-04 18:00:00",
      confidence: 93, 
      description: "Primary SATCOM link unavailable for terminal T501 during a scheduled communications window.", 
      recommended_action: "Activate the backup link using sat U38 and investigate the primary connection.",
      user_submitted: "Cameron Price"
    },
     {id: "Report-8", 
      name: 'Restored Comms Verification', 
      space_capability_id: "CAP-SPACE-SATCOM-BACKUP-008", 
      status: 4, location_id: "location13", 
      severity: 1, 
      start_time:"2026-11-10 19:15:00", end_time: "2026-11-10 19:45:00",
      confidence: 97, 
      description: "SATCOM connectivity restored on terminal T610 following routine maintenance", 
      recommended_action: "Continue using sat U39 and monitor signal stability.",
      user_submitted: "Riley Bennett"
    },
    
    
  ]);
};
