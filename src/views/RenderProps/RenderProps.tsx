import withCollapse from './HOC/WithCollapse'
import CollapseComp from './modules/CollapseComp'
import RenderPropsChild1 from './modules/RenderPropsChild1'

const CollapseRender = withCollapse(RenderPropsChild1)

const RenderProps: React.FC = () => {
  return (
    <div className='h-600px border border-#ccc border-solid p-10px'>
      <Space direction='vertical'>
        <CollapseComp render={(props) => <RenderPropsChild1 {...props} title='RenderProps 实现横切关注点抽离' />} />

        <CollapseRender title='高级组件 实现横切关注点抽离' />
      </Space>
    </div>
  )
}

export default RenderProps
