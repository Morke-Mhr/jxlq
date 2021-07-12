import request from '@/utils/request'
import store from '@/store'
import axios from 'axios'
import {getToken} from '@/utils/auth'

const serviceName = store.state.serviceName.jurisdiction
const technology = store.state.serviceName.technology

// 获取分类字典列表
export function getClassList() {
    return request({
        url: serviceName + '/class/dict/list',
        method: 'get'
    })
}

//新增
export function getAddClassList(data) {
    return request({
        url: serviceName + '/class/dict/add',
        method: 'post',
        data
    })
}

//修改
export function getUpdataClassList(data) {
    return request({
        url: serviceName + '/class/dict/edit',
        method: 'post',
        data
    })
}

//查看
export function getClassSelect(classdictId) {
    return request({
        url: serviceName + '/class/dict/details?classdictId=' + classdictId,
        method: 'get'
    })
}

//删除
export function getDeleteClass(classdictId) {
    return request({
        url: serviceName + '/class/dict/delete?classdictId=' + classdictId,
        method: 'get'
    })
}

//获取安全教育培训的主题下拉列表
export function getSelectTheme(dictType) {
    return request({
        url: serviceName + '/dict/data/dictType/' + dictType,
        method: 'get'
    })
}

//获取安全教育培训的分类下拉列表
export function getSelectClass(dictNumber) {
    return request({
        url: serviceName + '/class/dict/dictNumber/' + dictNumber,
        method: 'get'
    })
}

//获取作业指导书作业类别下拉列表
export function getSelectWorkType(dictType) {
    return request({
        url: serviceName + '/dict/data/dictType/' + dictType,
        method: 'get'
    })
}

//获取人员台账证书类别
export function getSelectLce(dictType) {
    return request({
        url: serviceName + '/dict/data/dictType/' + dictType,
        method: 'get'
    })
}

//获取人员台账学历
export function getSelectEdu(dictType) {
    return request({
        url: serviceName + '/dict/data/dictType/' + dictType,
        method: 'get'
    })
}

//获取安全技术项目类型下拉
export function getSelectTechItem(dictType) {
    return request({
        url: serviceName + '/dict/data/dictType/' + dictType,
        method: 'get'
    })
}

//封装扫码查询专家会审信息
export function getCode(params) {
    return request({
        url: technology + '/expertReview/getCode',
        method: 'get',
        params: params
    })
}

//根据业务类型和主键扫码查询业务信息
export function getOpinionCode(params){
	return axios({
        url:
            store.state.apiConfiguration.url +
            technology +
            '/newExpertReviewOpinion/getCode',
        params: params ? params : '',
        method: 'get'
        // headers: {
        //   Authorization: getToken()
        // }
    })
}

//获取方案详情和技术交底详情
export function getDisclosureInfo(params){
	return axios({
        // url:
        //     store.state.apiConfiguration.url +
        //     technology +
        //     '/newDisclosureHead/getCode',
		url:
		    store.state.apiConfiguration.url +
		    technology +
		    '/newDisclosureHead/getCode',
        params: params ? params : '',
        method: 'get'
    })
}

//上传签名接口
// export function fsUpload(params){
// 	return axios({
//         // url:
//         //     store.state.apiConfiguration.url +
//         //     technology +
//         //     '/newDisclosureHead/getCode',
// 		url:
// 		    store.state.apiConfiguration.url +
// 		    serviceName +
// 		    '/fs/upload',
//         params: params ? params : '',
//         method: 'post'
//     })
// }

//新增民工会审签字
export function postWorkerSign(params){
	return axios({
        // url:
        //     store.state.apiConfiguration.url +
        //     technology +
        //     '/newDisclosureHead/getCode',
		url:
		    store.state.apiConfiguration.url +
		   technology +
		    '/newDisclosureHead/migrantWorker/sign',
        data: params ? params : '',
        method: 'post'
    })
}

export function exportWord(params) {
    return axios({
        url:
            store.state.apiConfiguration.url +
            technology +
            '/technologyConfess/exportWord',
			params: params ? params : '',
			responseType: 'blob',
			headers: {
				Authorization: getToken()
			}
    })
        .then(function (res) {
            // const blob = new Blob([response.data], {
            //   type: 'application/octet-stream'
            // })
            const {data, headers} = res
            console.log('headers', headers)
            // console.log('data', data)
            const fileName = headers['content-disposition'].replace(
                /\w+;filename=(.*)/,
                '$1'
            )
            const blob = new Blob([data], {type: headers['content-type']})
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

// 扫码查询专家会审信息
export function expertReviewOpinion(params) {
    return axios({
        url:
            store.state.apiConfiguration.url +
            technology +
            '/expertReviewOpinion/getCode',
        params: params ? params : '',
        method: 'get'
        // headers: {
        //   Authorization: getToken()
        // }
    })
    // return request({
    //   url: technology + '/expertReviewOpinion/getCode',
    //   method: 'get',
    //   params: params
    // })
}



// 获取验证码
export function getMyCode(data) {
    console.log('获取验证码2')

    return axios({
        url:
            store.state.apiConfiguration.url +
            serviceName +
            '/expertReviewSendSms',
        data: data ? data : '',
        method: 'post'
    })
}

export function expertReviewOpinionAdd(data) {
    return axios({
        url:
            store.state.apiConfiguration.url +
            technology +
            '/expertReviewOpinion/add',
        data: data ? data : '',
        method: 'post'
        // headers: {
        //   Authorization: getToken()
        // }
    })
    // return request({
    //   url: technology + '/expertReviewOpinion/add',
    //   method: 'post',
    //   data: data
    // })
}

export function newExpertReviewOpinionAdd(data) {
    return axios({
        url:
            store.state.apiConfiguration.url +
            technology +
            '/newExpertReviewOpinion/add',
        data: data ? data : '',
        method: 'post'
    })

}

// //获取安全技术项目进度下拉
// export function getSelectTechSchd(dictType) {
//   return request({
//     url: serviceName + '/dict/data/dictType/' + dictType,
//     method: 'get',
//   })
// }
