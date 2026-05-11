import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { useTodoStore } from '../store/useTodoStore'

export default function TabBar() {
  const { tabs, activeTabIndex, addTab, renameTab, deleteTab, setActiveTab, reorderTabs, showInfoTab, setShowInfoTab } =
    useTodoStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingId && inputRef.current) inputRef.current.focus()
  }, [editingId])

  const startEdit = (tabId: string, name: string) => {
    setEditingId(tabId)
    setEditValue(name)
  }

  const commitEdit = () => {
    if (editingId && editValue.trim()) renameTab(editingId, editValue.trim())
    setEditingId(null)
  }

  // バグ修正: newOrderをそのままストアに渡すよう修正
  const handleReorder = (newOrder: typeof tabs) => {
    reorderTabs(newOrder as any)
  }

  return (
    <div className="flex items-end pr-4 pt-4 pb-0">
      {/* Info Tab Icon (Fixed on left) */}
      <div
        className={`
          flex items-center justify-center px-1 py-1 cursor-pointer
          border border-b-0 transition-colors flex-shrink-0
          ${showInfoTab
            ? 'bg-white border-black/8 shadow-tab text-accent'
            : 'bg-accent border-transparent text-white hover:bg-accent-hover'
          }
        `}
        style={{ borderRadius: 0 }}
        onClick={() => setShowInfoTab(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </div>

      <div className="flex-1 flex items-center gap-1 ml-1 overflow-x-auto scrollbar-thin">
        <Reorder.Group
          axis="x"
          values={tabs}
          onReorder={handleReorder}
          className="flex items-center gap-1"
        >
          <AnimatePresence initial={false}>
            {tabs.map((tab, idx) => {
              const isActive = idx === activeTabIndex && !showInfoTab
              return (
                <Reorder.Item
                  key={tab.id}
                  value={tab}
                  dragListener={editingId !== tab.id}
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
                    onClick={() => setActiveTab(idx)}
                    onDoubleClick={() => startEdit(tab.id, tab.name)}
                  >
                    {editingId === tab.id ? (
                      <input
                        ref={inputRef}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitEdit()
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-transparent outline-none w-24 text-ink"
                      />
                    ) : (
                      <span className="max-w-[120px] truncate">{tab.name}</span>
                    )}
                    {tabs.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (window.confirm(`タブ「${tab.name}」を削除してもよろしいですか？`)) {
                            if (isActive && idx > 0) setActiveTab(idx - 1)
                            deleteTab(tab.id)
                          }
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
            })}
          </AnimatePresence>
        </Reorder.Group>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={addTab}
          className="ml-1 w-8 h-8 flex items-center justify-center
          text-ink-faint hover:text-ink-muted hover:bg-black/8 transition-colors text-lg flex-shrink-0"
          aria-label="Add tab"
        >
          +
        </motion.button>

      </div>
    </div>
  )
}