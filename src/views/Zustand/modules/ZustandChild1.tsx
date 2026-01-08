import { Image } from 'antd'
import { message } from 'antd'
import { nanoid } from 'nanoid'
import { useShallow } from 'zustand/react/shallow'

import useBoundStore from '@/zustand'

const param = {
  node: {
    cityId: 440300,
    pageNum: 0,
    pageSize: 5,
    type: 1,
    k: 320674
  },
  config: {
    headers: {
      'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.2.1","e":"173223556337542309134337","bc":"440300"}',
      'X-Host': 'mall.film-ticket.film.list'
    }
  }
}

const ZustandChild1: React.FC = () => {
  const { count, increment, decrement, roleList, addRoleList, listData, getListData } = useBoundStore(
    useShallow((state) => ({
      count: state.count,
      roleList: state.roleList,
      listData: state.listData,
      increment: state.increment,
      decrement: state.decrement,
      addRoleList: state.addRoleList,
      getListData: state.getListData
    }))
  )
  /*
    const count = useBoundStore((state) => state.count)
    const increment = useBoundStore((state) => state.increment)
    const decrement = useBoundStore((state) => state.decrement)
    const roleList = useBoundStore((state) => state.roleList)
    const addRoleList = useBoundStore((state) => state.addRoleList)
    const listData = useBoundStore((state) => state.listData)
    const getListData = useBoundStore((state) => state.getListData)
  */

  useEffect(() => {
    getListData(param)
  }, [getListData])

  useEffect(() => {
    message.info('用户在线数量改为: ' + count)
  }, [count])

  const handleClick1 = () => {
    increment(2)
  }
  const handleClick2 = () => {
    decrement(1)
  }
  const handleClick3 = () => {
    addRoleList({
      name: '测试角色 + ' + roleList.length
    })
  }
  const handleClick4 = () => {
    getListData(param)
  }

  return (
    <div>
      <Button type='primary' onClick={handleClick1}>
        用户在线数量 + 2
      </Button>
      <Button type='primary' onClick={handleClick2}>
        用户在线数量 - 1
      </Button>
      <Button type='primary' onClick={handleClick3}>
        添加一个角色
      </Button>
      <Button type='primary' onClick={handleClick4}>
        获取电影列表
      </Button>
      <p>
        用户在线数量: <Tag color='processing'>{count}</Tag>
      </p>
      角色列表:
      {roleList.map((item) => (
        <Tag key={nanoid()} color='processing'>
          {item.name}
        </Tag>
      ))}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {listData.map((val) => (
          <Image key={nanoid()} width={80} src={val.poster} />
        ))}
      </div>
    </div>
  )
}

export default ZustandChild1
