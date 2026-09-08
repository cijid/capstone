import { useMemo } from "react";

import { Entity, PolygonGraphics, PolylineGraphics } from "resium";

import { Color, PolygonHierarchy, ArcType } from "cesium";

import { getCoverageFootprintPositions } from "../util/satellitePosition";

function CoverageFootprint({
  latitude,
  longitude,
  altitude,
  minimumElevation = 10,
}) {
  const positions = useMemo(() => {
    if (
      latitude === null ||
      latitude === undefined ||
      longitude === null ||
      longitude === undefined ||
      altitude === null ||
      altitude === undefined
    ) {
      return [];
    }

    return getCoverageFootprintPositions(
      latitude,
      longitude,
      altitude,
      minimumElevation,
    );
  }, [latitude, longitude, altitude, minimumElevation]);

  const hierarchy = useMemo(() => {
    if (positions.length < 3) {
      return undefined;
    }

    return new PolygonHierarchy(positions);
  }, [positions]);

  if (!hierarchy) {
    return null;
  }

  return (
    <>
      <Entity>
        <PolygonGraphics
          hierarchy={hierarchy}
          material={Color.CYAN.withAlpha(0.16)}
        />
      </Entity>

      <Entity>
        <PolylineGraphics
          positions={[...positions, positions[0]]}
          width={2}
          material={Color.CYAN}
          clampToGround
        />
      </Entity>
    </>
  );
}

export default CoverageFootprint;
