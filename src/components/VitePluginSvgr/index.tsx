/*
  vite-plugin-svgr svg图标组件使用
  参考文献1: https://juejin.cn/post/7352075763834339366
  参考文献2: https://blog.csdn.net/gitblog_00712/article/details/141045605
  参考文献3: https://blog.csdn.net/gitblog_00800/article/details/144416394
  参考文献4: https://inhami.com/blogdetail/174
*/

import DefaultSvg from '@/assets/svg/default.svg?react'

interface PropsType {
  fullPath: string
  width?: number
  height?: number
  fill?: string
  color?: string
  defaultSvg?: boolean
}

const VitePluginSvgr: React.FC<PropsType> = ({
  fullPath,
  width,
  height,
  fill = '#777d74',
  color,
  defaultSvg = false
}) => {
  const [svgComponent, setSvgComponent] = useState(null)

  /* svg 宽高背景色 */
  const iconOption = useMemo(
    () => ({
      width: width ?? 40,
      height: height ?? width ?? 40,
      fill,
      color
    }),
    [color, fill, height, width]
  )

  /* 动态获取svg图标 */
  const getSvg = useCallback(
    async (path) => {
      const svg = await import(`@/assets/svg/${path}.svg?react`)
      setSvgComponent(svg.default(iconOption))
    },
    [iconOption]
  )

  useEffect(() => {
    getSvg(fullPath)
  }, [fullPath, getSvg])

  return <>{svgComponent ? svgComponent : defaultSvg ? <DefaultSvg {...iconOption} /> : null}</>
}

export default memo(VitePluginSvgr)
