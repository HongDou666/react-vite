import { useSyncExternalStore } from 'react'

const popStateEvent = new PopStateEvent('popstate')

/* 用 history api 实现 跳转 监听 url 变化 */
export const useHistory = () => {
  const subscribe = (callback: () => void) => {
    /*
      订阅浏览器api 监听history变化
      Vue 三种路由结构
       服务端渲染: ssr
       浏览器: hash(底层 监听hashchange事件) history( 底层 监听popstate事件)
    */

    window.addEventListener('popstate', callback)
    window.addEventListener('hashchange', callback)
    return () => {
      // 取消订阅
      window.removeEventListener('hashchange', callback)
      window.removeEventListener('popstate', callback)
    }

    /*
      window.onpopstate 事件是在浏览器历史记录发生改变时触发的，不过这里的改变特指的是通过浏览器的前进、后退按钮操作或者调用 history.back()、history.forward()、history.go() 等方法来改变历史记录的情况

      由于 pushState() 和 replaceState() 只是用来主动更新历史记录的状态或者添加新状态，并非通过浏览器自身的历史记录导航操作来改变 URL 的，因此它们不会触发 window.onpopstate 事件 (需要手动出触发事件 进而实现更新视图)
    */
  }

  const getSnapshot = () => window.location.href

  const url = useSyncExternalStore(subscribe, getSnapshot)

  const push = (url: string) => {
    /* pushState 添加新的历史记录，但不触发 popstate 事件，需要手动触发 */
    window.history.pushState({}, '', url)
    window.dispatchEvent(popStateEvent)
  }

  const replace = (url: string) => {
    /* replaceState 替换当前的历史记录，但不触发 popstate 事件，需要手动触发 */
    window.history.replaceState({}, '', url)
    window.dispatchEvent(popStateEvent)
  }

  return [url, push, replace] as const // Ts元组类型
}
