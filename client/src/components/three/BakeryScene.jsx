/**
 * Cakes and Crunches — 3D Bakery Scene
 *
 * Renders an animated bakery-like scene with baking spark particles
 * and floating baked shapes using React Three Fiber.
 */

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function FlourParticles({ count = 80 }) {
  const pointsRef = useRef();

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 1] = Math.random() * 3 - 1.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      spd[i] = 0.005 + Math.random() * 0.01;
    }
    return [pos, spd];
  }, [count]);

  useFrame(() => {
    if (pointsRef.current) {
      const positionsArray = pointsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        // Fall down, then reset to the top
        positionsArray[i * 3 + 1] -= speeds[i];
        if (positionsArray[i * 3 + 1] < -1.5) {
          positionsArray[i * 3 + 1] = 1.5;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.rotation.y += 0.002;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#FBBF24"
        size={0.06}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FloatingObjects() {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Floating Donut shape */}
      <mesh position={[-1.2, 0.5, 0]} rotation={[0.4, 0.2, 0.5]}>
        <torusGeometry args={[0.3, 0.12, 16, 100]} />
        <meshStandardMaterial color="#EC4899" roughness={0.3} />
      </mesh>

      {/* Floating Cupcake shape (represented as cylinder + sphere) */}
      <group position={[1.5, -0.4, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.2, 0.15, 0.3, 16]} />
          <meshStandardMaterial color="#7C3AED" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#FBBF24" roughness={0.2} />
        </mesh>
      </group>

      {/* Center bakery display cake pedestal */}
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.8, 0.9, 0.15, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.5, 32]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
      </mesh>
    </group>
  );
}

export default function BakeryScene() {
  return (
    <div className="w-full h-80 md:h-[400px]">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 4.2]} />
        <ambientLight intensity={1.2} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#8B5CF6" />
        <pointLight position={[-5, 5, -5]} intensity={1.2} color="#EC4899" />
        <spotLight position={[0, 8, 0]} intensity={1} color="#FBBF24" />
        <FloatingObjects />
        <FlourParticles count={100} />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
