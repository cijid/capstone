import { useMemo } from "react";
import { Line } from "@react-three/drei";

import {
  getSatelliteEciPosition,
  eciToVector3,
} from "../util/satellitePosition";

function OrbitTrail({ satrec, currentTime }) {
  const points = useMemo(() => {
    const orbitPoints = [];

    if (!satrec?.no) {
      return orbitPoints;
    }

    // satrec.no is mean motion
    // in radians per minute.
    const orbitalPeriodMinutes = (2 * Math.PI) / satrec.no;

    const startMinutes = -orbitalPeriodMinutes / 2;

    const endMinutes = orbitalPeriodMinutes / 2;

    // Use a fixed number of samples
    // so both short and long-period
    // orbits remain reasonably smooth.
    const numberOfSamples = 180;

    const stepMinutes = orbitalPeriodMinutes / numberOfSamples;

    for (
      let minute = startMinutes;
      minute <= endMinutes;
      minute += stepMinutes
    ) {
      const sampleTime = new Date(currentTime.getTime() + minute * 60 * 1000);

      const eciPosition = getSatelliteEciPosition(satrec, sampleTime);

      if (!eciPosition) {
        continue;
      }

      const vector = eciToVector3(eciPosition);

      orbitPoints.push(vector);
    }

    // Close the orbital ring
    // by reconnecting the last
    // point to the first.
    if (orbitPoints.length > 0) {
      orbitPoints.push(orbitPoints[0]);
    }

    return orbitPoints;
  }, [satrec, currentTime]);

  if (points.length < 2) {
    return null;
  }

  return <Line points={points} lineWidth={1.5} />;
}

export default OrbitTrail;
