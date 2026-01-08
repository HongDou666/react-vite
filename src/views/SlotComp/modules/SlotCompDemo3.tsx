interface ComponentProps {
  name: string
}

const SlotCompDemo3: React.FC<React.PropsWithChildren<ComponentProps>> = ({ name = '酷睿I7' }) => {
  return (
    <>
      <div className='bComp'>
        <h3>我是 SlotCompDemo3 组件, {name}</h3>
      </div>
    </>
  )
}

export default SlotCompDemo3
