import { fetch, post, patch, del } from '../http'

// 获取民宿列表
export function findHostelData (params) {
  return fetch('homeStay/list', params)
}

// 添加民宿信息
export function doHostelAdd (params) {
  return post('homeStay', params)
}

// 编辑民宿信息
export function doHostelEdit (params) {
  return patch('homeStay', params)
}

// 删除民宿
export function doHostelDel (params) {
  return del('homeStay', params)
}

// 批量删除民宿
export function doHostelDelMany (params) {
  return del('homeStay/deleteMany', params)
}
