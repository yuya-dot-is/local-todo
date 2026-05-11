export interface TodoItem {
  id: string
  title: string
  checked: boolean
  createdAt: number
  children: TodoItem[]
}

export interface Tab {
  id: string
  name: string
  todos: TodoItem[]
}

export interface TodoStore {
  tabs: Tab[]
  activeTabIndex: number
  addTab: () => void
  renameTab: (tabId: string, name: string) => void
  deleteTab: (tabId: string) => void
  reorderTabs: (tabs: Tab[]) => void
  setActiveTab: (index: number) => void
  addTodo: (tabId: string, parentId: string | null, title: string) => void
  editTodo: (tabId: string, todoId: string, title: string) => void
  toggleTodo: (tabId: string, todoId: string) => void
  deleteTodo: (tabId: string, todoId: string) => void
  reorderTodos: (tabId: string, parentId: string | null, from: number, to: number) => void
  indentTodo: (tabId: string, todoId: string) => void
  outdentTodo: (tabId: string, todoId: string) => void
}
