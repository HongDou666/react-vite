import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

import AutoKeepAlive from '@/components/AutoKeepAlive'
import Redirect from '@/components/Redirect'
import WithAuth, { AuthCompontent } from '@/components/WithAuth'
import { LazyLoad, withLazyLoad } from '@/components/WithLazyLoad'
import AppLayout from '@/layout/index'
import Error404 from '@/page/Error404/Error404'
import { useAuthorization } from '@/utils'

import type { SyncRoute } from './interface/index'
import dynamicRoute from './route/dynamic-route'
import staticRoute from './route/static-route'
import { loaderPageHomeB } from './loader'
import powerLoader from './power-loader'

const KeepAliveDemo1 = lazy(() => import('@/views/KeepAliveDemo1/KeepAliveDemo1'))
const KeepAliveDemo2 = lazy(() => import('@/views/KeepAliveDemo2/KeepAliveDemo2'))
const KeepAliveDemo3 = lazy(() => import('@/views/KeepAliveDemo3/KeepAliveDemo3'))

const PageHomeB = lazy(() => import('@/views/Dashboard/PageHome/PageHomeB'))
const LazyLoadComponent = withLazyLoad(PageHomeB) // 高级组件: 懒加载
const AuthPageHomeB = WithAuth(LazyLoadComponent) // 高级组件: token 验证
// const AuthPageHomeB = WithAuth(withLazyLoad(PageHomeB)) // 高级组件: token 验证

const [getToken] = (() => useAuthorization())()
const token = getToken()

const getRouteTable = (): SyncRoute.RoutersProps[] => {
  return [
    ...staticRoute,
    {
      path: '/',
      id: 'layout',
      unLazy: true, // 非懒加载路由组件
      loader: powerLoader, // 设置路由访问权限
      /*
        此处使用loader 且函数里面有异步方法待用 会有警告 No `HydrateFallback` element provided to render during initial hydration 为了防止此警告 可添加 HydrateFallback: () => null 避免
        参考文献: https://baimingxuan.github.io/react-router6-doc/route/hydrate-fallback-element
       */
      HydrateFallback: () => null,
      element: <AppLayout></AppLayout>,
      /*
        errorElement: 作用是当前路径下的子路径没有对应的页面显示时就显示 Error404 页面; 相当于 输入 http://localhost:6012/ho 或者 http://localhost:6012/home/333 不完整路径时, 就显示 Error404 页面, 但是路径不会跳转到 /error/404 除非在下面添加重定向(path: '*')
      */
      errorElement: <Error404 />,
      children: [
        /*
          匹配 / 时;就会自动加载 Home 组件;但路径依然是 http://localhost:6012/
          {
            index: true,
            id: 'home',
            loader: () => ({ title: '首页' }),
            element: lazy(() => import('@/views/Home'))
          },
        */
        {
          index: true, // 重定向路由
          isLink: true, // 是否为重定向
          element: <Redirect to='/home' replace={false} />
        },
        ...dynamicRoute,
        {
          path: '/keep-alive-demo1',
          id: 'KeepAliveDemo1',
          loader: () => ({ title: 'KeepAliveDemo1: 组件缓存示例1' }),
          meta: {
            keepAlive: true // 开启组件缓存
          },
          element: (
            <AutoKeepAlive
              component={KeepAliveDemo1}
              cacheId='demo1'
              options={{ when: () => true }}
              props={{ data: 'AutoKeepAlive' }}
            />
          )
        },
        {
          path: '/keep-alive-demo2/:id',
          id: 'KeepAliveDemo2',
          loader: () => ({ title: 'KeepAliveDemo2: 组件缓存示例1' }),
          meta: {
            keepAlive: true // 开启组件缓存
          },
          element: (
            <AutoKeepAlive
              component={KeepAliveDemo2}
              cacheId={(location) => {
                const id = location.pathname.split('/').pop()
                return `demo2-${id}`
              }}
              options={{
                when: () => true,
                autoScroll: false // 动态路由这里不保存滚动位置
              }}
              props={{}}
            />
          )
        },
        {
          path: '/keep-alive-demo3/:id',
          id: 'KeepAliveDemo3',
          loader: () => ({ title: 'KeepAliveDemo3: 组件缓存示例3' }),
          meta: {
            keepAlive: true // 开启组件缓存
          },
          element: (
            <AutoKeepAlive
              component={KeepAliveDemo3}
              cacheId='demo3'
              cacheKey={(location) => {
                const id = location.pathname.split('/').pop()
                return `demo3-${id}`
              }}
              options={{ when: () => true }}
              props={{}}
            />
          )
        },
        {
          path: '/dashboard',
          id: 'dashboard',
          loader: () => ({ title: 'React - 路由嵌套管理' }),
          element: lazy(() => import('@/views/Dashboard')),
          children: [
            {
              path: '', // 重定向路由
              isLink: true, // 是否为重定向
              element: <Redirect to='/dashboard/pageHome' replace={false} />
            },
            {
              path: '/dashboard/pageHome',
              id: 'pageHome',
              loader: () => ({ title: '首屏' }),
              element: lazy(() => import('@/views/Dashboard/PageHome')),
              children: [
                {
                  path: '', // 重定向路由
                  isLink: true, // 是否为重定向
                  element: <Redirect to='/dashboard/pageHome/pageHomeA' replace={false} />
                },
                {
                  path: '/dashboard/pageHome/pageHomeA',
                  id: 'pageHomeA',
                  loader: () => ({ title: '首屏-pageHomeA' }),
                  element: lazy(() => import('@/views/Dashboard/PageHome/PageHomeA')),
                  children: [
                    {
                      path: '', // 重定向路由
                      isLink: true, // 是否为重定向
                      element: <Navigate to='/dashboard/pageHome/pageHomeA/pageHomeA1' replace={false} />
                    },
                    {
                      path: 'pageHomeA1',
                      id: 'pageHomeA1',
                      loader: () => ({ title: '首页-pageHomeA-PageHomeA1' }),
                      element: lazy(() => import('@/views/Dashboard/PageHome/PageHomeA/PageHomeA1'))
                    }
                  ]
                },
                {
                  path: '/dashboard/pageHome/pageHomeB',
                  id: 'pageHomeB',
                  loader: loaderPageHomeB,
                  meta: {
                    isValidateToken: true
                  },
                  /* 必须有 token 才能访问该页面; 但是下面的写法会在路由数据初始化后就固定了 以后本地 token 改变了那么此处还是之前的组件 lazy or Navigate 除非刷新页面重新路由初始化 */
                  /*
                    element: token ? (
                      lazy(() => import('@/views/Dashboard/PageHome/PageHomeB'))
                    ) : (
                      <Navigate to='/home' replace={false} />
                    )
                  */

                  /* 解决1 */
                  element: (
                    <AuthCompontent>
                      {/* <PageHomeB /> 这样写法会导致懒加载效果失效 也就是属性Suspense没有包裹上  */}

                      {/* 解决方法1: 直接使用 LazyLoadV1Component 高级组件 */}
                      <LazyLoadComponent />

                      {/* 解决方法2: 直接使用 LazyLoad 组件 */}
                      {/* <LazyLoad fullPath='/src/views/Dashboard/PageHome/PageHomeB' /> */}
                      {/* {LazyLoad({ fullPath: '/src/views/Dashboard/PageHome/PageHomeB' })} */}
                    </AuthCompontent>
                  )
                  /* 解决2: 推荐 */
                  // element: <AuthPageHomeB />
                }
              ]
            },
            {
              /* 将匹配
                1. /dashboard/pageShow
                2. /dashboard/pageShow/
              */
              path: '/dashboard/pageShow',
              id: 'pageShow',
              loader: () => ({ title: '展示' }),
              element: lazy(() => import('@/views/Dashboard/PageShow'))
            },
            {
              /* 将匹配以 `/dashboard/pageAbout` 开头的所有内容
                1. /dashboard/pageAbout
                2. /dashboard/pageAbout/
                3. /dashboard/pageAbout/123
                3. /dashboard/pageAbout/123/
                4. /dashboard/pageAbout/123/ABC
              */
              path: '/dashboard/pageAbout/*',
              caseSensitive: true, // 开启大小写敏感
              id: 'pageAbout',
              loader: () => ({ title: '关于' }),
              element: lazy(() => import('@/views/Dashboard/PageAbout'))
            },
            {
              /* 将匹配以 `/dashboard/pageDetail/:id/:title` 后面 id title 必填
                1. /dashboard/pageDetail/123/ABC
                2. /dashboard/pageDetail/ABC/123
              */
              path: '/dashboard/pageDetail/:id/:title',
              id: 'pageDetail',
              loader: () => ({ title: '详情' }),
              element: lazy(() => import('@/views/Dashboard/PageDetail'))
            },
            {
              /* 将匹配以 `/dashboard/pageInfo/:id/:title` 后面 id 必填
                1. /dashboard/pageInfo/123
                2. /dashboard/pageInfo/123/
                3. /dashboard/pageInfo/123/ABC
              */
              path: '/dashboard/pageInfo/:id/:title?',
              id: 'pageInfo',
              loader: () => ({ title: '信息' }),
              element: lazy(() => import('@/views/Dashboard/PageInfo'))
            },
            {
              /* 将匹配
                1. /dashboard/pageHandle/ABC
                2. /dashboard/pageHandle/123/
                3. /dashboard/pageHandle/123/ABC
                4. /dashboard/pageHandle/123/ABC/
                5. /dashboard/pageHandle/123/ABC/QWE
              */
              path: '/dashboard/pageHandle/:chapters/*',
              id: 'pageHandle',
              loader: () => ({ title: '执行' }),
              element: lazy(() => import('@/views/Dashboard/PageHandle'))
            }
          ]
        },
        {
          path: '*',
          isLink: true, // 是否为重定向
          element: <Navigate to='/error/404' replace={false} />
        }
      ]
    }
  ]
}

const RouteTable = getRouteTable()

export { RouteTable }
