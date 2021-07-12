<template>
  <div class="content-box">
    <div class="content">
      <div class="content-top">
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <div class="title_box">
                <i></i> <span>培训进度</span>
                <div class="year">
                  <el-select
                    v-model="value"
                    placeholder="年度筛选"
                    @change="ChangeYear"
                    style="width: 110px"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="bt_box">
                <div class="breadcrumb">
                  <el-breadcrumb separator-class="el-icon-d-arrow-right">
                    <el-breadcrumb-item @click.native="fuGroup"
                      >路桥公司</el-breadcrumb-item
                    >
                    <el-breadcrumb-item @click.native="fuFiliale" v-if="filiale"
                      >第一分公司</el-breadcrumb-item
                    >
                    <el-breadcrumb-item v-if="filiale && department"
                      >江西路桥新路地产有限公司</el-breadcrumb-item
                    >
                  </el-breadcrumb>
                </div>
                <ve-pie
                  class="pie_box"
                  :data="chartData1"
                  :settings="{ radius: 150 }"
                  :events="chartEvents"
                  :legend="option"
                  :extend="chartExtend"
                  :tooltip="tooltip"
                  ref="chart1-1"
                ></ve-pie>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <div>
                <div class="title_box"><i></i> <span>培训计划</span></div>
                <div class="plan_box">
                  <el-row>
                    <el-col :span="8" class="plan_ht">
                      <ve-ring
                        :data="chartData2"
                        :extend="chartplan"
                        :settings="chartSettingPlan"
                        :legend="{ show: false }"
                      ></ve-ring>
                    </el-col>
                    <el-col :span="16" class="plan_ht">
                      <div class="plan_lb">
                        <div class="line_box">
                          <span class="n_line">线上培训</span>
                          <p>
                            培训次数：<span>{{
                              trainingType.online.numberTraining
                            }}</span
                            >次
                          </p>
                          <p>
                            参与人数：<span>{{
                              trainingType.online.numberParticipants
                            }}</span
                            >人
                          </p>
                          <p>
                            已完成数：<span>{{
                              trainingType.online.quantityCompleted
                            }}</span
                            >人
                            <span style="margin-left: 20px">{{
                              trainingType.online.beenCompleted
                            }}</span>
                          </p>
                        </div>
                        <div class="line_box">
                          <span class="offline">线下培训</span>
                          <p>
                            培训次数：<span>{{
                              trainingType.offline.numberTraining
                            }}</span
                            >次
                          </p>
                          <p>
                            参与人数：<span>{{
                              trainingType.offline.numberParticipants
                            }}</span
                            >人
                          </p>
                          <p>
                            已完成数：<span>{{
                              trainingType.offline.quantityCompleted
                            }}</span
                            >人
                            <span style="margin-left: 20px">{{
                              trainingType.offline.beenCompleted
                            }}</span>
                          </p>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <div class="title_box"><i></i> <span>培训类型</span></div>
                <div class="plan_list">
                  <el-table
                    :data="tableData"
                    height="250"
                    border
                    style="width: 100%"
                    stripe
                  >
                    <el-table-column
                      align="center"
                      prop="date"
                      label="培训类型"
                    >
                    </el-table-column>
                    <el-table-column
                      align="center"
                      prop="name"
                      label="需求人数"
                    >
                    </el-table-column>
                    <el-table-column
                      align="center"
                      prop="address"
                      label="已完成培训"
                    >
                    </el-table-column>
                    <el-table-column align="center" prop="wacl" label="完成率">
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="content-bottom">
        <div class="ve_line">
          <div class="title_box"><i></i> <span>培训完成率统计</span></div>
          <ve-histogram
            :data="chartData4"
            :settings="chartSettings3"
            ref="chart2"
          ></ve-histogram>
        </div>
      </div>
      <div class="content-bottom">
        <div class="ve_line">
          <div class="title_box"><i></i> <span>培训人数</span></div>
          <ve-line :data="chartData6" ref="chart4"></ve-line>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import "echarts/lib/component/title";
import { getStudyData } from "@/api/safety/pxTroubleshoot";
export default {
  data() {
    let _that = this;
    //培训进度点击事件
    this.chartEvents = {
      click: function (e) {
        _that.name = e.name;
        _that.fnSchedule(e);
      },
    };
    //培训进度
    this.option = {
      orient: "vertical",
      right: 20,
      top: "center",
      formatter: function (name) {
        // 获取legend显示内容
        let data = _that.chartData1.rows;
        let total = 0;
        let tarValue = 0;
        for (let i = 0, l = data.length; i < l; i++) {
          total += data[i].数量;
          if (data[i].类型 == name) {
            tarValue = data[i].数量;
          }
        }
        let p = ((tarValue / total) * 100).toFixed(2);
        return name + " " + "\r\r\r\r" + "培训完成率:" + " " + p + "%";
      },
    };

    this.tooltip = {
      formatter: function (params) {
        let data = _that.chartData1.rows;
        let total = 0;
        let tarValue = 0;
        for (let i = 0, l = data.length; i < l; i++) {
          total += data[i].数量;
          if (data[i].类型 == params.name) {
            tarValue = data[i].数量;
          }
        }
        let p = ((tarValue / total) * 100).toFixed(2);
        return (
          params.marker +
          params.name +
          "<br/>" +
          params.marker +
          "总共: " +
          total +
          "人" +
          "<br/>" +
          params.marker +
          "已完成培训: " +
          tarValue +
          "人" +
          "<br/>" +
          params.marker +
          "培训完成率: " +
          p +
          "%"
        );
      },
    };
    //培训完成率统计
    this.chartSettings3 = {
      axisSite: { right: ["完成率"] },
      yAxisType: ["KMB", "percent"],
      yAxisName: ["数值", "比率"],
      showLine: ["完成率"],
    };
    //培训计划
    this.chartSettingPlan = {
      radius: ["80px", "120px"],
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
    };
    this.optionPlan = {
      show: false,
      right: 20,
      top: "center",
    };
    //培训计划
    this.chartplan = {
      series: {
        // 位置
        center: ["50%", "35%"],
        color: ["#00FF00", "#409eff"],
        label: {
          show: true,
          position: "center",
          formatter: function (param) {
            return _that.centerText + "\n\n" + "培训计划数（次）";
          },
          textStyle: {
            fontSize: 16,
            color: "#000",
          },
        },
      },
    };

    return {
      //培训进度
      chartExtend: {
        series: {
          // 位置
          center: ["30%", "50%"],
        },
      },
      chartData1: {
        columns: ["类型", "数量"],
        rows: [
          { 类型: "安全部生产部", 数量: 55 },
          { 类型: "第一分公司", 数量: 202 },
          { 类型: "第二分公司", 数量: 31 },
          { 类型: "风控审计部", 数量: 10 },
          { 类型: "公司管理层", 数量: 23 },
        ],
      },
      chartData2: {
        columns: ["类型", "数量"],
        rows: [
          { 类型: "线上", 数量: 300 },
          { 类型: "线下", 数量: 100 },
        ],
      },
      chartData3: {
        columns: ["类型", "数量"],
        rows: [],
      },
      chartData4: {
        columns: ["日期", "目标量", "完成量", "完成率"],
        rows: [],
      },
      chartData6: {
        columns: ["日期", "人数"],
        rows: [],
      },
      value: "", //选择的年份
      CurrentYear: "", //当前年份
      options: [],
      filiale: false, //集团
      department: false, //分公司
      counter: 0,
      centerText: 400,
      tableData: [
        {
          date: "日常培训",
          name: "100人",
          address: "89人",
          wacl: "89%",
        },
        {
          date: "岗前培训",
          name: "140人",
          address: "131人",
          wacl: "93%",
        },
        {
          date: "转岗培训",
          name: "54人",
          address: "54人",
          wacl: "100%",
        },
        {
          date: "四新培训",
          name: "87人",
          address: "69人",
          wacl: "79%",
        },
        {
          date: "安全培训",
          name: "102人",
          address: "92人",
          wacl: "90%",
        },
      ],
      trainingType: {
        online: {
          numberTraining: 300,
          numberParticipants: 500,
          quantityCompleted: 250,
          beenCompleted: "50%",
        },
        offline: {
          numberTraining: 100,
          numberParticipants: 500,
          quantityCompleted: 250,
          beenCompleted: "50%",
        },
      },
    };
  },
  created() {
    let nowDate = new Date();
    this.CurrentYear = nowDate.getFullYear();
    this.getStudyData();
    /**
     * 获取当前时间
     * 格式YYYY-MM-DD
     */
    var aData = new Date();
    this.value = aData.getFullYear();
    this.date_year = aData.getFullYear() + "";
    this.options = [
      {
        value: aData.getFullYear() - 3,
        label: aData.getFullYear() - 3,
      },
      {
        value: aData.getFullYear() - 2,
        label: aData.getFullYear() - 2,
      },
      {
        value: aData.getFullYear() - 1,
        label: aData.getFullYear() - 1,
      },
      {
        value: aData.getFullYear(),
        label: aData.getFullYear(),
      },
    ];
  },
  methods: {
    fnSchedule(e) {
      if (this.counter == 0) {
        this.centerText = 800;
        let data = [
          { 类型: "第一分公司工程部", 数量: 20 },
          { 类型: "第一分公司综合部", 数量: 88 },
          { 类型: "江西路桥新路地产有限公司", 数量: 55 },
          { 类型: "大广CP2项目", 数量: 30 },
          { 类型: "吉康B1", 数量: 46 },
        ];
        let planData = {
          online: {
            numberTraining: 400,
            numberParticipants: 600,
            quantityCompleted: 300,
            beenCompleted: "50%",
          },
          offline: {
            numberTraining: 200,
            numberParticipants: 300,
            quantityCompleted: 150,
            beenCompleted: "50%",
          },
        };
        let planT = [
          { 类型: "线上", 数量: 400 },
          { 类型: "线下", 数量: 200 },
        ];
        this.centerText = 600;
        this.chartData2.rows = planT;
        this.trainingType = planData;
        this.chartData1.rows = data;
        this.counter++;
        this.filiale = true;
        return;
      }
      if (this.counter == 1) {
        let data = [
          { 类型: "新路地产财务部", 数量: 90 },
          { 类型: "新路地产工程部", 数量: 78 },
          { 类型: "新路地产工地试验室", 数量: 125 },
          { 类型: "新路地产安全环保部", 数量: 80 },
          { 类型: "新路地产综合部", 数量: 96 },
        ];
        let planData = {
          online: {
            numberTraining: 200,
            numberParticipants: 300,
            quantityCompleted: 150,
            beenCompleted: "50%",
          },
          offline: {
            numberTraining: 100,
            numberParticipants: 360,
            quantityCompleted: 180,
            beenCompleted: "50%",
          },
        };
        let planT = [
          { 类型: "线上", 数量: 200 },
          { 类型: "线下", 数量: 100 },
        ];
        this.centerText = 300;
        this.chartData2.rows = planT;
        this.trainingType = planData;
        this.chartData1.rows = data;
        this.department = true;
      }
    },
    //点击集团面包屑
    fuGroup() {
      this.counter = 0;
      let data = [
        { 类型: "安全部生产部", 数量: 55 },
        { 类型: "公司本部机关", 数量: 202 },
        { 类型: "人力资源部", 数量: 31 },
        { 类型: "风控审计部", 数量: 10 },
        { 类型: "公司管理层", 数量: 23 },
      ];
      let planData = {
        online: {
          numberTraining: 300,
          numberParticipants: 500,
          quantityCompleted: 250,
          beenCompleted: "50%",
        },
        offline: {
          numberTraining: 100,
          numberParticipants: 500,
          quantityCompleted: 250,
          beenCompleted: "50%",
        },
      };
      let planT = [
        { 类型: "线上", 数量: 300 },
        { 类型: "线下", 数量: 100 },
      ];
      this.centerText = 400;
      this.chartData2.rows = planT;
      this.trainingType = planData;
      this.chartData1.rows = data;
      this.filiale = false;
    },
    //点击分公司面包屑
    fuFiliale() {
      this.counter = 1;
      let data = [
        { 类型: "安全部生产部", 数量: 20 },
        { 类型: "公司本部机关", 数量: 88 },
        { 类型: "人力资源部", 数量: 55 },
        { 类型: "风控审计部", 数量: 30 },
        { 类型: "公司管理层", 数量: 46 },
      ];
      let planData = {
        online: {
          numberTraining: 400,
          numberParticipants: 600,
          quantityCompleted: 300,
          beenCompleted: "50%",
        },
        offline: {
          numberTraining: 200,
          numberParticipants: 300,
          quantityCompleted: 150,
          beenCompleted: "50%",
        },
      };
      let planT = [
        { 类型: "线上", 数量: 400 },
        { 类型: "线下", 数量: 200 },
      ];
      this.centerText = 600;
      this.chartData2.rows = planT;
      this.trainingType = planData;
      this.chartData1.rows = data;
      this.department = false;
    },

    //选中的年份
    ChangeYear(e) {
      //请求其它年份前清除数据
      this.chartData4.rows = [];
      this.chartData6.rows = [];
      this.CurrentYear = e;
      this.getStudyData();
    },
    async getStudyData() {
      let resTechnology = await getStudyData(this.CurrentYear);
      //柱状图
      for (var i = 0; i < resTechnology.homePageTrainChartVos.length; i++) {
        this.chartData4.rows.push({
          日期: resTechnology.homePageTrainChartVos[i].month,
          目标量: resTechnology.homePageTrainChartVos[i].targetQuantity,
          完成量: resTechnology.homePageTrainChartVos[i].quantityCompleted,
          完成率: resTechnology.homePageTrainChartVos[i].completionRate,
        });
      }
      //培训人数
      for (var i = 0; i < resTechnology.trainNumberVos.length; i++) {
        this.chartData6.rows.push({
          日期: resTechnology.trainNumberVos[i].createMonth,
          人数: resTechnology.trainNumberVos[i].number,
        });
      }
    },
  },
};
</script>
<style lang='scss' scoped>
.year /deep/ {
  .el-input__inner {
    width: 110px;
  }
}
/deep/ .el-breadcrumb__inner {
  color: #000 !important;
  font-size: 18px;
  cursor: pointer !important;
}
/deep/.el-breadcrumb__separator {
  color: #000 !important;
  font-size: 18px;
}

//@import url(); 引入公共css类
.content-box {
  background-color: #f4f1f2;
  .content {
    // margin: 15px 25px;
    // background-color: #fff;
    .content-top {
      background-color: #fff;
      .grid-content {
        margin: 0 10px;
        border: 1px solid #dcdfe6;
        padding: 0 10px;
        height: 652px;
        .title_box {
          height: 50px;
          font-size: 18px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #333333;
          line-height: 50px;
          border-bottom: 1px solid #dcdfe6;
          .year {
            float: right;
            margin-bottom: 6px;
          }
          span {
            margin-left: 10px;
          }
          i {
            display: inline-block;
            width: 4px;
            height: 24px;
            background: #5683fe;
            margin-bottom: -5px;
          }
        }
        .plan_box {
          .plan_ht {
            height: 300px;
          }
          .plan_lb {
            display: flex;
            width: 100%;
            justify-content: space-around;
            height: 100%;
            align-items: center;
            .line_box {
              height: 140px;
              .n_line {
                background-color: #00ff00;
                color: #fff;
                padding: 5px;
                border-radius: 6px;
              }
              .offline {
                background-color: #409eff;
                color: #fff;
                padding: 5px;
                border-radius: 6px;
              }
            }
          }
        }
        .bt_box {
          // margin-top: 100px;
          .breadcrumb {
            height: 40px;
            margin-left: 10px;
            .el-breadcrumb {
              line-height: 40px;
            }
          }
          .pie_box {
            margin-top: 80px;
          }
        }
      }
    }
    .content-bottom {
      padding: 10px 20px;
      background-color: #fff;
      // margin-top: 20px;
      .title_box {
        height: 22px;
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 22px;
        margin: 16px 0 0 16px;
        display: flex;
        span {
          margin-left: 10px;
        }
        i {
          display: inline-block;
          width: 4px;
          height: 22px;
          background: #5683fe;
        }
      }
    }
  }
}

.year input {
  width: auto;
}
</style>