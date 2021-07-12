
<!-- 地图 -->
<template>
  <div :class="className" :style="{ height: height, width: width , marginTop:'38px'}" />
</template>

<script>
import echarts from "echarts";
require("echarts/map/js/china");
require("echarts/theme/macarons"); // echarts theme
import { mapData } from "@/api/dataBulletinBoard/index"; //地图数据
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
      default: "574px"
    },
    autoResize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.dataBulletinBoard();
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
      console.log(111)
      let res = await mapData(data);
      console.log(22222222,res)
      // console.log(res);
      // 项目清单省份列表
      let datas = [];
      for (let v of res.buidingProjectList) {
        if (v.position) {
          // 返回省份名称
          // console.log(v.position)
          let t = this.getArea(v.position);
          // 有省份用省份 没有用市
          console.log(t,888888888)
              t= t.Province ? t.Province : t.City
          datas.push(t);
        }
      }
      // console.log(datas);
      // 统计省份及数量
      let ths = this.getWordCnt(datas);
      let arrtr = [];
      for (let val in ths) {
        let f = {
          name: val,
          value: ths[val]
        };
        arrtr.push(f);
      }
      this.initChart(arrtr);
      console.log(arrtr,"地图")
    },
    initChart(arrtr) {
      var geoCoordMap = {
        甘肃省: [103.73, 36.03],
        青海省: [101.74, 36.56],
        四川省: [104.06, 30.67],
        河北省: [114.48, 38.03],
        云南省: [102.73, 25.04],
        贵州省: [106.71, 26.57],
        湖北省: [114.31, 30.52],
        河南省: [113.65, 34.76],
        山东省: [117, 36.65],
        江苏省: [118.78, 32.04],
        安徽省: [117.27, 31.86],
        浙江省: [120.19, 30.26],
        江西省: [115.89, 28.68],
        福建省: [119.3, 26.08],
        广东省: [113.23, 23.16],
        湖南省: [113, 28.21],
        海南省: [110.35, 20.02],
        辽宁省: [123.38, 41.8],
        吉林省: [125.35, 43.88],
        黑龙江省: [126.63, 45.75],
        山西省: [112.53, 37.87],
        陕西省: [108.95, 34.27],
        台湾省: [121.3, 25.03],
        北京市: [116.46, 39.92],
        上海市: [121.48, 31.22],
        重庆市: [106.54, 29.59],
        天津市: [117.2, 39.13],
        内蒙古自治区: [111.65, 40.82],
        广西壮族自治区: [108.33, 22.84],
        西藏自治区: [91.11, 29.97],
        宁夏回族自治区: [106.27, 38.47],
        新疆维吾尔自治区: [87.68, 43.77],
        // 香港: [114.17, 22.28],
        // 澳门: [113.54, 22.19]
      };
      var moveLine = {
        normal: [
          {
            fromName: "北京",
            toName: "北京",
            coords: [
              [116.46, 39.92],
              [116.46, 39.92]
            ]
          },
          {
            fromName: "北京",
            toName: "天津",
            coords: [
              [116.46, 39.92],
              [117.2, 39.13]
            ]
          },
          {
            fromName: "北京",
            toName: "上海",
            coords: [
              [116.46, 39.92],
              [121.48, 31.22]
            ]
          },
          {
            fromName: "北京",
            toName: "重庆",
            coords: [
              [116.46, 39.92],
              [106.54, 29.59]
            ]
          },
          {
            fromName: "北京",
            toName: "河北",
            coords: [
              [116.46, 39.92],
              [114.48, 38.03]
            ]
          },
          {
            fromName: "北京",
            toName: "河南",
            coords: [
              [116.46, 39.92],
              [113.65, 34.76]
            ]
          },
          {
            fromName: "北京",
            toName: "云南",
            coords: [
              [116.46, 39.92],
              [102.73, 25.04]
            ]
          },
          {
            fromName: "北京",
            toName: "辽宁",
            coords: [
              [116.46, 39.92],
              [123.38, 41.8]
            ]
          },
          {
            fromName: "北京",
            toName: "黑龙江",
            coords: [
              [116.46, 39.92],
              [126.63, 45.75]
            ]
          },
          {
            fromName: "北京",
            toName: "湖南",
            coords: [
              [116.46, 39.92],
              [113, 28.21]
            ]
          },
          {
            fromName: "北京",
            toName: "安徽",
            coords: [
              [116.46, 39.92],
              [117.27, 31.86]
            ]
          },
          {
            fromName: "北京",
            toName: "山东",
            coords: [
              [116.46, 39.92],
              [117, 36.65]
            ]
          },
          {
            fromName: "北京",
            toName: "新疆",
            coords: [
              [116.46, 39.92],
              [87.68, 43.77]
            ]
          },
          {
            fromName: "北京",
            toName: "江苏",
            coords: [
              [116.46, 39.92],
              [118.78, 32.04]
            ]
          },
          {
            fromName: "北京",
            toName: "浙江",
            coords: [
              [116.46, 39.92],
              [120.19, 30.26]
            ]
          },
          {
            fromName: "北京",
            toName: "江西",
            coords: [
              [116.46, 39.92],
              [115.89, 28.68]
            ]
          },
          {
            fromName: "北京",
            toName: "湖北",
            coords: [
              [116.46, 39.92],
              [114.31, 30.52]
            ]
          },
          {
            fromName: "北京",
            toName: "广西",
            coords: [
              [116.46, 39.92],
              [108.33, 22.84]
            ]
          },
          {
            fromName: "北京",
            toName: "甘肃",
            coords: [
              [116.46, 39.92],
              [103.73, 36.03]
            ]
          },
          {
            fromName: "北京",
            toName: "山西",
            coords: [
              [116.46, 39.92],
              [112.53, 37.87]
            ]
          },
          {
            fromName: "北京",
            toName: "内蒙古",
            coords: [
              [116.46, 39.92],
              [111.65, 40.82]
            ]
          },
          {
            fromName: "北京",
            toName: "陕西",
            coords: [
              [116.46, 39.92],
              [108.95, 34.27]
            ]
          },
          {
            fromName: "北京",
            toName: "吉林",
            coords: [
              [116.46, 39.92],
              [125.35, 43.88]
            ]
          },
          {
            fromName: "北京",
            toName: "福建",
            coords: [
              [116.46, 39.92],
              [119.3, 26.08]
            ]
          },
          {
            fromName: "北京",
            toName: "贵州",
            coords: [
              [116.46, 39.92],
              [106.71, 26.57]
            ]
          },
          {
            fromName: "北京",
            toName: "广东",
            coords: [
              [116.46, 39.92],
              [113.23, 23.163]
            ]
          },
          {
            fromName: "北京",
            toName: "青海",
            coords: [
              [116.46, 39.92],
              [101.74, 36.56]
            ]
          },
          {
            fromName: "北京",
            toName: "西藏",
            coords: [
              [116.46, 39.92],
              [91.11, 29.97]
            ]
          },
          {
            fromName: "北京",
            toName: "四川",
            coords: [
              [116.46, 39.92],
              [104.06, 30.67]
            ]
          },
          {
            fromName: "北京",
            toName: "宁夏",
            coords: [
              [116.46, 39.92],
              [106.27, 38.47]
            ]
          },
          {
            fromName: "北京",
            toName: "海南",
            coords: [
              [116.46, 39.92],
              [110.35, 20.02]
            ]
          },
          {
            fromName: "北京",
            toName: "台湾",
            coords: [
              [116.46, 39.92],
              [121.3, 25.03]
            ]
          },
          {
            fromName: "北京",
            toName: "香港",
            coords: [
              [116.46, 39.92],
              [114.17, 22.28]
            ]
          },
          {
            fromName: "北京",
            toName: "澳门",
            coords: [
              [116.46, 39.92],
              [113.54, 22.19]
            ]
          }
        ],
        warning: []
      };
      var data=arrtr
      // var data = [
      //   { name: "天津", value: 120 },
      //   { name: "河北", value: 156 },
      //   { name: "河南", value: 360 },
      //   { name: "湖南", value: 200 },
      //   { name: "安徽", value: 298 },
      //   { name: "江苏", value: 180 },
      //   { name: "浙江", value: 160 },
      //   { name: "江西", value: 820 },
      //   { name: "湖北", value: 163 },
      //   { name: "福建", value: 230 },
      //   { name: "广东", value: 260 },
      //   { name: "四川", value: 199 }
      // ];
      // let max = 480,
      //   min = 9; // todo
      // let maxSize4Pin = 100,
      //   minSize4Pin = 20;

      let convertData = function(data) {
        let res = [];
        for (let i = 0; i < data.length; i++) {
          let geoCoord = geoCoordMap[data[i].name];
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value)
            });
          }
        }
        return res;
      };

      this.chart = echarts.init(this.$el, "macarons");
      this.chart.setOption({
        tooltip: {
          trigger: "item",
          hoverAnimation: true,
          formatter: function(params, ticket, callback) {
            console.log(params.value + "数据");
            return params.name + " : " + params.value[2];
          }
        },
        visualMap: {
          show: false,
          min: 0,
          max: 500,
          left: "left",
          top: "bottom",
          text: ["高", "低"], // 文本，默认为数值文本
          calculable: true,
          seriesIndex: [1],
          inRange: {
            // color: ['#9074c3', '#4487d5', '#7e9e8e', '#51a2c2']
            // color: ['#3B5077', '#031525'] // 蓝黑
            // color: ['#ffc0cb', '#800080'] // 红紫
            // color: ['#3C3B3F', '#605C3C'] // 黑绿
            //color: ['#0f0c29', '#302b63', '#24243e'] // 黑紫黑
            //color: ['#23074d', '#cc5333'] // 紫红
            // color: ['#00467F', '#A5CC82'] // 蓝绿
            // color: ['#1488CC', '#2B32B2'] // 浅蓝
            // color: ['#00467F', '#A5CC82'] // 蓝绿
          }
        },

        geo: {
          show: true,
          map: "china",
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          // roam: false,
          zoom: 3,
          // roam: true,  //是否开启平游或缩放
          // zoom: 1, //当前视角的缩放比例
          scaleLimit: { //滚轮缩放的极限控制
            min: 1,
            max: 2
          },
          itemStyle: {
            normal: {
              areaColor: "transparent",
              borderColor: "#3fdaff",
              borderWidth: 2,
              shadowColor: "rgba(63, 218, 255, 0.5)",
              shadowBlur: 30
            },
            emphasis: {
              areaColor: "#2B91B7"
            }
          },
          // regions: [
          //   {
          //     name: "南海诸岛",
          //     value: 0,
          //     itemStyle: {
          //       normal: {
          //         opacity: 0,
          //         label: {
          //           show: false
          //         }
          //       }
          //     }
          //   }
          // ]
        },
        series: [
          {
            type: "map",
            map: "china",
            geoIndex: 0,
            aspectScale: 0.75, //长宽比
            showLegendSymbol: false, // 存在legend时显示
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: true,
                textStyle: {
                  color: "#fff"
                }
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: "#031525",
                borderColor: "#FFFFFF"
              },
              emphasis: {
                areaColor: "#2B91B7"
              }
            },
            animation: false,
            data: data
          },

          {
            name: "城市",
            type: "effectScatter",
            coordinateSystem: "geo",
            zlevel: 1,
            showEffectOn: "render",
            rippleEffect: {
              scale: 3,
              brushType: "stroke"
            },
            hoverAnimation: true, //鼠标移上去显示数据
            label: {
              normal: {
                show: true,
                position: "right",
                formatter: "{b}"
              },
              emphasis: {
                show: true
              }
            },
            symbolSize: function(val) {
              return val[2] / 8;
            },
            itemStyle: {
              normal: {
                color: "#F4E925",
                shadowBlur: 10,
                shadowColor: "#05C3F9"
              }
            },
            data: convertData(data)
          }
        ]
      });
    },
    //省市区截取
    getArea(str) {
      let area = {};
      let index11 = 0;
      let index1 = str.indexOf("省");
      if (index1 == -1) {
        index11 = str.indexOf("自治区");
        if (index11 != -1) {
          area.Province = str.substring(0, index11 + 3);
        } else {
          area.Province = str.substring(0, 0);
        }
      } else {
        area.Province = str.substring(0, index1 + 1);
      }

      let index2 = str.indexOf("市");
      if (index11 == -1) {
        area.City = str.substring(index11 + 1, index2 + 1);
      } else {
        if (index11 == 0) {
          area.City = str.substring(index1 + 1, index2 + 1);
        } else {
          area.City = str.substring(index11 + 3, index2 + 1);
        }
      }
      return area;

      // let index3 = str.lastIndexOf("区");
      // if (index3 == -1) {
      //   index3 = str.indexOf("县");
      //   area.Country = str.substring(index2 + 1, index3 + 1);
      // } else {
      //   area.Country = str.substring(index2 + 1, index3 + 1);
      // }
      // return area;
    },
    //统计一个数组中有多少个不重复的单词：
    getWordCnt(arr) {
      return arr.reduce(function(prev, next) {
        prev[next] = prev[next] + 1 || 1;
        return prev;
      }, {});
    }
  }
};
</script>
