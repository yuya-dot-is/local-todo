import { useState } from 'react'

interface Props {
  onAdd: (title: string) => void
}

export default function TodoInput({ onAdd }: Props) {
  const [inputValue, setInputValue] = useState('')
  const [focused, setFocused] = useState(false)

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim())
      setInputValue('')
    }
  }

  return (
    <div className={`flex items-center gap-2 p-2 bg-white border-t ${focused ? 'border-accent' : 'border-black/5'}`}>
      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.nativeEvent.isComposing) return
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleAdd()
          }
        }}
        placeholder="タスクを追加…"
        rows={1}
        className="flex-1 bg-surface-2 text-base text-ink placeholder-ink-faint outline-none resize-none px-4 py-2 rounded-full leading-tight min-h-[44px] max-h-[120px]"
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement
          target.style.height = 'auto'
          target.style.height = `${target.scrollHeight}px`
        }}
      />
      <button
        onClick={handleAdd}
        disabled={!inputValue.trim()}
        className={`w-11 h-11 flex items-center justify-center rounded-full text-2xl font-light transition-all ${
          inputValue.trim() ? 'bg-accent text-white shadow-md active:scale-95' : 'bg-black/5 text-ink-faint'
        }`}
      >
        +
      </button>
    </div>
  )
}
