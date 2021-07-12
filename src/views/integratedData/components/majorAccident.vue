<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
import { bottomData } from '@/api/dataBulletinBoard/index' //底部数据
require('echarts/theme/macarons') // echarts theme

export default {
  props: {
    date_year: {
      type: String,
      default: ''
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
      default: '282px'
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
      dataArr: {},
      dataNum: ''
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
    this.dataBulletinBoard()
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
    async dataBulletinBoard() {
      let data = {
        queryYear: this.date_year
      }
      let res = await bottomData(data)
      let num = 365 - res.zeroAccidentCount
      if (num < 0) {
        num = 0
      }
      let dataNum = res.zeroAccidentCount
      let _obj = {}
      _obj.name = dataNum
      _obj.value = num
      this.dataArr = _obj
      this.initChart()
      console.log(this.dataArr, 6666555555)
    },
    initChart() {
      let that = this
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        title: {
          show: true,
          // this.dataArr.name
          text: '考核达标率:80%',
          x: 'center',
          y: '70%',
          textStyle: {
            fontSize: '15',
            color: 'white',
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: function(params, ticket, callback) {
            return '考核达标率:80%'
          },
          show: true
        },
        color: ['#0bcd64', '#6C7994'],
        legend: {
          show: true,
          top: '77%',
          left: 'center',
          textStyle: {
            color: '#fffff',
            fontSize: 12
          }
        },
        series: {
          name: '',
          type: 'pie',
          radius: ['40%', '75%'],
          center: ['50%', '40%'],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          itemStyle: {
            borderRadius: 15,
            borderColor: '#0b1260',
            borderWidth: 15
          },
          label: {
            normal: {
              show: false,
              position: 'center'
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
              value: 85,
              name: '已达标 85 人'
            },
            {
              value: 15,
              name: '未达标 15 人'
            }
          ]
        }
        // series: [{
        // 	type: 'pie',
        // 	radius: "75%",
        // 	center: ['50%', '40%'],
        // 	data: this.dataArr,
        // 	label: {
        // 		normal: {
        // 			formatter: '{b}',
        // 			textStyle: {
        // 				color: 'red',
        // 				insideColor: 'yellow',
        // 				fontSize: 40
        // 			}
        // 		}
        // 	}
        // }]
      })
    }
  }
}
</script>
