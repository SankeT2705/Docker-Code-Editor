// Custom Monaco Completion Providers for Multi-Language Support

const LANGUAGE_COMPLETIONS = {
  python: {
    keywords: ['def', 'class', 'return', 'import', 'from', 'as', 'if', 'elif', 'else', 'for', 'while', 'in', 'try', 'except', 'finally', 'with', 'lambda', 'yield', 'async', 'await', 'pass', 'break', 'continue', 'True', 'False', 'None', 'print', 'len', 'range', 'enumerate', 'zip', 'map', 'filter', 'list', 'dict', 'set', 'tuple', 'str', 'int', 'float', 'bool', 'isinstance', 'type', 'sum', 'min', 'max'],
    snippets: [
      { label: 'def', insertText: 'def ${1:function_name}(${2:args}):\n\t${3:pass}', doc: 'Function definition' },
      { label: 'class', insertText: 'class ${1:ClassName}:\n\tdef __init__(self, ${2:args}):\n\t\t${3:pass}', doc: 'Class definition' },
      { label: 'ifmain', insertText: 'if __name__ == "__main__":\n\t${1:main()}', doc: 'Main block entrypoint' },
      { label: 'print', insertText: 'print(${1:val})', doc: 'Print output' },
      { label: 'for', insertText: 'for ${1:item} in ${2:iterable}:\n\t${3:pass}', doc: 'For loop' },
    ]
  },
  cpp: {
    keywords: ['#include', '#define', '#ifdef', '#ifndef', 'int', 'float', 'double', 'char', 'bool', 'void', 'auto', 'struct', 'class', 'public', 'private', 'protected', 'virtual', 'override', 'const', 'constexpr', 'static', 'namespace', 'using', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'new', 'delete', 'try', 'catch', 'throw', 'std', 'cout', 'cin', 'endl', 'vector', 'string', 'map', 'set'],
    snippets: [
      { label: 'main', insertText: '#include <iostream>\n\nint main() {\n\tstd::cout << "${1:Hello, World!}" << std::endl;\n\treturn 0;\n}', doc: 'C++ Main Function' },
      { label: 'cout', insertText: 'std::cout << ${1:message} << std::endl;', doc: 'Console Output' },
      { label: 'for', insertText: 'for (int i = 0; i < ${1:n}; ++i) {\n\t${2}\n}', doc: 'Indexed For Loop' },
      { label: 'vector', insertText: 'std::vector<${1:int}> ${2:vec};', doc: 'Standard Vector' },
    ]
  },
  c: {
    keywords: ['#include', '#define', 'int', 'float', 'double', 'char', 'void', 'struct', 'typedef', 'union', 'enum', 'const', 'static', 'extern', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'sizeof', 'printf', 'scanf', 'malloc', 'free'],
    snippets: [
      { label: 'main', insertText: '#include <stdio.h>\n\nint main() {\n\tprintf("${1:Hello, World!\\n}");\n\treturn 0;\n}', doc: 'C Main Function' },
      { label: 'printf', insertText: 'printf("${1:%s\\n}", ${2:arg});', doc: 'Print formatted' },
      { label: 'for', insertText: 'for (int i = 0; i < ${1:n}; i++) {\n\t${2}\n}', doc: 'For Loop' },
    ]
  },
  java: {
    keywords: ['public', 'private', 'protected', 'class', 'interface', 'enum', 'extends', 'implements', 'static', 'final', 'void', 'int', 'double', 'float', 'boolean', 'char', 'String', 'new', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'throws', 'package', 'import', 'System'],
    snippets: [
      { label: 'main', insertText: 'public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("${1:Hello, World!}");\n\t}\n}', doc: 'Java Main Class' },
      { label: 'sout', insertText: 'System.out.println(${1:msg});', doc: 'Print line to console' },
      { label: 'for', insertText: 'for (int i = 0; i < ${1:max}; i++) {\n\t${2}\n}', doc: 'For Loop' },
    ]
  },
  go: {
    keywords: ['package', 'import', 'func', 'var', 'const', 'type', 'struct', 'interface', 'return', 'if', 'else', 'for', 'range', 'switch', 'case', 'default', 'select', 'chan', 'go', 'defer', 'break', 'continue', 'fallthrough', 'make', 'new', 'len', 'cap', 'append', 'fmt', 'string', 'int', 'float64', 'bool', 'error'],
    snippets: [
      { label: 'main', insertText: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("${1:Hello, World!}")\n}', doc: 'Go Main Package' },
      { label: 'pf', insertText: 'fmt.Printf("${1:%v\\n}", ${2:val})', doc: 'fmt.Printf' },
      { label: 'pl', insertText: 'fmt.Println(${1:val})', doc: 'fmt.Println' },
      { label: 'forr', insertText: 'for ${1:i}, ${2:val} := range ${3:slice} {\n\t${4}\n}', doc: 'For Range Loop' },
    ]
  },
  rust: {
    keywords: ['fn', 'let', 'mut', 'const', 'static', 'struct', 'enum', 'trait', 'impl', 'pub', 'use', 'mod', 'match', 'if', 'else', 'loop', 'while', 'for', 'in', 'return', 'break', 'continue', 'type', 'where', 'unsafe', 'async', 'await', 'println!', 'eprintln!', 'format!', 'vec!', 'String', 'str', 'Option', 'Result', 'Some', 'None', 'Ok', 'Err'],
    snippets: [
      { label: 'main', insertText: 'fn main() {\n\tprintln!("${1:Hello, World!}");\n}', doc: 'Rust Main Function' },
      { label: 'println', insertText: 'println!("${1:{}}", ${2:val});', doc: 'Print line macro' },
      { label: 'struct', insertText: 'struct ${1:Name} {\n\t${2:field}: ${3:Type},\n}', doc: 'Struct definition' },
    ]
  },
  csharp: {
    keywords: ['using', 'namespace', 'class', 'struct', 'interface', 'enum', 'public', 'private', 'protected', 'internal', 'static', 'void', 'int', 'double', 'float', 'bool', 'string', 'object', 'var', 'new', 'return', 'if', 'else', 'for', 'foreach', 'while', 'do', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'async', 'await', 'Console'],
    snippets: [
      { label: 'cw', insertText: 'Console.WriteLine(${1:msg});', doc: 'Console WriteLine' },
      { label: 'class', insertText: 'public class ${1:ClassName} {\n\t${2}\n}', doc: 'Class definition' },
    ]
  },
  ruby: {
    keywords: ['def', 'end', 'class', 'module', 'if', 'elsif', 'else', 'unless', 'while', 'until', 'for', 'in', 'do', 'yield', 'return', 'break', 'next', 'redo', 'retry', 'begin', 'rescue', 'ensure', 'raise', 'attr_reader', 'attr_writer', 'attr_accessor', 'puts', 'print', 'p', 'require', 'include'],
    snippets: [
      { label: 'def', insertText: 'def ${1:method_name}(${2:args})\n\t${3}\nend', doc: 'Method definition' },
      { label: 'puts', insertText: 'puts "${1:Hello, World!}"', doc: 'Puts output' },
    ]
  },
  php: {
    keywords: ['<?php', 'function', 'class', 'interface', 'trait', 'extends', 'implements', 'public', 'private', 'protected', 'static', 'const', 'return', 'if', 'else', 'elseif', 'foreach', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'echo', 'print', 'var_dump', 'die', 'exit', 'array', 'use', 'namespace'],
    snippets: [
      { label: 'echo', insertText: 'echo "${1:Hello, World!}\\n";', doc: 'Echo output' },
      { label: 'fn', insertText: 'function ${1:name}(${2:$args}) {\n\t${3}\n}', doc: 'Function definition' },
    ]
  },
  sql: {
    keywords: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'UPDATE', 'DELETE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 'DESC', 'LIMIT', 'OFFSET', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'AND', 'OR', 'NOT', 'NULL', 'IS', 'LIKE', 'IN', 'BETWEEN', 'EXISTS', 'AS', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX'],
    snippets: [
      { label: 'select', insertText: 'SELECT ${1:*} FROM ${2:table_name} WHERE ${3:condition};', doc: 'Select Query' },
      { label: 'create', insertText: 'CREATE TABLE ${1:table_name} (\n\tid INT PRIMARY KEY AUTO_INCREMENT,\n\t${2:column_name} VARCHAR(255) NOT NULL\n);', doc: 'Create Table' },
    ]
  }
}

let providersRegistered = false

export function registerLanguageProviders(monaco) {
  if (providersRegistered || !monaco) return
  providersRegistered = true

  Object.entries(LANGUAGE_COMPLETIONS).forEach(([langId, data]) => {
    monaco.languages.registerCompletionItemProvider(langId, {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        }

        const suggestions = [
          ...data.keywords.map((kw) => ({
            label: kw,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: kw,
            range,
          })),
          ...data.snippets.map((snip) => ({
            label: snip.label,
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: snip.insertText,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: snip.doc,
            range,
          })),
        ]

        return { suggestions }
      },
    })
  })
}
