<template>
	<!-- 风险预警 -->
	<div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
	import echarts from "echarts";
	import {
		bottomData
	} from "@/api/dataBulletinBoard/index"; //底部数据
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
				default: "210px",
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
				dataArr: [],
				dataNum: ''
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
				let res = await bottomData(data);
				this.initChart(res.fengxianyujing);
			},
			initChart(res) {
				this.chart = echarts.init(this.$el, "macarons");
				this.chart.setOption({
					tooltip: {
						formatter: "{a}:{c}",
					},
					series: [{
						name: "风险预警",
						detail: {
							offsetCenter: [0, "80%"], //设置仪表盘下方显示内容位置
							formatter: "{value}",
							textStyle: {
								color: "#C7FF20",
								fontSize: 20
							},
						},
						title: {
							//设置仪表盘中间显示文字样式
							textStyle: {
								fontSize: 10,
								fontStyle: "italic",
								color: "white",
							},
						},
						splitLine: {
							//分割线样式（及10、20等长线样式）
							length: 10,
							lineStyle: {
								// 分隔线样式。
								color: "#42E5FB", //线的颜色,默认 #eee。
								opacity: 1, //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
								width: 2, //线度,默认 2。
								type: "solid", //线的类型,默认 solid。 此外还有 dashed,dotted
								shadowBlur: 10, //(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
								shadowColor: "#fff", //阴影颜色。支持的格式同color。
							},
						},
						axisLabel: {
							//文字样式（及“10”、“20”等文字样式）
							color: "white",
							distance: 5, //文字离表盘的距离
						},
						type: "gauge",
						radius: 80,
						center: ["50%", "58%"],
						axisLine: {
							show: true,
							lineStyle: {
								// [
								// 	[
								// 		1,
								// 		new echarts.graphic.LinearGradient(0, 1, 1, 1, [{
								// 				offset: 0.25,
								// 				color: "#0000FF",
								// 			},
								// 			{
								// 				offset: 0.5,
								// 				color: "#FFFF00",
								// 			},
								// 			{
								// 				offset: 0.75,
								// 				color: "#FFA500",
								// 			},
								// 			{
								// 				offset: 1,
								// 				color: "#ff0000",
								// 			},
								// 		]),
								// 	],
								// ],
								color: [
									[0.25, '#0000FF'],
									[0.5, '#FFFF00'],
									[0.75, '#FFA500'],
									[1, '#ff0000']
								]

							},
						},
						data: [{
							value: res,
							name: ""
						}],
					}, ],
				});
			},
		},
	};
</script>
