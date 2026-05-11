import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import TodoItemCheckboxParticles from './TodoItemCheckboxParticles'
import TodoItemCheckboxStartSparkle from './TodoItemCheckboxStartSparkle'
import type { TodoItem } from '../types'
import { useState, useCallback } from 'react'

interface Props {
    checked: TodoItem['checked']
    handleCheck: () => void
}

export default function TodoItemCheckbox(props: Props) {
    const [justChecked, setJustChecked] = useState(false)
    const checkControls = useAnimation()
    const _handleCheck = useCallback(async () => {
        if (!props.checked) {
            await checkControls.start({
                scale: [1, 1.7, 1.4, 1.6, 1],
                rotate: [0, -15, 15, -8, 0],
                transition: { duration: 0.5, ease: 'easeOut' },
            })
            setJustChecked(true)
            setTimeout(() => setJustChecked(false), 700)
        }
        props.handleCheck()
    }, [props.checked])
    return (
        <div className="relative flex-shrink-0 w-8 h-8">
            <TodoItemCheckboxParticles active={justChecked} />
            <TodoItemCheckboxStartSparkle active={justChecked} />
            <motion.button
                animate={checkControls}
                whileTap={{ scale: 0.85 }}
                onClick={_handleCheck}
                className={`
                  w-8 h-8 border-2 transition-colors duration-200
                  flex items-center justify-center
                  ${props.checked
                        ? 'bg-accent border-accent shadow-md'
                        : 'border-black/15 hover:border-accent/70 bg-white'
                    }
                `}
                aria-label={props.checked ? '未完了にする' : '完了にする'}
                style={{ boxShadow: props.checked ? '0 2px 8px rgba(22,163,74,0.35)' : undefined }}
            >
                <AnimatePresence>
                    {props.checked && (
                        <motion.svg
                            key="check"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                            width="16"
                            height="13"
                            viewBox="0 0 11 9"
                            fill="none"
                        >
                            <path
                                d="M1 4.5L4 7.5L10 1"
                                stroke="white"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </motion.svg>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    )
}