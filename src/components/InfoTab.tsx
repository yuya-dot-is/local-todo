interface Props {
  isActive: boolean
  onClick: () => void
}

export default function InfoTab({ isActive, onClick }: Props) {
  return (
    <div
      className={`
        flex items-center justify-center px-1 py-1 cursor-pointer
        border border-b-0 transition-colors flex-shrink-0
        ${isActive
          ? 'bg-white border-black/8 shadow-tab text-accent'
          : 'bg-accent border-transparent text-white hover:bg-accent-hover'
        }
      `}
      style={{ borderRadius: 0 }}
      onClick={onClick}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    </div>
  )
}
