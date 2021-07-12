<template>
  <div class="app-container">
    <div class="sxTable">
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%"
        height="calc(100vh - 380px)"
        @selection-change="handleSelectionChange"
        row-key="safebookId"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        stripe
      >
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->

        <el-table-column align="center" label="流程名称">
          <template slot-scope="scope">{{ scope.row.processName }}</template>
        </el-table-column>
        <el-table-column align="center" label="业务标题">
          <template slot-scope="scope">{{ scope.row.keyWord }}</template>
        </el-table-column>
        <el-table-column align="center" label="审批节点" v-if="state">
          <template slot-scope="scope">{{ scope.row.taskName }}</template>
        </el-table-column>
        <el-table-column align="center" label="申请人">
          <template slot-scope="scope">{{ scope.row.owner }}</template>
        </el-table-column>
        <el-table-column align="center" label="申请时间">
          <template slot-scope="scope">{{ scope.row.createtime }}</template>
        </el-table-column>

        <el-table-column align="center" label="状态" v-if="!state">
          <template slot-scope="scope">{{ scope.row.status }}</template>
        </el-table-column>
        <el-table-column align="center" label="当前审批人" v-if="!state">
          <template slot-scope="scope">{{ scope.row.nextUser }}</template>
        </el-table-column>

        <el-table-column fixed="right" width="240" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="state && scope.row.operaType == 3"
              @click="handleAgain(scope)"
              >重新申请</el-button
            >
            <el-button
              type="text"
              v-has="has.query"
              @click="handleAdd(scope)"
              >{{ state ? '办理' : '查看' }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        background
        layout="total, prev, pager, next,sizes,jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog
      title="流程办理"
      :visible.sync="isVisible"
      v-if="isVisible"
      :close-on-click-modal="false"
      custom-class="tDialog large"
      append-to-body
    >
      <el-tabs type="border-card">
        <el-tab-pane label="业务表单">
          <!-- 岗位变更 -->
          <changeJobs
            v-if="postchangeReg.test(businessCode)"
            :businessKey="businessKey"
            :businessCode="businessCode"
          ></changeJobs>
          <!-- 施工方案 -->
          <constructionScheme
            v-else-if="programReg.test(businessCode)"
            :businessKey="businessKey"
            :businessCode="businessCode"
          ></constructionScheme>
          <!-- 安全责任书 -->
          <liabilityStatement
            v-else-if="safebookReg.test(businessCode)"
            :businessKey="businessKey"
            :businessCode="businessCode"
          ></liabilityStatement>
          <!-- 安全检查 -->
          <securityCheck
            v-else-if="safecheckReg.test(businessCode)"
            :businessCode="businessCode"
            :businessKey="businessKey"
          ></securityCheck>
          <!-- 培训计划 -->
          <trainingPlan
            v-else-if="trainplanReg.test(businessCode)"
            :businessKey="businessKey"
            :businessCode="businessCode"
          ></trainingPlan>
          <!-- 隐患整改 -->
          <hiddendangerdeplaydate
            v-else-if="hiddendangerReg.test(businessCode)"
            :businessKey="businessKey"
            :businessCode="businessCode"
          ></hiddendangerdeplaydate>
          <!-- 应急预案 -->
          <emergencyPlans
            v-else-if="emergencyReg.test(businessCode)"
            :businessKey="businessKey"
            :businessCode="businessCode"
          ></emergencyPlans>
          <!-- 事故上报 -->
          <accidentReporting
            v-else-if="accidentReg.test(businessCode)"
            :businessKey="businessKey"
            :businessCode="businessCode"
          ></accidentReporting>
          <!-- 安全经费计提 -->
          <safefund
            v-else-if="safefundReg.test(businessCode)"
            :businessKey="businessKey"
            :businessCode="businessCode"
          ></safefund>
          <h2 v-else>找不到该业务模块表单</h2>
        </el-tab-pane>
        <el-tab-pane v-if="state" label="任务处理">
          <proTask
            :operaType="operaType"
            @complete="complete"
            :proTaskData="proTaskData"
          ></proTask>
        </el-tab-pane>
        <el-tab-pane label="流程图">
          <flowChart ref="flowchart"></flowChart>
        </el-tab-pane>
        <el-tab-pane label="审批历史记录">
          <historicalRecords
            :currentProcessInstanceId="currentProcessInstanceId"
          ></historicalRecords>
        </el-tab-pane>
      </el-tabs>
      <!-- <span slot="footer" class="dialog-footer">
          <el-button @click="isVisible = false">取 消</el-button>
          <el-button type="primary" @click="isVisible = false">确 定</el-button>
      </span>-->
    </el-dialog>

    <!-- 重新申请弹出表单 -->
    <el-dialog
      title="重新办理流程"
      :visible.sync="againVisible"
      v-if="againVisible"
      :close-on-click-modal="false"
      :custom-class="customClass"
      append-to-body
    >
      <div class="againCont">
        <!-- 岗位变更 -->
        <againChangeJobs
          v-if="postchangeReg.test(businessCode)"
          :businessKey="businessKey"
          :businessCode="businessCode"
          :scopeRow="scopeRow"
          ref="againChangeJobs"
          @closeDialog="closeDialog"
        ></againChangeJobs>
        <!-- 施工方案 -->
        <againConstructionScheme
          v-else-if="programReg.test(businessCode)"
          :businessKey="businessKey"
          :businessCode="businessCode"
          :scopeRow="scopeRow"
          ref="againConstructionScheme"
          @closeDialog="closeDialog"
        ></againConstructionScheme>
        <!-- 安全责任书 -->
        <againLiabilityStatement
          v-else-if="safebookReg.test(businessCode)"
          :businessKey="businessKey"
          :businessCode="businessCode"
          :scopeRow="scopeRow"
          ref="againLiabilityStatement"
          @closeDialog="closeDialog"
        ></againLiabilityStatement>
        <!-- 安全检查 -->
        <againSecurityCheck
          v-else-if="safecheckReg.test(businessCode)"
          :businessCode="businessCode"
          :scopeRow="scopeRow"
          :businessKey="businessKey"
          ref="againSecurityCheck"
          @closeDialog="closeDialog"
        ></againSecurityCheck>
        <!-- 培训计划 -->
        <againTrainingPlan
          v-else-if="trainplanReg.test(businessCode)"
          :businessKey="businessKey"
          :businessCode="businessCode"
          :scopeRow="scopeRow"
          ref="againTrainingPlan"
          @closeDialog="closeDialog"
        ></againTrainingPlan>
        <!-- 隐患整改 -->
        <againHiddendangerdeplaydate
          v-else-if="hiddendangerReg.test(businessCode)"
          :businessKey="businessKey"
          :businessCode="businessCode"
          :scopeRow="scopeRow"
          ref="againHiddendangerdeplaydate"
          @closeDialog="closeDialog"
        ></againHiddendangerdeplaydate>
        <!-- 应急预案 -->
        <againEmergencyPlans
          v-else-if="emergencyReg.test(businessCode)"
          :businessKey="businessKey"
          :businessCode="businessCode"
          :scopeRow="scopeRow"
          ref="againEmergencyPlans"
          @closeDialog="closeDialog"
        ></againEmergencyPlans>
        <!-- 事故上报 -->
        <againAccidentReporting
          v-else-if="accidentReg.test(businessCode)"
          :businessKey="businessKey"
          :businessCode="businessCode"
          :scopeRow="scopeRow"
          ref="againAccidentReporting"
          @closeDialog="closeDialog"
        ></againAccidentReporting>
        <!-- 安全经费计提 -->
        <againSafefund
          v-else-if="safefundReg.test(businessCode)"
          :businessKey="businessKey"
          :businessCode="businessCode"
          :scopeRow="scopeRow"
          ref="againSafefund"
          @closeDialog="closeDialog"
        ></againSafefund>
        <h2 v-else>找不到该业务模块表单</h2>
        <!-- <span slot="footer" class="dialog-footer">
          <el-button @click="isVisible = false">取 消</el-button>
          <el-button type="primary" @click="isVisible = false">确 定</el-button>
      </span>-->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="closeDialog">取 消</el-button>
        <el-button class="tBtn" @click="sabmitFun">重新提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBacklog,
  openProcess,
  getNextUsertaskStart,
  alreadytasklist
} from '@/api/system/process'
import store from '@/store'
import { flowChart, proTask, historicalRecords } from '../transact'
import {
  changeJobs,
  constructionScheme,
  hiddendangerdeplaydate,
  liabilityStatement,
  securityCheck,
  trainingPlan,
  emergencyPlans,
  accidentReporting,
  safefund
} from './BusinessForm/index'
import {
  changeJobs as againChangeJobs,
  constructionScheme as againConstructionScheme,
  hiddendangerdeplaydate as againHiddendangerdeplaydate,
  liabilityStatement as againLiabilityStatement,
  securityCheck as againSecurityCheck,
  trainingPlan as againTrainingPlan,
  emergencyPlans as againEmergencyPlans,
  accidentReporting as againAccidentReporting,
  safefund as againSafefund
} from './againBusinessForm/index'
// import {
//   isBasicDate,
// } from '@/utils/date.js'
import elementIcons from '@/views/system/menu/element-icons.js'
// const defaultDept = {
//   deptId:'',
//   deptName:'',
//   email:'',
//   leader:'',
//   orderNum:'',
//   parentId:'',
//   phone:'',
//   status:'0'
// }
export default {
  components: {
    historicalRecords,
    flowChart,
    proTask,
    changeJobs,
    constructionScheme,
    hiddendangerdeplaydate,
    liabilityStatement,
    securityCheck,
    trainingPlan,
    emergencyPlans,
    accidentReporting,
    safefund,
    // 重新申请组件
    againChangeJobs,
    againConstructionScheme,
    againHiddendangerdeplaydate,
    againLiabilityStatement,
    againSecurityCheck,
    againTrainingPlan,
    againEmergencyPlans,
    againAccidentReporting,
    againSafefund
  },
  props: {
    state: Boolean
  },
  data() {
    return {
      scopeRow: {},
      activeName: 'first',
      has: {
        remove: '',
        query: 'system:userSafebook:list',
        add: '',
        edit: '',
        addPlanBtn: 'train:trainPlan:add'
      },
      tableData: [],
      role: '',
      roleSelect: [],
      roleId: [],
      roleIdList: [],
      fromData: [],
      modelId: '',
      userId: store.getters.userId,
      currentPage: 1, //当前页数
      total: 0, //总条目
      pageSize: 10,
      //业务模块弹窗里的
      bussiness: {
        startRole: '',
        businessId: '',
        modelId: '',
        startDept: ''
      },
      userName: '',
      roleData: [],
      dialogVisible: false,
      dialogVisibleBussines: false,
      //获取角色下拉
      //获取业务模块角色下拉

      bussiRoleSel: [],
      //获取业务模块下拉

      bussiModuleSel: [],

      //搜索
      pageForm: {
        userName: '',
        createBy: '',
        createByTime: '',
        status: ''
      },
      fromBussiness: {
        bussiRolId: '',
        bussiModule: ''
      },
      //树形
      checkStrictly: true,
      defaultMenutree: [],
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      workprocessId: '',
      elementIcons,
      itmeLabel: '',
      //				roleForm: {
      //					'component': '',
      //				},
      loading: false,
      //表单验证方法
      formRules: {},
      isVisible: false,
      againVisible: false,
      operaType: '',
      proTaskData: {},
      businessKey: '', //  当前审批任务key
      businessCode: '', //当前审批任务code
      currentProcessInstanceId: '', //当前审批任务ProcessInstanceId
      postchangeReg: /^postchange/,
      programReg: /^program/,
      safebookReg: /^safebook/,
      safecheckReg: /^safecheck/,
      trainplanReg: /^trainplan/,
      hiddendangerReg: /^hiddendanger/,
      emergencyReg: /^emergencyplan/,
      accidentReg: /^accident/,
      safefundReg: /^safefund/
    }
  },
  created: async function() {
    console.log(this.state)
    this.getAllList()
    this.$store.state.tabActive = 'task1'
  },

  methods: {
    // 重新提交
    sabmitFun() {
      if (this.postchangeReg.test(this.businessCode)) {
        // 岗位更变
        this.$refs.againChangeJobs.sabmitFun('pageForm')
      } else if (this.programReg.test(this.businessCode)) {
        // 施工方案
        this.$refs.againConstructionScheme.confirm()
      } else if (this.safebookReg.test(this.businessCode)) {
        // 安全责任书
        this.$refs.againLiabilityStatement.submitForm('ruleForm')
      } else if (this.safecheckReg.test(this.businessCode)) {
        // 安全检查
        this.$refs.againSecurityCheck.submitFun('form')
      } else if (this.trainplanReg.test(this.businessCode)) {
        // 培训计划
        this.$refs.againTrainingPlan.addxz()
      } else if (this.hiddendangerReg.test(this.businessCode)) {
        // 隐患整改
        this.$refs.againHiddendangerdeplaydate.sabmitFun()
      } else if (this.emergencyReg.test(this.businessCode)) {
        // 应急预案
        this.$refs.againEmergencyPlans.submitForm('ruleForm')
      } else if (this.accidentReg.test(this.businessCode)) {
        // 事故上报
        // this.$refs.againAccidentReporting.
      } else if (this.safefundReg.test(this.businessCode)) {
        // 安全经费计提
        this.$refs.againSafefund.sabmitFun('ruleForm')
      }
    },
    closeDialog() {
      this.getAllList()
      this.againVisible = false
    },
    handleSelectionChange(val) {
      if (val) {
        let arr = []
        for (let i = 0; i < val.length; i++) {
          let itme = val[i]
          arr.push(itme.id)
        }
        this.multipleSelection = [...arr]
      }
    },
    //获取列表数据
    //获取列表
    async getAllList() {
      this.loading = true
      let res = []
      let mtar = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        userId: this.userId
      }
      if (this.state) {
        res = await getBacklog(mtar)
      } else {
        res = await alreadytasklist(mtar)
      }
      this.tableData = res.rows
      this.total = res.total
      this.loading = false
    },
    // 重新申请事件
    handleAgain(scope) {
      console.log(scope.row, 996)
      this.businessKey = scope.row.businessKey
      this.businessCode = scope.row.businessCode
      this.scopeRow = scope.row
      this.againVisible = true
    },
    //办理
    async handleAdd(scope) {
      //查看流程图              流程ID
      this.getProcess(scope.row.processInstanceId)
      // 查看审批历史记录
      this.currentProcessInstanceId = scope.row.processInstanceId
      /* 任务处理所需数据 */
      let res = await getNextUsertaskStart({
        taskId: scope.row.taskId,
        userId: this.userId
      })
      if (res === undefined) {
        //无下一节点
        res = {}
      }
      this.proTaskData = res
      this.proTaskData.processInstanceId = scope.row.processInstanceId
      this.proTaskData.processName = scope.row.processName
      this.proTaskData.taskName = scope.row.taskName
      this.proTaskData.userId1 = this.userId
      this.proTaskData.taskId = scope.row.taskId
      this.proTaskData.businessKey = scope.row.businessKey
      this.proTaskData.businessCode = scope.row.businessCode
      this.businessKey = scope.row.businessKey
      this.businessCode = scope.row.businessCode
      this.operaType = scope.row.operaType
      this.isVisible = true
    },
    // 完成
    complete() {
      console.log(78978954)
      this.isVisible = false
      this.getAllList()
    },
    //查看
    async handleDetail() {
      this.$router.push({
        path: '/people/lookPeople'
      })
    },
    //编辑
    async handleEdit(scope) {
      this.$router.push({
        path: '/workChart/edit',
        query: {
          workprocessId: scope.row.workprocessId
        }
      })
    },
    //提交
    async handleSubmit(scope) {
      this.workprocessId = scope.row.workprocessId
      var data = await getSubmitWorkchart(this.workprocessId)
      this.$notify({
        title: data ? '提交成功' : '提交失败',
        dangerouslyUseHTMLString: true,
        message: data ? data.message : '服务器开小差了，请稍后再试',
        type: data ? 'success' : 'warning'
      })
      this.getAllList()
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getAllList()
    },

    ///页脚
    handleSizeChange(val) {
      this.pageSize = val
      this.getAllList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getAllList()
    },
    async getProcess(processInstanceId) {
      this.$refs.flowchart.needUrl = await openProcess({
        processInstanceId: processInstanceId
      })
    }
  },
  computed: {
    customClass() {
      if (
        this.safebookReg.test(this.businessCode) ||
        this.safecheckReg.test(this.businessCode) ||
        this.trainplanReg.test(this.businessCode)
      ) {
        return 'tDialog large'
      } else {
        return 'tDialog small'
      }
    }
  }
}
</script>

<style scoped></style>
