import { useMatch, useParams } from 'react-router-dom'

const PageInfo = () => {
  const params = useParams()

  /* useMatch是 React Router v6 提供的一个钩子函数，用于检查当前的location（路由位置）是否匹配给定的路径模式。它返回一个匹配对象（如果匹配）或null（如果不匹配），这个匹配对象包含了有关匹配的详细信息，如匹配的参数等。 */
  const match = useMatch('/dashboard/pageInfo/:id/:title?')
  console.log('match', match)

  return (
    <div>
      PageInfo - {params.id} {params.title}
    </div>
  )
}

export default PageInfo
