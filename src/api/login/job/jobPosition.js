import request from '@/utils/request'
import store from '@/store'

// const serviceName = store.state.serviceName.mock
const serviceName = store.state.serviceName.org

// 获取岗位职责
export function getJobPosition(postId) {
  return request({
    url: serviceName + '/businessPost/getPostWprocessGuide/' + postId,
    method: 'get'
  })
}
// 编辑岗位职责
export function getEditJob(data) {
  return request({
    url: serviceName + '/businessPost',
    method: 'put',
    data
  })
}

//查看指导书窗口
export function getLookWorkAlert({fileId}) {
  return request({
    url: serviceName + `/wprocessGuide/getGuideDetail/${fileId}`,
    method: 'get',
  })
}
