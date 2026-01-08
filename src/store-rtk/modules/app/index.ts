import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { setLng } from '@/i18n'
import { useAuthorization } from '@/utils'

/* 获取 存储 */
const [getToken, setToken] = (() => useAuthorization('lang'))()

interface InitialStateType {
  locale: App.I18n.LangType
}

const initialState: InitialStateType = {
  locale: (getToken() as 'zh' | 'en') || 'zh'
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    changeLocale(state, { payload }: PayloadAction<App.I18n.LangType>) {
      state.locale = payload
      setLng(payload)
      setToken(payload)
    }
  },
  selectors: { getLocale: (app) => app.locale }
})

export const { changeLocale } = appSlice.actions

export const { getLocale } = appSlice.selectors

/* 获取 reducer */
const reducer = appSlice.reducer

/* 以默认导出的方式导出reducer */
export default reducer
