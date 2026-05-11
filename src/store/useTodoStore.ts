import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from '../utils/nanoid'
import type { Tab, TodoItem, TodoStore } from '../types'

const defaultTab = (): Tab => ({
  id: nanoid(),
  name: 'My Tasks',
  todos: [],
})

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      tabs: [defaultTab()],
      activeTabIndex: 0,

      addTab: () =>
        set((s) => ({ tabs: [...s.tabs, defaultTab()] })),

      renameTab: (tabId, name) =>
        set((s) => ({
          tabs: s.tabs.map((t) => (t.id === tabId ? { ...t, name } : t)),
        })),

      deleteTab: (tabId) =>
        set((s) => {
          const next = s.tabs.filter((t) => t.id !== tabId)
          const tabs = next.length ? next : [defaultTab()]
          const activeTabIndex = Math.min(s.activeTabIndex, tabs.length - 1)
          return { tabs, activeTabIndex }
        }),

      reorderTabs: (newTabs) =>
        set(() => {
          return { tabs: newTabs }
        }),

      setActiveTab: (index) => set({ activeTabIndex: index }),

      addTodo: (tabId, title) =>
        set((s) => ({
          tabs: s.tabs.map((tab) => {
            if (tab.id !== tabId) return tab
            const newItem: TodoItem = {
              id: nanoid(),
              title,
              checked: false,
              createdAt: Date.now(),
            }
            return { ...tab, todos: [...tab.todos, newItem] }
          }),
        })),

      editTodo: (tabId, todoId, title) =>
        set((s) => ({
          tabs: s.tabs.map((tab) => {
            if (tab.id !== tabId) return tab
            const todos = tab.todos.map(t => t.id === todoId ? { ...t, title } : t)
            return { ...tab, todos }
          }),
        })),

      toggleTodo: (tabId, todoId) =>
        set((s) => ({
          tabs: s.tabs.map((tab) => {
            if (tab.id !== tabId) return tab
            const todos = tab.todos.map(t => t.id === todoId ? { ...t, checked: !t.checked } : t)
            return { ...tab, todos }
          }),
        })),

      deleteTodo: (tabId, todoId) =>
        set((s) => ({
          tabs: s.tabs.map((tab) => {
            if (tab.id !== tabId) return tab
            const todos = tab.todos.filter(t => t.id !== todoId)
            return { ...tab, todos }
          }),
        })),

      reorderTodos: (tabId, newTodos) =>
        set((s) => ({
          tabs: s.tabs.map((tab) => {
            if (tab.id !== tabId) return tab
            return { ...tab, todos: newTodos }
          }),
        })),
    }),
    {
      name: 'local-todo-store',
      version: 1,
    },
  ),
)
