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
          tabs: s.tabs.map((tab) =>
            tab.id === tabId ? { ...tab, name } : tab
          ),
        })),

      deleteTab: (tabId) =>
        set((s) => {
          const newTabs = s.tabs.filter((tab) => tab.id !== tabId)
          if (newTabs.length === 0) return { tabs: [defaultTab()], activeTabIndex: 0 }
          return { tabs: newTabs }
        }),

      setActiveTab: (index) => set({ activeTabIndex: index, showInfoTab: false }),

      addTodo: (tabId, title) =>
        set((s) => ({
          tabs: s.tabs.map((tab) => {
            if (tab.id !== tabId) return tab

            let todos = [...tab.todos]
            let caretIdx = todos.findIndex(t => t.isCaret)
            if (caretIdx === -1) {
              const newCaret: TodoItem = {
                id: `caret-${nanoid()}`,
                title: '',
                checked: false,
                createdAt: Date.now(),
                isCaret: true
              }
              todos.push(newCaret)
              caretIdx = todos.length - 1
            }

            const newItem: TodoItem = {
              id: nanoid(),
              title,
              checked: false,
              createdAt: Date.now(),
              isCaret: false,
            }

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
    { name: 'local-todo-storage' }
  )
)
