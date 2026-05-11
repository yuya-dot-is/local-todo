import { AnimatePresence, Reorder } from 'framer-motion'
import { useTodoStore } from '../store/useTodoStore'
import TodoItemComponent from './TodoItem'
import TodoInput from './TodoInput'
import TodoEditor from './TodoEditor'

export default function TodoList() {
  const { todos, addTodo, reorderTodos, editingTodoId } = useTodoStore()

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      <div className="flex-1 overflow-y-auto scrollbar-thin pb-24">
        <Reorder.Group
          axis="y"
          values={todos}
          onReorder={reorderTodos}
          className="flex flex-col gap-0.5"
        >
          <AnimatePresence initial={false}>
            {todos.map((todo) => (
              <TodoItemComponent key={todo.id} item={todo} />
            ))}
          </AnimatePresence>
        </Reorder.Group>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20">
        {editingTodoId ? (
          <TodoEditor />
        ) : (
          <div className="bg-gradient-to-t from-white via-white/95 to-transparent pt-8 p-2">
            <TodoInput onAdd={addTodo} />
          </div>
        )}
      </div>
    </div>
  )
}
