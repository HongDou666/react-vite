/*
  Monaco Editor 是微软开发的​​现代化代码编辑器​​，也是 VS Code 的底层编辑器核心
*/
import Editor, { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'

import styles from './index.module.scss'

// 配置 Monaco Editor 使用本地加载的 monaco 实例，而不是从 CDN 加载
loader.config({ monaco })

// 自定义语言的唯一标识符
const RULE_LANGUAGE_ID = 'ruleLanguage'

// 语言的关键字列表
const RULE_KEYWORDS = ['rule1', 'rule2', 'rule3', 'validate', 'if', 'then', 'Add', 'Sub']
// 语言的预定义值列表
const RULE_VALUES = ['value1', 'value2', 'value3', 'true', 'false']

const RuleEditorDemo = () => {
  // 初始化编辑器内容
  const [code, setCode] = useState<string>(
    `// 规则表达式编辑器示例\n` +
      `validate userAge if age > 18 then true\n` +
      `rule1 = value1\n` +
      `rule2 = (value2 || value3) && true`
  )

  /**
   * 编辑器挂载后的处理函数
   *
   * @param editor 编辑器实例
   * @param monaco Monaco编辑器对象
   */
  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco) => {
    // 注册语言
    monaco.languages.register({ id: RULE_LANGUAGE_ID })

    // 配置基础语言行为（括号、注释等）
    monaco.languages.setLanguageConfiguration(RULE_LANGUAGE_ID, {
      // comments 包含行注释和块注释的符号
      comments: {
        lineComment: '//', // 单行注释符号
        blockComment: ['/*', '*/'] // 块注释符号的开始和结束标记
      },
      /*
        brackets 包含括号符号的开始和结束标记
          括号匹配高亮：当光标靠近一个括号时，匹配的括号会高亮显示
          括号着色：不同类型的括号可以用不同颜色区分
          括号导航：支持在匹配括号间跳转
      */
      brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')']
      ],
      // autoClosingPairs 包含自动闭合的括号符号的开始和结束标记
      autoClosingPairs: [
        { open: '{', close: '}' }, // 输入 { 会自动插入 }
        { open: '[', close: ']' }, // 输入 [ 会自动插入 ]
        { open: '(', close: ')' }, // 输入 ( 会自动插入 )
        { open: '"', close: '"' }, // 输入 " 会自动插入 "
        { open: "'", close: "'" } // 输入 ' 会自动插入 '
      ],
      // surroundingPairs 定义环绕对,定义当用户选中文本后输入开始符号时，会用这对符号包裹选中文本
      surroundingPairs: [
        { open: '{', close: '}' }, // 选中文本后输入 { → {选中文本}
        { open: '[', close: ']' }, // 选中文本后输入 [ → [选中文本]
        { open: '(', close: ')' }, // 选中文本后输入 ( → (选中文本)
        { open: '"', close: '"' }, // 选中文本后输入 " → "选中文本"
        { open: "'", close: "'" } // 选中文本后输入 ' → '选中文本'
      ],
      // indentationRules 定义缩进规则
      indentationRules: {
        /*
          increaseIndentPattern: 匹配需要增加缩进的行
          这里匹配以 if, then, else 或 rule 加数字开头的行
          当检测到这些关键字时，下一行会自动增加缩进
        */
        increaseIndentPattern: /^\s*(if|then|else|rule\d+)\b/,
        /*
          decreaseIndentPattern: 匹配需要减少缩进的行
          这里匹配以 end 或 else 开头的行
          当检测到这些关键字时，当前行会减少缩进
        */
        decreaseIndentPattern: /^\s*(end|else)\b/
      }
    })

    // 使用 Monarch 为自定义语言 RULE_LANGUAGE_ID 配置语法高亮规则
    monaco.languages.setMonarchTokensProvider(RULE_LANGUAGE_ID, {
      keywords: RULE_KEYWORDS, // 预定义的关键字列表 会被特殊高亮显示
      values: RULE_VALUES, // 预定义的值列表 如true/false等 会被特殊高亮显示
      operators: ['=', '>', '<', '>=', '<=', '==', '!=', '&&', '||'], // 操作符列表，用于后续的语法分类
      symbols: /[=><!~?:&|+\-*\/\^%]+/, // 匹配所有符号的正则表达式
      escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/, // 定义字符串中的转义字符规则

      tokenizer: {
        // 定义根状态（root）和子状态（如字符串处理、空白字符等）
        root: [
          // 标识符和关键字
          [
            /[a-zA-Z_]\w*/,
            {
              cases: {
                /*
                  检查匹配的文本是否在预定义的 keywords 列表中
                  如果是，将其标记为 keyword 类型（通常用于语法高亮）
                  示例：如果 RULE_KEYWORDS 包含 if，那么代码中的 if 会被高亮显示
                */
                '@keywords': 'keyword',
                /*
                  检查匹配的文本是否在预定义的 values 列表中
                  如果是，将其标记为 value 类型
                  示例：如果 RULE_VALUES 包含 true，那么 true 会被特殊高亮
                */
                '@values': 'value',
                /* 如果文本既不是关键字也不是预定义值，则标记为 identifier 类型 */
                '@default': 'identifier'
              }
            }
          ],

          // 空白字符处理
          { include: '@whitespace' },

          // 括号和运算符处理
          [/[{}()$$$$]/, '@brackets'], // 匹配基础括号 { } ( )，标记为 @brackets
          [/[<>](?!@symbols)/, '@brackets'], // 匹配 < >，如果不是符号的一部分则标记为 @brackets

          // 匹配所有符号，如果是 @operators 中的操作符则标记为 operator
          [
            /@symbols/,
            {
              cases: {
                '@operators': 'operator',
                '@default': ''
              }
            }
          ],

          // 数字处理
          [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'], // 匹配浮点数（包括科学计数法）
          [/\d+/, 'number'], // 匹配整数

          // 分隔符处理
          [/[;,.]/, 'delimiter'], // 匹配 ; , . 等分隔符，标记为 delimiter

          // 字符串处理
          [/"([^"\\]|\\.)*$/, 'string.invalid'], // 匹配未闭合的字符串，标记为 string.invalid
          [/'([^'\\]|\\.)*$/, 'string.invalid'], // 匹配未闭合的字符串，标记为 string.invalid
          [/"/, 'string', '@string_double'], // 匹配字符串开始引号，并进入相应字符串状态
          [/'/, 'string', '@string_single'] // 匹配字符串开始引号，并进入相应字符串状态
        ],

        // 定义"whitespace"状态（处理空白字符和注释）
        whitespace: [
          [/[ \t\r\n]+/, 'white'], // 空白字符（空格、制表符、换行），标记为 white
          [/\/\*/, 'comment', '@comment'], // /* 进入注释状态
          [/\/\/.*$/, 'comment'] // // 单行注释
        ],

        // 定义"comment"状态（处理多行注释）
        comment: [
          [/[^\/*]+/, 'comment'], // 规则1：匹配非注释符号的普通文本
          [/\/\*/, 'comment', '@push'], // 规则2：遇到"/*"时压栈（支持嵌套注释）
          ['\\*/', 'comment', '@pop'], // 规则3：遇到"*/"时出栈（结束当前注释块）
          [/[\/*]/, 'comment'] // 规则4：匹配单独的"/"或"*"（防止误判）
        ],

        // 定义字符串状态（处理双引号包围的文本）
        string_double: [
          [/[^\\"]+/, 'string'], // 规则1：匹配普通字符串内容
          [/@escapes/, 'string.escape'], // 规则2：匹配合法转义字符
          [/\\./, 'string.escape.invalid'], // 规则3：匹配非法转义序列
          [/"/, 'string', '@pop'] // 规则4：遇到闭合引号时退出
        ],

        // 定义字符串状态（处理单引号包围的文本）
        string_single: [
          [/[^\\']+/, 'string'], // 规则1：匹配普通内容
          [/@escapes/, 'string.escape'], // 规则2：合法转义
          [/\\./, 'string.escape.invalid'], // 规则3：非法转义
          [/'/, 'string', '@pop'] // 规则4：闭合引号
        ]
      }
    })

    // 定义主题 (defineTheme: 创建一个名为 ruleTheme 的新主题)
    monaco.editor.defineTheme('ruleTheme', {
      base: 'vs', // 基于 Monaco 内置的浅色主题 vs 进行扩展
      inherit: true, // 继承基础主题的所有未明确覆盖的样式
      // 每条规则控制特定语法元素的显示样式
      rules: [
        { token: 'keyword', foreground: '#ff7d00', fontStyle: 'bold' }, // 关键字高亮显示为橙色，加粗字体样式
        { token: 'value', foreground: '#795E26' }, // 预定义值高亮显示为棕色
        { token: 'operator', foreground: '#008000' }, // 操作符高亮显示为绿色
        { token: 'number', foreground: '#a441ff' }, // 数字高亮显示为紫色
        { token: 'string', foreground: '#d11616' }, // 字符串高亮显示为红色
        { token: 'comment', foreground: '#008000', fontStyle: 'italic' }, // 注释高亮显示为绿色，斜体字体样式
        { token: 'delimiter', foreground: '#2d75ce' } // 分隔符高亮显示为蓝色
      ],
      colors: {
        'editor.foreground': '#000000', // 文本默认颜色为黑色
        'editor.background': '#fafafa', // 编辑器背景颜色为浅灰色
        'editor.lineNumbers': '#858585', // 行号颜色为灰色
        'editor.selectionHighlightBackground': '#ADD6FF26', // 选中文本的高亮背景颜色为淡蓝色
        'editorGutter.background': '#eeeeee', // 编辑器行号栏背景颜色为浅灰色
        'editor.lineHighlightBackground': '#00000012', // 当前行高亮背景颜色为淡黑色
        'editor.wordHighlightBackground': '#ffc8ba' // 单词高亮背景颜色为淡粉色
      }
    })

    // 设置编辑器主题为 ruleTheme
    monaco.editor.setTheme('ruleTheme')

    // 验证 Sub 函数传参（确保错误标记能显示）
    const validateSubFunction = (model: monaco.editor.ITextModel) => {
      const markers: monaco.editor.IMarkerData[] = []
      const text = model.getValue()
      const subRegex = /\bSub\s*\([^)]*\)/g

      let match
      while ((match = subRegex.exec(text)) !== null) {
        const fullMatch = match[0]
        const startPos = model.getPositionAt(match.index)
        const endPos = model.getPositionAt(match.index + fullMatch.length)

        // 参数验证逻辑
        const fullMatch_ = fullMatch.slice(4).slice(0, fullMatch.length - 5)
        const params = fullMatch_?.split(',')?.filter(Boolean)

        // 检查参数是否正确
        if (params.length !== 1) {
          markers.push({
            severity: monaco.MarkerSeverity.Error,
            message: params.length === 0 ? 'Sub() 必须包含1个参数' : `Sub() 只允许1个参数，但找到 ${params.length}个`,
            startLineNumber: startPos.lineNumber,
            startColumn: startPos.column,
            endLineNumber: endPos.lineNumber,
            endColumn: endPos.column
          })
        }
      }

      // 关键点：确保正确设置错误标记
      monaco.editor.setModelMarkers(model, 'sub-validator', markers)
    }

    // 内容变化时验证
    editor.onDidChangeModelContent(() => {
      validateSubFunction(editor.getModel()!)
    })

    // 初始验证
    validateSubFunction(editor.getModel()!)

    // 注册补全提供器
    monaco.languages.registerCompletionItemProvider(RULE_LANGUAGE_ID, {
      // 补全项生成函数，根据当前编辑器位置提供补全建议 (model:  当前编辑器的文本模型, position: 当前光标位置(行号和列号))
      provideCompletionItems: (model, position) => {
        // 获取当前行的文本，从行首到光标位置
        const textUntilPosition = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        })

        // 获取当前正在输入的单词（最后一个单词）
        const currentWord = textUntilPosition.match(/(\w+)$/)
        const currentInput = currentWord ? currentWord[0] : ''

        // 定义函数补全项
        const functionSuggestions = [
          {
            label: 'Add (Function)',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'Add(${1:param1}, ${2:param2});', // 插入函数名和括号，光标定位在第一个参数位置
            documentation: {
              value: '**Add Function**\n\nAdds two values together\n\n`Add(value1, value2)`'
            },
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column - currentInput.length,
              endLineNumber: position.lineNumber,
              endColumn: position.column
            },
            filterText: 'Add'
          },
          {
            label: 'Sub (Function)',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'Sub(${1:});', // 插入函数名和括号，光标定位在括号内
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: {
              value: [
                '**Sub Function**',
                '### Parameter Rules:',
                '- ❗ Must have exactly **1** parameter',
                '- ❌ No commas allowed',
                '### Examples:',
                '- `Sub(value1)`  ✅ Valid',
                '- `Sub()`  ❌ Error: Missing parameter',
                '- `Sub(p1,p2)`  ❌ Error: Too many parameters',
                '- `Sub(p1,)`  ❌ Error: Trailing comma'
              ].join('\n\n')
            },
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column - currentInput.length,
              endLineNumber: position.lineNumber,
              endColumn: position.column
            },
            filterText: 'Sub'
          }
        ]

        // 生成所有可能的建议项
        const allSuggestions = [
          ...functionSuggestions,
          // 关键字补全
          ...RULE_KEYWORDS.map((keyword) => ({
            label: keyword, // 显示在补全列表中的文本
            kind: monaco.languages.CompletionItemKind.Keyword, // 指定为关键字类型(会影响图标显示)
            insertText: keyword, // 插入到编辑器中的文本
            documentation: `Rule keyword: ${keyword}`, // 悬停提示信息
            // 指定替换范围(这里是替换当前光标位置的文本)
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column - currentInput.length,
              endLineNumber: position.lineNumber,
              endColumn: position.column
            },
            // 添加 filterText 以便基于当前输入过滤
            filterText: keyword
          })),
          // 值补全
          ...RULE_VALUES.map((value) => ({
            label: value,
            kind: monaco.languages.CompletionItemKind.Value,
            insertText: value,
            documentation: `Possible value: ${value}`,
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column - currentInput.length,
              endLineNumber: position.lineNumber,
              endColumn: position.column
            },
            // 添加filterText以便基于当前输入过滤
            filterText: value
          })),
          // 代码片段补全
          {
            label: 'if-then',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'if ${1:condition} then ${2:value}',
            // 设置代码片段插入规则，以便在编辑器中正确解析和替换占位符
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'If-then condition block',
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column - currentInput.length,
              endLineNumber: position.lineNumber,
              endColumn: position.column
            },
            // 添加filterText以便基于当前输入过滤
            filterText: 'if-then'
          }
        ]

        // 根据当前输入过滤建议项
        const filteredSuggestions = allSuggestions.filter((suggestion) => {
          return suggestion.filterText.toLowerCase().startsWith(currentInput.toLowerCase())
        })

        return { suggestions: filteredSuggestions }
      },
      // 触发字符配置 (指定哪些字符输入后会自动触发补全建议 这里配置了空格和各种操作符作为触发点)
      triggerCharacters: [' ', '=', '>', '<', '!', '?']
    })

    // 注册悬停提供器 - 注册悬浮提示
    monaco.languages.registerHoverProvider(RULE_LANGUAGE_ID, {
      provideHover: (model, position) => {
        const word = model.getWordAtPosition(position) // 获取悬停位置所在的单词
        if (!word) return null

        const wordText = word.word

        // 如果单词是关键字，则显示悬停提示​​
        if (RULE_KEYWORDS.includes(wordText)) {
          return {
            contents: [{ value: `**${wordText}**` }, { value: `Keyword in rule language` }]
          }
        }

        // 如果单词是预定义值，则显示悬停提示​​
        if (RULE_VALUES.includes(wordText)) {
          return {
            contents: [{ value: `**${wordText}**` }, { value: `Predefined value in rule language` }]
          }
        }

        return null
      }
    })
  }

  const handleEditorWillMount = () => {}

  const onValueChange = (value) => {
    setCode(value)
  }

  return (
    <div className={styles.wrapper}>
      <Editor
        className='rule-lang'
        value={code} // 初始化编辑器内容
        onChange={onValueChange} // 编辑器内容变化时的回调
        beforeMount={handleEditorWillMount} // 编辑器挂载前的回调
        onMount={handleEditorDidMount} // 编辑器挂载后的回调
        language={RULE_LANGUAGE_ID} // 设置编辑器语言模式
        theme='vs-dark' // 设置编辑器主题​​
        height={600} // 设置编辑器高度
        width={700} // 设置编辑器宽度
        options={{
          lineNumbers: 'on', // 是否显示行号
          glyphMargin: true, // 是否显示字形边距​​
          folding: true, // 是否启用代码折叠​​
          lineDecorationsWidth: 12, // 设置行装饰宽度​​
          lineNumbersMinChars: 0, // 设置行号的最小字符数​​
          minimap: {
            enabled: true // 是否启用小地图​​ 相当于右侧于小屏幕预览
          },
          overviewRulerBorder: true, // 是否显示概述标尺边框​​（默认样式，通常为浅色分隔线）
          overviewRulerLanes: 2, // 控制标尺的“车道”数量（默认为 2）
          renderValidationDecorations: 'on', // 确保错误 / 警告标记仍显示
          renderLineHighlight: 'line', // 控制行突出显示的样式​​ 默认值是 line，可选值为 none、gutter、line 和 all​​
          padding: {
            top: 12, // 顶部填充​​
            bottom: 12 // 底部填充​​
          },
          readOnly: false, // 是否只读​​
          fontSize: 20, // 字体大小​​
          roundedSelection: true, // 是否启用圆角选择​​
          scrollBeyondLastLine: false, // 是否允许滚动到最后一行​​
          theme: 'ruleTheme' // 设置编辑器主题​​
        }}
      />
    </div>
  )
}

export default RuleEditorDemo
