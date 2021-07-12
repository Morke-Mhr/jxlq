import request from '@/utils/request'
import store from '@/store'
const serviceName = store.state.serviceName.jurisdiction

// 获取公告列表
export function getNoticeList(data) {
  return request({
    url: serviceName + '/tbNotice/queryAll',
    method: 'get',
    params:data
  })
}
//新增通知公告
export function addNotice(data) {
  return request({
    url: serviceName + '/tbNotice/noticeSubmit',
    method: 'post',
    data
  })
}
//通知公告查阅接口
export function noticeRead(noticeId) {
  return request({
    url: serviceName + '/tbNotice/noticeCheck?noticeId='+noticeId,
    method: 'get',
  })
}
//通知公告置顶接口
export function noticeTop(noticeId) {
  return request({
    url: serviceName + '/tbNotice/noticeTop/'+noticeId,
    method: 'get',
  })
}

// 删除通知公告
export function deleteNotice(noticeId) {
  return request({
    url: serviceName + `/tbNotice/deletes/${noticeId}`,
    method: 'delete'
  })
}

// 发布通知公告
export function issueNotice(noticeId) {
  return request({
    url: serviceName + '/tbNotice/noticeRelease?noticeId='+noticeId,
    method: 'get',
  })
}
// 发布通知公告
export function oneNotice(noticeId) {
  return request({
    url: serviceName + '/tbNotice/getOne?noticeId='+noticeId,
    method: 'get',
  })
}