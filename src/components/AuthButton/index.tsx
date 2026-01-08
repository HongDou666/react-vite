import { useRouteLoaderData } from 'react-router-dom'

interface useRouteLoaderDataType {
  menuList: any[]
  menuPathList: string[]
  buttonList: string[]
}

interface PropsType {
  auth?: string
  type?: 'primary' | 'dashed' | 'link' | 'text' | 'default'
  [key: string]: any
}

const AuthButton: React.FC<React.PropsWithChildren<PropsType>> = ({ auth = '', ...args }) => {
  const data = useRouteLoaderData('layout') as useRouteLoaderDataType
  const { buttonList } = data

  if (!auth || !buttonList.includes(auth)) return <></>

  return <Button {...args}>{args.children}</Button>
}

export default AuthButton
