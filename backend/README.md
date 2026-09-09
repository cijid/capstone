# JSST API USAGE

## GET REQUESTS

### Table

/report, /space_capability, /mission, /user, /unit, /device

Retrieves a table from the database exactly how it is stored.

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
    "id": "rep1",
    "name": "Report 1",
    "space_capability_id": "spc1",
    "status": "0",
    "location_id": "location1",
    "severity": 3,
    "start_time": "15:30:00",
    "end_time": "16:00:00",
    "confidence": 82,
    "description": "N/A",
    "recommended_action": "N/A",
    "user_submitted": "user01"
  },
  {
    "id": "rep2",
    "name": "Report 2",
    "space_capability_id": "spc2",
    "status": "0",
    "location_id": "location2",
    "severity": 3,
    "start_time": "15:30:00",
    "end_time": "16:00:00",
    "confidence": 82,
    "description": "N/A",
    "recommended_action": "N/A",
    "user_submitted": "user02"
  },
  {
    "id": "rep3",
    "name": "Report 3",
    "space_capability_id": "spc3",
    "status": "0",
    "location_id": "location3",
    "severity": 3,
    "start_time": "15:30:00",
    "end_time": "16:00:00",
    "confidence": 82,
    "description": "N/A",
    "recommended_action": "N/A",
    "user_submitted": "user03"
  }
]
```

### Specific Report (Effect)

/report/:reportID

Retrieves a specific report and automatically includes the objects of the user who submitted it, the location, and the affected space capability.

Ex:

```
const [displayedReport, setDisplayedReport] = useState({});

const setReport = (reportID) => {
    fetch(`http://localhost:3000/report/rep1`)
    .then(response => response.json())
    .then(jsonResponse => setDisplayedReport(jsonResponse));
} //sets the displayed report to the one with specified reportID "rep1"

console.log(report.space_capability.name); //logs the name of the displayed report's affected space capability
```

Returns:
```
{
  "id": "rep1",
  "name": "Report 1",
  "space_capability_id": "spc1",
  "status": "0",
  "location_id": "location1",
  "severity": 3,
  "start_time": "15:30:00",
  "end_time": "16:00:00",
  "confidence": 82,
  "description": "N/A",
  "recommended_action": "N/A",
  "user_submitted": {
    "id": "user01",
    "name": "Sniffy Buffy",
    "rank": "Chief",
    "admin": true,
    "devices": "[\"device1\",\"device2\",\"device3\",\"device4\",\"device5\",\"device6\",\"device7\",\"device8\"]",
    "unit_id": "unit1"
  },
  "location": {
    "id": "location1",
    "name": "Location 1",
    "x_coord": 24.25,
    "y_coord": 18.75,
    "line_of_sight": 120,
    "radius": 50
  },
  "space_capability": {
    "id": "spc1",
    "name": "Capability 1",
    "informational_awareness_id": "infoAw1",
    "location_ids": "[\"location1\",\"location2\"]"
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
    fetch(`http://localhost:3000/space_capability/spc1`)
    .then(response => response.json())
    .then(jsonResponse => setDisplayedSpaceCapability(jsonResponse));
} //sets the displayed space capability to the one with specified spaceCapabilityID "spc1"

console.log(displayedSpaceCapability); //logs the space capability object
```

Returns:
```
{
  "id": "spc1",
  "name": "Capability 1",
  "informational_awareness_id": "infoAw1",
  "location_ids": "[\"location1\",\"location2\"]",
  "informational_awareness": {
    "id": "infoAw1",
    "terrain": "N/A",
    "intelligence": "China",
    "devices": "[\"device1\",\"device2\"]"
  },
  "locations": [
    {
      "id": "location1",
      "name": "Location 1",
      "x_coord": 24.25,
      "y_coord": 18.75,
      "line_of_sight": 120,
      "radius": 50
    },
    {
      "id": "location2",
      "name": "Location 2",
      "x_coord": 56.25,
      "y_coord": 87.75,
      "line_of_sight": 120,
      "radius": 50
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
  "name": "Mission 1",
  "required_devices": "[\"device1\",\"device2\"]",
  "mission_description": "Attack, destory, kill",
  "location_ids": "[\"location1\",\"location2\"]",
  "locations": [
    {
      "id": "location1",
      "name": "Location 1",
      "x_coord": 24.25,
      "y_coord": 18.75,
      "line_of_sight": 120,
      "radius": 50
    },
    {
      "id": "location2",
      "name": "Location 2",
      "x_coord": 56.25,
      "y_coord": 87.75,
      "line_of_sight": 120,
      "radius": 50
    }
  ],
  "devices": [
    {
      "id": "device1",
      "name": "Device 1",
      "space_capability_id": "spc1"
    },
    {
      "id": "device2",
      "name": "Device 2",
      "space_capability_id": "spc2"
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
    fetch(`http://localhost:3000/user/user1`)
    .then(response => response.json())
    .then(jsonResponse => setDisplayedUser(jsonResponse));
} //sets the displayed user to the one with specified userID "user1"

console.log(displayedUser); //logs the user object
```

Returns:
```
{
  "id": "user01",
  "name": "Sniffy Buffy",
  "rank": "Chief",
  "admin": true,
  "devices": [
    {
      "id": "device1",
      "name": "Device 1",
      "space_capability_id": "spc1"
    },
    {
      "id": "device2",
      "name": "Device 2",
      "space_capability_id": "spc2"
    },
    {
      "id": "device3",
      "name": "Device 3",
      "space_capability_id": "spc3"
    },
    {
      "id": "device4",
      "name": "Device 4",
      "space_capability_id": "spc1"
    },
    {
      "id": "device5",
      "name": "Device 5",
      "space_capability_id": "spc2"
    },
    {
      "id": "device6",
      "name": "Device 6",
      "space_capability_id": "spc3"
    },
    {
      "id": "device7",
      "name": "Device 7",
      "space_capability_id": "spc1"
    },
    {
      "id": "device8",
      "name": "Device 8",
      "space_capability_id": "spc2"
    }
  ],
  "unit_id": "unit1",
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
  "missions": [
    {
      "id": "mission1",
      "name": "Mission 1",
      "required_devices": "[\"device1\",\"device2\"]",
      "mission_description": "Attack, destory, kill",
      "location_ids": "[\"location1\",\"location2\"]"
    },
    {
      "id": "mission2",
      "name": "Mission 2",
      "required_devices": "[\"device1\",\"device2\"]",
      "mission_description": "Attack, destory, kill",
      "location_ids": "[\"location1\",\"location2\"]"
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
  "name": "Device 1",
  "space_capability_id": "spc1",
  "space_capability": {
    "id": "spc1",
    "name": "Capability 1",
    "informational_awareness_id": "infoAw1",
    "location_ids": "[\"location1\",\"location2\"]"
  }
}
```