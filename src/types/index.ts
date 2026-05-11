export interface TodoItem {
  id: string
  title: string
  checked: boolean
  createdAt: number
  isHeader?: boolean
  isCaret?: boolean
  estimate?: string
}

export interface Tab {
  id: string
  name: string
  todos: TodoItem[]
}

export interface TodoStore {
  tabs: Tab[]
  activeTabIndex: number
  showInfoTab: boolean
  setShowInfoTab: (show: boolean) => void
  addTab: () => void
  renameTab: (tabId: string, name: string) => void
  deleteTab: (tabId: string) => void
  reorderTabs: (tabs: Tab[]) => void
  setActiveTab: (index: number) => void
  stopwatchActive: boolean
  stopwatchPaused: boolean
  stopwatchStartTime: number | null
  stopwatchAccumulatedTime: number
  setStopwatch: (active: boolean) => void
  pauseStopwatch: (paused: boolean) => void
  resetStopwatch: () => void
  addTodo: (tabId: string, title: string, isHeader?: boolean, estimate?: string) => void
  editTodo: (tabId: string, todoId: string, title: string, estimate?: string) => void
  toggleTodo: (tabId: string, todoId: string) => void
  toggleRole: (tabId: string, todoId: string) => void
  deleteTodo: (tabId: string, todoId: string) => void
  reorderTodos: (tabId: string, newTodos: TodoItem[]) => void
}
