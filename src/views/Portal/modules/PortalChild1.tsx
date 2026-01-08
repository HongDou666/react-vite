import { createPortal } from 'react-dom'

import moduleScss from '../index.module.scss'

interface PropsType {
  count: number
}

const PortalChild1: React.FC<PropsType> = ({ count }) => {
  const portalDom = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    portalDom.current = document.querySelector('#portal')
  }, [])

  return (
    <div className={moduleScss.portal_child1}>
      <span>PortalChild1 移动至 body: {count}</span>
      {portalDom.current &&
        createPortal(
          <div>
            移动到 Portal 组件 &nbsp;
            <span>count {count}</span>
          </div>,
          portalDom.current
        )}
    </div>
  )
}

export default PortalChild1
