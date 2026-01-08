import { Trans, Translation, useTranslation } from 'react-i18next'
import type { ConfigProviderProps } from 'antd'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'

import I18nChild1 from './modules/I18nChild1'
import I18nChild2 from './modules/I18nChild2'

import 'dayjs/locale/zh-cn'

type Locale = ConfigProviderProps['locale']

dayjs.locale('zh-cn')

const I18n: React.FC = () => {
  const [locale, setLocal] = useState<Locale>(zhCN)
  const { t, i18n } = useTranslation()
  /* 当前环境语言 */
  const currentLanguage = i18n.language
  const [value] = useState('zh')
  const [options] = useState([
    {
      value: 'zh',
      label: '中文'
    },
    {
      value: 'en',
      label: '英文'
    }
  ])

  const handleChange = (value: string) => {
    if (value === 'en') {
      setLocal(enUS)
      dayjs.locale('en')
    } else {
      setLocal(zhCN)
      dayjs.locale('zh-cn')
    }
    i18n.changeLanguage(value)
  }

  return (
    <div>
      <span>切换语言：</span>
      <Select defaultValue={value} style={{ width: 200 }} onChange={handleChange} options={options} />
      <Tag color='magenta'>当前语言是: {currentLanguage}</Tag>

      <Alert message={t('runningman')} type='info' />
      <br />
      <Alert message={t('verse1')} type='info' />
      <br />
      <Alert message={t('verse2')} type='info' />

      <Trans i18nKey='simpleText' />
      <br />
      <Trans i18nKey='author'>
        <i></i>
        <b></b>
      </Trans>

      <p>
        {t('currentTime', {
          city: '北京',
          time: new Date()
        })}
      </p>

      <h1>{t('home.title')}</h1>
      <h1>{t('about.title')}</h1>

      <Translation>{(t_) => <h3>{t_('verse1')}</h3>}</Translation>
      <Translation>{(t_) => <h3>{t_('about.title')}</h3>}</Translation>

      <I18nChild1></I18nChild1>

      <ConfigProvider locale={locale}>
        <I18nChild2 />
      </ConfigProvider>
    </div>
  )
}

export default I18n
