/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
  await knex("location_capability_dependency").del();

  await knex("location_capability_dependency").insert([
    {
      location_id: "location1",
      space_capability_id: "CAP-SPACE-SATCOM-COMMS-001",
      required: true,
      priority: "critical",
    },
    {
      location_id: "location1",
      space_capability_id: "CAP-SPACE-PNT-POSNAVTIME-003",
      required: true,
      priority: "high",
    },

    {
      location_id: "location2",
      space_capability_id: "CAP-SPACE-SATCOM-COMMS-001",
      required: true,
      priority: "critical",
    },
    {
      location_id: "location2",
      space_capability_id: "CAP-SPACE-PNT-POSNAVTIME-003",
      required: true,
      priority: "high",
    },

    {
      location_id: "location3",
      space_capability_id: "CAP-SPACE-SATCOM-COMMS-001",
      required: true,
      priority: "critical",
    },
    {
      location_id: "location3",
      space_capability_id: "CAP-SPACE-PNT-POSNAVTIME-003",
      required: true,
      priority: "high",
    },
    {
      location_id: "location3",
      space_capability_id: "CAP-SPACE-MW-WARNING-002",
      required: true,
      priority: "critical",
    },

    {
      location_id: "location4",
      space_capability_id: "CAP-SPACE-SATCOM-COMMS-001",
      required: true,
      priority: "high",
    },
    {
      location_id: "location4",
      space_capability_id: "CAP-SPACE-PNT-POSNAVTIME-003",
      required: true,
      priority: "normal",
    },
    {
      location_id: "location4",
      space_capability_id: "CAP-SPACE-MW-WARNING-002",
      required: true,
      priority: "critical",
    },

    {
      location_id: "location5",
      space_capability_id: "CAP-SPACE-PNT-POSNAVTIME-003",
      required: true,
      priority: "critical",
    },
    {
      location_id: "location5",
      space_capability_id: "CAP-SPACE-SATCOM-COMMS-001",
      required: true,
      priority: "high",
    },

    {
      location_id: "location6",
      space_capability_id: "CAP-SPACE-PNT-POSNAVTIME-003",
      required: true,
      priority: "high",
    },
    {
      location_id: "location6",
      space_capability_id: "CAP-SPACE-SATCOM-COMMS-001",
      required: true,
      priority: "high",
    },
  ]);
};
