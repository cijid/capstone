import { Entity, PointGraphics, LabelGraphics } from "resium";

import {
  Color,
  Cartesian2,
  HorizontalOrigin,
  VerticalOrigin,
  DistanceDisplayCondition,
} from "cesium";

function Satellite({ satellite, onSelect }) {
  if (!satellite?.position) {
    return null;
  }

  return (
    <Entity
      id={`satellite-${satellite.noradId}`}
      name={satellite.name}
      position={satellite.position}
      onClick={() => onSelect(satellite)}
    >
      <PointGraphics
        pixelSize={9}
        color={satellite.visible ? Color.LIME : Color.YELLOW}
        outlineColor={Color.BLACK}
        outlineWidth={1}
      />

      <LabelGraphics
        text={satellite.name}
        font="12px sans-serif"
        fillColor={Color.WHITE}
        outlineColor={Color.BLACK}
        outlineWidth={2}
        pixelOffset={new Cartesian2(12, -12)}
        horizontalOrigin={HorizontalOrigin.LEFT}
        verticalOrigin={VerticalOrigin.CENTER}
        distanceDisplayCondition={new DistanceDisplayCondition(0, 50000000)}
      />
    </Entity>
  );
}

export default Satellite;
