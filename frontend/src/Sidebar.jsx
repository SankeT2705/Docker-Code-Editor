 
export default function Sidebar({ users, roomId, currentUser, onLeave, mobileOpen, onCloseMobile }) {
  const sidebarContent = (
    <div className="flex flex-col h-full bg-gray-900 border-r border-gray-800 w-56 shrink-0">
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-0.5">Room</p>
          <p className="text-sm text-amber-400 font-mono font-semibold truncate max-w-[140px]" title={roomId}>{roomId}</p>
        </div>
        {onCloseMobile && (
          <button onClick={onCloseMobile} className="md:hidden text-gray-400 hover:text-white p-1">
            ✕
          </button>
        )}
      </div>
      <div className="px-4 py-3 flex-1 overflow-y-auto">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">Online · {users.length}</p>
        <ul className="space-y-2">
          {users.map((user, idx) => {
            const initials = (user.username || 'U').split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
            const userKey = user.clientId ? `${user.clientId}-${user.username}` : `${user.username}-${idx}`
            return (
              <li key={userKey} className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-gray-950 shrink-0" style={{ backgroundColor: user.color || '#f59e0b' }}>{initials}</div>
                <span className="text-sm text-gray-300 truncate" style={user.username === currentUser ? { color: user.color } : {}}>
                  {user.username}{user.username === currentUser && <span className="text-gray-500 text-xs ml-1">(you)</span>}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="p-4 border-t border-gray-800">
        <button onClick={onLeave} className="w-full text-xs text-gray-500 hover:text-gray-300 py-1.5 rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M5 2H2C1.45 2 1 2.45 1 3V9C1 9.55 1.45 10 2 10H5M8 4L11 6L8 8M11 6H4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Leave room
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onCloseMobile} />
          <aside className="relative z-50 flex flex-col h-full shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}

 