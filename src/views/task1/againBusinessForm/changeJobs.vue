<template>
  <!-- 岗位变更 -->
  <div class="content">
    <el-form
      :model="jobInForm"
      label-width="150px"
      ref="pageForm"
      class="change-form"
      :rules="rules"
    >
      <el-form-item label="变更人">
        <el-input
          v-model="jobInForm.userName"
          maxlength="30"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="调出的部门">
        <el-input
          v-model="jobInForm.beforeDept"
          maxlength="30"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="调出的岗位">
        <el-input
          v-model="jobInForm.beforePost"
          maxlength="30"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item prop="afterDeptId" label="选择的部门">
        <el-cascader
          ref="cascader"
          v-model="jobInForm.afterDeptId"
          :options="treeResDept"
          :props="jobProps"
          style="width: 50%"
          @change="change"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item prop="afterPost" label="选择的岗位">
        <el-select
          v-model="jobInForm.afterPost"
          placeholder="请选择岗位"
          @change="pitchName"
        >
          <el-option
            v-for="item in jobsOptions"
            :key="item.postId"
            :label="item.name"
            :value="{ value: item.postId, label: item.name }"
            :props="PeopleProps"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="reason" label="变更的原因">
        <el-input
          v-model="jobInForm.reason"
          type="textarea"
          :autosize="{ minRows: 3 }"
        ></el-input>
      </el-form-item>
      <el-form-item prop="realName" label="审批人" v-if="istoUser">
        <el-input
          v-model="jobInForm.realName"
          maxlength="30"
          placeholder="点击选择审批人"
          @focus="showSdialog"
          readonly
        ></el-input>
      </el-form-item>
      <!--选择审批人盒子-->
      <sdialog
        ref="sdialog"
        @choiceUser="choiceUser"
        :sNeed="true"
        dxId="user"
        :transferProps="{
          key: 'userId',
          label: 'realName'
        }"
        :treedata="treedata"
      ></sdialog>
    </el-form>
  </div>
</template>

<script>
import Sdialog from '@/components/selectDialog'
import { viewBusinessInfo, getTreeSelect } from '@/api/system/process'
import { getTreeDeptSelect } from '@/api/job/org'
import { getJobs, userChange } from '@/api/system/user'

export default {
  props: {
    businessKey: String,
    businessCode: String,
    scopeRow: {}
  },
  components: {
    Sdialog: Sdialog
  },
  data() {
    return {
      rules: {
        afterDeptId: [
          { required: true, message: '请选择的部门', trigger: 'change' }
        ],
        afterPost: [
          { required: true, message: '请选择的岗位', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '请填写变更的原因', trigger: 'change' }
        ],
        realName: [
          { required: true, message: '请选择审批人', trigger: 'change' }
        ]
      },
      PeopleProps: {
        value: 'postId',
        label: 'name'
      },
      jobInForm: {},
      treeResDept: [],
      jobProps: {
        value: 'id',
        label: 'label',
        checkStrictly: true
      },
      jobsOptions: [],
      treedata: [],
      istoUser: true,
      sprData: {},
      treeArr: []
    }
  },
  async created() {
    this.getAllList()
    this.treeResDept = await getTreeDeptSelect()
  },
  methods: {
    closeFun() {
      this.$emit('closeDialog')
    },
    async getAllList() {
      const res = await viewBusinessInfo(this.businessCode, this.businessKey)
      this.jobInForm = res.body
    },
    sabmitFun(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let needData = {
            userchangeId: this.jobInForm.userchangeId,
            afterDeptId: this.jobInForm.afterDeptId,
            afterPostId: this.jobInForm.afterPostId,
            reason: this.jobInForm.reason,
            businessCode: this.businessCode,
            toUser: this.sprData.userId,
            taskId: this.scopeRow.taskId
          }
          let res = await userChange(needData)
          this.$message.success(res)
          this.closeFun()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    pitchName(params) {
      const { value, label } = params
      this.jobInForm.afterPostId = value
    },
    //选择岗位
    async change(val) {
      if (val.length >= 1) {
        this.treeArr = val
        this.jobInForm.afterDeptId = this.treeArr[this.treeArr.length - 1]
        if (this.jobInForm.afterDeptId != '') {
          this.jobsOptions = await getJobs(this.jobInForm.afterDeptId)
        }
      } else {
        this.jobInForm.afterDeptId = ''
      }
    },
    async showSdialog() {
      // 树形结构
      this.treedata = await getTreeSelect()
      this.$refs.sdialog.isShow = true
    },
    choiceUser(UserID, UserObject) {
      this.$nextTick(() => {
        this.istoUser = false
        //子组件 选择参与人 完成后调用的事件
        this.sprData = UserObject[0] ? UserObject[0] : ''
        console.log(this.sprData, 999, UserID, UserObject[0])
        this.jobInForm.realName = this.sprData.realName
        this.$refs.sdialog.isShow = false
      })
      this.istoUser = true
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
