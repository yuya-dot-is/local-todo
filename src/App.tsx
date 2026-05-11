import { AnimatePresence, motion } from 'framer-motion'
import { useTodoStore } from './store/useTodoStore'
import TodoList from './components/TodoList'
import DataNotice from './components/DataNotice'

function InfoView() {
  const { setShowInfoTab } = useTodoStore()
  return (
    <div className="flex flex-col gap-6 items-center pt-8 px-4 text-center">
      <div className="flex items-center gap-3">
        <h1
          className="text-[3rem] leading-none tracking-wide"
          style={{ fontFamily: 'Damion, cursive' }}
        >
          <span style={{ color: '#16a34a' }}>local</span>
          <span style={{ color: '#1a2332' }}> todo</span>
        </h1>
      </div>

      <DataNotice />

      <div className="max-w-md text-sm text-ink-muted leading-relaxed space-y-4 bg-surface-2/50 p-6">
        <p>
          <strong className="text-ink font-bold">local todo</strong> は、あなたのブラウザ内（ローカル）にデータを保存するタスク管理アプリです。
          外部のサーバーへデータが送信されることはなく、安全かつ高速に動作します。
        </p>
        <div className="text-left bg-white p-4 shadow-sm border border-black/5">
          <h3 className="font-bold text-ink mb-2">💡 使い方・TIPS</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>タスクを掴んで上下にドラッグ＆ドロップで並べ替え</li>
            <li>「ここに追加」のプレースホルダー付近に新しいタスクが追加されます</li>
            <li>ブラウザを閉じてもデータは保持されます</li>
          </ul>
        </div>
      </div>

      <button
        onClick={() => setShowInfoTab(false)}
        className="px-6 py-2 bg-accent text-white font-bold rounded-full shadow-md hover:bg-accent-hover transition-colors"
      >
        閉じる
      </button>
    </div>
  )
}

export default function App() {
  const { todos, showInfoTab, setShowInfoTab } = useTodoStore()

  return (
    <div className="h-screen flex flex-col text-ink antialiased overflow-hidden">
      {/* main layout */}
      <div className="flex-1 overflow-y-auto scrollbar-thin flex flex-col max-w-2xl w-full mx-auto px-2 sm:px-0 pt-6">

        <header className="flex justify-between items-center px-4 mb-4">
          <h1 className="text-xl font-bold tracking-tight text-ink flex items-center gap-2">
            <span className="w-2 h-6 bg-accent rounded-full" />
            My Tasks
          </h1>
          <button
            onClick={() => setShowInfoTab(true)}
            className="w-8 h-8 flex items-center justify-center text-ink-faint hover:text-ink hover:bg-black/5 rounded-full transition-colors"
            title="Info"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </button>
        </header>

        {/* content card */}
        <main
          className="flex-1 bg-white/85 backdrop-blur-glass shadow-card flex flex-col min-h-0 relative rounded-t-3xl"
        >
          <AnimatePresence mode="wait">
            {showInfoTab ? (
              <motion.div
                key="info"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex-1 overflow-y-auto p-4 pb-12"
              >
                <InfoView />
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col min-h-0"
              >
                <TodoList todos={todos} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
