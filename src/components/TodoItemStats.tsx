interface Props {
  completed: number
  total: number
}

export default function TodoItemStats({ completed, total }: Props) {
  return (
    <span className="text-[11px] text-white/90 font-medium px-2 py-0.5 bg-black/15 select-none ml-1">
      {completed} / {total}
    </span>
  )
}
