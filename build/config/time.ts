/* 导入dayjs库，用于处理日期和时间 */
import dayjs from 'dayjs'
/* 导入dayjs的timezone插件，该插件允许dayjs处理时区相关的日期和时间 */
import timezone from 'dayjs/plugin/timezone'
/* 导入dayjs的utc插件，该插件提供了UTC（协调世界时）相关的功能 */
import utc from 'dayjs/plugin/utc'

/*
  获取当前时间（考虑Asia/Shanghai时区）并将其格式化为YYYY-MM-DD HH:mm:ss格式的字符串返回
*/
export function getBuildTime() {
  dayjs.extend(utc)
  dayjs.extend(timezone)

  const buildTime = dayjs.tz(Date.now(), 'Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')

  return buildTime
}
