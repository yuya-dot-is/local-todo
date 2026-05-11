import { useState, useRef, useEffect } from 'react'
import { flushSync } from 'react-dom'
import { Reorder, useDragControls } from 'framer-motion'
import type { TodoItem as TodoItemType } from '../types'
import { useTodoStore } from '../store/useTodoStore'

interface Props {
  item: TodoItemType
}

export default function TodoItemCaret({ item }: Props) {
  const { editingTodoId, addTodo, setIsDragging, draggingItemId, setDraggingItemId } = useTodoStore()
  
  const isAnyEditing = editingTodoId !== null
  const isDraggable = draggingItemId === item.id
  
  const [isInputMode, setIsInputMode] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const dragControls = useDragControls()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (keepOpen = true) => {
    const value = inputValue.trim()
    if (value) {
      addTodo(value)
      setInputValue('')
      
      // 入力フォームの高さをリセット
      if (inputRef.current) {
        inputRef.current.style.height = 'auto'
      }
      
      // 連続追加の場合はフォーカスを維持
      if (keepOpen) {
        setTimeout(() => inputRef.current?.focus(), 0)
        return
      }
    }
    
    // 値が空、または明示的に閉じる場合
    if (!keepOpen || !value) {
      setIsInputMode(false)
      setInputValue('')
    }
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
      setDraggingItemId(item.id)
      setIsDragging(true)
      dragControls.start(e)
    }, 500)
  }

  const onPointerMove = () => {
    if (!isDraggable && timerRef.current) clearTimer()
  }

  const handleEnd = () => {
    setDraggingItemId(null)
    setIsDragging(false)
    clearTimer()
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
        zIndex: isDraggable ? 100 : 0,
        boxShadow: isDraggable
          ? '0 20px 40px -10px rgba(0,0,0,0.2), 0 10px 20px -5px rgba(0,0,0,0.1)'
          : '0 0 0 0 rgba(0,0,0,0)'
      }}
      whileDrag={{
        zIndex: 100,
        scale: 1.04,
        backgroundColor: '#f0fdf4',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2), 0 10px 20px -5px rgba(0,0,0,0.1)'
      }}
      transition={{ zIndex: { duration: 0 } }}
      onDragEnd={handleEnd}
    >
      {isInputMode ? (
        <div className="flex items-center gap-2 px-2 py-1 bg-accent/5 ring-1 ring-inset ring-accent/30 min-h-[36px]">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            // フォーカスが外れた時は保存して閉じる
            onBlur={() => handleSubmit(false)}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return
              // Enter 単体で追加（フォームは開いたまま）
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(true)
              }
              if (e.key === 'Escape') { 
                setInputValue('')
                setIsInputMode(false) 
              }
            }}
            placeholder="タスクを追加…"
            rows={1}
            className="flex-1 bg-transparent text-sm text-ink placeholder-ink-faint outline-none resize-none leading-snug block"
            onInput={(e) => {
              const el = e.target as HTMLTextAreaElement
              el.style.height = 'auto'
              el.style.height = `${el.scrollHeight}px`
            }}
          />
          <button
            // buttonクリック時は連続追加を想定
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleSubmit(true)}
            className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full bg-accent text-white text-lg leading-none shadow-sm active:scale-90 transition-transform"
          >
            ↑
          </button>
        </div>
      ) : (
        <div
          data-caret="true"
          onPointerDown={onPointerDown}
          onPointerUp={handleEnd}
          onPointerCancel={handleEnd}
          onPointerMove={onPointerMove}
          className="flex items-center px-2 h-8 hover:bg-black/[0.02] transition-colors"
        >
          <div className="flex-1 h-px bg-accent/10 mr-4" />
          <button
            onClick={handlePlusClick}
            className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full border border-accent/30 text-accent/60 bg-accent/[0.03] hover:border-accent/60 hover:text-accent hover:bg-accent/10 transition-all text-lg font-light active:scale-90"
          >
            +
          </button>
        </div>
      )}
    </Reorder.Item>
  )
}
