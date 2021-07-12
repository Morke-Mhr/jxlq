import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.jurisdiction
const serviceNameMock = store.state.serviceName.mock


// 获取分类字典列表
export function getClassList() {
  return request({
    url: serviceName + '/class/dict/list',
    method: 'get'
  })
}
//新增
export function getAddClassList(data) {
  return request({
    url: serviceName + '/class/dict/add',
    method: 'post',
    data
  })
}
//修改
export function getUpdataClassList(data) {
  return request({
    url: serviceName + '/class/dict/edit',
    method: 'post',
    data
  })
}
//查看
export function getClassSelect(classdictId) {
  return request({
    url: serviceName + '/class/dict/details?classdictId=' + classdictId,
    method: 'get',
  })
}
//删除
export function getDeleteClass(classdictId) {
  return request({
    url: serviceName + '/class/dict/delete?classdictId=' + classdictId,
    method: 'get',
  })
}
//获取安全教育培训的主题下拉列表
export function getSelectTheme(dictType) {
  return request({
    url: serviceName + '/dict/data/dictType/' + dictType,
    method: 'get',
  })
}
//获取安全教育培训的分类下拉列表
export function getSelectClass(dictNumber) {
  return request({
    url: serviceName + '/class/dict/dictNumber/' + dictNumber,
    method: 'get',
  })
}
//获取作业指导书作业类别下拉列表
export function getSelectWorkType(dictType) {
  return request({
    url: serviceName + '/dict/data/dictType/' + dictType,
    method: 'get',
  })
}
//获取人员台账证书类别
export function getSelectLce(dictType) {
  return request({
    url: serviceName + '/dict/data/dictType/' + dictType,
    method: 'get',
  })
}
//获取人员台账学历
export function getSelectEdu(dictType) {
  return request({
    url: serviceName + '/dict/data/dictType/' + dictType,
    method: 'get',
  })
}
//获取安全技术项目类型下拉
export function getSelectTechItem(dictType) {
  return request({
    url: serviceName + '/dict/data/dictType/' + dictType,
    method: 'get',
  })
}
// //获取安全技术项目进度下拉
// export function getSelectTechSchd(dictType) {
//   return request({
//     url: serviceName + '/dict/data/dictType/' + dictType,
//     method: 'get',
//   })
// }
