/* 引入 react-quill 组件 */
import ReactQuill, { Quill } from 'react-quill'

/* 对于不同的主题 引入对应的 CSS 文件 (雪景 Snow 主题) */
import 'react-quill/dist/quill.snow.css'
import moduleScss from './index.module.scss'

/* 自定义quill编辑器的字体 这里的顺序注意一下 */
const fontArr = ['ZQC-zk', 'ZQC-pm', 'ZQC-zjmc', 'ZQC-yrdz']
const Font = Quill.import('formats/font')
/* 将字体加入到白名单 */
Font.whitelist = fontArr
Quill.register(Font, true)

/*
  参考文献:
  1. https://juejin.cn/post/7195124289501134905#heading-18
  2. https://blog.csdn.net/qq_44416706/article/details/131002692
  3. https://blog.csdn.net/weixin_44786530/article/details/139269496
*/

const ReactQuillEdit: React.FC = () => {
  const editorRef = useRef(null)
  const [value, setValue] = useState('')
  const [readOnly, setReadOnly] = useState(false)

  /* 自定义工具栏 */
  const modules = useMemo(() => {
    return {
      /*
        方式1: 可以是简单的一维数组配置
        toolbar: ["bold", "italic", "underline", "strike", "blockquote"]
      */

      /* 方式2: 可以配置二维数组，进行多个选项的配置 或者针对某一个配置项的key值 进行配置 */
      // toolbar: [
      //   /*
      //     默认配置:
      //     [{ header: [1, 2, 3, false] }],
      //     ["bold", "italic", "underline", "link"],
      //     [{ list: "ordered" }, { list: "bullet" }],
      //     ["clean"]
      //   */
      //   /* 掘金的富文本编辑器配置 */
      //   'bold',
      //   'italic',
      //   'underline',
      //   { header: 1 },
      //   { header: 2 },
      //   'blockquote',
      //   'code-block',
      //   'code',
      //   'link',
      //   { list: 'ordered' },
      //   { list: 'bullet' },
      //   'image'
      // ]

      /* 方式3: 配置为对象信息 */
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
          ['blockquote', 'code-block'], // 字体样式
          ['link', 'image'], // 上传图片、上传视频
          [{ list: 'ordered' }, { list: 'bullet' }], // 有序列表，无序列表
          [{ script: 'sub' }, { script: 'super' }], // 下角标，上角标
          [{ indent: '-1' }, { indent: '+1' }], // 缩进
          [{ align: [] }], // 居中
          [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
          [{ color: [] }, { background: [] }], // 文字颜色、背景颜色选择
          [{ direction: 'rtl' }], // 文字输入方向
          [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
          [{ font: fontArr }], // 自定义字体
          // [{ lineheight: ['1', '1.5', '1.75', '2', '3', '4', '5'] }], 自定义行高
          ['clean'] // 清除样式
        ]
      }

      /*
        方式4: 可以自己指定工具栏的容器
        toolbar: "#rq-toolbar"
      */
    }
  }, [])

  /**
   * @param content 当前编辑器中的内容
   * @param delta 表示更改的增量对象
   * @param source 更改源
   * @param editor 编辑器访问器
   */
  const handleChangeValue = (content, delta, source, editor) => {
    const delta_ops = delta.ops
    const quilContent = editor.getContents()
    if (delta_ops && delta_ops.length) {
      quilContent.ops.map(async (item) => {
        if (item.insert) {
          const imgStr = item.insert.image
          if (imgStr && imgStr?.includes('data:image/')) {
            const base64File = await base64ToFile(imgStr, `文件名称-${Math.random().toString()}`)
            const formData = new FormData()
            formData.append('file', base64File)
            /* 调用上传接口 将二进制图片文件上传至服务器 服务器返回一个图片地址 */
            const url = 'https://pic2.zhimg.com/v2-5fb13110e1de13d4c11e6e7f5b8026da_r.jpg'
            /* 将图片链接替换为服务器返回的图片链接 */
            item.insert.image = url
            setValue(quilContent)
          } else {
            setValue(content)
          }
        }
      })
    }
  }

  /**
   * @description: Base64 ——> File (主要应用场景：文件上传)
   */
  const base64ToFile = (base64, fileName) => {
    const arr = base64.split(',')
    const type = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], fileName, { type })
  }

  /**
   * @description: 当输入框内容发生变化的时候 会返回当前发生变化的文本的下标; 当选中编辑器某一段内容的时候 返回选中范围的文本的开始位置的下标
   */
  const handleChangeSelection = (range, source, editor) => {}

  /**
   * @description: 在编辑区域获取焦点的时候触发 同时会将当前光标的位置返回; 与onChangeSelection事件的区别在于 它只在编辑器获得焦点的时候触发一次 而onChangeSelection是光标在编辑区每次移动都会触发
   */
  const handleFocus = (range, source, editor) => {}

  /**
   * @description: 失去焦点的时候 会将失去焦点之前的光标位置返回 发现这个时候onChangeSelection事件也会执行 但是返回的是null
   */
  const handleBlur = (previousRange, source, editor) => {}

  useEffect(() => {
    setTimeout(() => {
      const dataValue = `<h2><strong><em><u>react-quill</u></em> 富文本编辑器</strong></h2>`
      setValue(dataValue)

      /* 设置编辑器为可编辑状态 */
      setReadOnly(false)

      const quill: any = editorRef.current
      /* 设置编辑器获取焦点 */
      quill && quill.focus()

      /* 返回当前编辑器的实例，但是尽量避免直接操作实例对象更改值 */
      const quillEditor = quill?.getEditor()
      console.log('当前编辑器的实例', quillEditor)
    }, 1000)
  }, [])

  return (
    <div className={moduleScss.reactQuillEdit}>
      {/* 自定义工具栏 */}
      {/* <div className='quill-editor-toolbar' id='rq-toolbar'>
        <Button type='primary'  className='ql-bold'></Button>
        <Button type='primary'  className='ql-italic'></Button>
      </div> */}

      <ReactQuill
        /* 主题属性 默认或者不传采用的是 snow */
        theme='snow'
        placeholder='请输入内容...'
        className='react-quill-edit'
        style={{ borderRadius: '10px' }}
        ref={editorRef}
        readOnly={readOnly}
        modules={modules}
        value={value}
        // defaultValue="<strong>我是默认值</strong>" 注意: 如果绑定了value属性 在设置defaultValue会不起作用
        onChange={handleChangeValue}
        onChangeSelection={handleChangeSelection}
        onFocus={handleFocus}
        onBlur={handleBlur}>
        <div className='editor-area zqc'></div>
      </ReactQuill>
    </div>
  )
}

export default ReactQuillEdit
