import SlotCompDemo1 from './modules/SlotCompDemo1'
import SlotCompDemo2 from './modules/SlotCompDemo2'
import SlotCompDemo3 from './modules/SlotCompDemo3'

import moduleScss from './index.module.scss'

interface RenderSlotProps {
  id: number
  name: string
}

const SlotComp = () => {
  const headerContent = <h1>头部标题</h1>
  const bodyContent = <p>主体内容</p>

  const handleSlotRender = (dataFromChild: RenderSlotProps[]) => {
    return (
      <p>
        {dataFromChild.map((val, index) => {
          return (
            <i key={index}>
              {val.id}-{val.name}
            </i>
          )
        })}
      </p>
    )
  }

  return (
    <>
      <div className={moduleScss.slotComp}>
        <SlotCompDemo1
          headerContent={headerContent}
          bodyContent={bodyContent}
          footerContent={(list) => (
            <div>
              <span>末尾段落</span>:&nbsp;
              {list?.map((val, index) => (
                <Tag key={index} color='processing'>
                  {val.name}
                </Tag>
              ))}
            </div>
          )}
          renderSlot={handleSlotRender}>
          {<div>Foo 默认插槽</div>}
          <div slot='tabs'>
            <h1>Tabs 具名区域插槽</h1>
          </div>
          <div slot='search'>
            <p>Search 具名区域插槽</p>
          </div>
        </SlotCompDemo1>

        <div className={moduleScss.comp}>
          <h3>我是 SlotComp 组件</h3>
          <SlotCompDemo2 render={(name) => <SlotCompDemo3 name={name} />} />
        </div>
      </div>
    </>
  )
}

export default SlotComp
