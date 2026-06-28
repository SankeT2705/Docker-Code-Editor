import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { YSocketIO } from 'y-socket.io/dist/server'
import { executeCode } from './executor.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PORT = process.env.PORT || 3000
const MAX_CODE_LENGTH = 50_000

const app = express()
app.use(express.json({ limit: '100kb' }))

// Use absolute path so it works correctly inside Docker regardless of cwd
const publicDir = join(__dirname, 'public')
app.use(express.static(publicDir, {
  // Ensure correct MIME types for JS/CSS assets
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript')
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css')
    }
  }
}))

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
  },
})

const ySocketIO = new YSocketIO(io)
ySocketIO.initialize()

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ─── Code execution ───────────────────────────────────────────────────────────
app.post('/execute', async (req, res) => {
  const { language, code } = req.body

  if (!language || typeof language !== 'string') {
    return res.status(400).json({ message: 'language is required.' })
  }
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ message: 'code is required.' })
  }
  if (code.length > MAX_CODE_LENGTH) {
    return res.status(400).json({ message: `Code exceeds maximum length of ${MAX_CODE_LENGTH} characters.` })
  }

  const BLOCKED_PATTERNS = [
    /require\s*\(\s*['"]child_process['"]\s*\)/,
    /import\s+.*child_process/,
    /process\.exit/,
    /__import__.*os.*system/,
    /import\s+os\s*;?\s*os\s*\.\s*system/,
  ]
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(code)) {
      return res.status(400).json({ message: 'Code contains blocked patterns.' })
    }
  }

  try {
    const result = await executeCode(language, code)
    res.json(result)
  } catch (err) {
    console.error('Execution error:', err)
    res.status(500).json({ message: 'Execution failed. Please try again.' })
  }
})

// ─── Catch-all: serve index.html for all non-API routes (SPA) ─────────────────
app.get('*', (_req, res) => {
  res.sendFile(join(publicDir, 'index.html'))
})

httpServer.listen(PORT, () => {
  console.log(`CodeSync server running on port ${PORT}`)
  console.log(`Serving static files from: ${publicDir}`)
})