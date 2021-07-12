<template>
  <div class="content-box">
    <div class="content">
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
      <div class="content-top">
        <div class="list">
          <div class="title_box"><i></i> <span>隐患复现率统计</span></div>
          <div class="hint" v-if="chartData1.rows.length == 0">暂无数据</div>
          <ve-pie
            v-if="chartData1.rows.length != 0"
            :data="chartData1"
            :settings="series"
            :tooltip="tooltip"
            :legend="legend"
            ref="chart1-1"
          ></ve-pie>
        </div>
        <div class="list">
          <div class="title_box"><i></i> <span>隐患分布统计</span></div>
          <div class="hint" v-if="chartData3.rows.length == 0">暂无数据</div>
          <ve-pie
            v-if="chartData3.rows.length != 0"
            :data="chartData3"
            :settings="chartSettings"
            :tooltip="tooltip"
            :legend="{ left: 0 }"
            ref="chart1-3"
          ></ve-pie>
        </div>
        <div class="list">
          <div class="title_box"><i></i> <span>隐患级别统计</span></div>
          <div class="hint" v-if="chartData2.rows.length == 0">暂无数据</div>
          <ve-pie
            v-if="chartData2.rows.length != 0"
            :data="chartData2"
            :settings="chartSettings"
            :tooltip="tooltip"
            :legend="{ left: 0 }"
            ref="chart1-2"
          ></ve-pie>
        </div>
      </div>
      <div class="content-bottom">
        <div class="ve_line">
          <div class="title_box"><i></i> <span>隐患类别统计</span></div>
          <div class="hintLine" v-if="chartData4.rows.length == 0">
            暂无数据
          </div>
          <!-- <ve-histogram
            :data="chartData4"
            :settings="chartSettings3"
            :extend="chartExtend"
            ref="chart2"
          ></ve-histogram> -->
          <ve-line
            v-if="chartData4.rows.length != 0"
            :data="chartData4"
            ref="chart2"
          ></ve-line>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import "echarts/lib/component/title";
import {
  getYhFuxian,
  getYhJibie,
  getPieYhFuxian,
  getYhLeixinT,
  getNewYhLeixinT,
} from "@/api/hiddenDanger/security";
export default {
  components: {},
  data() {
    this.tooltip = {
      position: function (point, params, dom, rect, size) {
        // 固定在顶部
        return ["10%", "20%"];
      },
      extraCssText: "white-space: normal",
    };
    this.legend = {
      left: "0",
      formatter: function (name) {
        return name.length > 6 ? name.substr(0, 8) + "..." : name;
      },
    };
    this.chartSettings = {
      dimension: "类型",
      metrics: "数量",
    };

    this.series = {
      labelLine: {
        normal: {},
      },
      label: {
        normal: {
          formatter: function (param) {
            let name = param.name,
              percent = param.percent;
            if (name.length <= 4) {
              return name;
            } else {
              name = name.slice(0, 20) + "...";
              return name;
            }
          },
        },
      },
    };
    this.chartSettings3 = {
      axisSite: {
        right: ["完成率"],
      },
      yAxisType: ["KMB", "percent"],
      yAxisName: ["数值", "比率"],
      showLine: ["完成率"],
    };

    this.chartExtend = {
      series(v) {
        v && v.forEach((i) => (i.barGap = "0%"));
        return v;
      },
    };
    this.chartExtend1 = {
      color: ["#1E90FF"],
      series(v) {
        v && v.forEach((i) => (i.barGap = "0%"));
        return v;
      },
    };

    // :title="chartTitle.title"//添加属性上去就行
    // this.chartTitle = {
    //   title: {
    //     text: "事故区域",
    //     x: "middle", //在图片中的x轴位置 left, right, middle
    //     y: "top", //在图片中的y轴位置 top, bottom
    //     textAlign: "center", //整体（包括 text 和 subtext）的水平对齐 auto, left, right, center
    //   },
    // };
    return {
      chartSettings: {
        offsetY: 240,
      },
      value: "", //选择的年份
      CurrentYear: "", //当前年份
      options: [],
      chartData1: {
        columns: ["类型", "数量"],
        rows: [],
      },
      chartData2: {
        columns: ["类型", "数量"],
        rows: [],
      },
      chartData3: {
        columns: ["类型", "数量"],
        rows: [],
      },
      chartData4: {
        columns: [
          "月份",
          "临时用电",
          "作业环境与职业健康",
          "消防工程",
          "机械",
          "现场防护",
          "拌和站、预制场",
        ],
        rows: [],
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
    //选中的年份
    ChangeYear(e) {
      //请求其它年份前清除数据
      this.chartData1.rows = [];
      this.chartData2.rows = [];
      this.chartData3.rows = [];
      this.chartData4.rows = [];
      this.chartData4.columns = [];

      this.CurrentYear = e;
      this.getStudyData();
    },
    async getStudyData() {
      let resYhFuxian = await getYhFuxian(this.CurrentYear); //隐患复现率统计（饼图）
      let resYhJibie = await getYhJibie(this.CurrentYear); //隐患级别统计（饼图）
      let resPieYhFuxian = await getPieYhFuxian(this.CurrentYear); //隐患分布部门统计（饼状图）
      // let resYhLeixinT = await getYhLeixinT(this.CurrentYear); //隐患类型统计（折线图）
      let resNewYhLeixinT = await getNewYhLeixinT(this.CurrentYear); //隐患类别统计（折线图）

      //隐患类别统计（折线图）
      let _objArr = Object.keys(resNewYhLeixinT[0]);
      let _dataArr = [];
      for (let i in _objArr) {
        _dataArr.push(_objArr[i]);
      }
      this.chartData4.columns = _dataArr;
      for (let i in resNewYhLeixinT) {
        this.chartData4.rows.push(resNewYhLeixinT[i]);
        this.chartData4.rows[i].月份 = Number(i) + 1 + "月";
      }
      //隐患复现率统计（饼图）
      for (var i = 0; i < resYhFuxian.length; i++) {
        this.chartData1.rows.push({
          类型: resYhFuxian[i].checkClass,
          数量: resYhFuxian[i].scCount,
        });
      }
      //隐患级别统计（饼图）
      for (var i = 0; i < resYhJibie.length; i++) {
        this.chartData2.rows.push({
          类型: resYhJibie[i].checkClass,
          数量: resYhJibie[i].scCount,
        });
      }
      //隐患分布部门统计（饼状图）
      for (var i = 0; i < resPieYhFuxian.length; i++) {
        this.chartData3.rows.push({
          类型: resPieYhFuxian[i].yhDept,
          数量: resPieYhFuxian[i].yhCount,
        });
      }

      // //柱状图
      // for (var i = 0; i < resTechnology.homePageTrainChartVos.length; i++) {
      //   this.chartData4.rows.push({
      //     日期: resTechnology.homePageTrainChartVos[i].month,
      //     目标量: resTechnology.homePageTrainChartVos[i].targetQuantity,
      //     完成量: resTechnology.homePageTrainChartVos[i].quantityCompleted,
      //     完成率: resTechnology.homePageTrainChartVos[i].completionRate,
      //   });
      // }
    },
  },
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.content-box {
  background-color: #f4f1f2;

  .content {
    margin: 15px 25px;

    // background-color: #fff;
    .year {
      float: right;
      margin-bottom: 6px;
    }

    .content-top {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .list {
        width: 32.5% !important;
        background-color: #fff;

        .hint {
          text-align: center;
          line-height: 300px;
          height: 300px;
          color: #909399;
        }
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
            margin-left: 20px;
          }

          i {
            display: inline-block;
            width: 4px;
            height: 22px;
            background: #5683fe;
          }
        }

        .ve-pie {
          padding: 10px 20px;
        }
      }
    }

    .content-bottom {
      padding: 10px 20px;
      background-color: #fff;
      margin-top: 20px;
      .hintLine {
        text-align: center;
        color: #909399;
        line-height: 300px;
        height: 300px;
      }

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
          margin-left: 20px;
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

.year /deep/ {
  .el-input__inner {
    width: 110px;
  }
}
</style>
