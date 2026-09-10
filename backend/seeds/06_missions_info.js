/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("mission").del();
  await knex("mission").insert([
    {
      id: "mission1",
      name: "Remote Voice Connectivity",
      device_ids: JSON.stringify(["device1", "device3"]),
      mission_description:
        "Establish two-way satellite voice communications between Anchorage and Fairbanks for routine check-ins and field status updates.",
      location_ids: JSON.stringify(["location1", "location2"]),
    },

    {
      id: "mission2",
      name: "Tactical Data Exchange",
      device_ids: JSON.stringify(["device4", "device5"]),
      mission_description:
        "Exchange operational reports and situational updates between Colorado Springs and San Diego",
      location_ids: JSON.stringify(["location3", "location4"]),
    },

    {
      id: "mission3",
      name: "Mobile Convoy Communications",
      device_ids: JSON.stringify(["device6", "device7"]),
      mission_description:
        "Maintain satellite voice and data connectivity between a convoy near Tucson and the Phoenix operations center. Configure the Hughes 9211 with a tracking antenna for mobile use.",
      location_ids: JSON.stringify(["location5", "location6"]),
    },

    {
      id: "mission4",
      name: "Field Site Communications Setup",
      device_ids: JSON.stringify(["device8", "device9"]),
      mission_description:
        "Establish stationary satellite connectivity between a temporary field site near Barstow and the support center in San Diego",
      location_ids: JSON.stringify(["location7", "location4"]),
    },

    {
      id: "mission5",
      name: "Field Video Coordination",
      device_ids: JSON.stringify(["device10", "device9"]),
      mission_description:
        "Support video briefings between a field team near Yuma and Colorado Springs using VTC and SVTC systems over an appropriately configured satellite connection.",
      location_ids: JSON.stringify(["location8", "location3"]),
    },

    {
      id: "mission6",
      name: "Remote Sensor Monitoring",
      device_ids: JSON.stringify(["device12", "device13"]),
      mission_description:
        "Relay sensor readings and equipment status from a site near Nome to Anchorage, with return messages for supported sensor commands.",
      location_ids: JSON.stringify(["location9", "location1"]),
    },

    {
      id: "mission7",
      name: "Headquarters Coordination",
      device_ids: JSON.stringify(["device2", "device14"]),
      mission_description:
        "Support voice coordination and operational data exchange between field headquarters near Fayetteville and the coordination center in Arlington.",
      location_ids: JSON.stringify(["location10", "location11"]),
    },

    {
      id: "mission8",
      name: "Emergency Communications Backup",
      device_ids: JSON.stringify(["device15"]),
      mission_description:
        "Provide backup satellite communications between the Miami emergency operations center and a response team in San Juan during a simulated terrestrial network outage.",
      location_ids: JSON.stringify(["location12", "location13"]),
    },
  ]);
};
