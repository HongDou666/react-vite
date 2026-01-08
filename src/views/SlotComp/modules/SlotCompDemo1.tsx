import { useState } from 'react'

interface RenderSlotProps {
  id: number
  name: string
}
interface ComponentProps {
  headerContent: React.ReactNode
  bodyContent: JSX.Element
  footerContent: (param: RenderSlotProps[]) => JSX.Element
  renderSlot: (value: RenderSlotProps[]) => JSX.Element
  [key: string]: any
}

const SlotCompDemo1: React.FC<React.PropsWithChildren<ComponentProps>> = (props) => {
  const { children, renderSlot } = props
  // console.log('children', children)

  const [dataList] = useState([
    {
      id: 1,
      name: '表计'
    },
    {
      id: 2,
      name: '网关'
    }
  ])

  return (
    <>
      <div>
        {/* props 插槽 */}
        <div className='header'>{props.headerContent}</div>
        <div className='body'>{props.bodyContent}</div>
        <div className='footer'>{props.footerContent(dataList)}</div>

        {/* 默认插槽 */}
        <div>{!children![0].props.slot && children![0].props.children}</div>

        {/* 具名插槽 */}
        <div className={children![1].props.slot}>{children![1].props.children}</div>
        <div className={children![2].props.slot}>{children![2].props.children}</div>

        {/* 作用域插槽 */}
        {renderSlot(dataList)}
      </div>
    </>
  )
}

export default SlotCompDemo1
