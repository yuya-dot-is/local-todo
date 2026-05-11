import { useRef, useEffect } from 'react'

interface Props {
  editValue: string
  setEditValue: (val: string) => void
  commitEdit: () => void
  cancelEdit: () => void
}

export default function TodoItemEditor({
  editValue,
  setEditValue,
  commitEdit,
  cancelEdit,
}: Props) {
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.select()
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
    }
  }, [])

  return (
    <div className="flex-1 flex flex-col gap-1">
      <textarea
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={commitEdit}
        onKeyDown={(e) => {
          if (e.nativeEvent.isComposing) return
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            commitEdit()
          }
          if (e.key === 'Escape') {
            cancelEdit()
          }
        }}
        rows={1}
        className="w-full bg-surface-2 px-2.5 py-1 text-sm text-ink
          outline-none border border-accent/40 focus:border-accent shadow-sm resize-none leading-relaxed"
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement
          target.style.height = 'auto'
          target.style.height = `${target.scrollHeight}px`
        }}
      />
    </div>
  )
}
