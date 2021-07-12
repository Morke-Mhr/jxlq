<template>
	<!-- 安全技术交底 -->
	<div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
	import echarts from "echarts";
	import {
		technicalDisclosure
	} from "@/api/dataBulletinBoard/index"; //安全技术交底
	require("echarts/theme/macarons"); // echarts theme

	export default {
		props: {
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
				completeArr: [],
				planArr: [],
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
				let res = await technicalDisclosure();
				//rewardMoney=奖励 punishMoney=惩罚
				for (let i in res) {
					this.completeArr.push(res[i].completeNumber)
					this.planArr.push(res[i].planNumber)
				}
				this.initChart();
			},
			initChart: function() {
				let dataNan = [320, 302, 301, ];
				let dataNv = [316, 298, 295, ];
				this.chart = echarts.init(this.$el, "macarons");
				this.chart.setOption({
					color: ["#1890ff", "#2fc25b"],
					tooltip: {
						trigger: "axis",
						axisPointer: {
							// 坐标轴指示器，坐标轴触发有效
							type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
						},
					},
					legend: {
						data: ["计划交底人数", "实际交底人数"],
						textStyle: {
							color: "#ffffff",
						},
						x: "center",
						y: "86%",
					},
					grid: {
						left: "6%",
						right: "10%",
						bottom: 40,
						top: 30,
						containLabel: true,
					},
					xAxis: {
						type: "value",
						splitArea: {
							show: false,
						},
						splitLine: {
							show: false,
						},
						axisLine: {
							show: false,
							lineStyle: {
								color: "#262f45",
							},
						},
						axisTick: {
							show: false,
						},
						axisLabel: {
							show: false,
							textStyle: {
								color: "#3DB1DF",
							},
						},
					},
					yAxis: {
						type: "category",
						data: ["一级", "二级", "三级"],
						splitArea: {
							show: false,
						},
						splitLine: {
							show: false,
						},
						axisLine: {
							lineStyle: {
								color: "#fff",
							},
							show: false,
						},
						axisTick: {
							show: false,
						},
						axisLabel: {
							show: true,
							textStyle: {
								color: "#fff",
							},
						},
					},
					series: [{
							name: "计划交底人数",
							type: "bar",
							// stack: "总量",
							label: {
								show: true,
								// position: "insideRight",
							},
							data: this.planArr,
							barWidth: 12,
							fontSize: 12,
							itemStyle: {
								normal: {
									color: "#02A4FA",
									lineStyle: {
										color: "#02A4FA",
										width: 2,
									},
									label: {
										show: true, //开启显示
										position: "right", //在右边显示
										textStyle: {
											//数值样式
											color: "#ffffff",
											fontSize: 12,
										},
									},
								},
							},
						},
						{
							name: "实际交底人数",
							type: "bar",
							// stack: "总量",
							label: {
								show: true,
								// position: "insideRight",
							},
							data: this.completeArr,
							barWidth: 12,
							fontSize: 12,
							itemStyle: {
								normal: {
									color: "#F69907",
									lineStyle: {
										color: "#F69907",
										width: 2,
									},
									label: {
										show: true,
										position: "right",
										textStyle: {
											//数值样式
											color: "#ffffff",
											fontSize: 12,
										},
									},
								},
							},
						},
						// {
						//   name: "总计",
						//   type: "bar",
						//   stack: "总计",
						//   barGap: "-100%",
						//   barWidth: 20,
						//   fontSize: 13,
						//   label: {
						//     normal: {
						//       show: true,
						//       position: "right",
						//       textStyle: {
						//         color: "#fff",
						//       },
						//       // formatter: function(v) {
						//       // 	return "总计：" + (v.value)
						//       // }
						//     },
						//   },
						//   itemStyle: {
						//     normal: {
						//       color: "rgba(128, 128, 128, 0)",
						//       // borderWidth: 1,
						//       // borderColor: '#1FBCD2'
						//     },
						//   },
						//   data: dataZs,
						// },
					],
				});
			},
		},
	};
</script>
