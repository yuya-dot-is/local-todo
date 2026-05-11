import { motion } from 'framer-motion'

interface Props {
  onDelete: () => void
}

export default function TodoItemActions({ onDelete }: Props) {
  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={(e) => { e.stopPropagation(); onDelete() }}
        className="w-10 h-10 flex items-center justify-center text-ink-faint hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
      >
        <svg width="16" height="18" viewBox="0 0 11 12" fill="none">
          <path d="M1 3H10M4 3V2H7V3M2 3L3 10H8L9 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>
    </div>
  )
}
