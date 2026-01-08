module.exports = {
  /* 可选类型，和上面commitlint.config.js配置的规则一一对应 */
  types: [
    { value: 'feat', name: '特性: 一个新的特性' },
    { value: 'fix', name: '修复: 修复一个Bug' },
    { value: 'docs', name: '文档: 变更的只有文档' },
    { value: 'style', name: '格式: 空格, 分号等格式修复' },
    { value: 'refactor', name: '重构: 代码重构，注意和特性、修复区分开' },
    { value: 'perf', name: '性能: 提升性能' },
    { value: 'test', name: '测试: 添加一个测试' },
    { value: 'revert', name: '回滚: 代码回退' },
    { value: 'chore', name: '工具:开发工具变动(构建、脚手架工具等)' },
    { value: 'merge', name: '合并:合并代码' },
    { value: 'build', name: '打包: 打包发布' },
    { value: 'ci', name: '集成: 持续集成' },
    { value: 'release', name: '发布: 发布新版本' },
    { value: 'other', name: '其他: 其他改动，比如构建流程, 依赖管理' }
  ],
  /* 消息步骤，正常只需要选择 */
  messages: {
    type: '选择一种你的提交类型:',
    customScope: '请输入修改范围(可选):',
    subject: '请简要描述提交(必填):',
    body: '长说明 请输入详细描述,使用"|"换行(可选):',
    footer: '请输入要关闭的issue 例如: #31, #34(可选):',
    confirmCommit: '确认使用以上信息提交？(y/n)'
  },
  /* 跳过问题：修改范围，自定义修改范围，详细描述，issue相关 */
  skipQuestions: ['scope', 'customScope', 'body', 'footer'],
  /* 是否允许自定义修改范围 */
  allowCustomScopes: true,
  /* 允许提交的break change类型 */
  allowBreakingChanges: ['特性', '修复'],
  /* subject描述文字长度最长是100 */
  subjectLimit: 100
}
