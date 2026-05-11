import { useState, useRef } from 'react'

interface Props {
  onAdd: (title: string) => void
}

export default function TodoInput({ onAdd }: Props) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleAdd = () => {
    if (!value.trim()) return
    onAdd(value.trim())
    setValue('')
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.style.height = '44px'
        inputRef.current.focus()
        inputRef.current.setSelectionRange(0, 0)
      }
    }, 0)
  }

  return (
    <div className={`flex items-center gap-2 p-2 bg-white border-t transition-shadow ${focused ? 'border-accent shadow-[0_-4px_12px_rgba(0,0,0,0.05)]' : 'border-black/5'}`}>
      <textarea
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="タスクを追加…"
        rows={1}
        className="flex-1 bg-surface-2 text-base text-ink placeholder-ink-faint outline-none resize-none px-4 py-2.5 rounded-2xl leading-tight min-h-[44px] max-h-[120px]"
        onInput={(e) => {
          const el = e.target as HTMLTextAreaElement
          el.style.height = 'auto'
          el.style.height = `${el.scrollHeight}px`
        }}
      />
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleAdd}
        disabled={!value.trim()}
        className={`w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full text-2xl font-light transition-all ${value.trim() ? 'bg-accent text-white shadow-md active:scale-95' : 'bg-black/5 text-ink-faint'}`}
      >
        +
      </button>
    </div>
  )
}
