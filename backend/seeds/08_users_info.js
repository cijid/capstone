/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("user").del();
  await knex("user").insert([
    {
      id: "user01",
      name: "Sniffy Buffy",
      rank: "Chief",
      admin: true,
      device_ids: JSON.stringify([
        "device1",
        "device2",
        "device3",
        "device4",
        "device5",
        "device6",
        "device7",
        "device8",
      ]),
      unit_id: "unit1",
    },
    {
      id: "user02",
      name: "Jason Bason",
      rank: "Captain",
      admin: false,
      device_ids: JSON.stringify(["device1"]),
      unit_id: "unit2",
    },
    {
      id: "user03",
      name: "Macy Lacy",
      rank: "General",
      admin: false,
      device_ids: JSON.stringify(["device1", "device2"]),
      unit_id: "unit3",
    },
    {
      id: "user04",
      name: "Jordan Ellis",
      rank: "Sergeant",
      admin: false,
      device_ids: JSON.stringify(["device6", "device7"]),
      unit_id: "unit2",
    },
    {
      id: "user05",
      name: "Morgan Reed",
      rank: "Lieutenant",
      admin: true,
      device_ids: JSON.stringify([
        "device1",
        "device9",
        "device10",
        "device11",
      ]),
      unit_id: "unit2",
    },
    {
      id: "user06",
      name: "Avery Collins",
      rank: "Specialist",
      admin: true,
      device_ids: JSON.stringify([
        "device12",
        "device13",
        "device14",
        "device7",
        "device8",
        "device3",
        "device6",
      ]),
      unit_id: "unit4",
    },
    {
      id: "user07",
      name: "Cameron Price",
      rank: "Colonel",
      admin: false,
      device_ids: JSON.stringify(["device2", "device14"]),
      unit_id: "unit5",
    },
    {
      id: "user08",
      name: "Riley Bennett",
      rank: "Sergeant",
      admin: false,
      device_ids: JSON.stringify(["device15"]),
      unit_id: "unit6",
    },
  ]);
};
