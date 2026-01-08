import { useLoaderData, useLocation, useOutletContext, useRouteLoaderData } from 'react-router-dom'

import { usePageHome } from '../index'

import moduleScss from './index.module.scss'

interface LoaderDataType {
  title?: string
}

const PageHomeB = () => {
  /* 1. const { count, setCount } = useOutletContext() */
  /* 2. const { count, setCount } = usePageHome() */
  const { count, setCount } = usePageHome()

  const {
    state: { id, title }
  } = useLocation()

  /* 使用 useLoaderData 获取当前路由的加载数据 也就是 loader 函数返回的数据 */
  const loaderData = useLoaderData() as LoaderDataType
  console.log({ loaderData })

  /* 使用 useRouteLoaderData 获取 (父路由 | 祖路由) 的加载数据，传入父路由的 id（即 'pageHome'） */
  // const pageRoute = useRouteLoaderData('dashboard')
  const pageRoute: LoaderDataType = useRouteLoaderData('pageHome') || {}
  // console.log({ pageRoute })

  return (
    <div className={moduleScss['page-homeB']}>
      {loaderData.title} : id = {id} title = {title}
      <br />
      父路由: {pageRoute.title}
      <br />
      <Button
        type='primary'
        onClick={() => {
          setCount(count + 1)
        }}>
        改变 count 数据
      </Button>
      <br />
      父路由传递的数据:
      <Tag color='processing'>{count}</Tag>
    </div>
  )
}

export default PageHomeB
