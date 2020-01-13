import { fetch, post, patch, del } from '../http'

// 获取用户列表
export function findUserData (params) {
  return fetch('user/list', params)
}

// 添加用户信息
export function doUserAdd (params) {
  return post('user', params)
}

// 编辑用户信息
export function doUserEdit (params) {
  return patch('user', params)
}

// 删除用户
export function doUserDel (params) {
  return del('user', params)
}

// 批量删除用户
export function doUserDelMany (params) {
  return del('user/deleteMany', params)
}
