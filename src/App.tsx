import { useTodoStore } from './store/useTodoStore'
import TodoList from './components/TodoList'

export default function App() {
  const { todos } = useTodoStore()

  return (
    <div className="h-screen flex flex-col text-ink antialiased overflow-hidden bg-white">
      {/* main layout */}
      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto min-h-0">
        <main className="flex-1 flex flex-col min-h-0 relative">
          <TodoList todos={todos} />
        </main>
      </div>
    </div>
  )
}
