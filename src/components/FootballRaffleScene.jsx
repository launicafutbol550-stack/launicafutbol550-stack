import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, OrbitControls, useTexture } from '@react-three/drei';

function SoccerBall({ spinning }) {
  const meshRef = useRef(null);
  const texture = useTexture('/football-texture.svg');

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * (spinning ? 4.8 : 1.2);
    meshRef.current.rotation.x += delta * (spinning ? 1.9 : 0.4);
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[1.1, 64, 64]} />
      <meshStandardMaterial map={texture} roughness={0.52} metalness={0.18} />
    </mesh>
  );
}

function FootballRaffleScene({ spinning }) {
  return (
    <div className="football-scene" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 3.6], fov: 48 }}>
        <ambientLight intensity={0.65} />
        <directionalLight position={[3, 3, 3]} intensity={1.4} castShadow />
        <Float speed={spinning ? 2.6 : 1.25} rotationIntensity={spinning ? 1.4 : 0.6} floatIntensity={spinning ? 1.2 : 0.6}>
          <SoccerBall spinning={spinning} />
        </Float>
        <Environment preset="city" />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={spinning ? 3.4 : 0.8} />
      </Canvas>
    </div>
  );
}

export default FootballRaffleScene;
