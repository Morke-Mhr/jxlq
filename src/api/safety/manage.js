import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.safetyEdu



// 获取培训管理列表
export function getManageList({pageNum, pageSize,pxTeacher,pxTitleId,pxClassId}) {
  return request({
    url: serviceName + `/trainPlan/trainRecordList?pageNum=${pageNum}&pageSize=${pageSize}&pxTeacher=${pxTeacher}&pxTitleId=${pxTitleId}&pxClassId=${pxClassId}`,
    method: 'get'
  })
}
// 新增培训课件
export function getAddBook(data) {
  return request({
    url: serviceName + '/trainCourseware',
    method: 'post',
    data
  })
}
// 编辑培训课件
export function getEditBook(data) {
  return request({
    url: serviceName + '/trainCourseware',
    method: 'put',
    data
  })
}
//查看接口
export function getBookDetail(traincoursewareId) {
    return request({
      url: serviceName + '/trainCourseware/'  + traincoursewareId,
      method: 'get'
    })
}
//删除
export function getDeleteBook(traincoursewareId) {
  return request({
    url: serviceName + '/trainCourseware/' + traincoursewareId,
    method: 'delete',
  })
}
///测试
// export function getNeedList() {
//   return request({
//     url: serviceName + '/demo/gettest',
//     method: 'post'
//   })
// }
