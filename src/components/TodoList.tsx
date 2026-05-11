import { AnimatePresence, Reorder } from 'framer-motion'
import { useTodoStore } from '../store/useTodoStore'
import TodoItemComponent from './TodoItem'

export default function TodoList() {
  const { todos, reorderTodos } = useTodoStore()

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto scrollbar-thin pb-[80vh]">
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
    </div>
  )
}
