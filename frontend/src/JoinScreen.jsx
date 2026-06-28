 
import { useState } from 'react'

export default function JoinScreen({ onJoin, roomId }) {
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState(roomId || '')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmedUser = username.trim()
    const trimmedRoom = room.trim()
    if (!trimmedUser) return setError('Enter a username.')
    if (!trimmedRoom) return setError('Enter a room ID.')
    setError('')
    onJoin(trimmedUser, trimmedRoom)
  }

  return (
    <main className="h-screen w-full bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 4h12M3 9h8M3 14h10" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-white text-xl font-bold tracking-tight">CodeSync</span>
          </div>
          <p className="text-gray-400 text-sm">Collaborative code editing, in real time.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. alice" autoComplete="off" autoFocus className="w-full px-3 py-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-amber-400 text-sm placeholder-gray-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">Room ID</label>
            <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="e.g. project-alpha" autoComplete="off" className="w-full px-3 py-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-amber-400 text-sm placeholder-gray-500 transition-colors" />
            <p className="text-xs text-gray-500 mt-1.5">Share this ID with teammates to collaborate.</p>
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button type="submit" className="mt-1 w-full py-2.5 rounded-lg bg-amber-400 text-gray-950 font-semibold text-sm hover:bg-amber-300 active:scale-95 transition-all">Join room</button>
        </form>
        <p className="text-center text-xs text-gray-600 mt-6">No account needed. Rooms are ephemeral.</p>
      </div>
    </main>
  )
}
 