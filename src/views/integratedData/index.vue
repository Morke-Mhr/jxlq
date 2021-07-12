<template>
  <div class="dashboard-editor-container integrated">
    <div class="navbar">
      <div class="navbar_animation">
        <!-- <img :src="logo" class="logo" />
      <img :src="logo" class="logo" style="visibility: hidden;width:475px;"/>      -->
        <img :src="logo" class="logo" />
      </div>
      <!-- <div class="companyName">{{ companyName }}</div> -->
    </div>
    <div class="echarts-box" v-show="CloseStatus" v-if="CloseMo">
      <el-row :gutter="32" class="chart-row">
        <el-col :lg="7" class="chart-box">
          <div class="chart-wrapper">
            <!-- <router-link target="_blank" :to="{path:'/integratedData'}"> -->
            <p class="chart-title">安全履职</p>
            <!-- </router-link> -->
            <!-- <securitySinceThe :chart-data="securitySinceTheData" /> -->
            <div class="chart-wrapper-body">
              <div class="left-data">
                <div class="left-data-body">
                  <div class="left-data-border">
                    <div class="data-top">
                      <label>{{ SPInfo.educationBefore }}</label>
                      <span>计划培训人数</span>
                    </div>
                    <div class="data-bot">
                      <label>{{ SPInfo.educationAfter }}</label>
                      <span>实际培训人数</span>
                    </div>
                  </div>
                </div>
                <div class="data-tit">安全培训</div>
              </div>
              <div class="mid-data">
                <div class="mid-data-body">
                  <div class="mid-data-border">
                    <div class="data-top">
                      <label>{{ SPInfo.technologyBefore }}</label>
                      <span>计划交底次数</span>
                    </div>
                    <div class="data-bot">
                      <label>{{ SPInfo.technologyAfter }}</label>
                      <span>实际交底次数</span>
                    </div>
                  </div>
                </div>
                <div class="data-tit">计划交底</div>
              </div>
              <div class="right-data">
                <div class="right-data-body">
                  <div class="right-data-border">
                    <div class="data-top">
                      <label>{{ SPInfo.dangerBefore }}</label>
                      <span>隐患整改数</span>
                    </div>
                    <div class="data-bot">
                      <label>{{ SPInfo.dangerAfter }}</label>
                      <span>完成整改数</span>
                    </div>
                  </div>
                </div>
                <div class="data-tit">隐患排查</div>
              </div>
            </div>
          </div>
          <div class="chart-wrapper">
            <!-- <router-link :to="{path:'/safetyEdu/pxtroubleshoot'}"> -->
            <p class="chart-title">
              安全责任书签订
              <span class="more" @click="pageTurn('safetyBook')">
                更多<i class="el-icon-d-arrow-right"></i
              ></span>
            </p>
            <!-- </router-link> -->
            <responsibilityOf
              :date_year="date_year"
              ref="responsibilityOf"
              :key="show + 1"
            />
          </div>
        </el-col>
        <el-col :lg="10" class="chart-box chart-box-lg">
          <div class="chart-wrapper map-data-box">
            <p class="chart-title chart-title-p">
              年度:
              <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                  {{ date_year
                  }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="v of date_yearlist"
                    :key="v"
                    :command="v"
                    >{{ v }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </p>
            <div class="breadcrumb">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item @click.native="fuNationwide"
                  >全国</el-breadcrumb-item
                >
                <el-breadcrumb-item
                  @click.native="fuProvince"
                  v-if="province != ''"
                  >{{ province }}</el-breadcrumb-item
                >
                <el-breadcrumb-item
                  v-if="province != '' && municipality != ''"
                  >{{ municipality }}</el-breadcrumb-item
                >
              </el-breadcrumb>
            </div>
            <map-s
              class="map"
              :height="'536px'"
              @func="getMsgFormSon"
              :date_year="date_year"
              ref="maps"
              :key="show + 9"
            ></map-s>
            <mapData
              class="mapData"
              @risk="risk"
              @pageTurn="pageTurn"
              @fuan="CloseMoList"
              :date_year="date_year"
              ref="mapData"
              :key="show + 4"
            />
            <div class="Map_Popup" v-if="Whether">
              <hr />
              <i @click="openList" class="el-icon-s-unfold"></i>
              <MapPopup ref="children" :person="pmnData" :key="show + 13" />
            </div>
          </div>
        </el-col>
        <el-col :lg="7" class="chart-box">
          <div class="chart-wrapper">
            <p class="chart-title">
              隐患报告
              <span class="more" @click="pageTurn('yhStatistical')">
                更多 <i class="el-icon-d-arrow-right"></i
              ></span>
            </p>
            <hiddenTroubleReport
              :date_year="date_year"
              ref="hiddenTroubleReport"
              :key="show + 3"
            />
          </div>

          <div class="chart-wrapper">
            <!-- <router-link :to="{path:'/safetyEdu/pxtroubleshoot'}"> -->
            <p class="chart-title">
              安全技术交底
              <span class="more" @click="pageTurn('statisticals')">
                更多 <i class="el-icon-d-arrow-right"></i
              ></span>
            </p>
            <!-- <div class="jiaodi-body">
              <div class="jiaodi-body-bg">
                <div class="jiaodi-item-1">
                  <label class="jiaodi-item-tit">三级交底</label>
                  <label class="jiaodi-item-num">
                    {{ thirdObj.completeNumber
                    }}
                    <span>/{{ thirdObj.planNumber }}</span>
                  </label>
                </div>
                <div class="jiaodi-item-2">
                  <label class="jiaodi-item-tit">二级交底</label>
                  <label class="jiaodi-item-num">
                    {{ secondObj.completeNumber
                    }}
                    <span>/{{ secondObj.planNumber }}</span>
                  </label>
                </div>
                <div class="jiaodi-item-3">
                  <label class="jiaodi-item-tit">一级交底</label>
                  <label class="jiaodi-item-num">
                    {{ firstObj.completeNumber
                    }}
                    <span>/{{ firstObj.planNumber }}</span>
                  </label>
                </div>
              </div>
            </div>-->
            <disclose
              :firstObj="firstObj"
              :secondObj="secondObj"
              :key="show"
            />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="32" class="chart-row">
        <el-col :lg="7" class="chart-box">
          <div class="chart-wrapper">
            <p class="chart-title">
              安全培训情况
              <span class="more" @click="pageTurn('manage', '安全培训情况')">
                更多 <i class="el-icon-d-arrow-right"></i
              ></span>
            </p>
            <safetyEducation
              :date_year="date_year"
              ref="safetyEducation"
              :key="show + 2"
            />
          </div>
        </el-col>
        <el-col :lg="10" class="chart-box chart-box-bottomlg">
          <div class="chart-wrapper">
            <div class="list">
              <riskEarlyWarning
                :date_year="date_year"
                ref="riskEarlyWarning"
                :key="show + 5"
              />
              <!-- <router-link :to="{path:'/security/yhStatistical'}"> -->
              <p>风险预警</p>
              <!-- </router-link> -->
            </div>
            <div class="list" @click="performanceA()">
              <majorAccident
                :date_year="date_year"
                ref="majorAccident"
                :key="show + 6"
              />
              <!-- <router-link :to="{path:'/security/yhStatistical'}"> -->
              <!-- <p>无重大安全事故</p> -->
              <!-- </router-link> -->
            </div>
            <div class="list">
              <taskCompletionRate
                :date_year="date_year"
                ref="taskCompletionRate"
                :key="show + 7"
              />
              <!-- <router-link :to="{path:'/security/yhStatistical'}"> -->
              <!-- <p>隐患整改率</p> -->
              <!-- </router-link> -->
            </div>
            <div class="list">
              <signatureOfResponsibility
                :date_year="date_year"
                ref="signatureOfResponsibility"
                :key="show + 8"
              />
              <!-- <router-link :to="{path:'/security/yhStatistical'}"> -->
              <!-- <p>责任书签署</p> -->
              <!-- </router-link> -->
            </div>
          </div>
        </el-col>
        <el-col :lg="7" class="chart-box">
          <div class="chart-wrapper">
            <p class="chart-title">
              风险复现率
              <span class="more" @click="pageTurn('yhRepetition')">
                更多 <i class="el-icon-d-arrow-right"></i
              ></span>
            </p>
            <!-- <safetyAssessmentIncentive /> -->
            <div class="riskt">
              <div class="fIdx">
                <p v-for="(fItem, fIdx) in hiddandangerFuxianList" :key="fIdx">
                  {{ fItem.info }} （{{ fItem.iCount }})
                </p>
                <p
                  v-for="(fItem, fIdx) in hiddandangerFuxianList"
                  :key="fIdx + 10"
                >
                  {{ fItem.info }} （{{ fItem.iCount }})
                </p>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-show="CloseStatus == false">
      <mapList
        ref="childrenMapList"
        @fuan="CloseList"
        :person="pmnData"
      ></mapList>
    </div>
    <!-- 监控视频 -->
    <div v-if="CloseMo == false">
      <monitoringList @fuan="CloseMoList"></monitoringList>
    </div> 
    <!-- 绩效结果 -->
    <div v-if="closePa == true" class="paBox">
      <performanceAppraisal @fuan="paClose"></performanceAppraisal>
    </div>
  </div>
</template>

<script>
import store from '@/store/index.js'
import logoImg from '@/assets/dataBoard/logo.png'
import securitySinceThe from './components/securitySinceThe' //安全履职
import responsibilityOf from './components/responsibilityOf' //安全责任书签署
import maps from './components/map.vue' //地图
import mapData from './components/mapData' //map数据
import MapPopup from './components/MapPopup' //地图弹窗
import mapList from './components/mapList' //项目弹窗数据
import monitoringList from './components/monitoring.vue' //监控视频
import safetyEducation from './components/safetyEducation' //安全教育情况
import technicalDisclosure from './components/technicalDisclosure' //安全技术交底
import hiddenTroubleReport from './components/hiddenTroubleReport' //隐患报告
import majorAccident from './components/majorAccident' //零重大事故
import taskCompletionRate from './components/taskCompletionRate' //任务完成率
import signatureOfResponsibility from './components/signatureOfResponsibility' //责任书签署
import riskEarlyWarning from './components/riskEarlyWarning' //风险预警
import safetyAssessmentIncentive from './components/safetyAssessmentIncentive' //安全考核激励
import disclose from './components/disclose' //技术交底
import performanceAppraisal from './components/performanceAppraisal' //绩效考核
import {
  safetyPerformance,
  technicalDisclosureF,
  editor
} from '@/api/dataBulletinBoard/index'
import { SPECIALPROVINCES } from './components/mapJS/constant'
const securitySinceTheData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165, 120, 82, 91, 154, 162],
    actualData: [120, 82, 91, 154, 162, 140, 145, 80, 52, 98, 82, 67],
    wanData: [80, 52, 98, 82, 67, 80, 88, 82, 91, 80, 52, 98]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}
export default {
  data() {
    return {
      welcomeText: store.getters.userName,
      logo: logoImg,
      companyName: '江西路桥安全生产管理信息化平台',
      securitySinceTheData: securitySinceTheData.newVisitis,
      value: '', //当前时间
      SPInfo: {
        educationBefore: 0,
        educationAfter: 0,
        technologyBefore: 0,
        technologyAfter: 0,
        dangerBefore: 0,
        dangerAfter: 0
      },
      firstObj: '',
      secondObj: '',
      // thirdObj: {},
      // jiaodiRes: {},
      hiddandangerFuxianList: [],
      date_year: '',
      date_yearlist: [],
      show: -1,
      province: '', //省份
      municipality: '', //市
      NationwideData: '', //区
      Whether: false, //数量图表
      pmnData: '',
      CloseStatus: true, //关闭列表
      CloseMo: true,
      frequency: 0,
      closePa: false
    }
  },
  components: {
    securitySinceThe,
    responsibilityOf,
    'map-s': maps,
    mapData,
    safetyEducation,
    hiddenTroubleReport,
    technicalDisclosure,
    majorAccident,
    taskCompletionRate,
    signatureOfResponsibility,
    riskEarlyWarning,
    safetyAssessmentIncentive,
    disclose,
    MapPopup,
    mapList,
    monitoringList,
    performanceAppraisal
  },
  created: function() {
    /**
     * 获取当前时间
     * 格式YYYY-MM-DD
     */
    var aData = new Date()
    this.value =
      aData.getFullYear() +
      ' - ' +
      (aData.getMonth() + 1) +
      ' - ' +
      aData.getDate()
    this.date_year = aData.getFullYear() + ''
    this.date_yearlist = [
      aData.getFullYear() - 3,
      aData.getFullYear() - 2,
      aData.getFullYear() - 1,
      aData.getFullYear()
    ]
    this.dataBulletinBoard()
  },
  beforeCreate() {
    // 修改背景
    document.getElementsByTagName('body')[0].className = 'integrated'
  },
  beforeDestroy() {
    // 销毁背景
    document.getElementsByTagName('body')[0].className = ''
  },
  methods: {
    //打开绩效考核
    performanceA() {
      console.log('//////////////////////////')
      this.closePa = true
    },
    //关闭绩效考核
    paClose(status) {
      this.closePa = status
    },
    //打开列表
    openList() {
      this.CloseStatus = false
      this.$refs.childrenMapList.refreshA(this.pmnData)
    },
    //关闭列表
    CloseList(status) {
      this.CloseStatus = status
    },
    //关闭监控列表
    CloseMoList(status) {
      this.CloseMo = status
    },
    //接收子组件出过来的省市区

    getMsgFormSon(data, pop) {
      if (pop) {
        this.Whether = pop
        this.pmnData = data.name
        if (pop) {
          this.$nextTick(() => {
            //子组件要渲染完后在调用
            this.$refs.children.refresh(this.pmnData)
          })
        }
      } else {
        this.frequency += 1
        if (this.frequency == 1) {
          this.province = data.name
          return
        }
        // 点击的是否是特殊区域，无法下钻三级，'北京', '天津', '上海', '重庆', '香港', '澳门', '台湾'
        if (SPECIALPROVINCES.includes(this.province)) return

        if (this.frequency == 2) {
          this.municipality = data.name
        }
      }
    },
    //点击全国面包屑
    fuNationwide() {
      this.$refs.maps.goBack(true)
      this.province = ''
      this.municipality = ''
      this.Whether = false
      this.frequency = 0
    },
    //点击省份面包屑
    fuProvince() {
      this.$refs.maps.goBack(false)
      this.municipality = ''
      if (this.Whether) {
        this.$nextTick(() => {
          //子组件要渲染完后在调用
          this.$refs.children.refresh(this.province)
        })
      }
      this.frequency = 1
    },
    handleCommand(command) {
      // this.$nextTick(() => {
      //   //子组件要渲染完后在调用
      //   this.$refs.children.refresh();
      // });
      this.Whether = false
      this.date_year = command + ''
      this.dataBulletinBoard().then(() => {
        // this.$refs.responsibilityOf.dataBulletinBoard()
        // this.$refs.mapData.dataBulletinBoard()
        // this.$refs.safetyEducation.dataBulletinBoard()
        // this.$refs.hiddenTroubleReport.dataBulletinBoard()
        // this.$refs.riskEarlyWarning.dataBulletinBoard()
        // this.$refs.taskCompletionRate.dataBulletinBoard()
        // this.$refs.majorAccident.dataBulletinBoard()
        // this.$refs.signatureOfResponsibility.dataBulletinBoard().then(()=>{})
        ++this.show
      })
    },
    // 风险复现
    risk(res) {
      this.hiddandangerFuxianList = res
    },
    // 页面跳转
    pageTurn(tabActive, name) {
      // if(name=="安全培训情况"){
      //  sessionStorage.setItem("safety", "safety");
      // }
      this.$store.state.tabActive = tabActive
      this.$store.state.isRefresh = false
      this.$router.push({
        name: tabActive.toLowerCase()
      })
      // 等跳转页面后 开启模块默认页面
      setTimeout(() => {
        this.$store.state.isRefresh = true
      }, 1500)
    },
    securitySinceTheDatas(type) {
      this.securitySinceTheData = securitySinceTheData[type]
    },
    async dataBulletinBoard() {
      let data = {
        queryYear: this.date_year
      }
      let res = await safetyPerformance(data)
      // this.jiaodiRes = await technicalDisclosureF(data)
      let dates = await editor(data)
      this.firstObj = dates.signingRate
      this.secondObj = dates.completionRate
      for (let i in res) {
        if (res[i].business == 'train') {
          if (res[i].stype == 'plan') {
            this.SPInfo.educationBefore = res[i].scount
          } else {
            this.SPInfo.educationAfter = res[i].scount
          }
        }
        if (res[i].business == 'jiaodi') {
          if (res[i].stype == 'plan') {
            this.SPInfo.technologyBefore = res[i].scount
          } else {
            this.SPInfo.technologyAfter = res[i].scount
          }
        }
        if (res[i].business == 'yinhuan') {
          if (res[i].stype == 'plan') {
            this.SPInfo.dangerBefore = res[i].scount
          } else {
            this.SPInfo.dangerAfter = res[i].scount
          }
        }
      }
    }
  }
}
</script>
<style>
.integrated {
  width: 100%;
  height: 100%;
  background-color: #071538;
  background-image: url(../../assets/dataBoard/dataBg.jpg);
  background-size: cover;
  background-repeat: no-repeat;
}
.el-breadcrumb__inner.is-link {
  color: #ffffff !important;
}
</style>
<style lang="scss" scoped>
/deep/ .el-breadcrumb__inner {
  color: #fff !important;
  cursor: pointer !important;
}
.integrated {
  min-width: 1920px;
}
.breadcrumb {
  margin-top: 38px;
  color: #fff;
  z-index: 99;
  position: absolute;
  margin-left: 160px;
}
.Map_Popup {
  bottom: -200px;
  // right: 14px;
  width: 170px;
  height: 200px;
  position: relative;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  hr {
    margin-top: 30px;
    position: absolute;
    width: 166px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    color: #aaaaaa;
  }
  .el-icon-s-unfold {
    position: absolute;
    right: 8px;
    top: 38px;
    color: #fff;
    cursor: pointer;
    z-index: 100;
  }
}
.navbar {
  // width: 100%;
  width: 1920px;
  height: 58px;
  text-align: center;
  background-image: url(../../assets/dataBoard/titleBg.png);
  background-size: cover;
  background-repeat: no-repeat;
  // border-bottom: 1px solid #808080;
}

.integrated {
  width: 100%;
  height: 100%;
  background-color: #071538;
  background-image: url(../../assets/dataBoard/dataBg.jpg);
  background-size: cover;
  background-repeat: no-repeat;
}
// .navbar_animation{
//   width: 34%;
//   margin: 0 auto;
//   overflow: hidden;
//   display: flex;
// }
.logo {
  margin-top: 8px;
  width: 390px;
  // margin-left: 80px;
  // -webkit-animation: 20s move linear infinite normal;
  // animation: 20s move linear infinite normal;
}
@keyframes move {
  0% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
  100% {
    -webkit-transform: translateX(-1192px);
    transform: translateX(-1192px);
  }
}
.companyName {
  display: block;
  color: #ffffff;
  font-size: 18px;
  line-height: 80px;
  float: left;
}

.echarts-box {
  margin: 24px 15px 0;
  overflow: hidden;
}

.chart-row {
  margin: 0 !important;
}

.chart-box {
  width: 473px;
  padding: 0 !important;
  margin-right: 16px;
}

.chart-row .chart-box:last-child {
  margin-right: 0;
}

.chart-box-lg,
.chart-box-bottomlg {
  width: 912px;
}

.chart-title {
  font-size: 18px;
  margin: 0px;
  color: #00eaff;
  line-height: 38px;
  font-family: PingFang SC;
}

.chart-wrapper {
  width: 473px;
  min-height: 281px;
  padding: 0 18px;
  margin-bottom: 14px;
  background-image: url(../../assets/dataBoard/modulesBg.png);
  background-size: cover;
  background-repeat: no-repeat;
  // border: 1px solid #ffffff;
  // border-radius: 8px;
}

.map-data-box {
  position: relative;
}

.map {
  position: absolute;
  top: 50px;
  left: 31%;
}

.mapData {
  position: absolute;
  top: 0;
  left: 0;
}

.chart-box-lg .chart-wrapper {
  width: 912px;
  min-height: 574px;
  background-image: url(../../assets/dataBoard/maps.png);
  background-size: cover;
  background-repeat: no-repeat;
  margin-top: 1px;
}

.chart-box-bottomlg .chart-wrapper {
  width: 912px;
  min-height: 281px;
  background-image: url(../../assets/dataBoard/moduleBg.png);
  background-size: cover;
  background-repeat: no-repeat;
  margin-top: 0;
}

.chart-title-p {
  text-align: right;
}

.list {
  width: 218px;
  float: left;
  overflow: hidden;
}

.list p {
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  height: 72px;
  line-height: 24px;
  margin: 0;
  text-align: center;
}

.chart-wrapper-body {
  width: 100%;
  display: flex;
  padding-top: 20px;
}

.left-data,
.mid-data,
.right-data {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.left-data-body,
.mid-data-body,
.right-data-body {
  width: 80%;
  height: 180px;
  border-radius: 10px;
}

.left-data-border,
.mid-data-border,
.right-data-border {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}

.left-data-body {
  background: rgba(0, 253, 251, 0.3);
}

.left-data-border {
  border: 1px solid rgb(0, 253, 251);
}

.left-data-border label {
  color: rgb(0, 253, 251);
}

.mid-data-body {
  background: rgba(255, 156, 0, 0.3);
}

.mid-data-border {
  border: 1px solid rgb(255, 156, 0);
}

.mid-data-border label {
  color: rgb(255, 156, 0);
}

.right-data-body {
  background: rgba(233, 1, 9, 0.3);
}

.right-data-border {
  border: 1px solid rgb(233, 1, 9);
}

.right-data-border label {
  color: rgb(233, 1, 9);
}

.data-tit {
  color: #fff;
  margin-top: 10px;
  font-size: 14px;
}

.data-top,
.data-bot {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.data-top {
  margin-top: 20px;
}

.data-bot {
  margin-top: auto;
  margin-bottom: 20px;
}

.data-top label,
.data-bot label {
  font-size: 28px;
}

.data-top span,
.data-bot span {
  font-size: 12px;
  color: #fff;
  margin-top: 10px;
}

.jiaodi-body {
  width: 100%;
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.jiaodi-body-bg {
  width: 90%;
  height: 200px;
  background: url(../../assets/kanban-bg.png) no-repeat 100% 100%;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
}

.jiaodi-item-1,
.jiaodi-item-2,
.jiaodi-item-3 {
  display: flex;
  font-style: italic;
}

.jiaodi-item-1 {
  line-height: 4.4;
}

.jiaodi-item-2 {
  line-height: 2.2;
}

.jiaodi-item-3 {
  line-height: 4.2;
}

.jiaodi-item-num span {
  color: #92f8fd;
}

.jiaodi-item-1 .jiaodi-item-tit {
  flex: 0.4;
  display: flex;
  align-items: center;
  justify-content: center;
}

.jiaodi-item-1 .jiaodi-item-num {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.jiaodi-item-tit {
  color: #fff;
  flex: 0.4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.jiaodi-item-num {
  color: #fff;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
.riskt {
  height: 243px;
  overflow: hidden;
}
.fIdx {
  font-family: PingFang SC;
  font-weight: 400;
  -webkit-animation: 15s rowup linear infinite normal;
  animation: 15s rowup linear infinite normal;
  position: relative;
}
@keyframes rowup {
  0% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }

  100% {
    -webkit-transform: translateY(-370px);
    transform: translateY(-370px);
  }
}

.fIdx > p {
  color: #ffffff;
  // height: 37px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 16px;
  border-bottom: 1px solid rgba(34, 147, 254, 0.3);
}
.el-dropdown-link {
  font-size: 18px;
  cursor: pointer;
  color: #00eaff;
}
.el-dropdown-menu {
  top: 120px !important;
}
.el-dropdown {
  font-size: 16px;
}
.more {
  float: right;
  font-size: 15px;
  cursor: pointer;
}
// @media (max-width: 1024px) {
//   .chart-wrapper {
//     padding: 8px;
//   }
// }
.paBox {
  position: absolute;
  top: 80px;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00022c;
  z-index: 1000;
}
</style>
