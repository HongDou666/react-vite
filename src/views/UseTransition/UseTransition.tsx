/*
  useTransition:
    useTransition 是 React 18 中引入的一个 Hook，用于管理 UI 中的过渡状态，特别是在处理长时间运行的状态更新时。它允许你将某些更新标记为“过渡”状态，这样 React 可以优先处理更重要的更新，比如用户输入，同时延迟处理过渡更新; 这在渲染大量数据、进行复杂运算或处理长时间任务时特别有效
    (不适合文本框的输入，因为输入框的即时性很重要，不适合延迟处理)

  useDeferredValue:
    useDeferredValue 用于延迟某些状态的更新，直到主渲染任务完成。这对于高频更新的内容（如输入框、滚动等）非常有用，可以让 UI 更加流畅，避免由于频繁更新而导致的性能问题。
    注意: useDeferredValue 并不是防抖,防抖是需要一个固定的延迟时间，譬如1秒后再处理某些行为，但是useDeferredValue并不是一个固定的延迟，它会根据用户设备的情况进行延迟，当设备情况好，那么延迟几乎是无感知的，但是如果设备情况不好，那么延迟就会更长。

  useTransition 和 useDeferredValue 的区别:
    useTransition 和 useDeferredValue 都涉及延迟更新，但它们关注的重点和用途略有不同：
    ● useTransition主要关注点是状态的过渡。它允许开发者控制某个更新的延迟更新，还提供了过渡标识，让开发者能够添加过渡反馈。
    ● useDeferredValue主要关注点是单个值的延迟更新。它允许你把特定状态的更新标记为低优先级。
*/
import type { GetProps } from 'antd'
import { debounce } from 'lodash-es'
import mockjs from 'mockjs'

import { mockList } from '@/api/mock/index'

interface listItemType {
  id: string
  name: string
  title: string
  address: string
  age: number
}
type SearchProps = GetProps<typeof Input.Search>

const { Search } = Input

const UseTransition: React.FC = () => {
  const [isPending, startTransition] = useTransition()
  const [inputValue, setInputValue] = useState('晚风')
  const [filterValue, setFilterValue] = useState('')
  const [list, setList] = useState<listItemType[]>(() => {
    return mockjs.mock({
      'list|2000': [
        {
          id: '@id', // Mock.js 生成的唯一 ID
          // @cword(2, 4) 随机生成 2 到 4 个汉字的标题
          title: inputValue,
          name: '@cname', // 随机生成一个中文姓名
          address: '@county(true)', // 随机生成一个真实的省市区地址，true 表示返回详细地址
          age: '@integer(18, 60)' // 随机生成 18 到 60 岁之间的年龄
        }
      ]
    }).list
  })
  const deferedQuery = useDeferredValue(filterValue)
  console.log('deferedQuery:', deferedQuery, '=====', 'filterValue:', filterValue)

  /* 过滤值和延迟后的值是否相同 */
  const isSame = deferedQuery !== filterValue

  /* 过滤列表数据 */
  const findNameList = useMemo(() => {
    console.log('过滤列表数据')
    return list.filter((item) => item.age.toString().includes(deferedQuery))
  }, [deferedQuery, list])

  /* 获取列表数据 + 防抖 */
  const getList = useRef(
    debounce(async (value) => {
      try {
        const param: Parameters<typeof mockList>[0] = { key: value }
        const result = await (mockList(param) as ReturnType<typeof mockList>)
        if (result.code === 200) {
          startTransition(() => {
            setList(result.data?.list || [])
          })
        } else {
          setList([])
        }
      } catch (error: any) {
        console.error(error) // 只是在控制台打印一条红色消息，并不影响程序的运行
      }
    }, 300)
  ).current

  const onSearch: SearchProps['onSearch'] = async (value, _e, info) => {
    if (!value) {
      setList([])
      return
    }
    getList(value)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
  }

  return (
    <div>
      <Space wrap>
        <Search
          placeholder='请输入搜索内容'
          value={inputValue}
          onSearch={onSearch}
          onChange={handleChange}
          style={{ width: 300 }}
        />
        <Input
          placeholder='输入年龄过滤列表数据'
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
        {isPending && <div>loading...</div>}
      </Space>

      <List
        bordered
        style={{
          maxHeight: 400,
          overflow: 'auto',
          opacity: isSame ? 0.5 : 1,
          transition: 'opacity 0.5s ease-in-out'
        }}
        dataSource={findNameList}
        renderItem={(item) => (
          <List.Item>
            <Tag color='#55acee'>{item.name}</Tag>
            <Tag color='#55acee'>{item.age}</Tag>
            <Tag color='#55acee'>{item.title}</Tag>
            {item.address}
          </List.Item>
        )}
      />
    </div>
  )
}

export default UseTransition
