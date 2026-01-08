/*
  UnoCss 官方交互式文档 : https://unocss.dev/interactive/
*/

const UnoCss: React.FC = () => {
  return (
    <>
      <div className='m-5px m-b-7px m-l-8px m-r-9px m-t-6px m-block-15px m-inline-14px m-be-10px m-bs-11px m-ie-12px m-is-13px'>
        margin Css
      </div>
      <hr />

      <div className='p-5px p-b-7px p-l-8px p-r-9px p-t-6px p-block-15px p-inline-14px p-be-10px p-bs-11px p-ie-12px p-is-13px'>
        padding Css
      </div>
      <hr />

      <div className='h-100px w-50% bg-#ff8f66 text-center text-30px font-size-16px c-#ffffff font-900'>
        width height background Css
      </div>
      <hr />

      <div className='h-100px w-50% b-10px b-#00ccff b-rd-20px b-solid bg-#ff8f66 text-30px font-size-30px c-#ffffff font-900'>
        border Css
      </div>
      <hr />

      <div className='h-100px w-50% flex flex-col flex-col-reverse flex-wrap flex-justify-center flex-items-center b-10px b-#00ccff b-rd-20px b-solid bg-#ff8f66 text-30px font-size-30px c-#fff font-900'>
        layout Css
      </div>
      <hr />

      <div className='pos-relative h-100px w-50% flex flex-col flex-col-reverse flex-wrap flex-justify-center flex-items-center nowrap-hidden b-10px b-#00ccff b-rd-20px b-solid bg-#ff8f66 text-30px font-size-30px c-#fff font-900'>
        <div className='absolute-rb'>position Css</div>
      </div>
      <hr />

      <div className='zqc-(#007aff)'>自定义规则的元素 Css</div>
      <hr />
    </>
  )
}

export default UnoCss
