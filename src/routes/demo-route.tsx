import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

import Redirect from '@/components/Redirect'
import { AuthCompontent } from '@/components/WithAuth'
import LazyLoad from '@/components/WithLazyLoad'
import AppLayout from '@/layout'
import Error404 from '@/page/Error404/Error404'
import { useAuthorization } from '@/utils'

import type { SyncRoute } from './interface/index'
import { actionHome } from './action'
import { loaderPageHomeB } from './loader'

const [getToken] = (() => useAuthorization())()
const token = getToken()

const getRouteTable = (): SyncRoute.RoutersProps[] => {
  return [
    {
      path: '/login',
      id: 'login',
      loader: () => ({ title: '登录页' }),
      element: lazy(() => import('@/page/Login/Login'))
    },
    {
      path: '/error/404',
      unLazy: true, // 非懒加载路由组件
      id: '404',
      loader: () => ({ title: '404' }),
      element: <Error404></Error404>
    },
    {
      path: '/',
      unLazy: true, // 非懒加载路由组件
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
        {
          path: '/home',
          /* path: 'home', 相对路径写法 */
          id: 'home',
          /* loader 用于在路由渲染之前加载数据，适合在组件渲染前获取所需的数据 */
          loader: () => ({ title: '首页' }),
          /* action 用于处理提交操作，适合处理表单提交、数据保存等操作，并可以根据结果进行重定向或反馈 */
          action: actionHome,
          element: lazy(() => import('@/views/Home/Home'))
        },
        {
          path: '/create-context',
          id: 'create-context',
          loader: () => ({ title: 'React: CreateContext通信方式 常用于祖组件与后代组件的通信' }),
          element: lazy(() => import('@/views/CreateContext/CreateContext'))
        },
        {
          path: '/func-comp',
          id: 'func-comp',
          loader: () => ({ title: 'React: 父子组件通信' }),
          element: lazy(() => import('@/views/FuncComp/FuncComp'))
        },
        {
          path: '/module-css',
          id: 'module-css',
          loader: () => ({ title: 'React: 样式模块化' }),
          element: lazy(() => import('@/views/ModuleCss/ModuleCss'))
        },
        {
          path: '/slot-comp',
          id: 'slot-comp',
          loader: () => ({ title: 'React: 插槽使用' }),
          element: lazy(() => import('@/views/SlotComp/SlotComp'))
        },
        {
          path: '/use-effect',
          id: 'use-effect',
          loader: () => ({ title: 'React: useEffect 钩子函数' }),
          element: lazy(() => import('@/views/UseEffect/UseEffect'))
        },
        {
          path: '/use-callback',
          id: 'use-callback',
          loader: () => ({ title: 'React: useCallback 记忆函数' }),
          element: lazy(() => import('@/views/UseCallback/UseCallback'))
        },
        {
          path: '/use-memo',
          id: 'use-memo',
          loader: () => ({ title: 'React: useMemo 记忆组件(计算属性)' }),
          element: lazy(() => import('@/views/UseMemo/UseMemo'))
        },
        {
          path: '/memo',
          id: 'memo',
          loader: () => ({ title: 'React: memo props没有改变则跳过重新渲染' }),
          element: lazy(() => import('@/views/Memo/Memo'))
        },
        {
          path: '/portal',
          id: 'portal',
          loader: () => ({ title: 'React: portal 层级节点传送' }),
          element: lazy(() => import('@/views/Portal/Portal'))
        },
        {
          path: '/forward-ref',
          id: 'forward-ref',
          loader: () => ({ title: 'React: forwardRef 引用传递' }),
          element: lazy(() => import('@/views/ForwardRef/ForwardRef'))
        },
        {
          path: '/use-reducer',
          id: 'use-reducer',
          loader: () => ({ title: 'React: useReducer 轻量级的状态管理' }),
          element: lazy(() => import('@/views/UseReducer/UseReducer'))
        },
        {
          path: '/use-sync-external-store',
          id: 'use-sync-external-store',
          loader: () => ({ title: 'React: UseSyncExternalStore 从外部存储获取状态并在组件中同步显示' }),
          element: lazy(() => import('@/views/UseSyncExternalStore/UseSyncExternalStore'))
        },
        {
          path: '/use-transition',
          id: 'use-transition',
          loader: () => ({
            title: 'React: UseTransition 在不阻塞UI的情况下更新状态'
          }),
          element: lazy(() => import('@/views/UseTransition/UseTransition'))
        },
        {
          path: '/redux-demo',
          id: 'redux-demo',
          loader: () => ({ title: 'React: redux 状态管理' }),
          element: lazy(() => import('@/views/ReduxDemo/ReduxDemo'))
        },
        {
          path: '/mobx',
          id: 'mobx',
          loader: () => ({ title: 'React: Mobx 状态管理' }),
          element: lazy(() => import('@/views/MobX/Mobx'))
        },
        {
          path: '/zustand',
          id: 'zustand',
          loader: () => ({ title: 'React: Zustand 状态管理' }),
          element: lazy(() => import('@/views/Zustand/Zustand'))
        },
        {
          path: '/i18n',
          id: 'i18n',
          loader: () => ({ title: 'I18next: 国际化' }),
          element: lazy(() => import('@/views/I18n/I18n'))
        },
        {
          path: '/immutable',
          id: 'immutable',
          loader: () => ({ title: 'Immutable: 提供不可变的数据结构 优化组件性能 便于状态管理' }),
          element: lazy(() => import('@/views/Immutable/Immutable'))
        },
        {
          path: '/immer',
          id: 'immer',
          loader: () => ({ title: 'Immer: 用于管理不可变状态' }),
          element: lazy(() => import('@/views/Immer/Immer'))
        },
        {
          path: '/ahooks',
          id: 'ahooks',
          loader: () => ({ title: 'Ahooks: 高质量可靠的 Hooks 库' }),
          element: lazy(() => import('@/views/Ahooks/Ahooks'))
        },
        {
          path: '/classname',
          id: 'classname',
          loader: () => ({ title: 'Classnames: 多个className链接工具' }),
          element: lazy(() => import('@/views/ClassName/ClassName'))
        },
        {
          path: '/axios',
          id: 'axios',
          loader: () => ({ title: 'Axios: 网络代理请求' }),
          element: lazy(() => import('@/views/Axios/Axios'))
        },
        {
          path: '/richTextCompiler',
          id: 'richTextCompiler',
          loader: () => ({ title: 'React: 富文本编译器' }),
          element: lazy(() => import('@/views/RichTextCompiler/RichTextCompiler'))
        },
        {
          path: '/pubsub',
          id: 'pubsub',
          loader: () => ({ title: 'PubSub: 发布订阅模式（兄弟组件通信）' }),
          element: lazy(() => import('@/views/PubSub/PubSub'))
        },
        {
          path: '/echarts',
          id: 'echarts',
          loader: () => ({ title: 'Echarts: 数据分析图' }),
          element: lazy(() => import('@/views/Echarts/Echarts'))
        },
        {
          path: '/theme',
          id: 'theme',
          loader: () => ({ title: 'Theme: 主题定制' }),
          element: lazy(() => import('@/views/Theme/Theme'))
        },
        {
          path: '/scss',
          id: 'scss',
          loader: () => ({ title: 'Scss: 预编译scss' }),
          element: lazy(() => import('@/views/Scss/Scss'))
        },
        {
          path: '/styled-component',
          id: 'styled-component',
          loader: () => ({ title: 'StyledComponent: 样式化组件' }),
          element: lazy(() => import('@/views/StyledComponent/StyledComponent'))
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

                  /* 解决 */
                  element: (
                    <AuthCompontent>
                      {/* <PageHomeB></PageHomeB> 这样写法会导致懒加载效果失效 也就是属性Suspense没有包裹上  */}
                      {LazyLoad({
                        fullPath: '/src/views/Dashboard/PageHome/PageHomeB'
                      })}
                    </AuthCompontent>
                  )
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
