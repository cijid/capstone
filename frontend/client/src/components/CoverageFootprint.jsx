import { memo, useMemo } from "react";

import { Entity, PolygonGraphics, PolylineGraphics } from "resium";

import { Color, PolygonHierarchy } from "cesium";

import { getCoverageFootprintPositions } from "../util/satellitePosition";

const COVERAGE_FILL = Color.CYAN.withAlpha(0.16);

const COVERAGE_BORDER = Color.CYAN;

function CoverageFootprint({
  satelliteId,
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

  const borderPositions = useMemo(() => {
    if (positions.length < 3) {
      return [];
    }

    return [...positions, positions[0]];
  }, [positions]);

  if (!hierarchy || borderPositions.length < 3) {
    return null;
  }

  return (
    <>
      <Entity id={`coverage-fill-${satelliteId}`}>
        <PolygonGraphics hierarchy={hierarchy} material={COVERAGE_FILL} />
      </Entity>

      <Entity id={`coverage-border-${satelliteId}`}>
        <PolylineGraphics
          positions={borderPositions}
          width={2}
          material={COVERAGE_BORDER}
          clampToGround
        />
      </Entity>
    </>
  );
}

export default memo(CoverageFootprint);
