import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { TwitterOutlined } from '@ant-design/icons'
import { Image } from 'antd'
import { nanoid } from 'nanoid'

import { useAppSelector } from '@/hooks/business/useStore'
import { addCacheRoutes, setCinemaListAsync } from '@/store-rtk/modules/asyncThunk'
import {
  fetchCinemaList,
  getCinemaListAsync,
  getCinemaListAsyncV2,
  getOfficialPos,
  regionListInfo,
  setAddAssignRegionList,
  setAddCountValue,
  setAddRegionList,
  setLowerLevel,
  setSubCountValue
} from '@/store-rtk/modules/widgetStore'

import { useAllState, useOfficialPos } from '../hooks'

const ReduxChild4: React.FC = () => {
  const dispatch = useDispatch()
  const { countValue, regionList, name, cinemaList, cinemaListV2, cacheRoutes } = useSelector(
    (state: Record<'widget' | 'asyncThunk', any>) => {
      return {
        countValue: state.widget.countValue,
        regionList: state.widget.regionList || [],
        name: state.widget.officialPos.lowerLevel.lowerLevel.name || '',
        cinemaList: state.widget.cinemaList || [],
        cinemaListV2: state.asyncThunk.cinemaList || [],
        cacheRoutes: state.asyncThunk.cacheRoutes || []
      }
    },
    /*
      默认是深层比较
      shallowEqual 浅层对比
    */
    shallowEqual
  )
  const officialPos = useOfficialPos()
  const { item: itemList } = useAppSelector(regionListInfo)
  const isSuper = useAppSelector(getOfficialPos)
  const useAllStateData = useAllState()
  const paramsData = useRef({
    node: {
      cityId: 440300,
      pageNum: 1,
      pageSize: 6,
      type: 1,
      k: 320674
    },
    config: {
      headers: {
        'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.2.1","e":"173223556337542309134337","bc":"440300"}',
        'X-Host': 'mall.film-ticket.film.list'
      }
    }
  })

  const handleAdd = () => {
    dispatch(setAddCountValue(5))
  }
  const handleSub = () => {
    dispatch(setSubCountValue(2))
  }
  const handleAddCity = () => {
    const value = {
      name: '苏州',
      id: 3,
      children: [
        { name: '姑苏区', id: 50 },
        { name: '虎丘区', id: 60 }
      ]
    }
    dispatch(setAddRegionList(value))
  }
  const handleAddAssignCity = () => {
    const value = { name: '东城', id: 25 }
    dispatch(setAddAssignRegionList(value))
  }
  const handleChange = () => {
    dispatch(setLowerLevel('学生'))
  }
  const handleRefresh = () => {
    paramsData.current.node.pageNum++
    dispatch(fetchCinemaList(paramsData.current) as any)
  }
  const handleRefreshThunk = () => {
    paramsData.current.node.pageNum--
    // 方式1: 异步获取电影列表 - createAsyncThunk 方式1
    // dispatch(getCinemaListAsync(paramsData.current) as any)

    // 方式2: 异步获取电影列表 - createAsyncThunk 方式2
    dispatch(getCinemaListAsyncV2(paramsData.current) as any)
  }
  const handleAsyncThunk = () => {
    paramsData.current.node.pageNum++
    const data = { ...paramsData.current, cityId: 110100, k: 9012208 }
    dispatch(setCinemaListAsync(data) as any)
  }

  useEffect(() => {
    dispatch(fetchCinemaList(paramsData.current) as any)
    dispatch(addCacheRoutes('齐齐哈尔'))
  }, [dispatch])

  // console.log('render')

  return (
    <div className='flex-col gap-10px'>
      <Card title='Dome1'>
        <Button style={{ margin: '0 10px' }} type='primary' onClick={handleAdd}>
          加 +5
        </Button>
        <Button style={{ margin: '0 10px' }} type='primary' onClick={handleSub}>
          减 -2
        </Button>
        <h1>当前 countValue 为: {countValue}</h1>
      </Card>

      <Card title='Dome2'>
        <Button style={{ margin: '0 10px' }} type='primary' onClick={handleAddCity}>
          添加一个地区
        </Button>
        <Button style={{ margin: '0 10px' }} type='primary' onClick={handleAddAssignCity}>
          在北京添加一个城市
        </Button>
        {regionList.map((item) => (
          <div key={nanoid()}>
            <Tag icon={<TwitterOutlined />} color='#55acee'>
              {item.name}
            </Tag>
            {item.children?.map((val) => (
              <Tag key={nanoid()} color='processing'>
                {val.name}
              </Tag>
            ))}
          </div>
        ))}
      </Card>

      <Card title='Dome3'>
        <Button style={{ margin: '0 10px' }} type='primary' onClick={handleChange}>
          更换最低级别名称
        </Button>
        <div>
          最低级别名称：<Tag color='processing'>{name}</Tag>
        </div>
      </Card>

      <Card title='Dome4'>
        <Button style={{ margin: '0 10px' }} type='primary' onClick={handleRefresh}>
          刷新电影列表-redux-thunk
        </Button>
        <Button style={{ margin: '0 10px' }} type='primary' onClick={handleRefreshThunk}>
          刷新电影列表-createAsyncThunk
        </Button>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {cinemaList.map((item) => (
            <Image key={nanoid()} width={80} height={120} src={item.poster} />
          ))}
        </div>
      </Card>

      <Card title='Dome4.1'>
        <Space className='flex'>
          {cacheRoutes.map((item) => (
            <Tag key={item} color='#55acee'>
              {item}
            </Tag>
          ))}
        </Space>
        <Button style={{ margin: '0 10px' }} type='primary' onClick={handleAsyncThunk}>
          刷新电影列表-asyncThunk
        </Button>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {cinemaListV2.map((item) => (
            <Image key={nanoid()} width={80} height={120} src={item.poster} />
          ))}
        </div>
      </Card>

      <Card title='Dome5'>
        <Space className='flex'>
          <Tag color='#55acee'>{officialPos.name}</Tag>
          <Tag color='#55acee'>{officialPos.lowerLevel.name}</Tag>
          <Tag color='#55acee'>{officialPos.lowerLevel.lowerLevel.name}</Tag>
        </Space>

        <Space className='flex'>
          <Tag color='#55acee'>{isSuper.name}</Tag>
          <Tag color='#55acee'>{isSuper.lowerLevel.name}</Tag>
          <Tag color='#55acee'>{isSuper.lowerLevel.lowerLevel.name}</Tag>
        </Space>

        <Space className='flex'>
          {itemList.children?.map((val) => (
            <Tag key={nanoid()} color='processing'>
              {val.name}
            </Tag>
          ))}
        </Space>

        <Space className='flex'>
          {useAllStateData.item.children?.map((val) => (
            <Tag key={nanoid()} color='processing'>
              {val.name}
            </Tag>
          ))}
        </Space>
      </Card>
    </div>
  )
}

export default ReduxChild4
