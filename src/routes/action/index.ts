import { redirect } from 'react-router-dom'

export const actionHome = async ({ request }) => {
  const formData = await request.formData()
  const userName = formData.get('userName')
  const passWord = formData.get('passWord')

  if (!userName || !passWord) {
    window.toShow({
      title: !userName ? '账号必填!' : '密码必填!',
      type: 'warning',
      duration: 3
    })
    return {
      success: false,
      message: !userName ? '账号必填!' : '密码必填!',
      data: {}
    }
  }

  if (userName === 'admin' && passWord === '123456') {
    return {
      success: true,
      message: '登录成功',
      data: {
        userName,
        passWord
      }
    }
  }

  /* 重定向到主题页 */
  return redirect('/theme')
}
