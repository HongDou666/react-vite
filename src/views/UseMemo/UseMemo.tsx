/*
  useMemo (记忆组件)
  useCallback 的功能完全可以由 useMemo 所取代，如果你想通过使用 useMemo 返回一个记忆函数也是完全可以的
  唯一的区别是：useCallback 不会执行第一个参数函数，而是将它返回给你，而 useMemo 会执行第一个函数并且将函数执行结果返回给你; 所以 useCallback 常用记忆事件函数，生成记忆后的事件函数并传递给子组件使用。而 useMemo 更适合经过函数计算得到一个确定的值，比如记忆组件。
*/

import { useFilter, useList } from './hooks/index'

type ChildPropsType = { value: number; label: string }

const Child: React.FC<ChildPropsType> = (props) => {
  console.log('Child组件 执行render渲染')
  return (
    <>
      <Tag key={props.value} color='#55acee'>
        {props.label}
      </Tag>
    </>
  )
}

const UseMemo: React.FC = () => {
  const [value, setValue] = useState('')

  /* 自定义 hooks */
  const { list } = useList()

  /* 缓存返回结果 相当于计算属性 */
  const getList = useMemo(() => {
    if (!value.trim()) return list
    return list.filter((item) => {
      return item.label.includes(value)
    })
  }, [list, value])

  /* 自定义 hooks */
  const getList1 = useFilter(value, list)

  /*
    使用了 useMemo来缓存 Child组件的列表，所以当输入框的值变化导致父组件重新渲染时，Child组件不会重新渲染
    由于返回的是​​相同的 React 元素引用​​，React 的 diff 算法认为没有变化，不会重新渲染 Child组件 (如果React元素本身的引用没有发生变化，一定不会重新渲染) 都不会重新生成新的虚拟DOM 所以也没有新旧虚拟树对比 因为他都不走render函数
  */
  const getList2 = useMemo(() => {
    return list.map((item) => {
      return <Child key={item.value} value={item.value} label={item.label + ' - useMemo'} />
    })
  }, [list])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return (
    <div>
      <Input placeholder='搜索国家' onChange={(e) => handleChange(e)} value={value} />
      {getList.map((item) => {
        return (
          <Tag key={item.value} color='#55acee'>
            {item.label}
          </Tag>
        )
      })}
      <br />
      {getList1.map((item) => {
        return (
          <Tag key={item.value} color='#55acee'>
            {item.label}
          </Tag>
        )
      })}
      <br />
      {getList2}
    </div>
  )
}

export default UseMemo
