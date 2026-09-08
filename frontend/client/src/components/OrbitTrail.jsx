import { memo, useMemo } from "react";

import { Entity, PolylineGraphics } from "resium";

import { Color, ArcType } from "cesium";

import { getOrbitPositions } from "../util/satellitePosition";

const ORBIT_COLOR = Color.CYAN.withAlpha(0.8);

function OrbitTrail({ satrec }) {
  const positions = useMemo(() => {
    if (!satrec) {
      return [];
    }

    return getOrbitPositions(satrec, new Date());
  }, [satrec]);

  if (positions.length < 2) {
    return null;
  }

  return (
    <Entity id={`orbit-${satrec.satnum}`}>
      <PolylineGraphics
        positions={positions}
        width={2}
        material={ORBIT_COLOR}
        arcType={ArcType.NONE}
      />
    </Entity>
  );
}

export default memo(OrbitTrail);
