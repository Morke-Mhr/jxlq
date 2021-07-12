<!-- 安全责任书签署 -->
<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import { userSafebook } from "@/api/dataBulletinBoard/index"; //底部数据
const animationDuration = 6000;

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
    }
  },
  data() {
    return {
      name: [],
      employees: [],
      completion: [],
      signed: [],
      chart: null
    };
  },
  mounted() {
    this.dataBulletinBoard();
    this.$nextTick(() => {
      this.initChart();
    });
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
      let res = await userSafebook(data);
      for (let v of res) {
        this.name.push(v.name);
        this.employees.push(v.employees);
        this.completion.push(Math.round(parseFloat(v.completion) * 100) + "");
        this.signed.push(v.signed);
      }
      console.log(this.completion, 7777777777777777);
      this.initChart();
    },
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");

      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          formatter: function(params, ticket, callback) {
            return params[0].name+"<br/>"+
                   params[0].marker+params[0].seriesName+": "+params[0].value+"<br/>"+
                   params[1].marker+params[1].seriesName+": "+params[1].value+"<br/>"+
                   params[2].marker+params[2].seriesName+": "+params[2].value+"%<br/>"
          }
          // axisPointer: {
          //   // 坐标轴指示器，坐标轴触发有效
          //   type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          // },
        },
        grid: {
          top: 16,
          left: "2%",
          right: "2%",
          bottom: "20%",
          containLabel: true
        },
        legend: {
          data: ["员工数", "已签数", "完成率"],
          itemWidth: 12, //图例图形宽度
          itemHeight: 12, //图例图形高度
          textStyle: {
            color: "#ffffff" //图例文字颜色
          },
          x: "center",
          y: "86%"
        },
        xAxis: [
          {
            type: "category",
            data: this.name,
            splitArea: {
              show: false
            },
            axisTick: {
              alignWithLabel: false
            },
            axisLabel: {
              show: true,
              interval: 0,
              rotate: 40,
              textStyle: {
                color: "#fff"
              }
            },
            axisLine: {
              lineStyle: {
                // 设置x轴颜色
                color: "#142e8a",
                width: 1
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "数量",
            splitArea: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#ffffff"
              }
            },
            splitLine: {
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
                color: "#ffffff"
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
        series: [
          {
            name: "员工数",
            type: "bar",
            data: this.employees,
            barWidth: 16,
            itemStyle: {
              normal: {
                color: "#0E6DE9",
                lineStyle: {
                  color: "#0E6DE9",
                  width: 2
                },
                label: {
                  show: true, //开启显示
                  position: "top", //在上方显示
                  textStyle: {
                    //数值样式
                    color: "#ffffff",
                    fontSize: 12
                  }
                }
              }
            },
            animationDuration
          },
          {
            name: "已签数",
            type: "bar",
            data: this.signed,
            barWidth: 14,
            itemStyle: {
              normal: {
                color: "#02C8DD",
                lineStyle: {
                  color: "#02C8DD",
                  width: 2
                },
                label: {
                  show: true, //开启显示
                  position: "top", //在上方显示
                  textStyle: {
                    //数值样式
                    color: "#ffffff",
                    fontSize: 12
                  }
                }
              }
            },
            animationDuration
          },
          {
            name: "完成率",
            type: "line",
            yAxisIndex: 1,
            smooth: true,
            symbol: "none",
            data: this.completion,
            itemStyle: {
              normal: {
                color: "#E6AF08",
                lineStyle: {
                  color: "#E6AF08",
                  width: 2
                }
              }
            },
            animationDuration
          }
        ]
      });
    }
  }
};
</script>
