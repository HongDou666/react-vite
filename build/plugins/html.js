/*
  自定义 Vite 插件
  用于在 Vite 项目构建（build 阶段）时对 HTML 文件（具体是 index.html）进行转换操作，也就是往 HTML 文件的 <head> 标签内插入一个包含构建时间信息的 <meta> 标签
*/
export function setupHtmlPlugin(buildTime) {
  let plugin = {
    apply: 'build',
    name: 'html-plugin',
    transformIndexHtml: function (html) {
      return html.replace('<head>', '<head>\n    <meta name="buildTime" content="'.concat(buildTime, '">'))
    }
  }
  return plugin
}
