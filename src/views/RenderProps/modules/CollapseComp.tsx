interface PropsParamsType {
  isCollapsed: boolean
  handleCollapse: (collapse: boolean) => void
}

interface CollapseCompType {
  render: (props: PropsParamsType) => React.ReactNode
}

const CollapseComp: React.FC<CollapseCompType> = ({ render }) => {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return <>{render ? render({ isCollapsed, handleCollapse }) : null}</>
}

export default CollapseComp
