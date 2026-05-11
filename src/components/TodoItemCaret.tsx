import { useState, useRef, useEffect } from 'react'
import { Reorder, useDragControls } from 'framer-motion'
import type { TodoItem as TodoItemType } from '../types'
import { useTodoStore } from '../store/useTodoStore'

interface Props {
  item: TodoItemType
}

export default function TodoItemCaret({ item }: Props) {
  const { editingTodoId, addTodo } = useTodoStore()
  const isAnyEditing = editingTodoId !== null
  const [isInputMode, setIsInputMode] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isDraggable, setIsDraggable] = useState(false)
  const dragControls = useDragControls()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Focus the textarea when entering input mode
  useEffect(() => {
    if (!isInputMode) return
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }, [isInputMode])

  const handleSubmit = () => {
    if (inputValue.trim()) {
      addTodo(inputValue.trim())
      setInputValue('')
    }
    setIsInputMode(false)
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (isAnyEditing || isInputMode) return
    timerRef.current = setTimeout(() => {
      window.getSelection()?.removeAllRanges()
      setIsDraggable(true)
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
      className={`group${isDraggable ? ' select-none' : ''}${isAnyEditing ? ' opacity-30 pointer-events-none' : ''}`}
      animate={{
        backgroundColor: isDraggable ? '#f0fdf4' : 'transparent',
        scale: isDraggable ? 1.04 : 1,
        zIndex: isDraggable ? 50 : 0,
        boxShadow: isDraggable
          ? '0 20px 40px -10px rgba(0,0,0,0.2), 0 10px 20px -5px rgba(0,0,0,0.1)'
          : '0 0 0 0 rgba(0,0,0,0)'
      }}
      onDragEnd={() => { setIsDraggable(false); clearTimer() }}
    >
      {isInputMode ? (
        // Inline input form mode
        <div className="flex items-center gap-2 px-2 py-2 bg-accent/5 ring-1 ring-inset ring-accent/30">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() }
              if (e.key === 'Escape') { setInputValue(''); setIsInputMode(false) }
            }}
            placeholder="タスクを追加…"
            rows={1}
            className="flex-1 bg-transparent text-sm text-ink placeholder-ink-faint outline-none resize-none leading-relaxed min-h-[24px]"
            onInput={(e) => {
              const el = e.target as HTMLTextAreaElement
              el.style.height = 'auto'
              el.style.height = `${el.scrollHeight}px`
            }}
          />
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleSubmit}
            className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-accent text-white text-lg leading-none"
          >
            ↑
          </button>
        </div>
      ) : (
        // "+" button mode
        <div
          data-caret="true"
          onPointerDown={onPointerDown}
          onPointerUp={clearTimer}
          onPointerCancel={clearTimer}
          className="flex items-center px-2 h-10 hover:bg-black/[0.02] transition-colors"
        >
          <div className="flex-1 h-px bg-accent/20 mr-2" />
          <button
            onClick={(e) => { e.stopPropagation(); setIsInputMode(true) }}
            className="w-8 h-8 flex items-center justify-center rounded-full text-accent/70 hover:text-accent hover:bg-accent/8 transition-colors text-xl leading-none"
          >
            +
          </button>
        </div>
      )}
    </Reorder.Item>
  )
}
