import request from '@/utils/request'
import store from '@/store'
const serviceName = store.state.serviceName.jurisdiction

// 查询部门列表
export function getDeptList({deptName,status}) {
  return request({
    url: serviceName + `/dept/list?deptName=${deptName}&status=${status}`,
    method: 'get'
  })
}
// 新增部门
export function addDept(data) {
  return request({
    url: serviceName + '/dept',
    method: 'post',
    data
  })
}
// 修改部门
export function updateDept(data) {
  return request({
    url: serviceName + '/dept',
    method: 'put',
    data
  })
}
// 加载对应角色部门列表树
export function getRoleDeptTreeSelect(roleId) {
  return request({
    url: serviceName + `/dept/roleDeptTreeselect/${roleId}`,
    method: 'get'
  })
}
// 获取部门下拉树列表
export function getDepttreeSelect() {
  return request({
    url: serviceName + '/dept/treeselect',
    method: 'get'
  })
}
// 删除部门
export function deleteDept(deptId) {
  return request({
    url: serviceName + `/dept/delete/${deptId}`,
    method: 'delete'
  })
}
// 根据部门ID获取详细信息
export function getDeptInfo(deptId) {
  return request({
    url: serviceName + `/dept/${deptId}`,
    method: 'get'
  })
}
// 根据登录人获取树结构部门数据
export function getLoginDept() {
  return request({
    url: serviceName + '/dept/getTreeDeptByLogin',
    method: 'get'
  })
}
// 根据部门查询人的接口
// export function getLoginDeptPerson(deptId) {
//   return request({
//     url: serviceName + '/user/getUserListByDeptId/' + deptId,
//     method: 'get'
//   })
// }
export function getLoginDeptPerson(deptId) {
  return request({
    url: serviceName + '/user/getUserListByDeptId?deptId=' +deptId,
    method: 'get',
  })
}
// 获取部门下拉树列表  /dept/treeselect
export function getTreeSelect(paramsData) {
  return request({
    url: serviceName + '/dept/treeselect',
    method: 'get',
    params: paramsData ? paramsData : ''
  })
}
// 获取部门下拉树列表  /dept/getTreeDeptByLogin
export function getTreeDeptByLogin(paramsData) {
  return request({
    url: serviceName + '/dept/getTreeDeptByLogin',
    method: 'get',
    params: paramsData ? paramsData : ''
  })
}