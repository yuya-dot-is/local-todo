export default function DataNotice() {
  return (
    <footer className="flex items-center justify-center gap-2 py-3 px-4">
      <span className="w-1.5 h-1.5 rounded-full bg-green-400/70 flex-shrink-0" />
      <p className="text-[11px] text-white/30 text-center">
        データはこのブラウザにのみ保存されます
        <span className="mx-1 text-white/15">·</span>
        <span className="text-white/20">Your data is saved locally in this browser only</span>
      </p>
    </footer>
  )
}
