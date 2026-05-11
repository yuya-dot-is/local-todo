import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from '../utils/nanoid'
import type { Tab, TodoItem, TodoStore } from '../types'

const defaultTab = (): Tab => ({
  id: nanoid(),
  name: 'My Tasks',
  todos: [{
    id: `caret-${nanoid()}`,
    title: '',
    checked: false,
    createdAt: Date.now(),
    isCaret: true,
  }],
})

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      tabs: [defaultTab()],
      activeTabIndex: 0,
      showInfoTab: false,

      setShowInfoTab: (show) => set({ showInfoTab: show }),

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

      setActiveTab: (index) => set({ activeTabIndex: index, showInfoTab: false }),

      addTodo: (tabId, title, isHeader = false) =>
        set((s) => ({
          tabs: s.tabs.map((tab) => {
            if (tab.id !== tabId) return tab
            
            // Ensure caret exists
            let todos = [...tab.todos]
            let caretIdx = todos.findIndex(t => t.isCaret)
            if (caretIdx === -1) {
              const newCaret: TodoItem = {
                id: `caret-${nanoid()}`, title: '', checked: false, createdAt: Date.now(), isCaret: true
              }
              todos.push(newCaret)
              caretIdx = todos.length - 1
            }

            const newItem: TodoItem = {
              id: nanoid(),
              title,
              checked: false,
              createdAt: Date.now(),
              isHeader,
            }
            
            // Insert exactly before the caret
            todos.splice(caretIdx, 0, newItem)

            return { ...tab, todos }
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

      toggleRole: (tabId, todoId) =>
        set((s) => ({
          tabs: s.tabs.map((tab) => {
            if (tab.id !== tabId) return tab
            const todos = tab.todos.map(t => t.id === todoId ? { ...t, isHeader: !t.isHeader } : t)
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
