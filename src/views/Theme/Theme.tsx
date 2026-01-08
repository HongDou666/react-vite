import AntTheme from './modules/AntTheme'
import CssTheme from './modules/CssTheme'
import ScssTheme from './modules/ScssTheme'

const Theme: React.FC = () => {
  return (
    <div>
      <CssTheme />
      <ScssTheme />
      <AntTheme />
    </div>
  )
}

export default Theme
