import request from '@/utils/request'
import store from '@/store'

const serviceNameR = store.state.serviceName.regulation
const serviceName = store.state.serviceName.jurisdiction
const serviceNameS = store.state.serviceName.safetyEdu


// 基层首页-查询课件的视频列表
export function videoList() {
    return request({
        url: serviceNameS + '/trainCourseware/homePage/videoList',
        method: 'get',
    })
}
//获取作业指导书列表
export function getList() {
    return request({
      url: serviceNameR + '/workstandardDoc',
      method: 'get',
    })
  }
//添加人员公告已阅
export function noticeView(noticeId) {
  return request({
    url: serviceName + `/tbNotice/noticeView?noticeId=${noticeId}`,
    method: 'get',
  })
}
