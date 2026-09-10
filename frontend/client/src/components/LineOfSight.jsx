import { Entity, PolylineGraphics } from "resium";

import { Color, ArcType } from "cesium";

function LineOfSight({ start, end, visible }) {
  if (!visible || !start || !end) {
    return null;
  }

  return (
    <Entity>
      <PolylineGraphics
        positions={[start, end]}
        width={3}
        material={Color.LIME.withAlpha(0.9)}
        arcType={ArcType.NONE}
      />
    </Entity>
  );
}

export default LineOfSight;
