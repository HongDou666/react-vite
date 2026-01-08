import classnames from 'classnames'

import moduleScss from './index.module.scss'

const CssTheme: React.FC = () => {
  const rootEl = useRef<HTMLElement | null>(null)
  const [themeValue, setThemeValue] = useState(true)

  const handleSwitchTheme = (value) => {
    setThemeValue(value)
    if (value) {
      rootEl.current?.setAttribute('data-theme', 'light')
    } else {
      rootEl.current?.setAttribute('data-theme', 'dark')
    }
  }

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', 'light')
    rootEl.current = root
  }, [])

  const classTheme = classnames('flex-center', moduleScss.wrap, moduleScss['custom__level-100'])

  return (
    <div className={moduleScss.cssTheme}>
      <Space wrap>
        切换主题模式:
        <Switch checkedChildren='亮色' unCheckedChildren='暗色' value={themeValue} onChange={handleSwitchTheme} />
      </Space>
      <div className={classTheme}>Css 主题模式</div>
    </div>
  )
}

export default CssTheme
