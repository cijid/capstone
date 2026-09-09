import { Entity, BillboardGraphics, LabelGraphics } from "resium";

import {
  Color,
  Cartesian2,
  HorizontalOrigin,
  VerticalOrigin,
  DistanceDisplayCondition,
} from "cesium";

import satelliteIcon from "../assets/BlueSatelliteOutline.png";

function Satellite({ satellite, onSelect }) {
  if (!satellite?.position) {
    return null;
  }

  return (
    <Entity
      id={`satellite-${satellite.id}`}
      name={satellite.name}
      position={satellite.position}
      onClick={() => onSelect(satellite)}
    >
      <BillboardGraphics
        image={satelliteIcon}
        width={32}
        height={32}
        horizontalOrigin={HorizontalOrigin.CENTER}
        verticalOrigin={VerticalOrigin.CENTER}
        distanceDisplayCondition={new DistanceDisplayCondition(0, 50000000)}
      />

      <LabelGraphics
        text={satellite.name}
        font="12px sans-serif"
        fillColor={Color.WHITE}
        outlineColor={Color.BLACK}
        outlineWidth={2}
        pixelOffset={new Cartesian2(20, -16)}
        horizontalOrigin={HorizontalOrigin.LEFT}
        verticalOrigin={VerticalOrigin.CENTER}
        distanceDisplayCondition={new DistanceDisplayCondition(0, 50000000)}
      />
    </Entity>
  );
}

export default Satellite;
