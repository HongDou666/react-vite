import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'

import { AppThunk } from '@/store-rtk'

import { initThemeSettings, updateDarkMode } from './shared'

interface InitialStateType {
  darkMode: boolean
  settings: App.Theme.ThemeSetting
}

const initialState: InitialStateType = {
  darkMode: false,
  settings: initThemeSettings()
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setDarkMode(state, { payload }: PayloadAction<boolean>) {
      state.darkMode = payload
    },
    /**
     * Set theme scheme
     * @param themeScheme
     */
    setThemeScheme(state, { payload }: PayloadAction<UnionKey.ThemeScheme>) {
      state.darkMode = updateDarkMode(payload)
      state.settings.themeScheme = payload
    }
  },
  selectors: {
    getDarkMode: (theme) => theme.darkMode,
    getThemeSettings: (theme) => theme.settings
  }
})

const themeSchemes: UnionKey.ThemeScheme[] = ['light', 'dark']

export const toggleThemeScheme = (): AppThunk<boolean> => (dispatch, getState) => {
  const themeSettings = getThemeSettings(getState())
  const index = themeSchemes.findIndex((item) => item === themeSettings.themeScheme)
  const nextIndex = index === themeSchemes.length - 1 ? 0 : index + 1
  const nextThemeScheme = themeSchemes[nextIndex]
  const darkMode = updateDarkMode(nextThemeScheme)
  const themeScheme = nextThemeScheme
  dispatch(setDarkMode(darkMode))
  dispatch(setThemeScheme(themeScheme))
  return darkMode
}

/* 导出 selectors */
export const { getDarkMode, getThemeSettings } = themeSlice.selectors

/* 计算属性选择器 用于获取主题颜色 */
export const themeColors = createSelector([getThemeSettings], ({ isInfoFollowPrimary, otherColor, themeColor }) => {
  const colors: App.Theme.ThemeColor = {
    primary: themeColor,
    ...otherColor,
    info: isInfoFollowPrimary ? themeColor : otherColor.info
  }
  return colors
})

/* 导出 actions */
export const { setDarkMode, setThemeScheme } = themeSlice.actions

/* 获取 reducer */
const reducer = themeSlice.reducer

/* 以默认导出的方式导出reducer */
export default reducer
