import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from '../utils/nanoid'
import type { TodoItem, TodoStore } from '../types'

const initialTodos = (): TodoItem[] => [{
  id: `caret-${nanoid()}`,
  title: '',
  checked: false,
  createdAt: Date.now(),
  isCaret: true,
}]

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: initialTodos(),
      showInfoTab: false,

      setShowInfoTab: (show) => set({ showInfoTab: show }),

      addTodo: (title) =>
        set((s) => {
          let todos = [...s.todos]
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
          return { todos }
        }),

      editTodo: (todoId, title) =>
        set((s) => ({
          todos: s.todos.map(t => t.id === todoId ? { ...t, title } : t)
        })),

      toggleTodo: (todoId) =>
        set((s) => ({
          todos: s.todos.map(t => t.id === todoId ? { ...t, checked: !t.checked } : t)
        })),

      deleteTodo: (todoId) =>
        set((s) => ({
          todos: s.todos.filter(t => t.id !== todoId)
        })),

      reorderTodos: (newTodos) =>
        set({ todos: newTodos }),
    }),
    { name: 'local-todo-storage' }
  )
)
