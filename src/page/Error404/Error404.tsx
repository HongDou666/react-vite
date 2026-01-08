import { useRouteError } from 'react-router-dom'

import noPage from '@/assets/img/404.png'

function Error404() {
  const error = useRouteError()
  console.log('error', error)

  return (
    <div>
      <img src={noPage} alt='' />
    </div>
  )
}

export default Error404
