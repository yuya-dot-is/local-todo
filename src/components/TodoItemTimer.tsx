import { useState, useEffect, useMemo } from 'react'

interface Props {
  isActive: boolean
  stopwatchStartTime: number | null
  stopwatchAccumulatedTime: number
  stopwatchPaused: boolean
  estimate: string | undefined
}

export default function TodoItemTimer({
  isActive,
  stopwatchStartTime,
  stopwatchAccumulatedTime,
  stopwatchPaused,
  estimate,
}: Props) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!isActive || (!stopwatchStartTime && !stopwatchAccumulatedTime)) {
      setElapsed(0)
      return
    }

    const update = () => {
      const currentSession = stopwatchStartTime ? (Date.now() - stopwatchStartTime) : 0
      setElapsed(Math.floor((stopwatchAccumulatedTime + currentSession) / 1000))
    }

    update()
    if (!stopwatchPaused && stopwatchStartTime) {
      const interval = setInterval(update, 1000)
      return () => clearInterval(interval)
    }
  }, [isActive, stopwatchStartTime, stopwatchAccumulatedTime, stopwatchPaused])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const formatEstimate = (minStr: string) => {
    const totalMinutes = parseInt(minStr || '0')
    if (isNaN(totalMinutes) || totalMinutes <= 0) return ''
    const h = Math.floor(totalMinutes / 60)
    const m = totalMinutes % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`
  }

  const isOverTime = useMemo(() => {
    const estimateMinutes = parseInt(estimate || '0')
    if (isNaN(estimateMinutes) || estimateMinutes <= 0) return false
    return elapsed > estimateMinutes * 60
  }, [estimate, elapsed])

  if (!estimate && !isActive) return null

  return (
    <div className="flex items-center gap-2 mt-0.5">
      {isActive && (
        <span className={`font-mono text-[10px] font-bold ${isOverTime ? 'text-red-500' : 'text-accent'}`}>
          {formatTime(elapsed)}
        </span>
      )}
      {estimate && (
        <span className="text-ink-faint text-[10px] italic">
          {formatEstimate(estimate)}
        </span>
      )}
    </div>
  )
}
