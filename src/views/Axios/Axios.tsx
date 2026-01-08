import { Image } from 'antd'

import { getMaizuo, getStudents } from '@/api/mock/index'
import { cancelToken } from '@/http/request'

interface cancelTokenSource {
  cancel: (value?: string) => void
  token: any
}
interface ControllerType {
  [key: string]: AbortController | cancelTokenSource // 其他属性，定义变量可忽略
}

const Axios = () => {
  useEffect(() => {
    console.log('render')

    /* 此处的网络请求只会调用一次 */
    getMaizuoList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [maizuoList, setMaizuoList] = useState<any[]>([])

  /* 声明请求中止控制器 */
  const [controller, setController] = useState<ControllerType>({})

  /* 设置网络请求的时长 */
  const [time, setTime] = useState(2)

  const [cancelTokenrRequest, setCancelTokenrRequest] = useState<ControllerType>({})

  /* 真实数据请求（AbortController 终止网络请求）*/
  const getStudentsInfo = async () => {
    try {
      const param: Parameters<typeof getStudents>[0] = {
        time: 500 * time
      }
      /* 生成一个随机数(时间戳)，作为请求中止的key */
      const key = Date.now().toString()

      /* 实验前提: 注释掉 setTime(time + 1) 防止此行代码触发渲染机制 干扰判断 */

      /*
        先把 new AbortController() 赋予 controller[key], 此行代码不是异步操作, 如果紧接着下一行打印 controller[key], 就会拿到 controller[key] （但此时不会触发页面更新）
        后续需要用到setController(controller)来更新视图, 页面理应会更新 (但是已经查验 页面不会更新 请看下面注意文案)
        在此基础之上如果紧接着下一行打印 controller[key] 按理说不应该能拿到 controller[key] 因为setController(controller)是异步操作
        但是打印却能拿到 controller[key] , 是因为在 setController(controller) 之前已经改变了 controller => controller[key] = new AbortController()

        注意: 在 React 中，直接修改controller[key]然后调用setController(controller)不会触发视图更新，这是因为 React 的状态更新机制是基于不可变数据的
        当你直接修改controller对象的属性（像controller[key] = new AbortController()这样），React 无法检测到这个对象的引用是否发生了改变，它仍然认为状态是旧的，所以不会触发重新渲染
        */
      // controller[key] = new AbortController()
      // console.log('controller[key]', controller[key])
      // setController(controller)

      /* 如果只执行这行代码 紧接着打印 controller[key] 是拿不到值的 因为此行代码是异步操作 */
      // setController({ ...controller, [key]: 22 })
      // console.log('controller', controller[key])

      /* 正确做法 */
      const newController = { ...controller }
      newController[key] = new AbortController()
      setController(newController)

      const config = {
        /* 添加请求中止标识 */
        // signal: (controller[key] as AbortController).signal,
        signal: (newController[key] as AbortController).signal, // 用 newController 来取值
        /* 在请求头中额外加一些参数配置 */
        headers: {
          zqc: '2024/04/13'
        }
      }
      const res: ReturnType<typeof getStudents> = getStudents(param, config)
      const result = await res
      console.log('getStudents', result)
    } catch (error: any) {
      // 捕获错误代码
      console.error(error) // 只是在控制台打印一条红色消息，并不影响程序的运行
      throw new Error(error) // 语句会在在控制台打印错误信息并停止程序的运行；
    } finally {
      // 无论try和catch的结果如何，都正常执行的代码
    }
  }

  /* 终止网络请求; 技术方案: Axios 支持以 fetch API 方式—— AbortController 取消请求 */
  const handleAbortController = () => {
    if (Object.keys(controller).length) {
      /* 终止之前未完成的所有网络请求 */
      for (const key in controller) {
        ;(controller[key] as AbortController)?.abort()
      }
      setController({})
    }
  }

  /*
  真实数据请求（CancelToken 终止网络请求）
  前提！！！: 需要把 request 文件请求拦截器成功处理的方法中 注释掉 关于 config.cancelToken = 的相关代码
*/
  const getRequest = async () => {
    /*
      提示与注意事项
        确保在组件卸载时取消请求，以免造成内存泄漏
        取消标记只能取消尚未完成的请求，无法取消已经完成的请求
        取消标记只能在特定的请求上使用一次，一旦使用过，就需要重新创建
    */
    const key = Date.now().toString()
    cancelTokenrRequest[key] = cancelToken.source()
    setCancelTokenrRequest(cancelTokenrRequest)
    try {
      const param: Parameters<typeof getStudents>[0] = {
        time: 500 * time
      }
      const config = {
        cancelToken: (cancelTokenrRequest[key] as cancelTokenSource).token
      }
      const res: ReturnType<typeof getStudents> = getStudents(param, config)
      const result = await res
      console.log('getStudents', result)
    } catch (error: any) {
      // 捕获错误代码
      console.error(error) // 只是在控制台打印一条红色消息，并不影响程序的运行
      throw new Error(error) // 语句会在在控制台打印错误信息并停止程序的运行；
    } finally {
      // 无论try和catch的结果如何，都正常执行的代码
    }
  }

  /* 终止网络请求 => 技术方案: CancelToken */
  const handleCancelToken = () => {
    if (Object.keys(cancelTokenrRequest).length) {
      /* 终止之前未完成的所有网络请求 */
      for (const key in cancelTokenrRequest) {
        ;(cancelTokenrRequest[key] as cancelTokenSource)?.cancel('手动取消网络请求')
      }
    }
    setCancelTokenrRequest({})
  }

  const handleSendRequest = (str: string) => {
    if (str === 'signal') {
      getStudentsInfo()
    } else if (str === 'cancelToken') {
      getRequest()
    }
    setTime(time + 1)
  }

  const getMaizuoList = async () => {
    try {
      const param: Parameters<typeof getMaizuo>[0] = {
        cityId: 440300,
        pageNum: 1,
        pageSize: 10,
        type: 1,
        k: 320674
      }
      const config = {
        headers: {
          'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.2.1","e":"173223556337542309134337","bc":"440300"}',
          'X-Host': 'mall.film-ticket.film.list'
        }
      }
      const res: ReturnType<typeof getMaizuo> = getMaizuo(param, config)
      const result = await res
      setMaizuoList(result.data?.films || [])
    } catch (error: any) {
      console.error(error) // 只是在控制台打印一条红色消息，并不影响程序的运行
      throw new Error(error) // 语句会在在控制台打印错误信息并停止程序的运行；
    } finally {
      // 无论try和catch的结果如何，都正常执行的代码
    }
  }

  return (
    <>
      <div>
        <Button type='primary' onClick={() => handleSendRequest('signal')}>
          以代理形式向服务器1发起请求（携带signal）
        </Button>
        <Button type='primary' onClick={handleAbortController}>
          AbortController 终止未完成的网络请求
        </Button>

        <Button type='primary' onClick={() => handleSendRequest('cancelToken')}>
          以代理形式向服务器1发起请求（携带cancelToken）
        </Button>
        <Button type='primary' onClick={handleCancelToken}>
          CancelToken 终止未完成的网络请求
        </Button>

        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {maizuoList.map((val, index) => {
            return <Image key={index} width={100} src={val.poster} />
          })}
        </div>
      </div>
    </>
  )
}

export default Axios
