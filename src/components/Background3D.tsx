import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count = 120 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null)

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const sz = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
      sz[i] = Math.random() * 0.04 + 0.01
    }
    return [pos, sz]
  }, [count])

  useFrame(({ clock }) => {
    if (!mesh.current) return
    mesh.current.rotation.y = clock.getElapsedTime() * 0.03
    mesh.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.015) * 0.1
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#7c6af5"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function FloatingRing() {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()
    mesh.current.rotation.x = t * 0.07
    mesh.current.rotation.z = t * 0.04
    mesh.current.position.y = Math.sin(t * 0.3) * 0.3
  })

  return (
    <mesh ref={mesh} position={[3, 1, -4]}>
      <torusGeometry args={[1.5, 0.03, 8, 80]} />
      <meshBasicMaterial color="#7c6af5" transparent opacity={0.15} />
    </mesh>
  )
}

function FloatingRing2() {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()
    mesh.current.rotation.y = t * 0.05
    mesh.current.rotation.x = t * 0.09
    mesh.current.position.x = Math.sin(t * 0.2) * 0.4
  })

  return (
    <mesh ref={mesh} position={[-4, -2, -5]}>
      <torusGeometry args={[2, 0.025, 8, 80]} />
      <meshBasicMaterial color="#a78bfa" transparent opacity={0.1} />
    </mesh>
  )
}

export default function Background3D() {
  return (
    <div
      className="fixed inset-0 -z-10"
      style={{ pointerEvents: 'none' }}
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Particles />
        <FloatingRing />
        <FloatingRing2 />
      </Canvas>
    </div>
  )
}
