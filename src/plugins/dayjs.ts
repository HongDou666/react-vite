import { extend } from 'dayjs'
import localeData from 'dayjs/plugin/localeData'

import { setDayjsLocale } from '@/i18n/dayjs'

export function setupDayjs() {
  // 扩展 dayjs 插件
  extend(localeData)

  // 设置默认语言
  setDayjsLocale()
}
