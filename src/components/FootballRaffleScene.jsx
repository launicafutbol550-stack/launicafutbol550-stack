import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  Float,
  OrbitControls,
  useTexture,
} from '@react-three/drei';

function SoccerBall({ spinning }) {
  const meshRef = useRef(null);

  const texture = useTexture('/football-texture.svg');

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const elapsed = state.clock.getElapsedTime();
    const spinBoost = spinning ? 1 : 0;

    const targetSpinY = spinning ? 7.2 : 1.6;
    const targetSpinX = spinning ? 3.1 : 0.7;

    meshRef.current.rotation.y += delta * targetSpinY;
    meshRef.current.rotation.x += delta * targetSpinX;

    // Leve vaivén para que la pelota no se vea "suspendida" de forma rígida.
    meshRef.current.position.y =
      0.07 * Math.sin(elapsed * (1.3 + spinBoost * 2.8)) +
      0.025 * Math.sin(elapsed * (2.7 + spinBoost * 4.4));

    // Pequeño bamboleo de eje para simular desbalance real al girar rápido.
    meshRef.current.rotation.z =
      (spinning ? 0.16 : 0.05) * Math.sin(elapsed * (2.4 + spinBoost * 1.6));
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[1.1, 96, 96]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.48}
        metalness={0.12}
        envMapIntensity={0.8}
      />
    </mesh>
  );
}

function FootballRaffleScene({ spinning }) {
  return (
    <div className="football-scene" aria-hidden="true">
      <Canvas camera={{ position: [0, 0.25, 3.8], fov: 46 }} shadows dpr={[1, 2]}>
        <ambientLight intensity={0.45} />
        <hemisphereLight args={['#dbeafe', '#0b1220', 0.45]} />
        <spotLight
          position={[2.2, 4.4, 2.8]}
          angle={0.35}
          penumbra={0.7}
          intensity={1.45}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <Float
          speed={spinning ? 3.3 : 1.25}
          rotationIntensity={spinning ? 1.15 : 0.38}
          floatIntensity={spinning ? 0.7 : 0.35}
        >
          <SoccerBall spinning={spinning} />
        </Float>

        <ContactShadows
          position={[0, -1.28, 0]}
          opacity={0.5}
          scale={4.4}
          blur={2.3}
          far={2.2}
        />

        <Environment preset="studio" />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={spinning ? 1.45 : 0.42}
          maxPolarAngle={Math.PI / 1.85}
          minPolarAngle={Math.PI / 2.25}
        />
      </Canvas>
    </div>
  );
}

export default FootballRaffleScene;
