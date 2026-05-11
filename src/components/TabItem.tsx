import { motion, Reorder } from 'framer-motion'
import { useRef, useEffect } from 'react'

interface Props {
  tab: { id: string; name: string }
  isActive: boolean
  isEditing: boolean
  editValue: string
  onSetEditValue: (val: string) => void
  onStartEdit: () => void
  onCommitEdit: () => void
  onCancelEdit: () => void
  onSelect: () => void
  onDelete: () => void
  canDelete: boolean
}

export default function TabItem({
  tab,
  isActive,
  isEditing,
  editValue,
  onSetEditValue,
  onStartEdit,
  onCommitEdit,
  onCancelEdit,
  onSelect,
  onDelete,
  canDelete,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus()
  }, [isEditing])

  return (
    <Reorder.Item
      key={tab.id}
      value={tab}
      dragListener={!isEditing}
    >
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className={`
          relative flex items-center gap-1 px-4 py-2 cursor-pointer
          text-sm font-medium select-none whitespace-nowrap
          border border-b-0 transition-colors
          ${isActive
            ? 'bg-white border-black/8 text-ink shadow-tab'
            : 'bg-surface-2/70 border-transparent text-ink-muted hover:text-ink hover:bg-white/60'
          }
        `}
        style={{ borderRadius: 0 }}
        onClick={onSelect}
        onDoubleClick={onStartEdit}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => onSetEditValue(e.target.value)}
            onBlur={onCommitEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onCommitEdit()
              if (e.key === 'Escape') onCancelEdit()
            }}
            onClick={(e) => e.stopPropagation()}
            className="bg-transparent outline-none w-24 text-ink"
          />
        ) : (
          <span className="max-w-[120px] truncate">{tab.name}</span>
        )}
        {canDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="ml-1 w-4 h-4 flex items-center justify-center
            text-ink-faint hover:text-ink-muted hover:bg-black/8 transition-colors"
            aria-label="Delete tab"
          >
            ×
          </button>
        )}
      </motion.div>
    </Reorder.Item>
  )
}
