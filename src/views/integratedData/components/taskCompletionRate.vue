<template>
	<!-- 任务完成率 -->
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
				default: "282px"
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
				dataNum: ""
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
				let datas = {
					queryYear: this.date_year
				};
				let res = await bottomData(datas);
				let data = {
					yhzhenggailv: res.yhzhenggailv,
					yhzhenggaiUnfinishCount: res.yhzhenggaiUnfinishCount,
					yhzhenggaiFinishCount: res.yhzhenggaiFinishCount
				};
				this.initChart(data);
			},
			initChart(data) {
				this.chart = echarts.init(this.$el, "macarons");
				this.chart.setOption({
					title: {
						show: true,
						text: "隐患整改率：" + data.yhzhenggailv,
						x: "center",
						y: "70%",
						textStyle: {
							fontSize: "15",
							color: "white",
							fontWeight: "normal"
						}
					},
					tooltip: {
						trigger: "item",
						// formatter: "{b}:{d}%",
						formatter: function(params, ticket, callback) {
							let name = params.name.split("：")
							return params.marker + name[0] + ":<br/>&nbsp;&nbsp;&nbsp;&nbsp;" + params.percent + "%"
						},
						show: true
					},
					color: ["#71EBFD", "#6C7994"],
					legend: {
						show: true,
						top: "77%",
						left: "center",
						textStyle: {
							color: "#fffff",
							fontSize: 12
						}
					},
					series: {
						name: "",
						type: "pie",
						radius: ["40%", "75%"],
						center: ["50%", "40%"],
						avoidLabelOverlap: false,
						hoverAnimation: false,
						itemStyle: {
							borderRadius: 15,
							borderColor: "#0b1260",
							borderWidth: 15
						},
						label: {
							normal: {
								show: false,
								position: "center"
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
						// data: [{
						// 		value: this.dataNum,
						// 		name: "已整改："+this.dataNum+"条"
						// 	},
						// 	{
						// 		value: 100 - this.dataNum,
						// 		name: "未整改："+ 100 -this.dataNum+"条"
						// 	},
						// ],
						data: [{
								value: data.yhzhenggaiFinishCount,
								name: "已整改：" + data.yhzhenggaiFinishCount + "条"
							},
							{
								value: data.yhzhenggaiUnfinishCount,
								name: "未整改：" + data.yhzhenggaiUnfinishCount + "条"
							}
						]
					}
				});
			}
		}
	};
</script>
