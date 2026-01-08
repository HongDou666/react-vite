import { useQuery } from '@tanstack/react-query'

import { getStudents } from '@/api/mock/index'
import { StudentsResponseType } from '@/api/mock/type'
import Spin from '@/assets/svg/spin.svg'
import { ResponseBody } from '@/http/type'
import { queryClient } from '@/service'

/* min - max 随机整数 */
const randomNum = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const ErrorIndicator = ({ error }: { error: Error }) => (
  <div className='error'>
    <strong>Error: {error.message}</strong>
  </div>
)

export const BusySign = () => <img src={Spin} className='logo w-30px fill-amber' alt='Busy' />

export const StatusIndicator = ({
  isLoading,
  isFetching,
  isRefetching
}: {
  isLoading: boolean
  isFetching: boolean
  isRefetching: boolean
}) => (
  <div>
    {!!isLoading && <h4>初始加载 isLoading...</h4>}
    {!!isRefetching && <h4>正在重新请求数据 isRefetching...</h4>}
    {!!isFetching && (
      <div>
        <h4>正在请求数据 isFetching...</h4>
        <BusySign />
      </div>
    )}
  </div>
)

const Query: React.FC = () => {
  const timer = useRef<number>(1000)
  const [num, setNum] = useState<number>(1)
  const [sum, setSum] = useState<number>(100)
  const [equipment, setEquipment] = useState({ id: 100 })

  /*
    isLoading : 初始加载 (只有第一次请求才会有这个状态)
    isFetching : 正在请求数据
    isRefetching : 正在重新请求数据 (只有第二次和之后的请求才会有这个状态)
    refetch : 强制刷新数据
    isError : 是否请求错误
    error : 错误信息
    data : 请求成功数据
  */
  const { data, isError, error, refetch, isLoading, isFetching, isRefetching } = useQuery<
    ResponseBody<StudentsResponseType[]>
  >({
    /* queryKey 是一个数组，用于标识查询的唯一标识符; num equipment 发生变化就会重新发起网络请求 但是num equipment 需要是 useState 定义 */
    queryKey: ['query-key', num, equipment],
    /* 查询函数，返回一个 Promise */
    queryFn: ({ queryKey }) => {
      // console.log(queryKey) [('query-key', 1, { id: 100 })]
      return getStudents({
        time: timer.current,
        key: String(Date.now()),
        equipment: equipment.id
      })
    },
    /* 请求错误时 重试次数; false 禁止重试 true 重试无限次直到成功 */
    retry: 2,
    /* 控制是否启用查询 (默认为 true) 只有当 timer 为有效值时，才会发起请求 */
    enabled: !!timer.current,
    /* 
      保持新鲜度 3s 后过期 (3s后数据还在缓存中 但变为 stale 陈旧状态); 3s以内不会再发起网络请求 除非手动强制刷新 请求完成后开始计时(计时时间不会因为组件销毁而被打断) 
      注意: 首次页面加载完成 直接切换到 Queries tab 然后在3s内切换回来 是不会触发重新请求的 因为数据还是 fresh新鲜状态
    */
    staleTime: 3000,
    /* 垃圾回收时间 当组件销毁5s之后 就会清空缓存数据 */
    gcTime: 5000
  })

  const setRefetch = () => {
    timer.current = randomNum(900, 904) // 这里加不加无所谓 都会重新发起网络请求
    /**
     * 强制刷新数据 不管数据是不是 fresh，不管 staleTime (适合用户主动刷新)
     */
    refetch()
  }

  const setRefetchQueries = () => {
    timer.current = randomNum(900, 904) // 这里加不加无所谓 都会重新发起网络请求
    /**
     * 找到所有 key 匹配 ['query-key'] 的 query,立刻重新发请求（强制刷新）
     * refetchQueries = 立刻强制重新请求某些 query, 不管缓存是否过期
     */
    queryClient.refetchQueries({ queryKey: ['query-key'] })
  }

  const setInvalidateQueries = () => {
    /* 说明:
      invalidateQueries = 标记某个 query 为 stale（过期），并让它触发重新 fetch
      invalidateQueries = 我知道数据可能变脏了，请把它重新拉一遍
      它不会直接删除缓存，只是把缓存标记为 stale（脏），然后
        1. 正在被组件使用 → 自动重新 fetch
        2. 没有组件在用 → 下次使用时再 fetch
      示例: 官方推荐的写法 (意思就是: 当信息更新成功后，让列表接口 + 当前文章详情接口都重新获取一次)
      const mutation = useMutation({
        mutationFn: updatePost,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['posts'] });
          queryClient.invalidateQueries({ queryKey: ['post', postId] });
        },
      });
    */
    queryClient.invalidateQueries({
      queryKey: ['query-key'] // 刷新所有包含某个前缀的 queries 这里所指的是的前缀是 'query-key'
      /* 说明:
        refetchType: 'none' | 'all' | 'active' 控制失效后是否自动重新获取数据
        刷新时不立即 refetch, 只是把缓存标记为 stale（脏）, 下次使用时再 fetch 发起请求
      */
      // refetchType: 'none' 这里先注释
    })
  }

  const setDepend = () => {
    /**
     * 因为 依赖了 num 和 equipment 所以当他们任意一个发生变化都会导致重新发起网络请求
     * 1. setNum(num + 1)
     * 2. setEquipment({ id: equipment.id + 1 })
     *
     * 因为 上面的 useQuery 没有依赖 sum 所以改变 sum 不会导致重新发起网络请求
     * setSum((prev) => prev + 1)
     */
    setEquipment({ id: equipment.id + 1 })
  }

  return (
    <>
      <Space direction='vertical'>
        <Button type='primary' onClick={() => setRefetch()}>
          refetch-强制刷新
        </Button>
        <Button type='primary' onClick={() => setRefetchQueries()}>
          refetchQueries-强制刷新
        </Button>
        <Button type='primary' onClick={() => setInvalidateQueries()}>
          invalidateQueries-刷新
        </Button>
        <Button type='primary' onClick={setDepend}>
          依赖数据发生变化导致刷新
        </Button>
      </Space>

      {isError ? (
        <ErrorIndicator {...{ error }} />
      ) : (
        <List
          loading={isFetching}
          grid={{ gutter: 16, column: 3 }}
          dataSource={data?.data || []}
          renderItem={(item) => (
            <List.Item>
              <Card title={item.id}>{item.name}</Card>
            </List.Item>
          )}
        />
      )}
      <StatusIndicator {...{ isLoading, isFetching, isRefetching }} />
    </>
  )
}

export default Query
