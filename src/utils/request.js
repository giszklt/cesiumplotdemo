import axios from 'axios'
import {
  Message
} from 'element-ui'
import Vue from 'vue'

axios.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";

// create an axios instance
const service = axios.create({
  baseURL: window.BASE_API, // url = base url + request url
  //withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    return res
  },
  error => {
    console.log('err' + error) // for debug
// 在响应拦截器里面 统一添加 处理取消请求
    if(error.message === 'interrupt') {
      console.log('请求中断');
      return new Promise(() => {});
    }

    // eslint-disable-next-line no-unused-vars
    let errMsg = ''
    if (error.config.url === window.netstatusrest) {
      errMsg = '监测站网络状态请求失败'
    } else if (error.message === 'Network Error') {
      errMsg = '请求数据失败，请检查后台服务是否启动'
    } else {
      errMsg = error.message
    }
    if (errMsg !== '') {
      Message({
        message: errMsg,
        type: 'error',
        duration: 5 * 1000
      })
    }
    console.log(error.message)
    return Promise.reject(error)
  }
)

export default service
