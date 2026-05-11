import TodoList from './components/TodoList'
import { useTodoStore } from './store/useTodoStore'

export default function App() {
  const isDragging = useTodoStore((s) => s.isDragging)

  return (
    <div className={`h-screen flex flex-col text-ink antialiased overflow-hidden bg-white ${isDragging ? 'select-none' : ''}`}>
      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto min-h-0">
        <main className="flex-1 flex flex-col min-h-0">
          <TodoList />
        </main>
      </div>
    </div>
  )
}
