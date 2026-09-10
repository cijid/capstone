/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("location").del();
  await knex("location").insert([
    {
      id: "location1",
      name: "Anchorage, Alaska",
      x_coord: -149.9003,
      y_coord: 61.2181,
      line_of_sight: 120.0,
      radius: 50.0,
    },
    {
      id: "location2",
      name: "Fairbanks, Alaska",
      x_coord: -147.7164,
      y_coord: 64.8378,
      line_of_sight: 110.0,
      radius: 40.0,
    },
    {
      id: "location3",
      name: "Colorado Springs, Colorado",
      x_coord: -104.8214,
      y_coord: 38.8339,
      line_of_sight: 100.0,
      radius: 45.0,
    },
    {
      id: "location4",
      name: "San Diego, California",
      x_coord: -117.1611,
      y_coord: 32.7157,
      line_of_sight: 130.0,
      radius: 35.0,
    },
    {
      id: "location5",
      name: "Mobile Convoy near Tucson, Arizona",
      x_coord: -110.9747,
      y_coord: 32.2226,
      line_of_sight: 150.0,
      radius: 25.0,
    },
    {
      id: "location6",
      name: "Operations Center in Phoenix, Arizona",
      x_coord: -112.074,
      y_coord: 33.4484,
      line_of_sight: 140.0,
      radius: 60.0,
    },
    {
      id: "location7",
      name: "Temporary Field Site near Barstow, California",
      x_coord: -117.0173,
      y_coord: 34.8958,
      line_of_sight: 160.0,
      radius: 30.0,
    },
    {
      id: "location8",
      name: "Field Team near Yuma, Arizona",
      x_coord: -114.6277,
      y_coord: 32.6927,
      line_of_sight: 155.0,
      radius: 20.0,
    },
    {
      id: "location9",
      name: "Sensor Site near Nome, Alaska",
      x_coord: -165.4064,
      y_coord: 64.5011,
      line_of_sight: 115.0,
      radius: 15.0,
    },
    {
      id: "location10",
      name: "Field Headquarters near Fayetteville, North Carolina",
      x_coord: -78.8784,
      y_coord: 35.0527,
      line_of_sight: 105.0,
      radius: 40.0,
    },
    {
      id: "location11",
      name: "Coordination Center in Arlington, Virginia",
      x_coord: -77.1068,
      y_coord: 38.8816,
      line_of_sight: 90.0,
      radius: 30.0,
    },
    {
      id: "location12",
      name: "Emergency Operations Center in Miami, Florida",
      x_coord: -80.1918,
      y_coord: 25.7617,
      line_of_sight: 125.0,
      radius: 55.0,
    },
    {
      id: "location13",
      name: "Response Team in San Juan, Puerto Rico",
      x_coord: -66.1057,
      y_coord: 18.4655,
      line_of_sight: 135.0,
      radius: 25.0,
    },
  ]);
};
