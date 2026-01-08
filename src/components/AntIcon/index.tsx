import { createFromIconfontCN } from '@ant-design/icons'

const StaticIcon = import.meta.glob('/public/iconfont/index.ts', {
  eager: true
})

const IconFont = createFromIconfontCN({
  /* 1. 存储于本地资源 */
  scriptUrl: StaticIcon as unknown as string

  /* 2. 路径写法 */
  // scriptUrl: ['//at.alicdn.com/t/c/font_3607833_js1j9c3bixe.js', '//at.alicdn.com/t/c/font_4163379_e81ncc9mik.js']
})

interface PropsType {
  type: string
  [key: string]: any
}

const AntIcon: React.FC<PropsType> = ({ type = '', ...args }) => {
  return (
    <>
      <IconFont type={type} {...args} />
    </>
  )
}

export default AntIcon
