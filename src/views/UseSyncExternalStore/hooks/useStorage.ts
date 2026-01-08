/*
  用法:
  const res = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)

  ● subscribe：用来订阅数据源的变化，接收一个回调函数，在数据源更新时调用该回调函数。
  ● getSnapshot：获取当前数据源的快照（当前状态）。
  ● getServerSnapshot?：在服务器端渲染时用来获取数据源的快照。
*/

import { useSyncExternalStore } from 'react'

let isSubscribed = false // 初始化为未订阅状态
const storageEvent = new StorageEvent('storage') // 创建一个模拟的 storage 事件对象，以便手动触发

/**
 * @param key 存储到 localStorage 的 key
 * @param defaultValue 默认值
 */
export const useStorage = <K, T>(key: K, defaultValue: T) => {
  /* subscribe 函数是用来订阅外部数据源变化的 */
  const subscribe = (callback: () => void) => {
    // 如果没有订阅 则添加事件监听器 并标记为已订阅 (防止重复订阅)
    if (!isSubscribed) {
      /*
      监听 window 对象上的 storage 事件 (以便在数据源更新时调用回调函数)
        触发时机: 当同一域名下的其他页面修改了 localStorage 或者 sessionStorage 中的数据时 当前页面就会触发 storage 事件
        例如在一个标签页中执行了 localStorage.setItem('key', 'newValue') 改变了已存在键值对的值或者新增了一个键值对 那么同一网站的其他打开的标签页中监听了 storage 事件的代码对应的回调函数就会被调用
      */
      window.addEventListener('storage', () => {
        callback()
      })
      isSubscribed = true // 标记为已订阅，防止重复触发事件
    }
    return () => {
      /*
        取消订阅函数
        当外部数据源发生改变 并且 React 开始执行更新流程去重新渲染使用了 useSyncExternalStore 的组件时
        React 也会先调用 subscribe 返回的取消订阅函数，然后再重新调用 subscribe 函数去重新建立订阅关系，以便后续能继续准确监听数据源的后续变化
      */
      // 取消订阅 这里注释掉 因为window.addEventListener('storage',()=>{}) 监听的函数不是callback
      // window.removeEventListener('storage', callback)
    }
  }

  /* 从 localStorage 中获取数据 如果读不到返回默认值 */
  const getSnapshot = () => {
    return (localStorage.getItem(`${key}`) ? JSON.parse(localStorage.getItem(`${key}`)!) : null) || defaultValue
  }

  /* 修改数据 */
  const setStorage = (value) => {
    /* 当前这行代码在同一标签页内 window.addEventListener('storage',() => {}) 监听不到 */
    localStorage.setItem(`${key}`, JSON.stringify(value))

    /* 
      手动触发 storage 事件 以便订阅者能够接收到更新 (只有这样才可以触发callback执行 页面才会更新)
      在同一标签页内执行 localStorage.setItem 不会触发storage事件 这是浏览器的设计机制 主要是为了避免在单个标签页内部进行存储操作时产生不必要的事件循环和性能开销
    */
    window.dispatchEvent(storageEvent)
  }

  /* 返回数据 */
  const data = useSyncExternalStore(subscribe, getSnapshot)

  return [data, setStorage]
}
