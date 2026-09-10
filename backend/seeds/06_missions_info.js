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

<<<<<<< HEAD
    {
      id: "mission2",
      name: "Tactical Data Exchange",
      device_ids: JSON.stringify(["device4", "device5"]),
      mission_description:
        "Exchange operational reports and situational updates between Colorado Springs and San Diego",
      location_ids: JSON.stringify(["location3", "location4"]),
    },
=======
    { id: "mission2",
      name: 'Missile Detection and Tracking Exercise',
      device_ids: JSON.stringify(["device4", "device5", "device8"]),
      mission_description: "Use simulated infrared and radar observations to test missile detection, tracking, and data processing workflows between Colorado Springs and San Diego.",
      location_ids: JSON.stringify(["location3", "location4"])},
>>>>>>> origin/dev-capstone

    {
      id: "mission3",
      name: "Mobile Convoy Communications",
      device_ids: JSON.stringify(["device6", "device7"]),
      mission_description:
        "Maintain satellite voice and data connectivity between a convoy near Tucson and the Phoenix operations center. Configure the Hughes 9211 with a tracking antenna for mobile use.",
      location_ids: JSON.stringify(["location5", "location6"]),
    },

      { id: "mission4",
      name: 'Missile Warning Alert Validation',
      device_ids: JSON.stringify(["device8", "device9"]),
      mission_description: "Validate receipt and display of simulated missile warning alerts at the temporary field site near Barstow and the support center in San Diego.",
      location_ids: JSON.stringify(["location7", "location4"])},

    { id: "mission5",
      name: 'Missile Warning Sensor Integration',
      device_ids: JSON.stringify(["device10", "device9"]),
      mission_description: "Test the transfer, processing, and display of simulated missile warning sensor reports between a field team near Yuma and Colorado Springs",
      location_ids: JSON.stringify(["location8", "location3"])},

    { id: "mission6",
      name: 'Remote Position and Navigation Validation',
      device_ids: JSON.stringify(["device12", "device13"]),
      mission_description: "Evaluate GNSS position reports and inertial navigation outputs at the remote site near Nome, with results reviewed by the monitoring team in Anchorage.",
      location_ids: JSON.stringify(["location9", "location1"])},

      { id: "mission7",
      name: 'Timing Synchronization Verification',
      device_ids: JSON.stringify(["device2", "device14"]),
      mission_description: "Compare timing receiver outputs against reference clocks at field headquarters near Fayetteville and the coordination center in Arlington to verify timestamp consistency.",
      location_ids: JSON.stringify(["location10", "location11"])},

    { id: "mission8",
      name: 'Emergency Communications Backup',
      device_ids: JSON.stringify(["device15"]),
      mission_description: "Provide backup satellite communications between the Miami emergency operations center and a response team in San Juan during a simulated terrestrial network outage.",
      location_ids: JSON.stringify(["location12", "location13"])},


  ]);
};
