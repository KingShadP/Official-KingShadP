"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, useGLTF, Text, Center, useScroll, ScrollControls, Scroll } from "@react-three/drei";
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
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 5 - r1 * 3, 0.1);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, r1 * 2, 0.1);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// 3D Object (Helmet / Abstract Geometry)
function CentralArtifact() {
  const meshRef = useRef<THREE.Group>(null);
  const scroll = useScroll();

  // Architecture for Draco compression (Helmet-21.glb example)
  // To actually use this: ensure draco binaries are in public/draco/
  /*
  const { scene } = useGLTF('/helmet-21.glb', '/draco-gltf/'); 
  */

  useFrame((state, delta) => {
    if (!meshRef.current || !scroll) return;
    
    // Rotate object based on scroll
    const r1 = scroll.range(0, 1);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, state.clock.elapsedTime * 0.2 + r1 * Math.PI * 2, 0.1);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, r1 * Math.PI, 0.1);
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={meshRef}>
        <mesh>
          <icosahedronGeometry args={[1.5, 4]} />
          <meshStandardMaterial 
            color="#dcc57b"
            metalness={0.9} 
            roughness={0.1} 
            envMapIntensity={1.5}
            wireframe={false}
          />
        </mesh>
      </group>
    </Float>
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
          <ScrollControls pages={3} damping={0.1}>
            <DynamicEnvironment />
            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 10, 5]} intensity={1} color="#f4f1eb" />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#93000a" />
            
            <CentralArtifact />
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
            </Scroll>

            <Scroll html>
              <div className="w-screen flex justify-center pt-[50vh] pb-[100vh]">
                <h1 className="text-ivory font-serif text-5xl md:text-8xl opacity-20 pointer-events-none text-center mix-blend-difference">
                  SCROLL TO INITIALIZE
                </h1>
              </div>
            </Scroll>
          </ScrollControls>
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-30 pointer-events-none" />
    </div>
  );
}
