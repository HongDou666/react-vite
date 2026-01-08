import { getPieAgeData, getPieCityData, getRadarData } from '@/api/home-screen'
import Echart from '@/components/VCharts'
import { useEcharts } from '@/hooks/common/echarts'
import type { PieECOption, RadarECOption } from '@/hooks/common/type'

import { UseChartDataLine } from '../hooks/line'

const HomeScreenChart: React.FC = () => {
  const optionsPie = useRef<PieECOption>({
    tooltip: { trigger: 'item' },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        data: []
      }
    ]
  })
  const optionsRadar = useRef<RadarECOption>({
    title: {
      text: '基础雷达图'
    },
    tooltip: {},
    radar: {
      indicator: []
    },
    series: [
      {
        name: '预算 vs 开销（Budget vs spending）',
        type: 'radar',
        data: []
      }
    ]
  })
  const { domRef: domRef_01, updateOptions: updateOptions_01 } = useEcharts(
    (() => optionsPie.current) as () => PieECOption
  )
  const { domRef: domRef_02, updateOptions: updateOptions_02 } = useEcharts(
    (() => optionsPie.current) as () => PieECOption
  )
  const { domRef: domRef_03, updateOptions: updateOptions_03 } = useEcharts(
    (() => optionsRadar.current) as () => RadarECOption
  )
  const { optionsLine, getData: getDataLine } = UseChartDataLine()

  const getLineData_ = () => {
    getDataLine()
  }
  const getPieCityData_ = async () => {
    try {
      const res: ReturnType<typeof getPieAgeData> = getPieAgeData()
      const result = await res
      if (result.code === 200) {
        const { data } = result
        const optionData: PieECOption = {
          legend: {
            type: 'scroll',
            orient: 'vertical',
            right: '0%',
            top: '0%'
          },
          series: [
            {
              name: 'Nightingale Chart',
              type: 'pie',
              radius: ['0%', '70%'],
              center: ['40%', '50%'],
              roseType: 'area',
              itemStyle: { borderRadius: 2 },
              labelLine: {
                length: 2,
                length2: 3
              },
              data
            }
          ]
        }
        updateOptions_02((opts) => {
          return Object.assign(opts, optionData)
        })
      }
    } catch (error: any) {
      console.error(error)
    }
  }
  const getRadarData_ = async () => {
    try {
      const res: ReturnType<typeof getRadarData> = getRadarData()
      const result = await res
      if (result.code === 200) {
        const { data } = result
        const optionData: RadarECOption = {
          legend: {
            data: ['程序员技术分析模型'],
            type: 'scroll',
            orient: 'vertical',
            right: '0%',
            top: '0%'
          },
          radar: {
            indicator: data!.indicator
          },
          series: [
            {
              name: '模型诊断',
              type: 'radar',
              data: data!.data
            }
          ]
        }
        updateOptions_03((opts) => {
          return Object.assign(opts, optionData)
        })
      }
    } catch (error: any) {
      console.error(error)
    }
  }
  const handleRefresh = (type) => {
    if (type === '2') {
      getPieAgeData_()
    } else if (type === '3') {
      getPieCityData_()
    } else if (type === '4') {
      getRadarData_()
    }
  }
  const Refresh = (props) => {
    return (
      <Tooltip title='刷新'>
        <IconTokenBrandedAsia className='size-30px flex cursor-pointer' onClick={() => handleRefresh(props.type)} />
      </Tooltip>
    )
  }
  const getPieAgeData_ = async () => {
    try {
      const res: ReturnType<typeof getPieCityData> = getPieCityData()
      const result = await res
      if (result.code === 200) {
        const { data } = result
        const optionData: PieECOption = {
          legend: {
            type: 'scroll',
            top: '0%',
            right: '0%'
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: ['40%', '70%'],
              center: ['50%', '58%'],
              avoidLabelOverlap: false,
              padAngle: 5,
              itemStyle: { borderRadius: 10 },
              label: { show: false, position: 'center' },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 30,
                  fontWeight: 'bold'
                }
              },
              labelLine: { show: false },
              data
            }
          ]
        }
        updateOptions_01((opts) => {
          return Object.assign(opts, optionData)
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getLineData_()
    getPieAgeData_()
    getPieCityData_()
    getRadarData_()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Space direction='vertical' className='flex'>
        <Card bordered className='card-wrapper' title='消费统计' extra={<Refresh type='1' />}>
          <div className='h-300px'>
            <Echart type='line' options={optionsLine} />
          </div>
        </Card>
        <Row gutter={[8, 8]}>
          <Col span={12}>
            <Card bordered className='card-wrapper' title='兴趣' extra={<Refresh type='2' />}>
              <div className='h-300px overflow-hidden' ref={domRef_01} />
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered className='card-wrapper' title='爱好' extra={<Refresh type='3' />}>
              <div className='h-300px overflow-hidden' ref={domRef_02} />
            </Card>
          </Col>
        </Row>
        <Card bordered className='card-wrapper' title='待开发' extra={<Refresh type='4' />}>
          <div className='h-300px overflow-hidden' ref={domRef_03} />
        </Card>
      </Space>
    </>
  )
}

export default HomeScreenChart
