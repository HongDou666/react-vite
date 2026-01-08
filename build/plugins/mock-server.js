import mockjs from 'mockjs'
import url from 'node:url'
/*
  自定义 Vite 插件
  数据模拟 mock
*/
export function setupMockServerPlugin() {
  let plugin = {
    name: 'vite-plugin-mock',
    /* 插件对象还包含一个configureServer方法，它接收一个server参数（代表Vite的开发服务器实例）用于配置服务器的中间件 */
    configureServer: function (server) {
      /* 通过server.middlewares.use方法添加了一个中间件，该中间件监听/api/mock/list路径的请求。当收到该路径的请求时，会执行提供的回调函数，该回调函数接收请求对象req和响应对象res作为参数 */
      server.middlewares.use('/api/mock/list', function (req, res) {
        /*
                  使用url.parse方法解析请求的原始URL，并获取查询参数
                  http://localhost:6012/api/mock/list?key=zqc&name=xxx
                  返回结果：{key: 'zqc', name: 'xxx'}
                 */
        let parseurl = url.parse(req.originalUrl, true).query
        /* 设置响应的Content-Type为application/json，表明返回的数据是JSON格式 */
        res.setHeader('Content-Type', 'application/json')
        /* 使用mockjs生成模拟数据，并通过res.end方法将JSON格式的字符串作为响应体返回 */
        let data = mockjs.mock({
          code: 200,
          msg: '请求成功',
          data: {
            'list|2000': [
              {
                id: '@guid',
                name: '@cname',
                title: parseurl.key,
                age: '@integer(18, 30)',
                address: '@county(true)' // 随机生成一个真实的县名作为地址
              }
            ]
          }
        })
        res.end(JSON.stringify(data)) // 将模拟数据转换为JSON字符串并返回
      })
    }
  }
  return plugin
}
