import { useState, useEffect, useCallback, useMemo } from 'react'
import { Reorder } from 'framer-motion'
import { useTodoStore } from '../store/useTodoStore'
import type { TodoItem as TodoItemType } from '../types'
import TodoItemCheckbox from './TodoItemCheckbox'
import TodoItemDeleteParticles from './TodoItemDeleteParticles'
import TodoItemCaret from './TodoItemCaret'
import TodoItemActions from './TodoItemActions'
import TodoItemStats from './TodoItemStats'
import TodoItemTimer from './TodoItemTimer'
import TodoItemEditor from './TodoItemEditor'
import TodoItemTitle from './TodoItemTitle'

interface Props {
  tabId: string
  item: TodoItemType
  allTodos?: TodoItemType[]
  index?: number
}

export default function TodoItem({
  tabId,
  item,
  allTodos,
  index,
}: Props) {
  const { toggleTodo, editTodo, deleteTodo, toggleRole, stopwatchActive, stopwatchPaused, stopwatchStartTime, stopwatchAccumulatedTime } = useTodoStore()
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(item.title)
  const [editEstimate, setEditEstimate] = useState(item.estimate || '')
  const [isDeleting, setIsDeleting] = useState(false)

  const isActiveTimerTask = useMemo(() => {
    if (!stopwatchActive || item.checked || item.isHeader || item.isCaret) return false
    const firstUnchecked = allTodos?.find(t => !t.checked && !t.isHeader && !t.isCaret)
    return firstUnchecked?.id === item.id
  }, [stopwatchActive, item.checked, item.isHeader, item.isCaret, allTodos, item.id])

  useEffect(() => {
    if (!editing) {
      setEditValue(item.title)
      setEditEstimate(item.estimate || '')
    }
  }, [item.title, item.estimate, editing])

  const commitEdit = () => {
    const finalTitle = editValue.trim()
    if (finalTitle) {
      editTodo(tabId, item.id, finalTitle, item.isHeader ? '' : editEstimate.trim())
    } else {
      setEditValue(item.title)
      setEditEstimate(item.estimate || '')
    }
    setEditing(false)
  }

  const handleCheck = useCallback(() => {
    toggleTodo(tabId, item.id)
  }, [tabId, item.id, toggleTodo])

  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => deleteTodo(tabId, item.id), 350)
  }

  const headerStats = useMemo(() => {
    if (item.isHeader && allTodos && index !== undefined) {
      let total = 0
      let completed = 0
      for (let i = index + 1; i < allTodos.length; i++) {
        const t = allTodos[i]
        if (t.isHeader) break
        if (!t.isCaret) {
          total++
          if (t.checked) completed++
        }
      }
      return { total, completed }
    }
    return null
  }, [item.isHeader, allTodos, index])

  if (item.isCaret) {
    return <TodoItemCaret item={item} />
  }

  return (
    <Reorder.Item
      value={item}
      id={item.id}
      dragListener={!editing}
      className="group relative"
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={isDeleting
        ? { scale: [1, 1.08, 0], opacity: [1, 1, 0], rotate: [0, 6, -6], transition: { duration: 0.32 } }
        : { opacity: 1, y: 0, scale: 1 }
      }
      exit={{ opacity: 0, y: -6, scale: 0.94, height: 0, transition: { duration: 0.2 } }}
      whileDrag={{ scale: 1.02, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
      transition={{ type: 'spring', stiffness: 600, damping: 25 }}
    >
      <div className="relative">
        <TodoItemDeleteParticles active={isDeleting} />

        <div
          className={`
            flex items-center gap-3 py-3 px-4
            transition-colors duration-150
            ${item.isHeader ? 'bg-accent text-white shadow-md' : 'hover:bg-black/[0.03] bg-white'}
          `}
        >
          {!item.isHeader && (
            <TodoItemCheckbox
              checked={item.checked}
              handleCheck={handleCheck}
            />
          )}

          {editing ? (
            <TodoItemEditor
              editValue={editValue}
              setEditValue={setEditValue}
              editEstimate={editEstimate}
              setEditEstimate={setEditEstimate}
              commitEdit={commitEdit}
              cancelEdit={() => {
                setEditValue(item.title)
                setEditEstimate(item.estimate || '')
                setEditing(false)
              }}
              isHeader={item.isHeader}
            />
          ) : (
            <div className="flex-1 flex flex-col min-w-0">
              <TodoItemTitle
                title={item.title}
                isHeader={item.isHeader}
                checked={item.checked}
                onDoubleClick={() => setEditing(true)}
              />
              {!item.isHeader && (
                <TodoItemTimer
                  isActive={isActiveTimerTask}
                  stopwatchStartTime={stopwatchStartTime}
                  stopwatchAccumulatedTime={stopwatchAccumulatedTime}
                  stopwatchPaused={stopwatchPaused}
                  estimate={item.estimate}
                />
              )}
            </div>
          )}

          {headerStats && <TodoItemStats {...headerStats} />}

          <TodoItemActions
            isHeader={item.isHeader}
            tabId={tabId}
            itemId={item.id}
            onEdit={() => setEditing(true)}
            onDelete={handleDelete}
            toggleRole={toggleRole}
          />
        </div>
      </div>
    </Reorder.Item>
  )
}

