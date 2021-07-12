<template>
	<!-- 安全考核激励 -->
	<div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
	import echarts from "echarts";
	import {
		punishmentReward
	} from "@/api/dataBulletinBoard/index"; //安全考核激励
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
		},
		data() {
			return {
				chart: null,
				punishmentArr: [],
				rewardArr: []
			};
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
				let res = await punishmentReward();
				//rewardMoney=奖励 punishMoney=惩罚
				for (let i in res) {
					this.punishmentArr.push(res[i].punishMoney)
					this.rewardArr.push(res[i].rewardMoney)
				}
				this.initChart();
			},
			initChart: function() {
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
						data: [{
								name: "处罚",
								icon: "circle", //强制设置图形长方形
								textStyle: {
									color: "#ffffff"
								}, //设置文本为红色
							},
							{
								name: "奖励",
								icon: "circle", //强制设置图形为长方形rectangular
								textStyle: {
									color: "#ffffff"
								}, //设置文本为红色
							},
						],
						itemWidth: 20, //图例图形宽度
						itemHeight: 14, //图例图形高度
						textStyle: {
							color: "#ffffff", //图例文字颜色
						},
						x: "center",
						y: "86%"
					},
					series: [{
							name: "处罚",
							symbol: "circle", //设定为实心点
							symbolSize: 12, //设定实心点的大小
							itemStyle: {
								normal: {
									color: "#2c2c44",
									borderColor: "#974242",
									borderWidth: 2,
									// areaStyle: {
									//   type: "default",
									//   color: "#031e4d",
									// },
									lineStyle: {
										show: false,
										color: "rgba(0,0,0,0)",
										width: 0,
									},
								},
							},
							smooth: false,
							type: "line",
							data: this.punishmentArr,
							animationDuration: 2800,
							animationEasing: "cubicInOut",
						},
						{
							name: "奖励",
							symbol: "circle", //设定为实心点
							symbolSize: 18, //设定实心点的大小
							// symbol: "none", //去掉折线图中的节点
							itemStyle: {
								normal: {
									color: "#0a385b",
									borderColor: "#1b7d9a",
									borderWidth: 2,
									lineStyle: {
										show: false,
										color: "rgba(0,0,0,0)",
										width: 0,
									},
								},
							},
							smooth: true, //true 为平滑曲线，false为直线
							type: "line",
							data: this.rewardArr,
							animationDuration: 2800,
							animationEasing: "cubicInOut",
						},
					],
				});
			},
		},
	};
</script>
