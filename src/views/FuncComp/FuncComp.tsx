import { useState } from 'react'

import FuncCompChild1 from './modules/FuncCompChild1'
import FuncCompChild2 from './modules/FuncCompChild2'
import FuncCompChild3 from './modules/FuncCompChild3'
import FuncCompChild4 from './modules/FuncCompChild4'

const FuncComp = () => {
  const customProps = {
    dataArray: [10, 20, 30],
    metaArray: ['佐助', '鸣人', '小樱']
  }
  const numbers = [100, 200, 300]
  const metaData = ['one', 'two', 'three']

  const [count, setCount] = useState(1)
  const [falg, setFalg] = useState(true)
  const [nodeData, setNodeData] = useState({
    name: '晚风',
    age: 18,
    sex: '男',
    info: {
      address: '上海',
      phone: '13800000000',
      interests: {
        music: ['流行', '摇滚'],
        film: ['动作', '科幻']
      }
    }
  })

  const handleClick = (value: number) => {
    setCount(count + value)

    // 1. 改变对象信息
    setNodeData(
      Object.assign({}, nodeData, {
        info: Object.assign({}, nodeData.info, {
          address: nodeData.info.address === '上海' ? '北京' : '上海'
        })
      })
    )

    /*
      2. 改变对象信息
      setNodeData({
        ...nodeData,
        info: {
          ...nodeData.info,
          address: '北京'
        }
      })
    */
  }

  return (
    <>
      <div>
        <FuncCompChild1 count={count} falg={falg} nodeData={nodeData} handleClick={handleClick} />

        <FuncCompChild2 title={'寒风'} count={nodeData.age} />

        <FuncCompChild3<number, string> dataArray={numbers} metaArray={metaData} />

        <FuncCompChild3<number, string> {...customProps} />

        <FuncCompChild4
          value='我是 FuncCompChild4'
          className='counter'
          data-testid='ticker'
          style={{
            border: '1px solid #ccc'
          }}></FuncCompChild4>
      </div>
    </>
  )
}

export default FuncComp
