import { useParams } from 'react-router-dom'

const PageAbout = () => {
  const params = useParams()

  return <div>PageAbout - {params['*'] || '--'}</div>
}

export default PageAbout
