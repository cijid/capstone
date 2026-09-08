import { useMemo } from "react";

import { Entity, PolylineGraphics } from "resium";

import { Color, ArcType } from "cesium";

import { getOrbitPositions } from "../util/satellitePosition";

function OrbitTrail({ satrec, currentTime }) {
  const positions = useMemo(() => {
    return getOrbitPositions(satrec, currentTime);
  }, [satrec, currentTime]);

  if (positions.length < 2) {
    return null;
  }

  return (
    <Entity>
      <PolylineGraphics
        positions={positions}
        width={2}
        material={Color.CYAN.withAlpha(0.8)}
        arcType={ArcType.NONE}
      />
    </Entity>
  );
}

export default OrbitTrail;
