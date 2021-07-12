<template>
  <!-- 省份信息 -->
  <div :class="className" :style="{ height: height, width: width }"></div>
</template>

<script>
import echarts from "echarts";
// import { bottomData } from "@/api/dataBulletinBoard/index"; //底部数据
require("echarts/theme/macarons"); // echarts theme
import { mapStata } from "@/api/dataBulletinBoard/index";

export default {
  props: {
    date_year: {
      type: String,
      default: "",
    },
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "170px",
    },
    height: {
      type: String,
      default: "200px",
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      chart: null,
      dataNum: "",
      pmnData: "",
      resData: "", //
    };
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    refresh(e) {
      this.pmnData = e; //湖南+长沙+
      this.dataBulletinBoard();
    },
    async dataBulletinBoard() {
      let datas = {
        queryYear: this.date_year,
      };
      this.resData = await mapStata(this.pmnData);
      let firstObj;
      let secondObj;
      let thirdObj;
      let sum = 0;
      for (let i = 0; i < this.resData.length; ++i) {
        sum += this.resData[i].num;
        if (this.resData[i].projectProcess == "施工中") {
          firstObj = this.resData[i];
        }
        if (this.resData[i].projectProcess == "未开工") {
          secondObj = this.resData[i];
        }
        if (this.resData[i].projectProcess == "已竣工") {
          thirdObj = this.resData[i];
        }
      }
      this.initChart(firstObj, secondObj, thirdObj, sum, this.pmnData);
    },
    //图表配置
    initChart(firstObj, secondObj, thirdObj, sum, pmnData) {
      this.chart = echarts.init(this.$el, "macarons");
      this.chart.setOption({
        title: {
          show: true,
          text: pmnData,
          x: "center",
          y: 5,
          textStyle: {
            fontSize: "15",
            color: "white",
            fontWeight: "normal",
            align: "center",
            marginTop: "5",
          },
        },
        tooltip: {
          trigger: "item",
          // // formatter: "{b}:{d}%",
          // formatter: function (params, ticket, callback) {
          //   let name = params.name.split("：");
          //   return params.marker + name[0] + ":" + params.percent;
          // },
          show: true,
        },
        color: ["#58B2F3", "#00FF50", "#97FFDA"],
        legend: {
          orient: "vertical",
          show: true,
          top: "77%",
          left: "center",
          itemWidth: 10,
          itemHeight: 30,
          textStyle: {
            color: "#fffff",
            fontSize: 10,
          },
        },
        series: {
          name: "",
          type: "pie",
          radius: ["35%", "55%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          itemStyle: {
            borderRadius: 15,
            borderColor: "#0b1260",
            borderWidth: 0,
          },
          tooltip: {
            trigger: "item",
            // formatter: "{b}:{d}%",
            formatter: function (params, ticket, callback) {
              let reg = /[0-9]+/g;
              let name = params.name.replace(reg, "");
              return params.marker + name + ":" + params.value;
            },
            show: true,
          },

          label: {
            normal: {
              show: true,
              position: "center",
              formatter: function (argument) {
                var html;
                html = sum + " \r\n\r\n" + "项目总数";
                return html;
              },
              textStyle: {
                fontSize: 10,
                color: "#FFFFFF",
              },
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "40",
                fontWeight: "bold",
              },
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [
            {
              value: secondObj.num,
              name: secondObj.num + "\r\n" + secondObj.projectProcess,
            },
            {
              value: firstObj.num,
              name: firstObj.num + "\r\n" + firstObj.projectProcess,
            },
            {
              value: thirdObj.num,
              name: thirdObj.num + "\r\n" + thirdObj.projectProcess,
            },
          ],
        },
      });
    },
  },
};
</script>
