interface ListProps {
  value: number
  label: string
}

/*
  自定义 hooks
  1. 自定义 hooks 声名一个以use为起始值的函数
  2. 在函数体内封装可复用的逻辑，并返回给组件使用
  3. 在组件中用到的状态或者回调return出去 (以对象或数组)
  4. 在哪个组件中要用到这个逻辑，就执行这个函数，解构出来状态和回调进行使用
  5. 只能在组件中或者其他自定义Hook函数中调用
  6. 只能在组件的顶层调用，不能嵌套在 if、for、其他函数中
 */
export const useFilter = (value, list) => {
  return useMemo(() => {
    if (!value.trim()) return list
    return list.filter((item) => {
      return item.label.includes(value)
    })
  }, [value, list])
}

/* 自定义 hooks  */
export const useList = () => {
  const [list, setList] = useState<ListProps[]>([])
  useEffect(() => {
    const cityArr = [
      {
        value: 1,
        label: '澳大利亚'
      },
      {
        value: 2,
        label: '新西兰'
      },
      {
        value: 3,
        label: '加拿大'
      },
      {
        value: 4,
        label: '韩国'
      },
      {
        value: 5,
        label: '美国'
      },
      {
        value: 6,
        label: '英国'
      }
    ]
    setList(cityArr)
  }, [])

  return {
    list
  }
}
