import { useRef, useMemo, useState, useEffect, useCallback } from 'react'
import { Editor } from '@monaco-editor/react'
import * as Y from 'yjs'
import JoinScreen from './JoinScreen.jsx'
import Toolbar from './Toolbar.jsx'
import Sidebar from './Sidebar.jsx'
import OutputPanel from './OutputPanel.jsx'
import { useCollaboration } from './useCollaboration.js'
import { LANGUAGES, DEFAULT_CODE, EXECUTABLE_LANGUAGES } from './constants.js'
import { registerLanguageProviders } from './languageProviders.js'

const OUTPUT_DEFAULT_HEIGHT = 180

function getMonacoLangId(langId) {
  const lang = LANGUAGES.find((l) => l.id === langId)
  return lang ? lang.monacoId : 'plaintext'
}

export default function App() {
  const params = new URLSearchParams(window.location.search)
  const [username, setUsername] = useState(() => params.get('user') || '')
  const [roomId, setRoomId] = useState(() => params.get('room') || '')
  const [language, setLanguage] = useState('javascript')
  const [theme, setTheme] = useState('vs-dark')
  const [fontSize, setFontSize] = useState(14)
  const [output, setOutput] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [outputHeight, setOutputHeight] = useState(OUTPUT_DEFAULT_HEIGHT)
  const [copied, setCopied] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const editorRef = useRef(null)
  const ydoc = useMemo(() => new Y.Doc(), [])
  const yText = useMemo(() => ydoc.getText('monaco'), [ydoc])
  const yMeta = useMemo(() => ydoc.getMap('meta'), [ydoc])
  const { users, connectionStatus, onEditorMount, providerRef } = useCollaboration({ username, roomId, editorRef, yText, ydoc })

  useEffect(() => {
    if (!yMeta) return
    const syncLang = () => {
      const sharedLang = yMeta.get('language')
      if (sharedLang) setLanguage(sharedLang)
    }
    yMeta.observe(syncLang)
    return () => yMeta.unobserve(syncLang)
  }, [yMeta])

  const handleResizeOutput = useCallback((newHeight) => {
    setOutputHeight(newHeight)
    if (editorRef.current) {
      editorRef.current.layout()
    }
  }, [])

  function handleLanguageChange(newLang) {
    setLanguage(newLang)
    if (yMeta) ydoc.transact(() => yMeta.set('language', newLang))
    const currentContent = editorRef.current?.getValue() || ''
    if (!currentContent.trim() && DEFAULT_CODE[newLang]) {
      const model = editorRef.current?.getModel()
      if (model) editorRef.current.executeEdits('', [{ range: model.getFullModelRange(), text: DEFAULT_CODE[newLang] }])
    }
  }

  const handleRun = useCallback(async () => {
    if (!editorRef.current || isRunning) return
    const code = editorRef.current.getValue()
    if (!code.trim()) { setOutput([{ type: 'system', text: 'Nothing to run.' }]); return }
    if (!EXECUTABLE_LANGUAGES.has(language)) { setOutput([{ type: 'error', text: `Execution not supported for ${language}.` }]); return }
    setIsRunning(true)
    setOutput([{ type: 'info', text: `Running ${language}...` }])
    try {
      const res = await fetch('/execute', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ language, code }) })
      if (!res.ok) { const err = await res.json().catch(() => ({ message: 'Server error' })); setOutput([{ type: 'error', text: `Error: ${err.message}` }]); return }
      const data = await res.json()
      const lines = []
      if (data.stdout) data.stdout.split('\n').forEach((l) => lines.push({ type: 'stdout', text: l }))
      if (data.stderr) data.stderr.split('\n').filter(Boolean).forEach((l) => lines.push({ type: 'error', text: l }))
      if (!data.stdout && !data.stderr) lines.push({ type: 'system', text: '(no output)' })
      if (data.time) lines.push({ type: 'system', text: `Done in ${data.time}ms` })
      setOutput(lines)
    } catch (err) { setOutput([{ type: 'error', text: `Network error: ${err.message}` }]) }
    finally { setIsRunning(false) }
  }, [language, isRunning])

  useEffect(() => {
    function handleKeyDown(e) { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleRun() } }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleRun])

  function handleCopy() { navigator.clipboard.writeText(editorRef.current?.getValue() || ''); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  function handleLeave() { providerRef.current?.awareness.setLocalStateField('user', null); providerRef.current?.disconnect(); setUsername(''); setRoomId(''); window.history.pushState({}, '', '/') }
  function handleJoin(user, room) { setUsername(user); setRoomId(room); window.history.pushState({}, '', `?user=${encodeURIComponent(user)}&room=${encodeURIComponent(room)}`) }

  function handleEditorMount(editor, monaco) {
    registerLanguageProviders(monaco)
    const currentText = yText.toString()
    if (!currentText.trim() && DEFAULT_CODE[language]) {
      setTimeout(() => { if (!yText.toString().trim()) ydoc.transact(() => yText.insert(0, DEFAULT_CODE[language])) }, 300)
    }
    editor.updateOptions({
      tabSize: 2,
      minimap: { enabled: true, scale: 0.7 },
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      automaticLayout: true,
      scrollBeyondLastLine: false,
      padding: { top: 12 },
      quickSuggestions: { other: true, comments: true, strings: true },
      wordBasedSuggestions: 'allDocuments',
      suggestOnTriggerCharacters: true,
      snippetSuggestions: 'inline',
    })
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => handleRun())
    onEditorMount(editor)
  }

  if (!username || !roomId) return <JoinScreen onJoin={handleJoin} roomId={roomId} />

  return (
    <div className="h-screen w-full bg-gray-950 flex flex-col overflow-hidden">
      <Toolbar
        language={language}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onThemeChange={setTheme}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        onRun={handleRun}
        isRunning={isRunning}
        connectionStatus={connectionStatus}
        roomId={roomId}
        onCopy={handleCopy}
        copied={copied}
        mobileSidebarOpen={mobileSidebarOpen}
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        userCount={users.length}
      />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          users={users}
          roomId={roomId}
          currentUser={username}
          onLeave={handleLeave}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={getMonacoLangId(language)}
              theme={theme}
              options={{
                fontSize,
                minimap: { enabled: true, scale: 0.7 },
                smoothScrolling: true,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 12 },
                quickSuggestions: { other: true, comments: true, strings: true },
                wordBasedSuggestions: 'allDocuments',
                suggestOnTriggerCharacters: true,
                snippetSuggestions: 'inline',
              }}
              onMount={handleEditorMount}
            />
          </div>
          <OutputPanel output={output} isRunning={isRunning} onClear={() => setOutput([])} height={outputHeight} onResize={handleResizeOutput} />
        </div>
      </div>
    </div>
  )
}