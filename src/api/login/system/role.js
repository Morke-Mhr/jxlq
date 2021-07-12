import request from '@/utils/request'
import store from '@/store'
const serviceName = store.state.serviceName.jurisdiction

// 获取角色列表
export function getRoles({ pageNum, pageSize, roleName, roleKey, status }) {
  return request({
    url: serviceName + `/role/list?pageNum=${pageNum}&pageSize=${pageSize}&roleName=${roleName}&roleKey=${roleKey}&status=${status}`,
    method: 'get'
  })
}

// 获取角色选择下拉列表
export function getRolesOptionselect() {
  return request({
    url: serviceName + '/role/optionselect',
    method: 'get'
  })
}

// 添加角色
export function addRole(data) {
  return request({
    url: serviceName + '/role',
    method: 'post',
    data
  })
}
// 修改角色
export function updateRole(data) {
  return request({
    url: serviceName + '/role',
    method: 'put',
    data
  })
}

// 角色状态修改
export function updateRoleChangeStatus(data) {
  return request({
    url: serviceName + '/role/changeStatus',
    method: 'put',
    data
  })
}

// 删除角色
export function deleteRole(roleIds) {
  return request({
    url: serviceName + `/role/${roleIds}`,
    method: 'delete'
  })
}

// 根据角色id获取详细信息
export function getRoleInfo(roleIds) {
  return request({
    url: serviceName + `/role/${roleIds}`,
    method: 'get'
  })
}
