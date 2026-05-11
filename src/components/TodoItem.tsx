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
  const { toggleTodo, deleteTodo, editingTodoId, setEditingTodoId } = useTodoStore()
  const [isDraggable, setIsDraggable] = useState(false)
  const dragControls = useDragControls()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  
  // To handle double tap (or second tap when "selected")
  const isEditing = editingTodoId === item.id

  const handleCheck = useCallback(() => {
    toggleTodo(item.id)
  }, [item.id, toggleTodo])

  // Long press logic
  const onPointerDown = (e: React.PointerEvent) => {
    if (isEditing) return
    timerRef.current = setTimeout(() => {
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

  const handleItemClick = () => {
    // If not editing, first tap shows icons (via CSS hover/group),
    // but the user wants "second tap to edit". 
    // On mobile, first tap triggers hover. If we detect another tap while "hovered/selected", we edit.
    // For simplicity and better UX, we'll set the editing ID.
    setEditingTodoId(item.id)
  }

  useEffect(() => {
    return () => clearTimer()
  }, [])

  if (item.isCaret) {
    return <TodoItemCaret item={item} />
  }

  return (
    <Reorder.Item
      value={item}
      id={item.id}
      layout
      dragListener={false}
      dragControls={dragControls}
      className={`group relative ${isDraggable ? 'select-none' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1, 
        backgroundColor: isEditing ? '#f0fdf4' : (isDraggable ? '#f0fdf4' : '#ffffff')
      }}
      exit={{ opacity: 0, height: 0 }}
      whileDrag={{ 
        scale: 1.05, 
        zIndex: 50,
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2), 0 10px 20px -5px rgba(0,0,0,0.1)' 
      }}
      onDragEnd={() => {
        setIsDraggable(false)
        clearTimer()
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 600, 
        damping: 35,
        opacity: { duration: 0.1 } 
      }}
    >
      <div 
        onPointerDown={onPointerDown}
        onPointerUp={clearTimer}
        onPointerCancel={clearTimer}
        onClick={handleItemClick}
        className={`flex items-center gap-3 py-3 px-2 transition-colors duration-150 hover:bg-black/[0.02] ${isEditing ? 'ring-1 ring-inset ring-accent/30' : ''}`}
      >
        <TodoItemCheckbox
          checked={item.checked}
          handleCheck={handleCheck}
        />

        <div className="flex-1 min-w-0">
          <TodoItemTitle
            title={item.title}
            checked={item.checked}
            onDoubleClick={() => setEditingTodoId(item.id)}
          />
        </div>

        <TodoItemActions
          onEdit={() => setEditingTodoId(item.id)}
          onDelete={() => deleteTodo(item.id)}
        />
      </div>
    </Reorder.Item>
  )
}
