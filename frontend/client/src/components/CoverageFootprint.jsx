import { useMemo } from "react";

import { Line } from "@react-three/drei";

import * as THREE from "three";

import {
  getCoverageFootprintPoints,
  getCoverageFootprintMesh,
} from "../util/satellitePosition";

function CoverageFootprint({
  latitude,
  longitude,
  altitude,
  minimumElevation = 10,
}) {
  const validPosition =
    latitude !== null &&
    latitude !== undefined &&
    longitude !== null &&
    longitude !== undefined &&
    altitude !== null &&
    altitude !== undefined;

  const outlinePoints = useMemo(() => {
    if (!validPosition) {
      return [];
    }

    return getCoverageFootprintPoints(
      latitude,
      longitude,
      altitude,
      minimumElevation,
    );
  }, [validPosition, latitude, longitude, altitude, minimumElevation]);

  const geometry = useMemo(() => {
    if (!validPosition) {
      return null;
    }

    const { vertices, indices } = getCoverageFootprintMesh(
      latitude,
      longitude,
      altitude,
      minimumElevation,
    );

    const bufferGeometry = new THREE.BufferGeometry();

    bufferGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3),
    );

    bufferGeometry.setIndex(indices);

    bufferGeometry.computeVertexNormals();

    return bufferGeometry;
  }, [validPosition, latitude, longitude, altitude, minimumElevation]);

  if (!validPosition || !geometry || outlinePoints.length < 2) {
    return null;
  }

  return (
    <group>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color="cyan"
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <Line points={outlinePoints} color="cyan" lineWidth={2} />
    </group>
  );
}

export default CoverageFootprint;
