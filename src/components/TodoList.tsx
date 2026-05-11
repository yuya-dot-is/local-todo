import { AnimatePresence, Reorder } from 'framer-motion'
import { useTodoStore } from '../store/useTodoStore'
import type { TodoItem } from '../types'
import TodoItemComponent from './TodoItem'
import TodoStopwatch from './TodoStopwatch'
import TodoInput from './TodoInput'

interface Props {
  tabId: string
  todos: TodoItem[]
}

export default function TodoList({ tabId, todos }: Props) {
  const { addTodo, reorderTodos, stopwatchActive, stopwatchPaused, setStopwatch, pauseStopwatch, resetStopwatch } = useTodoStore()

  return (
    <div className="flex flex-col gap-0.5">
      <TodoStopwatch
        stopwatchActive={stopwatchActive}
        stopwatchPaused={stopwatchPaused}
        setStopwatch={setStopwatch}
        pauseStopwatch={pauseStopwatch}
        resetStopwatch={resetStopwatch}
      />

      <TodoInput
        onAdd={(title, isHeader, estimate) => addTodo(tabId, title, isHeader, estimate)}
      />

      <div className="flex-1 overflow-y-auto scrollbar-thin pr-1 -mr-1">
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
    </div>
  )
}

