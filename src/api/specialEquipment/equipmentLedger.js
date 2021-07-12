import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.specialEquipment
const serviceNameS = store.state.serviceName.jurisdiction


//获取检查记录列表
export function getList() {
    return request({
        url: serviceName + '/specialDev/list',
        method: 'get',
    })
}
//获取单个列表数据
export function getIdList(data) {
    return request({
        url: serviceName + `/specialDev/getDetail/${data}`,
        method: 'get',
    })
}

//台账新增
export function getAddList(data) {
    return request({
        url: serviceName + '/specialDev/add',
        method: 'post',
        data
    })
}
//检查记录新增
export function postAddList(data) {
    return request({
        url: serviceName + '/specialdevTest/add',
        method: 'post',
        data
    })
}

//修改
export function getPutList(data) {
    return request({
        url: serviceName + '/specialDev',
        method: 'put',
        data
    })
}

//删除
export function getDelete(specialdevIds) {
    return request({
        url: serviceName + `/specialDev/${specialdevIds}`,
        method: 'delete',
    })
}
//查询
export function getInquire(pageNum, pageSize,devName, devModel, useTime, statusName, dept, factory, testCycle) {
    return request({
        url: serviceName + `/specialDev/list?pageNum=${pageNum}&pageSize=${pageSize}&devName=${devName}&devModel=${devModel}&useTime=${useTime}&statusName=${statusName}&dept=${dept}&factory=${factory}&testCycle=${testCycle}`,
        method: 'get',
    })
}
//部门选择
export function treeselect() {
    return request({
        url: serviceNameS + '/dept/treeselect',
        method: 'get',
    })
}
//人员
export function getUserList(deptId) {
    return request({
        url: serviceNameS + `/user/getUserListByDeptId?deptId=${deptId}`,
        method: 'get'
    })
}

//设备状态
export function specialequipment(dictNumber) {
    return request({
        url: serviceNameS + `/dict/data/dictType/${dictNumber}`,
        method: 'get',
    })
}
