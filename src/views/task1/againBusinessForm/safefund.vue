<template>
  <div class="content_add_box">
    <div class="content_add" v-if="pd">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="110px"
        class="demo-ruleForm"
      >
        <el-form-item label="经费类别" prop="fundType">
          <el-select
            v-model="ruleForm.fundType"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictLabel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位名称" prop="deptId">
          <el-cascader
            v-model="ruleForm.deptId"
            ref="myCascader"
            :options="treeselect"
            :props="optionProps"
            @change="handleChange"
            style="width: 100%"
            placeholder="请选择部门"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model="ruleForm.projectName"
            placeholder="请输入"
            disabled
          ></el-input>
          <el-button @click="chooseList"
            >获取列表</el-button
          >
        </el-form-item>
        <el-form-item label="项目标段" prop="bid">
          <el-input
            v-model="ruleForm.bid"
            disabled
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="计划实施时间" prop="planTime">
          <div class="block">
            <el-date-picker
              v-model="ruleForm.planTime"
              type="date"
              format="yyyy-MM-dd "
              value-format="yyyy-MM-dd "
              placeholder="选择日期时间"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="经费内容" prop="fundContent">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3}"
            v-model="ruleForm.fundContent"
            placeholder="请输入"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="预计金额"
          :rules="{
            required: true,
            message: '请输入申报金额',
            trigger: 'blur'
          }"
        >
          <el-input
            v-model="ruleForm.money"
            placeholder="请输入"
            autocomplete="off"
            type="number"
            :controls="false"
            :min="0"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3}"
            v-model="ruleForm.remark"
            placeholder="请输入"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="审批人" v-if="istoUser">
          <el-input
            v-model="ruleForm.username"
            placeholder="点击选择审批人"
            @focus="showSdialog"
            readonly
          ></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div class="content_add" v-else>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="110px"
        class="demo-ruleForm"
      >
        <el-form-item label="经费类别" prop="fundType">
          <el-select
            v-model="ruleForm.fundType"
            filterable
            placeholder="请选择"
            disabled
          >
            <el-option
              v-for="item in options"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictLabel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位名称" prop="deptName">
          <el-input
            v-model="ruleForm.deptName"
            disabled
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model="ruleForm.projectName"
            disabled
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目标段" prop="bid">
          <el-input
            v-model="ruleForm.bid"
            disabled
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="安全经费概述" prop="overview">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3}"
            v-model="ruleForm.overview"
            placeholder="请输入"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="申报金额"
          prop="money"
          :rules="{
            required: true,
            message: '请输入申报金额',
            trigger: 'blur'
          }"
        >
          <el-input
            v-model="ruleForm.money"
            placeholder="请输入"
            autocomplete="off"
            type="number"
            :controls="false"
            :min="0"
          ></el-input>
        </el-form-item>
        <el-form-item label="审批人" v-if="istoUser">
          <el-input
            v-model="ruleForm.username"
            placeholder="点击选择审批人"
            @focus="showSdialog"
            readonly
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
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
      :treedata="treeselect"
    ></sdialog>
    <!--项目盒子-->
    <el-dialog
      :visible.sync="dialogVisible"
      custom-class="large"
      :title="'新增列表'"
      append-to-body
      :close-on-click-modal="false"
    >
      <div class="inquire">
        <el-form
          :inline="true"
          :model="formInline"
          ref="formInline"
          class="demo-form-inline"
        >
          <el-form-item label="项目名称" prop="projectName">
            <el-input
              v-model="formInline.projectName"
              placeholder="项目名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="项目标段" prop="bid">
            <el-input
              v-model="formInline.bid"
              placeholder="项目标段"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="chaxun" @click="onSubmit">查询</el-button>
            <el-button class="chongzhi" @click="onClear('formInline')"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>

      <el-table
        :data="addTableData"
        ref="multipleTable"
        tooltip-effect="light"
        v-loading="loading"
        style="width: 100%"
        height="calc(100vh - 380px)"
        :header-cell-style="{ color: '#000000', 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
        stripe
      >
        <el-table-column align="center" label="项目名称">
          <template slot-scope="scope">{{ scope.row.projectName }}</template>
        </el-table-column>
        <el-table-column align="center" label="标段">
          <template slot-scope="scope">{{ scope.row.bid }}</template>
        </el-table-column>
        <el-table-column prop="cz" label="操作">
          <template slot-scope="scope">
            <!-- 这里可以拿到当前行的内容 row -->
            <el-button
              size="small"
              type="text"
              style="margin-left: 10px"
              @click="goRedact(scope, addTableData)"
              >确定</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <template>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSize"
          layout="total, prev, pager, next, sizes, jumper"
          :total="total"
        ></el-pagination>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getTreeSelect } from '@/api/job/safety' //获取部门
import { viewBusinessInfo } from '@/api/system/process'
import { getAddList } from '@/api/safetyProduction/SecurityFundingPlan'
import {
  getProject,
  getAddList as getAddListProvisions
} from '@/api/safetyProduction/SecurityProvisions'
import Sdialog from '@/components/selectDialog' //通过部门选择人

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
      pd: true,
      has: {
        add: 'laws:projectDoc:add'
      },

      optionProps: {
        value: 'id',
        label: 'label',
        checkStrictly: true
      },
      loading: true,
      options: {},
      ruleForm: {
        fundType: '', //经费类别
        fundTypeId: '', //经费类别编号
        deptName: '', //部门名称
        deptId: '', //部门编号
        planTime: '', //计划实施时间
        fundContent: '', // 经费内容
        money: '', //预计金额
        remark: '', //备注
        projectName: '', //项目名称
        projectId: '', //项目名称ID
        bid: '', //标段
        username: ''
      },
      rules: {
        fundType: [
          { required: true, message: '选择经费类别', trigger: 'blur' }
        ],
        deptId: [{ required: true, message: '选择部门', trigger: 'blur' }],
        planTime: [
          { required: true, message: '计划实施时间', trigger: 'blur' }
        ],
        fundContent: [{ required: true, message: '经费内容', trigger: 'blur' }],
        remark: [{ required: true, message: '备注', trigger: 'blur' }],
        projectName: [{ required: true, message: '项目名称', trigger: 'blur' }],
        bid: [{ required: true, message: '标段', trigger: 'blur' }],
        businessCode: [
          { required: true, message: '审批流程', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '选择审批人', trigger: ['blur', 'change'] }
        ],
        overview: [
          { required: true, message: '请填写安全经费概述', trigger: 'blur' }
        ]
      },
      treeselect: [], //获取部门
      fundplanId: '',
      sprData: {},
      istoUser: true,
      dialogVisible: false,
      //头部查询
      formInline: {
        projectName: '',
        bid: ''
      },
      addTableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 5,
    }
  },
  computed: {
    getUrl() {
      return (
        this.$store.state.apiConfiguration.url +
        this.$store.state.serviceName.jurisdiction +
        '/fs/upload'
      )
    }
  },
  created() {
    this.department()
    this.goCheck()
  },
  methods: {
    /**
     * 分页器
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.onPaging();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.onPaging();
    },
    //提交查询
    async onSubmit() {
      try {
        let resdata = this.formInline
        let { projectName, bid } = resdata
        let data = await ProjectInquire(1, this.pageSize, projectName, bid)
        this.addTableData = data.rows
        console.log(this.addTableData)
        this.loading = false
      } catch (e) {
        console.error('接口异常')
      }
    },
     //弹窗带出数据
    goRedact(scope) {
      let data = scope.row;
      this.ruleForm.projectName = data.projectName;
      this.ruleForm.bid = data.bid;
      this.ruleForm.projectId = data.projectId;
      this.dialogVisible = false;
    },
    closeFun() {
      this.$emit('closeDialog')
    },
    sabmitFun(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.ruleForm.username) {
            let needData = {
              fundaccrualId: this.ruleForm.fundaccrualId,
              fundplanId: this.ruleForm.fundplanId,
              overview: this.ruleForm.overview,
              money: this.ruleForm.money,
              businessCode: this.businessCode,
              toUser: this.sprData.userId,
              taskId: this.scopeRow.taskId
            }
            let res
            if (this.pd) {
              res = await getAddListProvisions({
                fundplanId: this.ruleForm.fundplanId,
                fundType: this.ruleForm.fundType,
                fundTypeId: this.ruleForm.fundTypeId,
                deptName: this.ruleForm.deptName,
                deptId: this.ruleForm.deptId,
                planTime: this.ruleForm.planTime,
                fundContent: this.ruleForm.fundContent,
                money: this.ruleForm.money,
                remark: this.ruleForm.remark,
                projectName: this.ruleForm.projectName,
                projectId: this.ruleForm.projectId,
                bid: this.ruleForm.bid,
                modelName: this.ruleForm.modelName,
                businessCode: this.businessCode,
                toUser: this.sprData.userId,
                taskId: this.scopeRow.taskId
              })
            } else {
              res = await getAddList(needData)
            }
            this.$message.success(res)
            this.closeFun()
          } else {
            this.$message.error('请选择审批人')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //查看
    async goCheck() {
      let changeData = await viewBusinessInfo(
        this.businessCode,
        this.businessKey
      )
      this.ruleForm = changeData.body
      if (!this.ruleForm.remark) {
        this.pd = false
      } else {
        this.pd = true
      }
      console.log(this.ruleForm, 999999999988888888)
      // this.ruleForm.deptId = changeData.deptId.toString();
      // console.log( this.ruleForm,8888)
      // let arry = [];
    },
    async showSdialog() {
      // 树形结构
      this.treeselect = await getTreeSelect()
      this.$refs.sdialog.isShow = true
    },
    choiceUser(UserID, UserObject) {
      this.$nextTick(() => {
        this.istoUser = false
        //子组件 选择参与人 完成后调用的事件
        this.sprData = UserObject[0] ? UserObject[0] : ''
        console.log(this.sprData, 999, UserID, UserObject[0])
        this.ruleForm.username = this.sprData.realName
        this.istoUser = true
        this.$refs.sdialog.isShow = false
      })
    },
    //获取部门
    async department() {
      this.treeselect = await getTreeSelect()
    },
    handleChange(value) {
      if (value != undefined) {
        let deptname = this.$refs.myCascader.getCheckedNodes()[0].pathLabels
        this.ruleForm.deptName = deptname[deptname.length - 1]
      }
      if (this.ruleForm.deptId != undefined) {
        this.ruleForm.deptId = this.ruleForm.deptId[
          this.ruleForm.deptId.length - 1
        ]
      }
    },
    //项目获取
    async chooseList() {
      this.dialogVisible = true
      let res = await getProject()
      this.addTableData = res.rows
      this.total = res.total
      this.loading = false
    },
    //置空
    onClear(formName) {
      this.$refs[formName].resetFields()
      this.chooseList()
    },
    //取消
    resetForm() {
      this.$emit('func')
    }
  }
}
</script>
<style lang="scss" scoped>
.content_add_box {
  background-color: #fff;
  padding: 20px;
}
</style>
