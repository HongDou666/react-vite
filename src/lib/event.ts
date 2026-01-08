const EVENT_TYPE = ['click']

/**
 * 合成事件对象类
 */
class SyntheticEvent {
  nativeEvent: Event
  _stopPropagation: boolean

  constructor(e) {
    // 保存原生的事件对象
    this.nativeEvent = e
    // 初始化阻止冒泡的标志位
    this._stopPropagation = false
  }

  // 合成事件对象需要提供一个和原生 DOM 同名的阻止冒泡的方法
  stopPropagation() {
    // 当开发者调用 stopPropagation 方法，将该合成事件对象的 _stopPropagation 设置为 true
    this._stopPropagation = true
    if (this.nativeEvent.stopPropagation) {
      // 调用原生事件对象的 stopPropagation 方法来阻止冒泡
      this.nativeEvent.stopPropagation()
    }
  }
}

/**
 *
 * @param {*} e 原生的事件对象
 * @param {*} type 事件类型，已经全部转为了大写，比如这里传递过来的是 CLICK
 */
const dispatchEvent = (e, type) => {
  // 实例化一个合成事件对象
  const se = new SyntheticEvent(e)
  // 拿到触发事件的元素，这里的 ele 就是触发事件的 DOM 元素
  const ele = e.target

  let fiber
  // 通过 DOM 元素找到对应的 FiberNode
  for (const prop in ele) {
    if (prop.toLocaleLowerCase().includes('fiber')) {
      fiber = ele[prop]
    }
  }
  // 找到对应的 fiberNode 之后，接下来我们需要收集路径中该事件类型所对应的所有的回调函数
  const paths = collectPaths(type, fiber)

  // 模拟捕获的实现
  triggerEventFlow(paths, type + 'CAPTURE', se)
  // 模拟冒泡的实现
  // 首先需要判断是否阻止了冒泡，如果没有，那么我们只需要将 paths 进行反向再遍历执行一次即可
  if (!se._stopPropagation) {
    triggerEventFlow(paths.reverse(), type, se)
  }
}

/**
 *
 * @param {*} paths 收集到的事件回调函数的数组
 * @param {*} type 事件类型
 * @param {*} se 合成事件对象
 */
const triggerEventFlow = (paths, type, se) => {
  // 挨着挨着遍历这个数组，执行回调函数即可
  // 模拟捕获阶段的实现，所以需要从后往前遍历数组并执行回调
  for (let i = paths.length; i--; ) {
    const pathNode = paths[i]
    const callback = pathNode[type]
    if (callback) {
      // 存在回调函数，执行回调函数时，将合成事件对象作为参数传递进去
      callback.call(null, se)
    }
    if (se._stopPropagation) {
      // 说明在当前的事件回调函数中，开发者阻止继续往上冒泡
      break
    }
  }
}

/**
 * 该方法用于收集路径中所有 type 类型的事件回调函数
 * @param {*} type 事件类型
 * @param {*} begin FiberNode
 * @returns
 * [{ CLICK : function(){...} },{ CLICK : function(){...} }]
 */
const collectPaths = (type, begin) => {
  const paths: { [key: string]: () => void }[] = [] // 存放收集到所有的事件回调函数

  // 如果不是 HostRootFiber，就一直往上遍历
  while (begin.tag !== 3) {
    const { memoizedProps, tag } = begin

    // 如果 tag 对应的值为 5，说明是 DOM 元素对应的 FiberNode
    if (tag === 5) {
      const eventName = 'bind' + type // bindCLICK
      // 接下来我们来看当前的节点是否有绑定事件
      if (memoizedProps && Object.keys(memoizedProps).includes(eventName)) {
        // 如果进入该 if，说明当前这个节点绑定了对应类型的事件
        // 需要进行收集，收集到 paths 数组里面
        const pathNode = {}
        pathNode[type] = memoizedProps[eventName]
        paths.push(pathNode)
      }
    }
    begin = begin.return // ✅ 每一轮都向上
  }
  return paths
}

/**
 * 该方法用于给根元素绑定事件
 * @param {*} container 根元素
 * @param {*} type 事件类型
 */
export const addEvent = (container, type: string) => {
  container.addEventListener(type, (e) => {
    // 进行事件的派发
    dispatchEvent(e, type.toUpperCase())
  })
}

/**
 * 该方法用于给根元素绑定合成事件
 * @param container
 */
export const syntheticEventListener = (container) => {
  EVENT_TYPE.forEach((type) => {
    addEvent(container, type)
  })
}
