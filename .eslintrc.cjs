/*
  参考文献1 : https://www.bmabk.com/index.php/post/223996.html
  参考文献2 : https://blog.csdn.net/Unknow_wen/article/details/135388048
*/

module.exports = {
  /* 基础配置: 定义代码的运行环境，决定如何解析全局变量 - 使 eslint 支持 node 与 ES6 */
  env: {
    browser: true, // 浏览器环境
    es2022: true, // 支持 ECMAScript 2022 语法
    node: true, // 支持 Node.js 环境
    commonjs: true // 支持 CommonJS 语法
  },
  extends: [
    'eslint:recommended', // 使用 eslint 推荐的语法规则
    'plugin:react/recommended', // 使用 react 推荐的语法规则
    'plugin:@typescript-eslint/recommended', // 使用 typescript 推荐的语法规则
    'plugin:react/jsx-runtime', // 开启 eslint-plugin-react 插件 ('React' must be in scope when using JSX)
    'plugin:react-hooks/recommended', // 开启 react-hooks 插件
    /* 开启 eslint-plugin-prettier 插件（使eslint可以使用prettier格式化代码的能力，与eslint冲突的规则则会以prettier进行代码格式化）*/
    'plugin:prettier/recommended',
    '@unocss' // UnoCSS 的 ESLint 配置 (pnpm add -D @unocss/eslint-config) https://unocss.nodejs.cn/integrations/eslint
  ],
  /*
    ESLint 解析器，它利用 TypeScript ESTree 允许 ESLint 对 TypeScript 源代码进行 lint 检查
  */
  parser: '@typescript-eslint/parser',
  // 解析器选项
  parserOptions: {
    // 开启实验属性
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      experimentalDecorators: true, // 开启修饰器
      jsx: true // 开启 jsx
    },
    ecmaVersion: 'latest', // 指定 ECMAScript 的版本
    jsxPragma: 'React', // 指定jsx的解析器
    sourceType: 'module' // 指定脚本的运行环境，script(默认)或者module（如果你的代码是 ECMAScript 模块)。
  },
  /* ignorePatterns数组包含了一组 glob 模式，当文件路径匹配其中任意一个时被忽略，作用类似.gitignore。一般都不希望对打包产物进行 lint 检查 */
  ignorePatterns: ['**/dist/**', '**/output/**'],
  /* 指定在 eslint中 额外使用的插件 */
  plugins: ['react', '@typescript-eslint', 'react-hooks', 'react-refresh', 'simple-import-sort'],
  /* 指定 eslint 规则的覆盖范围 */
  overrides: [
    {
      files: ['**/*.tsx'],
      /*
        react默认使用 prop-types 来检查类型, 如果使用了typescript，就把这个关掉, 不然会报一些没有意义的错误
        参考文献: https://blog.csdn.net/tuzi007a/article/details/129867139
      */
      rules: {
        'react/prop-types': 'off'
      }
    }
  ],
  /* 让eslint自己检测react版本 */
  settings: {
    react: {
      version: '18.3.1'
    }
  },
  /**
   * "off" 或 0 - 关闭规则
   * "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出),
   * "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
   */
  rules: {
    '@typescript-eslint/no-unused-vars': 'off', // 禁止定义未使用的变量
    '@typescript-eslint/no-inferrable-types': 'off', // 可以轻松推断的显式类型可能会增加不必要的冗长
    '@typescript-eslint/no-namespace': 'off', // 禁止使用自定义 TypeScript 模块和命名空间
    '@typescript-eslint/no-explicit-any': 'off', // 禁止使用 any 类型
    '@typescript-eslint/ban-ts-ignore': 'off', // 禁止使用 @ts-ignore
    '@typescript-eslint/ban-types': 'off', // 禁止使用特定类型
    '@typescript-eslint/explicit-function-return-type': 'off', // 不允许对初始化为数字、字符串或布尔值的变量或参数进行显式类型声明
    '@typescript-eslint/no-var-requires': 'off', // 不允许在 import 语句中使用 require 语句
    '@typescript-eslint/no-empty-function': 'off', // 禁止空函数
    '@typescript-eslint/no-use-before-define': 'off', // 禁止在变量定义之前使用它们
    '@typescript-eslint/ban-ts-comment': 'off', // 禁止 @ts-<directive> 使用注释或要求在指令后进行描述
    '@typescript-eslint/no-non-null-assertion': 'off', // 允许使用后缀运算符的非空断言(!)
    '@typescript-eslint/explicit-module-boundary-types': 'off', // 要求导出函数和类的公共类方法的显式返回和参数类型
    'no-cond-assign': 2, // 禁止条件表达式中出现赋值操作符
    'no-console': [
      // 禁止使用 console
      'error',
      {
        allow: ['warn', 'error', 'info', 'log', 'timeEnd', 'time']
      }
    ],
    /** import导入顺序规则*/
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // react放在首行
          ['^react', '^@?\\w'],
          // 内部导入
          ['^(@|components)(/.*|$)'],
          // 父级导入. 把 `..` 放在最后.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // 同级导入. 把同一个文件夹.放在最后
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          // 样式导入.
          ['^.+\\.?(css)$'],
          // 带有副作用导入，比如import 'a.css'这种.
          ['^\\u0000']
        ]
      }
    ],

    // 代码缩进格式的校验 (一个缩进为2个空格。)
    indent: [
      'error',
      2, // 一个缩进为2个空格。
      {
        SwitchCase: 1 // switch语句中的case也缩进一格
      }
    ],
    // 这条配置告诉 ESLint 在 TypeScript 项目中关闭对别名 this 的检查，因为有时候会在 Vue.js 的选项中使用 this，但是 TypeScript 不一定能够正确地捕捉到它的类型。
    '@typescript-eslint/no-this-alias': 'off',
    // 这条配置告诉 ESLint 关闭对代码中 debugger 语句的检查，debugger 语句用于在代码中设置断点以便调试。
    'eslintno-debugger': 'off',
    semi: 'off', // 使用分号不报错
    'space-before-function-paren': 0, // 函数名与括号之间没有空格不报错
    quotes: 0, // 使用单引号不报错
    'no-alert': 0, // 使用alert语句不报错
    'no-var': 2, // 使用var报错，用let和const代替,
    'comma-dangle': [0, 'never'], // 使用对象字面量逗号项尾不报错
    'no-spaced-func': 0, // 此规则允许函数标识符与其应用程序之间存在间距。
    'key-spacing': [0, { beforeColon: false, afterColon: true }], //对象字面量中冒号的前后空格
    'arrow-parens': 'off', // 箭头函数使用不用小括号括起来不会报错
    'arrow-spacing': 2, // 要求箭头函数的箭头之前或之后有空格
    'no-unused-vars': 0, // 去掉定义变量未使用报错方法
    'no-undef': 0, //可以有未定义的变量
    'no-empty': 0, // 块语句中的内容可以为空
    // 避免 `eslint` 对于 `typescript` 函数重载的误报
    'no-redeclare': 'off',
    // 在JSX中禁止未声明的变量
    'react/jsx-no-undef': 0,
    // 允许在 case 子句中使用词法声明
    'no-case-declarations': 0,
    // 高阶组件返回的组件不需要 displayName
    'react/display-name': 0,
    // 允许使用异步函数作为 Promise 执行器
    'no-async-promise-executor': 0,
    'no-irregular-whitespace': 'off', // 关闭 不允许不规则的空格
    'no-useless-escape': 'off' // 关闭 禁止不必要的转义字符
  }
}
