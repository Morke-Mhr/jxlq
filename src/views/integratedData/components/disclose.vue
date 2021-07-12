<!-- 隐患报告 -->
<template>
  <div>
    <el-row>
      <el-col :span="12">
        <template>
          <div
            :class="className"
            id="yiji"
            :style="{ height: height, width: width }"
          />
          <div class="title">
            <p>技术交底签收率</p>
          </div>
        </template>
      </el-col>
      <el-col :span="12">
        <template>
          <div
            :class="className"
            id="erji"
            :style="{ height: height, width: width }"
          />
          <div class="title">
            <p>技术交底完成率</p>
          </div>
        </template>
      </el-col>
      <!-- <el-col :span="8">
        <template>
          <div :class="className" id="shanji" :style="{ height: height, width: width }" />
          <div class="title">
            <p>三级交底</p>
          </div>
        </template>
      </el-col> -->
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
// import { editor } from "@/api/dataBulletinBoard/index"; //隐患报告
import { color } from 'echarts/lib/export'
// require("echarts/theme/macarons"); // echarts theme

export default {
  props: {
    firstObj: {
      type: Number
    },
    secondObj: {
      type: Number
    },
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '193px'
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
      smallArr: [],
      commonlyArr: [],
      majorArr: []
    }
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
    // let firstObj
    // let secondObj
    // let thirdObj;
    // for (let i in this.data) {
    // if (this.data[i].jdType == "一级技术交底") {
    //   firstObj = this.data[i];
    // }
    // if (this.data[i].jdType == "二级技术交底") {
    //   secondObj = this.data[i];
    // }
    // if (this.data[i].jdType == "三级技术交底") {
    //   thirdObj = this.data[i];
    // }
    // }
    

    console.log(this.firstObj, this.secondObj, '/************000000')
    this.dataBulletinBoard(this.firstObj, this.secondObj)
    // this.dataBulletinBoard(firstObj,secondObj,thirdObj);
    // this.$nextTick(() => {
    // 	this.initChart();
    // });
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    dataBulletinBoard(firstObj, secondObj) {
      console.log(firstObj, secondObj, '/////////000000')
      let data = [
        {
          value: 100 - 87,
          // name: '计划交底',
          label: {
            normal: {
              show: false,
              color: '#5C6A86'
            }
          }
        },
        {
          value: 87,
          // name: '实际交底',
          label: {
            normal: {
              show: true,
              // padding: [40, 0, 0, 0],
              color: '#07E6ED'
            }
          }
        }
      ]
      let data2 = [
        {
          value: 100 - 96,
          // name: '计划交底',
          label: {
            normal: {
              show: false,
              color: '#5C6A86'
            }
          }
        },
        {
          value: 96,
          // name: '实际交底',
          label: {
            normal: {
              show: true,
              // padding: [40, 0, 0, 0],
              color: '#EBFA00'
            }
          }
        }
      ]
      // let data3 = [
      //   {
      //     value: thirdObj.planNumber,
      //     name: "计划交底",
      //     label: {
      //       normal: {
      //         show: true,
      //         color: "#5C6A86"
      //       }
      //     }
      //   },
      //   {
      //     value: thirdObj.completeNumber,
      //     name: "实际交底",
      //     label: {
      //       normal: {
      //         show: true,
      //         padding: [40, 0, 0, 0],
      //         color: "#FB4542"
      //       }
      //     }
      //   }
      // ];
      this.initChart('yiji', '#07E6ED', data)
      this.initChart('erji', '#FFD647', data2)
      // this.initChart("shanji", "#FB4542", data3);
    },
    initChart(dom, initialcolor, data) {
      let ele = document.getElementById(dom)
      this.chart = echarts.init(ele)
      this.chart.setOption({
        color: ['#5C6A86', initialcolor],
        grid: {
          left: 1,
          right: 1,
          bottom: 15,
          top: 25,
          containLabel: true
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          show: false
        },
        series: [
          {
            type: 'pie',
            radius: ['60%', '70%'],
            avoidLabelOverlap: false,
            hoverAnimation: false, // hover 放大
            label: {
              normal: {
                //中心默认文字
                position: 'center',
                fontSize: 16,
                fontWeight: 'bold',
                formatter: '{c}' + '%' // {b}:数据名； {c}：数据值； {d}：百分比，可以自定义显示内容，
              }
            },
            emphasis: {
              //鼠标移入动态的时候显示的默认样式
              label: {
                show: false,
                fontSize: '12',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              //头
              show: false
            },
            data: data,
            animationDuration: 2800
            // animationEasing: "cubicInOut",
          }
        ]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  height: 30px;
  margin-bottom: 20px;
  text-align: center;
  color: #ffffff;
}
.title > p {
  margin: 0;
  color: transparent;
  -webkit-text-fill-color: #ffffff; /*文字的填充色*/
  -webkit-text-stroke: 0.5px #257bc4;
}
</style>
