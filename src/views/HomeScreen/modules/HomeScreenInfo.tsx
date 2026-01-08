import type { DescriptionsProps } from 'antd'

import avatar from '@/assets/img/soybean.jpg'
import useBoundStore from '@/zustand'

interface StatisticData {
  id: number
  title: string
  value: string
}
const statisticData: StatisticData[] = [
  {
    id: 0,
    title: '项目数',
    value: '25'
  },
  {
    id: 1,
    title: '待办',
    value: '4/16'
  },
  {
    id: 2,
    title: '消息',
    value: '12'
  }
]

const HomeScreenInfo: React.FC = () => {
  const userInfo = useBoundStore((state) => state.userInfo)
  const [listData, setListData] = useState<DescriptionsProps['items']>([
    {
      key: 'userId',
      label: '用户ID',
      children: 'Zhou Maomao'
    },
    {
      key: 'userEmail',
      label: '邮箱',
      children: '1810000000'
    },
    {
      key: 'state',
      label: '状态',
      children: 'Hangzhou, Zhejiang'
    },
    {
      key: 'mobile',
      label: '手机号',
      children: 'empty'
    },
    {
      key: 'job',
      label: '岗位',
      children: 'No. 18, Wantang Road'
    },
    {
      key: 'deptName',
      label: '部门',
      children: 'Xihu District, Hangzhou, Zhejiang, China'
    }
  ])

  useEffect(() => {
    userInfo._id &&
      setListData(
        listData?.map((item) => {
          const key = item.key as string
          let children = ''
          if (key === 'state') {
            children = userInfo?.[key] === 1 ? '在职' : userInfo?.[key] === 2 ? '实习' : '离职'
          } else {
            children = userInfo?.[key]
          }
          return {
            ...item,
            children
          }
        })
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo])

  return (
    <Space direction='vertical' className='flex'>
      <Card bordered className='card-wrapper'>
        <Row gutter={[16, 16]}>
          <Col md={18} span={24}>
            <div className='flex-y-center'>
              <div className='size-72px shrink-0 overflow-hidden rd-1/2'>
                <img className='size-full' src={avatar} />
              </div>
              <div className='pl-12px'>
                <h3 className='text-18px font-semibold'>早安, 晚风, 今天又是充满活力的一天!</h3>
                <p className='text-#999 leading-30px'>今日多云转晴，20℃ - 25℃!</p>
              </div>
            </div>
          </Col>

          <Col md={6} span={24}>
            <Space className='w-full justify-end' size={24}>
              {statisticData.map((item) => (
                <Statistic className='whitespace-nowrap' key={item.id} {...item} />
              ))}
            </Space>
          </Col>
        </Row>
      </Card>
      <Card bordered className='card-wrapper'>
        <Row gutter={[16, 16]}>
          <Col md={3} span={24}>
            <div className='size-68px overflow-hidden b-rd-50%'>
              <img className='size-full object-cover' src={avatar} />
            </div>
          </Col>
          <Col md={21} span={24}>
            <div className=''>
              <Descriptions title='嵌入式开发工程师' items={listData} />
            </div>
          </Col>
        </Row>
      </Card>
    </Space>
  )
}

export default HomeScreenInfo
