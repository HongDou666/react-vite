import styled from 'styled-components'

import user from '@/assets/img/user.jpg'

export const CustomDiv = styled.div`
  width: ${(props) => props.width}px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #cccccc;
  border-radius: 10px;
  position: relative;
  background: url(${user}) no-repeat;
  background-size: contain;
  &&& {
    font-size: 20px;
    font-weight: 900;
    height: 150px;
  }
  > h2 {
    font-size: 20px;
    color: ${(props) => (props.$theme ? props.color : '#229999')};
  }
  &::before {
    content: '${(props) => props.$content}';
    display: inline-block;
    width: 40px;
    height: 40px;
    background-color: #f40;
    border-radius: ${(props) => props.$borderRadius};
    position: absolute;
    left: 5%;
    top: 5%;
    animation: move 2s linear forwards;
  }
  @keyframes move {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(150px);
    }
  }
`

export const CustomInput = styled.input.attrs((props) => ({
  placeholder: props.placeholder || '请输入',
  type: props.type || 'text'
}))`
  margin: 0px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border: 1px solid ${(props) => props.color};
  &:focus {
    outline-color: #42ffc9;
  }
  &::placeholder {
    font-size: 18px;
  }
`

export const HYButton = styled.button`
  padding: 16px 20px;
  border-radius: 5px;
`

export const HYWarnButton = styled(HYButton)`
  background: #a840ff;
  color: #fff;
`

export const HYPrimaryButton = styled(HYButton)`
  background: linear-gradient(135deg, #6253e1, #04befe);
  color: #fff;
`

export const ProfileWrapper = styled.div`
  color: ${(props) => props.theme.color};
  font-size: ${(props) => props.theme.fontSize};
  display: flex;
  flex-direction: column;
`
