import { Html } from "@react-three/drei";

function GroundLocation({ position, name }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.035, 16, 16]} />

        <meshBasicMaterial color="lime" />
      </mesh>

      <Html position={[0.07, 0.07, 0]} center distanceFactor={8}>
        <div
          style={{
            color: "white",
            fontSize: "12px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {name}
        </div>
      </Html>
    </group>
  );
}

export default GroundLocation;
