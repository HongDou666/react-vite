import type { ConfigProviderProps } from 'antd'
import { theme as antdTheme } from 'antd'

import { DARK_MODE_MEDIA_QUERY } from '@/constants/common'
import { themeSettings } from '@/theme/settings'
import { transformColorWithOpacity } from '@/utils'

const DARK_CLASS = 'dark'
const LIGHT_CLASS = 'light'

/** Init theme settings */
export function initThemeSettings() {
  return themeSettings
}

export function updateDarkMode(themeScheme: UnionKey.ThemeScheme) {
  if (themeScheme === 'dark') {
    return true
  } else if (themeScheme === 'light') {
    return false
  }
  /* window.matchMedia('(prefers - color - scheme: dark)').matches: 用于检测用户系统是否偏好深色模式; 如果当前的媒体查询匹配成功（即用户系统偏好深色模式），则返回 true；否则返回 false */
  return window.matchMedia(DARK_MODE_MEDIA_QUERY).matches
}

/**
 * Toggle css dark mode
 * @param darkMode Is dark mode
 */
export function toggleCssDarkMode(darkMode = false) {
  function addDarkClass() {
    document.documentElement.classList.add(DARK_CLASS)
    document.documentElement.setAttribute('data-theme', DARK_CLASS)
  }

  function removeDarkClass() {
    document.documentElement.classList.remove(DARK_CLASS)
    document.documentElement.setAttribute('data-theme', LIGHT_CLASS)
  }

  if (darkMode) {
    addDarkClass()
  } else {
    removeDarkClass()
  }
}

/**
 * Get antd theme
 *
 * @param colors Theme colors
 * @param darkMode Is dark mode
 */
export function getAntdTheme(
  colors: App.Theme.ThemeColor,
  darkMode: boolean,
  tokens: App.Theme.ThemeSetting['tokens']
) {
  /* 默认算法 theme.defaultAlgorithm
     暗色算法 theme.darkAlgorithm
     紧凑算法 theme.compactAlgorithm */
  const { darkAlgorithm, defaultAlgorithm } = antdTheme

  const { error, info, primary, success, warning } = colors

  // 背景颜色
  const bgColor = transformColorWithOpacity(primary, darkMode ? 0.3 : 0.1, darkMode ? '#000000' : '#fff')

  // 容器背景颜色
  const containerBgColor = darkMode ? tokens.dark?.colors?.container : tokens.light?.colors.container

  const theme: ConfigProviderProps['theme'] = {
    // 算法配置
    algorithm: [darkMode ? darkAlgorithm : defaultAlgorithm],
    // 组件配置
    components: {
      Button: {
        controlHeightSM: 28
      },
      Collapse: {
        contentPadding: '16px 16px 24px 16px',
        headerBg: containerBgColor
      },
      Menu: {
        darkItemBg: 'transparent',
        darkSubMenuItemBg: 'transparent',
        itemMarginInline: 8,
        itemSelectedBg: bgColor,
        subMenuItemBg: 'transparent'
      }
    },
    // 启用 css var
    cssVar: true,
    // 主题变量配置
    token: {
      colorBgContainer: containerBgColor,
      colorError: error,
      colorInfo: info,
      colorPrimary: primary,
      colorSuccess: success,
      colorWarning: warning
    }
  }

  return theme
}
