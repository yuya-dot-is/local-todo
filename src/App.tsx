import { Suspense, lazy } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTodoStore } from './store/useTodoStore'
import TabBar from './components/TabBar'
import TodoList from './components/TodoList'
import DataNotice from './components/DataNotice'

const Background3D = lazy(() => import('./components/Background3D'))

function InfoTab() {
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
            <li>「H」ボタンでタスクを<strong>ヘッダー</strong>に切り替え可能</li>
            <li>タブを追加して、プロジェクトやカテゴリごとに管理</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const { tabs, activeTabIndex, showInfoTab } = useTodoStore()
  const activeTab = tabs[activeTabIndex] ?? tabs[0]

  return (
    <div className="h-screen flex flex-col text-ink antialiased overflow-hidden">
      {/* 3D background (lazy, non-blocking) */}
      <Suspense fallback={null}>
        <Background3D />
      </Suspense>

      {/* soft gradient overlay */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(22,163,74,0.07) 0%, transparent 60%)',
        }}
      />

      {/* main layout */}
      <div className="flex-1 overflow-y-auto scrollbar-thin pr-1 -mr-1 flex flex-col max-w-2xl w-full mx-auto px-2 sm:px-0 pt-2 pb-8">

        {/* tab bar */}
        <TabBar />

        {/* tab content card */}
        <main
          className="flex-1 bg-white/85 backdrop-blur-glass shadow-card flex flex-col min-h-0"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={showInfoTab ? 'info' : activeTab?.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.16 }}
              className="flex-1 flex flex-col min-h-0 p-4 pb-6"
            >
              {showInfoTab ? (
                <InfoTab />
              ) : activeTab ? (
                <TodoList
                  tabId={activeTab.id}
                  todos={activeTab.todos}
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
