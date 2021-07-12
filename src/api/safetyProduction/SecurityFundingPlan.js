// <!-- 安全经费计提计划-->

import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.accidentEmergency
const serviceWth = store.state.serviceName.process
const service = store.state.serviceName.jurisdiction



//获取列表
export function getList() {
    return request({
        url: serviceName + '/fundAccrual/list',
        method: 'get',
    })
}
//新增
export function getAddList(data) {
    return request({
        url: serviceName + '/fundAccrual/saveOrUpDate',
        method: 'post',
        data
    })
}
//删除
export function getDelete(data) {
    return request({
        url: serviceName + '/fundAccrual/deletes/' + data,
        method: 'delete',
    })
}
//查询
export function getInquire(pageNum, pageSize, fundTypeId, bid, planTime, projectName, money) {
    return request({
        url: serviceName + `/fundAccrual/list?pageNum=${pageNum}&pageSize=${pageSize}&fundTypeId=${fundTypeId}&bid=${bid}&planTime=${planTime}&projectName=${projectName}&money=${money}`,
        method: 'get',
    })
}

//查看，编辑
export function getCheck(fundaccruald) {
    return request({
        url: serviceName + `/fundAccrual/${fundaccruald}`,
        method: 'get',
    })
}


//项目获取
export function getProjectList() {
    return request({
      url: serviceName + '/fundPlan/list',
      method: 'get',
    })
  }
export function getProject(pageNum, pageSize, fundTypeId, deptName, planTime, projectName, money) {
    return request({
        url: serviceName + `/fundPlan/list?pageNum=${pageNum}&pageSize=${pageSize}&fundTypeId=${fundTypeId}&deptName=${deptName}&planTime=${planTime}&projectName=${projectName}&money=${money}`,
        method: 'get',
    })
}

//经费类别
export function Classification(dictNumber) {
    return request({
        url: service + `/dict/data/dictType/${dictNumber}`,
        method: 'get',
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
//部门选择
export function treeselect() {
    return request({
        url: service + '/dept/getTreeDeptByLogin',
        method: 'get',
    })
}

//获取岗位变更的下一个流程节点接口
export function getChangeJobNextNode(businessCode ) {
    return request({
      url:
      serviceWth +
        `/business/getFirstUsertaskNoStart?businessCode=${businessCode}`,
      method: 'get'
    })
  }
