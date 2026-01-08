import { useMemo } from 'react'
import { KeepAlive } from 'react-activation'
import { useLocation } from 'react-router-dom'

import { withLazyLoad } from '@/components/WithLazyLoad'

interface PropsType {
  component: React.LazyExoticComponent<React.FC> // 要缓存的组件 (必须是懒加载组件)
  cacheId: string | ((location: any) => string)
  cacheKey?: string | ((location: any) => string)
  options?: {
    autoScroll?: true | false | 'screen'
    autoFreeze?: boolean
    when?: () => boolean
  }
  props?: Record<string, any>
}

/**
 * AuthKeepAlive 组件封装
 * 它不是传统 HOC，但它是一个非常典型、非常高质量的 “高级组件（Wrapper Component/HOC-like）”，用于为任意页面注入缓存增强行为
 * @param {React.LazyExoticComponent} Component - 懒加载组件
 * @param {string|function} cacheId - 缓存ID（支持动态生成）
 * @param {object} [options] - 配置选项
 * @param {boolean} [options.autoScroll=true] - true: 保存​​整个容器​​的滚动位置; false: 不保存滚动位置; screen 保存屏幕滚动位置
 * @param {boolean} [options.autoFreeze=true] - 是否自动冻结(被缓存的组件在离开屏幕时会进入"冻结"状态 当组件再次进入屏幕时会自动恢复之前的状态)
 * @param {function} [options.when] - 自定义缓存条件(返回true时缓存组件 否则不缓存)
 * @param {object} [props] - 组件属性
 */
const AuthKeepAlive = ({ component: Component, cacheId, cacheKey, options = {}, props = {} }: PropsType) => {
  const location = useLocation()

  // 动态生成 resolvedCacheId (切换路由就会触发重新计算 resolvedCacheId )
  const resolvedCacheId = useMemo(() => {
    return typeof cacheId === 'function' ? cacheId(location) : cacheId
  }, [location])

  // 动态生成 cacheKeyId (切换路由就会触发重新计算 cacheKeyId )
  const cacheKeyId = useMemo(() => {
    return typeof cacheKey === 'function' ? cacheKey(location) : cacheKey
  }, [location])

  // 合并默认配置
  const { autoScroll = true, autoFreeze = true, when = () => true, ...keepAliveProps } = options

  const LazyLoadComponent = withLazyLoad(Component)

  return (
    <KeepAlive
      id={resolvedCacheId}
      name={resolvedCacheId}
      saveScrollPosition={autoScroll}
      autoFreeze={autoFreeze}
      when={when}
      cacheKey={cacheKeyId || resolvedCacheId}
      {...keepAliveProps}>
      {/* 高级组件 */}
      <LazyLoadComponent {...props} />
    </KeepAlive>
  )
}

export default AuthKeepAlive
