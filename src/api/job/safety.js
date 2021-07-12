import request from '@/utils/request'
import store from '@/store'
import axios from 'axios'
import { getToken } from '@/utils/auth'

// const serviceName = store.state.serviceName.mock
const addWorkMockService = store.state.serviceName.addWorkMock
const serviceName = store.state.serviceName.org
const serviceWth = store.state.serviceName.process
const systemName = store.state.serviceName.jurisdiction //系统模块

// 获取安全责任书列表
export function getSafetyList({ pageNum, pageSize, userName, status }) {
  return request({
    url:
      serviceName +
      `/userSafebook/list?pageNum=${pageNum}&pageSize=${pageSize}&userName=${userName}&status=${status}`,
    //url: serviceName + `/workProcess/list?pageNum=${pageNum}&pageSize=${pageSize}&name=${name}&status=${status}&createBy=${createBy}`,
    method: 'get'
  })
}
// 查看安全责任书
export function getLookSafety(safebookId) {
  return request({
    url: serviceName + '/userSafebook/getSafeBook/' + safebookId,
    method: 'get'
  })
}

//安全责任书的添加
export function addLookSafety(data) {
  return request({
    url: addWorkMockService + '/userSafebook/add',
    method: 'post',
    data
  })
}

//获取字典门类
export function getSelectType(SelectType) {
  return request({
    url: serviceName + '/dict/data/dictType/' + SelectType,
    method: 'get'
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

// 获得岗位职责界面
export function getPostWprocessGuide(postId) {
  return request({
    url: serviceName + `/businessPost/getPostWprocessGuide/${postId}`,
    method: 'get'
  })
}

export function userSafebookUpdate(data) {
  return request({
    url: serviceName + `/userSafebook/update`,
    method: 'post',
    data
  })
}

// //根据部门ID查人员
// export function getUserList(params) {
//   return request({
//     url: serviceName + '/user/getUserListByDeptId',
//     method: 'get',
//     params
//   })
// }
// //根据ID查岗位
// export function getPostAndDept(userId) {
//   return request({
//     url: serviceName + '/businessPost/getPostAndDept/'+userId,
//     method: 'get',
//   })
// }

// 查找部门
export function getTreeDeptSelect() {
  return request({
    url: systemName + '/dept/getTreeDeptByLogin',
    method: 'get'
  })
}
// 根据 部门 ID 查岗位
export function getPostsByDeptId(deptId) {
  return request({
    url: systemName + '/businessPost/getPostsByDeptId/' + deptId,
    method: 'get'
  })
}
// 根据 根据岗位ID  查人员
export function getUsersByDeptPost(params) {
  return request({
    url: systemName + '/user/getUsersByDeptPost',
    method: 'get',
    params: params
  })
}

//根据分类字典编码查询它子类信息
export function getdictNumber(dictNumber) {
  return request({
    url: addWorkMockService + '/class/dict/dictNumber/' + dictNumber,
    method: 'get'
  })
}
// 删除安全责任书
export function getDelSafety(safebookId) {
  return request({
    url: serviceName + '/userSafebook/' + safebookId,
    method: 'delete'
  })
}

// 获取审批流
export function getBusinessList(params) {
  return request({
    url: serviceWth + '/business/getBusinessList',
    method: 'get',
    params
  })
}
// 获取审批流下一流程节点岗位
export function getBusinesspost(params) {
  return request({
    url: serviceWth + '/business/getChoiceFirstUsertaskNoStart',
    method: 'get',
    params
  })
}

// 安全责任书打印功能
export function exportWord(params) {
  console.log(params)
  return axios({
    url:
      store.state.apiConfiguration.url +
      systemName +
      `/userSafebook/createSafebookDoc/` +
      params.safebookId,
    responseType: 'blob',
    headers: {
      Authorization: getToken()
    }
  })
    .then(function(res) {
      const { data, headers } = res
      console.log('headers', headers)
      // console.log('data', data)
      const fileName = headers['content-disposition'].replace(
        /\w+;filename=(.*)/,
        '$1'
      )
      const blob = new Blob([data], { type: headers['content-type'] })
      const dom = document.createElement('a') // 创建a标签
      const url = window.URL.createObjectURL(blob) // 创建下载的链接
      dom.href = url
      dom.download = decodeURI(fileName) // 下载后文件名
      document.body.appendChild(dom)
      dom.click() // 点击下载
      document.body.removeChild(dom) // 下载完成移除元素
      window.URL.revokeObjectURL(url) // 释放掉blob对象
    })
    .catch((err) => {
      console.log(err)
    })
}
