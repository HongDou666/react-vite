import { lazy, Suspense } from 'react'

import SuspenseLoading from '@/components/SuspenseLoading'

/* 封装: 自定义 hooks 懒加载组件 动态路由懒加载封装 */
export const LazyLoad = ({ fullPath, ...restProps }) => {
  const Component = useMemo(() => lazy(() => import(/* @vite-ignore */ `${fullPath}`)), [fullPath])

  return (
    <Suspense fallback={<SuspenseLoading />}>
      <Component {...restProps} />
    </Suspense>
  )
}

/**
 * 高阶组件
 * @description 高阶组件，用于加载组件时显示加载动画
 * @param Component 要加载的组件
 * @returns 新组件
 */
export const withLazyLoad = (Component) => {
  return function LazyLoadWrapper(props) {
    return (
      <Suspense fallback={<SuspenseLoading />}>
        <Component {...props} />
      </Suspense>
    )
  }
}

export default LazyLoad
