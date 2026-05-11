import { useState, useCallback } from 'react'
import { Reorder } from 'framer-motion'
import { useTodoStore } from '../store/useTodoStore'
import type { TodoItem as TodoItemType } from '../types'
import TodoItemCheckbox from './TodoItemCheckbox'
import TodoItemCaret from './TodoItemCaret'
import TodoItemActions from './TodoItemActions'
import TodoItemEditor from './TodoItemEditor'
import TodoItemTitle from './TodoItemTitle'

interface Props {
  item: TodoItemType
  allTodos?: TodoItemType[]
  index?: number
}

export default function TodoItem({
  item,
}: Props) {
  const { toggleTodo, editTodo, deleteTodo } = useTodoStore()
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(item.title)

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

  const handleDelete = () => {
    deleteTodo(item.id)
  }

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
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.94, height: 0, transition: { duration: 0.2 } }}
      whileDrag={{ scale: 1.02, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
      transition={{ type: 'spring', stiffness: 600, damping: 25 }}
    >
      <div className="relative">
        <div className="flex items-center gap-3 py-3 px-2 transition-colors duration-150 hover:bg-black/[0.03] bg-white">
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
            <div className="flex-1 flex flex-col min-w-0">
              <TodoItemTitle
                title={item.title}
                checked={item.checked}
                onDoubleClick={() => setEditing(true)}
              />
            </div>
          )}

          <TodoItemActions
            onEdit={() => setEditing(true)}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </Reorder.Item>
  )
}
