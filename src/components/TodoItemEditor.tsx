import { useRef, useEffect } from 'react'

interface Props {
  editValue: string
  setEditValue: (val: string) => void
  commitEdit: () => void
  cancelEdit: () => void
}

export default function TodoItemEditor({ editValue, setEditValue, commitEdit, cancelEdit }: Props) {
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.select()
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
    }
  }, [])

  return (
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
        if (e.key === 'Escape') cancelEdit()
      }}
      rows={1}
      className="flex-1 bg-surface-2 px-2 py-1 text-sm text-ink outline-none border border-accent/40 rounded shadow-sm resize-none"
      onInput={(e) => {
        const target = e.target as HTMLTextAreaElement
        target.style.height = 'auto'
        target.style.height = `${target.scrollHeight}px`
      }}
    />
  )
}
