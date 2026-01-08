import { BarECOption } from '../types'

/* 柱状图 默认配置 */
const options: BarECOption = {
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
    axisTick: { alignWithLabel: false },
    boundaryGap: true
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
