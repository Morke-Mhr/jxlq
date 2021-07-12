import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.jurisdiction

// 获取菜单列表
export function getMenuList({ menuName, visible, status }) {
  return request({
    url: serviceName + `/menu/list?menuName=${menuName}&visible=${visible}&status=${status}`,
    method: 'get'
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: serviceName + '/menu',
    method: 'post',
    data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: serviceName + '/menu',
    method: 'put',
    data
  })
}

// 加载对应角色菜单列表树
export function getRoleMenuTreeSelect(roleId) {
  return request({
    url: serviceName + `/menu/roleMenuTreeselect/${roleId}`,
    method: 'get'
  })
}

// 获取菜单下拉树列表
export function getMenutreeSelect() {
  return request({
    url: serviceName + '/menu/treeselect',
    method: 'get'
  })
}

// 删除菜单
export function deleteMenu(menuId) {
  return request({
    url: serviceName + `/menu/${menuId}`,
    method: 'delete'
  })
}

// 根据菜单ID获取详细信息
export function getMenuInfo(menuId) {
  return request({
    url: serviceName + `/menu/${menuId}`,
    method: 'get'
  })
}
