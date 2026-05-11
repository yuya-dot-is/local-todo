import { useState, useRef, useEffect } from 'react'
import { flushSync } from 'react-dom'
import { Reorder, useDragControls } from 'framer-motion'
import type { TodoItem as TodoItemType } from '../types'
import { useTodoStore } from '../store/useTodoStore'

interface Props {
  item: TodoItemType
}

export default function TodoItemCaret({ item }: Props) {
  const { editingTodoId, addTodo, setIsDragging } = useTodoStore()
  const isAnyEditing = editingTodoId !== null
  const [isInputMode, setIsInputMode] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isDraggable, setIsDraggable] = useState(false)
  const dragControls = useDragControls()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    if (inputValue.trim()) {
      addTodo(inputValue.trim())
      setInputValue('')
    }
    setIsInputMode(false)
  }

  const handlePlusClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    flushSync(() => setIsInputMode(true))
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (isAnyEditing || isInputMode) return
    timerRef.current = setTimeout(() => {
      window.getSelection()?.removeAllRanges()
      setIsDraggable(true)
      setIsDragging(true)
      dragControls.start(e)
    }, 500)
  }

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => () => clearTimer(), [])

  return (
    <Reorder.Item
      value={item}
      id={item.id}
      layout
      dragListener={false}
      dragControls={dragControls}
      className={`group${isAnyEditing ? ' opacity-30 pointer-events-none' : ''}`}
      animate={{
        backgroundColor: isDraggable ? '#f0fdf4' : 'transparent',
        scale: isDraggable ? 1.04 : 1,
        zIndex: isDraggable ? 50 : 0,
        boxShadow: isDraggable
          ? '0 20px 40px -10px rgba(0,0,0,0.2), 0 10px 20px -5px rgba(0,0,0,0.1)'
          : '0 0 0 0 rgba(0,0,0,0)'
      }}
      onDragEnd={() => {
        setIsDraggable(false)
        setIsDragging(false)
        clearTimer()
      }}
    >
      {isInputMode ? (
        <div className="flex items-center gap-2 px-2 py-2 bg-accent/5 ring-1 ring-inset ring-accent/30 min-h-[48px]">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              const el = e.target
              el.style.height = 'auto'
              el.style.height = `${el.scrollHeight}px`
            }}
            onBlur={handleSubmit}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return
              if (e.key === 'Escape') { setInputValue(''); setIsInputMode(false) }
            }}
            placeholder="タスクを追加…"
            rows={1}
            className="flex-1 bg-transparent text-sm text-ink outline-none resize-none leading-relaxed block"
          />
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleSubmit}
            className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full bg-accent text-white text-xl leading-none shadow-sm active:scale-90 transition-transform"
          >
            ↑
          </button>
        </div>
      ) : (
        <div
          data-caret="true"
          onPointerDown={onPointerDown}
          onPointerUp={clearTimer}
          onPointerCancel={clearTimer}
          className="flex items-center px-2 h-12 hover:bg-black/[0.02] transition-colors"
        >
          <div className="flex-1 h-px bg-accent/20 mr-4" />
          <button
            onClick={handlePlusClick}
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full border-2 border-accent/40 text-accent/70 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all text-2xl leading-none active:scale-90"
          >
            +
          </button>
        </div>
      )}
    </Reorder.Item>
  )
}
