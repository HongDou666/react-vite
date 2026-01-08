import { locale } from 'dayjs'

import { useAuthorization } from '@/utils'

import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'

const [getToken] = (() => useAuthorization('lang'))()

/**
 * Set dayjs locale
 * @param lang
 */
export function setDayjsLocale(lang: App.I18n.LangType = 'zh') {
  const localMap = {
    en: 'en',
    zh: 'zh-cn'
  } satisfies Record<App.I18n.LangType, string>

  const l = lang || getToken() || 'zh'
  locale(localMap[l])
}
