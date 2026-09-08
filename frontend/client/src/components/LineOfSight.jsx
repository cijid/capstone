import { Line } from "@react-three/drei";

function LineOfSight({ start, end }) {
  if (!start || !end) {
    return null;
  }

  return <Line points={[start, end]} lineWidth={2} />;
}

export default LineOfSight;
