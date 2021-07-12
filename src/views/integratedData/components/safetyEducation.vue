<template>
  <!-- 安全教育情况 -->
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
import { safetyEducation } from "@/api/dataBulletinBoard/index"; //安全教育情况
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
      default: "243px"
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
      completeArr: [],
      planArr: [],
      finishRate: []
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
      let data = {
        queryYear: this.date_year
      };
      let res = await safetyEducation(data);
      for (let i in res) {
        this.completeArr.push(res[i].completeNumber);
        this.planArr.push(res[i].planNumber);
        this.finishRate.push(res[i].finishRate);
      }
      this.initChart();
    },
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.chart.setOption({
        xAxis: {
          data: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月"
          ],
          boundaryGap: false,
          splitArea: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#fff"
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              // 设置x轴颜色
              color: "#142e8a",
              // type: "dashed",
              width: 1
            }
          },
          nameLocation: "start"
        },
        grid: {
          left: 4,
          right: 12,
          bottom: 40,
          top: 15,
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          },
          padding: [5, 10],
          formatter: function(params, ticket, callback) {
            return (
              params[0].name +
              "<br/>" +
              params[0].marker +
              params[0].seriesName +
              ": " +
              params[0].value +
              "<br/>" +
              params[1].marker +
              params[1].seriesName +
              ": " +
              params[1].value +
              "<br/>" +
              params[2].marker +
              params[2].seriesName +
              ": " +
              params[2].value +
              "%<br/>"
            );
          }
        },
        yAxis: [
          {
            splitArea: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                // color: "#ffffff",
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#142e8a",
                width: 1
                // type: "dashed",
              }
            }
          },
          {
            type: "value",
            name: "数量",
            min: 0,
            max: 100,
            splitArea: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                // color: "#ffffff"
              }
            },
            splitLine: {
              lineStyle: {
                color: "#142e8a",
                width: 1
                // type: "dashed",
              }
            }
          }
        ],

        legend: {
          data: ["计划培训人数", "实际培训人数", "完成率"],
          itemWidth: 20, //图例图形宽度
          itemHeight: 14, //图例图形高度
          textStyle: {
            color: "#ffffff" //图例文字颜色
          },
          x: "center",
          y: "86%"
        },
        series: [
          {
            name: "计划培训人数",
            symbol: "circle", //设定为实心点
            symbolSize: 10, //设定实心点的大小
            // symbol: "none", //去掉折线图中的节点
            itemStyle: {
              normal: {
                color: "#ff9c00",
                lineStyle: {
                  color: "#ff9c00",
                  width: 2
                }
              }
            },
            smooth: true,
            type: "line",
            data: this.planArr,
            animationDuration: 2800,
            animationEasing: "cubicInOut"
          },
          {
            name: "实际培训人数",
            symbol: "circle", //设定为实心点
            symbolSize: 10, //设定实心点的大小
            // symbol: "none", //去掉折线图中的节点
            itemStyle: {
              normal: {
                color: "#02c8dd",
                lineStyle: {
                  color: "#02c8dd",
                  width: 2
                }
              }
            },
            smooth: true, //true 为平滑曲线，false为直线
            type: "line",
            data: this.completeArr,
            animationDuration: 2800,
            animationEasing: "cubicInOut"
          },
          {
            name: "完成率",
            type: "line",
            yAxisIndex: 1,
            smooth: true,
            symbol: "none",
            data: this.finishRate,
            itemStyle: {
              normal: {
                color: "#0CD068",
                lineStyle: {
                  color: "#0CD068",
                  width: 2
                }
              }
            }
          }
        ]
      });
    }
  }
};
</script>
