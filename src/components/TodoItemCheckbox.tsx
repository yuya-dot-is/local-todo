import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  checked: boolean
  handleCheck: () => void
}

export default function TodoItemCheckbox({ checked, handleCheck }: Props) {
  return (
    <div className="relative flex-shrink-0 w-8 h-8">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleCheck}
        className={`
          w-8 h-8 border-2 transition-colors duration-200
          flex items-center justify-center
          ${checked
            ? 'bg-accent border-accent shadow-md'
            : 'border-black/15 hover:border-accent/70 bg-white'
          }
        `}
        aria-label={checked ? '未完了にする' : '完了にする'}
        style={{ boxShadow: checked ? '0 2px 8px rgba(22,163,74,0.35)' : undefined }}
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
    </div>
  )
}