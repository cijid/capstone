const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const knex = require('knex')(require('./knexfile')[process.env.NODE_ENV || 'development']);

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Successfully connected!");
});

app.get("/table/:tableName", (req, res) => {
    const { tableName } = req.params;
    knex(tableName).select()
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).json({message: err}));
});

app.get("/reports/:reportID", async (req, res) => {
    const { reportID } = req.params;
    try {
        const report = await knex("reports").select().where({ id: reportID }).first();

        console.log(report);

        const space_capability = await knex("space_capabilities").select().where({ id: report.space_capability_id}).first();
        const location = await knex("locations").select().where({ id: report.location_id }).first();
        const user_submitted = await knex("users").select().where({ id: report.user_submitted }).first();

        console.log(space_capability);
        console.log(location);
        console.log(user_submitted);

        const returnReport = {
            ...report,
            location: location,
            space_capability: space_capability,
            user_submitted: user_submitted,
        }

        res.status(200).json(returnReport);
    } catch (err) {
        res.status(400).json({message: `ERROR: ${err}`});
    }
});

app.get("/missions/:missionID", async (req, res) => {
    const { missionID } = req.params;
    try {
        const mission = await knex("missions").select().where({ id: missionID }).first();
        const missionLocations = JSON.parse(mission.location_ids);
        const requiredDevices = JSON.parse(mission.required_devices);

        const locations = [];
        const devices = [];

        for (let missionLocation of missionLocations) {
            const location = await knex("locations").select().where({ id: missionLocation }).first();
            locations.push(location);
        }

        for (let requiredDevice of requiredDevices) {
            const device = await knex("devices").select().where({ id: requiredDevice }).first();
            devices.push(device);
        }

        const returnMission = {
            ...mission,
            locations,
            devices,
        }

        res.status(200).json(returnMission);
    } catch (err) {
        res.status(400).json({message: `ERROR: ${err}`});
    }
});

app.get("/users/:userID", async (req, res) => {
    const { userID } = req.params;
    try {
        const user = await knex("users").select().where({ id: userID }).first();
        const userUnit = await knex("units").select().where({ id: user.unit_id}).first();
        const requiredDevices = JSON.parse(user.devices);

        const devices = [];

        for (let requiredDevice of requiredDevices) {
            const device = await knex("devices").select().where({ id: requiredDevice }).first();
            devices.push(device);
        }

        const returnUser = {
            ...user,
            devices: devices,
            unit: userUnit
        }

        res.status(200).json(returnUser);
    } catch (err) {
        res.status(400).json({message: `ERROR: ${err}`});
    }
})

app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});