import { useQueries } from '@tanstack/react-query'

import { getStudents, postCacheData } from '@/api/mock/index'

const Details: React.FC = () => {
  const [timer, setTimer] = useState<number>(2000)
  const parkId = useRef<string>('180')

  /* useQueries 可以同时发起多个查询请求，并返回一个数组。每个查询请求的结果都可以通过数组的索引来访问 */
  const [{ data: value01 }, { data: value02 }] = useQueries({
    queries: [
      { queryKey: ['students-key', timer], queryFn: () => getStudents({ time: timer }) },
      { queryKey: ['cacheData-key'], queryFn: () => postCacheData({ parkId: parkId.current }) }
    ]
  })

  return (
    <Space direction='vertical'>
      {/* 此处更新 timer 只会 对 getStudents 重新发起请求 */}
      <Button type='primary' onClick={() => setTimer(timer + 1)}>
        更改 timer
      </Button>

      <Space>
        {value01?.data?.map((item) => (
          <Tag color='error' key={item.id}>
            {item.name}
          </Tag>
        ))}
      </Space>
      <Space>
        {value02?.data?.map((item) => (
          <Tag color='processing' key={item.id}>
            {item.name}
          </Tag>
        ))}
      </Space>
    </Space>
  )
}

export default Details
