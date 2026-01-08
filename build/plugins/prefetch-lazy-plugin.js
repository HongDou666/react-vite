let preloadPaths = [
  /^_chunk-views-ModuleCss.*/,
  /^_chunk-views-Portal.*/,
  /^_chunk-views-PubSub.*/,
  /^_chunk-views-ReduxDemo.*/
]
let prefetchUrls = []
export function setupPrefetchLazyPlugin(path, fs) {
  /* 获取manifest.json的路径 */
  let manifestPath = path.resolve('', 'dist/.vite/manifest.json')
  /* 判断manifest.json是否存在 */
  if (fs.existsSync(manifestPath)) {
    /* 读取manifest.json文件内容 */
    let manifest_1 = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
    preloadPaths.forEach(function (item) {
      let result = Object.keys(manifest_1).filter(function (key) {
        return item.test(key)
      })
      let itemPath = manifest_1[result[0]].file
      if (itemPath) {
        prefetchUrls.push('./' + itemPath)
      }
    })
  }
  return {
    name: 'vite-plugin-prefetch-lazy',
    transformIndexHtml: function (html) {
      if (!prefetchUrls.length) return
      let html_ = html
      let prefetchstr = ''
      prefetchUrls.forEach(function (item) {
        /* 移除 原有的 link 标签 防止重复加载 */
        html_ = html_.replace('<link rel="modulepreload" crossorigin href="'.concat(item, '">'), '')
        prefetchstr += '<link rel="prefetch" crossorigin href="'.concat(item, '" as="script">')
      })
      return html_.replace('</head>', prefetchstr + '</head>')
    }
  }
}
