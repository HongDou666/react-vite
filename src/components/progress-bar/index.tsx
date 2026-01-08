import NProgress from 'nprogress'

import 'nprogress/nprogress.css'

/* 配置 NProgress */
NProgress.configure({
  // 动画方式
  easing: 'ease',
  // 递增进度条的速度
  speed: 500,
  // 是否显示加载ico
  showSpinner: false,
  // 自动递增间隔
  trickleSpeed: 200,
  // 初始化时的最小百分比
  minimum: 0.3
})

export default function ProgressBar() {
  useEffect(() => {
    let lastHref = window.location.href

    /* 开启 / 关闭 进度条动画 */
    const handleRouteChange = () => {
      NProgress.start()
      const timer = setTimeout(() => {
        clearTimeout(timer)
        NProgress.done()
      }, 100)
      return () => {
        clearTimeout(timer)
        NProgress.done()
      }
    }

    /* 监听 href 变化: 创建一个 MutationObserver 实例，并传入回调函数 */
    const observer = new MutationObserver(() => {
      const currentHref = window.location.href
      /* 只有当路径发生改变时触发 */
      if (currentHref !== lastHref) {
        /* 更新 lastHref 以便下一次比较 */
        lastHref = currentHref
        handleRouteChange()
      }
    })

    /* 观察整个文档的变化 */
    observer.observe(document, {
      subtree: true, // 当设置为 true 时，监视目标节点及其所有后代节点的变化（默认为 false）
      childList: true // 当目标节点的子节点被添加或删除时触发回调（默认为 false）
    })

    /* 监听 popstate 事件（处理浏览器前进后退）*/
    window.addEventListener('popstate', handleRouteChange)

    /* 初始加载时触发一次 */
    handleRouteChange()

    /* 清理监听器 */
    return () => {
      observer.disconnect()
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  return null
}
