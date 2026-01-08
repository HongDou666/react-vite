/*
  react-i18next 国际化

  参考文献1: https://juejin.cn/post/7139855730105942030#heading-2
  参考文献2: https://www.cnblogs.com/operate/p/16199940.html
  参考文献3: https://segmentfault.com/a/1190000040477248
  参考文献4: https://www.jianshu.com/p/2f8d6e0b4adb
  参考文献5: https://blog.csdn.net/Jas3000/article/details/121255324
*/

/* react-i18next 是 i18next 的一个插件，用来降低 react 的使用成本 */
import { initReactI18next } from 'react-i18next'
import dayjs from 'dayjs'
/* i18next 提供了翻译的基本能力 (提供所有翻译功能的核心) */
import i18n from 'i18next'
/* i18next-browser-languagedetector 是用来检测浏览器语言的插件 */
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

import { useAuthorization } from '@/utils'

const [getToken] = (() => useAuthorization('lang'))()

i18n
  /* 可指定具体的文件位置来存放翻译文件 */
  .use(Backend)
  /* 检测用户当前使用的语言 */
  .use(LanguageDetector)
  /* 注入 react-i18next 实例 | 将 i18n 实例传递给 react-i18next */
  .use(initReactI18next)
  /*
    初始化 i18next
    配置参数的文档: https://www.i18next.com/overview/configuration-options
  */
  .init({
    debug: false, // 是否开启调试模式
    fallbackLng: getToken() || 'zh', // 默认当前环境的语言
    lng: getToken() || 'zh', // 默认语言
    interpolation: {
      escapeValue: false // 不转义插值表达式的值
    },
    /* 自定义配置 */
    detection: {
      /*
        缓存语言: localStorage sessionStorage cookie 存储 i18nextLng
        众所周知，localStorage是不会随着页面刷新、标签关闭造成数据丢失的，
        也就是说当我们刷新页面时，我们仍然可以拿到上一次用户选择的语言类型，
        并且按照这个语言类型去加载对应的json文件数据
      */
      caches: ['localStorage', 'sessionStorage', 'cookie']
    },
    backend: {
      /* 调整存放翻译文件路径 */
      loadPath: '/src/i18n/locales/{{lng}}/{{ns}}.json'
    }
    /* 自定义资源文件 */
    /*
      resources: {
        zh: {
          translation: {
            welcome: '欢迎来到我的网站',
            author: `作者是：<1>代码与野兽</1>`,
            currentTime: '当前时间是 {{time, YYYY-MM-DD}}'
          }
        },
        en: {
          translation: {
            welcome: 'Welcome to my website',
            author: `Author is：<1>code and beast</1>`,
            currentTime: 'Current time is {{time, DD/MM/YY}}'
          }
        }
      }
    */
  })

/* 确保i18n对象及其services和formatter属性已正确定义和初始化 */
if (i18n && i18n.services && i18n.services.formatter) {
  i18n.services.formatter.add('YYYY/MM/DD', (value, lng, options) => {
    return dayjs(value).format('YYYY/MM/DD')
  })
  i18n.services.formatter.add('YYYY-MM-DD', (value, lng, options) => {
    return dayjs(value).format('YYYY-MM-DD')
  })
}

export function setLng(locale: App.I18n.LangType) {
  i18n.changeLanguage(locale)
}

export default i18n
