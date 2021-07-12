

import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.accidentEmergency
const serviceWth = store.state.serviceName.process
const service = store.state.serviceName.jurisdiction



//获取列表
export function getList() {
    return request({
        url: serviceName + '/accident/list',
        method: 'get',
    })
}
//查询
export function getInquire(pageNum, pageSize, nature, occurTime, occurPlace, infoSource, createBy, createByDept, iphone
) {
    return request({
        url: serviceName + `/accident/list?pageNum=${pageNum}&pageSize=${pageSize}&natureId=${nature}&occurTime=${occurTime}&occurPlace=${occurPlace}&infoSource=${infoSource}&createBy=${createBy}&createByDept=${createByDept}&iphone=${iphone}`,
        method: 'get',
    })
}


//新增
export function getAddList(data) {
    return request({
        url: serviceName + '/accident/add',
        method: 'post',
        data
    })
}
//删除
export function getDelete(data) {
    return request({
        url: serviceName + '/accident/' + data,
        method: 'delete',
    })
}
//查看，编辑
export function getCheck(emergencyplanId) {
    return request({
        url: serviceName + `/accident/${emergencyplanId}`,
        method: 'get',
    })
}


//修改
export function getChangeList(data) {
    return request({
        url: serviceName + '/accident/edit',
        method: 'put',
        data
    })
}
//新增备案表单
export function addRecords(data) {
    return request({
        url: serviceName + '/emergencyPlan/add',
        method: 'post',
        data
    })
}

//文件删除
export function fsDelete(fileId) {
    return request({
        url: serviceName + `/workstandardFile/deleteById/${fileId}`,
        method: 'delete',
    })
}
//事故区域
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
        url: service + '/dept/treeselect',
        method: 'get',
    })
}
//人员
export function getUserList(deptId) {
    return request({
        url: service + `/user/getUserListByDeptId?deptId=${deptId}`,
        method: 'get'
    })
}
//获取续报列表
export function getContinueList(accidentId) {
    return request({
        url: serviceName + `/accidentRenewal/list?accidentId=${accidentId}`,
        method: 'get',
    })
}
export function getContinueInquire(accidentId, pageNum, pageSize, occurTime, createByDept, createBy) {
    return request({
        url: serviceName + `/accidentRenewal/list?accidentId=${accidentId}&pageNum=${pageNum}&pageSize=${pageSize}&occurTime=${occurTime}&createByDept=${createByDept}&createBy=${createBy}`,
        method: 'get',
    })
}


//续报列表新增
export function getContinueAdd(data) {
    return request({
        url: serviceName + `/accidentRenewal/add`,
        method: 'post',
        data
    })
}
//续报列表删除
export function getContinueDelete(accidentId) {
    return request({
        url: serviceName + '/accidentRenewal/' + accidentId,
        method: 'delete',
    })
}
//根据id获取续报详情
export function getContinueDetails(accidentId) {
    return request({
        url: serviceName + '/accidentRenewal/' + accidentId,
        method: 'get',
    })
}
//根据id修改事故续报
export function getContinuePut(data) {
    return request({
        url: serviceName + '/accidentRenewal/edit',
        method: 'put',
        data
    })
}
