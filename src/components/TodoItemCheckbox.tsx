import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  checked: boolean
  handleCheck: (e: React.MouseEvent) => void
  disabled?: boolean
}

export default function TodoItemCheckbox({ checked, handleCheck, disabled }: Props) {
  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.9 }}
      onClick={(e) => !disabled && handleCheck(e)}
      className={`
        w-6 h-6 border-[1.5px] rounded-md flex items-center justify-center transition-all
        ${checked ? 'bg-accent border-accent' : 'border-black/15 bg-white'}
        ${disabled ? 'opacity-20 cursor-default' : 'opacity-100'}
      `}
      aria-label={checked ? '未完了にする' : '完了にする'}
      disabled={disabled}
    >
      <AnimatePresence>
        {checked && (
          <motion.svg
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            width="12"
            height="10"
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