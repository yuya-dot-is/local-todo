import { useCallback, useRef, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { Reorder, useDragControls } from 'framer-motion'
import { useTodoStore } from '../store/useTodoStore'
import type { TodoItem as TodoItemType } from '../types'
import TodoItemCheckbox from './TodoItemCheckbox'
import TodoItemCaret from './TodoItemCaret'
import TodoItemTitle from './TodoItemTitle'
import TodoItemActions from './TodoItemActions'

interface Props {
  item: TodoItemType
}

export default function TodoItem({ item }: Props) {
  const { 
    toggleTodo, 
    deleteTodo, 
    editingTodoId, 
    setEditingTodoId, 
    editTodo, 
    setIsDragging,
    draggingItemId,
    setDraggingItemId
  } = useTodoStore()

  const dragControls = useDragControls()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const isEditing = editingTodoId === item.id
  const isAnyEditing = editingTodoId !== null
  const isDraggable = draggingItemId === item.id

  const [editValue, setEditValue] = useState(item.title)

  const syncTextareaHeight = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  const commitEdit = () => {
    const value = editValue.trim()
    if (value) editTodo(item.id, value)
    else setEditValue(item.title)
    setEditingTodoId(null)
  }

  const handleCheck = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (isAnyEditing) return
    toggleTodo(item.id)
  }, [item.id, toggleTodo, isAnyEditing])

  const handleItemClick = (e: React.MouseEvent) => {
    if (isAnyEditing && !isEditing) return
    if (isEditing) return

    e.preventDefault()
    e.stopPropagation()

    setEditValue(item.title)
    flushSync(() => setEditingTodoId(item.id))
    if (textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length)
      syncTextareaHeight()
    }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (isAnyEditing) return
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

  if (item.isCaret) {
    return <TodoItemCaret item={item} />
  }

  const dimmed = isAnyEditing && !isEditing

  return (
    <Reorder.Item
      value={item}
      id={item.id}
      layout
      dragListener={false}
      dragControls={dragControls}
      className="group relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{
        opacity: dimmed ? 0.3 : 1,
        backgroundColor: isEditing || isDraggable ? '#f0fdf4' : '#ffffff',
        scale: isDraggable ? 1.04 : 1,
        zIndex: isDraggable ? 50 : 0,
        boxShadow: isDraggable
          ? '0 20px 40px -10px rgba(0,0,0,0.2), 0 10px 20px -5px rgba(0,0,0,0.1)'
          : '0 0 0 0 rgba(0,0,0,0)'
      }}
      exit={{ opacity: 0, height: 0 }}
      onDragEnd={handleEnd}
      transition={{ type: 'spring', stiffness: 400, damping: 30, opacity: { duration: 0.15 } }}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerUp={handleEnd}
        onPointerCancel={handleEnd}
        onPointerMove={onPointerMove}
        onClick={handleItemClick}
        className={`relative z-10 flex items-center gap-3 py-1.5 px-2 transition-colors duration-150${isEditing ? ' ring-1 ring-inset ring-accent/30 bg-[#f0fdf4]' : ' hover:bg-black/[0.02] bg-white'}${dimmed ? ' pointer-events-none' : ''}`}
      >
        {!isEditing && (
          <div className="flex-shrink-0">
            <TodoItemCheckbox checked={item.checked} handleCheck={handleCheck} />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={editValue}
              onChange={(e) => {
                setEditValue(e.target.value)
                const el = e.target
                el.style.height = 'auto'
                el.style.height = `${el.scrollHeight}px`
              }}
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing) return
                if (e.key === 'Escape') { setEditValue(item.title); setEditingTodoId(null) }
              }}
              rows={1}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-transparent text-sm text-ink outline-none resize-none leading-snug block"
            />
          ) : (
            <TodoItemTitle title={item.title} checked={item.checked} />
          )}
        </div>

        {!isAnyEditing && (
          <TodoItemActions onDelete={() => deleteTodo(item.id)} />
        )}
      </div>
    </Reorder.Item>
  )
}
