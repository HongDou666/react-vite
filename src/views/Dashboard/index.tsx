import classnames from 'classnames'

import { useHistory } from '../UseSyncExternalStore/hooks/useHistory'

import moduleScss from './index.module.scss'

const Dashboard = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [url, push, replace] = useHistory()

  /* 用于判断当前组件是否处于 路由router 的上下文当中 (被 BrowserRouter 包裹) */
  const inRouterContext = useInRouterContext()
  // console.log('inRouterContext', inRouterContext)

  /* 用来呈现当前组件中渲染的嵌套路由 如果嵌套路由没有挂载，则为 null; 如果已经挂载，则为展示嵌套的路由对象 */
  const outlet = useOutlet()
  // console.log('outlet', outlet)

  /* 给定一个URL值 解析其中的: path search hash值 */
  const resolvedPath = useResolvedPath('/user?id=001&name=tom#qwe')
  // console.log('resolvedPath', resolvedPath)

  const paramsClass = classnames({
    [moduleScss.pushBtn]: true,
    [moduleScss.active]: pathname.includes('pageInfo') || false
  })
  const searchClass = classnames({
    [moduleScss.pushBtn]: true,
    [moduleScss.active]: pathname.includes('pageShow') || false
  })
  const stateClass = classnames({
    [moduleScss.pushBtn]: true,
    [moduleScss.active]: pathname.includes('pageHomeB') || false
  })

  const paramsInfo = useMemo(
    () => ({
      id: 100,
      title: 'pageInfo (params 参数)'
    }),
    []
  )
  const searchInfo = useMemo(
    () => ({
      id: 200,
      title: 'pageShow (search 参数)'
    }),
    []
  )
  const stateInfo = useMemo(
    () => ({
      id: 300,
      title: 'pageHomeB (state 参数)'
    }),
    []
  )

  const handleToState = () => {
    navigate('/dashboard/pageHome/pageHomeB', {
      replace: false,
      state: {
        id: stateInfo.id,
        title: stateInfo.title
      }
    })
  }
  const handleToParams = () => {
    navigate(`/dashboard/pageInfo/${paramsInfo.id}/${paramsInfo.title}`, {
      replace: false
    })
  }
  const handleToSearch = () => {
    navigate(`/dashboard/pageShow?id=${searchInfo.id}&title=${searchInfo.title}`, {
      replace: false
    })
    // navigate({
    //   pathname: '/dashboard/pageShow',
    //   search: `id=${searchInfo.id}&title=${searchInfo.title}`,
    //   replace: false
    // })
  }
  const back = () => {
    navigate(-1)
  }
  const forward = () => {
    navigate(1)
  }

  return (
    <div className={moduleScss.dashboard}>
      <main>Dashboard</main>

      <Alert
        message={url}
        type='success'
        description={
          <div>
            <Button
              onClick={() => {
                push('/dashboard/pageAbout/2578/admin')
              }}>
              push pageAbout
            </Button>
            <Button
              onClick={() => {
                replace('/dashboard/pageHandle/users/100/200')
              }}>
              replace pageHandle
            </Button>
          </div>
        }
      />

      {/* Link 声明式导航 */}
      <div className={paramsClass}>
        <Link to={`/dashboard/pageInfo/${paramsInfo.id}/${paramsInfo.title}`}>{paramsInfo.title}</Link>
      </div>
      <div className={searchClass}>
        {/* 方式1  */}
        {/* <Link to={`/dashboard/pageShow?id=${searchInfo.id}&title=${searchInfo.title}`}>{searchInfo.title}</Link> */}

        {/* 方式2 */}
        <Link
          to={{
            pathname: '/dashboard/pageShow',
            search: `id=${searchInfo.id}&title=${searchInfo.title}`
          }}
          replace={false}>
          {searchInfo.title}
        </Link>
      </div>
      <div className={stateClass}>
        <Link
          to={`/dashboard/pageHome/pageHomeB`}
          state={{
            id: stateInfo.id,
            title: stateInfo.title
          }}>
          {stateInfo.title}
        </Link>
      </div>

      <br></br>

      {/* 编程式导航 */}
      <Button onClick={handleToParams}>编程式导航 (params 参数)</Button>
      <Button onClick={handleToSearch}>编程式导航 (search 参数)</Button>
      <Button onClick={handleToState}>编程式导航 (state 参数)</Button>
      <Button type='primary' onClick={back}>
        ←导航后退
      </Button>
      <Button type='primary' onClick={forward}>
        导航前进→
      </Button>

      {/* 写法1: 指定路由组件的展示位置 */}
      {/* <Outlet /> */}

      {/* 写法2: 指定路由组件的展示位置 */}
      {outlet}
    </div>
  )
}

export default Dashboard
