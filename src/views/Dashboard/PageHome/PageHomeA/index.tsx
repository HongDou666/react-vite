import { Outlet } from 'react-router-dom'

import moduleScss from './index.module.scss'

const PageHomeA = () => {
  return (
    <div className={moduleScss['page-homeA']}>
      PageHomeA
      <Outlet />
    </div>
  )
}

export default PageHomeA
