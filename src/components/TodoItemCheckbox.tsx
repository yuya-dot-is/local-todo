import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  checked: boolean
  handleCheck: (e: React.MouseEvent) => void
}

export default function TodoItemCheckbox({ checked, handleCheck }: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={(e) => handleCheck(e)}
      className={`
        w-8 h-8 border-2 rounded-lg flex items-center justify-center transition-colors
        ${checked ? 'bg-accent border-accent' : 'border-black/15 bg-white'}
      `}
      aria-label={checked ? '未完了にする' : '完了にする'}
    >
      <AnimatePresence>
        {checked && (
          <motion.svg
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            width="16"
            height="13"
            viewBox="0 0 11 9"
            fill="none"
          >
            <path
              d="M1 4.5L4 7.5L10 1"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  )
}