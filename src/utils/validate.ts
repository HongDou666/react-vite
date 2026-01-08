/**
 * @description 封装正则表达式
 * 实现: 密码校验（8个字符以上 & 必须包含数字 & 大写字母 & 小写字母 & 特殊字符@$!%*?&）
 * 抖音链接: https://www.douyin.com/user/self?from_tab_name=main&modal_id=7417438595746630947&showTab=record
 */
export const regularPassword = (function () {
  const regex = /^(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*\d+)(?=.*[@_.,$!%*?&#]+)[A-Za-z\d@_.,$!%*?&#]{8,}$/

  return function (password) {
    return regex.test(password)
  }
})()
