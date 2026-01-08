import { message } from 'antd'
import { nanoid } from 'nanoid'
import { useShallow } from 'zustand/react/shallow'

import useBoundStore from '@/zustand'

const ZustandChild2: React.FC = () => {
  const { citys, addCitys, resetCitys } = useBoundStore(
    useShallow((state) => ({
      citys: state.citys,
      addCitys: state.addCitys,
      resetCitys: state.reset
    }))
  )
  const handleClick = () => {
    addCitys({
      name: '洛杉矶' + citys.length
    })
  }
  const handleReset = () => {
    resetCitys()
  }

  useEffect(() => {
    message.info('城市数量: ' + citys.length)
  }, [citys])

  return (
    <div>
      <Button type='primary' onClick={handleClick}>
        添加一个城市
      </Button>
      <Button type='primary' onClick={handleReset}>
        重置城市
      </Button>
      城市列表:
      {citys.map((item) => (
        <Tag key={nanoid()} color='processing'>
          {item.name}
        </Tag>
      ))}
    </div>
  )
}

export default ZustandChild2
