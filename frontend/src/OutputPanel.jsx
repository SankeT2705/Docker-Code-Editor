
import { useEffect, useRef, useState } from 'react'

export default function OutputPanel({ output, isRunning, onClear, height, onResize }) {
  const scrollRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({ isDragging: false, startY: 0, startHeight: 0 })

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight }, [output])

  function handleStart(clientY) {
    setIsDragging(true)
    dragRef.current = { isDragging: true, startY: clientY, startHeight: height }

    function onMove(ev) {
      if (!dragRef.current.isDragging) return
      const currentY = ev.touches ? ev.touches[0].clientY : ev.clientY
      const delta = dragRef.current.startY - currentY
      const newHeight = Math.max(80, Math.min(600, dragRef.current.startHeight + delta))
      onResize(newHeight)
    }

    function onEnd() {
      dragRef.current.isDragging = false
      setIsDragging(false)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onEnd)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onEnd)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onEnd)
  }

  function onMouseDown(e) {
    handleStart(e.clientY)
  }

  function onTouchStart(e) {
    if (e.touches && e.touches[0]) {
      handleStart(e.touches[0].clientY)
    }
  }

  function getLineClass(line) {
    if (line.type === 'error') return 'text-red-400'
    if (line.type === 'system') return 'text-gray-500 italic'
    if (line.type === 'info') return 'text-amber-400'
    return 'text-gray-200'
  }

  return (
    <div className="bg-gray-950 border-t border-gray-800 flex flex-col relative" style={{ height }}>
      {isDragging && (
        <div className="fixed inset-0 z-50 cursor-row-resize select-none" />
      )}
      <div
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        className="h-2 -mt-1 bg-gray-800 hover:bg-amber-400 cursor-row-resize shrink-0 transition-colors z-10 touch-none flex items-center justify-center"
      >
        <div className="w-8 h-0.5 bg-gray-600 rounded-full" />
      </div>
      <div className="flex items-center px-3 py-1.5 border-b border-gray-800 shrink-0">
        <span className="text-xs text-gray-400 font-medium">Output</span>
        {isRunning && <span className="text-xs text-amber-400 ml-2 animate-pulse">Running...</span>}
        <div className="flex-1" />
        {output.length > 0 && <button onClick={onClear} className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-1.5 py-0.5 rounded hover:bg-gray-800">Clear</button>}
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto output-scroll px-3 py-2 font-mono text-xs leading-5">
        {output.length === 0 ? <p className="text-gray-600 italic">Run your code to see output here.</p> : output.map((line, i) => <div key={i} className={`whitespace-pre-wrap break-all ${getLineClass(line)}`}>{line.text}</div>)}
      </div>
    </div>
  )
}

 