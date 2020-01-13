import { fetch, post, patch, del } from '../http'

// 获取标签列表
export function findLabelData (params) {
  return fetch('label/list', params)
}

// 获取标签列表ALL
export function findLabelAllData (params) {
  return fetch('label/listAll', params)
}

// 添加标签信息
export function doLabelAdd (params) {
  return post('label', params)
}

// 编辑标签信息
export function doLabelEdit (params) {
  return patch('label', params)
}

// 删除标签
export function doLabelDel (params) {
  return del('label', params)
}

// 批量删除标签
export function doLabelDelMany (params) {
  return del('label/deleteMany', params)
}


//标签关系
// 获取标签关系
export function findLabelRelData (params) {
  return fetch('labelRel/labelList', params)
}

// 添加标签关系
export function doLabelRelAdd (params) {
  return post('labelRel', params)
}

// 删除标签关系
export function doLabelRelDel (params) {
  return del('labelRel', params)
}

// 批量删除标签关系
export function doLabelRelDelMany (params) {
  return del('labelRel/deleteMany', params)
}
