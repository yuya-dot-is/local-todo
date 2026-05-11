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
    isHeader: false
  }],
})

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      tabs: [defaultTab()],
      activeTabIndex: 0,
      showInfoTab: false,
      stopwatchActive: false,
      stopwatchPaused: false,
      stopwatchStartTime: null,
      stopwatchAccumulatedTime: 0,

      setShowInfoTab: (show) => set({ showInfoTab: show }),
      setStopwatch: (active) => set({
        stopwatchActive: active,
        stopwatchPaused: false,
        stopwatchStartTime: active ? Date.now() : null,
        stopwatchAccumulatedTime: 0
      }),
      pauseStopwatch: (paused) => set((s) => {
        if (paused) {
          const now = Date.now()
          const elapsed = s.stopwatchStartTime ? now - s.stopwatchStartTime : 0
          return {
            stopwatchPaused: true,
            stopwatchAccumulatedTime: s.stopwatchAccumulatedTime + elapsed,
            stopwatchStartTime: null
          }
        } else {
          return {
            stopwatchPaused: false,
            stopwatchStartTime: Date.now()
          }
        }
      }),
      resetStopwatch: () => set((s) => ({
        stopwatchStartTime: s.stopwatchActive ? Date.now() : null,
        stopwatchAccumulatedTime: 0,
        stopwatchPaused: false
      })),

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

      addTodo: (tabId, title, isHeader = false, estimate = '') =>
        set((s) => ({
          tabs: s.tabs.map((tab) => {
            if (tab.id !== tabId) return tab

            // Ensure caret exists
            let todos = [...tab.todos]
            let caretIdx = todos.findIndex(t => t.isCaret)
            if (caretIdx === -1) {
              const newCaret: TodoItem = {
                id: `caret-${nanoid()}`,
                title: '',
                checked: false,
                createdAt: Date.now(),
                isHeader: false,
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
              isHeader,
              isCaret: false,
              estimate,
            }

            // Insert exactly before the caret
            todos.splice(caretIdx, 0, newItem)

            return { ...tab, todos }
          }),
        })),

      editTodo: (tabId, todoId, title, estimate) =>
        set((s) => ({
          tabs: s.tabs.map((tab) => {
            if (tab.id !== tabId) return tab
            const todos = tab.todos.map(t => {
              if (t.id === todoId) {
                const updated = { ...t, title }
                if (estimate !== undefined) updated.estimate = estimate
                return updated
              }
              return t
            })
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
          // Reset start time to now when a task is completed, so the next one starts from 0
          stopwatchStartTime: s.stopwatchActive ? Date.now() : s.stopwatchStartTime,
          stopwatchAccumulatedTime: 0,
          stopwatchPaused: false
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
