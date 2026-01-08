import DataProvider from './context/DataProvider'
import DataChildProvider from './context-child/DataChildProvider'
import CreateContextChild1 from './modules/CreateContextChild1'

import moduleScss from './index.module.scss'

const CreateContext: React.FC = () => {
  return (
    <div className={moduleScss.createContext}>
      <div className={moduleScss.parent}>
        {/* 多个 Context 上下文环境; 使用多个 Provider 作为数据的提供者 */}
        <DataProvider>
          <DataChildProvider>
            <CreateContextChild1 />
          </DataChildProvider>
        </DataProvider>
      </div>
    </div>
  )
}

export default CreateContext
