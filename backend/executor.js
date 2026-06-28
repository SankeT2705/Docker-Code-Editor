import { exec, spawn } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)
const TIMEOUT_MS = 30_000

// Each language receives code via STDIN and writes to file or executes directly
const LANG_CONFIG = {
  javascript: {
    image: 'node:20-alpine',
    cmd: 'cat > /tmp/code.js && node /tmp/code.js',
  },
  python: {
    image: 'python:3.12-alpine',
    cmd: 'cat > /tmp/code.py && python3 /tmp/code.py',
  },
  ruby: {
    image: 'ruby:3.3-alpine',
    cmd: 'cat > /tmp/code.rb && ruby /tmp/code.rb',
  },
  php: {
    image: 'php:8.3-alpine',
    cmd: 'cat > /tmp/code.php && php /tmp/code.php',
  },
  bash: {
    image: 'alpine',
    cmd: 'cat > /tmp/code.sh && sh /tmp/code.sh',
  },
  go: {
    image: 'golang:1.22-alpine',
    cmd: 'cat > /tmp/main.go && GOCACHE=/tmp/gc go run /tmp/main.go',
  },
  cpp: {
    image: 'gcc:14',
    cmd: 'cat > /tmp/code.cpp && g++ /tmp/code.cpp -o /tmp/out && /tmp/out',
  },
  c: {
    image: 'gcc:14',
    cmd: 'cat > /tmp/code.c && gcc /tmp/code.c -o /tmp/out && /tmp/out',
  },
  rust: {
    image: 'rust:1.77',
    cmd: 'cat > /tmp/code.rs && rustc /tmp/code.rs -o /tmp/out && /tmp/out',
  },
  java: {
    image: 'eclipse-temurin:21-alpine',
    cmd: 'cat > /tmp/Main.java && javac /tmp/Main.java && java -cp /tmp Main',
  },
}

function runSpawn(cmd, args, inputCode, timeoutMs = TIMEOUT_MS) {
  return new Promise((resolve) => {
    const start = Date.now()
    const child = spawn(cmd, args, { stdio: ['pipe', 'pipe', 'pipe'] })

    let stdout = ''
    let stderr = ''
    let timedOut = false

    const timer = setTimeout(() => {
      timedOut = true
      child.kill('SIGKILL')
    }, timeoutMs)

    child.stdout.on('data', (data) => { stdout += data.toString() })
    child.stderr.on('data', (data) => { stderr += data.toString() })

    child.on('error', (err) => {
      clearTimeout(timer)
      resolve({ stdout: '', stderr: err.message, time: Date.now() - start })
    })

    child.on('close', () => {
      clearTimeout(timer)
      if (timedOut) {
        resolve({ stdout, stderr: `Timed out after ${timeoutMs / 1000}s`, time: Date.now() - start })
      } else {
        resolve({ stdout, stderr, time: Date.now() - start })
      }
    })

    if (inputCode !== undefined && inputCode !== null) {
      child.stdin.write(inputCode)
    }
    child.stdin.end()
  })
}

async function isDockerAvailable() {
  try {
    await execAsync('docker info', { timeout: 3000 })
    return true
  } catch { return false }
}

async function runInDocker(language, code) {
  const config = LANG_CONFIG[language]
  if (!config) throw new Error(`Language "${language}" not supported.`)

  const containerName = `cs-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  const dockerArgs = [
    'run',
    '-i',
    '--rm',
    '--name', containerName,
    '--network=none',
    '--memory=512m',
    '--cpus=1',
    '--tmpfs', '/tmp:exec,size=256m',
    config.image,
    'sh', '-c', config.cmd
  ]

  console.log(`[executor] Running ${language} in Docker via stdin streaming`)
  
  try {
    const result = await runSpawn('docker', dockerArgs, code, TIMEOUT_MS)
    return result
  } finally {
    execAsync(`docker rm -f ${containerName} 2>/dev/null || true`).catch(() => {})
  }
}

async function runJsLocally(code) {
  return runSpawn('node', ['-e', 'let c="";process.stdin.on("data",d=>c+=d);process.stdin.on("end",()=>eval(c))'], code, TIMEOUT_MS)
}

export async function executeCode(language, code) {
  const dockerAvailable = await isDockerAvailable()

  if (dockerAvailable) {
    return runInDocker(language, code)
  }

  if (language === 'javascript') {
    return runJsLocally(code)
  }

  return {
    stdout: '',
    stderr: `Docker not available. Cannot execute ${language} on this server.`,
    time: 0,
  }
}