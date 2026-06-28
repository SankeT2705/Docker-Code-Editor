
export const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', monacoId: 'javascript' },
  { id: 'typescript', label: 'TypeScript', monacoId: 'typescript' },
  { id: 'python', label: 'Python', monacoId: 'python' },
  { id: 'go', label: 'Go', monacoId: 'go' },
  { id: 'rust', label: 'Rust', monacoId: 'rust' },
  { id: 'cpp', label: 'C++', monacoId: 'cpp' },
  { id: 'java', label: 'Java', monacoId: 'java' },
  { id: 'c', label: 'C', monacoId: 'c' },
  { id: 'csharp', label: 'C#', monacoId: 'csharp' },
  { id: 'ruby', label: 'Ruby', monacoId: 'ruby' },
  { id: 'php', label: 'PHP', monacoId: 'php' },
  { id: 'bash', label: 'Bash', monacoId: 'shell' },
  { id: 'sql', label: 'SQL', monacoId: 'sql' },
  { id: 'html', label: 'HTML', monacoId: 'html' },
  { id: 'css', label: 'CSS', monacoId: 'css' },
  { id: 'json', label: 'JSON', monacoId: 'json' },
]

export const DEFAULT_CODE = {
  javascript: `// Welcome to CodeSync\nconsole.log("Hello, World!");\n`,
  typescript: `const greet = (name: string): string => \`Hello, \${name}!\`;\nconsole.log(greet("World"));\n`,
  python: `def greet(name: str) -> str:\n    return f"Hello, {name}!"\n\nprint(greet("World"))\n`,
  go: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}\n`,
  rust: `fn main() {\n    println!("Hello, World!");\n}\n`,
  cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}\n`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n`,
  c: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}\n`,
  csharp: `using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}\n`,
  ruby: `puts "Hello, World!"\n`,
  php: `<?php\necho "Hello, World!\\n";\n`,
  bash: `#!/bin/bash\necho "Hello, World!"\n`,
  sql: `SELECT 'Hello, World!' AS greeting;\n`,
  html: `<!DOCTYPE html>\n<html>\n<body>\n  <h1>Hello, World!</h1>\n</body>\n</html>\n`,
  css: `body { background: #111; color: #fff; font-family: sans-serif; }\n`,
  json: `{\n  "message": "Hello, World!"\n}\n`,
}

export const USER_COLORS = ['#f59e0b','#10b981','#3b82f6','#ec4899','#8b5cf6','#ef4444','#14b8a6','#f97316']

export const THEMES = [
  { id: 'vs-dark', label: 'Dark' },
  { id: 'vs', label: 'Light' },
  { id: 'hc-black', label: 'High Contrast' },
]

export const EXECUTABLE_LANGUAGES = new Set([
  'javascript','typescript','python','go','rust','cpp','java','c','csharp','ruby','php','bash',
])
 