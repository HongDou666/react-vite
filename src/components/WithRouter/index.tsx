import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'

const WithRouter = (Component) => {
  return function WithRouterWrapper(props) {
    const params = useParams()
    const location = useLocation()
    const [search, setSearch] = useSearchParams()
    const navigate = useNavigate()

    return (
      <Component
        {...props}
        params={params}
        location={location}
        searchParams={{ search, setSearch }}
        navigate={navigate}
      />
    )
  }
}

export default WithRouter
