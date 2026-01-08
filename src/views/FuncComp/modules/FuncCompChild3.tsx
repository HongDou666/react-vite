const FuncCompChild3 = <T, U>(props: { dataArray: T[]; metaArray: U[] }): React.ReactElement => {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '10px'
      }}>
      <ul>
        {props.dataArray.map((item, index) => (
          <li key={index}>
            {JSON.stringify(item)} - {JSON.stringify(props.metaArray[index])}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FuncCompChild3
