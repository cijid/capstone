const express = require("express");
const app = express();

require("dotenv").config();

const cors = require("cors");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { createTokens, validateToken } = require("./JWT");

const knex = require("knex")(
  require("./knexfile")[process.env.NODE_ENV || "development"],
);

const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 3000;

const idList = [];

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());

const generateID = (type) => {
  let newID = crypto.randomBytes(4).toString("hex");

  while (idList.indexOf(`${type}${newID}`) >= 0) {
    newID = crypto.randomBytes(4).toString("hex");
  }

  const generatedID = `${type}${newID}`;

  idList.push(generatedID);

  return generatedID;
};

const databaseGeneratedIdTables = [
  "orbital_asset_capability",
  "location_capability_dependency",
];

const usesDatabaseGeneratedId = (tableName) => {
  return databaseGeneratedIdTables.includes(tableName);
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

app.get("/auth/me", validateToken, async (req, res) => {
  const id = req.userID;

  try {
    const user = await knex("users").select().where({ id: id }).first();

    const returnUser = {
      id: user.id,
      name: user.name,
      rank: user.rank,
      branch: user.branch,
      admin: user.admin,
      unit_id: user.unit_id,
    };

    res.status(200).json(returnUser);
  } catch (err) {
    res.status(400).json({ message: `${err}` });
  }
});

app.get("/", (req, res) => {
  res.send("Successfully connected!");
});

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

app.post("/register", async (req, res) => {
  const data = req.body;

  try {
    const hash = await bcrypt.hash(data.password, 10);
    const newID = generateID("user");

    data.password = hash;
    data.id = newID;
    await knex("users").insert(data);
    res.status(200).json("User registered");
  } catch (err) {
    res.status(400).json({ message: `${err}` });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await knex("users").select().where({ email: email }).first();

    bcrypt.compare(password, user.password, (error, response) => {
      if (response) {
        const accessToken = createTokens(user);
        res.cookie("accessToken", accessToken, {
          maxAge: 60 * 60 * 24 * 30 * 1000,
        });

        const returnUser = {
          id: user.id,
          name: user.name,
          rank: user.rank,
          branch: user.branch,
          admin: user.admin,
          unit_id: user.unit_id,
        };
        res.status(200).json(returnUser);
      } else {
        res.send({ message: "Incorrect email or password" });
      }
    });
  } catch (err) {
    res.status(400).json({ message: `ERR: ${err}` });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("accessToken");
  return res.status(200).json({ message: "Logged out successfully" });
});

const getAmsatSatellites = async () => {
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

  return satellites;
};

/*
 * GET /satellites/amsat
 *
 * Original AMSAT endpoint.
 */
app.get("/satellites/amsat", async (req, res) => {
  try {
    const satellites = await getAmsatSatellites();

    res.status(200).json(satellites);
  } catch (err) {
    console.error("Failed to retrieve AMSAT satellites:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/*
 * GET /orbital-assets
 *
 * Alias for retrieving live orbital assets.
 */
app.get("/orbital-assets", async (req, res) => {
  try {
    const satellites = await getAmsatSatellites();

    res.status(200).json(satellites);
  } catch (err) {
    console.error("Failed to retrieve orbital-assets:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/*
 * GET /orbital-assets/live
 *
 * Retrieves active orbital assets from the database and updates
 * their TLE data with current AMSAT data when available.
 *
 * IMPORTANT:
 * This route MUST be declared before:
 * app.get("/:tableName/:id", ...)
 */
app.get("/orbital-assets/live", async (req, res) => {
  try {
    const orbitalAssets = await knex("orbital_asset")
      .where({
        active: true,
      })
      .select("*");

    const amsatAssets = await getAmsatSatellites();

    const liveAssets = orbitalAssets.map((asset) => {
      const liveAsset = amsatAssets.find(
        (amsatAsset) => Number(amsatAsset.norad_id) === Number(asset.norad_id),
      );

      if (!liveAsset) {
        return {
          ...asset,
          tle_source: "database",
          tle_current: false,
        };
      }

      return {
        ...asset,
        tle_line1: liveAsset.tle_line1,
        tle_line2: liveAsset.tle_line2,
        tle_source: "amsat",
        tle_current: true,
      };
    });

    res.status(200).json(liveAssets);
  } catch (err) {
    console.error("Failed to retrieve live orbital assets:", err);

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
    const user = await knex("users")
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

app.get("/locations/:locationID/dependencies", async (req, res) => {
  const { locationID } = req.params;

  try {
    const location = await knex("location")
      .where({
        id: locationID,
      })
      .first();

    if (!location) {
      return res.status(404).json({
        message: "Location not found",
      });
    }

    const dependencies = await knex("location_capability_dependency as lcd")
      .join("space_capability as sc", "lcd.space_capability_id", "sc.id")
      .where("lcd.location_id", locationID)
      .select(
        "lcd.id",
        "lcd.required",
        "lcd.priority",
        "sc.id as space_capability_id",
        "sc.name as capability_name",
      );

    res.status(200).json({
      location,
      dependencies,
    });
  } catch (err) {
    console.error(`Failed to retrieve dependencies for ${locationID}:`, err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/* =========================================================
   KEEP THESE BELOW ALL SPECIFIC GET ROUTES.
   ========================================================= */

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

  if (tableName === "users") {
    res.status(400).json({
      message: "To register a new user, use the /register route instead.",
    });
    return;
  }

  const data = req.body;

  const successResponses = [];

  const errorResponses = [];

  if (Array.isArray(data)) {
    const insertedEntries = [];

    for (const originalEntry of data) {
      const entry = {
        ...originalEntry,
      };

      if (!usesDatabaseGeneratedId(tableName)) {
        entry.id = generateID(tableName);
      } else {
        delete entry.id;
      }

      serializeArrays(entry);

      try {
        const [insertedEntry] = await knex(tableName)
          .insert(entry)
          .returning("*");

        await populateReferences(insertedEntry);

        insertedEntries.push(insertedEntry);

        successResponses.push(
          `Successfully inserted new entry into ${tableName} with ID ${insertedEntry.id}!`,
        );
      } catch (err) {
        errorResponses.push(`Error inserting into ${tableName}: ${err}`);
      }
    }

    if (errorResponses.length > 0) {
      return res.status(400).json({
        data: insertedEntries,
        successResponses,
        errorResponses,
      });
    }

    return res.status(201).json(insertedEntries);
  }

  const entry = {
    ...data,
  };

  if (!usesDatabaseGeneratedId(tableName)) {
    entry.id = generateID(tableName);
  } else {
    delete entry.id;
  }

  serializeArrays(entry);

  try {
    const [insertedEntry] = await knex(tableName).insert(entry).returning("*");

    await populateReferences(insertedEntry);

    res.status(201).json(insertedEntry);
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

    await populateReferences(updatedEntry);

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

app.listen(PORT, (error) => {
  if (error) {
    console.error("Backend failed to start:", error);
    process.exit(1);
  }

  console.log(`Backend running at http://localhost:${PORT}`);
});
