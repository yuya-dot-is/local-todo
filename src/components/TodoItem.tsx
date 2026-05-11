import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useAnimation, Reorder, useDragControls } from 'framer-motion'
import { useTodoStore } from '../store/useTodoStore'
import type { TodoItem as TodoItemType } from '../types'

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
}

export default function TodoItem({
  tabId,
  item,
}: Props) {
  const { toggleTodo, editTodo, deleteTodo } = useTodoStore()
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(item.title)
  const [justChecked, setJustChecked] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const checkControls = useAnimation()

  const dragControls = useDragControls()

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.select()
  }, [editing])

  // Update editValue when item title changes externally
  useEffect(() => {
    if (!editing) setEditValue(item.title)
  }, [item.title, editing])

  const commitEdit = () => {
    if (editValue.trim()) editTodo(tabId, item.id, editValue.trim())
    else setEditValue(item.title)
    setEditing(false)
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

  return (
    <Reorder.Item
      value={item}
      id={item.id}
      dragListener={false}
      dragControls={dragControls}
      className="group relative"
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={isDeleting
        ? { scale: [1, 1.08, 0], opacity: [1, 1, 0], rotate: [0, 6, -6], transition: { duration: 0.32 } }
        : { opacity: 1, y: 0, scale: 1 }
      }
      exit={{ opacity: 0, y: -6, scale: 0.94, height: 0, transition: { duration: 0.2 } }}
      whileDrag={{ scale: 1.02, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {/* explosion particles overlay */}
      <div className="relative">
        <DeleteParticles active={isDeleting} />

        <div
          className={`
            flex items-start gap-2 py-2 px-2 rounded-xl
            transition-colors duration-150
            hover:bg-black/[0.03] bg-white
          `}
        >
          {/* drag handle */}
          <button
            onPointerDown={(e) => dragControls.start(e)}
            style={{ touchAction: 'none' }}
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

          {/* empty spacer for alignment */}
          <span className="w-2 flex-shrink-0" />

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
    </Reorder.Item>
  )
}
