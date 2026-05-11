import { Reorder } from 'framer-motion'
import type { TodoItem as TodoItemType } from '../types'

interface Props {
  item: TodoItemType
}

export default function TodoItemCaret({ item }: Props) {
  return (
    <Reorder.Item
      value={item}
      id={item.id}
      className="group py-0.5"
    >
      <div className="flex items-center gap-2 px-2 hover:bg-black/[0.03] transition-colors group">
        <div className="flex-1 h-0.5 bg-accent/40 rounded-full relative ml-2">
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent/40" />
        </div>
        <span className="text-[10px] text-accent/60 font-medium px-1 flex-shrink-0 select-none">ここに追加</span>
      </div>
    </Reorder.Item>
  )
}
