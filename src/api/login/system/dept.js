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
    url: serviceName + `/dept/${deptId}`,
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
