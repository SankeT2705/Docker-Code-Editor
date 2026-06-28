 
import { useState } from 'react'
import { LANGUAGES, THEMES, EXECUTABLE_LANGUAGES } from './constants'

function StatusDot({ status }) {
  const colors = { connected: 'bg-green-400', connecting: 'bg-amber-400 animate-pulse', disconnected: 'bg-red-500' }
  const labels = { connected: 'Connected', connecting: 'Connecting...', disconnected: 'Disconnected' }
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${colors[status] || colors.disconnected}`} />
      <span className="text-xs text-gray-400 hidden sm:inline">{labels[status] || 'Disconnected'}</span>
    </div>
  )
}

export default function Toolbar({
  language,
  onLanguageChange,
  theme,
  onThemeChange,
  fontSize,
  onFontSizeChange,
  onRun,
  isRunning,
  connectionStatus,
  roomId,
  onCopy,
  copied,
  mobileSidebarOpen,
  onToggleMobileSidebar,
  userCount,
}) {
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
  const canRun = EXECUTABLE_LANGUAGES.has(language)

  function copyRoom() {
    navigator.clipboard.writeText(`${window.location.origin}?room=${roomId}`)
    setShareCopied(true)
    setTimeout(() => setShareCopied(false), 2000)
  }

  return (
    <>
      <header className="h-12 bg-gray-900 border-b border-gray-800 flex items-center px-3 gap-2 shrink-0">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden flex items-center gap-1 text-gray-400 hover:text-white p-1.5 rounded hover:bg-gray-800 transition-colors"
          title="Toggle online users sidebar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span className="text-xs bg-amber-400 text-gray-950 px-1.5 py-0.5 rounded-full font-bold">{userCount}</span>
        </button>

        <div className="flex items-center gap-2 mr-1 sm:mr-2">
          <div className="w-6 h-6 bg-amber-400 rounded flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3h10M2 7h6M2 11h8" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <span className="text-white text-sm font-semibold hidden md:inline">CodeSync</span>
        </div>

        <select value={language} onChange={(e) => onLanguageChange(e.target.value)} className="bg-gray-800 text-gray-200 text-xs rounded px-2 py-1.5 border border-gray-700 focus:outline-none focus:border-amber-400 cursor-pointer min-w-[100px] max-w-[130px]">
          {LANGUAGES.map((lang) => <option key={lang.id} value={lang.id}>{lang.label}</option>)}
        </select>

        <select value={theme} onChange={(e) => onThemeChange(e.target.value)} className="bg-gray-800 text-gray-200 text-xs rounded px-2 py-1.5 border border-gray-700 focus:outline-none focus:border-amber-400 cursor-pointer hidden sm:block">
          {THEMES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>

        <div className="hidden md:flex items-center gap-1.5">
          <span className="text-gray-500 text-xs">A</span>
          <input type="range" min="11" max="24" value={fontSize} onChange={(e) => onFontSizeChange(Number(e.target.value))} className="w-16 cursor-pointer" title={`Font size: ${fontSize}px`} />
          <span className="text-gray-400 text-xs w-6">{fontSize}</span>
        </div>

        <div className="flex-1" />

        <StatusDot status={connectionStatus} />

        <button onClick={copyRoom} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded px-2 py-1.5 transition-colors">
          {shareCopied ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> : <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 1H11V4M11 1L5 7M4 2H2C1.45 2 1 2.45 1 3V10C1 10.55 1.45 11 2 11H9C9.55 11 10 10.55 10 10V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          <span className="hidden sm:inline">{shareCopied ? 'Link Copied!' : 'Share'}</span>
        </button>

        <button onClick={onCopy} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded px-2 py-1.5 transition-colors">
          {copied ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> : <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M1 8V2C1 1.45 1.45 1 2 1H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>}
          <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
        </button>

        <button onClick={() => setShowShortcuts(true)} className="text-gray-400 hover:text-gray-200 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded px-2 py-1.5 transition-colors hidden sm:block" title="Shortcuts">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 6.5H5M7 6.5H7.01M9 6.5H10M4 8.5H10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
        </button>

        <button onClick={onRun} disabled={!canRun || isRunning} className={`flex items-center gap-1.5 text-xs font-semibold rounded px-3 py-1.5 transition-all ${canRun && !isRunning ? 'bg-amber-400 hover:bg-amber-300 text-gray-950 active:scale-95' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}>
          {isRunning ? <>
            <svg className="animate-spin" width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="20" strokeDashoffset="10"/></svg>Running
          </> : <>
            <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><path d="M0 0L10 6L0 12V0Z"/></svg>Run
          </>}
        </button>
      </header>

      {showShortcuts && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowShortcuts(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold">Keyboard shortcuts</h2>
              <button onClick={() => setShowShortcuts(false)} className="text-gray-400 hover:text-white p-1">✕</button>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-800">
                {[['Run code','Ctrl + Enter'],['Format code','Shift + Alt + F'],['Toggle comment','Ctrl + /'],['Find','Ctrl + F'],['Go to line','Ctrl + G']].map(([action, keys]) => (
                  <tr key={action}><td className="py-2 text-gray-400">{action}</td><td className="py-2 text-right"><kbd className="text-xs bg-gray-800 text-gray-200 px-1.5 py-0.5 rounded border border-gray-700 font-mono">{keys}</kbd></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}

 