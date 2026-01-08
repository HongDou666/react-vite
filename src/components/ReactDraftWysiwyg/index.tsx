import { Editor } from 'react-draft-wysiwyg'
import { ContentState, convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { debounce } from 'lodash-es'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import moduleScss from './index.module.scss'

interface PropsType {
  modelValue: string
  handleChange: (value: string) => void
}

const { TextArea } = Input

const ReactDraftWysiwyg: React.FC<PropsType> = ({ modelValue = '', handleChange }) => {
  const [readOnly, setReadOnly] = useState(false)
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  /* 实时向外输出内容 & useRef + 防抖 */
  const sendValue = useRef(
    debounce((value) => {
      const content = draftToHtml(convertToRaw(value?.getCurrentContent()))
      handleChange((content.trim() && content) || '')
    }, 300)
  ).current

  useEffect(() => {
    if (!modelValue.trim()) return
    /* 默认赋予初始值 */
    const str = htmlToDraft(modelValue)
    if (str) {
      const contentState = ContentState.createFromBlockArray(str.contentBlocks)
      const editorStateData = EditorState.createWithContent(contentState)
      setEditorState(editorStateData)
    }
    return () => {
      sendValue.cancel()
    }
  }, [modelValue, sendValue])

  /* 实时获取内容 */
  const getValue = useMemo(() => {
    return draftToHtml(convertToRaw(editorState.getCurrentContent()))
  }, [editorState])

  /* 频繁触发 */
  const onEditorStateChange = (state) => {
    sendValue(state)
    setEditorState(state)
  }
  /* 失去焦点触发 */
  const handleBlur = (value) => {
    console.log('失去焦点触发', value)
  }

  /* 上传图片 */
  const uploadImageCallBack = (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append('file', file)

      /* 1. 用图片的 base64 来模拟 */
      fileToDataURL(file)
        .then((fileBase64) => {
          resolve({
            data: {
              link: fileBase64
            }
          })
        })
        .catch((err) => {
          reject(err)
        })

      /* 2. 发送网络请求 得到一个线上 url */
      /*
        resolve({
          data: { link: 'https://img1.baidu.com/it/u=2658301596,3565669889&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800' }
        })
      */
    })
  }

  /* Blob、File ——> Base64 (主要应用场景：图片预览) */
  const fileToDataURL = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function (e) {
        return resolve(reader.result)
      }
    })
  }

  return (
    <div className={moduleScss.reactDraftWysiwyg}>
      <Space wrap>
        <Button
          type='primary'
          onClick={() => {
            setReadOnly(true)
          }}>
          禁用
        </Button>
        <Button
          type='primary'
          onClick={() => {
            setReadOnly(false)
          }}>
          启用
        </Button>
      </Space>

      <Editor
        editorState={editorState}
        toolbarClassName='toolbarClassName'
        wrapperClassName='wrapperClassName'
        editorClassName='editorClassName'
        readOnly={readOnly}
        onEditorStateChange={onEditorStateChange}
        onBlur={handleBlur}
        toolbar={{
          image: {
            urlEnabled: true, // 是否显示图片按钮
            uploadEnabled: true, // 是否显示图片上传按钮
            alignmentEnabled: true, // 是否显示图片对齐按钮 text-align
            uploadCallback: uploadImageCallBack, // 上传图片回调
            previewImage: true, // 是否显示图片预览
            inputAccept: 'image/*', // 图片上传类型
            alt: { present: false, mandatory: false, previewImage: true } // 图片alt属性
          }
        }}
      />
      <TextArea disabled rows={4} value={getValue} />
    </div>
  )
}

export default memo(ReactDraftWysiwyg)
