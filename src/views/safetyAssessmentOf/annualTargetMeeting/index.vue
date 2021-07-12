<template>
  <div class="safe_main">
    <div class="sxForm">
      <el-form :inline="true" :model="ruleForm" class="demo-form-inline">
        <!-- 部门 -->
        <el-form-item label="部门">
          <el-input
            v-model="ruleForm.deptName"
            clearable
            placeholder="请输入部门"
          ></el-input>
        </el-form-item>
        <!-- 岗位 -->
        <el-form-item label="岗位">
          <el-input
            v-model="ruleForm.postName"
            clearable
            placeholder="请输入岗位"
          ></el-input>
        </el-form-item>
        <!-- 姓名 -->
        <el-form-item label="姓名">
          <el-input
            v-model="ruleForm.userName"
            clearable
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <!-- 年度 -->
        <el-form-item label="年度">
          <el-date-picker
            v-model="ruleForm.year"
            value-format="yyyy"
            type="year"
            placeholder="选择年度"
          ></el-date-picker>
        </el-form-item>
        <div class="btnCont">
          <el-button class="chaxun" @click="onSubmit">查询</el-button>
          <el-button class="chongzhi" @click="resetForm">重置</el-button>
        </div>
      </el-form>
    </div>
    <div class="sxTable">
      <el-button class="blue" @click="zation">同步</el-button>
      <el-table
        :data="tableData"
        tooltip-effect="light"
        style="width: 100%"
        height="calc(100vh - 370px)"
        @selection-change="handleSelectionChange"
        v-loading="loadingtable"
        stripe
      >
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column
          prop="dept"
          label="部门"
          show-overflow-tooltip
          width="300"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="post"
          label="岗位"
          show-overflow-tooltip
          width="300"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="userName"
          label="姓名"
          show-overflow-tooltip
          width="300"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="year"
          label="年度"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column label="操作" fixed="right" width="300" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="
                seeMonthassessRecord(scope.row.yearcomplianceId, scope.$index)
              "
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
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
      title="查看"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      custom-class="large"
      :close-on-click-modal="false"
    >
      <rewardPunish
        :userNameyear="userNameyear"
        :yearcomplianceId="yearcomplianceId"
      ></rewardPunish>
      <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="同步"
      :visible.sync="synchronization"
      v-if="synchronization"
      custom-class="Small"
      :close-on-click-modal="false"
    >
      <el-form
        :inline="true"
        :model="zationlist"
        :rules="rules"
        ref="form"
        class="demo-form-inline"
      >
        <!-- 考核年度 -->
        <el-form-item label="考核年度" prop="assessMonth">
          <el-date-picker
            v-model="zationlist.assessMonth"
            value-format="yyyy"
            type="year"
            placeholder="选择年度"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="tBtn" @click="determine">确 定</el-button>
        <el-button class="fBtn" @click="synchronization = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getyearcompliance, //年度目标达标全部查询
  yearcompliance
} from '@/api/safetyAssessmentOf/index'
import rewardPunish from './rewardPunish' //子组件
export default {
  components: {
    rewardPunish: rewardPunish
  },
  data() {
    return {
      loadingtable: false, //加载
      ruleForm: {}, //搜索表单
      tableData: [], //列表
      multipleSelection: [], //已选
      dialogVisible: false, //子组件弹出层
      yearcomplianceId: '', //子列表ID
      userNameyear: {},
      currentPage: 1, //分页
      pageSize: 10,
      total: 0,
      zationlist: {},
      synchronization: false,
      rules: {
        assessMonth: [
          { required: true, message: '请选择考核年度', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getyearcompliances()
  },
  methods: {
    // 同步
    zation() {
      this.synchronization = true
      let date = new Date().getFullYear()
      this.$set(this.zationlist, 'assessMonth', date + '')
    },
    determine() {
      this.loadingtable = true
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let data = {
            year: this.zationlist.assessMonth
          }
          this.synchronization = false
          let res = await yearcompliance(data)
          this.$message({
            message: res,
            type: 'success'
          })
          this.getyearcompliances()
          this.loadingtable = false
        } else {
          return false
        }
      })
    },
    //   查询
    async getyearcompliances() {
      this.loadingtable = true
      let parm = {
        userName: this.ruleForm.userName,
        postName: this.ruleForm.postName,
        deptName: this.ruleForm.deptName,
        year: this.ruleForm.year,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      let res = await getyearcompliance(parm)
      this.tableData = res.rows
      this.total = res.total
      this.loadingtable = false
    },

    // 查看按钮
    seeMonthassessRecord(id, index) {
      this.yearcomplianceId = id
      this.userNameyear = {
        userName: this.tableData[index].userName,
        year: this.tableData[index].year
      }
      this.dialogVisible = true
    },
    // 查询按钮
    onSubmit() {
      this.currentPage = 1
      this.pageSize = 10
      this.getyearcompliances()
    },
    // 重置
    resetForm() {
      this.ruleForm = {}
      this.currentPage = 1
      this.pageSize = 10
      this.getyearcompliances()
    },
    // 全选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      //分页
      this.pageSize = val
      this.getyearcompliances()
    },
    handleCurrentChange(val) {
      //分页
      this.currentPage = val
      this.getyearcompliances()
    }
  }
}
</script>
<style lang="scss" scoped>
.sxForm /deep/ {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: auto;
  }
}
</style>
