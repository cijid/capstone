import { Html } from "@react-three/drei";

function Satellite({ position, name, onSelect }) {
  return (
    <group position={position}>
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
      >
        <sphereGeometry args={[0.05, 16, 16]} />

        <meshBasicMaterial color="yellow" />
      </mesh>

      <Html position={[0.08, 0.08, 0]} center distanceFactor={8}>
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

export default Satellite;
