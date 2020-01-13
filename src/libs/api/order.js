import { fetch, post, patch, del } from '../http'

// 获取订单列表
export function findOrderData (params) {
  return fetch('roomOrder/list', params)
}

// 添加订单信息
export function doOrderAdd (params) {
  return post('roomOrder', params)
}

// 编辑订单信息
export function doOrderEdit (params) {
  return patch('roomOrder', params)
}

// 删除订单
export function doOrderDel (params) {
  return del('roomOrder', params)
}

// 批量删除订单
export function doOrderDelMany (params) {
  return del('roomOrder/deleteMany', params)
}
