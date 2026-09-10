/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('device').del()
  await knex('device').insert([
    {id: "device1", name: 'Iridium Extreme 9575', space_capability_id: "CAP-SPACE-SATCOM-COMMS-001"},
    {id: "device2", name: 'L3Harris AN/PRC-163', space_capability_id: "CAP-SPACE-SATCOM-COMMS-001"},
    {id: "device3", name: 'L3Harris AN/PRC-167', space_capability_id: "CAP-SPACE-SATCOM-COMMS-001"},
    {id: "device4", name: 'Seed MW Infrared Sensor', space_capability_id: "CAP-SPACE-MW-WARNING-002"},
    {id: "device5", name: 'Seed MW Tracking Radar', space_capability_id: "CAP-SPACE-MW-WARNING-002"},
    {id: "device6", name: 'Seed MW Alert Receiver', space_capability_id: "CAP-SPACE-MW-WARNING-002"},
    {id: "device7", name: 'Hughes 9450', space_capability_id: "CAP-SPACE-SATCOM-COMMS-001"},
    {id: "device8", name: 'Seed MW Processing Unit', space_capability_id: "CAP-SPACE-MW-WARNING-002"},
    {id: "device9", name: 'Seed MW Operator Terminal', space_capability_id: "CAP-SPACE-MW-WARNING-002"},
    {id: "device10", name: 'Seed MW Sensor Gateway', space_capability_id: "CAP-SPACE-MW-WARNING-002"},
    {id: "device11", name: 'Seed PNT GNSS Receiver', space_capability_id: "CAP-SPACE-PNT-POSNAVTIME-003"},
    {id: "device12", name: 'Seed PNT Inertial Navigation Unit', space_capability_id: "CAP-SPACE-PNT-POSNAVTIME-003"},
    {id: "device13", name: 'Seed PNT Timing Receiver', space_capability_id: "CAP-SPACE-PNT-POSNAVTIME-003"},
    {id: "device14", name: 'Seed PNT Reference Clock', space_capability_id: "CAP-SPACE-PNT-POSNAVTIME-003"},
    {id: "device15", name: 'Seed PNT Navigation Terminal', space_capability_id: "CAP-SPACE-PNT-POSNAVTIME-003"},
    {id: "device16", name: 'Iridium', space_capability_id: "CAP-SPACE-SATCOM-COMMS-001"}
  ]);
};
