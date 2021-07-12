<template>
  <div class="MapUpDownWrap">
    <div id="chart" class="chart"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import { PROVINCES, SPECIALPROVINCES, COUNTY } from "./mapJS/constant";
import { getGeoJson } from "./mapJS/maps";
import { mapData } from "@/api/dataBulletinBoard/index"; //地图数据

export default {
  name: "MapUpDown",
  props: {
    date_year: {
      type: String,
      default: "",
    },
  },
  data: () => {
    return {
      mapChart: null,
      mapStack: [],
      timer: null,
      seriesName: "",
      secondName: "",
      sum: 0,
      datas: [], // 筛选的项目清单省份列表
      PCdata: [], // 原始项目清单省份列表
    };
  },
  mounted() {
    this.initChart();
    this.$nextTick(() => {
      this.dataBulletinBoard();
    });
  },
  methods: {
    // 初始化数据
    async initChart() {
      // 初始化echarts实例
      this.mapChart = echarts.init(document.getElementById("chart"));
      this.bindOnClickChart();
      // this.bindOnContextmenuChart();
      this.bindChangeWindow();

      // this.mapChart.showLoading();
      // 获取数据
      const mapName = "china";
      const { geoJson } = await this.getPartAndGeoData("country", mapName);

      // this.mapChart.hideLoading();

      this.registeRenderMap(mapName, geoJson, {
        澳门: {
          left: 113,
          top: 20.5,
          width: 0.7,
        },
        香港: {
          left: 115,
          top: 21.3,
          width: 2,
        },
      });
    },

    // 监听屏幕大小改变
    bindChangeWindow() {
      window.onresize = () => {
        if (this.timer) return;

        this.timer = setTimeout(() => {
          this.mapChart.resize();
          this.timer = null;
        }, 100);
      };
    },
    // 监听弹框显示时的方法
    showPopver() {
      // 处理
    },
    // 监听弹框隐藏时的方法
    hidePopver() {
      // 处理
    },
    bindOnClickChart() {
      var g_clickTime = null;
      var g_TimeFn = null;
      this.mapChart.on("click", async (params) => {
        var myDate = new Date();
        if (g_clickTime == null) {
          //第一次进来
          g_clickTime = myDate.getMilliseconds();
          //起一个定时器，进行重置
          var that = this; //setTimeout内this失效
          g_TimeFn = setTimeout(function () {
            g_clickTime = null;
            that.$emit("func", params, true);
          }, 300);
        } else {
          clearTimeout(g_TimeFn);
          //第二次进来，
          if (Math.abs(myDate.getMilliseconds() - g_clickTime) < 300) {
            //是双击操作
            const { name } = params;

            let ScreeningResults = this.screen(name);//过滤散点重新渲染
            this.datas = ScreeningResults;

            this.$emit("func", params, false); //向父组件传值
            g_clickTime = null;
            this.sum += 1;
            if (this.sum == 1) {
              this.seriesName = name; //第一次双击
            }
            if (this.sum == 2) {
              this.secondName = name; //第二次双击
            }

            if (name === "南海诸岛") return;
            // 点击的是否是省级
            if (PROVINCES.includes(name)) {
              const mapName = `${name}`;
              const { geoJson } = await this.getPartAndGeoData(
                "province",
                mapName
              );
              this.registeRenderMap(mapName, geoJson);
              return;
            }

            // 点击的是否是特殊区域，无法下钻三级，'北京', '天津', '上海', '重庆', '香港', '澳门', '台湾'
            if (SPECIALPROVINCES.includes(this.seriesName)) return;

            // 点击的是否是县级区域，无法下钻四级地图
            if (COUNTY.some((item) => name.indexOf(item) > -1)) return;

            if (this.sum > 2) return;

            // 点击的是否是市级 or 区级

            const mapName = `${name}`;
            const { geoJson } = await this.getPartAndGeoData("city", mapName);

            this.registeRenderMap(mapName, geoJson);
          }
        }
      });
    },

    // // 绑定自定义右击事件
    // bindOnContextmenuChart() {
    //   // 取消右击默认事件
    //   const body = document.getElementsByTagName("body")[0];
    //   body.oncontextmenu = (e) => e.preventDefault();

    //   // 绑定自定义右击事件
    //   this.mapChart.on("contextmenu", (params) => {
    //     this.goBack();
    //   });
    // },

    /**
     * @param {String} type 类型  country：国家级   province：省级   city：市级
     * @param {String} mapName 地图名称 同注册地图方法registerMap 的第一个参数一致
     */
    async getPartAndGeoData(type, mapName) {
      if (type === "country") {
        const { data: geoJson } = await getGeoJson("country", mapName);
        return { geoJson };
      }
      if (type === "province") {
        const { data: geoJson } = await getGeoJson("province", mapName);
        return { geoJson };
      }
      if (type === "city") {
        const { data: geoJson } = await getGeoJson("city", mapName);
        return { geoJson };
      }
    },

    // 返回地图上一级
    goBack(e) {
      // 如果栈中只剩下中国地图
      // debugger;
      if (this.mapStack.length === 1) {
        return;
      }

      if (e) {
        this.datas = this.PCdata;//散点重新渲染
        const { mapName, geoJson } = this.mapStack[0];
        this.registeRenderMap(mapName, geoJson);
        this.sum = 0;
      } else {
        this.mapStack.pop();
        const { mapName, geoJson } = this.mapStack.pop();
        let ScreeningResults = this.screen(mapName);//过滤散点重新渲染
        this.datas = ScreeningResults;
        this.registeRenderMap(mapName, geoJson);
        this.sum = 1;
      }
    },
    /**
     * @description: 地图数据入栈
     * @param {String} mapName 地图名称 同注册地图方法registerMap 的第一个参数一致
     * @param {Object} geoJson 地图geoJson
     */
    pushStack(mapName, geoJson) {
      this.mapStack.push({
        mapName,
        geoJson,
      });
    },

    async dataBulletinBoard() {
      let data = {
        queryYear: this.date_year,
      };
      let res = await mapData(data);
      for (let v of res.buidingProjectList) {
        let longitude = Number(v.longitude);
        let latitude = Number(v.latitude);
        let pc = this.getArea(v.position);
        let t = { name: pc.Province + pc.City, value: [longitude, latitude] };
        this.PCdata.push(t);

      }
      this.datas = this.PCdata;
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
    //筛选散点
    screen(name) {
      let dataPc = [];
      for (let v of this.datas) {
        let pc = this.getArea(v.name);
        if (pc.Province == name || pc.City == name) {
          dataPc.push(v);
        }
      }
      return dataPc;
    },

    /**
     * @description: 注册渲染地图
     * @param {String} mapName 地图名称 同 option/series/map 一致
     * @param {Object} geoJson 地图geoJson
     * @param {Object} specialAreas 特殊区域
     */
    registeRenderMap(mapName, geoJson, specialAreas = {}) {
      // 注册地图
      echarts.registerMap(mapName, geoJson, specialAreas);
      // 绘制地图
      this.renderMap(mapName, geoJson);
    },

    /**
     * @description: 绘制地图
     * @param {String} mapName 地图名称 同注册地图方法registerMap 的第一个参数一致
     * @param {Object} geoJson 地图geoJson
     */

    renderMap(mapName, geoJson) {
      const option = {
        // title: {
        //   text: mapName,
        // },
        // tooltip: {
        // },
        geo: {
          name: mapName, // 系列名称
          type: "map",
          roam: false, //是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
          map: mapName, // 同 registerMap 方法的第一个参数一致
          // aspectScale: 0.75, //这个参数用于 scale 地图的长宽比。
          zoom: 1.25, // 当前视角的缩放比例
          zlevel: 1, // 用于 Canvas 分层，不同zlevel值的图形会放置在不同的 Canvas 中
          layoutSize: 100,
          scaleLimit: {
            min: 0.7,
            max: 2,
          },
          label: {
            // 非高亮状态下的文本样式
            normal: {
              show: false,
              position: "inside", // 文本标签显示的位置
              textStyle: {
                color: "#de5e60", // 文本颜色
                fontSize: 12,
              },
              // formatter: '{b}\n{c}', // 文本上显示的值  data:[{name: "地名", value: 数据}],  {b}表示label信息,{c}代表value
            },
            // 高亮状态下的文本样式
            emphasis: {
              textStyle: {
                color: "#fff", // 文本颜色
              },
            },
          },
          itemStyle: {
            //地图区域的多边形 图形样式
            // 非高亮状态下的地图块样式
            normal: {
              areaColor: "transparent",
              borderColor: "#3fdaff",
              borderWidth: 2,
              shadowColor: "rgba(63, 218, 255, 0.5)",
              shadowBlur: 30,
              color: "#fff",
              backgroundColor: "", //rgba设置透明度0.1
            },
            //高亮状态下的地图块样式
            emphasis: {
              areaColor: "#2B91B7",
            },
          },
        },
        // 视觉映射
        // visualMap: {
        //   show: false,
        //   min: 0,
        //   max: 0,
        //   text: ["高", "低"],
        //   realtime: true,
        //   calculable: true,
        //   seriesIndex: [1], //设置背景设透明
        //   inRange: {
        //     //color: ["lightskyblue", "#ffffbf", "#fdae61"], // 色阶范围
        //   },
        //   textStyle: {
        //     color: "#de5e60",
        //   },
        // },
        series: [
          {
            name: "销量", // series名称
            type: "scatter", // series图表类型
            coordinateSystem: "geo", // series坐标系类型
            data: this.datas,
          },
        ],
        animation: true,
        animationDuration: 1000,
        animationDurationUpdate: 600,
        animationEasingUpdate: "cubicInOut",
      };

      // 绘制图表
      this.mapChart.setOption(option);
      // 入栈
      this.pushStack(mapName, geoJson);
    },

    /**
     * @param {Object} geoJson 地图geoJson
     */
    getSeriesByPart(geoJson) {
      let originData = geoJson.features.map(({ properties }) => ({
        name: properties.name,
        adcode: properties.adcode,
        value: 0,
      }));
      if (geoJson.attach) {
        const attachOriginData = geoJson.attach.map((item) => ({
          name: item,
          value: 0,
        }));
        originData.push(...attachOriginData);
      }
      originData = originData.filter((item) => item.name !== "");

      return originData;
    },

    /**
     * @description: 根据seriesData 动态计算生成 visualMapMax
     * @param {Array} seriesData 地图数据内容
     */
    getVisualMapMax(seriesData) {
      const maxValue = Math.max(...seriesData.map((item) => item.value));

      return parseInt(maxValue) + 50;
    },
  },
  beforeDestroy() {
    // 销毁地图实例
    this.mapChart.dispose();
  },
};
</script>

<style scoped lang="scss">
.MapUpDownWrap {
  // display: flex;
  // justify-content: center;
  // align-items: center;
  width: 500px;
  height: 520px;
  z-index: 999;
  .chart {
    // width: 50%;
    height: 100%;
    border-radius: 8px;
    // border: 2px solid #de5e60;
    // background-color: rgba(34, 147, 254, 0.3) !important;
  }
}
</style>
