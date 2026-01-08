import { useParams } from 'react-router-dom'

const PageDetail = () => {
  const params = useParams()

  return (
    <div>
      PageDetail - {params.id} {params.title}
    </div>
  )
}

export default PageDetail
