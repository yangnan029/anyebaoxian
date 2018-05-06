import Vue from 'vue'
import axios from 'axios'
import { getCookie } from '../common/cookie'
import { TOKEN } from '../common/index'
/* 总线成 */
export const eventHub = new Vue()
/* ajax请求 */
export const ajax = (method, url, params, headersParams = {}) => {
  let token = getCookie(TOKEN) || ''
  return axios({
    url: url,
    method: method,
    data: method === 'post' ? params : '',
    params: method === 'get' ? params : '',
    timeout: 120000,
    responseType: 'json',
    headers: Object.assign({ token: token }, headersParams)
  })
}
