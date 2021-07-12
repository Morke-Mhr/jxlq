import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import permission from './modules/permission'
import apiConfiguration from './apiConfiguration.js'
import approvalProcess from './modules/approvalProcess'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    permission,
    showSdialog() {
      this._vm.$refs.sdialog.isShow = true
      this._vm.$refs.sdialog.treedata = []
    }
  },
  state: {
    //jxlq
    serviceName: {
      //登录
      login: 'jxlq-system-service',
      //系统模块
      jurisdiction: 'jxlq-system-service',
      //消息服务
      message: 'jxlq-message-service',
      //岗位职责
      org: 'jxlq-system-service',
      //任务模块
      task: 'jxlq-task-service',
      // 安全考核
      assessment: 'jxlq-hiddendanger-service',
      //测验模块
      examination: 'jxlq-exam-service',
      //安全技术模块
      technology: 'jxlq-safemanage-service',
      //安全教育模块
      safetyEdu: 'jxlq-train-service',
      //工作流模块
      process: 'jxlq-activiti-service',
      addWorkMock: 'jxlq-system-service',
      //法律法规
      regulation: 'jxlq-emergency-service',
      //特种设备
      specialEquipment: 'jxlq-safemanage-service',
      //应急事故
      accidentEmergency: 'jxlq-safemanage-service',
      // lw: 'jxlq-hiddendanger-service'
      lw: 'jxlq-hiddendanger-service'
      // lw: 'jxlq-hiddendanger-service'
    },
    gateway: {
      $process: ':8001',
      // ljk
      $safetyEdu: ':8007',
      $mock: ':8080/app/mock/17',
      $addWorkMock: ':8080/app/mock/20',
      $safetyEduMock: ':8007/app/mock/17',
      $orgMock: ':8080/app/mock/17',
      $technology: ':8009',
      //岗位变更新增指导书列表
      $addBook: ':8017'
    },
    apiConfiguration,
    // 合并的路由对象
    routers_: {},
    pathHeader: '',
    approvalProcess,
    // 右侧tab所选项
    tabActive: '',
    // 跳转是否自动切换到第一个tab
    isRefresh: true
  },
  getters,
  mutations: {}
})

export default store
