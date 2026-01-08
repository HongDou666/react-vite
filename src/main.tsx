import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
/* React Router 支持两种路由模式：BrowserRouter 和 HashRouter */
import { BrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider as MobxProvider } from 'mobx-react'
import { PersistGate } from 'redux-persist/integration/react'

import App from '@/App'
import moboxStores from '@/mobox'
import { router } from '@/routes'
import { queryClient, QueryClientProvider, ReactQueryDevtools } from '@/service/index'
import { persistor, store } from '@/store'

import { syntheticEventListener } from './lib/event'
import { setupDayjs, setupLoading } from './plugins'

/* 项目样式入口 css */
import '@/styles/index'
/* i18n 国际化配置 */
import '@/i18n/index'
/* 注入 Message 组件 */
import '@/components/Message/index'
/*
  npm install vite-plugin-svg-icons --save-dev
  封装svg图标组件 用于将本地 SVG 文件转换为可直接在组件中使用的图标 这个插件能够自动扫描指定目录下的 SVG 文件
*/
import 'virtual:svg-icons-register'

/* 防止使用 react-draft-wysiwyg 报错 global is not defined */
window.global = window

function setupApp() {
  /* 初始化 dayjs 时间库 */
  setupDayjs()

  /* 初始化加载动画 (页面刷新展示) */
  setupLoading()

  const container = document.getElementById('root')
  if (!container) return

  /* 创建根节点 */
  const root = createRoot(container)
  /* 渲染 */
  root.render(
    /*
      严格模式的主要目的是帮助开发者发现和修复潜在的问题，以便在生产模式下运行的应用能够更加稳定和高效。然而，需要注意的是，严格模式只在开发模式下生效，在生产模式下不会产生任何影响
    */
    /* <StrictMode> */
    /* 异步数据管理库 */
    <QueryClientProvider client={queryClient}>
      {/* react-redux 状态管理 */}
      <Provider store={store}>
        {/* redux-persist 持久化 */}
        <PersistGate loading={null} persistor={persistor}>
          {/* mobx-react 状态管理 */}
          <MobxProvider {...moboxStores}>
            {/* react-router 路由两种注册方式 */}
            {/* <BrowserRouter> <App /> </BrowserRouter> */}
            {/* <RouterProvider router={router} future={{ v7_startTransition: true }} /> */}
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
          </MobxProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>

    /* </StrictMode> */
  )

  /* 集成合成事件 */
  syntheticEventListener(container)
}

setupApp()
