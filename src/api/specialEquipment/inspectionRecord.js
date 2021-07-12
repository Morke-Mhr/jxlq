// 特种设备

import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.specialEquipment
const serviceNameS = store.state.serviceName.jurisdiction


//获取台账列表
export function getList() {
    console.log("发请求")
    return request({
        url: serviceName + '/specialdevTest/list',
        method: 'get',
    })
}

//查询
export function getInquire(pageNum, pageSize, devName, devModel, testTime, testUnit, dept, reviewTime, testCycle, nextTestTime, fileName) {
    return request({
        url: serviceName + `/specialdevTest/list?pageNum=${pageNum}&pageSize=${pageSize}&devName=${devName}&devModel=${devModel}&testTime=${testTime}&testUnit=${testUnit}&dept=${dept}&reviewTime=${reviewTime}&testCycle=${testCycle}&nextTestTime=${nextTestTime}&fileName=${fileName}`,
        method: 'get',
    })
}


//查看
export function getCheck(specialdevId) {
    console.log(specialdevId)
    return request({
        url: serviceName + `/specialdevTest/getDetail/${specialdevId}`,
        method: 'get',
    })
}
//修改
export function getChangeList(data) {
    return request({
        url: serviceName + '/specialdevTest',
        method: 'put',
        data
    })
}

//删除
export function getDelete(specialdevId) {
    return request({
        url: serviceName + `/specialDev/${specialdevId}`,
        method: 'delete',
    })
}
//文件删除
export function fsDelete(fileId) {
    return request({
        url: serviceName + `/lawsDocFile/deleteFile/${fileId}`,
        method: 'delete',
    })
}


//部门选择
export function treeselect() {
    return request({
        url: serviceNameS + '/dept/treeselect',
        method: 'get',
    })
}
