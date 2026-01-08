interface PropsType {
  to: string
  replace?: boolean
}

const Redirect: React.FC<PropsType> = (props) => {
  const { to, replace } = props
  const navigate = useNavigate()

  useEffect(() => {
    navigate(to, {
      replace: replace || false
    })
  })
  return null
}

export default Redirect
