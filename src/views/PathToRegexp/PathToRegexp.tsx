/*
  path-to-regexp 是一个强大的 URL 路径匹配库，能够将路径字符串转换为正则表达式，并提取参数。它被广泛用于 React Router、Express、Koa 等路由系统中
*/

import { pathToRegexp, parse, compile, match } from 'path-to-regexp'

function useMatchRoute(pathname, routePath) {
  const matcher = match(routePath, { decode: decodeURIComponent })
  return matcher(pathname)
}

const PathToRegexp: React.FC = () => {
  /* 1. 简单路径匹配 */
  const result01 = pathToRegexp('/foo/bar')
  // console.log(result01.test('/foo/bar')) // true
  // console.log(result01.test('/foo/baz')) // false
  /* 1. 简单路径匹配 */

  /* 2. 带命名参数 */
  const keys = []
  const result02 = pathToRegexp('/user/:id', keys)
  // console.log(result02.exec('/user/123'))
  // [
  //   '/user/123',
  //   '123',
  //   index: 0,
  //   input: '/user/123',
  //   groups: undefined
  // ]
  // console.log(keys)
  // [{ name: 'id', prefix: '/', suffix: '', pattern: '[^\\/#\\?]+?', modifier: '' }]
  /* 2. 带命名参数 */

  /* 3. 可选参数 */
  const result03 = pathToRegexp('/user/:id?')
  // console.log(result03.test('/user/123')) // true
  // console.log(result03.test('/user')) // true
  /* 3. 可选参数 */

  /* 4. 自定义匹配模式 */
  const result04 = pathToRegexp('/user/:id(\\d+)')
  // console.log(result04.test('/user/123456')) // true
  // console.log(result04.test('/user/abc')) // false
  /* 4. 自定义匹配模式 */

  /* 5. 星号匹配 */
  const result05 = pathToRegexp('/user/:path*')
  // console.log(result05.test('/user/123')) // true
  // console.log(result05.test('/user/123/info')) // true
  /* 5. 星号匹配 */

  /* 6. 多个参数 */
  const keys1 = []
  const result06 = pathToRegexp('/:locale/:user/:id', keys1)
  const match = result06.exec('/en/john/123')
  // console.log(match)
  // [
  //   '/en/john/123',
  //   'en',
  //   'john',
  //   '123',
  //   index: 0,
  //   input: '/en/john/123',
  //   groups: undefined
  // ]
  // console.log(keys1)
  // [
  //   { name: 'locale', ... },
  //   { name: 'user', ... },
  //   { name: 'id', ... }
  // ]
  /* 6. 多个参数 */

  /* 7. 前缀匹配 */
  const result07 = pathToRegexp('/admin/:path*')
  // console.log(result07.test('/admin')) // true
  // console.log(result07.test('/admin/users')) // true
  // console.log(result07.test('/admin/users/123')) // true
  /* 7. 前缀匹配 */

  /* 8. 严格模式 */
  const result08 = pathToRegexp('/user/:id', [], { strict: true })
  // console.log(result08.test('/user/123/')) // false

  const nonStrictRegexp = pathToRegexp('/user/:id')
  // console.log(nonStrictRegexp.test('/user/123/')) // true
  /* 8. 严格模式 */

  /* 9. 结束模式 */
  const result09 = pathToRegexp('/user/:id', [], {
    end: true // 表示正则表达式必须​​精确匹配到路径末尾
  })
  // console.log(result09.test('/user/123/profile')) // false

  const nonEndRegexp = pathToRegexp('/user/:id', [], { end: false })
  // console.log(nonEndRegexp.test('/user/123/profile')) // true
  /* 9. 结束模式 */

  /* 10. 解析路径 */
  const result10 = parse('/user/:id')
  // console.log(result10)
  // [
  //   { type: 'static', value: '/user' },
  //   { type: 'param', value: 'id', name: 'id', prefix: '/', suffix: '', pattern: '[^\\/#\\?]+?', modifier: '' }
  // ]
  /* 10. 解析路径 */

  /* 11. 编译路径 */
  const toPath = compile('/user/:id')
  // console.log(toPath({ id: 123 })) // '/user/123'
  /* 11. 编译路径 */

  /* 12. match */
  const result11 = useMatchRoute('/user/123', '/user/:id')
  console.log(result11)
  // {
  //   path: '/user/123',
  //   index: 0,
  //   params: { id: '123' }
  // }
  const noMatch = useMatchRoute('/user/123/profile', '/user/:id')
  console.log(noMatch) // false
  /* 12. match */

  return <div>PathToRegexp</div>
}

export default PathToRegexp
