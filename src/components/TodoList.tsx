import { AnimatePresence, Reorder } from 'framer-motion'
import { useTodoStore } from '../store/useTodoStore'
import type { TodoItem } from '../types'
import TodoItemComponent from './TodoItem'
import TodoInput from './TodoInput'
import TodoEditor from './TodoEditor'

interface Props {
  todos: TodoItem[]
}

export default function TodoList({ todos }: Props) {
  const { addTodo, reorderTodos, editingTodoId } = useTodoStore()

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      <div className="flex-1 overflow-y-auto scrollbar-thin pr-1 -mr-1 px-4 pt-4 pb-24">
        <Reorder.Group
          axis="y"
          values={todos}
          onReorder={reorderTodos}
          className="flex flex-col gap-0.5"
        >
          <AnimatePresence initial={false}>
            {todos.map((todo) => (
              <TodoItemComponent
                key={todo.id}
                item={todo}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20">
        {editingTodoId ? (
          <TodoEditor />
        ) : (
          <div className="p-2 bg-gradient-to-t from-white via-white/95 to-transparent pt-8">
            <TodoInput onAdd={addTodo} />
          </div>
        )}
      </div>
    </div>
  )
}
