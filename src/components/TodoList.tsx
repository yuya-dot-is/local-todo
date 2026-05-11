import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useTodoStore } from '../store/useTodoStore'
import type { TodoItem } from '../types'
import TodoItemComponent from './TodoItem'

// Lightweight preview rendered inside DragOverlay (no dnd hooks)
function DragPreview({ item, depth }: { item: TodoItem; depth: number }) {
  return (
    <div
      className={`
        flex items-center gap-2 py-1.5 px-3 rounded-xl
        bg-white shadow-card-hover border border-black/10
        text-sm text-ink font-medium
        ${depth > 0 ? 'ml-5' : ''}
      `}
      style={{ cursor: 'grabbing', transform: 'rotate(1.5deg)', transformOrigin: 'top left' }}
    >
      <span className="text-ink-faint">⠿</span>
      <span
        className={item.checked ? 'line-through text-ink-faint' : ''}
        style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        {item.title}
      </span>
      {item.children.length > 0 && (
        <span className="text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-full">
          +{item.children.length}
        </span>
      )}
    </div>
  )
}

interface Props {
  tabId: string
  todos: TodoItem[]
  parentId: string | null
  depth: number
}

export default function TodoList({ tabId, todos, parentId, depth }: Props) {
  const { addTodo, reorderTodos } = useTodoStore()
  const [inputValue, setInputValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [activeItem, setActiveItem] = useState<TodoItem | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const found = todos.find((t) => t.id === event.active.id)
    setActiveItem(found ?? null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null)
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = todos.findIndex((t) => t.id === active.id)
    const newIdx = todos.findIndex((t) => t.id === over.id)
    if (oldIdx !== -1 && newIdx !== -1) reorderTodos(tabId, parentId, oldIdx, newIdx)
  }

  const handleAdd = () => {
    if (inputValue.trim()) {
      addTodo(tabId, parentId, inputValue.trim())
      setInputValue('')
    }
  }

  return (
    <div className="flex flex-col gap-0.5">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveItem(null)}
      >
        <SortableContext
          items={todos.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence initial={false}>
            {todos.map((todo, idx) => (
              <TodoItemComponent
                key={todo.id}
                tabId={tabId}
                item={todo}
                parentId={parentId}
                depth={depth}
                hasPrevSibling={idx > 0}
                isDragActive={activeItem?.id === todo.id}
              />
            ))}
          </AnimatePresence>
        </SortableContext>

        <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
          {activeItem && <DragPreview item={activeItem} depth={depth} />}
        </DragOverlay>
      </DndContext>

      {depth === 0 && (
        <motion.div
          layout
          className={`
            mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5
            border transition-all duration-200
            ${focused
              ? 'border-accent/40 bg-accent/4 shadow-sm'
              : 'border-black/8 bg-surface-2 hover:border-black/12'
            }
          `}
        >
          <span className="text-accent text-lg select-none font-light">+</span>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd()
            }}
            placeholder="タスクを追加…"
            className="flex-1 bg-transparent text-sm text-ink placeholder-ink-faint outline-none"
          />
          <AnimatePresence>
            {inputValue && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAdd}
                className="px-3 py-1 rounded-lg bg-accent text-white text-xs font-medium
                  hover:bg-accent-hover transition-colors"
              >
                追加
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
