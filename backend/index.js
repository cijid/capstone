const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const crypto = require('crypto');
const knex = require('knex')(require('./knexfile')[process.env.NODE_ENV || 'development']);

const idList = [];

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

const generateID = (type) => {
  let newID = crypto.randomBytes(4).toString('hex');
  while (idList.indexOf(newID) >= 0) newID = crypto.randomBytes(4).toString('hex');
  idList.push(`${type}${newID}`);
  return `${type}${newID}`;
}

app.get("/", (req, res) => {
    res.send("Successfully connected!");
});

app.get("/favicon.ico", (req, res) => {
    res.status(204).end();
});

app.get("/:tableName", async (req, res) => {
    const { tableName } = req.params;
    try {
        const entries = await knex(tableName).select();
        if (!entries) throw new Error("No entries found in " + tableName);
        for (let entry of entries) {
            for (let key of Object.keys(entry)) {
                if (key.includes("_ids")) {
                    const referenceIDList = JSON.parse(entry[key]);
                    const referenceObjectList = [];

                    for (const referenceID of referenceIDList) {
                        const referenceObject = await knex(key.replaceAll("_ids","")).select().where({id: referenceID}).first();
                        referenceObjectList.push(referenceObject);
                    }

                    entry[`${key.replaceAll("_ids","")}`] = referenceObjectList;
                } else if (key.includes("_id")) {
                    const referenceObject = await knex(key.replaceAll("_id","")).select().where({id: entry[key]}).first();
                    entry[`${key.replaceAll("_id","")}`] = referenceObject;
                }
            }
        }

        res.status(200).json(entries);
    } catch (err) {res.status(400).json({message: `${err}`})};
});

app.get("/:tableName/:id", async (req, res) => {
    const { tableName, id } = req.params;
    try {
        const entry = await knex(tableName).select().where({id: id}).first();
        if (!entry) throw new Error("Entry not found!");
        for (let key of Object.keys(entry)) {
            if (key.includes("_ids")) {
                const referenceIDList = JSON.parse(entry[key]);
                const referenceObjectList = [];

                for (const referenceID of referenceIDList) {
                    const referenceObject = await knex(key.replaceAll("_ids","")).select().where({id: referenceID}).first();
                    referenceObjectList.push(referenceObject);
                }

                entry[`${key.replaceAll("_ids","")}`] = referenceObjectList;
            } else if (key.includes("_id")) {
                const referenceObject = await knex(key.replaceAll("_id","")).select().where({id: entry[key]}).first();
                entry[`${key.replaceAll("_id","")}`] = referenceObject;
            }
        }

        res.status(200).json(entry);
    } catch (err) {res.status(400).json({message: `${err}`})};
})

app.post("/:tableName", async (req, res) => {
    const { tableName } = req.params;
    const data = req.body;
    const successResponses = [];
    const errorResponses = [];
    if (Array.isArray(data)) {
        for (let entry of data) {
            entry.id = generateID(tableName);
            try {
                await knex(tableName).insert(entry);
                successResponses.push(`Successfully inserted new entry ${entry.name} into ${tableName} with ID ${entry.id}!`);
            } catch (err) {errorResponses.push(`Error inserting ${entry.name} into ${tableName}: ${err}`)}
        };
    } else {
        data.id = generateID(tableName);
        try {
            await knex(tableName).insert(data);
            successResponses.push(`Successfully inserted new entry ${data.name} into ${tableName} with ID ${data.id}!`);
        } catch (err) {errorResponses.push(`Error inserting ${data.name} into ${tableName}: ${err}`)}
    };

    if (errorResponses.length > 0) {
        res.status(400).json({successResponses, errorResponses});
    } else res.status(200).json({successResponses});
});

app.delete("/:tableName/:id", async (req, res) => {
    const { tableName, id } = req.params;
    try {
        const entry = await knex(tableName).select().where({id: id}).first();
        await knex(tableName).where({id: id}).del();

        res.status(200).json({message: `Successfully deleted ${entry.id} from ${tableName}`});
    } catch (err) {res.status(400).json({message: `${err}`})};
});

app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});