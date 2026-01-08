import type { MenuProps } from 'antd'

import { useAppSelector } from '@/hooks/business/useStore'
import { usePathname } from '@/routes/hooks'
import { getDarkMode } from '@/store-rtk/modules/theme'

import menuList from './hooks'

import moduleScss from './index.module.scss'

type MenuItem = Required<MenuProps>['items'][number]

interface PropsType {
  initKey?: string
  items?: MenuItem[]
}

const SiderMenu: React.FC<PropsType> = ({ items, initKey }) => {
  const darkMode = useAppSelector(getDarkMode)
  const navigate = useNavigate()
  // const { pathname } = useLocation()
  const pathname = usePathname()

  /* 初始化选中的菜单 */
  const defaultSelectedKeys = useMemo(() => {
    if (pathname && pathname !== '/') {
      return [
        pathname
          .replace('/', '')
          .split('-')
          .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
          .join('')
      ]
    } else {
      return [initKey]
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* 当前选中的菜单 */
  const [currentSelectedMenu, setCurrentSelectedMenu] = useState(defaultSelectedKeys)

  /* 初始化展开的菜单 */
  const defaultOpenKeys = useMemo(() => {
    if (pathname && pathname !== '/') {
      let key: string[] = []
      ourter: for (let i = 0; i < menuList.length; i++) {
        const element = menuList[i]
        if (element.path && element.path === pathname) {
          key = [element.sort!]
          break ourter
        }
        if (element.children && element.children.length > 0) {
          for (let k = 0; k < element.children.length; k++) {
            const childElement = element.children[k]
            if (childElement.path && childElement.path === pathname) {
              key = [childElement.sort!]
              break ourter
            }
          }
        }
      }
      return key
    } else {
      return [initKey]
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* 当前展开的菜单 */
  const [currentOpenMenu, setCurrentOpenMenu] = useState(defaultOpenKeys)

  /* 计算出要跳转的菜单路径 */
  const getPath = useCallback((str: string) => {
    const path = str
      .split(/(?=[A-Z])/)
      .join('-')
      .toLowerCase()
    return `/${path}`
  }, [])

  /* 菜单点击事件 */
  const handleClickMenu: MenuProps['onClick'] = (e) => {
    const path = getPath(e.key)
    // 如果是 /keep-alive-demo2 (添加路由参数 为了验证组件缓存)
    if (path === '/keep-alive-demo2' || path === '/keep-alive-demo3') {
      // 生成 900-902 的随机整数
      const randomNum = Math.floor(Math.random() * 3) + 900
      navigate(`${path}/${randomNum}`)
    } else {
      navigate(path)
    }
  }

  /* 菜单展开/收起 事件 */
  const onOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
    if (openKeys.length) {
      setCurrentOpenMenu(openKeys)
    } else {
      setCurrentOpenMenu([])
    }
  }

  /* 监听路由变化 忽略首次执行 高亮选中的菜单 */
  useUpdateEffect(() => {
    const selectedKeys = pathname
      .replace('/', '')
      .split('-')
      .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
      .join('')
    setCurrentSelectedMenu([selectedKeys])
    return () => {}
  }, [pathname])

  return (
    <>
      <div className={moduleScss.siderMenu}>
        <Menu
          defaultSelectedKeys={defaultSelectedKeys as string[]}
          defaultOpenKeys={defaultOpenKeys as string[]}
          selectedKeys={currentSelectedMenu as string[]}
          openKeys={currentOpenMenu as string[]}
          onClick={handleClickMenu}
          onOpenChange={onOpenChange}
          mode='inline'
          theme={darkMode ? 'dark' : 'light'}
          items={items}
        />
      </div>
    </>
  )
}

export default memo(SiderMenu)
