import ZustandChild1 from './modules/ZustandChild1'
import ZustandChild2 from './modules/ZustandChild2'

const Zustand: React.FC = () => {
  return (
    <div>
      <ZustandChild1></ZustandChild1>
      <hr />
      <ZustandChild2></ZustandChild2>
    </div>
  )
}

export default Zustand
