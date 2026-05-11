import { useState } from 'react'
import { AnimatePresence, Reorder } from 'framer-motion'
import { useTodoStore } from '../store/useTodoStore'
import type { TodoItem } from '../types'
import TodoItemComponent from './TodoItem'

interface Props {
  tabId: string
  todos: TodoItem[]
}

export default function TodoList({ tabId, todos }: Props) {
  const { addTodo, reorderTodos, stopwatchActive, stopwatchPaused, setStopwatch, pauseStopwatch, resetStopwatch } = useTodoStore()
  const [inputValue, setInputValue] = useState('')
  const [estimateValue, setEstimateValue] = useState('')
  const [focused, setFocused] = useState(false)

  const handleAdd = (isHeader: boolean = false) => {
    if (inputValue.trim()) {
      addTodo(tabId, inputValue.trim(), isHeader, isHeader ? '' : estimateValue.trim())
      setInputValue('')
      setEstimateValue('')
    }
  }

  return (
    <div className="flex flex-col gap-0.5">
      {/* Stopwatch Toggle */}
      <div className="mb-2 flex items-center gap-2">
        {!stopwatchActive ? (
          <button
            onClick={() => setStopwatch(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold transition-all bg-accent/10 text-accent hover:bg-accent/20"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            計測開始
          </button>
        ) : (
          <>
            <button
              onClick={() => pauseStopwatch(!stopwatchPaused)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold transition-all
                ${stopwatchPaused ? 'bg-accent/10 text-accent hover:bg-accent/20' : 'bg-red-500 text-white shadow-sm'}`}
            >
              {stopwatchPaused ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  再開
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                  一時停止
                </>
              )}
            </button>
            <button
              onClick={resetStopwatch}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold transition-all bg-black/5 text-ink-muted hover:bg-black/10"
              title="リセット"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              リセット
            </button>
            <button
              onClick={() => setStopwatch(false)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold transition-all bg-black text-white hover:bg-black/80"
            >
              停止
            </button>
          </>
        )}
      </div>

      <div
        className={`
          mb-3 flex items-start gap-3 px-4 py-4
          border transition-all duration-200
          ${focused
            ? 'border-accent/40 bg-accent/4 shadow-sm'
            : 'border-black/8 bg-surface-2 hover:border-black/12'
          }
        `}
      >
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleAdd(false)
            }
          }}
          placeholder="タスクを追加…"
          rows={1}
          className="flex-1 bg-transparent text-base text-ink placeholder-ink-faint outline-none resize-none py-1 leading-relaxed min-h-[1.75rem] max-h-[6rem]"
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement
            target.style.height = 'auto'
            target.style.height = `${target.scrollHeight}px`
          }}
        />

        <input
          value={estimateValue}
          onChange={(e) => setEstimateValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="作業時間（分）"
          className="w-24 bg-white/50 text-[11px] text-ink px-2 py-1 border border-black/5 outline-none focus:border-accent/30 mt-0.5"
        />

        <div className="flex items-center gap-1.5 mt-0.5">
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleAdd(true)}
            disabled={!inputValue.trim()}
            className={`
              px-3 py-2 text-xs font-bold transition-colors min-h-[44px]
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
              px-4 py-2 text-xs font-bold transition-colors min-h-[44px]
              ${inputValue.trim()
                ? 'bg-accent text-white hover:bg-accent-hover'
                : 'bg-black/10 text-ink-faint cursor-not-allowed opacity-50'}
            `}
          >
            + タスク
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin pr-1 -mr-1">
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
