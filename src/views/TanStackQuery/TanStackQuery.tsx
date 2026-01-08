/*
  TanStack Query 是一个为 React 设计的异步数据管理库，自动处理数据获取、缓存、后台同步及状态更新，简化复杂数据逻辑，提升应用性能与用户体验
  官网: https://tanstack.com/query/v4/docs/framework/react/overview
  中文官网: https://cangsdarm.github.io/react-query-web-i18n/react/
  B站: https://www.bilibili.com/video/BV1jt421c7SJ?spm_id_from=333.788.player.switch&vd_source=198d028efb35a492ad1ef26d97bd85e8

  参考文献1 : https://juejin.cn/post/7195540736908394556
*/

import type { TabsProps } from 'antd'

import { getMaizuo, postCacheData } from '@/api/mock'
import { queryClient } from '@/service'

import Mutation from './modules/Mutation'
import Queries from './modules/Queries'
import Query from './modules/Query'

export const params = {
  node: {
    cityId: 440300,
    pageNum: 1,
    pageSize: 10,
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
const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Query'
  },
  {
    key: '2',
    label: 'Queries'
  },
  {
    key: '3',
    label: 'Mutation'
  }
]

const TanStackQuery: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('1')

  useEffect(() => {
    /*
      prefetchQuery 的作用是：提前把数据加载进缓存，让下一个页面立即使用，不再发请求
      提前拿数据备用，不一定要用，不影响主流程
      prefetchQuery 不会返回最终数据
      prefetchQuery = 提前准备吃的，可能旧也可能新，只是你先准备好
      等切换到 Mutation Tab 的时候 可以直接用缓存的数据，而不需要等待请求完成 (因为数据已经在缓存中了)
    */
    queryClient.prefetchQuery({
      queryKey: ['prefetchQuery-key'],
      queryFn: () => getMaizuo(params.node, params.config)
    })
  }, [])

  const onChange = (key: string) => {
    setActiveKey(key)
  }

  return (
    <>
      <Tabs activeKey={activeKey} items={items} onChange={onChange} />
      {activeKey === '1' ? <Query /> : activeKey === '2' ? <Queries /> : <Mutation />}
    </>
  )
}

export default TanStackQuery
