import { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { useTodoStore } from '../store/useTodoStore'
import type { TodoItem } from '../types'
import TodoItemComponent from './TodoItem'

interface Props {
  tabId: string
  todos: TodoItem[]
}

export default function TodoList({ tabId, todos }: Props) {
  const { addTodo, reorderTodos } = useTodoStore()
  const [inputValue, setInputValue] = useState('')
  const [focused, setFocused] = useState(false)

  const handleAdd = () => {
    if (inputValue.trim()) {
      addTodo(tabId, inputValue.trim())
      setInputValue('')
    }
  }

  return (
    <div className="flex flex-col gap-0.5">
      <Reorder.Group
        axis="y"
        values={todos}
        onReorder={(newTodos) => reorderTodos(tabId, newTodos)}
        className="flex flex-col gap-0.5"
      >
        <AnimatePresence initial={false}>
          {todos.map((todo) => (
            <TodoItemComponent
              key={todo.id}
              tabId={tabId}
              item={todo}
            />
          ))}
        </AnimatePresence>
      </Reorder.Group>

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
    </div>
  )
}
