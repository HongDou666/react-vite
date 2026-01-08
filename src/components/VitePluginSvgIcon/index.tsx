/*
  vite-plugin-svg-icons
  参考文献1: https://blog.csdn.net/u013190012/article/details/141719109
  参考文献2: https://blog.csdn.net/m0_67156290/article/details/136061914
  参考文献3: https://blog.csdn.net/Yt2399/article/details/134241676
*/

import { useMemo } from 'react'

interface PropsType {
  name: string
  fill?: string
  width?: number
  height?: number
}

const VitePluginSvgIcon: React.FC<PropsType> = ({ name, fill, width = 40, height = 40 }) => {
  const iconName = useMemo<string>(() => {
    return `#${import.meta.env.VITE_ICON_LOCAL_PREFIX}-${name}`
  }, [name])

  return (
    <svg style={{ width, height }}>
      <use href={iconName} fill={fill} />
    </svg>
  )
}

export default memo(VitePluginSvgIcon)
