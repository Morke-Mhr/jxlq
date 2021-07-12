import request from '@/utils/request'
import store from '@/store'
const serviceName = store.state.serviceName.jurisdiction

// 查询岗位列表
export function getPostList({ pageNum, pageSize, postCode, postName, status }) {
  return request({
    url: serviceName + `/post/list?pageNum=${pageNum}&pageSize=${pageSize}&postCode=${postCode}&postName=${postName}&status=${status}`,
    method: 'get'
  })
}

// 获取岗位选择下拉列表
export function getPostOptionselect() {
  return request({
    url: serviceName + '/post/optionselect',
    method: 'get'
  })
}

// 新增岗位
export function addPost(data) {
  return request({
    url: serviceName + '/post',
    method: 'post',
    data
  })
}

// 修改岗位
export function updatePost(data) {
  return request({
    url: serviceName + '/post',
    method: 'put',
    data
  })
}

// 删除岗位
export function deletePost(postIds) {
  return request({
    url: serviceName + `/post/${postIds}`,
    method: 'delete'
  })
}

// 根据岗位id获取详细信息
export function getPostInfo(postIds) {
  return request({
    url: serviceName + `/post/${postIds}`,
    method: 'get'
  })
}
