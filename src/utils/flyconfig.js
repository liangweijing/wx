const Fly = require('flyio/dist/npm/wx')
const fly = new Fly()

// 定义公共headers
// fly.config.headers={token: test_token}
fly.config.headers = { 'content-type': 'application/json' }

// //设置超时
// fly.config.timeout=10000;
// //设置请求基地址
fly.config.baseURL = 'http://127.0.0.1:8090'
    // fly.config.baseURL = 'http://10.22.234.201:8080'
    // fly.config.baseURL = 'http://172.20.10.6:8080'
    // fly.config.baseURL = 'http://192.168.43.115:8080'

// 添加请求拦截器(做未登录转发)
// fly.interceptors.request.use(config => {
//     let token = store.state.user.token
//     console.log(token)
//     // 给所有请求添加自定义header
//     config.headers['token'] = token
//     config.body = qs.stringify(config.body)
//     // 可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
//     return config
//   }, error => {
//     Promise.reject(error)
//   })

export default fly;