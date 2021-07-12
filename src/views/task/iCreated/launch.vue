<template>
	<div class="app-container">
		<!-- 排序搜索 -->
		<div class="sxForm">
			<el-form ref="form" :model="form" :inline="true" class="demo-form-inline">
				<el-form-item label="责任人">
					<el-input v-model="form.chargerName"></el-input>
				</el-form-item>
				<el-form-item label="任务类型">
					<el-select v-model="form.type" clearable placeholder="请选择任务类型">
						<el-option v-for="(item, index) of typeType" :key="index" :label="item.dictLabel" :value="item.dictCode"></el-option>
					</el-select>
				</el-form-item>
				<!-- <el-form-item label="时长" prop="bankName"> -->
				<!-- <el-date-picker v-model="form.costTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"  placeholder="选择日期时间"></el-date-picker> -->
				<!-- <el-input
            @mousewheel.native.prevent
            oninput="value=value.replace(/[^\d]/g,'')"
            type="number"
            v-model="form.costTime"
          ></el-input>
        </el-form-item> -->
				<!-- <el-form-item label="时长单位">
          <el-select v-model="form.costTimeUnit" placeholder="请选择时长单位">
            <el-option
              v-for="(item, index) of costTimeUnit"
              :key="index"
              :label="item.title"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item> -->
				<div class="btnCont">
					<el-button class="chaxun" v-has="has.getlist" @click="query">查询</el-button>
					<el-button class="chongzhi" @click="Reset">重置</el-button>
				</div>
			</el-form>
		</div>
		<div class="sxTable">
			<el-button class="blue" :loading="exportloading" @click="taskexport">导出</el-button>
			<el-button class="blue" @click="taskbatch('withdraw')">批量撤回</el-button>
			<el-button class="blue" v-has="has.taskUrge" @click="taskbatch('Urging')">批量催办</el-button>
			<!-- 表格 -->
			<el-table ref="multipleTable" :data="tableData" tooltip-effect="light" style="width: 100%" height="calc(100vh - 380px)"
			 @selection-change="handleSelectionChange" v-loading="loading" stripe>
				<el-table-column type="selection" width="55" align="center"></el-table-column>
				<el-table-column label="类型" width="140" show-overflow-tooltip align="center">
					<template slot-scope="scope">{{ scope.row.typeName }}</template>
				</el-table-column>
				<el-table-column prop="name" label="名称" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="content" label="目标" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="hintMessage" label="说明/提示" show-overflow-tooltip width="150" align="center"></el-table-column>
				<!-- <el-table-column
          label="权重"
          width="100"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.priority + '级' }}
          </template>
        </el-table-column> -->
				<!-- <el-table-column
          label="难度"
          width="100"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.difficultDegree | difficulty }}
          </template>
        </el-table-column> -->
				<el-table-column label="责任人" width="100" show-overflow-tooltip align="center">
					<template slot-scope="scope">{{ scope.row.UserName }}</template>
				</el-table-column>
				<el-table-column label="状态" width="100" show-overflow-tooltip align="center">
					<template slot-scope="scope">
						{{ scope.row.status | status }}
					</template>
				</el-table-column>

				<el-table-column label="开始时间" width="120" show-overflow-tooltip align="center">
					<template slot-scope="scope">
						{{ scope.row.startTime }}
					</template>
				</el-table-column>
				<el-table-column label="结束时间" width="120" show-overflow-tooltip align="center">
					<template slot-scope="scope">
						{{ scope.row.endTime }}
					</template>
				</el-table-column>

				<el-table-column label="操作" width="150" show-overflow-tooltip align="center">
					<template slot-scope="scope">
						<el-button type="text" v-has="has.putstatus" v-if="scope.row.status == 2 || scope.row.status == 3" @click="taskWithdraw(scope.row.taskId)">撤回</el-button>
						<el-button type="text" v-has="has.taskUrge" v-if="scope.row.status == 2 || scope.row.status == 3" @click="taskUrging(scope.$index)">催办</el-button>
						<el-button type="text" @click="taskShow(scope.row.taskId)">查看</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
			 :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" background layout="total, prev, pager, next,sizes,jumper"
			 :total="total"></el-pagination>
		</div>

		<!-- 查看按钮  弹出层查看表单 -->
		<el-dialog title="任务查看" :close-on-click-modal="false" readonly custom-class="small" class="dialog" :visible.sync="dialogShowVisible">
			<div class="formTitle height40">任务信息</div>

			<!-- <el-divider content-position="left">任务信息</el-divider> -->

			<el-form ref="form" :model="form" class="tag" label-width="100px">
				<!-- 类型 -->
				<el-form-item prop="typeId" label="任务类型">
					<el-select v-model="form.typeId" placeholder="请选择任务类型" :disabled="true">
						<el-option v-for="item in optionsTypeId" :label="item.dictLabel" :key="item.dictCode" :value="item.dictCode"></el-option>
					</el-select>
				</el-form-item>
				<!-- 任务名称 -->
				<el-form-item label="任务名称" prop="name">
					<el-input maxlength="25" type="textarea" :autosize="{ minRows: 3 }" show-word-limit v-model="form.name" readonly></el-input>
				</el-form-item>
				<!-- 任务目标 -->
				<el-form-item label="任务目标" prop="content">
					<el-input type="textarea" maxlength="35" :autosize="{ minRows: 3 }" show-word-limit v-model="form.content"
					 readonly></el-input>
				</el-form-item>
				<!-- 提示 -->
				<el-form-item label="提示">
					<el-input type="textarea" maxlength="50" :autosize="{ minRows: 3 }" show-word-limit v-model="form.hintMessage"
					 readonly></el-input>
				</el-form-item>
				<!-- 任务开始时间和结束时间 -->
				<el-row>
					<el-col :span="12">
						<el-form-item label="开始时间" prop="startTime">
							<template slot-scope="scope">
								<el-date-picker v-model="form.startTime" type="date" :picker-options='pickerStartTime' @focus='handleStartTime(UserIDIndex)'
								 readonly placeholder="选择任务开始时间">
								</el-date-picker>
							</template>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="结束时间" prop="endTime">
							<template slot-scope="scope">
								<el-date-picker v-model="form.endTime" type="date" :picker-options='pickerEndTime' @focus='handleEndTime(UserIDIndex)'
								 readonly placeholder="选择任务结束时间">
								</el-date-picker>
							</template>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- 权重 -->
				<el-row>
					<el-col :span="12">
						<el-form-item label="权重">
							<el-select v-model="form.priority" placeholder="请选择权重" :disabled="true">
								<el-option v-for="item in optionspriority" :label="item.label" :key="item.value" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<!-- 难度 -->
					<el-col :span="12">
						<el-form-item label="难度">
							<el-select v-model="form.difficultDegree" placeholder="请选择难度" :disabled="true">
								<el-option v-for="item in optionsdifficultDegree" :label="item.label" :key="item.value" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- 责任人 -->
				<el-row>
					<el-col :span="12">
						<el-form-item label="责任人" prop="responsibility">
							<el-input v-model="form.responsibilityName" readonly></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- <el-divider content-position="left">其他信息</el-divider> -->
				<div class="formTitle height40">其他信息</div>
				<!-- 协同人 -->
				<el-row>
					<el-col :span="12">
						<el-form-item label="协同人">
							<el-input v-model="form.coordinationName" readonly></el-input>
						</el-form-item>
					</el-col>
					<!-- 抄送人 -->
					<el-col :span="12">
						<el-form-item label="抄送人">
							<el-input v-model="form.transcriptionName" readonly></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="13">
						<!-- 任务附件 -->
						<el-form-item label="任务附件">
							<el-row v-for="(item,index) in taskFileList">
								<el-col :span="24">
									<template>
										<span @click="getDownload(item)" title="点击下载" style="cursor: pointer;">{{index+1}}.{{item.name|ellipsis}}</span>
									</template>
								</el-col>
							</el-row>
						</el-form-item>
					</el-col>
					<el-col :span="11">
						<!-- 照片 -->
						<el-row>
							<el-col :span="24">
								<el-form-item label="处理需要图片">
									<el-switch v-model="form.finishImgFlag" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
								</el-form-item>
							</el-col>
						</el-row>

						<!-- 附件 -->
						<el-row>
							<el-col :span="24">
								<el-form-item label="处理需要文件">
									<el-switch v-model="form.finishAttachedFile" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
								</el-form-item>
							</el-col>
						</el-row>

						<!-- 验收 -->
						<el-row>
							<el-col :span="24">
								<el-form-item label="处理需要验收">
									<el-switch v-model="form.checkedFlag" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
								</el-form-item>
							</el-col>
						</el-row>
					</el-col>
				</el-row>
				<el-divider></el-divider>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button class="fBtn" @click="dialogShowVisible = false">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {
		gettask,
		gettaskId
	} from '@/api/task/iCreated/index' //查询任务接口
	import {
		putTaskStatus
	} from '@/api/task/iCreated/index' //修改任务状态接口
	import {
		getSelectType
	} from '@/api/task/iCreated/index' //字典
	import {
		posttaskUrge
	} from '@/api/task/iCreated/index' //催办
	import {
		postRetractTask
	} from '@/api/task/iCreated/index' //撤回
	import axios from 'axios'
	import {
		getToken
	} from '@/utils/auth'

	export default {
		name: 'launch',
		data() {
			return {
				has: {
					putstatus: 'task:status:edit', //修改任务状态
					getlist: 'task:task:list',
					taskUrge: 'task:post:taskUrge'
				},
				form: {
					costTime: '',
					costTimeUnit: 1
				},
				costTimeUnit: [{
						title: '天',
						value: 0
					},
					{
						title: '小时',
						value: 1
					},
					{
						title: '月',
						value: 2
					}
				],
				tableData: [],
				multipleSelection: [], //已选中数组
				currentPage: 1, //当前页数
				pageSize: 10, //每页多少条
				total: 0, //总条数
				loading: false,
				typeType: [],
				treedata: [],
				exportloading: false,
				dialogShowVisible: false,
				optionsTypeId: [],
				optionspriority: [
					//权重选择
					{
						label: "一级",
						value: 1
					},
					{
						label: "二级",
						value: 2
					},
					{
						label: "三级",
						value: 3
					},
				],
				optionsdifficultDegree: [
					//难度选择
					{
						label: "简单",
						value: 1
					},
					{
						label: "一般",
						value: 2
					},
					{
						label: "较难",
						value: 3
					},
					{
						label: "很难",
						value: 4
					},
				],
				taskFileList: [],
			}
		},
		filters: {
			ellipsis(value) {
				if (!value) return "";
				if (value.length > 30) {
					return value.slice(0, 30) + "...";
				}
				return value;
			}
		},
		created() {
			this.loading = true
			this.getsele()
		},
		methods: {
			async getTask() {
				this.loading = true
				let costTimeUnit = ''
				if (this.form.costTime != '') {
					costTimeUnit = this.form.costTimeUnit
				}
				let params = {
					pageSize: this.pageSize,
					pageNum: this.currentPage,
					operateType: 'create', //查找我发起的
					chargerName: this.form.chargerName,
					typeId: this.form.type,
					costTime: this.form.costTime,
					costTimeUnit: costTimeUnit
				}
				const res = await gettask(params)
				for (let item of res.rows) {
					if (!item.taskUserList.length == 0) {
						item.UserName = item.taskUserList.filter(
								(item) => item.userType === 1
							) ?
							item.taskUserList.filter((item) => item.userType === 1)[0]
							.userName :
							''
					}
					item.typeName = this.filet(item.typeId, this.typeType)
				}
				this.tableData = res.rows //任务列表
				this.total = res.total
				this.loading = false
				this.optionsTypeId = await getSelectType("task_Type")
			},
			async getDownload(item) { //下载任务附件
				this.fileDowloadName =
					this.$store.state.apiConfiguration.url +
					`fs/download?name=${encodeURI(encodeURI(item.name))}&path=${
				    item.path
				  }`;
				location.href = this.fileDowloadName;
			},
			async getsele() {
				this.typeType = await getSelectType('task_Type')
				this.getTask()
			},
			// 查询
			query() {
				console.log(this.form.costTime)
				this.pageSize = 10
				this.currentPage = 1
				this.getTask()
			},
			// 重置
			Reset() {
				this.form = {
					costTime: '',
					costTimeUnit: 1
				}
				this.pageSize = 10
				this.currentPage = 1
				this.getTask()
			},

			// 过滤
			filet(id, idList) {
				if (!Array.isArray(idList)) {
					return
				}
				id = idList.filter((item) => item.dictCode == id)
				if (id.length > 0) {
					id = id[0].dictLabel
				} else {
					id = ''
				}
				return id
			},

			//表格全选
			handleSelectionChange(val) {
				this.multipleSelection = val
				console.log(this.multipleSelection)
			},
			// 催办
			async taskUrging(index) {
				// 点击催办时 判断当前时间时间戳 减去 最新催办时间 如果大于半小时 则允许催办
				//  let currentTime=new Date().getTime()
				//  let urgingTimes=localStorage.getItem("urgingTime")
				//  console.log(urgingTimes)
				//  if(!(JSON.stringify(urgingTimes)==="null")){
				//   if(!(currentTime-urgingTimes > 1800000 ) ){
				//   this.$message({
				//       message: "每半个小时才能催办一次！",
				//       type: "warning"
				//     });
				//       return
				//   }
				//  }
				let parm = []
				let t = {}
				t.dutyUserName = this.tableData[index].taskUserList.filter(
					(item) => item.userType === 1
				)[0].userName
				t.dutyUserId = this.tableData[index].taskUserList.filter(
					(item) => item.userType === 1
				)[0].userId
				t.taskName = this.tableData[index].name
				t.taskId = this.tableData[index].taskId
				parm.push(t)
				const res = await posttaskUrge(parm)
				this.$message({
					message: res,
					type: 'success'
				})
				//   // 催办成功后 更新最新催办时间到localStorage
				//  let urgingTime=new Date().getTime()
				//   localStorage.setItem("urgingTime",urgingTime);
			},
			// 撤回
			async taskWithdraw(id) {
				this.$confirm('是否确定撤回该任务', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(async () => {
						let taskId = []
						taskId.push(id)
						const res = await postRetractTask(taskId)
						this.getTask()
						this.$message({
							message: res,
							type: 'success'
						})
						return
					})
					.catch(() => {})
			},
			//任务信息查看
			async taskShow(taskId) {
				let res = await gettaskId(taskId);
				this.form = {
					...(this.form = {
						typeId: "",
						name: "",
						content: "",
						hintMessage: "",
						startTime: "",
						endTime: "",
						priority: "",
						difficultDegree: "",
						responsibilityName: "",
					}),
					...res,
				}
				let userList = res.taskUserList
				let responsibilityNames = []
				let coordinationNames = []
				let transcriptionNames = []
				userList.forEach(function(item, index) {
					console.log('userList', item);
					if (item.userType == 1) {
						responsibilityNames.push(item.userName);
					} else if (item.userType == 2) {
						coordinationNames.push(item.userName);

					} else if (item.userType == 3) {
						transcriptionNames.push(item.userName);

					}

				});
				this.form.responsibilityName = responsibilityNames.join(',');
				this.form.coordinationName = coordinationNames.join(',');
				this.form.transcriptionName = transcriptionNames.join(',');
				this.form.checkedFlag = res.checkedFlag == 1 ? true : false; //是否验收
				this.form.finishAttachedFile = res.finishAttachedFile == 1 ? true : false; //完成是否需要上传文件
				this.form.finishImgFlag = res.finishImgFlag == 1 ? true : false; //完成是否需要上传图片

				this.taskFileList = res.taskFileList; //任务附件集合
				this.dialogShowVisible = true
			},
			// 批量执行
			async taskbatch(value) {
				if (this.multipleSelection.length == 0) {
					this.$message({
						message: '请选择执行批量操作的任务',
						type: 'warning'
					})
					return
				}
				let taskId = [] //任务ID
				let parm = []
				for (let v of this.multipleSelection) {
					let t = {}
					t.dutyUserName = v.taskUserList.filter(
						(item) => item.userType === 1
					)[0].userName

					t.dutyUserId = v.taskUserList.filter(
						(item) => item.userType === 1
					)[0].userId
					t.taskName = v.name
					t.taskId = v.taskId
					parm.push(t)
					taskId.push(v.taskId)
				}
				if (value == 'withdraw') {
					//批量撤回

					this.$confirm('是否批量撤回这些任务', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						})
						.then(async () => {
							const res = await postRetractTask(taskId)
							this.getTask()
							this.$message({
								message: res,
								type: 'success'
							})
							return
						})
						.catch(() => {})
				}
				if (value == 'Urging') {
					for (let item of this.multipleSelection) {
						if (item.status != 2 && item.status != 3) {
							this.$message({
								message: '只能催办状态为已发布和待执行的任务',
								type: 'warning'
							})
							return
						}
					}
					//批量催办
					// 点击催办时 判断当前时间时间戳 减去 最新催办时间 如果大于半小时 则允许催办
					//  let currentTime=new Date().getTime()
					//  let urgingTimes=localStorage.getItem("urgingTime")
					//  console.log(urgingTimes)
					//  if(!(JSON.stringify(urgingTimes)==="null")){
					//   if(!(currentTime-urgingTimes > 1800000 ) ){
					//   this.$message({
					//       message: "每半个小时才能催办一次！",
					//       type: "warning"
					//     });
					//       return
					//   }
					//  }
					const res = await posttaskUrge(parm)
					this.$message({
						message: res,
						type: 'success'
					})
					// 催办成功后 更新最新催办时间到localStorage
					//  let urgingTime=new Date().getTime()
					//   localStorage.setItem("urgingTime",urgingTime);
					return
				}
			},
			handleSizeChange(val) {
				//分页
				this.pageSize = val
				this.getTask()
			},
			handleCurrentChange(val) {
				this.currentPage = val
				this.getTask()
			},
			// 导出
			async taskexport() {
				// 导出接口
				let vm = this
				vm.exportloading = true
				let costTimeUnit = ''
				if (this.form.costTime != '') {
					costTimeUnit = this.form.costTimeUnit
				}
				axios({
					method: 'get',
					url: this.$store.state.apiConfiguration.url +
						this.$store.state.serviceName.task +
						'/task/export',
					responseType: 'blob', // 表明返回服务器返回的数据类型
					headers: {
						'Content-Type': 'application/json',
						Authorization: getToken()
					},
					//接口参数
					params: {
						chargerName: this.form.chargerName,
						typeId: this.form.type,
						costTime: this.form.costTime,
						costTimeUnit: costTimeUnit
					}
				}).then(function(response) {
					//创建一个隐藏的a连接，
					const link = document.createElement('a')
					let blob = new Blob([response.data], {
						type: 'application/vnd.ms-excel'
					})
					link.style.display = 'none'
					//设置连接
					link.href = URL.createObjectURL(blob)
					link.download = '我发起的任务.xlsx'
					document.body.appendChild(link)
					//模拟点击事件
					link.click()
					vm.exportloading = false
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bottom-top-mag {
		margin-bottom: 1rem;
	}

	// input::-webkit-outer-spin-button,
	// input::-webkit-inner-spin-button {
	//   -webkit-appearance: none !important;
	//   margin: 0;
	// }
	// input[type="number"] {
	//   -moz-appearance: textfield !important;
	// }
</style>
