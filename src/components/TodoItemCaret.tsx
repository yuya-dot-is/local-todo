import { useState, useRef, useEffect } from 'react'
import { Reorder, useDragControls } from 'framer-motion'
import type { TodoItem as TodoItemType } from '../types'

interface Props {
  item: TodoItemType
}

export default function TodoItemCaret({ item }: Props) {
  const [isDraggable, setIsDraggable] = useState(false)
  const dragControls = useDragControls()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onPointerDown = (e: React.PointerEvent) => {
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

  return (
    <Reorder.Item
      value={item}
      id={item.id}
      layout
      dragListener={false}
      dragControls={dragControls}
      className={`group py-1 ${isDraggable ? 'select-none' : ''}`}
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
        clearTimer()
      }}
    >
      <div 
        onPointerDown={onPointerDown}
        onPointerUp={clearTimer}
        onPointerCancel={clearTimer}
        className="flex items-center gap-2 px-2 h-10 hover:bg-black/[0.02] transition-colors group"
      >
        <div className="flex-1 h-1 bg-accent/30 rounded-full relative ml-2">
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-accent/40" />
        </div>
        <span className="text-[10px] text-accent/60 font-bold px-1 flex-shrink-0 select-none uppercase tracking-wider">Add Here</span>
      </div>
    </Reorder.Item>
  )
}
