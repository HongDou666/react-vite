const express = require('express')
const app = express()

app.use((request, response, next) => {
  console.log(`有人请求服务器1了,请求来自于${request.get('Host')},请求的地址是${request.url}`)
  // console.log('请求来自于',request.get('Host'));
  // console.log('请求的地址',request.url);
  next()
})

app.get('/students', (request, response) => {
  setTimeout(() => {
    // throw new Error('抛出异常 Error')
    // response.status(403).send('对不起，您无权访问此页面。')
    // response.status(400).send('对不起，网络异常。')
    const demo1 = [
      { id: '001', name: 'tom', age: 18 },
      { id: '002', name: 'jerry', age: 19 },
      { id: '003', name: 'tony', age: 120 }
    ]
    const demo2 = [
      { id: '005', name: '阿波罗', age: 18 },
      { id: '006', name: '龙俊锋', age: 19 },
      { id: '007', name: '谢婷', age: 120 }
    ]
    if (+request.query.time % 2 === 0) {
      response.send({
        code: 200,
        msg: '成功',
        data: demo1
      })
    } else {
      response.send({
        code: 200,
        msg: '成功',
        data: demo2
      })
    }
  }, request.query?.time || 0)
})

app.post('/cache/data', (request, response) => {
  const students = [
    { id: '001', name: '火影忍者' },
    { id: '002', name: '海贼王' },
    { id: '003', name: '七龙珠' },
    { id: '004', name: '斗破苍穹' },
    { id: '005', name: '斗罗大陆' },
    { id: '006', name: '武动乾坤' },
    { id: '007', name: '武庚纪' }
  ]
  setTimeout(() => {
    response.send({
      code: 200,
      msg: '成功',
      data: students
    })
  }, 1000)
})

app.listen(6000, (err) => {
  if (!err) console.log('服务器1启动成功了,请求学生信息地址为：http://localhost:6000/students')
})
