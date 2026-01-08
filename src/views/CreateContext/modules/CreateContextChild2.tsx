import { DataContext, type DataContextType, useData } from '../context/dataContext'
import { DataChildContext, type DataChildContextType, useChildData } from '../context-child/dataChildContext'

const CreateContextChild2: React.FC = () => {
  const data = useData()
  console.log('C组件收到A组件的信息', data)

  const dataChild = useChildData()
  console.log('dataChild', dataChild)

  return (
    <>
      <div className='grand'>
        <h3>我是C组件</h3>
        <Button
          type='primary'
          onClick={() => {
            data?.setWindowPx({
              ...data.windowPx,
              name: data.windowPx.name === '蛟龙-9800' ? '麒麟-10000' : '蛟龙-9800'
            })
          }}>
          改变芯片名称
        </Button>

        <h4>
          我从A组件接收到的用户名:
          <DataContext.Consumer>{(value: DataContextType) => <span> {value.windowPx.name}</span>}</DataContext.Consumer>
        </h4>

        <Space>
          {dataChild.userInfo.cityList.map((city) => (
            <Tag key={city.code} color={'geekblue'}>
              {city.name}
            </Tag>
          ))}
        </Space>
      </div>
    </>
  )
}

export default CreateContextChild2
