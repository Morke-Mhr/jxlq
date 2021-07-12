import request from '@/utils/request'
import store from '@/store'
const serviceName = store.state.serviceName.jurisdiction

// 查询字典数据列表
export function getDictDataList({ pageNum, pageSize, dictType, dictLabel, status }) {
  return request({
    url: serviceName + `/dict/data/list?pageNum=${pageNum}&pageSize=${pageSize}&dictLabel=${dictLabel}&dictType=${dictType}&status=${status}`,
    method: 'get'
  })
}

// 根据字典数据数据dictType查询字典数据信息
export function getDictDataDictType(dictType) {
  return request({
    url: serviceName + `/dict/data/dictType/${dictType}`,
    method: 'get'
  })
}

// 新增字典数据
export function addDictData(data) {
  return request({
    url: serviceName + '/dict/data',
    method: 'post',
    data
  })
}

// 修改字典数据
export function updateDictData(data) {
  return request({
    url: serviceName + '/dict/data',
    method: 'put',
    data
  })
}

// 删除字典数据
export function deleteDictData(dictCodes) {
  return request({
    url: serviceName + `/dict/data/${dictCodes}`,
    method: 'delete'
  })
}

// 根据字典数据id获取详细信息
export function getDictDataInfo(dictCode) {
  return request({
    url: serviceName + `/dict/data/${dictCode}`,
    method: 'get'
  })
}
