<template>
  <!-- 责任书签署 -->
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
import { bottomData } from "@/api/dataBulletinBoard/index"; //底部数据
require("echarts/theme/macarons"); // echarts theme

export default {
  props: {
    date_year: {
      type: String,
      default: ""
    },
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "282px"
    },
    autoResize: {
      type: Boolean,
      default: true
    }
    // chartData: {
    //   type: Object,
    //   required: true,
    // },
  },
  data() {
    return {
      chart: null,
      dataArr: [],
      dataNum: ""
    };
  },
  watch: {
    // chartData: {
    //   deep: true,
    //   handler(val) {
    //     this.setOptions(val);
    //   },
    // },
  },
  mounted() {
    this.dataBulletinBoard();
    // this.$nextTick(() => {
    // 	this.initChart();
    // });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    async dataBulletinBoard() {
      let datas = {
        queryYear: this.date_year
      };
      let res = await bottomData(datas);
      let data = {
        kanbanSafebooklv: res.kanbanSafebooklv,
        kanbanSafebookUnfinishuCount: res.kanbanSafebookUnfinishuCount,
        kanbanSafebookFinishuCount: res.kanbanSafebookFinishuCount
      };
      this.initChart(data);
    },
    initChart(data) {
      this.chart = echarts.init(this.$el, "macarons");
      this.chart.setOption({
        title: {
          show: true,
          text: "责任签署率：" + data.kanbanSafebooklv,
          x: "center",
          y: "70%",
          textStyle: {
            fontSize: "15",
            color: "white",
            fontWeight: "normal"
          }
        },
        tooltip: {
          trigger: "item",
          show: true,
          formatter: function(params, ticket, callback) {
            let name = params.name.split("：");
            return params.marker + name[0] + ":<br/>&nbsp;&nbsp;&nbsp;&nbsp;" + params.percent+"%"
          }
        },
        color: ["#4E93FC", "#6C7994"],
        legend: {
          show: true,
          top: "77%",
          left: "center",
          textStyle: {
            color: "#fffff",
            fontSize: 12
          }
        },
        series: {
          name: "",
          type: "pie",
          radius: ["40%", "75%"],
          center: ["50%", "40%"],
          avoidLabelOverlap: true,
          hoverAnimation: false,
          itemStyle: {
            borderRadius: 15,
            borderColor: "#0b1260",
            borderWidth: 15
          },
          label: {
            normal: {
              show: false,
              position: "center"
            },
            emphasis: {
              show: false
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            {
              value: data.kanbanSafebookFinishuCount,
              name: "已签署：" + data.kanbanSafebookFinishuCount + "份"
            },
            {
              value: data.kanbanSafebookUnfinishuCount,
              name: "未签署：" + data.kanbanSafebookUnfinishuCount + "份"
            }
          ]
          // data: [{
          // 		value: this.dataNum,
          // 		name: ""
          // 	},
          // 	{
          // 		value: 100 - this.dataNum,
          // 		name: ""
          // 	},
          // ],
        }
      });
    }
  }
};
</script>
