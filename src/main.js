import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import '@/assets/icon/iconfont.css'

// 按钮级权限校验（没做页面深层嵌套时校验）
import has from './directive/jurisdiction.js'

import VueParticles from 'vue-particles'
import Print from 'vue-print-nb'
//bpmn-js
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

// 全局过滤器
import filters from '@/utils/filters.js'
// for (let key in filters) {
//   Vue.filter(key, filters[key])
// }
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
//自定义表单组件
import EleForm from 'vue-ele-form';
import FRender from 'f-render';
import EleFormQuillEditor from 'vue-ele-form-quill-editor'
Vue.use(EleForm);
Vue.component("f-render", FRender);
Vue.component("quill-editor", EleFormQuillEditor);
import echarts from 'echarts'
Vue.prototype.$echarts = echarts;
import 'echarts/map/js/china'
import "echarts/lib/component/title";

// 1.全局引用 视频播放依赖
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
// import Video from 'video.js'

// Vue.prototype.$video = Video
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  // const { mockXHR } = require('../mock')
  // mockXHR()
}
import VCharts from 'v-charts'//引入图表
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
Vue.use(VueParticles)
Vue.use(Print)
Vue.use(VCharts)
Vue.config.productionTip = false

Vue.prototype.$dateFormat = function (fmt, date) {
  if (!date) {
    date = new Date()
  }
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  }
  return fmt
}

function setupWebViewJavascriptBridge(callback) {
	if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
	if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
	window.WVJBCallbacks = [callback];
	var WVJBIframe = document.createElement('iframe');
	WVJBIframe.style.display = 'none';
	WVJBIframe.src = 'https://__bridge_loaded__';
	document.documentElement.appendChild(WVJBIframe);
	setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
