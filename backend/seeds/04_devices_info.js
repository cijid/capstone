/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("device").del();
  await knex("device").insert([
    {
      id: "device1",
      name: "Iridium Extreme 9575",
      space_capability_id: "CAP-SPACE-SATCOM-BLOS-001",
    },
    {
      id: "device2",
      name: "L3Harris AN/PRC-163",
      space_capability_id: "CAP-SPACE-SATCOM-BLOS-001",
    },
    {
      id: "device3",
      name: "L3Harris AN/PRC-167",
      space_capability_id: "CAP-SPACE-SATCOM-C2-007",
    },
    {
      id: "device4",
      name: "L3Harris AN/PRC-117G",
      space_capability_id: "CAP-SPACE-SATCOM-BLOS-001",
    },
    {
      id: "device5",
      name: "SDN Lite",
      space_capability_id: "CAP-SPACE-SATCOM-DATA-002",
    },
    {
      id: "device6",
      name: "Star Shield",
      space_capability_id: "CAP-SPACE-SATCOM-DATA-002",
    },
    {
      id: "device7",
      name: "Hughes 9450",
      space_capability_id: "CAP-SPACE-SATCOM-SOTM-003",
    },
    {
      id: "device8",
      name: "Hughes 9211",
      space_capability_id: "CAP-SPACE-SATCOM-SOTM-003",
    },
    {
      id: "device9",
      name: "Hughes 9203",
      space_capability_id: "CAP-SPACE-SATCOM-SATH-004",
    },
    {
      id: "device10",
      name: "Cobham EXPLORER 710",
      space_capability_id: "CAP-SPACE-SATCOM-SATH-004",
    },
    {
      id: "device11",
      name: "VTC",
      space_capability_id: "CAP-SPACE-SATCOM-VIDEO-005",
    },
    {
      id: "device12",
      name: "SVTC",
      space_capability_id: "CAP-SPACE-SATCOM-VIDEO-005",
    },
    {
      id: "device13",
      name: "Iridium Edge",
      space_capability_id: "CAP-SPACE-SATCOM-SENSOR-006",
    },
    {
      id: "device14",
      name: "SDN Heavy",
      space_capability_id: "CAP-SPACE-SATCOM-C2-007",
    },
    {
      id: "device15",
      name: "Hughes 9502",
      space_capability_id: "CAP-SPACE-SATCOM-SENSOR-006",
    },
    {
      id: "device16",
      name: "Iridium",
      space_capability_id: "CAP-SPACE-SATCOM-BACKUP-008",
    },
  ]);
};
