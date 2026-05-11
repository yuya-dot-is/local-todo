import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COLORS = ['#16a34a', '#22c55e', '#86efac', '#fb923c', '#a78bfa', '#38bdf8']

function ShootingStars({ count = 40 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null)

  const { positions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8
      vel[i * 3] = (Math.random() - 0.5) * 0.06
      vel[i * 3 + 1] = -(Math.random() * 0.05 + 0.01)
      vel[i * 3 + 2] = 0
      const c = new THREE.Color(COLORS[Math.floor(Math.random() * COLORS.length)])
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return { positions: pos, velocities: vel, colors: col }
  }, [count])

  useFrame(() => {
    if (!meshRef.current) return
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3] += velocities[i * 3]
      pos[i * 3 + 1] += velocities[i * 3 + 1]
      // wrap around when out of bounds
      if (pos[i * 3 + 1] < -9) {
        pos[i * 3 + 1] = 9
        pos[i * 3] = (Math.random() - 0.5) * 24
      }
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function SpinningGem({ position, color, speed, scale: sc }: {
  position: [number, number, number]
  color: string
  speed: number
  scale: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.rotation.x = t * speed
    ref.current.rotation.y = t * speed * 0.7
    ref.current.position.y = position[1] + Math.sin(t * 0.4 + position[0]) * 0.3
  })
  return (
    <mesh ref={ref} position={position} scale={sc}>
      <icosahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        transparent
        opacity={0.25}
        wireframe
      />
    </mesh>
  )
}

function PulsingOrb({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null)
  useFrame(({ clock }) => {
    if (!lightRef.current) return
    lightRef.current.intensity = 1.2 + Math.sin(clock.getElapsedTime() * 1.5) * 0.8
  })
  return (
    <>
      <pointLight ref={lightRef} position={position} color="#22c55e" intensity={1.5} distance={8} />
      <mesh position={position}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.35} />
      </mesh>
    </>
  )
}

function StarBurst() {
  const [stars] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 6,
      ] as [number, number, number],
      color: COLORS[i % COLORS.length],
      speed: 0.3 + Math.random() * 0.5,
      scale: 0.4 + Math.random() * 0.6,
    }))
  )
  return (
    <>
      {stars.map((s) => (
        <SpinningGem key={s.id} {...s} />
      ))}
    </>
  )
}

// Shimmer ring that pulses
function ShimmerRing({ position, radius, color }: {
  position: [number, number, number]
  radius: number
  color: string
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.rotation.z = t * 0.12
    ref.current.rotation.x = t * 0.08
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = 0.08 + Math.sin(t * 0.6) * 0.05
  })
  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[radius, 0.025, 6, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.12} />
    </mesh>
  )
}

// Bounce sparkle that appears periodically
function SparkleField() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.04
  })
  return (
    <group ref={groupRef}>
      <ShimmerRing position={[4, 2, -5]} radius={2.2} color="#16a34a" />
      <ShimmerRing position={[-5, -1, -6]} radius={3} color="#a78bfa" />
      <ShimmerRing position={[0, 4, -4]} radius={1.6} color="#fb923c" />
    </group>
  )
}

export default function Background3D() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <div
      className="fixed inset-0 -z-10"
      style={{ pointerEvents: 'none' }}
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 55 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.6} />
        <ShootingStars count={50} />
        <StarBurst />
        <SparkleField />
        <PulsingOrb position={[3, 3, -3]} />
        <PulsingOrb position={[-4, -2, -4]} />
      </Canvas>
    </div>
  )
}
