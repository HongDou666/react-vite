import { Icon } from '@iconify/react'

import Banner from '@/assets/svg/banner.svg?react'
import CustomIcon from '@/assets/svg/custom-icon.svg?react'
import VitePluginSvgIcon from '@/components/VitePluginSvgIcon'
import VitePluginSvgr from '@/components/VitePluginSvgr'

const SvgIcon: React.FC = () => {
  return (
    <div>
      <Card title='vite-plugin-svgr'>
        <Space>
          {/* 1. 直接使用 */}
          <CustomIcon style={{ width: 50, fill: 'chocolate' }} />
          <Banner style={{ width: 50, color: 'chocolate' }} />

          {/* 2. 封装组件使用 */}
          <VitePluginSvgr fullPath='network-error' width={50} height={50} />
          <VitePluginSvgr fullPath='service-error' width={50} height={50} />
        </Space>
      </Card>

      <Card title='vite-plugin-svg-icons'>
        <Space>
          {/* 1. 封装组件使用 */}
          <VitePluginSvgIcon name='custom-icon' width={50} height={50} fill='#646cff' />
          <VitePluginSvgIcon name='empty-data' width={50} height={50} />
          <VitePluginSvgIcon name='no-permission' width={50} height={50} />
          <VitePluginSvgIcon name='expectation' width={50} height={50} />
        </Space>
      </Card>

      <Card title='unplugin-icons'>
        <Space wrap>
          {/* 1. 图标网站集合: https://icones.js.org/ */}
          <IconMdiDrag style={{ width: 50, height: 50, color: '#646cff' }} />
          <IconMdiAbacus style={{ width: 50, height: 50, color: '#f2ff64' }} />
          <IconMdiAccountBox style={{ width: 50, height: 50, color: '#ffb464' }} />
          <IconIconoirDrag style={{ width: 50, height: 50, color: '#ff6471' }} />
          <IconDeviconAarch64 style={{ width: 50, height: 50 }} />
          <IconTokenBrandedAlex style={{ width: 50, height: 50 }} />
          <IconTokenBrandedAlpaca style={{ width: 50, height: 50 }} />

          {/* 1.1 用依赖 @iconify/react 可以借助属性展示svg */}
          <Icon icon={'token-branded:arv'} style={{ width: 50, height: 50 }} />
          <Icon icon={'token-branded:bcube'} style={{ width: 50, height: 50 }} />
          <Icon icon={'token-branded:bcat'} style={{ width: 50, height: 50 }} />

          {/* 2. 本地图标使用 <${Icon}${Local}${svg文件的名字} /> */}
          <IconLocalChrome style={{ width: 50, height: 50, color: '#64f5ff' }} />
          <IconLocalLoading style={{ width: 50, height: 50 }} />
          <IconLocalNoPermission style={{ width: 50, height: 50 }} />
        </Space>
      </Card>
    </div>
  )
}

export default SvgIcon
