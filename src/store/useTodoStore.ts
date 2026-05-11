import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from '../utils/nanoid'
import type { Tab, TodoItem, TodoStore } from '../types'

function findAndMutate(
  todos: TodoItem[],
  id: string,
  mutator: (item: TodoItem, siblings: TodoItem[], idx: number) => void,
): boolean {
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === id) {
      mutator(todos[i], todos, i)
      return true
    }
    if (findAndMutate(todos[i].children, id, mutator)) return true
  }
  return false
}

function findParentList(
  todos: TodoItem[],
  parentId: string | null,
): TodoItem[] | null {
  if (parentId === null) return todos
  for (const t of todos) {
    if (t.id === parentId) return t.children
    const found = findParentList(t.children, parentId)
    if (found) return found
  }
  return null
}

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

      reorderTabs: (from, to) =>
        set((s) => {
          const tabs = [...s.tabs]
          const [moved] = tabs.splice(from, 1)
          tabs.splice(to, 0, moved)
          return { tabs }
        }),

      setActiveTab: (index) => set({ activeTabIndex: index }),

      addTodo: (tabId, parentId, title) =>
        set((s) => ({
          tabs: s.tabs.map((tab) => {
            if (tab.id !== tabId) return tab
            const todos = structuredClone(tab.todos)
            const newItem: TodoItem = {
              id: nanoid(),
              title,
              checked: false,
              createdAt: Date.now(),
              children: [],
            }
            const list = findParentList(todos, parentId)
            if (list) list.push(newItem)
            return { ...tab, todos }
          }),
        })),

      editTodo: (tabId, todoId, title) =>
        set((s) => ({
          tabs: s.tabs.map((tab) => {
            if (tab.id !== tabId) return tab
            const todos = structuredClone(tab.todos)
            findAndMutate(todos, todoId, (item) => { item.title = title })
            return { ...tab, todos }
          }),
        })),

      toggleTodo: (tabId, todoId) =>
        set((s) => ({
          tabs: s.tabs.map((tab) => {
            if (tab.id !== tabId) return tab
            const todos = structuredClone(tab.todos)
            findAndMutate(todos, todoId, (item) => { item.checked = !item.checked })
            return { ...tab, todos }
          }),
        })),

      deleteTodo: (tabId, todoId) =>
        set((s) => ({
          tabs: s.tabs.map((tab) => {
            if (tab.id !== tabId) return tab
            const todos = structuredClone(tab.todos)
            findAndMutate(todos, todoId, (_item, siblings, idx) => {
              siblings.splice(idx, 1)
            })
            return { ...tab, todos }
          }),
        })),

      reorderTodos: (tabId, parentId, from, to) =>
        set((s) => ({
          tabs: s.tabs.map((tab) => {
            if (tab.id !== tabId) return tab
            const todos = structuredClone(tab.todos)
            const list = findParentList(todos, parentId)
            if (!list) return tab
            const [moved] = list.splice(from, 1)
            list.splice(to, 0, moved)
            return { ...tab, todos }
          }),
        })),
    }),
    {
      name: 'local-todo-store',
      version: 1,
    },
  ),
)
