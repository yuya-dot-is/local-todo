import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from '../utils/nanoid'
import type { TodoItem, TodoStore } from '../types'

const initialTodos = (): TodoItem[] => [{
  id: `caret-${nanoid()}`,
  title: '',
  checked: false,
  isCaret: true,
}]

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: initialTodos(),
      editingTodoId: null,
      isDragging: false,
      draggingItemId: null,

      setEditingTodoId: (id) => set({ editingTodoId: id }),
      setIsDragging: (isDragging) => set({ isDragging }),
      setDraggingItemId: (id) => set({ draggingItemId: id }),

      addTodo: (title) =>
        set((s) => {
          const todos = [...s.todos]
          let caretIdx = todos.findIndex(t => t.isCaret)
          if (caretIdx === -1) {
            const newCaret: TodoItem = {
              id: `caret-${nanoid()}`,
              title: '',
              checked: false,
              isCaret: true
            }
            todos.push(newCaret)
            caretIdx = todos.length - 1
          }

          const newItem: TodoItem = {
            id: nanoid(),
            title,
            checked: false,
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
    {
      name: 'local-todo-storage',
      partialize: (state) => ({ todos: state.todos })
    }
  )
)
