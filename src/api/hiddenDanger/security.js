import request from '@/utils/request'
import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { ColorStyle } from 'vue-ele-form-quill-editor'

const jurisdiction = store.state.serviceName.jurisdiction
const lw = store.state.serviceName.lw
const regulation = store.state.serviceName.regulation
const process = store.state.serviceName.process
const serviceName = store.state.serviceName.regulation
const assessment = store.state.serviceName.assessment

// 字典
export function dictType(data) {
  return request({
    url: jurisdiction + `/dict/data/dictType/${data}`,
    method: 'get'
  })
}

// 审批流实例关联业务控制器
export function getBusinessList(params) {
  return request({
    url: process + `/business/getBusinessList`,
    method: 'get',
    params: params
  })
}

// 安全检查标准库：查询
export function safecheckDoc(params) {
  return request({
    url: regulation + `/safecheckDoc/safecheckList`,
    method: 'get',
    params: params
  })
}

// 安全检查记录
// 安全检查记录查询
export function queryAll(params) {
  return request({
    url: lw + `/safecheck/queryAll`,
    method: 'post',
    params: params
  })
}

// 安全检查记录删除
export function deletes(params) {
  return request({
    url: lw + `/safecheck/deletes`,
    method: 'post',
    data: params
  })
}

// 安全检查记录详情查看
export function viewDetail(params) {
  return request({
    url: lw + `/safecheck/viewDetail`,
    method: 'post',
    params: params
  })
}

// 安全检查记录任务处新增
export function submitSafecheck(data) {
  return request({
    url: lw + `/safecheck/submitSafecheck`,
    method: 'post',
    data: data
  })
}

// 修改安全检查记录++重新提交
export function updateSafecheck(data) {
  return request({
    url: lw + `/safecheck/updateSafecheck`,
    method: 'put',
    data: data
  })
}

// 隐患上报
// 隐患上报记录全部查询
export function hQueryAll(params) {
  return request({
    url: lw + `/hiddendanger/queryAll`,
    method: 'post',
    params: params
  })
}

// 隐患上报/分配记录删除
export function hDeletes(params) {
  return request({
    url: lw + `/hiddendanger/deletes`,
    method: 'post',
    data: params
  })
}

// 隐患上报记录编辑查看
export function editView(params) {
  return request({
    url: lw + `/hiddendanger/editView`,
    method: 'post',
    params: params
  })
}

// 隐患上报记录提交(新增或修改)
export function submitHiddendanger(params) {
  return request({
    url: lw + `/hiddendanger/submitHiddendanger`,
    method: 'post',
    data: params
  })
}

// 隐患上报二维码生成所需数据
export function getQrCodeData() {
  return request({
    url: lw + `/hiddendanger/getQrCodeData`,
    method: 'post'
  })
}

// 隐患分配
// 隐患分配全部查询
export function allocationList(params) {
  return request({
    url: lw + `/hiddendanger/allocationList`,
    method: 'post',
    params: params
  })
}

// 隐患分配编辑页
export function allocationView(params) {
  return request({
    url: lw + `/hiddendanger/allocationView`,
    method: 'post',
    params: params
  })
}

// 隐患分配提交
export function allocationSubmit(data) {
  return request({
    url: lw + `/hiddendanger/allocationSubmit`,
    method: 'post',
    data: data
  })
}

// 隐患签收
// 隐患签收全部查询
export function signForList(params) {
  return request({
    url: lw + `/hiddendanger/signForList`,
    method: 'post',
    params: params
  })
}

// 隐患签收编辑查看接口
export function signForView(params) {
  return request({
    url: lw + `/hiddendanger/signForView`,
    method: 'post',
    params: params
  })
}

// 隐患签收编辑
export function signForEdit(params) {
  return request({
    url: lw + `/hiddendanger/signForEdit`,
    method: 'post',
    data: params
  })
}

// 隐患整改
// 隐患整改全部查询
export function rectifyList(params) {
  return request({
    url: lw + `/hiddendanger/rectifyList`,
    method: 'post',
    params: params
  })
}

// 隐患整改查看
export function rectifyView(params) {
  return request({
    url: lw + `/hiddendanger/rectifyView`,
    method: 'post',
    params: params
  })
}

// 隐患整改记录修改++++重新申请
export function updateRectify(data) {
  return request({
    url: lw + `/hiddendanger/updateRectify`,
    method: 'post',
    data: data
  })
}

// 隐患整改编辑
export function rectifyEdit(data) {
  return request({
    url: lw + `/hiddendanger/rectifyEdit`,
    method: 'post',
    data: data
  })
}

// 隐患整改异常申请
export function deviantApply(data) {
  return request({
    url: lw + `/hiddendanger/deviantApply`,
    method: 'post',
    data: data
  })
}

// 隐患记录
// 隐患记录全部查询
export function recordList(params) {
  return request({
    url: lw + `/hiddendanger/recordList`,
    method: 'post',
    params: params
  })
}

// 隐患记录查看
export function recordView(params) {
  return request({
    url: lw + `/hiddendanger/recordView`,
    method: 'post',
    params: params
  })
}

// 验收记录接口
export function showApplyhistory(params) {
  return request({
    url: process + `/task/showApplyhistoryBybusinessKey`,
    method: 'get',
    params: params
  })
}

// 隐患知识库表：增加
export function yhknowledgeDoc(data) {
  return request({
    url: regulation + `/yhknowledgeDoc`,
    method: 'post',
    data: data
  })
}

// 隐患打印功能
export function exportWord(params) {
  return axios({
    url: store.state.apiConfiguration.url + lw + `/hiddendanger/exportWord`,
    params: params ? params : '',
    responseType: 'blob',
    headers: {
      Authorization: getToken()
    }
  })
    .then(function(res) {
      // const blob = new Blob([response.data], {
      //   type: 'application/octet-stream'
      // })
      const { data, headers } = res
      console.log('headers', headers)
      // console.log('data', data)
      const fileName = headers['content-disposition'].replace(
        /\w+;filename=(.*)/,
        '$1'
      )
      const blob = new Blob([data], {
        type: headers['content-type']
      })
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

export function exportZgnoticeWord(params) {
  return axios({
    url:
      store.state.apiConfiguration.url +
      lw +
      `/hiddendanger/hiddenDangerRectificationNotice/exportWord`,
    params: params ? params : '',
    responseType: 'blob',
    headers: {
      Authorization: getToken()
    }
  })
    .then(function(res) {
      const { data, headers } = res
      const fileName = headers['content-disposition'].replace(
        /\w+;filename=(.*)/,
        '$1'
      )
      const blob = new Blob([data], {
        type: headers['content-type']
      })
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

// 隐患复现
// 隐患复现查询页
export function reappearList(params) {
  return request({
    url: lw + `/hiddendanger/reappearList`,
    method: 'post',
    params: params
  })
}

// 隐患复现详情页
export function reappearDetails(params) {
  return request({
    url: lw + `/hiddendanger/reappearDetails`,
    method: 'post',
    params: params
  })
}

//安全日志
//获取列表
export function getList() {
  console.log('发请求')
  return request({
    url: serviceName + '/safeLog/findList',
    method: 'get'
  })
}

//查询
export function getInquire(deptName, postName, createBy, logTime, weatherName) {
  return request({
    url:
      serviceName +
      `/safeLog/findList?deptName=${deptName}&postName=${postName}&createBy=${createBy}&weatherName=${weatherName}`,
    method: 'get'
  })
}
// &logTime=${logTime}
//分页
export function getPaging(pageNum, pageSize) {
  return request({
    url:
      serviceName + `/safeLog/findList?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'get'
  })
}

//查看
export function getCheck(safelogId) {
  return request({
    url: serviceName + `/safeLog/findById?safelogId=${safelogId}`,
    method: 'get'
  })
}
//删除
export function getDelete(dictId) {
  return request({
    url: serviceName + `/safeLog?safelogIds=${dictId}`,
    method: 'delete'
  })
}

// 安全日志打印功能
export function printAqrj(params) {
  return axios({
    url: store.state.apiConfiguration.url + regulation + `/safeLog/exportWord`,
    params: params ? params : '',
    responseType: 'blob',
    headers: {
      Authorization: getToken()
    }
  })
    .then(function(res) {
      const { data, headers } = res
      const fileName = headers['content-disposition'].replace(
        /\w+;filename=(.*)/,
        '$1'
      )
      const blob = new Blob([data], {
        type: headers['content-type']
      })
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

//隐患复现率统计（饼图）
export function getYhFuxian(queryYear) {
  return request({
    url: assessment + `/hiddendanger/getPieYhFuxianLv?queryYear=${queryYear}`,
    method: 'get'
  })
}
//隐患级别统计（饼图）
export function getYhJibie(queryYear) {
  return request({
    url:
      assessment +
      `/hiddendanger/getPieYhRectStatDataLeader?queryYear=${queryYear}`,
    method: 'get'
  })
}
//隐患复现率统计（饼图）
export function getPieYhFuxian(queryYear) {
  return request({
    url: assessment + `/hiddendanger/getPieYhdeptfenbu?queryYear=${queryYear}`,
    method: 'get'
  })
}
//隐患类型统计（折线图）
export function getNewYhLeixinT(queryYear) {
  return request({
    url:
      assessment +
      `/hiddendanger/getLineCharYhClassStat?queryYear=${queryYear}`,
    method: 'get'
  })
}
//隐患类型统计（折线图）
// export function getNewYhLeixinT(queryYear) {
//   return request({
//     url: assessment + '/hiddendanger/getLineCharYhClassStat',
//     data: {
//       queryYear: queryYear
//     },
//     method: 'get'
//   })
// }

//获取安全检查负责人数据（存在业务数据的）
export function getCheckClassList() {
  return request({
    url: lw + `/safecheck/getCheckClassList`,
    method: 'get'
  })
}

//获取安全检查类别数据（存在业务数据的）
export function getCheckTypeList() {
  return request({
    url: lw + `/safecheck/getCheckTypeList`,
    method: 'get'
  })
}
