import { fetch, post, patch, del } from '../http'

//类型
// 获取轮播图类型列表
export function findSliderTypeData (params) {
  return fetch('sliderType/list', params)
}

// 获取轮播图类型列表(所有)
export function findSliderTypeDataAll (params) {
  return fetch('sliderType/listAll', params)
}

// 添加轮播图类型信息
export function doSliderTypeAdd (params) {
  return post('sliderType', params)
}

// 编辑轮播图类型信息
export function doSliderTypeEdit (params) {
  return patch('sliderType', params)
}

// 删除轮播图类型
export function doSliderTypeDel (params) {
  return del('sliderType', params)
}

// 批量删除轮播图类型
export function doSliderTypeDelMany (params) {
  return del('sliderType/deleteMany', params)
}


//信息
// 获取轮播图列表
export function findSliderData (params) {
  return fetch('slider/list', params)
}

// 获取轮播图列表(所有)
export function findSliderDataAll (params) {
  return fetch('slider/listAll', params)
}

// 添加轮播图信息
export function doSliderAdd (params) {
  return post('slider', params)
}

// 编辑轮播图信息
export function doSliderEdit (params) {
  return patch('slider', params)
}

// 删除轮播图
export function doSliderDel (params) {
  return del('slider', params)
}

// 批量删除轮播图
export function doSliderDelMany (params) {
  return del('slider/deleteMany', params)
}
