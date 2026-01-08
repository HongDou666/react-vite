import { DataContext, type DataContextType, useData } from '../context/dataContext'

import CreateContextChild2 from './CreateContextChild2'

const CreateContextChild1: React.FC = () => {
  const data = useData()
  console.log('B组件收到A组件的信息', data)

  return (
    <>
      <div className='child'>
        <h3>我是B组件</h3>
        <h4>
          我从A组件接收到的用户名:
          <DataContext.Consumer>
            {(value: DataContextType) => {
              return ` ${value.windowPx.name}`
            }}
          </DataContext.Consumer>
        </h4>

        <CreateContextChild2 />
      </div>
    </>
  )
}

export default CreateContextChild1
