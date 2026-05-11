import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTodoStore } from '../store/useTodoStore'
import type { TodoItem as TodoItemType } from '../types'
import TodoList from './TodoList'

// ─── Particle burst on check ────────────────────────────────────────────────
const CHECK_COLORS = ['#16a34a', '#22c55e', '#86efac', '#fb923c', '#a78bfa', '#38bdf8', '#fbbf24', '#f472b6']

function CheckParticles({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
      {CHECK_COLORS.map((color, i) => {
        const angle = (i / CHECK_COLORS.length) * 2 * Math.PI
        const dist = 22 + Math.random() * 10
        const tx = Math.cos(angle) * dist
        const ty = Math.sin(angle) * dist
        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{ x: tx, y: ty, scale: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: i * 0.015 }}
            style={{ background: color }}
            className="absolute left-1/2 top-1/2 w-2 h-2 -ml-1 -mt-1 rounded-full"
          />
        )
      })}
    </div>
  )
}

// ─── Explosion fragments on delete ──────────────────────────────────────────
const FRAG_COLORS = ['#ef4444', '#f97316', '#eab308', '#8b5cf6']

function DeleteParticles({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 20 }}>
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * 2 * Math.PI + Math.random() * 0.4
        const dist = 30 + Math.random() * 30
        const tx = Math.cos(angle) * dist
        const ty = Math.sin(angle) * dist - 10
        const color = FRAG_COLORS[i % FRAG_COLORS.length]
        const size = 4 + Math.random() * 5
        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
            animate={{
              x: tx,
              y: ty,
              rotate: Math.random() * 360,
              scale: 0,
              opacity: 0,
            }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.01 }}
            style={{
              background: color,
              width: size,
              height: size,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
            className="absolute left-1/2 top-1/2"
          />
        )
      })}
    </div>
  )
}

// ─── Star sparkles that appear on check ──────────────────────────────────────
function StarSparkle({ active }: { active: boolean }) {
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

// ─── Main component ──────────────────────────────────────────────────────────
interface Props {
  tabId: string
  item: TodoItemType
  parentId: string | null
  depth: number
  hasPrevSibling: boolean
  isDragActive?: boolean
}

export default function TodoItem({
  tabId,
  item,
  parentId: _parentId,
  depth,
  hasPrevSibling,
  isDragActive: _isDragActive = false,
}: Props) {
  const { toggleTodo, editTodo, deleteTodo, addTodo, indentTodo, outdentTodo } = useTodoStore()
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(item.title)
  const [expanded, setExpanded] = useState(true)
  const [showAddChild, setShowAddChild] = useState(false)
  const [childInput, setChildInput] = useState('')
  const [justChecked, setJustChecked] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const childInputRef = useRef<HTMLInputElement>(null)
  const checkControls = useAnimation()

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
  }

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.select()
  }, [editing])

  useEffect(() => {
    if (showAddChild && childInputRef.current) childInputRef.current.focus()
  }, [showAddChild])

  // Update editValue when item title changes externally
  useEffect(() => {
    if (!editing) setEditValue(item.title)
  }, [item.title, editing])

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

  const handleCheck = useCallback(async () => {
    if (!item.checked) {
      // medal animation sequence
      await checkControls.start({
        scale: [1, 1.7, 1.4, 1.6, 1],
        rotate: [0, -15, 15, -8, 0],
        transition: { duration: 0.5, ease: 'easeOut' },
      })
      setJustChecked(true)
      setTimeout(() => setJustChecked(false), 700)
    }
    toggleTodo(tabId, item.id)
  }, [item.checked, tabId, item.id, toggleTodo, checkControls])

  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => deleteTodo(tabId, item.id), 350)
  }

  const canNest = depth < 2
  const canIndent = hasPrevSibling && depth < 2
  const canOutdent = depth > 0

  return (
    // Outer div holds dnd-kit ref + transform only — never mix with framer-motion layout
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative ${depth > 0 ? 'ml-6 border-l-2 border-accent/20 pl-3' : ''}`}
    >
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={isDeleting
        ? { scale: [1, 1.08, 0], opacity: [1, 1, 0], rotate: [0, 6, -6], transition: { duration: 0.32 } }
        : { opacity: isDragging ? 0.15 : 1, y: 0, scale: 1 }
      }
      exit={{ opacity: 0, y: -6, scale: 0.94, height: 0, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {/* explosion particles overlay */}
      <div className="relative">
        <DeleteParticles active={isDeleting} />

        <div
          className={`
            flex items-start gap-2 py-2 px-2 rounded-xl
            transition-colors duration-150
            ${isDragging ? 'opacity-20' : 'hover:bg-black/[0.03]'}
          `}
        >
          {/* drag handle */}
          <button
            {...attributes}
            {...listeners}
            className="mt-0.5 flex-shrink-0 w-5 h-5 flex items-center justify-center
              text-ink-faint hover:text-ink-muted cursor-grab active:cursor-grabbing
              opacity-0 group-hover:opacity-100 transition-opacity rounded"
            aria-label="ドラッグして並べ替え"
          >
            <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
              <circle cx="2.5" cy="2.5" r="1.5"/>
              <circle cx="7.5" cy="2.5" r="1.5"/>
              <circle cx="2.5" cy="7" r="1.5"/>
              <circle cx="7.5" cy="7" r="1.5"/>
              <circle cx="2.5" cy="11.5" r="1.5"/>
              <circle cx="7.5" cy="11.5" r="1.5"/>
            </svg>
          </button>

          {/* expand/collapse */}
          {item.children.length > 0 ? (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-0.5 flex-shrink-0 w-5 h-5 flex items-center justify-center
                text-ink-faint hover:text-ink-muted transition-all rounded"
              aria-label={expanded ? '折りたたむ' : '展開する'}
            >
              <motion.span
                animate={{ rotate: expanded ? 90 : 0 }}
                transition={{ duration: 0.15 }}
                className="inline-block text-[9px] leading-none"
              >
                ▶
              </motion.span>
            </button>
          ) : (
            <span className="w-5 flex-shrink-0" />
          )}

          {/* checkbox with medal animation */}
          <div className="relative mt-0.5 flex-shrink-0 w-5 h-5">
            <CheckParticles active={justChecked} />
            <StarSparkle active={justChecked} />
            <motion.button
              animate={checkControls}
              whileTap={{ scale: 0.85 }}
              onClick={handleCheck}
              className={`
                w-5 h-5 rounded-md border-2 transition-colors duration-200
                flex items-center justify-center
                ${item.checked
                  ? 'bg-accent border-accent shadow-md'
                  : 'border-black/15 hover:border-accent/70 bg-white'
                }
              `}
              aria-label={item.checked ? '未完了にする' : '完了にする'}
              style={{ boxShadow: item.checked ? '0 2px 8px rgba(22,163,74,0.35)' : undefined }}
            >
              <AnimatePresence>
                {item.checked && (
                  <motion.svg
                    key="check"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    width="11"
                    height="9"
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
                if (e.key === 'Tab') {
                  e.preventDefault()
                  commitEdit()
                  if (e.shiftKey && canOutdent) outdentTodo(tabId, item.id)
                  else if (!e.shiftKey && canIndent) indentTodo(tabId, item.id)
                }
              }}
              className="flex-1 bg-surface-2 rounded-lg px-2.5 py-1 text-sm text-ink
                outline-none border border-accent/40 focus:border-accent shadow-sm"
            />
          ) : (
            <span
              onDoubleClick={() => setEditing(true)}
              className={`
                flex-1 text-sm leading-relaxed cursor-default select-none
                transition-all duration-300
                ${item.checked ? 'line-through text-ink-faint' : 'text-ink'}
              `}
            >
              {item.title}
            </span>
          )}

          {/* action buttons */}
          <div className="flex items-center gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {canOutdent && (
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => outdentTodo(tabId, item.id)}
                title="一段上げる (Shift+Tab)"
                className="w-6 h-6 flex items-center justify-center rounded-md text-ink-faint
                  hover:text-accent hover:bg-accent/8 transition-colors text-xs"
              >
                ←
              </motion.button>
            )}
            {canIndent && (
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => indentTodo(tabId, item.id)}
                title="一段下げる (Tab)"
                className="w-6 h-6 flex items-center justify-center rounded-md text-ink-faint
                  hover:text-accent hover:bg-accent/8 transition-colors text-xs"
              >
                →
              </motion.button>
            )}
            {canNest && (
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setShowAddChild(true)}
                title="サブタスクを追加"
                className="w-6 h-6 flex items-center justify-center rounded-md text-ink-faint
                  hover:text-accent hover:bg-accent/8 transition-colors text-xs"
              >
                ⊕
              </motion.button>
            )}
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setEditing(true)}
              title="編集"
              className="w-6 h-6 flex items-center justify-center rounded-md text-ink-faint
                hover:text-ink-muted hover:bg-black/6 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8.5 1.5L10.5 3.5L4 10H2V8L8.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleDelete}
              title="削除"
              className="w-6 h-6 flex items-center justify-center rounded-md text-ink-faint
                hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <svg width="11" height="12" viewBox="0 0 11 12" fill="none">
                <path d="M1 3H10M4 3V2H7V3M2 3L3 10H8L9 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* add child input */}
      <AnimatePresence>
        {showAddChild && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-12 mt-1 overflow-hidden"
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
              placeholder="サブタスクを追加…"
              className="w-full bg-surface-2 border border-black/10 rounded-lg px-3 py-1.5
                text-sm text-ink placeholder-ink-faint outline-none
                focus:border-accent/40 transition-colors"
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
            className="overflow-hidden mt-0.5"
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
    </div>
  )
}
