<template>
  <div class="content-box">
    <div class="contentA">
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
          <div class="title_box"><i></i> <span>事故级别</span></div>
          <div class="hint" v-if="chartData1.rows.length == 0">暂无数据</div>
          <ve-pie
            v-if="chartData1.rows.length != 0"
            :data="chartData1"
            :settings="chartSettings"
            :legend="{ left: 0 }"
            ref="chart1-1"
          ></ve-pie>
        </div>
        <div class="list">
          <div class="title_box"><i></i> <span>事故区域</span></div>
          <div class="hint" v-if="chartData2.rows.length == 0">暂无数据</div>
          <ve-pie
            v-if="chartData2.rows.length != 0"
            :data="chartData2"
            :settings="chartSettings"
            :legend="{ left: 0 }"
            ref="chart1-2"
          ></ve-pie>
        </div>
        <div class="list">
          <div class="title_box"><i></i> <span>事故类型</span></div>
          <div class="hint" v-if="chartData3.rows.length == 0">暂无数据</div>
          <ve-pie
            v-if="chartData3.rows.length != 0"
            :data="chartData3"
            :settings="chartSettings"
            :legend="{ left: 0 }"
            ref="chart1-3"
          ></ve-pie>
        </div>
      </div>
      <div class="content-bottom">
        <div class="ve_line">
          <div class="title_box" style="margin-bottom: 20px">
            <i></i> <span>事故排名</span>
          </div>
          <el-table
            :data="tableData"
            height="350"
            stripe
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
            style="width: 100%"
          >
            <el-table-column prop="department" label="部门名称">
            </el-table-column>
            <el-table-column prop="aaccident" label="一般事故">
            </el-table-column>
            <el-table-column prop="baccident" label="较大事故">
            </el-table-column>
            <el-table-column prop="caccident" label="重大事故">
            </el-table-column>
            <el-table-column prop="daccident" label="特别重大事故">
            </el-table-column>
            <el-table-column prop="amount" label="总量" width="150">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="content-bottom">
        <div class="ve_line">
          <div class="title_box"><i></i> <span>事故数量统计</span></div>
          <ve-line :data="chartData4" ref="chart4"></ve-line>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getStatisticsList } from "@/api/accidentEmergency/accidentStatistics";
export default {
  components: {},
  data() {
    this.chartSettings = {
      dimension: "类型",
      metrics: "数量",
      // offsetX: 10,
    };
    this.chartSettings3 = {
      axisSite: { right: ["完成率"] },
      yAxisType: ["KMB", "percent"],
      yAxisName: ["数值", "比率"],
      showLine: ["完成率"],
    };

    this.chartExtend = {
      color: ["#1E90FF", "#3CB371", "#CD5C5C"],
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
      value: "", //选择的年份
      CurrentYear: "", //当前年份
      options: [
      ],
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
        columns: ["日期", "数量"],
        rows: [],
      },

      tableData: [],
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

      this.CurrentYear = e;
      this.getStudyData();
    },
    async getStudyData() {
      let resTechnology = await getStatisticsList(this.CurrentYear);
      //事故级别
      for (var i = 0; i < resTechnology.natureList.length; i++) {
        this.chartData1.rows.push({
          类型: resTechnology.natureList[i].nature,
          数量: resTechnology.natureList[i].natureNum,
        });
      }
      //事故区域
      for (var i = 0; i < resTechnology.areaList.length; i++) {
        this.chartData2.rows.push({
          类型: resTechnology.areaList[i].area,
          数量: resTechnology.areaList[i].areaNum,
        });
      }
      //事故类型
      for (var i = 0; i < resTechnology.typeList.length; i++) {
        this.chartData3.rows.push({
          类型: resTechnology.typeList[i].type,
          数量: resTechnology.typeList[i].typeNum,
        });
      }
      //事故排名
      this.tableData = resTechnology.ranjingList;
      //事故数量统计
      for (var i = 0; i < resTechnology.accidentNumberVoList.length; i++) {
        this.chartData4.rows.push({
          日期: resTechnology.accidentNumberVoList[i].createMonth,
          数量: resTechnology.accidentNumberVoList[i].number,
        });
      }
    },
  },
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.year /deep/{
  .el-input__inner{
    width: 110px;
  }
}
.content-box {
  background-color: #f4f1f2;
  .contentA {
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
</style>