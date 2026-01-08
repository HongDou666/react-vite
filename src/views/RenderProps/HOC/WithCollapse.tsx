import { ComponentType } from 'react'

const withCollapse = (Component: ComponentType<any>) => {
  return function CollapseWrapper(props) {
    const [isCollapsed, setIsCollapsed] = useState(true)

    const handleCollapse = () => {
      setIsCollapsed(!isCollapsed)
    }

    return <Component {...props} isCollapsed={isCollapsed} handleCollapse={handleCollapse} />
  }
}
export default withCollapse
