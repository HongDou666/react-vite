const preloadPaths = [
  /^_chunk-views-ModuleCss.*/,
  /^_chunk-views-Portal.*/,
  /^_chunk-views-PubSub.*/,
  /^_chunk-views-ReduxDemo.*/
]
const prefetchUrls: string[] = []

export function setupPrefetchLazyPlugin(path, fs) {
  /* 获取manifest.json的路径 */
  const manifestPath = path.resolve('', 'dist/.vite/manifest.json')
  /* 判断manifest.json是否存在 */
  if (fs.existsSync(manifestPath)) {
    /* 读取manifest.json文件内容 */
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
    preloadPaths.forEach((item) => {
      const result = Object.keys(manifest).filter((key) => item.test(key))
      const itemPath = manifest[result[0]].file
      if (itemPath) {
        prefetchUrls.push('./' + itemPath)
      }
    })
  }

  return {
    name: 'vite-plugin-prefetch-lazy',
    transformIndexHtml(html: string) {
      if (!prefetchUrls.length) return
      let html_ = html
      let prefetchstr = ''
      prefetchUrls.forEach((item) => {
        /* 移除 原有的 link 标签 防止重复加载 */
        html_ = html_.replace(`<link rel="modulepreload" crossorigin href="${item}">`, '')
        prefetchstr += `<link rel="prefetch" crossorigin href="${item}" as="script">`
      })
      return html_.replace('</head>', prefetchstr + '</head>')
    }
  }
}
