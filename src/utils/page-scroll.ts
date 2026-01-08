/* 停止页面滚动 */
export const stopMove = () => {
  const m1 = function (e) {
    e.preventDefault()
  }
  document.body.style.overflow = 'hidden'
  /* 禁止页面滑动 */
  document.addEventListener('touchmove', m1, {
    /*
      此处要手动设置 passive: false
      抖音链接: https://www.douyin.com/user/self?aweme_id=7373605411531934991&enter_from=recommend&enter_method=personal_panel&from_tab_name=main&is_personal_panel_video=1&showTab=record
     */
    passive: false
  })
}

/* 开启页面滚动 */
export const startMove = () => {
  const m2 = function (e) {
    e.preventDefault()
  }
  /* 出现滚动条 */
  document.body.style.overflow = ''
  // 取消禁止页面滑动
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  document.removeEventListener('touchmove', m2, { passive: true })
}
