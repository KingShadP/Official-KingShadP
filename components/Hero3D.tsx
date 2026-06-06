"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, useGLTF, Text, Center, Stars, Scroll, ScrollControls, useScroll } from "@react-three/drei";
import { Suspense, useRef, useLayoutEffect, useState, useEffect } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";

// Helper to handle camera animation based on scroll
function CameraRig() {
  const { camera } = useThree();
  const scroll = useScroll();

  useFrame((state, delta) => {
    if (!scroll) return;
    
    // Lerp scroll position for smooth movement
    const r1 = scroll.range(0, 1);
    
    // Adjust camera position based on scroll
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 2 - r1 * 10, 0.1);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, r1 * 0.5, 0.1);
    camera.lookAt(0, 0, -20);
  });

  return null;
}

// 3D Object (Helmet / Abstract Geometry)
function MagmaShards() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const scroll = useScroll();
  const count = 300;
  
  const dummy = new THREE.Object3D();
  const initialPositions = useRef<THREE.Vector3[]>([]);
  const targetPositions = useRef<THREE.Vector3[]>([]);
  const rotations = useRef<THREE.Euler[]>([]);
  
  useLayoutEffect(() => {
    initialPositions.current = [];
    targetPositions.current = [];
    rotations.current = [];
    for (let i = 0; i < count; i++) {
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        const radius = Math.random() * 1.5;
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);
        
        initialPositions.current.push(new THREE.Vector3(x, y, z));
        
        const targetRadius = 15 + Math.random() * 20;
        targetPositions.current.push(new THREE.Vector3(
           (x / radius || 0) * targetRadius,
           (y / radius || 0) * targetRadius,
           (z / radius || 0) * targetRadius,
        ));
        
        rotations.current.push(new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI));
    }
  }, []);

  useFrame(() => {
    if (!meshRef.current || !scroll) return;
    const r1 = scroll.range(0, 1);
    
    // Burst starts around 0.1 scroll
    let progress = Math.max(0, Math.min(1, (r1 - 0.1) / 0.4));
    progress = 1 - Math.pow(1 - progress, 3);
    
    for (let i = 0; i < count; i++) {
        const p0 = initialPositions.current[i];
        const p1 = targetPositions.current[i];
        
        dummy.position.lerpVectors(p0, p1, progress);
        
        dummy.rotation.x = rotations.current[i].x + r1 * 20;
        dummy.rotation.y = rotations.current[i].y + r1 * 20;
        dummy.rotation.z = rotations.current[i].z + r1 * 20;
        
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} position={[0,0,-4]}>
      <tetrahedronGeometry args={[0.15, 0]} />
      <meshStandardMaterial color="#FFD700" emissive="#FF4500" emissiveIntensity={0.8} metalness={0.5} roughness={0.1} />
    </instancedMesh>
  );
}

function WhiteLine() {
   return (
    <mesh position={[0, -1, -50]} rotation={[Math.PI / 2, 0, 0]}>
       <cylinderGeometry args={[0.015, 0.015, 200, 8]} />
       <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
    </mesh>
   )
}

function Spaceship() {
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  
  useFrame(() => {
      if (!groupRef.current || !scroll) return;
      const r1 = scroll.range(0, 1);
      groupRef.current.position.z = THREE.MathUtils.lerp(10, -80, r1 * 1.5);
      groupRef.current.rotation.z = Math.sin(r1 * Math.PI * 8) * 0.2;
      groupRef.current.position.x = Math.sin(r1 * Math.PI * 3) * 1.5;
  });
  
  return (
    <group ref={groupRef} position={[2, 0, 10]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.4, 2, 4]} />
            <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0, 0.6]}>
            <boxGeometry args={[1.6, 0.1, 0.8]} />
            <meshStandardMaterial color="#333333" metalness={1} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 1]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color="#00ffff" />
        </mesh>
    </group>
  );
}

// Environmental State Toggle based on Scroll Section
function DynamicEnvironment() {
  const scroll = useScroll();
  const [preset, setPreset] = useState<"studio" | "city" | "night">("studio");

  useFrame(() => {
    if (!scroll) return;
    const r1 = scroll.range(0, 1);
    if (r1 < 0.33 && preset !== "studio") setPreset("studio");
    else if (r1 >= 0.33 && r1 < 0.66 && preset !== "night") setPreset("night");
    else if (r1 >= 0.66 && preset !== "city") setPreset("city");
  });

  return <Environment preset={preset} />;
}

export function Hero3D() {
  return (
    <div className="absolute inset-0 z-0 h-screen w-full bg-void">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ScrollControls pages={5} damping={0.1}>
            <DynamicEnvironment />
            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 10, 5]} intensity={1} color="#f4f1eb" />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#93000a" />
            
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <MagmaShards />
            <WhiteLine />
            <Spaceship />
            <CameraRig />
            
            <Scroll>
              {/* MSDF Typography inside WebGL context via drei Text (troika-three-text uses MSDF) */}
              <Center position={[0, -2, -2]}>
                <Text
                  font="https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkGpu8pnHXFAA_4Nro.woff"
                  fontSize={1.5}
                  color="#f4f1eb"
                  maxWidth={10}
                  textAlign="center"
                  lineHeight={1}
                  fillOpacity={0.1}
                  outlineWidth={0.02}
                  outlineColor="#dcc57b"
                >
                  PROTOCOL V9
                </Text>
              </Center>

              <Text
                font="https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkGpu8pnHXFAA_4Nro.woff"
                fontSize={0.8}
                color="#f4f1eb"
                position={[0, -6, -4]}
                fillOpacity={0.15}
                outlineWidth={0.01}
                outlineColor="#dcc57b"
              >
                SCROLL TO INITIALIZE
              </Text>
              <Text
                font="https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkGpu8pnHXFAA_4Nro.woff"
                fontSize={0.6}
                color="#f4f1eb"
                position={[0, -12, -4]}
                fillOpacity={0.1}
                outlineWidth={0.01}
                outlineColor="#dcc57b"
              >
                FRAGMENTATION
              </Text>
              <Text
                font="https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkGpu8pnHXFAA_4Nro.woff"
                fontSize={0.6}
                color="#f4f1eb"
                position={[0, -18, -4]}
                fillOpacity={0.1}
                outlineWidth={0.01}
                outlineColor="#dcc57b"
              >
                THE WHITE LINE
              </Text>
              <Text
                font="https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkGpu8pnHXFAA_4Nro.woff"
                fontSize={0.6}
                color="#f4f1eb"
                position={[0, -24, -4]}
                fillOpacity={0.1}
                outlineWidth={0.01}
                outlineColor="#dcc57b"
              >
                DIGITAL GALAXY
              </Text>
            </Scroll>
          </ScrollControls>
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-30 pointer-events-none" />
    </div>
  );
}
