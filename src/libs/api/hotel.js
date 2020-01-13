import { fetch, post, patch, del } from '../http'

// 获取酒店列表
export function findHotelData (params) {
  return fetch('hotel/list', params)
}

// 添加酒店信息
export function doHotelAdd (params) {
  return post('hotel', params)
}

// 编辑酒店信息
export function doHotelEdit (params) {
  return patch('hotel', params)
}

// 删除酒店
export function doHotelDel (params) {
  return del('hotel', params)
}

// 批量删除酒店
export function doHotelDelMany (params) {
  return del('hotel/deleteMany', params)
}
