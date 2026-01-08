import CountUp from 'react-countup'
import { Icon } from '@iconify/react'

import { getReportData } from '@/api/home-screen'

interface CardDataProps {
  color: { end: string; start: string }
  icon: string
  key: string
  title: string
  unit: string
  value: number
}

function getGradientColor(color: CardDataProps['color']) {
  return `linear-gradient(to bottom right, ${color.start}, ${color.end})`
}

function useGetCardData() {
  const cardData: CardDataProps[] = [
    {
      color: {
        end: '#b955a4',
        start: '#ec4786'
      },
      icon: 'ant-design:bar-chart-outlined',
      key: 'codeLine',
      title: '访问量',
      unit: '',
      value: 9725
    },
    {
      color: {
        end: '#5144b4',
        start: '#865ec0'
      },
      icon: 'ant-design:money-collect-outlined',
      key: 'icafeCount',
      title: '成交额',
      unit: '$',
      value: 1026
    },
    {
      color: {
        end: '#719de3',
        start: '#56cdf3'
      },
      icon: 'carbon:document-download',
      key: 'projectNum',
      title: '下载量',
      unit: '',
      value: 970925
    },
    {
      color: {
        end: '#f68057',
        start: '#fcbc25'
      },
      icon: 'ant-design:trademark-circle-outlined',
      key: 'salary',
      title: '成交量',
      unit: '',
      value: 9527
    }
  ]

  return cardData
}

const CardItem = (data: CardDataProps) => {
  return (
    <Col key={data.key} lg={6} md={12} span={24}>
      <div
        className='flex-1 rd-8px px-16px pb-4px pt-8px text-white'
        style={{ backgroundImage: getGradientColor(data.color) }}>
        <h3 className='text-16px'>{data.title}</h3>
        <div className='flex justify-between pt-12px'>
          <Icon icon={data.icon} className='text-32px' />
          <CountUp
            className='text-30px text-white dark:text-dark'
            duration={1.5}
            end={data.value}
            prefix={data.unit}
            start={1}
          />
        </div>
      </div>
    </Col>
  )
}

const HomeScreenCard: React.FC = () => {
  const [data, setData] = useState(useGetCardData())

  const getReportData_ = async () => {
    try {
      const res: ReturnType<typeof getReportData> = getReportData()
      const result = await res
      if (result.code === 200) {
        setData(
          data.map((val: CardDataProps) => {
            return {
              ...val,
              value: result.data?.[val.key]
            }
          })
        )
      }
    } catch (error: any) {
      console.error(error)
    }
  }

  useEffect(() => {
    getReportData_()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card bordered className='card-wrapper'>
      <Row gutter={[16, 16]}>{data.map(CardItem)}</Row>
    </Card>
  )
}

export default HomeScreenCard
