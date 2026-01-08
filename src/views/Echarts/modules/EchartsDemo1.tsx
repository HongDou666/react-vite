import Echart from '@/components/VCharts'

import { UseChartDataBar } from '../hooks/bar'
import { UseChartDataLine } from '../hooks/line'

const EchartsDemo1: React.FC = () => {
  const chartBar = useRef<echarts.ECharts | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>()
  const [show, setShow] = useState(true)
  const { options: optionsBar, getData: getDataBar, ...argsBar } = UseChartDataBar(chartBar)
  const { options: optionsLine, getData: getDataLine } = UseChartDataLine()

  const initBar = () => {
    const params = { parkId: 100 }
    getDataBar(params)
  }
  const initLine = () => {
    const params = { parkId: 150 }
    getDataLine(params)
  }
  /* 刷新柱状图 */
  const handleRefresh = () => {
    /* 取消柱子图形轮询高亮 */
    timer.current && clearInterval(timer.current)
    timer.current = null

    const params = { parkId: 200 }
    getDataBar(params)
  }
  /* 自定义事件 */
  const customEvent = (chart) => {
    chartBar.current = chart

    chart?.getZr()?.on('click', function (event) {
      /* 取消柱子图形轮询高亮 */
      timer.current && clearInterval(timer.current)
      timer.current = null

      /* 没有 target 意味着鼠标/指针不在任何一个图形元素上，它是从“空白处”触发的 */
      if (!event.target) {
        /* 点击空白处 */
        console.log('点击在空白处')
      }
    })
  }
  /* 柱子图形轮询高亮  */
  const handleAction = () => {
    let currentIndex = -1
    const dataLen = (optionsBar as any)?.xAxis?.data.length
    timer.current = setInterval(() => {
      /* 取消之前高亮的图形 */
      chartBar?.current?.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndex % dataLen
      })
      currentIndex++
      /* 高亮当前图形 */
      chartBar?.current?.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: currentIndex % dataLen
      })
      /* 显示 tooltip */
      chartBar?.current?.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: currentIndex % dataLen
      })
    }, 500)
  }

  useEffect(() => {
    initBar()
    initLine()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  console.log('render')

  return (
    <div>
      <Button type='primary' onClick={handleRefresh}>
        刷新柱状图
      </Button>
      <Button type='primary' onClick={handleAction}>
        开始轮询柱状图
      </Button>
      <div style={{ height: 300, margin: '10px 0' }}>
        <Echart type='bar' options={optionsBar} customEvent={customEvent} {...argsBar} />
      </div>

      <Button
        type='primary'
        onClick={() => {
          setShow(!show)
        }}>
        显示/隐藏 折线图
      </Button>
      <div style={{ height: 300, margin: '10px 0' }}>
        {show && (
          <div style={{ height: '100%' }}>
            <Echart type='line' options={optionsLine} />
          </div>
        )}
      </div>
    </div>
  )
}

export default EchartsDemo1
