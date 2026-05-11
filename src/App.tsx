import { Suspense, lazy } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTodoStore } from './store/useTodoStore'
import TabBar from './components/TabBar'
import TodoList from './components/TodoList'
import DataNotice from './components/DataNotice'

const Background3D = lazy(() => import('./components/Background3D'))

function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Title in Caveat */}
      <h1
        className="text-[2.5rem] leading-none tracking-wide"
        style={{ fontFamily: 'Shadows Into Light Two, cursive' }}
      >
        <span style={{ color: '#16a34a' }}>local</span>
        <span style={{ color: '#1a2332' }}> todo</span>
      </h1>
    </div>
  )
}

export default function App() {
  const { tabs, activeTabIndex } = useTodoStore()
  const activeTab = tabs[activeTabIndex] ?? tabs[0]

  return (
    <div className="min-h-screen flex flex-col text-ink antialiased">
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
      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto px-2 sm:px-0 pb-8">
        {/* header */}
        <header className="pt-8 pb-3 px-4">
          <Logo />
        </header>

        {/* data notice at top */}
        <DataNotice />

        {/* tab bar */}
        <TabBar />

        {/* tab content card */}
        <main
          className="flex-1 rounded-b-2xl rounded-tr-2xl
            bg-white/85 backdrop-blur-glass
            border border-black/8 border-t-0
            shadow-card"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab?.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.16 }}
              className="p-4 pb-6 min-h-[400px]"
            >
              {activeTab ? (
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
