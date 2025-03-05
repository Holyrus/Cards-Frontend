import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const Model = () => {
  const { scene } = useGLTF("/src/assets/3DModel/bamboo_shield.glb");
  const modelRef = useRef();

  // const rotationSpeed = 0.001; // Controls the speed of the oscillation
  // const rotationAmplitude = 0.5; // Maximum rotation value (±0.6 radians)

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.position.set(0, -0.5, 0)
      modelRef.current.rotation.set(0, 0.78, 0);
    }
  }, [])

  // Rotate model automatically
  useFrame(() => {
    if (modelRef.current) {
      // modelRef.current.rotation.x -= 0.0001;
      // modelRef.current.rotation.y += 0.001;
      // modelRef.current.rotation.z += 0.001;
      // modelRef.current.rotation.y = rotationAmplitude * Math.sin(rotationSpeed * performance.now());
    }
  });

  return <primitive ref={modelRef} object={scene} scale={1} />;
};

const ThreeDModel = () => {

  const [randomPhrase, setRandomPhrase] = useState('')

  const phrases = [
    'You did something for yourself today!',
    'Thank you for being so awesome!',
    'You can be happy with your progress!',
    'Keep up the good work!',
    'Education is the most powerful weapon!',
  ]

  useEffect(() => {
    const getRandomString = () => {
      const randomIndex = Math.floor(Math.random() * phrases.length)
      setRandomPhrase(phrases[randomIndex])
    }

    getRandomString()
  }, [])



  return (
    <div className="relative w-[200px] h-[180px] flex justify-center items-center bg-transparent">
      <Canvas camera={{ position: [1, 1, 1], fov: 55 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <Model />
        <OrbitControls enableZoom={false} enableDamping={true} enablePan={false} />
      </Canvas>
      <div className="absolute pointer-events-none bottom-10 rounded-xl w-[180px] h-[45px] bg-[#ffffffa4] border-1 border-[#dedede] flex items-center justify-center">
        <p className="px-1 py-0.5 text-[13px] text-center text-[#2f2f2f]">{randomPhrase}</p>
      </div>
    </div>
  );
};

export default ThreeDModel;
