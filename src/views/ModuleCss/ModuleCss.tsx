import './index.css'
import './index.scss'
import moduleCss from './index.module.css'
import moduleScss from './index.module.scss'

export default function ModuleCss() {
  return (
    <>
      {/* css样式引入 会产生样式冲突 */}
      <div className='custom_css'>
        custom_css
        <div className='container_css'>
          container_css
          <div className='main-css'>
            main-css
            <div className='sectionCss'>sectionCss</div>
          </div>
        </div>
      </div>
      <div className='container_css'>样式无效</div>

      <hr />

      {/* css样式引入 模块化 */}
      <div className={moduleCss.module_css}>
        module_css
        <div className={moduleCss.container_css}>
          container_css
          <div className={moduleCss['main-css']}>
            main-css
            <div className={moduleCss.sectionCss + ' ' + moduleCss.wrap}>sectionCss</div>
          </div>
        </div>
      </div>
      <div className={moduleCss.container_css}>样式无效</div>

      <hr />

      {/* scss样式引入 会产生样式冲突 */}
      <div className='custom_scss'>
        custom_scss
        <div className='container_scss'>
          container_scss
          <div className='main-scss'>
            main-scss
            <div className='sectionScss'>sectionScss</div>
          </div>
        </div>
      </div>
      <div className='container_scss'>样式无效</div>

      <hr />

      {/* scss样式引入 模块化 */}
      <div className={moduleScss.module_scss}>
        module_scss
        <div className={moduleScss.container_scss}>
          container_scss
          <div className={moduleScss['main-scss']}>
            main-scss
            <div className={`${moduleScss.sectionScss} ${moduleScss.wrap}`}>sectionScss wrap</div>
          </div>
        </div>
      </div>
      <div className={moduleScss.container_scss}>样式无效</div>
    </>
  )
}
