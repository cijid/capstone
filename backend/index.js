const express = require("express");
const app = express();

require("dotenv").config();

const cors = require("cors");
const crypto = require("crypto");

const knex = require("knex")(
  require("./knexfile")[process.env.NODE_ENV || "development"],
);

const PORT = process.env.PORT || 3000;

const idList = [];

app.use(express.json());
app.use(cors());

const generateID = (type) => {
  let newID = crypto.randomBytes(4).toString("hex");

  while (idList.indexOf(`${type}${newID}`) >= 0) {
    newID = crypto.randomBytes(4).toString("hex");
  }

  const generatedID = `${type}${newID}`;

  idList.push(generatedID);

  return generatedID;
};

const serializeArrays = (entry) => {
  for (const key of Object.keys(entry)) {
    if (Array.isArray(entry[key])) {
      entry[key] = JSON.stringify(entry[key]);
    }
  }

  return entry;
};

async function populateReferences(entry) {
  if (!entry) {
    return entry;
  }

  for (const key of Object.keys(entry)) {
    if (key.includes("_ids")) {
      if (!entry[key]) {
        continue;
      }

      let referenceIDList;

      try {
        referenceIDList = Array.isArray(entry[key])
          ? entry[key]
          : JSON.parse(entry[key]);
      } catch {
        continue;
      }

      const referenceObjectList = [];

      for (const referenceID of referenceIDList) {
        const referenceObject = await knex(key.replaceAll("_ids", ""))
          .select()
          .where({
            id: referenceID,
          })
          .first();

        if (referenceObject) {
          referenceObjectList.push(referenceObject);
        }
      }

      entry[key] = referenceIDList;
      entry[key.replaceAll("_ids", "")] = referenceObjectList;
    } else if (key.includes("_id") && entry[key]) {
      const tableName = key.replaceAll("_id", "");

      try {
        const referenceObject = await knex(tableName)
          .select()
          .where({
            id: entry[key],
          })
          .first();

        entry[tableName] = referenceObject;
      } catch (err) {
        console.error(`Failed to resolve ${key}:`, err.message);
      }
    }
  }

  return entry;
}

app.get("/", (req, res) => {
  res.send("Successfully connected!");
});

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
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

app.get("/reports/:reportID", async (req, res) => {
  const { reportID } = req.params;

  try {
    const report = await knex("report")
      .where({
        id: reportID,
      })
      .first();

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
    const mission = await knex("mission")
      .where({
        id: missionID,
      })
      .first();

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

    if (mission.device_ids) {
      requiredDeviceIds = Array.isArray(mission.device_ids)
        ? mission.device_ids
        : JSON.parse(mission.device_ids);
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
      location_ids: missionLocationIds,
      device_ids: requiredDeviceIds,
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
    const user = await knex("user")
      .where({
        id: userID,
      })
      .first();

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

app.get("/:tableName", async (req, res) => {
  const { tableName } = req.params;

  try {
    const entries = await knex(tableName).select();

    if (!entries) {
      throw new Error(`No entries found in ${tableName}`);
    }

    for (const entry of entries) {
      await populateReferences(entry);
    }

    res.status(200).json(entries);
  } catch (err) {
    console.error(`Failed to retrieve table "${tableName}":`, err);

    res.status(400).json({
      message: `${err}`,
    });
  }
});

app.get("/:tableName/:id", async (req, res) => {
  const { tableName, id } = req.params;

  try {
    const entry = await knex(tableName)
      .select()
      .where({
        id,
      })
      .first();

    if (!entry) {
      throw new Error("Entry not found!");
    }

    await populateReferences(entry);

    res.status(200).json(entry);
  } catch (err) {
    console.error(`Failed to retrieve ${tableName}/${id}:`, err);

    res.status(400).json({
      message: `${err}`,
    });
  }
});

app.post("/:tableName", async (req, res) => {
  const { tableName } = req.params;
  const data = req.body;

  const successResponses = [];
  const errorResponses = [];

  if (Array.isArray(data)) {
    for (const entry of data) {
      entry.id = generateID(tableName);

      serializeArrays(entry);

      try {
        await knex(tableName).insert(entry);

        successResponses.push(
          `Successfully inserted new entry ${entry.name} into ${tableName} with ID ${entry.id}!`,
        );
      } catch (err) {
        errorResponses.push(
          `Error inserting ${entry.name} into ${tableName}: ${err}`,
        );
      }
    }

    if (errorResponses.length > 0) {
      return res.status(400).json({
        data,
        successResponses,
        errorResponses,
      });
    }

    return res.status(200).json(data);
  }

  data.id = generateID(tableName);

  serializeArrays(data);

  try {
    await knex(tableName).insert(data);

    res.status(200).json(data);
  } catch (err) {
    console.error(`Failed to insert into ${tableName}:`, err);

    res.status(400).json({
      message: `${err}`,
    });
  }
});

app.patch("/:tableName/:id", async (req, res) => {
  const { tableName, id } = req.params;
  const data = req.body;

  serializeArrays(data);

  try {
    const existingEntry = await knex(tableName)
      .where({
        id,
      })
      .first();

    if (!existingEntry) {
      return res.status(404).json({
        message: "Entry not found",
      });
    }

    await knex(tableName)
      .where({
        id,
      })
      .update(data);

    const updatedEntry = await knex(tableName)
      .where({
        id,
      })
      .first();

    res.status(200).json(updatedEntry);
  } catch (err) {
    console.error(`Failed to update ${tableName}/${id}:`, err);

    res.status(400).json({
      message: `${err}`,
    });
  }
});

app.delete("/:tableName/:id", async (req, res) => {
  const { tableName, id } = req.params;

  try {
    const entry = await knex(tableName)
      .select()
      .where({
        id,
      })
      .first();

    if (!entry) {
      return res.status(404).json({
        message: "Entry not found",
      });
    }

    await knex(tableName)
      .where({
        id,
      })
      .del();

    res.status(200).json({
      message: `Successfully deleted ${entry.id} from ${tableName}`,
    });
  } catch (err) {
    console.error(`Failed to delete ${tableName}/${id}:`, err);

    res.status(400).json({
      message: `${err}`,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
