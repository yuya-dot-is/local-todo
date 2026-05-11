export default function DataNotice() {
  return (
    <div className="flex items-center gap-2 px-4 py-2 mx-4 mb-2 rounded-xl
      bg-accent/8 border border-accent/20">
      <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 animate-pulse" />
      <p className="text-[11px] text-accent/80 leading-snug">
        データはこのブラウザにのみ保存されます
        <span className="mx-1.5 text-accent/30">·</span>
        <span className="text-accent/60">Your data is saved locally in this browser only</span>
      </p>
    </div>
  )
}
