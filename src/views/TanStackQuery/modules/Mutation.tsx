import { useMutation, useQuery } from '@tanstack/react-query'
import type { FormProps } from 'antd'
import { Image } from 'antd'

import { getMaizuo, postCacheData } from '@/api/mock'
import { MaizuoResponseType, PostCacheDataResponseType, StudentsResponseType } from '@/api/mock/type'
import { ResponseBody } from '@/http/type'
import { queryClient } from '@/service'

import { params } from '../TanStackQuery'

interface FieldType {
  parkId?: string
}

const Mutation: React.FC = () => {
  const [form] = Form.useForm()

  /**
   * 在10s内 无论多少次切换到当前的tab 都不会发起请求 因为一开始就 queryClient.prefetchQuery 把数据加载进缓存了, 过了10s后 再切换就会重新发起请求 之后的10s内 无论多少次切换到当前的tab 又不会发起请求
   */
  const { data } = useQuery({
    queryKey: ['prefetchQuery-key'],
    queryFn: () => getMaizuo(params.node, params.config),
    staleTime: 10000
  })

  const setEnsureQueryData = async () => {
    /*
      ❗ensureQueryData 的 staleTime 只在「缓存第一次创建」时生效
          之后不会更新、不会覆盖、不会改变已有缓存的 staleTime！
      🧨**只要缓存已经存在，那么 ensureQueryData 就永远不会发请求（除非你 invalidateQueries / removeQueries）
          哪怕你 staleTime 写成 1ms、0ms、1ns，都一样不会重新请求！**
          解决: await queryClient.invalidateQueries({ queryKey: ['prefetchQuery-key'] })
    */
    const data = await queryClient.ensureQueryData({
      queryKey: ['prefetchQuery-key'],
      queryFn: () => getMaizuo(params.node, params.config)
    })
    console.log(data)
  }

  /*
   isPending : 是否正在请求中
   mutate : 发起请求
  */
  const { mutate, mutateAsync, isPending } = useMutation<ResponseBody<PostCacheDataResponseType[]>, Error, FieldType>({
    /* 这里的参数data 就是 mutateAsync(values) 中的values参数  */
    mutationFn: (data: FieldType) => postCacheData(data),
    /* 只有mutationFn执行成功才会调用这个 */
    onSuccess: (value) => {
      if (value.code === 200) {
        form.resetFields()
      }
    },
    /* 只有mutationFn执行失败才会调用这个 */
    onError: (error) => {
      console.log('error', error)
    },
    /* 不管mutationFn执行成功还是失败，都会调用这个 */
    onSettled: (data, error, variables, context) => {
      console.log('onSettled', data)
    }
  })

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    /* 发起请求，但不等待结果 (同步调用) */
    // mutate(values)

    /* 
      发起请求，并等待结果 (异步调用)
      finally: 无论请求成功还是失败，都会执行 finally 里面的回调
      const res = await mutateAsync(values).finally(() => {
        console.log('请求结束')
      })
     */
    const res = await mutateAsync(values).finally(message.loading('数据上传中...'))
  }

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <>
      <Form
        name='basic'
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Form.Item<FieldType>
          label='园区Id'
          name='parkId'
          rules={[{ required: true, message: 'Please input your parkId!' }]}>
          <Input />
        </Form.Item>

        <Form.Item label={null}>
          <Button type='primary' htmlType='submit' loading={isPending}>
            Submit
          </Button>
        </Form.Item>
      </Form>

      <Button type='primary' onClick={setEnsureQueryData}>
        ensureQueryData-获取数据
      </Button>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {data?.data?.films.map((item: any) => (
          <Image key={item.filmId} width={80} height={120} src={item.poster} />
        ))}
      </div>
    </>
  )
}

export default Mutation
