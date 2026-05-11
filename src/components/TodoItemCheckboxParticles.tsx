import { motion } from 'framer-motion'

const CHECK_COLORS = [
    '#16a34a',
    '#22c55e',
    '#86efac',
    '#fb923c',
    '#a78bfa',
    '#38bdf8',
    '#fbbf24',
    '#f472b6',
]

interface Props {
    active: boolean
}

export default function TodoItemCheckboxParticles({ active }: Props) {
    console.log(active);
    if (!active) return null
    return (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
            {CHECK_COLORS.map((color, i) => {
                const angle = (i / CHECK_COLORS.length) * 2 * Math.PI
                const dist = 22 + Math.random() * 10
                const tx = Math.cos(angle) * dist
                const ty = Math.sin(angle) * dist
                return (
                    <motion.div
                        key={i}
                        initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                        animate={{ x: tx, y: ty, scale: 0, opacity: 0 }}
                        transition={{ duration: 0.55, ease: 'easeOut', delay: i * 0.015 }}
                        style={{ background: color }}
                        className="absolute left-1/2 top-1/2 w-2 h-2 -ml-1 -mt-1 rounded-full"
                    />
                )
            })}
        </div>
    )
}