import { useState, useCallback, useRef, useEffect } from 'react'
import { Reorder, useDragControls } from 'framer-motion'
import { useTodoStore } from '../store/useTodoStore'
import type { TodoItem as TodoItemType } from '../types'
import TodoItemCheckbox from './TodoItemCheckbox'
import TodoItemCaret from './TodoItemCaret'
import TodoItemActions from './TodoItemActions'
import TodoItemEditor from './TodoItemEditor'
import TodoItemTitle from './TodoItemTitle'

interface Props {
  item: TodoItemType
}

export default function TodoItem({ item }: Props) {
  const { toggleTodo, editTodo, deleteTodo } = useTodoStore()
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(item.title)
  const [isDraggable, setIsDraggable] = useState(false)
  const dragControls = useDragControls()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const commitEdit = () => {
    const finalTitle = editValue.trim()
    if (finalTitle) {
      editTodo(item.id, finalTitle)
    } else {
      setEditValue(item.title)
    }
    setEditing(false)
  }

  const handleCheck = useCallback(() => {
    toggleTodo(item.id)
  }, [item.id, toggleTodo])

  // Long press logic
  const onPointerDown = (e: React.PointerEvent) => {
    if (editing) return
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
        backgroundColor: isDraggable ? '#f0fdf4' : '#ffffff' 
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
        onPointerMove={() => {
          if (!isDraggable && timerRef.current) {
            // Optional: add movement threshold here
          }
        }}
        className="flex items-center gap-3 py-3 px-2 transition-colors duration-150 hover:bg-black/[0.02]"
      >
        <TodoItemCheckbox
          checked={item.checked}
          handleCheck={handleCheck}
        />

        {editing ? (
          <TodoItemEditor
            editValue={editValue}
            setEditValue={setEditValue}
            commitEdit={commitEdit}
            cancelEdit={() => {
              setEditValue(item.title)
              setEditing(false)
            }}
          />
        ) : (
          <div className="flex-1 min-w-0">
            <TodoItemTitle
              title={item.title}
              checked={item.checked}
              onDoubleClick={() => setEditing(true)}
            />
          </div>
        )}

        <TodoItemActions
          onEdit={() => setEditing(true)}
          onDelete={() => deleteTodo(item.id)}
        />
      </div>
    </Reorder.Item>
  )
}
