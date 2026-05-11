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
    <div
      className={`
        mb-3 flex items-start gap-3 px-4 py-4
        border transition-all duration-200
        ${focused
          ? 'border-accent/40 bg-accent/4 shadow-sm'
          : 'border-black/8 bg-surface-2 hover:border-black/12'
        }
      `}
    >
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
        className="flex-1 bg-transparent text-base text-ink placeholder-ink-faint outline-none resize-none py-1 leading-relaxed min-h-[1.75rem] max-h-[6rem]"
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement
          target.style.height = 'auto'
          target.style.height = `${target.scrollHeight}px`
        }}
      />

      <div className="flex items-center gap-1.5 mt-0.5">
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          className={`
            px-4 py-2 text-xs font-bold transition-colors min-h-[44px]
            ${inputValue.trim()
              ? 'bg-accent text-white hover:bg-accent-hover'
              : 'bg-black/10 text-ink-faint cursor-not-allowed opacity-50'}
          `}
        >
          + タスク
        </button>
      </div>
    </div>
  )
}
