interface Props {
  title: string
  checked: boolean
  onDoubleClick: () => void
}

export default function TodoItemTitle({
  title,
  checked,
  onDoubleClick,
}: Props) {
  return (
    <span
      onDoubleClick={onDoubleClick}
      className={`
        leading-relaxed cursor-default select-none line-clamp-3 whitespace-pre-wrap
        transition-all duration-300 text-sm
        ${checked ? 'line-through opacity-50' : ''}
      `}
    >
      {title || '名称未設定タスク'}
    </span>
  )
}
