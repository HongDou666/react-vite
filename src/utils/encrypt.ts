/* window.btoa-加密
  encodeURIComponent 函数通过将特定字符的每个实例替换成代表字符的 UTF-8 编码的一个、两个、三个或四个转义序列来编码
  btoa 函数可以将一个二进制字符串（例如，将字符串中的每一个字节都视为一个二进制数据字节）编码为 Base64 编码的 ASCII 字符串
  atob 函数会对经过 Base64 编码的字符串进行解码
  */
export function encryptionData(data: any) {
  return window.btoa(unescape(encodeURIComponent(JSON.stringify(data))))
}

/* window.atob-解密 */
export function decryptionData(data: any) {
  return JSON.parse(decodeURIComponent(escape(window.atob(data))))
}
