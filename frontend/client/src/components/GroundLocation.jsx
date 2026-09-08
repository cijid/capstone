import { Entity, PointGraphics, LabelGraphics } from "resium";

import { Color, Cartesian2, HorizontalOrigin } from "cesium";

import { latLonAltToCartesian } from "../util/satellitePosition";

function GroundLocation({ location }) {
  const position = latLonAltToCartesian(
    location.latitude,
    location.longitude,
    location.altitude,
  );

  return (
    <Entity
      id={`ground-${location.id}`}
      name={location.name}
      position={position}
    >
      <PointGraphics
        pixelSize={10}
        color={Color.LIME}
        outlineColor={Color.BLACK}
        outlineWidth={2}
      />

      <LabelGraphics
        text={location.name}
        font="12px sans-serif"
        fillColor={Color.WHITE}
        outlineColor={Color.BLACK}
        outlineWidth={2}
        pixelOffset={new Cartesian2(12, -8)}
        horizontalOrigin={HorizontalOrigin.LEFT}
      />
    </Entity>
  );
}

export default GroundLocation;
