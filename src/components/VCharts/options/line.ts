import { LineECOption } from '../types'

/* 折线图 默认配置 */
const options: LineECOption = {
  legend: {},
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: 10,
    right: 10,
    bottom: 10,
    top: 30,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: [],
    axisLabel: {
      color: '#7D8292'
    },
    axisLine: {
      lineStyle: {
        color: '#C8D0D7'
      }
    },
    axisTick: { alignWithLabel: false }
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        color: '#C8D0D7',
        type: 'dashed'
      }
    },
    axisLine: {}
  },
  series: []
}

export default options
