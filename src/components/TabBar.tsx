import { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { useTodoStore } from '../store/useTodoStore'
import InfoTab from './InfoTab'
import TabItem from './TabItem'

export default function TabBar() {
  const { tabs, activeTabIndex, addTab, renameTab, deleteTab, setActiveTab, reorderTabs, showInfoTab, setShowInfoTab } =
    useTodoStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const startEdit = (tabId: string, name: string) => {
    setEditingId(tabId)
    setEditValue(name)
  }

  const commitEdit = () => {
    if (editingId && editValue.trim()) renameTab(editingId, editValue.trim())
    setEditingId(null)
  }

  const handleReorder = (newOrder: typeof tabs) => {
    reorderTabs(newOrder as any)
  }

  return (
    <div className="flex items-end pr-4 pt-4 pb-0">
      <InfoTab
        isActive={showInfoTab}
        onClick={() => setShowInfoTab(true)}
      />

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
                <TabItem
                  key={tab.id}
                  tab={tab}
                  isActive={isActive}
                  isEditing={editingId === tab.id}
                  editValue={editValue}
                  onSetEditValue={setEditValue}
                  onStartEdit={() => startEdit(tab.id, tab.name)}
                  onCommitEdit={commitEdit}
                  onCancelEdit={() => setEditingId(null)}
                  onSelect={() => setActiveTab(idx)}
                  canDelete={tabs.length > 1}
                  onDelete={() => {
                    if (window.confirm(`タブ「${tab.name}」を削除してもよろしいですか？`)) {
                      if (isActive && idx > 0) setActiveTab(idx - 1)
                      deleteTab(tab.id)
                    }
                  }}
                />
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