import { motion } from "framer-motion"

export default function TodoItemCheckboxStartSparkle({ active }: { active: boolean }) {
    if (!active) return null
    const positions = [
        { x: -18, y: -18 }, { x: 18, y: -18 }, { x: -18, y: 18 }, { x: 18, y: 18 },
        { x: 0, y: -24 }, { x: 24, y: 0 },
    ]
    return (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 11 }}>
            {positions.map((pos, i) => (
                <motion.div
                    key={i}
                    className="absolute left-1/2 top-1/2 text-yellow-400"
                    style={{ fontSize: 10 + (i % 3) * 2 }}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                    animate={{
                        x: pos.x,
                        y: pos.y,
                        scale: [0, 1.4, 0],
                        opacity: [0, 1, 0],
                    }}
                    transition={{ duration: 0.6, delay: 0.05 + i * 0.03, ease: 'easeOut' }}
                >
                    ★
                </motion.div>
            ))}
        </div>
    )
}