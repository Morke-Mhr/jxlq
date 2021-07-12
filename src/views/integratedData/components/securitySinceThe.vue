<template>
	<!-- 安全履职 -->
	<div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
	import echarts from "echarts";
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
			chartData: {
				type: Object,
				required: true,
			},
		},
		data() {
			return {
				chart: null,
			};
		},
		watch: {
			chartData: {
				deep: true,
				handler(val) {
					this.setOptions(val);
				},
			},
		},
		mounted() {
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
			initChart() {
				this.chart = echarts.init(this.$el, "macarons");
				this.setOptions(this.chartData);
			},
			setOptions({
				expectedData,
				actualData,
				wanData
			} = {}) {
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
								color: "#fff",
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
								color: "#ffffff",
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
						data: ["计划数量", "完成数量", "完成率"],
						itemWidth: 20, //图例图形宽度
						itemHeight: 14, //图例图形高度
						textStyle: {
							color: "#ffffff", //图例文字颜色
						},
						x: "center",
						y: "86%",
					},
					series: [{
							name: "计划数量",
							symbol: "none",
							itemStyle: {
								normal: {
									color: "#0E6DE9",
									areaStyle: {
										type: "default",
										color: "#031e4d",
									},
									lineStyle: {
										color: "#0E6DE9",
										width: 2,
									},
								},
							},
							smooth: false,
							type: "line",
							// data: expectedData,
							data: [92, 88, 100, 92, 96, 94, 93, 95, 91, 100, 99, 90],
							animationDuration: 2800,
							animationEasing: "cubicInOut",
						},
						{
							name: "完成数量",
							symbol: "none",
							smooth: true,
							type: "line",
							itemStyle: {
								normal: {
									color: "#AC4ED3",
									lineStyle: {
										color: "#AC4ED3",
										width: 2,
									},
								},
							},
							// data: actualData,
							data: [90, 87, 98, 90, 93, 91, 92, 91, 89, 95, 94, 87],
							animationDuration: 2800,
							animationEasing: "quadraticOut",
						},
						{
							name: "完成率",
							// symbol: "circle", //设定为实心点
							// symbolSize: 0, //设定实心点的大小
							symbol: "none", //去掉折线图中的节点
							itemStyle: {
								normal: {
									color: "#E6AF08",
									lineStyle: {
										color: "#E6AF08",
										width: 2,
									},
								},
							},
							smooth: true, //true 为平滑曲线，false为直线
							type: "line",
							// data: wanData,
							data: [98, 99, 98, 97, 98, 97, 98, 97, 98, 99, 98, 97],
							animationDuration: 2800,
							animationEasing: "cubicInOut",
						},
					],
				});
			},
		},
	};
</script>
