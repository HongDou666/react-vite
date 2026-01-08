const ReactQuillComp: React.FC = () => {
  const [quillSimple, setQuillSimple] = useState('')
  const [quillFull, setQuillFull] = useState('')

  useEffect(() => {
    setTimeout(() => {
      const dataValue = `<h2><strong><em><u>react-quill</u></em> 富文本编辑器</strong></h2>`
      setQuillSimple(dataValue)
    }, 1000)
  }, [])

  return (
    <>
      <Card title='Editor Simple'>
        <QuillEditor id='sample-editor' sample value={quillSimple} onChange={setQuillSimple} />
      </Card>
      <div className='h-5' />
      <Card title='Editor Full'>
        <QuillEditor id='full-editor' value={quillFull} onChange={setQuillFull} />
      </Card>
    </>
  )
}

export default ReactQuillComp
