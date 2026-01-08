interface ComponentProps {
  render: (value: string) => JSX.Element
}

const SlotCompDemo2: React.FC<React.PropsWithChildren<ComponentProps>> = (props) => {
  const [node] = useState('麒麟-9800')

  return (
    <>
      <div className='aComp'>
        <h3>我是 SlotCompDemo2 组件</h3>
        {props.render(node)}
      </div>
    </>
  )
}

export default SlotCompDemo2
