import { createPortal } from 'react-dom'

import PortalChild1 from './modules/PortalChild1'

import moduleScss from './index.module.scss'

const Portal: React.FC = () => {
  const [count, setCount] = useState<number>(100)

  const modelComp = <div className={moduleScss.model}>我在 body 中</div>

  /* Ts函数范型 */
  const handleAdd = <T extends number | null>(data: T) => {
    setCount((pre) => pre + (data as number))
  }

  return (
    <div className={moduleScss.portal} id='portal'>
      <Button type='primary' onClick={() => handleAdd(1)}>
        count 数值+1
      </Button>
      <div>我在 Portal 组件中</div>

      {createPortal(modelComp, document.body)}
      {createPortal(<PortalChild1 count={count} />, document.body)}
    </div>
  )
}

export default Portal
