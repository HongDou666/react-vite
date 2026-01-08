import ReactDraftWysiwyg from '@/components/ReactDraftWysiwyg'

const DraftWysiwyg: React.FC = () => {
  const [value, setValue] = useState('')
  const content = useRef<string>()

  const handleChange = (str: string) => {
    console.log('str', str)
    content.current = str
  }

  useEffect(() => {
    setTimeout(() => {
      const value = `<p><span style="color: rgb(44,130,201);font-size: 24px;"><strong>2024年12月7号😎</strong></span></p>`
      setValue(value)
      content.current = value
    }, 1000)
  }, [])

  return (
    <div>
      <ReactDraftWysiwyg modelValue={value} handleChange={handleChange} />
    </div>
  )
}

export default DraftWysiwyg
