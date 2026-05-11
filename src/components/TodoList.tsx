import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useTodoStore } from '../store/useTodoStore'
import type { TodoItem } from '../types'
import TodoItemComponent from './TodoItem'

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
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
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={todos.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence initial={false}>
            {todos.map((todo) => (
              <TodoItemComponent
                key={todo.id}
                tabId={tabId}
                item={todo}
                parentId={parentId}
                depth={depth}
              />
            ))}
          </AnimatePresence>
        </SortableContext>
      </DndContext>

      {depth === 0 && (
        <motion.div
          layout
          className={`
            mt-2 flex items-center gap-2 rounded-xl px-3 py-2
            border transition-all duration-200
            ${focused
              ? 'border-accent/40 bg-white/5'
              : 'border-white/5 bg-white/[0.03] hover:border-white/10'
            }
          `}
        >
          <span className="text-white/20 text-lg select-none">+</span>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd()
            }}
            placeholder="Add a task…"
            className="flex-1 bg-transparent text-sm text-white placeholder-white/25
              outline-none"
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
                Add
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
