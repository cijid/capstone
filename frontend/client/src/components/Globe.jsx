import { useTexture } from "@react-three/drei";

import earthTexture from "../assets/earth.jpg";

function Globe() {
  const texture = useTexture(earthTexture);

  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />

      <meshStandardMaterial map={texture} roughness={0.8} metalness={0} />
    </mesh>
  );
}

export default Globe;
