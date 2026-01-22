import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function AdvancedRobotModel(props) {
    const groupRef = useRef();
    const { viewport } = useThree();

    useFrame((state) => {
        if (!groupRef.current) return;

        // Mouse tracking: subtly follow cursor
        const x = (state.mouse.x * viewport.width) / 2;
        const y = (state.mouse.y * viewport.height) / 2;

        // Calculate targets for smooth lookAt
        const target = new THREE.Vector3(x * 0.3, y * 0.3, 5);
        groupRef.current.lookAt(target);

        // Subtly rotate based on mouse for extra depth
        groupRef.current.rotation.y += (state.mouse.x * 0.2 - groupRef.current.rotation.y) * 0.1;
        groupRef.current.rotation.x += (-state.mouse.y * 0.2 - groupRef.current.rotation.x) * 0.1;
    });

    return (
        <group ref={groupRef} {...props}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>

                {/* INNER TECH CORE */}
                <mesh>
                    <sphereGeometry args={[1.2, 32, 32]} />
                    <meshStandardMaterial color="#050505" roughness={0.3} metalness={0.8} />
                </mesh>

                {/* MAIN BODY SHELL (Broken into panels) */}
                <group scale={[1.4, 1.4, 1.4]}>
                    {/* Top Hemisphere Panel */}
                    <mesh castShadow receiveShadow>
                        <sphereGeometry args={[1, 64, 32, 0, Math.PI * 2, 0, 0.45]} />
                        <meshPhysicalMaterial
                            color="#f0f0f0"
                            roughness={0.1}
                            metalness={0.2}
                            clearcoat={1}
                            clearcoatRoughness={0.1}
                        />
                    </mesh>

                    {/* Bottom Hemisphere Panel */}
                    <mesh castShadow receiveShadow rotation={[Math.PI, 0, 0]}>
                        <sphereGeometry args={[1, 64, 32, 0, Math.PI * 2, 0, 0.45]} />
                        <meshPhysicalMaterial
                            color="#f0f0f0"
                            roughness={0.1}
                            metalness={0.2}
                            clearcoat={1}
                            clearcoatRoughness={0.1}
                        />
                    </mesh>

                    {/* Central Girdle / Ring */}
                    <mesh>
                        <torusGeometry args={[0.98, 0.05, 16, 100]} />
                        <meshStandardMaterial color="#222" metalness={1} roughness={0.2} />
                    </mesh>

                    {/* Glowing Blue Equator Ring */}
                    <mesh>
                        <torusGeometry args={[0.99, 0.02, 16, 100]} />
                        <meshBasicMaterial color="#00f2ff" />
                        <pointLight color="#00f2ff" intensity={0.5} distance={2} />
                    </mesh>
                </group>

                {/* MAIN FRONT LENS (Eye) */}
                <group position={[0, 0, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
                    {/* Lens Bezel */}
                    <mesh>
                        <torusGeometry args={[0.6, 0.08, 16, 64]} />
                        <meshStandardMaterial color="#111" metalness={1} roughness={0.1} />
                    </mesh>

                    {/* Outer Lens Glass */}
                    <mesh position={[0, 0.1, 0]}>
                        <sphereGeometry args={[0.55, 32, 32, 0, Math.PI * 2, 0, 0.5]} />
                        <meshPhysicalMaterial
                            color="#0066ff"
                            transmission={1}
                            thickness={0.5}
                            roughness={0}
                            metalness={0.1}
                            transparent
                            opacity={0.6}
                        />
                    </mesh>

                    {/* Glowing Pupil */}
                    <mesh position={[0, 0.05, 0]}>
                        <sphereGeometry args={[0.2, 32, 32]} />
                        <meshBasicMaterial color="#00f2ff" />
                        <pointLight color="#00f2ff" intensity={5} distance={4} />
                    </mesh>

                    {/* Iris Glow Ring */}
                    <mesh position={[0, 0.06, 0]}>
                        <torusGeometry args={[0.35, 0.02, 16, 64]} />
                        <meshBasicMaterial color="#00f2ff" />
                    </mesh>
                </group>

                {/* SIDE SENSOR UNITS (Left) */}
                <group position={[-1.1, 0, 0.4]} rotation={[0, -Math.PI / 4, 0]}>
                    <mesh>
                        <sphereGeometry args={[0.3, 16, 16]} />
                        <meshStandardMaterial color="#111" metalness={1} />
                    </mesh>
                    <mesh position={[0, 0, 0.25]}>
                        <sphereGeometry args={[0.15, 16, 16]} />
                        <meshBasicMaterial color="#00f2ff" />
                        <pointLight color="#00f2ff" intensity={1} distance={2} />
                    </mesh>
                </group>

                {/* SIDE SENSOR UNITS (Right) */}
                <group position={[1.1, 0, 0.4]} rotation={[0, Math.PI / 4, 0]}>
                    <mesh>
                        <sphereGeometry args={[0.3, 16, 16]} />
                        <meshStandardMaterial color="#111" metalness={1} />
                    </mesh>
                    <mesh position={[0, 0, 0.25]}>
                        <sphereGeometry args={[0.15, 16, 16]} />
                        <meshBasicMaterial color="#00f2ff" />
                        <pointLight color="#00f2ff" intensity={1} distance={2} />
                    </mesh>
                </group>

                {/* ADDITIONAL GLOWING DOTS (Detailing) */}
                {[...Array(8)].map((_, i) => (
                    <mesh key={i} rotation={[0, (i * Math.PI) / 4, 0]} position={[0, 1.35, 0]}>
                        <sphereGeometry args={[0.02, 8, 8]} />
                        <meshBasicMaterial color="#00f2ff" />
                    </mesh>
                ))}

            </Float>
        </group>
    );
}

export default function ThreeDRobot() {
    return (
        <div style={{ width: '100%', height: '100%', minHeight: '500px' }}>
            <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.4} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#00f2ff" />

                <AdvancedRobotModel position={[0, 0, 0]} />

                <Environment preset="city" />
                <ContactShadows position={[0, -2.2, 0]} opacity={0.4} scale={10} blur={2} far={4} color="#00f2ff" />
            </Canvas>
        </div>
    );
}
