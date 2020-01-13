import { fetch, post, patch, del } from '../http'

// 获取登录信息列表
export function findLoginInfoData (params) {
  return fetch('loginInfo/list', params)
}
