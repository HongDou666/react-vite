import loginLoader from './login'
// import { mockList } from '@/api/mock'

interface ListDataType {
  id: string
  name: string
  title: string
  address: string
  age: number
}

const loaderPageHomeB = async () => {
  /*
    注意报错: Uncaught ReferenceError: mockList is not defined
    原因分析: 因为此处是异步加载，所以此处并不能直接使用 mockList 方法
    所以此处需要动态导入，即:
     const { mockList } = await import('@/api/mock')
  */
  const { mockList } = await import('@/api/mock')

  try {
    let listData: ListDataType[] = []
    const param: Parameters<typeof mockList>[0] = { key: 'ZQC' }
    const result = await (mockList(param) as ReturnType<typeof mockList>)
    if (result.code === 200) {
      listData = result.data?.list || []
    }
    return {
      title: '首屏-pageHomeB',
      listData
    }
  } catch (error: any) {
    console.error(error) // 只是在控制台打印一条红色消息，并不影响程序的运行
    return {
      title: '首屏-pageHomeB',
      listData: []
    }
  }
}

export { loginLoader, loaderPageHomeB }
