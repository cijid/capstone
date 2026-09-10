const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const knex = require("knex")(
  require("./knexfile")[process.env.NODE_ENV || "development"],
);

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Successfully connected!");
});

app.get("/reports/:reportID", async (req, res) => {
  const { reportID } = req.params;

  try {
    const report = await knex("report").where({ id: reportID }).first();

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    const spaceCapability = report.space_capability_id
      ? await knex("space_capability")
          .where({
            id: report.space_capability_id,
          })
          .first()
      : null;

    const location = report.location_id
      ? await knex("location")
          .where({
            id: report.location_id,
          })
          .first()
      : null;

    const userSubmitted = report.user_submitted
      ? await knex("user")
          .where({
            id: report.user_submitted,
          })
          .first()
      : null;

    const returnReport = {
      ...report,
      location,
      space_capability: spaceCapability,
      user_submitted: userSubmitted,
    };

    res.status(200).json(returnReport);
  } catch (err) {
    console.error("Failed to retrieve report:", err);

    res.status(400).json({
      message: err.message,
    });
  }
});

app.get("/missions/:missionID", async (req, res) => {
  const { missionID } = req.params;

  try {
    const mission = await knex("mission").where({ id: missionID }).first();

    if (!mission) {
      return res.status(404).json({
        message: "Mission not found",
      });
    }

    let missionLocationIds = [];
    let requiredDeviceIds = [];

    if (mission.location_ids) {
      missionLocationIds = Array.isArray(mission.location_ids)
        ? mission.location_ids
        : JSON.parse(mission.location_ids);
    }

    if (mission.required_devices) {
      requiredDeviceIds = Array.isArray(mission.required_devices)
        ? mission.required_devices
        : JSON.parse(mission.required_devices);
    }

    const locations = await Promise.all(
      missionLocationIds.map((locationId) =>
        knex("location")
          .where({
            id: locationId,
          })
          .first(),
      ),
    );

    const devices = await Promise.all(
      requiredDeviceIds.map((deviceId) =>
        knex("device")
          .where({
            id: deviceId,
          })
          .first(),
      ),
    );

    const returnMission = {
      ...mission,
      locations: locations.filter(Boolean),
      devices: devices.filter(Boolean),
    };

    res.status(200).json(returnMission);
  } catch (err) {
    console.error("Failed to retrieve mission:", err);

    res.status(400).json({
      message: err.message,
    });
  }
});

app.get("/users/:userID", async (req, res) => {
  const { userID } = req.params;

  try {
    const user = await knex("user").where({ id: userID }).first();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const unit = user.unit_id
      ? await knex("unit")
          .where({
            id: user.unit_id,
          })
          .first()
      : null;

    let requiredDeviceIds = [];

    if (user.devices) {
      requiredDeviceIds = Array.isArray(user.devices)
        ? user.devices
        : JSON.parse(user.devices);
    }

    const devices = await Promise.all(
      requiredDeviceIds.map((deviceId) =>
        knex("device")
          .where({
            id: deviceId,
          })
          .first(),
      ),
    );

    const returnUser = {
      ...user,
      devices: devices.filter(Boolean),
      unit,
    };

    res.status(200).json(returnUser);
  } catch (err) {
    console.error("Failed to retrieve user:", err);

    res.status(400).json({
      message: err.message,
    });
  }
});
app.get("/satellites/amsat", async (req, res) => {
  try {
    const response = await fetch("https://www.amsat.org/tle/dailytle.txt");

    if (!response.ok) {
      throw new Error(`AMSAT request failed: ${response.status}`);
    }

    const text = await response.text();

    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const satellites = [];

    for (let i = 0; i < lines.length; i += 3) {
      const name = lines[i];

      const tleLine1 = lines[i + 1];

      const tleLine2 = lines[i + 2];

      if (!name || !tleLine1 || !tleLine2) {
        continue;
      }

      if (!tleLine1.startsWith("1 ") || !tleLine2.startsWith("2 ")) {
        continue;
      }

      const noradId = Number(tleLine1.substring(2, 7).trim());

      satellites.push({
        id: `amsat-${noradId}`,

        name,

        norad_id: noradId,

        tle_line1: tleLine1,

        tle_line2: tleLine2,

        active: true,
      });
    }

    res.status(200).json(satellites);
  } catch (err) {
    console.error("Failed to retrieve AMSAT satellites:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});
app.get("/:tableName", async (req, res) => {
  const { tableName } = req.params;

  try {
    const data = await knex(tableName).select("*");

    res.status(200).json(data);
  } catch (err) {
    console.error(`Failed to retrieve table "${tableName}":`, err);

    res.status(400).json({
      message: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
