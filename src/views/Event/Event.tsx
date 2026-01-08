/* eslint-disable react/no-unknown-property */
import classnames from 'classnames'

import style from './index.module.scss'

const Event: React.FC = () => {
  const flexCenterClass = 'flex items-center text-20px font-500'

  const handleDiv = (e) => {
    console.log('div click')
  }
  const handleSection = (e: React.MouseEvent) => {
    console.log(e)
    e.stopPropagation() // 阻止事件冒泡
    console.log('section click')
  }
  const handleMain = () => {
    console.log('main click')
  }

  return (
    <>
      {/* @ts-expect-error experimental synthetic event */}
      <main className={classnames(style.main, 'h-500px', flexCenterClass)} bindCLICK={handleMain}>
        main
        {/* @ts-expect-error experimental synthetic event */}
        <section className={classnames(style.section, 'h-360px w-80%', flexCenterClass)} bindCLICK={handleSection}>
          section
          {/* @ts-expect-error experimental synthetic event */}
          <div className={classnames(style.div, 'h-200px w-80%', flexCenterClass)} bindCLICK={handleDiv}>
            div
          </div>
        </section>
      </main>
    </>
  )
}

export default Event
