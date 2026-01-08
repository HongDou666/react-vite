import HomeScreenCard from './modules/HomeScreenCard'
import HomeScreenChart from './modules/HomeScreenChart'
import HomeScreenInfo from './modules/HomeScreenInfo'

const HomeScreen: React.FC = () => {
  return (
    <>
      <Space direction='vertical' className='flex'>
        <HomeScreenInfo></HomeScreenInfo>
        <HomeScreenCard></HomeScreenCard>
        <HomeScreenChart></HomeScreenChart>
      </Space>
    </>
  )
}

export default HomeScreen
