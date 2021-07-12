import request from '@/utils/request'
import store from '@/store'
const serviceName = store.state.serviceName.jurisdiction

// 查询参数配置列表
export function getConfigList({ pageNum, pageSize, configName, configKey, configType,beginTime,endTime }) {
  return request({
    url: serviceName + `/config/list?pageNum=${pageNum}&pageSize=${pageSize}&configName=${configName}&configKey=${configKey}&configType=${configType}&beginTime=${beginTime}&endTime=${endTime}`,
    method: 'get'
  })
}


// 新增参数配置
export function addConfig(data) {
  return request({
    url: serviceName + '/config',
    method: 'post',
    data
  })
}

// 修改参数配置
export function updateConfig(data) {
  return request({
    url: serviceName + '/config',
    method: 'put',
    data
  })
}

// 删除参数配置
export function deleteConfig(configIds) {
  return request({
    url: serviceName + `/config/${configIds}`,
    method: 'delete'
  })
}

// 根据参数配置id获取详细信息
export function getConfigInfo(configIds) {
  return request({
    url: serviceName + `/config/${configIds}`,
    method: 'get'
  })
}

// 根据参数键名查询参数值
export function getConfigKey(configKey) {
  return request({
    url: serviceName + `/config/${configKey}`,
    method: 'get'
  })
}
