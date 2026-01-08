import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  GithubOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonFilled,
  SunFilled,
  UserOutlined
} from '@ant-design/icons'
import { Icon } from '@iconify/react'
import type { MenuProps } from 'antd'

import SvgIcon from '@/components/VitePluginSvgr'
import { DARK_MODE_MOTION_REDUCE } from '@/constants/common'
import { useAppDispatch, useAppSelector } from '@/hooks/business/useStore'
import { useRouter } from '@/routes/hooks'
import { useRoute } from '@/routes/hooks/use-route'
import { changeLocale, getLocale } from '@/store-rtk/modules/app'
import { getDarkMode, getThemeSettings, toggleThemeScheme } from '@/store-rtk/modules/theme'
import { useAuthorization } from '@/utils'
import { STORAGE_AUTHORIZE_KEY } from '@/utils/authorization'

import GlobalBreadcrumb from './global-breadcrumb'

import moduleScss from './index.module.scss'

type NavHeaderType = {
  collapsed: boolean
  toggleCollapsed: (value: boolean) => void
}

const userItems: MenuProps['items'] = [
  {
    label: (
      <Button type='text' icon={<UserOutlined />}>
        个人中心
      </Button>
    ),
    key: '1'
  },
  { type: 'divider' },
  {
    label: (
      <Button type='text' icon={<LogoutOutlined />}>
        退出登录
      </Button>
    ),
    key: '2'
  }
]

const languageItems: MenuProps['items'] = [
  {
    label: <Button type='text'>中文</Button>,
    key: 'zh'
  },
  { type: 'divider' },
  {
    label: <Button type='text'>English</Button>,
    key: 'en'
  }
]

const icons: Record<UnionKey.ThemeScheme, string> = {
  auto: 'material-symbols:hdr-auto',
  dark: 'material-symbols:nightlight-rounded',
  light: 'material-symbols:sunny'
}

let dark: boolean = false
const DEFAULT_ANIMATION_DURATION = 1000
const DEFAULT_ANIMATION_EASING = 'ease-out'

const NavHeader: React.FC<NavHeaderType> = ({ collapsed, toggleCollapsed }) => {
  const router = useRouter()
  const { fullPath } = useRoute() // 获取当前路由路径

  const [getToken_, setToken_, removeToken] = useAuthorization(STORAGE_AUTHORIZE_KEY)

  const [isFullscreen, { toggleFullscreen }] = useFullscreen(document.body)
  const dispatch = useAppDispatch()
  const darkMode = useAppSelector(getDarkMode)
  const locale = useAppSelector(getLocale)
  const { themeScheme } = useAppSelector(getThemeSettings)
  const [modal, contextHolder] = Modal.useModal()

  const handleFullscreen = () => {
    toggleFullscreen()
  }
  const handleChangeLanguage: MenuProps['onClick'] = ({ key }) => {
    dispatch(changeLocale(key as App.I18n.LangType))
  }
  const handleChangeUser: MenuProps['onClick'] = ({ key }) => {
    if (key === '2') {
      modal?.confirm({
        cancelText: '取消',
        content: '你确定要退出登录吗？',
        okText: '确定',
        onOk: () => {
          removeToken()
          router.push(`/login?redirect=${fullPath}`)
        },
        title: '提示'
      })
    } else {
      message.info(`Click on item ${key}`)
    }
  }
  /* 切换主题模式 */
  const handleChangeTheme = (event) => {
    /* window.matchMedia 方法用于检查媒体查询。它接受一个媒体查询字符串作为参数，并返回一个 MediaQueryList 对象; '(prefers-reduced-motion: reduce)' 是一个媒体查询，表示用户是否希望减少动画或动态效果。如果用户在系统设置（如在 Windows、macOS 或移动设备的无障碍设置中）选择了减少运动，这个媒体查询会返回 true；否则返回 false */
    const isAppearanceTransition = !window.matchMedia(DARK_MODE_MOTION_REDUCE).matches
    if (!isAppearanceTransition) {
      // 直接切换模式 无需过渡效果
      dispatch(toggleThemeScheme())
      return
    }

    /* 用于创建平滑页面过渡效果的 Web API;返回一个 ViewTransition 对象，它可以在页面更新时，将旧页面内容平滑过渡到新页面内容 */
    const transition = document.startViewTransition(async () => {
      dark = dispatch(toggleThemeScheme()) as boolean
    })
    if (dark !== darkMode) return
    const x = event.clientX
    const y = event.clientY
    /* 计算结束半径 */
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

    transition.ready.then(() => {
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
      document.documentElement.animate(
        {
          clipPath: darkMode ? [...clipPath].reverse() : clipPath
        },
        {
          duration: DEFAULT_ANIMATION_DURATION, // 持续时间
          easing: DEFAULT_ANIMATION_EASING, // 过渡效果
          /* 伪元素：在动画期间，将旧视图和新视图的边界裁剪为圆形。这样可以实现平滑过渡效果 */
          pseudoElement: darkMode ? '::view-transition-old(root)' : '::view-transition-new(root)'
        }
      )
    })
  }

  return (
    <div className={moduleScss.navHeader}>
      {/* 导航栏左侧 */}
      <div className={moduleScss.navHeaderLeft}>
        {/* 折叠按钮 */}
        <Tooltip placement='bottom' title={collapsed ? '展开菜单' : '收起菜单'}>
          <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => toggleCollapsed(!collapsed)}
          />
        </Tooltip>

        {/* 面包屑 */}
        <GlobalBreadcrumb></GlobalBreadcrumb>
      </div>

      {/* 导航栏右侧 */}
      <div className={moduleScss.navHeaderRight}>
        {/* 全屏 */}
        <Tooltip className={moduleScss.fullScreen} placement='bottom' title={'全屏'}>
          {isFullscreen ? (
            <FullscreenExitOutlined onClick={handleFullscreen} />
          ) : (
            <FullscreenOutlined onClick={handleFullscreen} />
          )}
        </Tooltip>

        {/* 切换语言 */}
        <div className={`${moduleScss.dropdown} ${moduleScss.language}`}>
          <Dropdown
            placement='bottom'
            getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
            menu={{
              selectable: true,
              items: languageItems,
              onClick: handleChangeLanguage,
              defaultSelectedKeys: [locale]
            }}>
            <Tooltip placement='left' title={'切换语言'}>
              <div
                style={{
                  height: '26px',
                  lineHeight: '34px',
                  paddingBlock: 0
                }}>
                <SvgIcon fullPath='language' fill={themeScheme === 'dark' ? '#E0E0E0' : '#444444'} width={20}></SvgIcon>
              </div>
            </Tooltip>
          </Dropdown>
        </div>

        {/* 主题模式 */}
        <Tooltip className={moduleScss.theme} placement='bottom' title={'主题模式'}>
          <Button type='text' onClick={handleChangeTheme}>
            <Icon icon={icons[themeScheme]} style={{ width: 18, height: 18 }} />
          </Button>
        </Tooltip>

        {/* 个人信息下拉菜单 */}
        <div className={moduleScss.dropdown}>
          <Dropdown
            placement='bottomRight'
            getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
            menu={{ items: userItems, onClick: handleChangeUser }}
            trigger={['click']}>
            <Space>
              <GithubOutlined />
              晚风
            </Space>
          </Dropdown>
        </div>
      </div>
      {/* contextHolder 应该总是放在你想要访问的上下文下面 */}
      {contextHolder}
    </div>
  )
}

export default NavHeader
