/* 如果使用 TypeScript 来编写 React 应用，为了对 props 进行准确的类型定义，同时妥善处理 children 这个特殊的属性，就可以利用 React.PropsWithChildren 类型。它本质上是一个泛型类型，会自动把 children 属性合并到你自定义的 props 类型中，确保类型安全以及方便在组件内部使用 children 进行渲染等操作 */

interface MyComponentProps {
  title: string
  count?: number
}

const FuncCompChild2: React.FC<React.PropsWithChildren<MyComponentProps>> = ({ title = '触电', ...props }) => {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '10px'
      }}>
      <p>{title}</p>
      <p>{props.count}</p>
    </div>
  )
}

export default FuncCompChild2
