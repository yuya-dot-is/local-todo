import { useState, useRef, useEffect } from 'react'
import { useTodoStore } from '../store/useTodoStore'

export default function TodoEditor() {
  const { todos, editingTodoId, setEditingTodoId, editTodo } = useTodoStore()
  const editingTodo = todos.find(t => t.id === editingTodoId)
  
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Sync internal value when editingTodoId changes
  useEffect(() => {
    if (editingTodo) {
      setInputValue(editingTodo.title)
      // Focus after a short delay to ensure UI is ready
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          inputRef.current.setSelectionRange(editingTodo.title.length, editingTodo.title.length)
        }
      }, 0)
    }
  }, [editingTodoId, editingTodo])

  const handleUpdate = () => {
    if (!editingTodoId) return
    
    const finalValue = inputValue.trim()
    if (finalValue) {
      editTodo(editingTodoId, finalValue)
    }

    // Move to next task logic
    const currentIndex = todos.findIndex(t => t.id === editingTodoId)
    // Find next task (not caret)
    let nextIndex = -1
    for (let i = currentIndex + 1; i < todos.length; i++) {
      if (!todos[i].isCaret) {
        nextIndex = i
        break
      }
    }

    if (nextIndex !== -1) {
      setEditingTodoId(todos[nextIndex].id)
    } else {
      setEditingTodoId(null)
      // Keyboard will naturally close if focus is not moved
    }
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
          const target = e.target as HTMLTextAreaElement
          target.style.height = 'auto'
          target.style.height = `${target.scrollHeight}px`
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
