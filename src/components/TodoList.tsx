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

  const handleAdd = (isHeader: boolean = false) => {
    if (inputValue.trim()) {
      addTodo(tabId, inputValue.trim(), isHeader)
      setInputValue('')
    }
  }

  return (
    <div className="flex flex-col gap-0.5">
      <div
        className={`
          mb-3 flex items-center gap-2 px-3 py-2.5
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
            if (e.key === 'Enter') handleAdd(false)
          }}
          placeholder="タスクを追加…"
          className="flex-1 bg-transparent text-sm text-ink placeholder-ink-faint outline-none"
        />
        <div className="flex items-center gap-1">
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleAdd(true)}
            disabled={!inputValue.trim()}
            className={`
              px-2 py-1 text-[11px] font-bold transition-colors
              ${inputValue.trim() 
                ? 'bg-accent/10 text-accent hover:bg-accent/20' 
                : 'bg-black/5 text-ink-faint cursor-not-allowed opacity-50'}
            `}
          >
            + ヘッダー
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleAdd(false)}
            disabled={!inputValue.trim()}
            className={`
              px-3 py-1 text-[11px] font-bold transition-colors
              ${inputValue.trim() 
                ? 'bg-accent text-white hover:bg-accent-hover' 
                : 'bg-black/10 text-ink-faint cursor-not-allowed opacity-50'}
            `}
          >
            + タスク
          </button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[60vh] scrollbar-thin pr-1 -mr-1">
        <Reorder.Group
          axis="y"
          values={todos}
          onReorder={(newTodos) => reorderTodos(tabId, newTodos)}
          className="flex flex-col gap-0.5"
        >
          <AnimatePresence initial={false}>
            {todos.map((todo, idx) => (
              <TodoItemComponent
                key={todo.id}
                tabId={tabId}
                item={todo}
                allTodos={todos}
                index={idx}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
      </div>
    </div>
  )
}
