import { motion } from 'framer-motion'

interface Props {
  isHeader: boolean
  tabId: string
  itemId: string
  onEdit: () => void
  onDelete: () => void
  toggleRole: (tabId: string, id: string) => void
}

export default function TodoItemActions({
  isHeader,
  tabId,
  itemId,
  onEdit,
  onDelete,
  toggleRole,
}: Props) {
  return (
    <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => toggleRole(tabId, itemId)}
        title={isHeader ? "タスクに変更" : "ヘッダーに変更"}
        className={`
          w-10 h-10 flex items-center justify-center text-[10px] font-bold transition-colors
          ${isHeader ? 'text-white/70 hover:text-white hover:bg-white/20' : 'text-ink-faint hover:text-accent hover:bg-accent/8'}
        `}
      >
        {isHeader ? 'T' : 'H'}
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onEdit}
        title="編集"
        className={`
          w-10 h-10 flex items-center justify-center transition-colors
          ${isHeader ? 'text-white/70 hover:text-white hover:bg-white/20' : 'text-ink-faint hover:text-ink-muted hover:bg-black/6'}
        `}
      >
        <svg width="18" height="18" viewBox="0 0 12 12" fill="none">
          <path d="M8.5 1.5L10.5 3.5L4 10H2V8L8.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onDelete}
        title="削除"
        className={`
          w-10 h-10 flex items-center justify-center transition-colors
          ${isHeader ? 'text-white/70 hover:text-white hover:bg-white/20' : 'text-ink-faint hover:text-red-500 hover:bg-red-50'}
        `}
      >
        <svg width="16" height="18" viewBox="0 0 11 12" fill="none">
          <path d="M1 3H10M4 3V2H7V3M2 3L3 10H8L9 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>
    </div>
  )
}
