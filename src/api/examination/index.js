import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.examination
const systemName = store.state.serviceName.jurisdiction



//查询题目列表
export function getTopicList(params) {
  return request({
    url: serviceName + '/question',
    method: 'get',
    params
  })
}

// 新增题目
export function postTopicList(params) {
  return request({
    url: serviceName + '/question',
    method: 'post',
    data: params
  })
}


// 查询 题目 根据ID
export function getTopicDtails(examinationId, params) {
  return request({
    url: serviceName + '/question/' + examinationId,
    method: 'get',
    data: params
  })
}


// 删除 题目 根据ID
export function deleteTopicDtails(examinationId) {
  return request({
    url: serviceName + '/question/' + examinationId,
    method: 'delete',
  })
}


// 修改 题目
export function putTopicDtails(params) {
  return request({
    url: serviceName + '/question',
    method: 'put',
    data: params
  })
}
//查询题组列表
export function getPaperList(params) {
  // debugger
  return request({
    url: serviceName + `/paper`,
    method: 'get',
    params
  })
}

// //查询题组列表
// export function getPaperQuery(pageSize, pageNum, subjectId, disciplineId, paperTypeId, status) {
//   return request({
//     url: serviceName + `/paper?pageSize=${pageSize}&pageNum=${pageNum}&subjectId=${subjectId}&disciplineId=${disciplineId}&paperTypeId=${paperTypeId}&status=${status}`,
//     method: 'get',
//   })
// }

//删除题组
export function delPaper(paperId) {
  return request({
    url: serviceName + '/paper/' + paperId,
    method: 'delete',
  })
}

//根据ID查询题组详细信息
export function getPaperId(params) {
  return request({
    url: serviceName + '/paper/' + params,
    method: 'get',
  })
}

//查询选题列表
export function getSelectedTopicList(data) {
  console.log(222,data)
  return request({
    url: serviceName + '/paper/question',
    method: 'post',
    data: data
  })
}
// 查询 计划 列表
export function getexamPlanList(params) {
  return request({
    url: serviceName + '/examPlan',
    method: 'get',
    params
  })
}
// 弹出框的 查询 计划 列表
export function getexamOtherPlanList(params) {
  return request({
    url: serviceName + '/examPlan/trainPlan/getExamPlanList',
    method: 'get',
    params
  })
}

// 新增计划
export function postexamPlan(params) {
  return request({
    url: serviceName + '/examPlan',
    method: 'post',
    data: params
  })
}

// 修改计划
export function putexamPlan(params) {
  return request({
    url: serviceName + '/examPlan',
    method: 'put',
    data: params
  })
}

// 根据ID查找 计划详细信息
export function getExamPlanID(examPlanId, paramsData) {
  return request({
    url: serviceName + '/examPlan/' + examPlanId,
    method: 'get',
    params: paramsData ? paramsData : ''
  })
}

//  刷新测验计划排名
export function gethandRefreshRank(examPlanId) {
  return request({
    url: serviceName + '/examPlan/handRefreshRank',
    method: 'post',
    params: examPlanId
  })
}

// 删除计划
export function delExamPlanID(examPlanId) {
  return request({
    url: serviceName + '/examPlan/' + examPlanId,
    method: 'delete',
  })
}

// 我的测试
export function getExamMyTest(params) {
  return request({
    url: serviceName + '/myTest/plan',
    method: 'get',
    params: params ? params : ""
  })
}

// 我的测试 - 题组列表
export function getTestPaperList(planId, params) {
  return request({
    url: serviceName + `/myTest/${planId}/paper`,
    method: 'get',
    params: params ? params : ""
  })
}

// 我的测试 - 查看试卷 题目列表
export function getTestquestionList(paperId, params) {
  return request({
    url: serviceName + `/myTest/${paperId}/question`,
    method: 'get',
    params: params ? params : ""
  })
}

// 我的测试 - 开始考试
export function getmyTeststartQuestion(paperId, params) {
  return request({
    url: serviceName + `/myTest/${paperId}/startQuestion`,
    method: 'get',
    params: params ? params : ""
  })
}

// 我的测试 - 查看试卷 
export function getmyTestshowQuestion(paperId, params) {
  return request({
    url: serviceName + `/myTest/${paperId}/showQuestion`,
    method: 'get',
    params: params ? params : ""
  })
}


// 我的测试 - 交卷
export function postMyTest(params) {
  return request({
    url: serviceName + `/myTest`,
    method: 'post',
    data: params
  })
}

// 查看计划各科成绩
export function getTestPlanScore(examPlanId) {
  return request({
    url: serviceName + `/myTest/${examPlanId}/score`,
    method: 'get',
  })
}



//统计
export function getStatisticsList(params) {
  return request({
    url: serviceName + '/exam/statistics',
    method: 'get',
    params
  })
}

//获取字典门类
export function getSelectType(topicType) {
  return request({
    url: systemName + '/dict/data/dictType/' + topicType,
    method: 'get',
  })
}

//新增题组
export function postTest(data) {
  return request({
    url: serviceName + '/paper',
    method: 'post',
    data
  })
}

//修改题组
export function putTest(data) {
  return request({
    url: serviceName + '/paper',
    method: 'put',
    data
  })
}
//根据编号ID获取题组信息
export function getFindOne(ID) {
  return request({
    url: serviceName + '/paper/findOne/' + ID,
    method: 'get',
  })
}

//根据编号ID获取计划人员信息
export function getExamPlanIDuser(params) {
  console.log(params)
  return request({
    url: serviceName + '/examPlan/getUsersByExamPlanId',
    method: 'get',
    params
  })
}

//获取题型
export function getExamType() {
  return request({
    url: systemName + '/dict/data/dictType/exam_type',
    method: 'get',
  })
}
