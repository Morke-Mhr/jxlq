<template>
  <div class="content-box">
    <div class="content">
      <div class="header">
        <div id="accidentLevel"></div>
        <div id="accidentArea"></div>
        <div id="accidentType"></div>
      </div>
      <div class="footer">
        <div id="AccidentStatistics" style="width: 100%; height: 70vh"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getList } from "@/api/accidentEmergency/accidentStatistics";
import echarts from "echarts";
export default {
  data() {
    return {
      opinionLevelData: [
        // { value: 1, name: "区域1" },
        // { value: 1, name: "区域2" },
        // { value: 1, name: "区域3" },
      ],
      opinionAreaData: [
        // { value: 1, name: "特大事故" },
        // { value: 1, name: "重大事故" },
        // { value: 1, name: "一般事故" },
      ],
      opinionTypeData: [
        // { value: 1, name: "高空坠落" },
        // { value: 1, name: "电击" },
        // { value: 1, name: "泥石流" },
      ],
      opinionStatisticsData: [8, 12, 10, 12, 15, 10, 15, 8, 9, 16, 8, 12],
      charts: "",
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.Level();
      this.Area();
      this.Type();
      this.Statistics();
    });
  },
  created() {
    this.getAllList();
  },
  methods: {
    objArrtransArr(olddata, oldval, oldname) {
      const newArr = [];
      olddata.map((item) => {
        // 定义数组内部对象形式
        let obj = {};
        obj.value = item[oldval];
        obj.name = item[oldname];
        // 将对象数据推到数组中
        newArr.push(obj);
      });
      console.log(newArr);
      return newArr;
    },
    //获取图标
    async getAllList() {
      let data = await getList("2020");
      //事故类型级别
      this.opinionLevelData = this.objArrtransArr(
        data.areaList,
        "areaNum",
        "area"
      );
      //事故区域级别
      this.opinionAreaData = this.objArrtransArr(
        data.natureList,
        "natureNum",
        "nature"
      );
      //事故类型
      this.opinionTypeData = this.objArrtransArr(
        data.typeList,
        "typeNum",
        "type"
      );
      this.opinionStatisticsData = data.monthList;
    },

    //事故级别构成分析
    Level() {
      this.charts = echarts.init(document.getElementById("accidentLevel"));
      // if (this.opinionLevelData.length > 0) {
      this.charts.setOption({
        title: {
          text: "事故级别构成分析",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: 10,
          top: 20,
          bottom: 20,
          // data: this.opinionLevel,
        },
        series: [
          {
            name: "事故级别",
            type: "pie",
            radius: "40%",
            center: ["55%", "40%"], //饼图位置[左右，高度]
            avoidLabelOverlap: false,
            data: this.opinionLevelData,
          },
          {
            name: "",
            type: "pie",
            radius: "85%",
            center: ["45%", "50%"],
            data: [],
            itemStyle: {
              normal: {
                label: {
                  //此处为指示线文字
                  show: true,
                  position: "inner", //标签的位置
                  textStyle: {
                    fontWeight: 200,
                    fontSize: 10, //文字的字体大小
                  },
                },
                labelLine: {
                  //指示线状态
                  show: true,
                  smooth: 0.2,
                  length: 10,
                  length2: 20,
                },
              },
            },
          },
        ],
      });
      // }
    },
    //事故区域分布分析
    Area() {
      this.charts = echarts.init(document.getElementById("accidentArea"));
      this.charts.setOption({
        title: {
          text: "事故区域分布分析",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: 10,
          top: 20,
          bottom: 20,
          // data: this.opinionArea,
        },
        series: [
          {
            name: "事故区域",
            type: "pie",
            radius: "40%",
            center: ["55%", "40%"], //饼图位置[左右，高度]
            avoidLabelOverlap: false,
            data: this.opinionAreaData,
          },
          {
            name: "",
            type: "pie",
            radius: "85%",
            center: ["45%", "50%"],
            data: [],
            itemStyle: {
              normal: {
                label: {
                  //此处为指示线文字
                  show: true,
                  position: "inner", //标签的位置
                  textStyle: {
                    fontWeight: 200,
                    fontSize: 10, //文字的字体大小
                  },
                },
                labelLine: {
                  //指示线状态
                  show: true,
                  smooth: 0.2,
                  length: 10,
                  length2: 20,
                },
              },
            },
          },
        ],
      });
    },
    //事故类型分类分析
    Type() {
      this.charts = echarts.init(document.getElementById("accidentType"));
      this.charts.setOption({
        title: {
          text: "事故类型分类分析",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: 10,
          top: 20,
          bottom: 20,
          // data: this.opinionType,
        },
        series: [
          {
            name: "事故类型",
            type: "pie",
            radius: "40%",
            center: ["55%", "40%"], //饼图位置[左右，高度]
            avoidLabelOverlap: false,
            data: this.opinionTypeData,
          },
          {
            name: "",
            type: "pie",
            radius: "85%",
            center: ["45%", "50%"],
            data: [],
            itemStyle: {
              normal: {
                label: {
                  //此处为指示线文字
                  show: true,
                  position: "inner", //标签的位置
                  textStyle: {
                    fontWeight: 200,
                    fontSize: 10, //文字的字体大小
                  },
                },
                labelLine: {
                  //指示线状态
                  show: true,
                  smooth: 0.2,
                  length: 10,
                  length2: 20,
                },
              },
            },
          },
        ],
      });
    },
    //事故数量统计
    Statistics() {
      this.charts = echarts.init(document.getElementById("AccidentStatistics"));
      this.charts.setOption({
        title: {
          text: "事故数量统计",
          left: "left",
        },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月",
          ],
          axisLabel: {
            fontSize: 12,
            color: "#999999",
          },
          //坐标轴线
          axisLine: {
            lineStyle: {
              color: "#EFEFEF",
            },
          },
          //坐标轴刻度
          axisTick: {
            lineStyle: {
              color: "#EFEFEF",
            },
          },
          //网格线
          splitLine: {
            show: true,
            lineStyle: {
              color: "#EFEFEF",
            },
          },
        },
        yAxis: {
          type: "value",
          //坐标轴线
          axisLine: {
            lineStyle: {
              color: "#EFEFEF",
            },
          },
          axisLabel: {
            fontSize: 12,
            color: "#999999",
          },
        },
        series: [
          {
            name: "统计数量",
            type: "line",
            stack: "总量",
            data: this.opinionStatisticsData,
            color: "#74A0FA",
          },
        ],
      });
    },
  },
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.content-box {
  background-color: #f4f1f2;
  .content {
    padding: 15px 25px;
    .header {
      display: flex;
      padding: 15px;
      height: 58vh;
      background-color: #fff;
      #accidentLevel,
      #accidentArea,
      #accidentType {
        width: 400px;
        height: 70vh;
      }
    }
    .footer {
      display: flex;
      padding: 15px;
      margin-bottom: 20px;
      background-color: #fff;
      .area-tit {
        text-align: center;
      }
    }
  }
}
</style>