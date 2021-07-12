import request from '@/utils/request'
import store from '@/store'

// const serviceName = store.state.serviceName.mock
const serviceName = store.state.serviceName.org
const orgMock = store.state.serviceName.orgMock

// 获取需求列表
// export function getTreeDeptSelect() {
//   return request({
//     url: serviceName + '/dept/treePostAndDeptselect',
//     method: 'get'
//   })
// }
export function getTreeDeptSelect() {
  return request({
    url: serviceName + '/dept/treePostAndDeptselect',
    method: 'get'
  })
}
// 查询部门基本信息
export function getBaseDeptInfo(userId) {
  return request({
    url: serviceName + '/dept/getDept/' + userId,
    method: 'get'
  })
}
// 查询岗位基本信息
export function getBaseJobInfo(userId) {
  return request({
    url: serviceName + '/businessPost/getPost/' + userId,
    method: 'get'
  })
}
// 编辑岗位信息
export function getEditJob(data) {
  return request({
    url: serviceName + '/businessPost',
    method: 'put',
    data
  })
}
// 编辑部门信息
export function getEditDept(data) {
  return request({
    url: serviceName + '/dept',
    method: 'put',
    data
  })
}
//新增子部门
export function getAddDept(data) {
  return request({
    url: serviceName + '/dept/addSub',
    method: 'post',
    data
  })
}
//新增岗位
export function getAddJob(data) {
  return request({
    url: serviceName + '/businessPost/add',
    method: 'post',
    data
  })
}
