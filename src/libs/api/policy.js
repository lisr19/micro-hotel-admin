import { fetch, post, patch, del } from '../http'

//类型
// 获取政策类型列表
export function findPolicyTypeData (params) {
  return fetch('rulesType/list', params)
}

// 添加政策类型信息
export function doPolicyTypeAdd (params) {
  return post('rulesType', params)
}

// 编辑政策类型信息
export function doPolicyTypeEdit (params) {
  return patch('rulesType', params)
}

// 删除政策类型
export function doPolicyTypeDel (params) {
  return del('rulesType', params)
}

// 批量删除政策类型
export function doPolicyTypeDelMany (params) {
  return del('rulesType/deleteMany', params)
}




//酒店政策
// 获取政策列表
export function findPolicyData (params) {
  return fetch('hotelRules/list', params)
}

// 添加政策信息
export function doPolicyAdd (params) {
  return post('hotelRules', params)
}

// 编辑政策信息
export function doPolicyEdit (params) {
  return patch('hotelRules', params)
}

// 删除政策
export function doPolicyDel (params) {
  return del('hotelRules', params)
}

// 批量删除政策
export function doPolicyDelMany (params) {
  return del('hotelRules/deleteMany', params)
}


//房间政策
// 获取政策列表
export function findRoomPolicyData (params) {
  return fetch('roomRules/list', params)
}

// 添加政策信息
export function doRoomPolicyAdd (params) {
  return post('roomRules', params)
}

// 编辑政策信息
export function doRoomPolicyEdit (params) {
  return patch('roomRules', params)
}

// 删除政策
export function doRoomPolicyDel (params) {
  return del('roomRules', params)
}

// 批量删除政策
export function doRoomPolicyDelMany (params) {
  return del('roomRules/deleteMany', params)
}
