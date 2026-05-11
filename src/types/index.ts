export interface TodoItem {
  id: string
  title: string
  checked: boolean
  isCaret: boolean
}

export interface TodoStore {
  todos: TodoItem[]
  editingTodoId: string | null
  isDragging: boolean
  setEditingTodoId: (id: string | null) => void
  setIsDragging: (isDragging: boolean) => void
  addTodo: (title: string) => void
  editTodo: (todoId: string, title: string) => void
  toggleTodo: (todoId: string) => void
  deleteTodo: (todoId: string) => void
  reorderTodos: (newTodos: TodoItem[]) => void
}
