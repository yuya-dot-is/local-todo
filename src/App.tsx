import { Suspense, lazy } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTodoStore } from './store/useTodoStore'
import TabBar from './components/TabBar'
import TodoList from './components/TodoList'
import DataNotice from './components/DataNotice'

const Background3D = lazy(() => import('./components/Background3D'))

export default function App() {
  const { tabs, activeTabIndex } = useTodoStore()
  const activeTab = tabs[activeTabIndex] ?? tabs[0]

  return (
    <div className="min-h-screen flex flex-col text-white antialiased">
      {/* 3D background (lazy, non-blocking) */}
      <Suspense fallback={null}>
        <Background3D />
      </Suspense>

      {/* radial gradient overlay */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,106,245,0.12) 0%, transparent 70%)',
        }}
      />

      {/* main layout */}
      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto px-2 sm:px-0">
        {/* header */}
        <header className="pt-8 pb-2 px-4">
          <h1 className="text-2xl font-semibold tracking-tight text-white/90">
            Local TODO
          </h1>
        </header>

        {/* tab bar */}
        <TabBar />

        {/* tab content */}
        <main
          className="flex-1 rounded-b-2xl rounded-tr-2xl mx-0
            bg-surface-2/80 backdrop-blur-glass
            border border-white/8 border-t-0
            shadow-card overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab?.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="p-4 pb-2 min-h-[400px]"
            >
              {activeTab ? (
                <TodoList
                  tabId={activeTab.id}
                  todos={activeTab.todos}
                  parentId={null}
                  depth={0}
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* footer notice */}
        <DataNotice />
      </div>
    </div>
  )
}
