import { fetch, post, patch, del } from '../http'

//类型
// 获取设施类型列表
export function findFacilitiesTypeData (params) {
  return fetch('facilityServiceType/list', params)
}

// 添加设施类型信息
export function doFacilitiesTypeAdd (params) {
  return post('facilityServiceType', params)
}

// 编辑设施类型信息
export function doFacilitiesTypeEdit (params) {
  return patch('facilityServiceType', params)
}

// 删除设施类型
export function doFacilitiesTypeDel (params) {
  return del('facilityServiceType', params)
}

// 批量删除设施类型
export function doFacilitiesTypeDelMany (params) {
  return del('facilityServiceType/deleteMany', params)
}

//设施
// 获取设施列表
export function findFacilitiesData (params) {
  return fetch('facilityServices/list', params)
}

// 添加设施信息
export function doFacilitiesAdd (params) {
  return post('facilityServices', params)
}

// 编辑设施信息
export function doFacilitiesEdit (params) {
  return patch('facilityServices', params)
}

// 删除设施
export function doFacilitiesDel (params) {
  return del('facilityServices', params)
}

// 批量删除设施
export function doFacilitiesDelMany (params) {
  return del('facilityServices/deleteMany', params)
}



//酒店/民宿设施
// 获取设施列表
export function findHotelFacilitiesData (params) {
  return fetch('hotelFacilityServices/list', params)
}

// 添加设施信息
export function doHotelFacilitiesAdd (params) {
  return post('hotelFacilityServices', params)
}

// 编辑设施信息
export function doHotelFacilitiesEdit (params) {
  return patch('hotelFacilityServices', params)
}

// 删除设施
export function doHotelFacilitiesDel (params) {
  return del('hotelFacilityServices', params)
}

// 批量删除设施
export function doHotelFacilitiesDelMany (params) {
  return del('hotelFacilityServices/deleteMany', params)
}



//房间设施
// 获取设施列表
export function findRoomFacilitiesData (params) {
  return fetch('roomFacilityServices/list', params)
}

// 添加设施信息
export function doRoomFacilitiesAdd (params) {
  return post('roomFacilityServices', params)
}

// 编辑设施信息
export function doRoomFacilitiesEdit (params) {
  return patch('roomFacilityServices', params)
}

// 删除设施
export function doRoomFacilitiesDel (params) {
  return del('roomFacilityServices', params)
}

// 批量删除设施
export function doRoomFacilitiesDelMany (params) {
  return del('roomFacilityServices/deleteMany', params)
}
