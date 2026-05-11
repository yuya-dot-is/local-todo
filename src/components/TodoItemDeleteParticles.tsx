import { motion } from 'framer-motion'

const FRAG_COLORS = ['#ef4444', '#f97316', '#eab308', '#8b5cf6']

interface Props {
  active: boolean
}

export default function TodoItemDeleteParticles({ active }: Props) {
  if (!active) return null
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 20 }}>
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * 2 * Math.PI + Math.random() * 0.4
        const dist = 30 + Math.random() * 30
        const tx = Math.cos(angle) * dist
        const ty = Math.sin(angle) * dist - 10
        const color = FRAG_COLORS[i % FRAG_COLORS.length]
        const size = 4 + Math.random() * 5
        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
            animate={{
              x: tx,
              y: ty,
              rotate: Math.random() * 360,
              scale: 0,
              opacity: 0,
            }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.01 }}
            style={{
              background: color,
              width: size,
              height: size,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
            className="absolute left-1/2 top-1/2"
          />
        )
      })}
    </div>
  )
}
