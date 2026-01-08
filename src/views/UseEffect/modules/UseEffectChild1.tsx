/*
  useLayoutEffect 和 useEffect的区别
  参考文献1: https://zhuanlan.zhihu.com/p/348701319
  参考文献2: https://zhuanlan.zhihu.com/p/674771514
  参考文献3: https://blog.csdn.net/Constantiny/article/details/139013503

  useEffect：浏览器渲染完成后，用户看到新的渲染结果之后
  useLayoutEffectHook：完成了DOM改动，但还没有呈现给用户
  应该尽量使用useEffect，因为它不会导致渲染阻塞，如果出现了问题，再考虑使用useLayoutEffectHook

  应用场景:
    ● 需要同步读取或更改DOM：例如，你需要读取元素的大小或位置并在渲染前进行调整。
    ● 防止闪烁：在某些情况下，异步的useEffect可能会导致可见的布局跳动或闪烁。例如，动画的启动或某些可见的快速DOM更改。
    ● 模拟生命周期方法：如果你正在将旧的类组件迁移到功能组件，并需要模拟 componentDidMount、componentDidUpdate和componentWillUnmount的同步行为。
*/

import classnames from 'classnames'

import moduleScss from './index.module.scss'

const useEffectDemo: React.FC = () => {
  const [heightEffect, setHeightEffect] = useState<number>(0)
  const [heightLayoutEffect, setHeightLayoutEffect] = useState<number>(0)
  const refEffect = useRef<HTMLDivElement>(null)
  const refLayoutEffect = useRef<HTMLDivElement>(null)
  const [state, setState] = useState('😊😊😊😊😊😊😊😊😊😊😊') // 页面上会有笑脸icon一闪而过
  const [state1, setState1] = useState('😡😡😡😡😡😡😡😡😡😡😡')

  useEffect(() => {
    if (refEffect.current) {
      let i = 0
      while (i <= 100000000) {
        i++
      }
      setState('hello useEffect')
      setHeightEffect(refEffect.current.offsetHeight)
    }
  }, [])

  useLayoutEffect(() => {
    if (refLayoutEffect.current) {
      let i = 0
      while (i <= 100000000) {
        i++
      }
      setState1('hello useLayoutEffect')
      setHeightLayoutEffect(refLayoutEffect.current.offsetHeight)
    }
  }, [])

  return (
    <div>
      <div>
        <b>使用 useEffect ~~~</b>
        <div>{state}</div>
        <div ref={refEffect} style={{ width: '200px', height: '50px', background: 'lightgray' }}>
          这是一个方块
        </div>
        <div style={{ width: '200px', height: `${heightEffect}px`, background: '#ff7a7a', marginTop: '10px' }}>
          红色方块
        </div>
      </div>

      <div style={{ marginTop: '15px' }}>
        <b>使用 useLayoutEffect ~~~</b>
        <div>{state1}</div>
        <div ref={refLayoutEffect} style={{ width: '200px', height: '50px', background: 'lightgray' }}>
          这是一个方块
        </div>
        <div style={{ width: '200px', height: `${heightLayoutEffect}px`, background: '#8c8cff', marginTop: '10px' }}>
          蓝色方块
        </div>
      </div>
    </div>
  )
}

const useEffectDemo2: React.FC = () => {
  const refDom01 = useRef<HTMLDivElement>(null)
  const refDom02 = useRef<HTMLDivElement>(null)

  /* 不阻塞DOM 可以看到动画效果 */
  useEffect(() => {
    refDom01.current!.style.transition = 'opacity 5s'
    refDom01.current!.style.opacity = '1'
  }, [])

  /* 阻塞DOM 不可以看到动画效果 */
  useLayoutEffect(() => {
    refDom02.current!.style.transition = 'opacity 5s'
    refDom02.current!.style.opacity = '1'
  }, [])

  return (
    <div className={moduleScss.useEffectDemo2}>
      <div
        ref={refDom01}
        className={classnames('flex-center', moduleScss.element)}
        style={{
          background: 'var(--color-custom1)',
          opacity: '0'
        }}>
        元素01
      </div>
      <div
        ref={refDom02}
        className={classnames('flex-center', moduleScss.element)}
        style={{
          background: 'var(--color-custom2)',
          opacity: '0'
        }}>
        元素02
      </div>
    </div>
  )
}

const useEffectDemo3: React.FC = () => {
  const refDom = useRef<HTMLDivElement>(null)

  const srollHandler = (e: React.UIEvent<HTMLDivElement>) => {
    const scrolltop = e.currentTarget.scrollTop
    window.history.replaceState(null, '', `?top=${scrolltop}`)
  }

  useLayoutEffect(() => {
    const top = window.location.search.split('=')[1]
    top && refDom.current?.scrollTo(0, +top)
  }, [])

  return (
    <div
      ref={refDom}
      style={{
        height: '300px',
        overflowY: 'auto',
        border: '1px solid #f40'
      }}
      onScroll={srollHandler}>
      {Array(150)
        .fill(0)
        .map((_, index) => {
          return (
            <Tag style={{ display: 'block' }} key={index}>
              {index}
            </Tag>
          )
        })}
    </div>
  )
}

export default { useEffectDemo, useEffectDemo2, useEffectDemo3 }
