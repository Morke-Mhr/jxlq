<template>
  <div class="liabilityStatement">
    <div class="content_add_box">
      <div class="content_add" v-loading="loading">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
          class="demo-ruleForm"
        >
          <!-- 部门 -->
          <el-row>
            <el-col :span="8">
              <el-form-item label="部门" prop="deptName">
                <el-cascader
                  ref="cascader"
                  v-model="department"
                  :options="treedataDept"
                  :props="optionProps"
                  @change="handleChange"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <!-- 岗位 -->
            <el-col :span="8">
              <el-form-item label="岗位" prop="postName">
                <el-select
                  value-key="postId"
                  @change="handlepost"
                  v-model="postName"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in getPostsByDept"
                    :key="item.postId"
                    :label="item.name"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 人员 -->
            <el-col :span="8">
              <el-form-item label="人员" prop="userName">
                <el-select
                  value-key="userId"
                  @change="handleuser"
                  v-model="userName"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in UserList"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="安全责任" prop="safeDuty">
            <el-input
              type="textarea"
              :rows="8"
              v-model="ruleForm.safeDuty"
              placeholder="请输入"
              maxlength="4000"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="安全目标" prop="safebookTargets">
            <el-table
              :data="ruleForm.safebookTargets"
              style="width: 100%"
              stripe
            >
              <el-table-column label="工作内容" width="200">
                <template slot-scope="scope">
                  <el-select
                    value-key="classdictId"
                    @change="dictNumbers(scope.$index)"
                    v-model="scope.row.workContent"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in dictNumber"
                      :key="item.classdictId"
                      :label="item.dictName"
                      :value="item"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="指标" width="200">
                <template slot-scope="scope">
                  <!-- {{ ruleForm }} -->
                  <el-select
                    value-key="classdictId"
                    @change="dictNumberselect"
                    v-model="scope.row.workIndex"
                    placeholder="请选择"
                  >
                    <template v-if="optionShow">
                      <el-option
                        v-for="(item, index) in scope.row.work"
                        :key="index"
                        :label="item.dictName"
                        :value="item"
                      ></el-option>
                    </template>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="起始范围" align="center">
                <el-table-column label="比较符号" width="130">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.qualifiedRange"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in options2"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="目标值" width="100">
                  <template slot-scope="scope">
                    <el-input
                      @mousewheel.native.prevent
                      oninput="value=value.replace(/[^\d]/g,'')"
                      type="number"
                      v-model="scope.row.targetValue"
                    ></el-input>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="目标值类型" width="120">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.dataType" placeholder="请输入">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="截止范围" align="center">
              <el-table-column label="比较符号" width="130">
                <template slot-scope="scope">
              	<el-select
              	  v-model="scope.row.qualifiedRangeEnd"
              	  placeholder="请选择"
              	>
              	  <el-option
              		v-for="item in options2"
              		:key="item.value"
              		:label="item.label"
              		:value="item.value"
              	  ></el-option>
              	</el-select>
                </template>
              </el-table-column>
              <el-table-column label="目标值" width="100">
                <template slot-scope="scope">
              	<el-input
              	  @mousewheel.native.prevent
              	  oninput="value=value.replace(/[^\d]/g,'')"
              	  type="number"
              	  v-model="scope.row.targetValueEnd"
              	></el-input>
                </template>
              </el-table-column>
              </el-table-column>
              <el-table-column label="开始时间" width="200">
                <template slot-scope="scope">
                  <el-date-picker
                    v-model="scope.row.startTime"
                    :picker-options="pickerIssueOptions"
                    @focus="startTimesr(scope.$index)"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择开始日期"
                  ></el-date-picker>
                </template>
              </el-table-column>
              <el-table-column label="结束时间" width="200">
                <template slot-scope="scope">
                  <el-date-picker
                    v-model="scope.row.endTime"
                    :picker-options="pickerExpireOptions"
                    @focus="endTimesr(scope.$index)"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择结束日期"
                  ></el-date-picker>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                  <el-button type="text" @click="addsafety">添加</el-button>
                  <el-button type="text" class="red" @click="delesafety(scope.$index)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <!-- <el-form-item label="审批">
          <el-radio v-model="radio" label="1">是</el-radio>
          <el-radio v-model="radio" label="2">否</el-radio>
        </el-form-item> -->
          <el-form
            :model="ruleForm"
            :rules="rules"
            label-width="100px"
            class="change-form"
          >
            <el-form-item label="审批人" prop="toUser">
              <el-input
                v-model="toUserName"
                readonly
                @focus="alertChooseSp"
                style="width: 12rem"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-form>
        <!-- 选择审批流 -->
        <sdialog
          ref="sdialog"
          @choiceUser="choiceUser"
          :isDx="isDx"
          :sNeed="sNeed"
          :transferProps="{
            key: 'userId',
            label: 'realName'
          }"
          :treedata="treeselect"
        ></sdialog>
      </div>
    </div>
  </div>
</template>

<script>
import {
  userSafebookUpdate,
  getTreeSelect,
  getdictNumber,
  getPostWprocessGuide
} from '@/api/job/safety'
import Sdialog from '@/components/selectDialog' //通过部门选择人
import { viewBusinessInfo } from '@/api/system/process'
import {
  getTreeDeptSelect, //部门岗位列表
  getPostsByDeptId, //根据部门ID获取岗位
  getUsersByDeptPost
} from '@/api/job/safety'
export default {
  components: {
    Sdialog
  },
  props: {
    businessKey: String,
    businessCode: String,
    scopeRow: {}
  },
  data() {
    return {
      Datas: {
        userName: ''
      },
      optionProps: {
        value: 'id',
        checkStrictly: true
      },
      options: [
        {
          value: '0',
          label: '百分比'
        },
        {
          value: '1',
          label: '数值'
        }
      ],
      options2: [
        {
          value: '0',
          label: '大于'
        },
        {
          value: '1',
          label: '等于'
        },
        {
          value: '2',
          label: '小于'
        },
        {
          value: '3',
          label: '大于等于'
        },
        {
          value: '4',
          label: '小于等于'
        }
      ],
      isDx: true, //是否单选 子组件
      sNeed: true, //是否传值
      dictNumber: [],
      loading: false,
      dictNumberlower: {},
      //分类字典
      value: '',
      radio: '1',
      dept: [],
      toUserName: '',
      startTimes: 0,
      endTimes: 0,
      pickerIssueOptions: {
        disabledDate: (time) => {
          if (!this.ruleForm.safebookTargets[this.startTimes].endTime) {
            return false
          }
          return (
            time.getTime() >
            new Date(
              this.ruleForm.safebookTargets[this.startTimes].endTime.replace(
                /-/g,
                '/'
              )
            ).getTime()
          )
        }
      },
      pickerExpireOptions: {
        disabledDate: (time) => {
          if (!this.ruleForm.safebookTargets[this.endTimes].startTime) {
            return false
          }
          return (
            time.getTime() <
            new Date(
              this.ruleForm.safebookTargets[this.endTimes].startTime.replace(
                /-/g,
                '/'
              )
            ).getTime()
          )
        }
      },
      ruleForm: {
        //新增表单数据
        postName: '', //岗位名称
        postId: '',
        deptName: '', //部门名称
        deptId: '', //部门Id
        userId: '', //人员id
        userName: '', //人员名称
        safebookTargets: [{ work: [], targetValue: '' }], //责任列表
        safeDuty: '' //安全责任
      },
      department: [], //选择的当前部门
      postName: {}, //选择的岗位
      userName: {}, //选择的人员
      deptId: '',
      postId: '',
      rules: {
        deptName: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        postName: [
          { required: true, message: '请选择岗位', trigger: 'change' }
        ],
        userName: [
          { required: true, message: '请选择签订人', trigger: 'change' }
        ],
        safeDuty: [
          { required: true, message: '请选择输入安全责任', trigger: 'blur' }
        ],
        safebookTargets: [
          { required: true, message: '请输入安全目标 ', trigger: 'blur' }
        ],
        toUser: [{ required: true, message: '请选择审批人', trigger: 'change' }]
      },
      treedataDept: [],
      treeselect: [], //选择部门
      UserList: [], //选择人员
      addList: [], //提交数组
      dialogVisible: false,
      deparobjk: {}, //部门
      getPostsByDept: [], //岗位可选列表,
      optionShow: true
    }
  },
  computed: {},
  async created() {
    this.loading = true
    this.getTreSelect()
    this.dictNumber = await getdictNumber('DICT_WORKCONTENT')
    this.getAllList()
  },
  methods: {
    closeFun() {
      this.$emit('closeDialog')
    },
    async getAllList() {
      this.loading = false
      this.optionShow = false
      let { body: data } = await viewBusinessInfo(
        this.businessCode,
        this.businessKey
      )
      this.scopeRow.safebookId = data.safebookId
      this.ruleForm.deptName = data.deptName
      this.ruleForm.deptId = this.deptId = this.department = data.deptId
      this.getPostsByDept = await getPostsByDeptId([data.deptId])
      this.postName = {
        name: data.postName,
        postId: data.postId
      }
      this.ruleForm.postId = data.postId
      this.handlepost(this.postName)
      this.ruleForm.userName = data.userName
      this.ruleForm.safeDuty = data.safeDuty
      console.log(this.dictNumber, 'this.dictNumber------')
      data.safebookTargets.forEach(async (sitem) => {
        let needObj = this.dictNumber.filter(
          (ditem) => ditem.classdictId == sitem.workContentId
        )
        sitem.work = await getdictNumber(needObj[0].dictNumber)
      })
      this.ruleForm.safebookTargets = data.safebookTargets
      console.log(data, this.ruleForm, 'data.body')
      this.optionShow = true
    },
    // 选择开始时间
    startTimesr(index) {
      this.startTimes = index
      console.log(index, 8888)
    },
    // 结束开始时间
    endTimesr(index) {
      this.endTimes = index
      console.log(index)
    },
    //获取部门列表
    async getTreSelect() {
      this.treedataDept = await getTreeDeptSelect()
      this.treeselect = await getTreeSelect()
      this.loading = false
    },
    //
    //部门
    async handleChange(value) {
      if (value.length <= 0) {
        this.$message({
          message: '请选择部门',
          type: 'warning'
        })
        return
      }
      this.deparobjk = this.$refs['cascader'].getCheckedNodes()
      this.ruleForm.deptName = this.deparobjk[0].label
      this.deptId = value[value.length - 1]
      this.ruleForm.deptId = value[value.length - 1]
      this.getPostsByDept = await getPostsByDeptId(value[value.length - 1])
      if (this.getPostsByDept.length < 0) {
        //如果没有结果着为空
        return
      }
      this.$set(
        this.ruleForm,
        'postName',
        this.getPostsByDept.length == 0 ? '' : this.getPostsByDept[0].name
      )
      this.postName = this.getPostsByDept[0]
      this.postId = this.getPostsByDept[0].postId
      this.ruleForm.postId = this.getPostsByDept[0].postId

      this.People()
    },
    handlepost(value) {
      this.postId = value.postId
      this.$set(this.ruleForm, 'postName', value.name)
      this.People()
    },
    // 查询指标
    async dictNumbers(index) {
      console.log(index, '1457')
      const res = await getdictNumber(
        this.ruleForm.safebookTargets[index].workContent.dictNumber
      )
      if (res.length < 0) {
        //如果没有结果着为空
        this.ruleForm.safebookTargets[index].work = []
        return
      }
      this.$set(this.ruleForm.safebookTargets[index], 'workIndex', res[0]) //每次改变第一选项时，清空已选第二选项默认为可选项的第一个
      this.$set(this.ruleForm.safebookTargets[index], 'work', res)
    },
    //
    dictNumberselect(value) {},
    //获取人员
    async People() {
      let parms = {
        postId: this.postId,
        deptId: this.deptId
      }
      this.UserList = await getUsersByDeptPost(parms)
      if (this.UserList.length == 0) {
        this.$set(this.ruleForm, 'userId', '')
        this.$set(this.ruleForm, 'userName', '')
        this.userName = {}
        return
      }
      this.$set(
        this.ruleForm,
        'userId',
        this.UserList.length == 0 ? '' : this.UserList[0].userId
      )
      this.$set(
        this.ruleForm,
        'userName',
        this.UserList.length == 0 ? '' : this.UserList[0].userName
      )
      this.userName = this.UserList.length == 0 ? '' : this.UserList[0]
    },
    handleuser() {
      this.$set(this.ruleForm, 'userName', this.userName.userName)
      this.$set(this.ruleForm, 'userId', this.userName.userId)
    },
    //获取人员的value和label值
    selectedCag() {
      let user = this.ruleForm.userName
      this.ruleForm.userName = user.realName
      this.ruleForm.userId = user.userId
      this.getPostDept()
    },

    //获取岗位
    async getPostDept() {
      const res = await getPostAndDept(this.ruleForm.userId) //查找岗位
      //  this.ruleForm.deptName =res.deptName
      this.ruleForm.postName = res.beforePost //岗位名称
      this.ruleForm.deptName = res.beforeDept //部门名称
    },
    // 新增安全目标
    addsafety() {
      this.ruleForm.safebookTargets.push({ work: [], targetValue: '' })
    },
    // 删除
    delesafety(index) {
      if (this.ruleForm.safebookTargets.length < 2) {
        this.$message({
          message: '最少要有一个安全目标',
          type: 'warning'
        })
        return
      }
      this.ruleForm.safebookTargets.splice(index, 1)
    },
    // 获取审批人
    alertChooseSp() {
      this.isDx = true
      this.sNeed = true
      this.$refs.sdialog.isShow = true
    },
    // 新增审批人 完成后的事件
    choiceUser(UserID, UserObject) {
      if (UserID.length == 0) {
        this.$message({
          message: '请选择审批人',
          type: 'warning'
        })
        return
      }
      this.toUserName = UserObject[0].realName
      this.$set(this.ruleForm, 'toUser', UserObject[0].userId)
      this.$refs.sdialog.isShow = false
    },
    //新增表单
    async submitForm(ruleForm) {
      let current = false
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          current = true
        } else {
          return false
        }
      })
      if (!current) {
        return
      }
      for (let item of this.ruleForm.safebookTargets) {
        if (Object.getOwnPropertyNames(item).length < 9) {
          this.$message({
            message: '填写完整安全目标表单',
            type: 'warning'
          })
          return
        }
        if (item.workContent && typeof item.workContent == 'object') {
          let wct = item.workContent
          item.workContent = wct.dictName
          item.workContentId = wct.classdictId
        }
        if (item.workIndex && typeof item.workIndex == 'object') {
          let wix = item.workIndex
          item.workIndex = wix.dictName
          item.workIndexId = wix.classdictId
        }
        delete item.work
      }
      if (this.radio == '2') {
        delete this.ruleForm.toUser //指派人
      } else {
        if (!this.ruleForm.toUser) {
          this.$message({
            message: '请选择审批人',
            type: 'warning'
          })
          return
        }
      }
      this.ruleForm.isApply = this.radio == 2 ? '0' : '1'
      let hasData = this.ruleForm
      hasData.businessCode = this.businessCode
      hasData.taskId = this.scopeRow.taskId
      hasData.safebookId = this.scopeRow.safebookId
      console.log(hasData, 'hasData')
      this.$confirm('是否重新提交安全责任书', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await userSafebookUpdate(hasData)
          this.$message({
            message: res,
            type: 'success'
          })
          this.closeFun()
          // this.$emit('addsafetyok')
        })
        .catch(() => {})
    }
  },
  watch: {
    postId: {
      async handler(postId) {
        let { safeDuty } = await getPostWprocessGuide(postId)
        this.ruleForm.safeDuty = safeDuty
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.liabilityStatement {
  .content_add_box {
    background-color: #fff;
    padding: 15px 0;
  }
  .content_add {
    margin: 2rem auto;
  }
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
  }
  .content_add_box .el-input__inner {
    border: none !important;
  }
  .tit {
    font-size: 18px;
    height: 50px;
    line-height: 50px;
    color: #333;
    padding-left: 15px;
    margin-top: 18px;
    border-bottom: 1px solid #d7d7d7;
    margin-bottom: 25px;
  }
  .tit::before {
    display: inline-block;
    content: '';
    width: 4px;
    height: 20px;
    background: rgba(13, 116, 215, 1);
    vertical-align: -4px;
    margin-right: 9px;
  }
  .cell .el-date-editor {
    width: 158px;
  }
}
</style>
