import { createSearchParams } from 'react-router-dom'

const PageShow = () => {
  const [search, setSearch] = useSearchParams()
  const id = search.get('id')
  const title = search.get('title')

  /* 获取当前路由信息 */
  const location = useLocation()
  console.log('useLocation', location)

  const searchParams = createSearchParams(location.search)
  console.log('id', searchParams.get('id'))
  console.log('title', searchParams.get('title'))

  const handleClick = () => {
    // setSearch('id=300&title=哈哈哈&content=嘻嘻嘻')
    setSearch({
      id: '300',
      title: '哈哈哈',
      content: '嘻嘻嘻'
    })
  }

  /*
    返回当前的导航类型（用户是如何来到当前页面的）
    POP：用户通过浏览器直接打开了这个路由组件（刷新页面）
    PUSH：用户通过链接或调用 history.push 方法来到当前页面
    REPLACE：用户通过调用 history.replace 方法来到当前页面
  */
  // console.log('useNavigationType', useNavigationType())

  return (
    <div>
      PageShow
      <Button type='primary' onClick={handleClick}>
        更新收到的search参数（相当于重新渲染组件）
      </Button>
      <p>消息编号：{id}</p>
      <p>消息标题：{title}</p>
    </div>
  )
}

export default PageShow
