# JSST API USAGE

## GET

### Table

/table/:tableName

Retrieves a table from the database exactly how it is stored.

Ex:



```
const logReports = () => {
    fetch("http://localhost:3000/table/reports")
    .then(response => response.json())
    .then(jsonResponse => console.log(jsonResponse);
}

logReports() //logs every report object from the database to the console
```

### Reports

/reports/:reportID

Retrieves a report from the database as well as automatically includes the objects associated with its space_capability, location, and user_submitted.

Ex:

```
const [displayedReport, setDisplayedReport] = useState({});

const setReport = (reportID) => {
    fetch(`http://localhost:3000/reports/${reportID}`)
    .then(response => response.json())
    .then(jsonResponse => setDisplayedReport(jsonResponse);
} //sets the displayed report to the one with specified reportID

console.log(report.space_capability.name); //logs the name of the displayed report's affected space capability
```

### Missions

/missions/:missionID

Retrieves a specific mission as well as automatically includes the arrays of objects associated with its locations and required devices.

Ex:

```
const [displayedMission, setDisplayedMission] = useState({});

const setMission = (missionID) => {
    fetch(`http://localhost:3000/missions/${missionID}`)
    .then(response => response.json()
    .then(jsonResponse => setDisplayedMission(jsonResponse);
} //sets the displayed mission to the one with specified missionID

console.log(mission.requiredDevices); //logs the array of device objects required for the mission