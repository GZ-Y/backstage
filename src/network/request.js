
// export function request(config) {
//   const instance = axios.create({
//     baseURL:'https://www.liulongbin.top:8888/api/private/v1/',
//     timeout:6000
//   })

//   //请求拦截
//   instance.interceptors.request.use(config => {
//     return config;
//   },err => {
//     console.log(err)
//   })
  
//   //响应拦截
//   instance.interceptors.response.use(res => {
//     return res.data
//   },error => {
//     console.log(error)
//   })


//   return instance(config)
// }