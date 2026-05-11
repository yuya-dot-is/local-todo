interface Props {
  stopwatchActive: boolean
  stopwatchPaused: boolean
  setStopwatch: (active: boolean) => void
  pauseStopwatch: (paused: boolean) => void
  resetStopwatch: () => void
}

export default function TodoStopwatch({
  stopwatchActive,
  stopwatchPaused,
  setStopwatch,
  pauseStopwatch,
  resetStopwatch,
}: Props) {
  return (
    <div className="mb-2 flex items-center gap-2">
      {!stopwatchActive ? (
        <button
          onClick={() => setStopwatch(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold transition-all bg-accent/10 text-accent hover:bg-accent/20"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          計測開始
        </button>
      ) : (
        <>
          <button
            onClick={() => pauseStopwatch(!stopwatchPaused)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold transition-all
              ${stopwatchPaused ? 'bg-accent/10 text-accent hover:bg-accent/20' : 'bg-red-500 text-white shadow-sm'}`}
          >
            {stopwatchPaused ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                再開
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
                一時停止
              </>
            )}
          </button>
          <button
            onClick={resetStopwatch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold transition-all bg-black/5 text-ink-muted hover:bg-black/10"
            title="リセット"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            リセット
          </button>
          <button
            onClick={() => setStopwatch(false)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold transition-all bg-black text-white hover:bg-black/80"
          >
            停止
          </button>
        </>
      )}
    </div>
  )
}
