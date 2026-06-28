/**
 * Cakes and Crunches — 3D Floating Cake
 *
 * Renders an interactive 3D Cake object using React Three Fiber.
 * Auto-rotates and reacts to pointer hover.
 */

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

function CakeModel() {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Animate rotation on every frame
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.15;
    }
  });

  return (
    <group
      ref={meshRef}
      scale={hovered ? 1.15 : 1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Tier 1 (Base) */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.5, 32]} />
        <meshStandardMaterial color="#7C3AED" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Tier 2 (Middle) */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.5, 32]} />
        <meshStandardMaterial color="#EC4899" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Tier 3 (Top) */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.5, 32]} />
        <meshStandardMaterial color="#F59E0B" roughness={0.2} metalness={0.2} />
      </mesh>

      {/* Cake Cherry Topping */}
      <mesh position={[0, 0.75, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#EF4444" roughness={0.1} />
      </mesh>
    </group>
  );
}

export default function FloatingCake() {
  return (
    <div className="w-full h-64 md:h-80 cursor-grab active:cursor-grabbing">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 4.5]} />
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight position={[-10, 10, -10]} intensity={1} />
        <CakeModel />
        <OrbitControls enableZoom={false} autoRotate={false} />
      </Canvas>
    </div>
  );
}
