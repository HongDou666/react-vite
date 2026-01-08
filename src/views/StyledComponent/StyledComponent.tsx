/*
  styled-components
  参考文献1: https://zhuanlan.zhihu.com/p/156806997
  参考文献2: https://juejin.cn/post/7088876240404217886
  参考文献3: https://segmentfault.com/a/1190000024474589
  参考文献4: https://blog.csdn.net/h1530687053/article/details/131658219
*/

import styled from 'styled-components'

import { CustomDiv, CustomInput, HYPrimaryButton, HYWarnButton, ProfileWrapper } from './style-dom'

const ShapingAssembly = ({ className }: { className: string }) => <div className={className}>塑造组件</div>

const StyleShapingAssembly = styled(ShapingAssembly)`
  width: 200px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #cccccc;
  color: #000;
  font-size: 24px;
`

export default function StyledComponent() {
  return (
    <>
      <ProfileWrapper theme={{ color: '#96ff61', fontSize: '18px' }}>
        {/* props属性 传参 */}
        <CustomDiv width={200} color='#f40' $theme={true} $borderRadius='50%' $content='zqc'>
          <h2>CustomDiv</h2>
        </CustomDiv>

        {/* 添加attrs属性 | 定义组件属性 */}
        <CustomInput placeholder='请输入地址' type='text' color='#f40' width={200} height={50}></CustomInput>

        {/* css继承 */}
        <HYWarnButton>HYWarnButton</HYWarnButton>
        <HYPrimaryButton>HYPrimaryButton</HYPrimaryButton>

        {/* 修改组件内部标签 */}
        <HYPrimaryButton as='main'>HYPrimaryButton</HYPrimaryButton>

        {/* 塑造组件 */}
        <StyleShapingAssembly></StyleShapingAssembly>
      </ProfileWrapper>
    </>
  )
}
