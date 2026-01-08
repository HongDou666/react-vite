import classnames from 'classnames'

import moduleScss from './index.module.scss'

const ScssTheme: React.FC = () => {
  const rootEl = useRef<HTMLElement | null>(null)
  const [themeValue, setThemeValue] = useState(true)

  const handleSwitchTheme = (value) => {
    setThemeValue(value)
    if (value) {
      rootEl.current?.setAttribute('data-scssTheme', 'light')
    } else {
      rootEl.current?.setAttribute('data-scssTheme', 'dark')
    }
  }

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-scssTheme', 'light')
    rootEl.current = root
  }, [])

  const classTheme = classnames('flex-center', moduleScss.wrap, moduleScss['custom__level-100'])

  return (
    <div className={moduleScss.scssTheme}>
      <Space wrap>
        切换主题模式:
        <Switch checkedChildren='亮色' unCheckedChildren='暗色' value={themeValue} onChange={handleSwitchTheme} />
      </Space>
      <div className={classTheme}>
        {/* Scss 主题模式 */}
        {moduleScss.namespace}
      </div>
    </div>
  )
}

export default ScssTheme
