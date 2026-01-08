import { useParams } from 'react-router-dom'

const PageHandle = () => {
  const params = useParams()

  console.log(params)

  return (
    <div>
      PageHandle - {params.chapters} {params['*']}
    </div>
  )
}

export default PageHandle
