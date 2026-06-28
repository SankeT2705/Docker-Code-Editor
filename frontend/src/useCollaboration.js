
import { useEffect, useRef, useState, useCallback } from 'react'
import { SocketIOProvider } from 'y-socket.io'
import { MonacoBinding } from 'y-monaco'
import { USER_COLORS } from './constants'

function getUserColor(username) {
  let hash = 0
  for (let i = 0; i < username.length; i++) hash = username.charCodeAt(i) + ((hash << 5) - hash)
  return USER_COLORS[Math.abs(hash) % USER_COLORS.length]
}

export function useCollaboration({ username, roomId, editorRef, yText, ydoc }) {
  const [users, setUsers] = useState([])
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const providerRef = useRef(null)
  const bindingRef = useRef(null)

  const setupBinding = useCallback(() => {
    if (!editorRef.current || !yText || !providerRef.current) return
    if (bindingRef.current) { bindingRef.current.destroy(); bindingRef.current = null }
    bindingRef.current = new MonacoBinding(yText, editorRef.current.getModel(), new Set([editorRef.current]), providerRef.current.awareness)
  }, [editorRef, yText])

  useEffect(() => {
    if (!username || !roomId) return
    const color = getUserColor(username)
    const provider = new SocketIOProvider('/', roomId, ydoc, { autoConnect: true })
    providerRef.current = provider
    provider.awareness.setLocalStateField('user', { username, color })
    setConnectionStatus('connecting')
    provider.on('sync', (isSynced) => { if (isSynced) setConnectionStatus('connected') })
    provider.on('status', ({ status }) => setConnectionStatus(status === 'connected' ? 'connected' : 'connecting'))

    const updateUsers = () => {
      const entries = Array.from(provider.awareness.getStates().entries())
      const activeUsers = entries
        .filter(([_, s]) => s.user?.username)
        .map(([clientId, s]) => ({ clientId, username: s.user.username, color: s.user.color }))

      setUsers(activeUsers)

      activeUsers.forEach(({ username: uname, color: ucolor }) => {
        const styleId = `cursor-style-${uname}`
        if (!document.getElementById(styleId)) {
          const style = document.createElement('style')
          style.id = styleId
          style.textContent = `.yRemoteSelection-${uname}{background-color:${ucolor}33}.yRemoteSelectionHead-${uname}{border-color:${ucolor}}.yRemoteSelectionHead-${uname}::after{content:"${uname}";background-color:${ucolor};color:#000}`
          document.head.appendChild(style)
        }
      })
    }

    provider.awareness.on('change', updateUsers)
    updateUsers()
    if (editorRef.current) setupBinding()

    const handleBeforeUnload = () => {
      if (providerRef.current) {
        providerRef.current.awareness.setLocalStateField('user', null)
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      provider.awareness.off('change', updateUsers)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      if (bindingRef.current) { bindingRef.current.destroy(); bindingRef.current = null }
      if (providerRef.current) {
        providerRef.current.awareness.setLocalStateField('user', null)
        providerRef.current.disconnect()
        providerRef.current = null
      }
      setConnectionStatus('disconnected')
    }
  }, [username, roomId, ydoc, setupBinding, editorRef])

  const onEditorMount = useCallback((editor) => {
    editorRef.current = editor
    setupBinding()
  }, [editorRef, setupBinding])

  return { users, connectionStatus, onEditorMount, providerRef }
}

 