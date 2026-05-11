import { AnimatePresence, Reorder } from 'framer-motion'
import { useTodoStore } from '../store/useTodoStore'
import type { TodoItem } from '../types'
import TodoItemComponent from './TodoItem'
import TodoInput from './TodoInput'

interface Props {
  tabId: string
  todos: TodoItem[]
}

export default function TodoList({ tabId, todos }: Props) {
  const { addTodo, reorderTodos } = useTodoStore()

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      <div className="flex-1 overflow-y-auto scrollbar-thin pr-1 -mr-1 px-4 pt-4 pb-20">
        <Reorder.Group
          axis="y"
          values={todos}
          onReorder={(newTodos) => reorderTodos(tabId, newTodos)}
          className="flex flex-col gap-0.5"
        >
          <AnimatePresence initial={false}>
            {todos.map((todo, idx) => (
              <TodoItemComponent
                key={todo.id}
                tabId={tabId}
                item={todo}
                allTodos={todos}
                index={idx}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-white via-white/95 to-transparent pt-8">
        <TodoInput
          onAdd={(title) => addTodo(tabId, title)}
        />
      </div>
    </div>
  )
}
