import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from '../utils/nanoid'
import type { TodoItem, TodoStore } from '../types'

// キャレットのIDを固定値にすることで、リスト更新時もコンポーネントが再生成されないようにする
const CARET_ID = 'fixed-caret-id'

const initialTodos = (): TodoItem[] => [{
  id: CARET_ID,
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
          
          // 万が一キャレットがいなければ作成
          if (caretIdx === -1) {
            const newCaret: TodoItem = {
              id: CARET_ID,
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

          // キャレットの直前に挿入
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
