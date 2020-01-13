import { fetch, post, patch, del } from '../http'

// 获取房型列表
export function findRoomData (params) {
  return fetch('room/list', params)
}

// 添加房型信息
export function doRoomAdd (params) {
  return post('room', params)
}

// 编辑房型信息
export function doRoomEdit (params) {
  return patch('room', params)
}

// 删除房型
export function doRoomDel (params) {
  return del('room', params)
}

// 批量删除房型
export function doRoomDelMany (params) {
  return del('room/deleteMany', params)
}
