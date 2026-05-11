import { useState, useRef, useEffect } from 'react'
import { useTodoStore } from '../store/useTodoStore'

export default function TodoEditor() {
  const { todos, editingTodoId, setEditingTodoId, editTodo } = useTodoStore()
  const editingTodo = todos.find(t => t.id === editingTodoId)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!editingTodo) return
    setInputValue(editingTodo.title)
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
        const len = editingTodo.title.length
        inputRef.current.setSelectionRange(len, len)
      }
    }, 0)
  }, [editingTodoId]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpdate = () => {
    if (!editingTodoId) return
    const value = inputValue.trim()
    if (value) editTodo(editingTodoId, value)

    const currentIndex = todos.findIndex(t => t.id === editingTodoId)
    const next = todos.slice(currentIndex + 1).find(t => !t.isCaret)
    setEditingTodoId(next ? next.id : null)
  }

  if (!editingTodo) return null

  return (
    <div className="flex items-center gap-2 p-2 bg-accent/5 border-t border-accent/30 shadow-[0_-4px_12px_rgba(22,163,74,0.1)]">
      <textarea
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="タスクを編集…"
        rows={1}
        className="flex-1 bg-white text-base text-ink outline-none resize-none px-4 py-2.5 rounded-2xl leading-tight min-h-[44px] max-h-[120px] border border-accent/20"
        onInput={(e) => {
          const el = e.target as HTMLTextAreaElement
          el.style.height = 'auto'
          el.style.height = `${el.scrollHeight}px`
        }}
      />
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleUpdate}
        className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full bg-accent text-white shadow-md active:scale-95 transition-all text-xl"
      >
        ↑
      </button>
      <button
        onClick={() => setEditingTodoId(null)}
        className="text-xs text-ink-faint px-2 hover:text-ink transition-colors"
      >
        キャンセル
      </button>
    </div>
  )
}
