import request from '@/utils/request'
import store from '@/store'
const serviceName = store.state.serviceName.jurisdiction

// 查询字典类型列表
export function getDictTypeList({ pageNum, pageSize, dictName, dictType, status }) {
  return request({
    url: serviceName + `/dict/type/list?pageNum=${pageNum}&pageSize=${pageSize}&dictName=${dictName}&dictType=${dictType}&status=${status}`,
    method: 'get'
  })
}

// 获取字典类型选择下拉列表
export function getDictTypeOptionselect() {
  return request({
    url: serviceName + '/dict/type/optionselect',
    method: 'get'
  })
}

// 新增字典类型
export function addDictType(data) {
  return request({
    url: serviceName + '/dict/type',
    method: 'post',
    data
  })
}

// 修改字典类型
export function updateDictType(data) {
  return request({
    url: serviceName + '/dict/type',
    method: 'put',
    data
  })
}

// 删除字典类型
export function deleteDictType(dictIds) {
  return request({
    url: serviceName + `/dict/type/${dictIds}`,
    method: 'delete'
  })
}

// 根据字典类型id获取详细信息
export function getDictTypeInfo(dictId) {
  return request({
    url: serviceName + `/dict/type/${dictId}`,
    method: 'get'
  })
}
