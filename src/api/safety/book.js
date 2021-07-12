import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.safetyEdu

// 获取培训课件列表
export function getBookList({
  pageNum,
  pageSize,
  kjName,
  pxTitleId,
  pxClassId
}) {
  return request({
    url:
      serviceName +
      `/trainCourseware/list?pageNum=${pageNum}&pageSize=${pageSize}&kjName=${kjName}&pxTitleId=${pxTitleId}&pxClassId=${pxClassId}`,
    method: 'get'
  })
}
// 新增培训课件  换一个接口
// export function getAddBook(data) {
//   return request({
//     url: serviceName + '/trainCourseware',
//     method: 'post',
//     data
//   })
// }
export function getAddBook(data) {
  data = Object.entries(data).reduce((t, v) => {
    Reflect.apply(t.append, t, v)
    return t
  }, new FormData())
  return request({
    url: serviceName + '/trainCourseware/upload',
    method: 'post',
    data: data
  })
}
// 编辑培训课件
export function getEditBook(data) {
  data = Object.entries(data).reduce((t, v) => {
    Reflect.apply(t.append, t, v)
    return t
  }, new FormData())
  return request({
    url: serviceName + '/trainCourseware/editAndUpload',
    method: 'put',
    data
  })
}
//查看接口
export function getBookDetail(traincoursewareId) {
  return request({
    url: serviceName + '/trainCourseware/' + traincoursewareId,
    method: 'get'
  })
}
//删除
export function getDeleteBook(traincoursewareId) {
  return request({
    url: serviceName + '/trainCourseware/' + traincoursewareId,
    method: 'delete'
  })
}
// 培训类别、培训主题数结构
export function getPxleibiePxzhutiTreeData() {
  return request({
    url: serviceName + '/trainCourseware/getPxleibiePxzhutiTreeData',
    method: 'get'
  })
}
///测试
// export function getNeedList() {
//   return request({
//     url: serviceName + '/demo/gettest',
//     method: 'post'
//   })
// }
