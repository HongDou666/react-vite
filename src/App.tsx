import { AliveScope } from 'react-activation'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { useUpdateEffect } from 'ahooks'
import type { WatermarkProps } from 'antd'

import AppStyles from '@/app-styles'
import ProgressBar from '@/components/progress-bar'
import { useAppSelector } from '@/hooks/business/useStore'
import { antdLocales } from '@/i18n/antd'
import routeData, { router } from '@/routes'
import type { RoutesPageType } from '@/routes/interface'
import { getDynamicRoute } from '@/routes/route/dynamic-route'
import { getLocale } from '@/store-rtk/modules/app'
import { getDarkMode, getThemeSettings, themeColors } from '@/store-rtk/modules/theme'
import { getAntdTheme, toggleCssDarkMode } from '@/store-rtk/modules/theme/shared'

import { setupLoading } from './plugins'

const watermarkProps: WatermarkProps = {
  font: { fontSize: 16 },
  height: 128,
  offset: [12, 60],
  rotate: -15,
  width: 240,
  zIndex: 9999
}

function useTheme() {
  const themeSettings = useAppSelector(getThemeSettings)
  const colors = useAppSelector(themeColors)

  const darkMode = useAppSelector(getDarkMode)
  const antdTheme = getAntdTheme(colors, darkMode, themeSettings.tokens)

  useUpdateEffect(() => {
    toggleCssDarkMode(darkMode)
  }, [darkMode])

  return { antdTheme, themeSettings }
}

const App = () => {
  const [router_, setRouter] = useState<any>()
  const [loading, setLoading] = useState(true)
  const { antdTheme, themeSettings } = useTheme()
  const locale = useAppSelector(getLocale)

  /* 根据后端返回的动态路由数据 来动态添加路由 */
  useEffect(() => {
    getDynamicRoute().then((res: any) => {
      const resultRouteData = res as RoutesPageType[]
      const targetRoute = routeData[2].children as RoutesPageType[]
      // 计算倒数第二项的索引
      const index = targetRoute.length - 2
      // 使用 splice 方法在倒数第二项后面插入元素
      targetRoute.splice(index + 1, 0, ...resultRouteData)
      const newRouter = createBrowserRouter(routeData, {
        future: {
          v7_normalizeFormMethod: true,
          v7_fetcherPersist: true,
          v7_skipActionErrorRevalidation: true,
          v7_partialHydration: true,
          v7_relativeSplatPath: true
        }
      })
      setRouter(newRouter)
      setLoading(false)
    })
  }, [])

  if (loading) {
    setupLoading()
    return null
  }

  return (
    <>
      {/* react styled-components 全局样式设置 */}
      <AppStyles />

      {/* 进度条组件 用于页面切换时的加载动画效果 */}
      <ProgressBar />

      {/* antd 全局样式设置 */}
      <ConfigProvider
        button={{ classNames: { icon: 'align-1px text-icon' } }}
        card={{ styles: { body: { flex: 1, overflow: 'hidden', padding: '12px 16px ' } } }}
        locale={antdLocales[locale]}
        theme={antdTheme}>
        {/* 水印组件 */}
        <Watermark
          className='h-full'
          content={themeSettings.watermark.visible ? themeSettings.watermark?.text || 'Soybean' : ''}
          {...watermarkProps}>
          {/* 组件缓存 */}
          <AliveScope>
            {/* 路由配置 */}
            <RouterProvider router={router_} future={{ v7_startTransition: true }} />
          </AliveScope>
        </Watermark>
      </ConfigProvider>

      {/* 注册路由 */}
      {/* <Router/> */}
      {/* <Outlet /> */}
    </>
  )
}

export default App
