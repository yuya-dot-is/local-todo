interface Props {
  title: string
  isHeader: boolean
  checked: boolean
  onDoubleClick: () => void
}

export default function TodoItemTitle({
  title,
  isHeader,
  checked,
  onDoubleClick,
}: Props) {
  return (
    <span
      onDoubleClick={onDoubleClick}
      className={`
        leading-relaxed cursor-default select-none line-clamp-3 whitespace-pre-wrap
        transition-all duration-300
        ${isHeader ? 'text-base font-bold' : 'text-sm'}
        ${checked && !isHeader ? 'line-through opacity-50' : ''}
      `}
    >
      {title || (isHeader ? '名称未設定ヘッダー' : '名称未設定タスク')}
    </span>
  )
}
