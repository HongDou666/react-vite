import { useState } from 'react'
import classnames from 'classnames'

import ClassNameScss from './index.module.scss'

/*
  classnames 把多个className链接起来的工具
  参考文献 https://juejin.cn/post/7194289762209890361
*/

export default function ClassName() {
  const [presse] = useState(true)

  const btnClass = classnames(
    'foo',
    presse ? 'custom' : '',
    presse && 'title',
    [{ bar: true }],
    { footer: true },
    {
      customBtn: true,
      'btn-pressed': presse,
      'main-btn': !presse,
      [ClassNameScss.customBtn]: true
    }
  )

  return (
    <>
      <div className='class-name'>
        <div className={btnClass}>ClassName</div>
      </div>
    </>
  )
}
