import { Outlet, useLoaderData, useRouteLoaderData } from 'react-router-dom'
import type { MenuProps } from 'antd'
import { cloneDeep } from 'lodash-es'

import { getUserInfo } from '@/api/user'
import SvgIcon from '@/components/VitePluginSvgr'
import { RouteContext, useRouteInfo } from '@/hooks/useRoute'
import { RouterContext } from '@/hooks/useRouter'
import { router } from '@/routes'
import useBoundStore from '@/zustand'

import menuList from './menu/hooks'
import NavHeaderType from './header'
import SiderMenu from './menu'
import { searchRoute } from './shared'

import moduleScss from './index.module.scss'

interface useRouteLoaderDataType {
  menuList: any[]
  menuPathList: string[]
  buttonList: string[]
}

type MenuItem = Required<MenuProps>['items'][number]

const { Header, Footer, Sider, Content } = Layout
const menuList_ = cloneDeep(menuList)
const index = menuList_.findIndex((item) => item.key === 'Home')
const items: MenuItem[] = [menuList[index], ...menuList_.slice(index + 1), ...menuList_.slice(0, index)]
const initKey = items[0]?.key || ''

/* 这里手动模拟白名单 符合 AppLayout 根组件中 children 的路由 */
const whiteRouteList = ['/', '/echarts', '/home', '/i18n', 'axios']
const routerRegex = [/^\/dashboard/, /^\/keep-alive-demo/]

const useRouterParams = () => {
  const params = useParams()
  const location = useLocation()
  const [search, setSearch] = useSearchParams()
  const navigate = useNavigate()
  return { params, location, search, setSearch, navigate }
}

const AppLayout: React.FC = () => {
  // 获取当前路由信息
  const currentRoute = useRouteInfo()
  const { id } = currentRoute
  const router_ = useRouterParams()
  const pathname = router_.location.pathname
  const updateUserInfo = useBoundStore((state) => state.updateUserInfo)
  const [collapsed, setCollapsed] = useState(false)
  const [collapsedWidth, setCollapsedWidth] = useState(80)
  const routerData = useRouteLoaderData('layout') as useRouteLoaderDataType
  const { menuPathList } = routerData

  /* 触发响应式布局断点时的回调 */
  const onBreakpoint = (broken) => {
    if (broken) {
      setCollapsedWidth(0)
      setCollapsed(true)
    } else {
      setCollapsedWidth(80)
      setCollapsed(false)
    }
  }

  const getUserInfo_ = async () => {
    try {
      const res: ReturnType<typeof getUserInfo> = getUserInfo()
      const result = await res
      if (result.code === 200) {
        updateUserInfo(result.data!)
      } else {
        result.msg && message.error(result.msg)
      }
    } catch (error: any) {
      console.error(error)
    }
  }

  useEffect(() => {
    getUserInfo_()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* 
    路由拦截 没有权限不能访问
    if (
      !menuPathList.includes(pathname) &&
      !whiteRouteList.includes(pathname) &&
      !routerRegex.some((item) => item.test(pathname))
    ) {
      return <Navigate to='/error/404' replace={false} />
    }
  */

  const route = searchRoute(pathname, router.routes)
  if (route && route.meta?.keepAlive) {
    /* 如需进一步鉴权 可在此处理逻辑 route.loader() */
  }

  return (
    <>
      <Layout className={moduleScss.layout}>
        {/* 侧边栏 */}
        <Sider
          width={220}
          breakpoint='sm'
          collapsedWidth={collapsedWidth}
          onBreakpoint={onBreakpoint}
          className={moduleScss.layoutSider}
          trigger={null}
          collapsible
          collapsed={collapsed}>
          {/* 系统 logo */}
          <div className={moduleScss.siderLogo}>
            <SvgIcon fullPath='loading' width={30} fill='#646cff'></SvgIcon>
            {!collapsed && <h2>晚风 管理系统</h2>}
          </div>

          {/* 侧边菜单栏 */}
          <SiderMenu items={items} initKey={String(initKey)}></SiderMenu>
        </Sider>

        <Layout>
          <RouteContext.Provider value={{ routes: items, route: router.state }}>
            <RouterContext.Provider value={{ router: router_ }}>
              {/* 顶部导航栏 */}
              <Header className={moduleScss.layoutHeader}>
                <NavHeaderType collapsed={collapsed} toggleCollapsed={() => setCollapsed(!collapsed)}></NavHeaderType>
              </Header>
              {/* 内容区 */}
              <Content className={moduleScss.layoutContent}>
                <div className={moduleScss.layoutContentMain}>
                  {/* 注册路由 */}
                  <Outlet />
                </div>
              </Content>
            </RouterContext.Provider>
          </RouteContext.Provider>

          {/* Footer */}
          <Footer className={moduleScss.layoutFooter}>Copyright MIT © 2024 admin</Footer>
        </Layout>
      </Layout>
    </>
  )
}

export default AppLayout
