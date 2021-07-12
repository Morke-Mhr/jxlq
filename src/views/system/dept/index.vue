<template>
	<div class="app-container container-table">
		<div class="sxForm">
			<el-form :inline="true" :model="pageForm" ref="pageForm" class="demo-form-inline">
				<el-form-item prop="deptName" label="部门名称">
					<el-input v-model="pageForm.deptName" maxlength="30" placeholder="部门名称"></el-input>
				</el-form-item>
				<el-form-item prop="status" label="部门状态">
					<el-select v-model="pageForm.status" placeholder="部门状态">
						<el-option label="请选择" value=""></el-option>
						<el-option label="正常" value="0"></el-option>
						<el-option label="停用" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button class="chaxun" icon="el-icon-search" v-has="has.query" @click="getList()">查询</el-button>
					<el-button @click="resetForm('pageForm')" class="chongzhi">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="table-list">
			<el-button class="table-add-btn" v-has="has.add" @click="handleAdd('', 'addClose')">
				添加部门
			</el-button>
			<el-button class="table-default-btn" v-has="has.remove" @click="handleDelete()">
				删除部门
			</el-button>

			<el-table :data="tableData" v-loading="listLoading" style="width: 100%; margin-top: 30px" row-key="deptId"
			 :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" @selection-change="handleSelectionChange" stripe>
				<el-table-column type="selection" width="55"> </el-table-column>
				<el-table-column align="center" label="部门名称">
					<template slot-scope="scope">
						{{ scope.row.deptName }}
					</template>
				</el-table-column>

				<el-table-column align="center" label="负责人">
					<template slot-scope="scope">
						{{ scope.row.deptPersonShow }}
					</template>
				</el-table-column>

				<el-table-column align="center" label="电话">
					<template slot-scope="scope">
						{{ scope.row.phone }}
					</template>
				</el-table-column>

				<el-table-column align="center" label="邮箱">
					<template slot-scope="scope">
						{{ scope.row.email }}
					</template>
				</el-table-column>

				<el-table-column align="center" label="状态">
					<template slot-scope="scope">
						<span v-if="scope.row.status == '0'">正常</span>
						<span v-if="scope.row.status == '1'">停用</span>
					</template>
				</el-table-column>

				<el-table-column fixed="right" width="250" align="center" label="操作">
					<template slot-scope="scope">
						<el-button type="text" v-has="has.add" size="medium" @click="handleAdd(scope)">
							添加
						</el-button>
						<el-button type="text" v-has="has.edit" size="medium" @click="handleEdit(scope)">
							编辑
						</el-button>
						<el-button type="text" v-has="has.remove" size="medium" @click="handleDelete(scope)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-dialog :visible.sync="dialogVisible" @closed="closeFun" :title="dialogType === 'edit' ? '修改部门信息' : '添加部门信息'"
			 custom-class="small">
				<el-form :model="dept" :rules="formRules" ref="operationFome" label-width="80px" label-position="left">
					<el-form-item label="父级部门">
						<el-tree v-if="dialogVisible" ref="deptTree" :check-strictly="checkStrictly" :default-expanded-keys="defaultMenutree"
						 :default-checked-keys="defaultMenutree" :data="deptOptions" :props="defaultProps" @check-change="treeCheck"
						 show-checkbox node-key="id" class="permission-tree" />
					</el-form-item>

					<el-form-item label="部门名称" prop="deptName">
						<el-input v-model="dept.deptName" maxlength="30" show-word-limit placeholder="部门名称" />
					</el-form-item>

					<el-form-item label="部门等级" prop="deptLevel">
						<el-select v-model="dept.deptLevel" placeholder="部门等级">
							<el-option label="请选择" value=""></el-option>
							<el-option label="公司级" value="0"></el-option>
							<el-option label="分公司级" value="1"></el-option>
							<el-option label="项目部级" value="2"></el-option>
							<el-option label="施工单位级" value="3"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="负责人" prop="deptPersonLiableList">
						<el-select v-model="dept.deptPersonLiableList" multiple value-key="userId" placeholder="请选择部门责任人">
							<el-option v-for="(item, index) of leaders" :label="item.userName" :value="item" :key="index"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="电话" prop="phone">
						<el-input v-model="dept.phone" maxlength="11" show-word-limit placeholder="权限字符" />
					</el-form-item>

					<el-form-item label="邮箱" prop="email">
						<el-input v-model="dept.email" maxlength="30" show-word-limit placeholder="权限字符" />
					</el-form-item>

					<el-form-item label="显示顺序" prop="orderNum">
						<el-input v-model="dept.orderNum" type="number" min="0" max="9999" maxlength="5" placeholder="显示顺序" />
					</el-form-item>
					<el-form-item label="部门状态" prop="status">
						<el-radio-group v-model="dept.status">
							<el-radio :label="'0'">正常</el-radio>
							<el-radio :label="'1'">禁用</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button class="tBtn" @click="confirm">提 交</el-button>
					<el-button class="fBtn" @click="dialogVisible = false">取 消</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import {
		getDeptList,
		addDept,
		updateDept,
		getDepttreeSelect,
		deleteDept,
		getDeptInfo,
		getLoginDeptPerson
	} from '@/api/system/dept'

	import {
		isMaill,
		isID,
		isPhone
	} from '@/utils/validate.js'

	const defaultDept = {
		deptId: '',
		deptName: '',
		email: '',
		leader: '',
		orderNum: '',
		parentId: '',
		phone: '',
		status: '0',
		deptLevel: '',
		deptPersonLiableList: []
	}

	export default {
		name: 'index',
		data() {
			return {
				has: {
					remove: 'system:dept:remove',
					query: 'system:dept:query',
					add: 'system:dept:add',
					edit: 'system:dept:edit'
				},
				pageForm: {
					deptName: '',
					status: ''
				},
				dept: {
					deptId: '',
					deptName: '',
					email: '',
					orderNum: '',
					parentId: '',
					phone: '',
					status: '0',
					deptLevel: '',
					deptPersonLiableList: [] //部门责任人
				},
				defaultMenutree: [],
				multipleSelection: [],
				// 部门责任人
				leaders: [],
				tableData: [],
				tableKey: 0,
				listLoading: false,
				dialogVisible: false,
				dialogType: 'new',
				deptOptions: [],
				checkStrictly: true,
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				currentChecke: '',
				//表单验证方法
				formRules: {
					deptIds: [{
						required: true,
						message: '请输选择部门',
						trigger: 'blur'
					}],
					email: [{
						required: true,
						trigger: 'blur',
						message: '请输入正确的邮箱号码',
						validator: (rule, value, callback) => {
							if (value == null || value == undefined || value == '') {
								callback(new Error('请输入正确的邮箱号码'))
							} else {
								if (!isMaill(value)) {
									callback(new Error('电话格式不正确'))
								} else {
									callback()
								}
							}
						}
					}],
					phone: [{
						required: true,
						trigger: 'blur',
						message: '请输入正确的电话号码',
						validator: (rule, value, callback) => {
							if (value == null || value == undefined || value == '') {
								callback(new Error('请输入正确的电话号码'))
							} else {
								if (!isPhone(value)) {
									callback(new Error('邮箱格式不正确'))
								} else {
									callback()
								}
							}
						}
					}],
					deptName: [{
						required: true,
						message: '请输入部门名称',
						trigger: 'blur'
					}],
					// deptPersonLiableList: [
					//   {
					//     required: true,
					//     message: '请选择部门负责人',
					//     trigger: 'blur'
					//   }
					// ],
					deptLevel: [{
						required: true,
						message: '请选择部门等级',
						trigger: 'blur'
					}],
					orderNum: [{
						required: true,
						message: '请输入显示顺序',
						trigger: 'blur',
						validator: (rule, value, callback) => {
							if (
								value == null ||
								value == undefined ||
								value == '' ||
								value < 0
							) {
								callback(new Error('请输入正确的显示顺序'))
							} else {
								callback()
							}
						}
					}]
				}
			}
		},
		computed: {},
		created: async function() {
			this.getList()
			this.deptOptions = await getDepttreeSelect()
		},
		methods: {
			closeFun() {
				this.dept.deptId = ''
			},
			async handleAdd(scope, addClose) {
				this.dialogType = 'new'
				this.dialogVisible = true
				this.defaultMenutree = []
				if (this.$refs['operationFome']) {
					this.$refs['operationFome'].resetFields()
				}
				this.dept = defaultDept
				if (this.$refs.deptTree) {
					this.deptOptions = await getDepttreeSelect()
					this.$refs.deptTree.setCheckedKeys([], false)
				}
				if (addClose == 'addClose') {
					this.dept.deptId = ''
				} else if (scope) {
					let deptId = scope.row.deptId
					this.defaultMenutree = [deptId]
					this.dept.parentId = deptId
				}
			},
			async handleEdit(scope) {
				this.dialogType = 'edit'
				this.dialogVisible = true
				if (this.$refs['operationFome']) {
					this.$refs['operationFome'].resetFields()
				}
				let deptId = scope.row.deptId
				this.dept = await getDeptInfo(deptId)
				console.log(this.dept, 'scope.row.deptId1');
				if (this.$refs.deptTree) {
					this.deptOptions = await getDepttreeSelect()
					this.$refs.deptTree.setCheckedKeys([this.dept.parentId], true)
				}
				// 部门责任人
				this.leaders = await getLoginDeptPerson(deptId)
				console.log(this.dept, 'open win this.dept');
			},
			handleDelete(scope) {
				if (!scope && this.multipleSelection.length <= 0) {
					this.$message({
						type: 'warning',
						message: '请选择要删除的部门!'
					})
					return
				}
				let row = scope ? scope.row : null
				this.$confirm('确定删除部门吗?', '删除部门', {
						confirmButtonText: '确认',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(async () => {
						await deleteDept(row ? row.deptId : this.multipleSelection)
						this.$message({
							type: 'success',
							message: '删除成功!'
						})
						this.getList()
					})
					.catch((err) => {
						console.error(err)
					})
			},
			resetForm(formName) {
				this.$refs[formName].resetFields()
				this.getList()
			},
			async confirm() {
				console.log(this.dept, 'this.dept')
				this.$refs.operationFome.validate(async (valid) => {
					const isEdit = this.dialogType === 'edit'
					let data = null
					const deptTreeKeys = this.$refs.deptTree.getCheckedKeys()
					this.dept.parentId = deptTreeKeys[0]
					if (!valid || this.dept.parentId == '' || !this.dept.parentId) {
						this.$notify({
							title: '操作失败',
							dangerouslyUseHTMLString: true,
							message: '请勾选父级部门,并完善表单内容',
							type: 'warning'
						})
						return
					}

					let getLeaders = [];
					// 如果有责任人
					if (!!this.dept.deptPersonLiableList) {
						this.dept.deptPersonLiableList.map((item) => {
							getLeaders.push({
								userId: item.userId,
								userName: item.userName,
							});
						});
					}

					this.dept.deptPersonLiableList = getLeaders //部门责任人

					try {
						if (isEdit) {
							data = await updateDept(this.dept)
						} else {
							data = await addDept(this.dept)
						}
					} catch (e) {
						console.error('接口异常')
					}
					this.dialogVisible = false
					this.$notify({
						title: data ? '成功' : '失败',
						dangerouslyUseHTMLString: true,
						message: data ? data.message : '服务器开小差了，请稍后再试',
						type: data ? 'success' : 'warning'
					})
					this.getList()
				})
			},
			handleSelectionChange(val) {
				if (val) {
					let arr = []
					for (let i = 0; i < val.length; i++) {
						let itme = val[i]
						arr.push(itme.deptId)
					}
					this.multipleSelection = [...arr]
				}
			},
			async getList() {
				this.listLoading = true
				const res = await getDeptList(this.pageForm)
				this.tableData = res
				this.listLoading = false
			},
			treeCheck(data, isCheck) {
				// this.dept.deptId = data.id
				if (isCheck) {
					let keys = this.$refs.deptTree.getCheckedKeys()
					// let itme = [keys[keys.length-1]]
					if (this.currentChecke && this.currentChecke == '') {
						this.currentChecke = keys[0]
					} else {
						let this_ = this
						keys.some((value) => {
							if (value != this_.currentChecke) {
								this_.currentChecke = value
								return true
							}
						})
					}
					let itme = [this.currentChecke]
					this.$refs.deptTree.setCheckedKeys(itme, true)
				}
			}
		}
	}
</script>

<style lang="scss" scoped></style>
