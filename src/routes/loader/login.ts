import { replace } from 'react-router-dom'

import { useAuthorization } from '@/utils'
import { STORAGE_AUTHORIZE_KEY } from '@/utils/authorization'

export default () => {
  const [getToken] = useAuthorization(STORAGE_AUTHORIZE_KEY)

  /*
    清空 token 也可以放在点击退出登录时调用 => removeToken() 清空 token
    这里可以执行这样的代码 就是判断当前有无 有效的token
    如果有 token 就无需跳转到登录页面了 重定向到首页 ’/‘
  */

  const token = getToken()
  if (token) return replace('/')

  const title = '登录页'
  document.title = title

  return {
    title
  }
}
