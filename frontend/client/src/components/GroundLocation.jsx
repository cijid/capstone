import { memo, useMemo } from "react";

import { Entity, PointGraphics, LabelGraphics } from "resium";

import {
  Color,
  Cartesian2,
  HorizontalOrigin,
  VerticalOrigin,
  LabelStyle,
} from "cesium";

import { latLonAltToCartesian } from "../util/satellitePosition";

import { getLocationSeverity } from "../util/mapData";

const LABEL_OFFSET = new Cartesian2(12, -8);

function getMarkerColor(severity) {
  if (severity >= 4) {
    return Color.RED;
  }

  if (severity === 3) {
    return Color.ORANGE;
  }

  if (severity === 2) {
    return Color.YELLOW;
  }

  if (severity === 1) {
    return Color.LIME;
  }

  return Color.CYAN;
}

function GroundLocation({ location, selected = false, onSelect }) {
  const position = useMemo(() => {
    return latLonAltToCartesian(
      location.latitude,
      location.longitude,
      location.altitude ?? 0,
    );
  }, [location.latitude, location.longitude, location.altitude]);

  const severity = getLocationSeverity(location);

  const markerColor = getMarkerColor(severity);

  const reportCount = location.reports?.length ?? 0;

  const label =
    reportCount > 0 ? `${location.name} (${reportCount})` : location.name;

  return (
    <Entity
      id={`ground-${location.id}`}
      name={location.name}
      position={position}
      onClick={() => {
        if (onSelect) {
          onSelect(location);
        }
      }}
    >
      <PointGraphics
        pixelSize={selected ? 14 : 10}
        color={markerColor}
        outlineColor={selected ? Color.WHITE : Color.BLACK}
        outlineWidth={selected ? 3 : 2}
      />

      <LabelGraphics
        text={label}
        font="12px sans-serif"
        fillColor={Color.WHITE}
        outlineColor={Color.BLACK}
        outlineWidth={3}
        style={LabelStyle.FILL_AND_OUTLINE}
        pixelOffset={LABEL_OFFSET}
        horizontalOrigin={HorizontalOrigin.LEFT}
        verticalOrigin={VerticalOrigin.CENTER}
      />
    </Entity>
  );
}

export default memo(GroundLocation);
