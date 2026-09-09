# JSST BACKEND USAGE

## INSTALLATION

If starting the database and API server for the first time, run the following command in the backend folder:
```
docker-compose up -d && docker-compose exec api npm run db:seed
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

/report, /space_capability, /mission, /user, /unit, /device

Retrieves a list of all the entries in the table, with reference objects also included for easier parsing of information.

Ex:

```
const logReports = () => {
    fetch("http://localhost:3000/report")
    .then(response => response.json())
    .then(jsonResponse => console.log(jsonResponse));
}

logReports() //logs every report object from the database to the console
```

Returns:
```
[
  {
    "id": "Report-1",
    "name": "Routine Comms Shot",
    "space_capability_id": "CAP-SPACE-SATCOM-BLOS-001",
    "status": "4",
    "location_id": "location10",
    "severity": 2,
    "start_time": "15:30:00",
    "end_time": "16:30:00",
    "confidence": 90,
    "description": "SATCOM shot with a 167 to Fort Brag",
    "recommended_action": "Use sat U32",
    "user_submitted": "Ray Lowe",
    "space_capability": {
      "id": "CAP-SPACE-SATCOM-BLOS-001",
      "name": "Beyond-Line-of-Sight Voice Communications",
      "informational_awareness_id": "infoAw1",
      "location_ids": "[\"location1\",\"location2\"]"
    },
    "location": {
      "id": "location10",
      "name": "Field Headquarters near Fayetteville, North Carolina",
      "x_coord": -78.8784,
      "y_coord": 35.0527,
      "line_of_sight": 105,
      "radius": 40
    }
  },
  {
    "id": "Report-2",
    "name": "Scheduled Comms Check",
    "space_capability_id": "CAP-SPACE-SATCOM-C2-007",
    "status": "4",
    "location_id": "location11",
    "severity": 1,
    "start_time": "08:00:00",
    "end_time": "08:30:00",
    "confidence": 95,
    "description": "Routine SATCOM connectivity check with terminal T204.",
    "recommended_action": "Use sat U33 and verify signal quality.",
    "user_submitted": "Jordan Ellis",
    "space_capability": {
      "id": "CAP-SPACE-SATCOM-C2-007",
      "name": "Tactical Command and Control Connectivity",
      "informational_awareness_id": "infoAw7",
      "location_ids": "[\"location10\",\"location11\"]"
    },
    "location": {
      "id": "location11",
      "name": "Coordination Center in Arlington, Virginia",
      "x_coord": -77.1068,
      "y_coord": 38.8816,
      "line_of_sight": 90,
      "radius": 30
    }
  },
  ...... more entries
]
```

### Specific Report (Effect)

/report/:reportID

Retrieves a specific report and automatically includes the objects of the location and the affected space capability.

Ex:

```
const [displayedReport, setDisplayedReport] = useState({});

const setReport = (reportID) => {
    fetch(`http://localhost:3000/report/Report-1`)
    .then(response => response.json())
    .then(jsonResponse => setDisplayedReport(jsonResponse));
} //sets the displayed report to the one with specified reportID "Report-1"

console.log(report.space_capability.name); //logs the name of the displayed report's affected space capability
```

Returns:
```
{
  "id": "Report-1",
  "name": "Routine Comms Shot",
  "space_capability_id": "CAP-SPACE-SATCOM-BLOS-001",
  "status": "4",
  "location_id": "location10",
  "severity": 2,
  "start_time": "15:30:00",
  "end_time": "16:30:00",
  "confidence": 90,
  "description": "SATCOM shot with a 167 to Fort Brag",
  "recommended_action": "Use sat U32",
  "user_submitted": "Ray Lowe",
  "space_capability": {
    "id": "CAP-SPACE-SATCOM-BLOS-001",
    "name": "Beyond-Line-of-Sight Voice Communications",
    "informational_awareness_id": "infoAw1",
    "location_ids": "[\"location1\",\"location2\"]"
  },
  "location": {
    "id": "location10",
    "name": "Field Headquarters near Fayetteville, North Carolina",
    "x_coord": -78.8784,
    "y_coord": 35.0527,
    "line_of_sight": 105,
    "radius": 40
  }
}
```

### Specific Space Capability

/space_capability/:spaceCapabilityID

Retrieves a specific space capability as well as automatically includes the arrays of objects associated with its served locations and informational awareness.

Ex:

```
const [displayedSpaceCapability, setDisplayedSpaceCapability] = useState({});

const setSpaceCapability = () => {
    fetch(`http://localhost:3000/space_capability/CAP-SPACE-SATCOM-BLOS-001`)
    .then(response => response.json())
    .then(jsonResponse => setDisplayedSpaceCapability(jsonResponse));
} //sets the displayed space capability to the one with specified spaceCapabilityID "CAP-SPACE-SATCOM-BLOS-001"

console.log(displayedSpaceCapability); //logs the space capability object
```

Returns:
```
{
  "id": "CAP-SPACE-SATCOM-BLOS-001",
  "name": "Beyond-Line-of-Sight Voice Communications",
  "informational_awareness_id": "infoAw1",
  "location_ids": "[\"location1\",\"location2\"]",
  "informational_awareness": {
    "id": "infoAw1",
    "terrain": "Open plains",
    "intelligence": "Human Intelligence (HUMINT)",
    "device_ids": "[\"device2\",\"device4\"]"
  },
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

### Specific Mission

/mission/:missionID

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
  "device_ids": "[\"device1\",\"device3\"]",
  "mission_description": "Establish two-way satellite voice communications between Anchorage and Fairbanks for routine check-ins and field status updates.",
  "location_ids": "[\"location1\",\"location2\"]",
  "device": [
    {
      "id": "device1",
      "name": "Iridium Extreme 9575",
      "space_capability_id": "CAP-SPACE-SATCOM-BLOS-001"
    },
    {
      "id": "device3",
      "name": "L3Harris AN/PRC-167",
      "space_capability_id": "CAP-SPACE-SATCOM-C2-007"
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

/user/:userID

Retrieves a specific user by their ID, including an array of objects for their devices and an object for their unit.

Ex:
```
const [displayedUser, setDisplayedUser] = useState({});

const setUser = () => {
    fetch(`http://localhost:3000/user/user01`)
    .then(response => response.json())
    .then(jsonResponse => setDisplayedUser(jsonResponse));
} //sets the displayed user to the one with specified userID "user01"

console.log(displayedUser); //logs the user object
```

Returns:
```
{
  "id": "user01",
  "name": "Sniffy Buffy",
  "rank": "Chief",
  "admin": true,
  "device_ids": "[\"device1\",\"device2\",\"device3\",\"device4\",\"device5\",\"device6\",\"device7\",\"device8\"]",
  "unit_id": "unit1",
  "device": [
    {
      "id": "device1",
      "name": "Iridium Extreme 9575",
      "space_capability_id": "CAP-SPACE-SATCOM-BLOS-001"
    },
    {
      "id": "device2",
      "name": "L3Harris AN/PRC-163",
      "space_capability_id": "CAP-SPACE-SATCOM-DATA-002"
    },
    {
      "id": "device3",
      "name": "L3Harris AN/PRC-167",
      "space_capability_id": "CAP-SPACE-SATCOM-C2-007"
    },
    {
      "id": "device4",
      "name": "L3Harris AN/PRC-117G",
      "space_capability_id": "CAP-SPACE-SATCOM-BLOS-002"
    },
    {
      "id": "device5",
      "name": "SDN Lite",
      "space_capability_id": "CAP-SPACE-SATCOM-DATA-004"
    },
    {
      "id": "device6",
      "name": "Star Shield",
      "space_capability_id": "CAP-SPACE-SATCOM-DATA-003"
    },
    {
      "id": "device7",
      "name": "Hughes 9450",
      "space_capability_id": "CAP-SPACE-SATCOM-SOTM-003"
    },
    {
      "id": "device8",
      "name": "Hughes 9211",
      "space_capability_id": "CAP-SPACE-SATCOM-DATA-005"
    }
  ],
  "unit": {
    "id": "unit1",
    "name": "Alpha",
    "mission_ids": "[\"mission1\",\"mission2\"]"
  }
}
```

### Specific Unit

/unit/:unitID

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
  "mission_ids": "[\"mission1\",\"mission2\"]",
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
      "name": "Tactical Data Exchange",
      "device_ids": "[\"device4\",\"device5\"]",
      "mission_description": "Exchange operational reports and situational updates between Colorado Springs and San Diego",
      "location_ids": "[\"location3\",\"location4\"]"
    }
  ]
}
```

### Specific Device

/device/:deviceID

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
  "space_capability_id": "CAP-SPACE-SATCOM-BLOS-001",
  "space_capability": {
    "id": "CAP-SPACE-SATCOM-BLOS-001",
    "name": "Beyond-Line-of-Sight Voice Communications",
    "informational_awareness_id": "infoAw1",
    "location_ids": "[\"location1\",\"location2\"]"
  }
}
```