interface Props {
  title: string
  checked: boolean
}

export default function TodoItemTitle({ title, checked }: Props) {
  return (
    <span className={`block text-sm leading-relaxed select-none line-clamp-3 whitespace-pre-wrap transition-all duration-200 ${checked ? 'line-through opacity-40' : 'text-ink'}`}>
      {title || '名称未設定タスク'}
    </span>
  )
}
