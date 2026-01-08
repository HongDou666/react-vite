# Hello 晚风

# React18 - Vite5 - Ts

## 1. VsCode 插件

- One Dark Pro 主题颜色插件
- Material Icon Theme 设置文件图标主题 Icon
- Import Cost 导入依赖包显示包的大小
- Live Server 启动一个具有静态和动态页面实时重新加载功能的开发本地服务器
- ES7+ React/Redux/React-Native snippets React 语法提示工具插件
- Simple React Snippets 快速生成常用的 React 代码片段
- Baidu Comate 代码智能提示

## 2. Git 配置

- git config core.ignorecase false 可以跟踪到文件名的大小更改

## 3. Ts 配置

- setting.json 添加 "typescript.validate.enable": true 开启 ts 验证
- ctrl + shift + P => Volar: Select Typescript Version 使用工作区版本
- ctrl + shift + P => Extenstions: Show built-in Ectensions 搜索 typescript 禁用工作区（禁用内置的 js/ts 功能）
- ctrl + shift + P => Restart Extension Host 重启插件，重启扩展宿主（使用自动引入包的方式 直接使用包的方法 可能会有代码
  校验提示 xxx is undefined）

## 4. 项目依赖包注释

- @types/node ts 语言支持 node
- @types/nprogress 进度条 ts 类型

## 5. package.json

- scripts => "dev": "vite --mode development" （项目运行加载.env.development 文件中的相关变量）
- scripts => "build:pro": "vue-tsc && vite build --mode production" （项目打包加载.env.production 文件中的相关变量）
- scripts => "eslint --cache --max-warnings 0 {src,mock}/\*_/_.{vue,ts,tsx} --fix" （--cache 为仅检测改动过的代码,
  --max-warnings 0 表示出现超过 0 个警告强制 eslint 以错误状态退出）
- scripts => "lint:prettier": "prettier --write \*_/_.{ts,js,json,tsx,css,less,scss,vue,html,md}" 便于我们使用 prettier
  进行修复代码风格
- scripts => "prepare": "husky install" （运行后会初始化 husky，运行之后就会出现.husky 文件夹，之后我们就可以配置在
  GItHook 中执行的操作啦 😀。）
- scripts => "lint:lint-staged": "lint-staged" 执行命令 npx husky add .husky/pre-commit "npm run lint:lint-staged"（使用
  husky 配置一个 pre-commit 钩子，使得在提交代码之前先运行 npm run lint:lint-staged 命令）

## 6. 代码保存自动格式化

- ctrl + shift + P => Open Workspace Settings (JSON) （将在根目录生成 settings.json 文件）, 添加
  "editor.codeActionsOnSave": {}
- 代码保存时自动格式化： "source.fixAll": true
- 代码保存时执行 ESLint 修复： "source.fixAll.eslint": "explicit"

## 7. React 框架项目

- [大伟 基于 React18 Vite5 TypeScript Eslint Prettier Husky Lint-staged Commitlint 实现的项目模板](https://gitee.com/sohucw/react18--vite5---ts)

- [Ant Design Pro 基于 React18 Umi Dva Antd5 TypeScript 实现的中台前端管理系统](https://gitee.com/ant-design/ant-design-pro)

- [React mu admin 基于 React18 TypeScript Vite4 Antd4.x 实现的中后台管理系统](https://gitee.com/starplatinum111/react-mu-admin)

- [React Soybean Admin 基于 React18 React-Router-v6 Vite5 TypeScript Redux/Toolkit UnoCSS 等技术构建的后台管理模板](https://github.com/soybeanjs/soybean-admin-react/tree/v18-router6)

- [xt-admin-react18 基于 React18 Typescript Vite Zustand Antd Unocss 等技术构建的中后台管理框架](https://gitee.com/nideweixiaonuannuande/xt-admin-react18)

## 8. 程序员备忘清单

- [为开发人员分享快速参考备忘清单【速查表】](https://quickref.cn/)

## 9. GitHub 开源项目集合

- [GitHub 开源项目中文排行榜](https://gitee.com/GrowingGit/GitHub-Chinese-Top-Charts#/GrowingGit/GitHub-Chinese-Top-Charts/blob/master/content/charts/overall/software/Vue.md)
- [Vue 后台管理系统模板](http://vue.easydo.work/)

## 10. 大屏可视化项目 Demo

- [echarts](https://echarts.apache.org/examples/zh/index.html)
- [makeapie](https://www.makeapie.cn/echarts)
- [isqqw](https://www.isqqw.com/)
- [ppchart](https://ppchart.com/#/)
- [madeapie-停服](https://madeapie.com/#/examples)
- [MCChart](https://echarts.zhangmuchen.top/#/index)
- [ChartLib](http://chartlib.yingxidata.cn/echarts)
- [分享你我–echarts 作品集](http://chart.majh.top/)

## 11. React18/19 进阶实战资料 前端资深干货进阶

- [大伟 语雀 React18/19 进阶实战资料](https://www.yuque.com/sohucw/sn1c1q)
- [大伟 语雀 2024-2025 前端资深干货进阶](https://www.yuque.com/sohucw/daweiurl)

## 12. unocss VsCode 插件 & 依赖包

- Icônes : 搜索 iconify 图标的插件
- Iconify IntelliSense : Iconify 图标实时显示的插件
- UnoCSS : unocss 写法提示插件

- @iconify/json: "2.2.266",
- @iconify/types: "2.0.0",
- @iconify/utils: "^2.2.1",
- @unocss/preset-icons: "^65.4.2",
- @unocss/preset-uno: "^65.4.2",
- @unocss/vite: "^65.4.2",
- unocss: "^65.4.2",
