import { useState, useRef, useEffect } from 'react'

interface Props {
  onAdd: (title: string) => void
}

export default function TodoInput({ onAdd }: Props) {
  const [inputValue, setInputValue] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim())
      setInputValue('')
      
      // Use setTimeout to ensure focus is applied after state updates and re-renders
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.style.height = '44px'
          inputRef.current.focus()
          // Mobile Safari/Chrome sometimes need an extra kick
          inputRef.current.setSelectionRange(0, 0)
        }
      }, 0)
    }
  }

  // Ensure focus is maintained if externally blurred but should be focused
  // (Optional: can be aggressive, so let's stick to handleAdd for now)

  return (
    <div className={`flex items-center gap-2 p-2 bg-white border-t transition-shadow ${focused ? 'border-accent shadow-[0_-4px_12px_rgba(0,0,0,0.05)]' : 'border-black/5'}`}>
      <textarea
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="タスクを追加…"
        rows={1}
        className="flex-1 bg-surface-2 text-base text-ink placeholder-ink-faint outline-none resize-none px-4 py-2.5 rounded-2xl leading-tight min-h-[44px] max-h-[120px]"
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement
          target.style.height = 'auto'
          target.style.height = `${target.scrollHeight}px`
        }}
      />
      <button
        onMouseDown={(e) => {
          // Crucial: prevent the button from taking focus away from textarea
          e.preventDefault()
        }}
        onClick={handleAdd}
        disabled={!inputValue.trim()}
        className={`w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full text-2xl font-light transition-all ${
          inputValue.trim() ? 'bg-accent text-white shadow-md active:scale-95' : 'bg-black/5 text-ink-faint'
        }`}
      >
        +
      </button>
    </div>
  )
}
