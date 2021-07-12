<template>
  <div class="content_box">
    <div class="content_heard">
      <div class="content_left">
        <div class="content_top">
          <div class="title_box"><i></i> <span>待办中心</span></div>
          <ul class="ul_box">
            <li class="list_box" @click="skip('taskCount')">
              <img :src="webImg1" alt="" />
              <div>
                <p>
                  {{ taskCount != undefined ? taskCount : 0 }}
                </p>
                <p>待审批</p>
              </div>
            </li>
            <li class="list_box" @click="skip('hrectifyCount')">
              <img :src="webImg3" alt="" />
              <div>
                <p>
                  {{ hrectifyCount != undefined ? hrectifyCount : 0 }}
                </p>
                <p>隐患整改</p>
              </div>
            </li>
            <li class="list_box" @click="skip('hdubanCount')">
              <img :src="webImg2" alt="" />
              <div>
                <p>
                  {{ hdubanCount != undefined ? hdubanCount : 0 }}
                </p>
                <p>隐患督办</p>
              </div>
            </li>
            <li class="list_box" @click="skip('ToTaskCount')">
              <img :src="webImg" alt="" />
              <div>
                <p>{{ ToTaskCount != undefined ? ToTaskCount : 0 }}</p>
                <p>待办任务</p>
              </div>
            </li>
            <li class="list_box" @click="skip('TimeTaskCount')">
              <img :src="webImg5" alt="" />
              <div style="margin-right: -24px">
                <p>{{ TimeTaskCount != undefined ? TimeTaskCount : 0 }}</p>
                <p>已超期任务</p>
              </div>
            </li>
            <li class="list_box" @click="skip('finishedTaskCount')">
              <img :src="webImg7" alt="" />
              <div style="margin-right: -24px">
                <p>
                  {{ finishedTaskCount != undefined ? finishedTaskCount : 0 }}
                </p>
                <p>已完成任务</p>
              </div>
            </li>
            <li class="list_box" @click="skip('DoingTaskCount')">
              <img :src="webImg4" alt="" />
              <div>
                <p>{{ DoingTaskCount != undefined ? DoingTaskCount : 0 }}</p>
                <p>在办任务</p>
              </div>
            </li>
            <li class="list_box" @click="skip('DevCheckCount')">
              <img :src="webImg6" alt="" />
              <div>
                <p>{{ DevCheckCount != undefined ? DevCheckCount : 0 }}</p>
                <p>特种设备</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="content_bottom">
          <div class="title_box"><i></i> <span>快捷方式</span></div>
          <ul class="ul_box">
            <li class="list_box" @click="skip(' newTask')">
              <div>
                <img :src="pxImg3" alt="" />
                <p>新增任务</p>
              </div>
            </li>
            <li class="list_box" @click="skip('yhAppear')">
              <div>
                <img :src="pxImg4" alt="" />
                <p>隐患上报</p>
              </div>
            </li>
            <li class="list_box" @click="skip('addMeeting')">
              <div>
                <img :src="pxImg5" alt="" />
                <p>新增会议</p>
              </div>
            </li>
            <li class="list_box" @click="skip('exam')">
              <div>
                <img :src="pxImg" alt="" />
                <p>开始考试</p>
              </div>
            </li>
            <li class="list_box" @click="skip('yhRecord')">
              <div>
                <img :src="pxImg1" alt="" />
                <p>隐患记录</p>
              </div>
            </li>
            <!-- <li class="list_box">
              <div>
                <img :src="pxImg2" alt="" />
                <p></p>
              </div>
            </li> -->
          </ul>
        </div>
      </div>
      <div class="content_right">
        <div class="title_box">
          <i></i> <span>通知公告</span>
          <img :src="pxImg6" alt="" @click="informList()" />
        </div>
        <div class="list_box">
          <p v-for="(item, i) in listObj" :key="i" @click="popUp(item)">
            <span>{{ item.title }}</span>
            <span>{{ item.createTime }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="content_footer">
      <div class="title_box"><i></i> <span>数据统计</span></div>
      <div class="lists_box">
        <template>
          <el-tabs type="border-card" v-model="activeName">
            <!-- <el-tab-pane label="任务统计" name="1">
              <div class="ve_pie">
                <ve-pie
                  :data="chartData"
                  :settings="chartSettings"
                  :legend="{ left: 2, top: 15, width: 100 }"
                  ref="chart1-1"
                ></ve-pie>
              </div>
              <div class="ve_line">
                <ve-line
                  :data="chartData1"
                  :settings="chartSettings1"
                  ref="chart1"
                ></ve-line>
              </div>
            </el-tab-pane> -->
            <el-tab-pane label="责任书签订统计" name="2">
              <div class="ve_pie">
                <ve-pie
                  :data="chartData2"
                  :settings="chartSettings"
                  :legend="{ left: 0, top: 15, width: 100 }"
                  ref="chart2-1"
                ></ve-pie>
              </div>
              <div class="ve_line">
                <ve-histogram
                  :data="chartData3"
                  :settings="chartSettings3"
                  :extend="chartExtend"
                  ref="chart2"
                ></ve-histogram>
              </div>
            </el-tab-pane>
            <el-tab-pane label="安全教育统计" name="3">
              <div class="ve_pie">
                <ve-pie
                  :data="chartData4"
                  :settings="chartSettings"
                  :legend="{ left: 0, top: 15, width: 100 }"
                  ref="chart3-1"
                ></ve-pie>
              </div>
              <div class="ve_line">
                <ve-histogram
                  :data="chartData5"
                  :settings="chartSettings3"
                  :extend="chartExtend"
                  ref="chart3"
                ></ve-histogram>
              </div>
            </el-tab-pane>
            <el-tab-pane label="隐患整改统计" name="4">
              <div class="ve_pie">
                <ve-pie
                  :data="chartData6"
                  :settings="chartSettings"
                  :legend="{ left: 0, top: 15, width: 100 }"
                  ref="chart4-1"
                ></ve-pie>
              </div>
              <div class="ve_line">
                <ve-histogram
                  :data="chartData7"
                  :settings="chartSettings3"
                  :extend="chartExtend"
                  ref="chart4"
                ></ve-histogram>
              </div>
            </el-tab-pane>
            <el-tab-pane label="安全检查统计" name="5">
              <div class="ve_pie">
                <ve-pie
                  :data="chartData8"
                  :settings="chartSettings"
                  :legend="{ left: 0, top: 15, width: 100 }"
                  ref="chart5-1"
                ></ve-pie>
              </div>
              <div class="ve_line">
                <ve-histogram
                  :data="chartData9"
                  :settings="chartSettings3"
                  :extend="chartExtend"
                  ref="chart5"
                ></ve-histogram>
              </div>
            </el-tab-pane>
            <el-tab-pane label="技术交底统计" name="6">
              <div class="ve_pie">
                <ve-pie
                  :data="chartData10"
                  :settings="chartSettings"
                  :legend="{ left: 0, top: 15, width: 100 }"
                  ref="chart6-1"
                ></ve-pie>
              </div>
              <div class="ve_line">
                <ve-histogram
                  :data="chartData11"
                  :settings="chartSettings3"
                  :extend="chartExtend"
                  ref="chart6"
                ></ve-histogram>
              </div>
            </el-tab-pane>
          </el-tabs>
        </template>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      custom-class="large"
      :before-close="handleClose"
    >
      <div class="information">
        <p class="title" v-html="caption"></p>
        <div class="time_m">
          <span>{{ releaseTime }}</span>
          <span>{{ publisher }} ({{ dept }})</span>
        </div>
        <div class="Publish_Content" v-html="PublishContent"></div>
        <div>
          附件：<span style="color: #5583fe" @click="handledownload">{{
            fileName
          }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import echarts from "echarts";
import {
  taskCount,
  getYhrectifyCount,
  getYhdubanCount,
  getToTaskCount,
  getOverTimeTaskCount,
  getfinishedTaskCount,
  getDoingTaskCount,
  getSpecialDevCheckCount,
  getNoticesPage,
} from "@/api/homepage/miduser";
import {
  getTrainStatistics,
  getConfessStatistics,
  getPieSafeCheckStatDataLeader,
  getBarSafeCheckStatDataLeader,
  getPieYhRectStatDataLeader,
  getBarYhRectStatDataLeader,
  getPieSafeBookStatDataLeader,
  getBarSafeBookStatDataLeader,
  noticeView,
} from "@/api/homepage/leader";
export default {
  name: "leader",
  data() {
    this.chartSettings = {
      dimension: "类型",
      metrics: "数量",
      offsetX: 10,
    };
    this.chartSettings1 = {
      yAxisType: ["percent"],
      yAxisName: ["比率"],
    };
    this.chartSettings3 = {
      axisSite: { right: ["完成率"] },
      yAxisType: ["KMB", "percent"],
      yAxisName: ["数值", "比率"],
      showLine: ["完成率"],
    };
    this.chartExtend = {
      color: ["#F7B500", "#5583FE", "#00DDAA"],
      series(v) {
        v && v.forEach((i) => (i.barGap = "0%"));
        return v;
      },
    };
    return {
      webImg: require("../../../../public/img/icon.png"),
      webImg1: require("../../../../public/img/icon(1).png"),
      webImg2: require("../../../../public/img/icon(2).png"),
      webImg3: require("../../../../public/img/icon(3).png"),
      webImg4: require("../../../../public/img/icon(4).png"),
      webImg5: require("../../../../public/img/icon(5).png"),
      webImg6: require("../../../../public/img/icon(6).png"),
      webImg7: require("../../../../public/img/icon(7).png"),
      pxImg: require("../../../../public/img/tubiao(1).png"),
      pxImg1: require("../../../../public/img/tubiao(2).png"),
      pxImg2: require("../../../../public/img/tubiao(3).png"),
      pxImg3: require("../../../../public/img/tubiao(5).png"),
      pxImg4: require("../../../../public/img/tubiao(6).png"),
      pxImg5: require("../../../../public/img/tubiao(7).png"),
      pxImg6: require("../../../../public/img/tubiao(4).png"),

      taskCount: 0, //待审批数量
      hrectifyCount: 0, //隐患整改数量
      hdubanCount: 0, //隐患督办数量
      ToTaskCount: 0, //待办任务
      TimeTaskCount: 0, //超期任务数量
      finishedTaskCount: 0, //已完成任务数量
      DoingTaskCount: 0, //在办任务数量
      DevCheckCount: 0, //特种设备待检测数量
      dialogVisible: false,
      listObj: [],
      activeName: "2",
      caption: "", //标题
      releaseTime: "", //发布时间
      publisher: "", //发布人
      PublishContent: "", //发布内容
      dept: "", //部门
      fileName: "", //附件
      fileUrl: "",

      chartData: {
        columns: ["类型", "数量"],
        rows: [
          // { 类型: "责任书签订", 数量: 1393 },
          // { 类型: "安全教育", 数量: 3530 },
          // { 类型: "隐患整改", 数量: 2923 },
          // { 类型: "安全检查", 数量: 1723 },
          // { 类型: "技术交底", 数量: 3792 },
        ],
      },
      chartData1: {
        columns: [
          "日期",
          "责任书签订",
          "安全教育",
          "隐患整改",
          "安全检查",
          "技术交底",
        ],
        rows: [
          {
            日期: "一月",
            责任书签订: 0.12,
            安全教育: 0.19,
            隐患整改: 0.32,
            安全检查: 0.36,
            技术交底: 0.42,
          },
          {
            日期: "二月",
            责任书签订: 0.23,
            安全教育: 0.23,
            隐患整改: 0.26,
            安全检查: 0.53,
            技术交底: 0.16,
          },
          {
            日期: "三月",
            责任书签订: 0.26,
            安全教育: 0.22,
            隐患整改: 0.36,
            安全检查: 0.26,
            技术交底: 0.36,
          },
          {
            日期: "四月",
            责任书签订: 0.36,
            安全教育: 0.14,
            隐患整改: 0.49,
            安全检查: 0.24,
            技术交底: 0.79,
          },
          {
            日期: "五月",
            责任书签订: 0.32,
            安全教育: 0.34,
            隐患整改: 0.32,
            安全检查: 0.44,
            技术交底: 0.32,
          },
          {
            日期: "六月",
            责任书签订: 0.45,
            安全教育: 0.43,
            隐患整改: 0.28,
            安全检查: 0.23,
            技术交底: 0.48,
          },
          {
            日期: "七月",
            责任书签订: 0.13,
            安全教育: 0.19,
            隐患整改: 0.32,
            安全检查: 0.29,
            技术交底: 0.32,
          },
          {
            日期: "八月",
            责任书签订: 0.53,
            安全教育: 0.32,
            隐患整改: 0.26,
            安全检查: 0.6,
            技术交底: 0.46,
          },
          {
            日期: "九月",
            责任书签订: 0.29,
            安全教育: 0.26,
            隐患整改: 0.46,
            安全检查: 0.36,
            技术交底: 0.36,
          },
          {
            日期: "十月",
            责任书签订: 0.17,
            安全教育: 0.12,
            隐患整改: 0.49,
            安全检查: 0.22,
            技术交底: 0.29,
          },
          {
            日期: "十一月",
            责任书签订: 0.37,
            安全教育: 0.49,
            隐患整改: 0.323,
            安全检查: 0.49,
            技术交底: 0.32,
          },
          {
            日期: "十二月",
            责任书签订: 0.45,
            安全教育: 0.43,
            隐患整改: 0.38,
            安全检查: 0.29,
            技术交底: 0.12,
          },
        ],
      },
      chartData2: {
        columns: ["类型", "数量"],
        rows: [],
      },
      chartData3: {
        columns: ["日期", "目标量", "完成量", "完成率"],
        rows: [],
      },
      chartData4: {
        columns: ["类型", "数量", "下单用户", "下单率"],
        rows: [],
      },
      chartData5: {
        columns: ["日期", "目标量", "完成量", "完成率"],
        rows: [],
      },
      chartData6: {
        columns: ["类型", "数量"],
        rows: [],
      },
      chartData7: {
        columns: ["日期", "目标量", "完成量", "完成率"],
        rows: [],
      },
      chartData8: {
        columns: ["类型", "数量"],
        rows: [],
      },
      chartData9: {
        columns: ["日期", "目标量", "完成量", "完成率"],
        rows: [],
      },
      chartData10: {
        columns: ["类型", "数量"],
        rows: [],
      },
      chartData11: {
        columns: ["日期", "目标量", "完成量", "完成率"],
        rows: [],
      },
    };
  },
  watch: {
    activeName(v) {
      this.$nextTick((_) => {
        this.$refs[`chart${v}`].echarts.resize();
        this.$refs[`chart${v}-1`].echarts.resize();
      });
    },
  },
  mounted() {},
  created() {
    this.TodoCenter();
  },
  methods: {
    async TodoCenter() {
      this.taskCount = await taskCount();
      this.hrectifyCount = await getYhrectifyCount();
      this.hdubanCount = await getYhdubanCount();
      this.ToTaskCount = await getToTaskCount();
      this.TimeTaskCount = await getOverTimeTaskCount();
      this.finishedTaskCount = await getfinishedTaskCount();
      this.DoingTaskCount = await getDoingTaskCount();
      this.DevCheckCount = await getSpecialDevCheckCount();
      this.listObj = await getNoticesPage();
      /**
       *责任签订统计
       * */
      //饼状图
      let dutyB = await getPieSafeBookStatDataLeader();
      for (var i = 0; i < dutyB.length; i++) {
        this.chartData2.rows.push({
          类型: dutyB[i].checkClass,
          数量: dutyB[i].scCount,
        });
      }
      //柱状图
      let dutyZ = await getBarSafeBookStatDataLeader();
      for (var i = 0; i < dutyZ.length; i++) {
        this.chartData3.rows.push({
          日期: dutyZ[i].month,
          目标量: dutyZ[i].planCount,
          完成量: dutyZ[i].realCount,
          完成率: dutyZ[i].statCount,
        });
      }

      /**
       * 安全教育统计
       * */
      //饼图
      let resData = await getTrainStatistics();
      for (var i = 0; i < resData.homePageTrainClassVos.length; i++) {
        this.chartData4.rows.push({
          类型: resData.homePageTrainClassVos[i].pxClass,
          数量: resData.homePageTrainClassVos[i].number,
        });
      }
      //柱状图
      for (var i = 0; i < resData.homePageTrainChartVos.length; i++) {
        this.chartData5.rows.push({
          日期: resData.homePageTrainChartVos[i].month,
          目标量: resData.homePageTrainChartVos[i].targetQuantity,
          完成量: resData.homePageTrainChartVos[i].quantityCompleted,
          完成率: resData.homePageTrainChartVos[i].completionRate,
        });
      }
      /**
       * 技术交底统计
       * */
      //饼图
      let resTechnology = await getConfessStatistics();
      for (
        var i = 0;
        i < resTechnology.homePageTechnologyConfessClassVos.length;
        i++
      ) {
        this.chartData10.rows.push({
          类型: resTechnology.homePageTechnologyConfessClassVos[i].jdType,
          数量: resTechnology.homePageTechnologyConfessClassVos[i].number,
        });
      }
      //柱状图
      for (
        var i = 0;
        i < resTechnology.homePageTechnologyConfessChartVos.length;
        i++
      ) {
        this.chartData11.rows.push({
          日期: resTechnology.homePageTechnologyConfessChartVos[i].month,
          目标量:
            resTechnology.homePageTechnologyConfessChartVos[i].targetQuantity,
          完成量:
            resTechnology.homePageTechnologyConfessChartVos[i]
              .quantityCompleted,
          完成率:
            resTechnology.homePageTechnologyConfessChartVos[i].completionRate,
        });
      }
      /**
       *安全检查统计
       * */
      //饼状图
      let statisticsB = await getPieSafeCheckStatDataLeader();
      for (var i = 0; i < statisticsB.length; i++) {
        this.chartData8.rows.push({
          类型: statisticsB[i].checkClass,
          数量: statisticsB[i].scCount,
        });
      }
      //柱状图
      let statisticsZ = await getBarSafeCheckStatDataLeader();
      for (var i = 0; i < statisticsZ.length; i++) {
        this.chartData9.rows.push({
          日期: statisticsZ[i].month,
          目标量: statisticsZ[i].planCount,
          完成量: statisticsZ[i].realCount,
          完成率: statisticsZ[i].statCount,
        });
      }
      /**
       *隐患整改统计
       * */
      //饼状图
      let hiddenB = await getPieYhRectStatDataLeader();
      for (var i = 0; i < hiddenB.length; i++) {
        this.chartData6.rows.push({
          类型: hiddenB[i].checkClass,
          数量: hiddenB[i].scCount,
        });
      }
      //柱状图
      let hiddenZ = await getBarYhRectStatDataLeader();
      for (var i = 0; i < hiddenZ.length; i++) {
        this.chartData7.rows.push({
          日期: hiddenZ[i].month,
          目标量: hiddenZ[i].planCount,
          完成量: hiddenZ[i].realCount,
          完成率: hiddenZ[i].statCount,
        });
      }
    },
    //查看
    async popUp(item) {
      this.dialogVisible = true;
      this.caption = item.title;
      this.releaseTime = item.createTime;
      this.publisher = item.createBy;
      this.PublishContent = item.content;
      this.dept = item.dept;
      this.fileName = item.fileName;
      await noticeView(item.noticeId);
    },
    //下载
    handledownload() {
      this.fileDowloadName =
        this.$store.state.apiConfiguration.url +
        `fs/download?name=${encodeURI(encodeURI(this.fileName))}&path=${
          this.fileUrl
        }`;
      location.href = this.fileDowloadName;
    },
    //
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    //跳转页面
    skip(v) {
      switch (v) {
        case "taskCount": //待审批
          if (this.taskCount > 0) {
            this.$router.push({ path: "/task/task1" });
          }
          break;
        case "hrectifyCount": //隐患整改
          if (this.hrectifyCount > 0) {
            this.$router.push({ path: "/security/yhRecord" });
          }
          break;
        case "hdubanCount": //隐患督办
          if (this.hdubanCount > 0) {
            this.$router.push({ path: "/security/yhRecord" });
          }
          break;
        case "ToTaskCount": //待办任务
          if (this.ToTaskCount > 0) {
            this.$router.push({ path: "/task/handle" });
          }
          break;
        case "TimeTaskCount": //已超期任务,query: {query:'already'}
          if (this.TimeTaskCount > 0) {
            this.$router.push({ path: "/task/handle" });
          }
          break;
        case "finishedTaskCount": //已完成任务
          if (this.finishedTaskCount > 0) {
            this.$router.push({ path: "/task/handle" });
          }
          // this.$router.push({
          //   name: "detail",
          //   params: {
          //     name: "nameValue",
          //     code: 10011,
          //   },
          // });
          break;
        case "DoingTaskCount": //在办任务
          if (this.DoingTaskCount > 0) {
            // this.$router.push({ path: "/safetyEdu/manage" });
          }
          break;
        case "DevCheckCount": //特种设备
          if (this.DevCheckCount > 0) {
            this.$router.push({ path: "/equipment/inspectionRecord" });
          }
          break;
        case "newTask": //新增任务
          this.$router.push({ path: "/task/iCreated" });
          break;
        case "yhAppear": //隐患上报
          this.$router.push({ path: "/security/yhReport" });
          break;
        case "addMeeting": //新增会议
          // location.reload();
          break;
        case "exam": //开始考试
          // this.$router.push({ path: "/security/yhDistribution" });
          break;
        case "yhRecord": //隐患记录
          this.$router.push({ path: "/security/yhRecord" });
          break;
      }
    },
    informList() {
      this.$router.push({ path: "/notification" });
    },
  },
};
</script>

<style lang="scss" scoped>
.content_box {
  padding: 20px;
  .content_heard {
    display: flex;
    justify-items: flex-end;
    height: 473px;
    margin-bottom: 12px;
    .content_left {
      width: 70%;
      flex-direction: column;
      display: flex;
      justify-items: flex-end;
      .content_top {
        height: 274px;
        background-color: #ffffff;
        margin-bottom: 12px;
        .title_box {
          height: 22px;
          font-size: 16px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #333333;
          line-height: 22px;
          margin: 16px 0;
          display: flex;
          span {
            margin-left: 20px;
          }
          i {
            display: inline-block;
            width: 4px;
            height: 22px;
            background: #5683fe;
          }
        }
        .ul_box {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          padding: 0 20px;
          .list_box {
            list-style-type: none;
            cursor: pointer;
            width: 24%;
            height: 100px;
            margin-bottom: 10px;
            background: #fafafa;
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
            border-radius: 4px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 0 4%;
            img {
              width: 48px;
              height: 48px;
            }
            div {
              text-align: center;
              p:first-child {
                font-size: 24px;
                font-family: DINAlternate-Bold, DINAlternate;
                font-weight: bold;
                color: #5583fe;
                line-height: 0px;
              }
              p:last-child {
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
              }
            }
          }
        }
      }
      .content_bottom {
        height: 203px;
        background-color: #ffffff;
        .title_box {
          height: 22px;
          font-size: 16px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #333333;
          line-height: 22px;
          margin: 16px 0;
          display: flex;
          margin-bottom: 29px;
          span {
            margin-left: 20px;
          }
          i {
            display: inline-block;
            width: 4px;
            height: 22px;
            background: #5683fe;
          }
        }
        .ul_box {
          display: flex;
          justify-content: space-around;
          padding: 0 20px;
          .list_box {
            cursor: pointer;
            list-style-type: none;
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            div > div {
              width: 68px;
              height: 68px;
              background: #f7b500;
              border-radius: 21px;
              display: flex;
              justify-content: center;
              align-items: center;
              i {
                font-size: 39px;
                color: #ffffff;
              }
            }
            div > p {
              font-size: 16px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
            }
            div > p:last-child {
              height: 18px;
            }
          }
        }
      }
    }
    .content_right {
      width: 30%;
      background-color: #ffffff;
      margin-left: 13px;
      .title_box {
        height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 22px;
        margin: 16px 0;
        display: flex;
        position: relative;
        span {
          margin-left: 20px;
        }
        img {
          width: 20px;
          height: 20px;
          cursor: pointer;
          position: absolute;
          right: 20px;
        }
        i {
          display: inline-block;
          width: 4px;
          height: 22px;
          background: #5683fe;
        }
      }
      .list_box {
        padding: 0 23px;
        height: 384px;
        overflow: hidden;
        p {
          cursor: pointer;
          height: 48px;
          padding: 0 5px;
          line-height: 48px;
          margin: 0;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          display: flex;
          justify-content: space-between;
          span:first-child {
            max-width: 40%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        p:nth-child(odd) {
          background: #f6f7fb;
        }
        p:hover {
          color: #5583fe;
          //  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.3);
        }
      }
    }
  }
  .content_footer {
    height: 550px;
    background-color: #ffffff;
    .title_box {
      height: 22px;
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 22px;
      margin: 16px 0;
      padding: 20px 0;
      display: flex;
      span {
        margin-left: 20px;
      }
      i {
        display: inline-block;
        width: 4px;
        height: 22px;
        background: #5683fe;
      }
    }
    .lists_box {
      padding: 0 10px;
      .ve_pie {
        width: 44%;
        float: left;
      }
      .ve_line {
        float: right;
        width: 56%;
      }
    }
  }
  .information {
    border: 1px solid #000;
    padding: 0 20px 20px 20px;
    .title {
      text-align: center;
      font-size: 28px;
      font-weight: 400;
      line-height: 28px;
      color: #000;
    }
    .time_m {
      text-align: center;
      margin-bottom: 20px;
      span {
        margin: 0 20px;
        color: #000;
        font-size: 18px;
      }
    }
    .Publish_Content {
      border: 1px solid #000;
      width: 100%;
      min-height: 300px;
      max-height: 400px;
      margin-bottom: 20px;
      padding: 20px;
      overflow: auto;
    }
  }
}
</style>
<style lang="scss">
.content_footer
  .el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item.is-active {
  width: 130px;
  height: 50px;
  line-height: 50px;
  background: #5583fe;
  border-radius: 4px;
  color: #ffffff;
}
.content_footer .el-tabs--border-card > .el-tabs__header .el-tabs__item {
  height: 50px;
}
// .content_footer
//   .el-tabs--border-card
//   > .el-tabs__header
//   .el-tabs__item:not(.is-disabled):hover {
//   color: #ffffff;
// }
.content_footer .el-tabs__active-bar {
  display: none;
}
.content_footer .el-tabs__item {
  text-align: center;
  width: 130px;
  line-height: 50px;
}
</style>
