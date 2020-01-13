import { fetch, post, patch, del } from '../http'

// 管理员登录
export function login (params) {
  return post('manager/login', params)
}

// 获取管理员列表
export function findManagerData (params) {
  return fetch('manager/list', params)
}


// 添加管理员
export function doManagerAdd (params) {
  return post('manager', params)
}

// 编辑管理员
export function doManagerEdit (params) {
  return patch('manager', params)
}

// 删除管理员
export function doManagerDel (params) {
  return del('manager', params)
}

// 批量删除管理员
export function doManagerDelMany (params) {
  return del('manager/deleteMany', params)
}
