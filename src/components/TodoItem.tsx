import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTodoStore } from '../store/useTodoStore'
import type { TodoItem as TodoItemType } from '../types'
import TodoList from './TodoList'

interface Props {
  tabId: string
  item: TodoItemType
  parentId: string | null  // kept for future reorder-to-parent operations
  depth: number
}

export default function TodoItem({ tabId, item, parentId: _parentId, depth }: Props) {
  const { toggleTodo, editTodo, deleteTodo, addTodo } = useTodoStore()
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(item.title)
  const [expanded, setExpanded] = useState(true)
  const [showAddChild, setShowAddChild] = useState(false)
  const [childInput, setChildInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const childInputRef = useRef<HTMLInputElement>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.select()
  }, [editing])

  useEffect(() => {
    if (showAddChild && childInputRef.current) childInputRef.current.focus()
  }, [showAddChild])

  const commitEdit = () => {
    if (editValue.trim()) editTodo(tabId, item.id, editValue.trim())
    else setEditValue(item.title)
    setEditing(false)
  }

  const commitAddChild = () => {
    if (childInput.trim()) {
      addTodo(tabId, item.id, childInput.trim())
      setExpanded(true)
    }
    setChildInput('')
    setShowAddChild(false)
  }

  const canNest = depth < 2

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95, height: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`group ${depth > 0 ? 'ml-5 border-l border-white/5 pl-3' : ''}`}
    >
      <div
        className={`
          flex items-start gap-2 py-1.5 px-2 rounded-lg
          hover:bg-white/5 transition-colors
        `}
      >
        {/* drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 flex-shrink-0 w-4 h-4 flex items-center justify-center
            text-white/20 hover:text-white/50 cursor-grab active:cursor-grabbing
            opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Drag to reorder"
        >
          ⠿
        </button>

        {/* expand/collapse toggle for items with children */}
        {item.children.length > 0 ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-0.5 flex-shrink-0 w-4 h-4 flex items-center justify-center
              text-white/30 hover:text-white/60 transition-all"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            <motion.span
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.15 }}
              className="inline-block text-xs leading-none"
            >
              ▶
            </motion.span>
          </button>
        ) : (
          <span className="w-4 flex-shrink-0" />
        )}

        {/* checkbox */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => toggleTodo(tabId, item.id)}
          className={`
            mt-0.5 flex-shrink-0 w-4 h-4 rounded border transition-all
            flex items-center justify-center
            ${item.checked
              ? 'bg-accent border-accent text-white'
              : 'border-white/20 hover:border-accent/60'
            }
          `}
          aria-label={item.checked ? 'Mark incomplete' : 'Mark complete'}
        >
          <AnimatePresence>
            {item.checked && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="text-[10px] leading-none"
              >
                ✓
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* title */}
        {editing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitEdit()
              if (e.key === 'Escape') {
                setEditValue(item.title)
                setEditing(false)
              }
            }}
            className="flex-1 bg-white/10 rounded px-2 py-0.5 text-sm text-white
              outline-none border border-accent/50 focus:border-accent"
          />
        ) : (
          <span
            onDoubleClick={() => setEditing(true)}
            className={`
              flex-1 text-sm leading-relaxed cursor-default
              transition-all duration-300
              ${item.checked ? 'line-through text-white/30' : 'text-white/85'}
            `}
          >
            {item.title}
          </span>
        )}

        {/* actions */}
        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {canNest && (
            <button
              onClick={() => setShowAddChild(true)}
              className="w-5 h-5 flex items-center justify-center rounded text-white/30
                hover:text-accent hover:bg-accent/10 transition-colors text-xs"
              aria-label="Add child task"
              title="Add subtask"
            >
              ⊕
            </button>
          )}
          <button
            onClick={() => setEditing(true)}
            className="w-5 h-5 flex items-center justify-center rounded text-white/30
              hover:text-white/70 hover:bg-white/10 transition-colors text-xs"
            aria-label="Edit task"
          >
            ✎
          </button>
          <button
            onClick={() => deleteTodo(tabId, item.id)}
            className="w-5 h-5 flex items-center justify-center rounded text-white/30
              hover:text-red-400 hover:bg-red-400/10 transition-colors text-xs"
            aria-label="Delete task"
          >
            ✕
          </button>
        </div>
      </div>

      {/* add child input */}
      <AnimatePresence>
        {showAddChild && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-9 mt-1 overflow-hidden"
          >
            <input
              ref={childInputRef}
              value={childInput}
              onChange={(e) => setChildInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitAddChild()
                if (e.key === 'Escape') {
                  setChildInput('')
                  setShowAddChild(false)
                }
              }}
              onBlur={commitAddChild}
              placeholder="New subtask…"
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-1.5
                text-sm text-white placeholder-white/25 outline-none
                focus:border-accent/50 transition-colors"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* children */}
      <AnimatePresence initial={false}>
        {expanded && item.children.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <TodoList
              tabId={tabId}
              todos={item.children}
              parentId={item.id}
              depth={depth + 1}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
