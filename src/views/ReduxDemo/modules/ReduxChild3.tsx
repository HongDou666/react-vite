import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { Image } from 'antd'
import { nanoid } from 'nanoid'

import { ADD_CITY, GETCINEMALIST } from '@/store/constant'

const ReduxChild3: React.FC = () => {
  const pageNum = useRef(0)
  const dispatch = useDispatch()
  const { cityList, name, sagaCinemaList } = useSelector(
    (state: Record<'persons', any>) => {
      return {
        sagaCinemaList: state.persons.sagaCinemaList || [],
        ...(state.persons.cityInfo || {})
      }
      /*
      return {
        name: state.persons.cityInfo?.name || '',
        cityList: state.persons.cityInfo?.cityList || []
      }
      */
    },
    /*
      默认是深层比较
      shallowEqual 浅层对比
    */
    shallowEqual
    /* 自定义判断 刷新 或者 不刷新 */
    /*
      (oldValue, newValue) => {
        // false 更新; true 不更新
        const keysA = Object.keys(oldValue.cityList)
        const keysB = Object.keys(newValue.cityList)
        console.log(keysA, keysB)
        if (keysA.length === keysB.length) return true
        return false
      }
    */
  )

  // 刷新电影列表 redux-saga
  const handleCinemaList = () => {
    pageNum.current++
    dispatch({
      type: GETCINEMALIST,
      current: pageNum.current
    })
  }
  const handleAddCity = () => {
    dispatch({
      type: ADD_CITY,
      data: {
        title: '高新区-' + cityList.length
      }
    })
  }

  return (
    <div
      style={{
        border: '5px solid #00cddabd',
        padding: '10px'
      }}>
      <Button type='primary' onClick={handleAddCity}>
        添加城市
      </Button>
      <Button type='primary' style={{ margin: '0 5px' }} onClick={handleCinemaList}>
        刷新电影列表 redux-saga
      </Button>

      <br />

      <span>{name}: </span>
      {cityList.map((item) => (
        <Tag key={nanoid()} color='processing'>
          {item.title}
        </Tag>
      ))}

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {sagaCinemaList.map((item, index) => (
          <Image key={index} width={80} src={item.poster} />
        ))}
      </div>
    </div>
  )
}

export default ReduxChild3

/*
  export default connect((state: Record<string, any>) => {
    return {
      cityList: [...state.persons.cityInfo?.cityList] || []
    }
  }, {})(ReduxChild3)
*/
