<!-- 隐患报告 -->
<template>
	<div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
	import echarts from "echarts";
	import {
		dangerReport
	} from "@/api/dataBulletinBoard/index"; //隐患报告
	require("echarts/theme/macarons"); // echarts theme

	export default {
		props: {
			date_year:{
				type: String,
				default: "",
			},
			className: {
				type: String,
				default: "chart",
			},
			width: {
				type: String,
				default: "100%",
			},
			height: {
				type: String,
				default: "243px",
			},
			autoResize: {
				type: Boolean,
				default: true,
			},
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
				let data={
					queryYear:this.date_year
				}
				let res = await dangerReport(data);
				// commonlyArr
				// majorArr
				if (res[0] != undefined) {
					this.smallArr.push(res[0].m1, res[0].m2, res[0].m3, res[0].m4, res[0].m5, res[0].m6, res[0].m7, res[0].m8,
						res[0].m9, res[0].m10, res[0].m11, res[0].m12);
				}else{
					this.smallArr =[0,0,0,0,0,0,0,0,0,0,0,0]
				}
				if (res[1] != undefined) {
					this.commonlyArr.push(res[1].m1, res[1].m2, res[1].m3, res[1].m4, res[1].m5, res[1].m6, res[1].m7, res[1].m8,
						res[1].m9, res[1].m10, res[1].m11, res[1].m12);
				}else{
					this.commonlyArr =[0,0,0,0,0,0,0,0,0,0,0,0]
				}
				if (res[2] != undefined) {
					this.majorArr.push(res[2].m1, res[2].m2, res[2].m3, res[2].m4, res[2].m5, res[2].m6, res[2].m7, res[2].m8, res[2]
						.m9, res[2].m10, res[2].m11, res[2].m12);
				}else{
					this.majorArr =[0,0,0,0,0,0,0,0,0,0,0,0]
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
							"12月",
						],
						boundaryGap: false,
						splitArea: {   
							show: false,
						},
						axisTick: {
							show: false,
						},
						axisLabel: {
							show: true,
							textStyle: {
								color: "#fff"
							},
						},
						axisLine: {
							show: true,
							lineStyle: {
								// 设置x轴颜色
								color: "#142e8a",
								// type: "dashed",
								width: 1,
							},
						},
						nameLocation: "start",
					},
					grid: {
						left: 4,
						right: 12,
						bottom: 40,
						top: 15,
						containLabel: true,
					},
					tooltip: {
						trigger: "axis",
						axisPointer: {
							type: "cross",
						},
						padding: [5, 10],
					},
					yAxis: {
						splitArea: {
							show: false,
						},
						axisTick: {
							show: false,
						},
						axisLine: {
							show: false,
							lineStyle: {
								// color: "#ffffff",
							},
						},
						splitLine: {
							show: true,
							lineStyle: {
								color: "#142e8a",
								width: 1,
								// type: "dashed",
							},
						},
					},
					legend: {
						data: ["微小", "一般", "重大"],
						itemWidth: 20, //图例图形宽度
						itemHeight: 14, //图例图形高度
						textStyle: {
							color: "#ffffff", //图例文字颜色
						},
						x: "center",
						y: "86%"
					},
					series: [{
							name: "微小",
							symbol: "circle", //设定为实心点
							symbolSize: 10, //设定实心点的大小
							itemStyle: {
								normal: {
									color: "#009300",
									// areaStyle: {
									// 	type: "default",
									// 	color: "#009300",
									// },
									lineStyle: {
										color: "#009300",
										width: 2,
									},
								},
							},
							smooth: true,
							type: "line",
							data: this.smallArr,
							animationDuration: 2800,
							// animationEasing: "cubicInOut",
						}, {
							name: "一般",
							symbol: "circle", //设定为实心点
							symbolSize: 10, //设定实心点的大小
							itemStyle: {
								normal: {
									color: "#5583FE",
									// areaStyle: {
									// 	type: "default",
									// 	color: "#5583FE",
									// },
									lineStyle: {
										color: "#5583FE",
										width: 2,
									},
								},
							},
							smooth: true,
							type: "line",
							data: this.commonlyArr,
							animationDuration: 2800,
							animationEasing: "cubicInOut",
						},
						{
							name: "重大",
							symbol: "circle", //设定为实心点
							symbolSize: 10, //设定实心点的大小
							smooth: true,
							type: "line",
							itemStyle: {
								normal: {
									color: "#EF1533",
									// areaStyle: {
									// 	type: "default",
									// 	color: "#EF1533",
									// },
									lineStyle: {
										color: "#EF1533",
										width: 2,
									},
								},
							},
							data: this.majorArr,
							animationDuration: 2800,
							animationEasing: "quadraticOut",
						},
					],
				});
			},
		},
	};
</script>
