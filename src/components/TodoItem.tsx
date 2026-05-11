import { useCallback, useRef, useEffect, useState } from 'react'
import { Reorder, useDragControls } from 'framer-motion'
import { useTodoStore } from '../store/useTodoStore'
import type { TodoItem as TodoItemType } from '../types'
import TodoItemCheckbox from './TodoItemCheckbox'
import TodoItemCaret from './TodoItemCaret'
import TodoItemActions from './TodoItemActions'
import TodoItemTitle from './TodoItemTitle'

interface Props {
  item: TodoItemType
}

export default function TodoItem({ item }: Props) {
  const { toggleTodo, deleteTodo, editingTodoId, editingValue, setEditingTodoId } = useTodoStore()
  const [isDraggable, setIsDraggable] = useState(false)
  const dragControls = useDragControls()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const itemRef = useRef<HTMLDivElement>(null)
  const isEditing = editingTodoId === item.id
  const isAnyEditing = editingTodoId !== null
  const displayTitle = isEditing ? editingValue : item.title

  const handleCheck = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (isAnyEditing) return
    toggleTodo(item.id)
  }, [item.id, toggleTodo, isAnyEditing])

  const onPointerDown = (e: React.PointerEvent) => {
    if (isAnyEditing) return
    timerRef.current = setTimeout(() => {
      window.getSelection()?.removeAllRanges()
      setIsDraggable(true)
      dragControls.start(e)
    }, 500)
  }

  const onPointerMove = () => {
    if (!isDraggable && timerRef.current) clearTimer()
  }

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  // Scroll editing item into view when keyboard appears
  useEffect(() => {
    if (!isEditing || !itemRef.current) return
    const t = setTimeout(() => {
      itemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 300)
    return () => clearTimeout(t)
  }, [isEditing])

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
      className={`group relative${isDraggable ? ' select-none' : ''}`}
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
      onDragEnd={() => { setIsDraggable(false); clearTimer() }}
      transition={{ type: 'spring', stiffness: 400, damping: 30, opacity: { duration: 0.15 } }}
    >
      <div
        ref={itemRef}
        onPointerDown={onPointerDown}
        onPointerUp={clearTimer}
        onPointerCancel={clearTimer}
        onPointerMove={onPointerMove}
        onClick={() => { if (!isAnyEditing) setEditingTodoId(item.id) }}
        className={`flex items-center gap-3 py-3 px-2 transition-colors duration-150${isEditing ? ' ring-1 ring-inset ring-accent/30' : ' hover:bg-black/[0.02]'}${dimmed ? ' pointer-events-none' : ''}`}
      >
        <TodoItemCheckbox checked={item.checked} handleCheck={handleCheck} />

        <div className="flex-1 min-w-0">
          <TodoItemTitle title={displayTitle} checked={item.checked} />
        </div>

        {/* Only show delete button when not in editing mode */}
        {!isAnyEditing && (
          <TodoItemActions onDelete={() => deleteTodo(item.id)} />
        )}
      </div>
    </Reorder.Item>
  )
}
