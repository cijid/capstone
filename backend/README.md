# JSST BACKEND USAGE

## INSTALLATION

If starting the database and API server for the first time, run the following command in the backend folder:
```
docker-compose up --build -d && docker-compose exec api npm run db:seed
```

To deactivate the database and API server, simply run the following command:
```
docker-compose down
```

To reactivate the server, simply run the following command:
```
docker-compose up
```


## GET REQUESTS

### Table

GET /report, /space_capability, /mission, /user, /unit, /device, /location

Retrieves a list of all the entries in the table, with reference objects also included for easier parsing of information.

Ex:

```
const logSpaceCapabilities = () => {
    fetch("http://localhost:3000/space_capability")
    .then(response => response.json())
    .then(jsonResponse => console.log(jsonResponse));
}

logSpaceCapabilities() //logs an array of every space capability object from the database to the console
```

Returns:
```
[
    {
        "id": "CAP-SPACE-MW-WARNING-002",
        "name": "Missle Warning",
        "location_ids": [
            "location1",
            "location2"
        ],
        "location": [
            {
                "id": "location1",
                "name": "Anchorage, Alaska",
                "x_coord": -149.9003,
                "y_coord": 61.2181,
                "line_of_sight": 120,
                "radius": 50
            },
            {
                "id": "location2",
                "name": "Fairbanks, Alaska",
                "x_coord": -147.7164,
                "y_coord": 64.8378,
                "line_of_sight": 110,
                "radius": 40
            }
        ]
    },
    {
        "id": "CAP-SPACE-SATCOM-COMMS-001",
        "name": "SATCOM",
        "location_ids": [
            "location3",
            "location4"
        ],
        "location": [
            {
                "id": "location3",
                "name": "Colorado Springs, Colorado",
                "x_coord": -104.8214,
                "y_coord": 38.8339,
                "line_of_sight": 100,
                "radius": 45
            },
            {
                "id": "location4",
                "name": "San Diego, California",
                "x_coord": -117.1611,
                "y_coord": 32.7157,
                "line_of_sight": 130,
                "radius": 35
            }
        ]
    },
    {
        "id": "CAP-SPACE-PNT-POSNAVTIME-003",
        "name": "PNT",
        "location_ids": [
            "location5",
            "location6"
        ],
        "location": [
            {
                "id": "location5",
                "name": "Mobile Convoy near Tucson, Arizona",
                "x_coord": -110.9747,
                "y_coord": 32.2226,
                "line_of_sight": 150,
                "radius": 25
            },
            {
                "id": "location6",
                "name": "Operations Center in Phoenix, Arizona",
                "x_coord": -112.074,
                "y_coord": 33.4484,
                "line_of_sight": 140,
                "radius": 60
            }
        ]
    }
]
```

### Specific Report (Effect)

GET /report/:reportID

Retrieves a specific report and automatically includes the objects of the location and the affected space capability.

Ex:

```
const [displayedReport, setDisplayedReport] = useState({});

const setReport = (reportID) => {
    fetch(`http://localhost:3000/report/Report-2`)
    .then(response => response.json())
    .then(jsonResponse => setDisplayedReport(jsonResponse));
} //sets the displayed report to the one with specified reportID "Report-2"

console.log(report.space_capability.name); //logs the name of the displayed report's affected space capability
```

Returns:
```
{
    "id": "Report-2",
    "name": "Missile Detection and Tracking Check",
    "space_capability_id": "CAP-SPACE-MW-WARNING-002",
    "status": "4",
    "location_id": "location3",
    "severity": 1,
    "start_time": "2026-10-17T08:00:00.000Z",
    "end_time": "2026-10-17T08:30:00.000Z",
    "confidence": 95,
    "description": "Scheduled exercise using simulated infrared and radar observations to validate detection and tracking workflows between Colorado Springs and San Diego",
    "recommended_action": "Verify that the Seed MW Processing Unit receives and processes test observations from the infrared sensor and tracking radar.",
    "user_submitted": "Jordan Ellis",
    "space_capability": {
        "id": "CAP-SPACE-MW-WARNING-002",
        "name": "Missle Warning",
        "location_ids": "[\"location1\",\"location2\"]"
    },
    "location": {
        "id": "location3",
        "name": "Colorado Springs, Colorado",
        "x_coord": -104.8214,
        "y_coord": 38.8339,
        "line_of_sight": 100,
        "radius": 45
    }
}
```

### Specific Space Capability

GET /space_capability/:spaceCapabilityID

Retrieves a specific space capability as well as automatically includes the array of objects associated with its served locations.

Ex:

```
const [displayedSpaceCapability, setDisplayedSpaceCapability] = useState({});

const setSpaceCapability = () => {
    fetch(`http://localhost:3000/space_capability/CAP-SPACE-SATCOM-COMMS-001`)
    .then(response => response.json())
    .then(jsonResponse => setDisplayedSpaceCapability(jsonResponse));
} //sets the displayed space capability to the one with specified spaceCapabilityID "CAP-SPACE-SATCOM-COMMS-001"

console.log(displayedSpaceCapability); //logs the space capability object
```

Returns:
```
{
    "id": "CAP-SPACE-SATCOM-COMMS-001",
    "name": "SATCOM",
    "location_ids": [
        "location3",
        "location4"
    ],
    "location": [
        {
            "id": "location3",
            "name": "Colorado Springs, Colorado",
            "x_coord": -104.8214,
            "y_coord": 38.8339,
            "line_of_sight": 100,
            "radius": 45
        },
        {
            "id": "location4",
            "name": "San Diego, California",
            "x_coord": -117.1611,
            "y_coord": 32.7157,
            "line_of_sight": 130,
            "radius": 35
        }
    ]
}
```

### Specific Mission

GET /mission/:missionID

Retrieves a specific mission as well as automatically includes the arrays of objects associated with its locations and required devices.

Ex:

```
const [displayedMission, setDisplayedMission] = useState({});

const setMission = (missionID) => {
    fetch(`http://localhost:3000/mission/mission1`)
    .then(response => response.json())
    .then(jsonResponse => setDisplayedMission(jsonResponse));
} //sets the displayed mission to the one with specified missionID "mission1"

console.log(displayedMission); //logs the mission object
```

Returns:
```
{
    "id": "mission1",
    "name": "Remote Voice Connectivity",
    "device_ids": [
        "device1",
        "device3"
    ],
    "mission_description": "Establish two-way satellite voice communications between Anchorage and Fairbanks for routine check-ins and field status updates.",
    "location_ids": [
        "location1",
        "location2"
    ],
    "device": [
        {
            "id": "device1",
            "name": "Iridium Extreme 9575",
            "space_capability_id": "CAP-SPACE-SATCOM-COMMS-001"
        },
        {
            "id": "device3",
            "name": "L3Harris AN/PRC-167",
            "space_capability_id": "CAP-SPACE-SATCOM-COMMS-001"
        }
    ],
    "location": [
        {
            "id": "location1",
            "name": "Anchorage, Alaska",
            "x_coord": -149.9003,
            "y_coord": 61.2181,
            "line_of_sight": 120,
            "radius": 50
        },
        {
            "id": "location2",
            "name": "Fairbanks, Alaska",
            "x_coord": -147.7164,
            "y_coord": 64.8378,
            "line_of_sight": 110,
            "radius": 40
        }
    ]
}
```

### Specific User

GET /user/:userID

Retrieves a specific user by their ID, including an array of objects for their devices and an object for their unit.

Ex:
```
const [displayedUser, setDisplayedUser] = useState({});

const setUser = () => {
    fetch(`http://localhost:3000/user/user02`)
    .then(response => response.json())
    .then(jsonResponse => setDisplayedUser(jsonResponse));
} //sets the displayed user to the one with specified userID "user02"

console.log(displayedUser); //logs the user object
```

Returns:
```
{
    "id": "user02",
    "name": "Jason Bason",
    "rank": "Captain",
    "admin": false,
    "device_ids": [
        "device1"
    ],
    "unit_id": "unit2",
    "device": [
        {
            "id": "device1",
            "name": "Iridium Extreme 9575",
            "space_capability_id": "CAP-SPACE-SATCOM-COMMS-001"
        }
    ],
    "unit": {
        "id": "unit2",
        "name": "Bravo",
        "mission_ids": "[\"mission3\"]"
    }
}
```

### Specific Unit

GET /unit/:unitID

Retrieves a specific unit by their ID, including an array of objects for the missions assigned to the unit.

Ex:
```
const [displayedUnit, setDisplayedUnit] = useState({});

const setUnit = () => {
    fetch(`http://localhost:3000/unit/unit1`)
    .then(response => response.json())
    .then(jsonResponse => setDisplayedUnit(jsonResponse));
} //sets the displayed unit to the one with specified unitID "unit1"

console.log(displayedUnit); //logs the unit object
```

Returns:
```
{
    "id": "unit1",
    "name": "Alpha",
    "mission_ids": [
        "mission1",
        "mission2"
    ],
    "mission": [
        {
            "id": "mission1",
            "name": "Remote Voice Connectivity",
            "device_ids": "[\"device1\",\"device3\"]",
            "mission_description": "Establish two-way satellite voice communications between Anchorage and Fairbanks for routine check-ins and field status updates.",
            "location_ids": "[\"location1\",\"location2\"]"
        },
        {
            "id": "mission2",
            "name": "Missile Detection and Tracking Exercise",
            "device_ids": "[\"device4\",\"device5\",\"device8\"]",
            "mission_description": "Use simulated infrared and radar observations to test missile detection, tracking, and data processing workflows between Colorado Springs and San Diego.",
            "location_ids": "[\"location3\",\"location4\"]"
        }
    ]
}
```

### Specific Device

GET /device/:deviceID

Retrieves a specific device by its ID, including an object for the space capability that the device relies on.

Ex:
```
const [displayedDevice, setDisplayedDevice] = useState({});

const setDevice = () => {
    fetch(`http://localhost:3000/device/device1`)
    .then(response => response.json())
    .then(jsonResponse => setDisplayedDevice(jsonResponse));
} //sets the displayed device to the one with specified deviceID "device1"

console.log(displayedDevice); //logs the device object
```

Returns:
```
{
    "id": "device1",
    "name": "Iridium Extreme 9575",
    "space_capability_id": "CAP-SPACE-SATCOM-COMMS-001",
    "space_capability": {
        "id": "CAP-SPACE-SATCOM-COMMS-001",
        "name": "SATCOM",
        "location_ids": "[\"location3\",\"location4\"]"
    }
}
```

### Specific Location

GET /location/:locationID

Retrieves a specific location by its ID.

Ex:
```
const [displayedLocation, setDisplayedLocation] = useState({});

const setLocation = () => {
    fetch(`http://localhost:3000/location/location1`)
    .then(response => response.json())
    .then(jsonResponse => setDisplayedLocation(jsonResponse));
} //sets the displayed location to the one with specified locationID "location1"

console.log(displayedLocation); //logs the location object
```

Returns:
```
{
  "id": "location1",
  "name": "Anchorage, Alaska",
  "x_coord": -149.9003,
  "y_coord": 61.2181,
  "line_of_sight": 120,
  "radius": 50
}
```

## POST REQUESTS

To add a new entry to the database, the URL will be the name of the table you are adding to and the body will be in JSON format of all properties of the entry except its ID as that is generated automatically by the server.

### Reports

POST /report

Adds a new report to the report table. 

JSON Format:
```
{
  "name": "Remote Voice Connectivity Check",
  "space_capability_id": "CAP-SPACE-SATCOM-COMMS-001",
  "status": "4",
  "location_id": "location1",
  "severity": 2,
  "start_time": "15:30:00",
  "end_time": "16:30:00",
  "confidence": 90,
  "description": "Routine satellite voice check between Anchorage and Fairbanks using Iridium Extreme 9575 and AN/PRC-163 equipment.",
  "recommended_action": "Confirm two-way voice connectivity and record signal quality during scheduled check-ins.",
  "user_submitted": "Ray Lowe"
}
```

### Space Capability

POST /space_capability

Adds a new space capability to the space capability table.

JSON Format:
```
{
  "id": "CAP-SPACE-SATCOM-COMMS-001",
  "name": "SATCOM",
  "location_ids": ["location3", "location4"]
}
```

### Mission

POST /mission

Adds a new mission to the mission table.

JSON Format:
```
{
  "name": "Remote Voice Connectivity",
  "device_ids": ["device1", "device3"],
  "mission_description": "Establish two-way satellite voice communications between Anchorage and Fairbanks for routine check-ins and field status updates.",
  "location_ids": ["location1", "location2"]
}
```

### User

POST /user

Adds a new user to the user table.

JSON Format:
```
{
  "id": "user01",
  "name": "Sniffy Buffy",
  "rank": "Chief",
  "admin": true,
  "device_ids": ["device1", "device2", "device3", "device4", "device5", "device6" ,"device7" ,"device8"],
  "unit_id": "unit1"
}
```

### Unit

POST /unit

Adds a new unit to the unit table.

JSON Format:
```
{
  "name": "Alpha",
  "mission_ids": ["mission1", "mission2"],
}
```

### Device

POST /device

Adds a new device to the device table.

JSON Format:
```
{
    "name": "Iridium Extreme 9575",
    "space_capability_id": "CAP-SPACE-SATCOM-COMMS-001"
}
```

### Location

POST /location

Adds a new location to the location table.

JSON Format:
```
{
  "name": "Anchorage, Alaska",
  "x_coord": -149.9003,
  "y_coord": 61.2181,
  "line_of_sight": 120,
  "radius": 50
}
```

## PATCH

PATCH /:tableName/:id

Updates specific properties of an entry in a table.

Ex:
```
PATCH http://localhost:3000/device/device1

body:
{
    "name": "Test Patch"
}
```

Returns:
```
{
    "id": "device1",
    "name": "Test Patch",
    "space_capability_id": "CAP-SPACE-SATCOM-COMMS-001"
}
```

## DELETE

DELETE /:tableName/:id

Deletes any entry in a table.

Ex:
```
DELETE http://localhost:3000/device/device1
```