<template>
  <div class="safe_main">
    <div class="sxForm">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <!-- 姓名 -->
        <el-form-item label="姓名">
          <el-input
            v-model="formInline.userName"
            clearable
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <!-- 考核月度 -->
        <el-form-item label="考核月度">
          <el-date-picker
            v-model="formInline.assessMonth"
            value-format="yyyy-MM"
            type="month"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="部门">
          <el-input
            v-model="formInline.dept"
            clearable
            placeholder="请输入部门"
          ></el-input>
        </el-form-item>
        <!-- 岗位 -->
        <el-form-item label="岗位">
          <el-input
            v-model="formInline.post"
            clearable
            placeholder="请输入部门"
          ></el-input>
        </el-form-item>
        <!-- 实际得分 -->
        <el-form-item label="实际得分">
          <el-input
            v-model="formInline.totalScore"
            clearable
            @mousewheel.native.prevent
            oninput="value=value.replace(/[^\d]/g,'')"
            type="number"
            placeholder="请输入实际得分"
          ></el-input>
        </el-form-item>
        <div class="btnCont">
          <el-button class="chaxun" v-has="has.get" @click="onSubmit"
            >查询</el-button
          >
          <el-button class="chongzhi" @click="resetForm">重置</el-button>
        </div>
      </el-form>
    </div>

    <!-- table -->
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
          prop="userName"
          label="姓名"
          show-overflow-tooltip
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="assessMonth"
          label="考核月份"
          show-overflow-tooltip
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="assessTime"
          label="考核时间"
          show-overflow-tooltip
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="totalScore"
          label="实际得分"
          show-overflow-tooltip
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="deptName"
          label="部门"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="postName"
          label="岗位"
          show-overflow-tooltip
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-has="has.getdetails"
              @click="seeQueryAll(scope.row.monthassessId, scope.$index)"
              >查看</el-button
            >
            <!-- <el-button
              type="text"
              v-has="has.del"
              @click="delQueryAll(scope.row.assessrecordId)"
              >删除
            </el-button> -->
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
    <!-- <el-dialog
      title="安全考核"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      v-if="dialogVisible"
      custom-class="large"
    >
      <p>详情：</p>
      <table border="1" class="table">
        <tr>
          <td>部门</td>
          <td>{{ mossRecordlist.deptName }}</td>
        </tr>
        <tr>
          <td>岗位</td>
          <td>{{ mossRecordlist.postName }}</td>
        </tr>
        <tr>
          <td>姓名</td>
          <td>{{ mossRecordlist.userName }}</td>
        </tr>
        <tr>
          <td>月度</td>
          <td>{{ mossRecordlist.assessMonth }}</td>
        </tr>
        <tr>
          <td>总得分</td>
          <td>{{ mossRecordlist.totalScore }}</td>
        </tr>
      </table>

      <p>考核指标:</p>
      <el-table :data="mossRecordlist.assessRecords" stripe style="width: 100%">
        <el-table-column
          prop="norder"
          label="序号"
          width="80"
        ></el-table-column>
        <el-table-column prop="workContent" label="工作内容"></el-table-column>
        <el-table-column prop="workIndex" label="考核指标"></el-table-column>
        <el-table-column
          prop="score"
          label="得分"
          width="120"
        ></el-table-column>
      </el-table>
    </el-dialog> -->

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
        <el-button class="fBtn" @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="同步"
      :visible.sync="synchronization"
      v-if="synchronization"
      custom-class="small"
      :close-on-click-modal="false"
    >
      <el-form
        :inline="true"
        :model="zationlist"
        :rules="rules"
        ref="form"
        class="demo-form-inline"
      >
        <!-- 考核月度 -->
        <el-form-item label="考核月度" prop="assessMonth">
          <el-date-picker
            v-model="zationlist.assessMonth"
            value-format="yyyy-MM"
            type="month"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="synchronization = false"
          >取 消</el-button
        >
        <el-button class="tBtn" @click="determine">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getmonthassessRecord, //月度安全考核记录全部查询
  getmossRecordView, //月度安全考核记录查看
  delmonthassessRecord, //删除记录
  manualTask //同步
} from '@/api/safetyAssessmentOf/index'
import rewardPunish from './rewardPunish' //子组件

export default {
  components: {
    rewardPunish: rewardPunish
  },
  data() {
    return {
      has: {
        get: 'monthassessRecord:post:queryAll',
        getdetails: 'monthassessRecord:post:mossRecordView',
        del: 'monthassessRecord:post:deletes'
      },

      currentPage: 1, //当前页数
      pageSize: 10,
      total: 0, //总条目
      tableData: [], //列表
      loadingtable: false, //加载
      formInline: { totalScore: '' }, //搜索列表
      zationlist: {},
      dialogVisible: false, //查看弹出层
      mossRecordlist: {}, //详情
      userNameyear: {},
      yearcomplianceId: '', //子列表ID
      synchronization: false,
      rules: {
        assessMonth: [
          { required: true, message: '请选择考核月度', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.loadingtable = true
    this.getqueryAll()
  },
  methods: {
    // 同步
    zation() {
      this.synchronization = true
      let date =
        new Date().getFullYear() +
        '-' +
        (new Date().getMonth() + 1).toString().padStart(2, '0')
      this.$set(this.zationlist, 'assessMonth', date)
    },

    determine() {
      this.loadingtable = true
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let data = {
            ym: this.zationlist.assessMonth
          }
          this.synchronization = false

          let res = await manualTask(data)
          this.$message({
            message: res,
            type: 'success'
          })
          this.loadingtable = false

          this.getqueryAll()
        } else {
          return false
        }
      })
    },
    //   搜索
    onSubmit() {
      this.formInline.pageNum = 1
      this.formInline.pageSize = 10
      this.getqueryAll(this.formInline)
    },
    // 重置
    resetForm() {
      this.formInline = { totalScore: '' }
      this.currentPage = 1
      this.pageSize = 10
      this.getqueryAll()
    },
    //   查询数据
    async getqueryAll(parmes) {
      let parme = {}
      if (!!parmes) {
        parme = parmes
      } else {
        parme = {
          pageSize: this.pageSize,
          pageNum: this.currentPage
        }
      }
      let res = await getmonthassessRecord(parme)
      this.total = res.total
      this.tableData = res.rows
      this.loadingtable = false
    },
    // 全选
    handleSelectionChange() {},
    handleSizeChange(val) {
      //分页
      this.pageSize = val
      this.getqueryAll()
    },
    handleCurrentChange(val) {
      //分页
      this.currentPage = val
      this.getqueryAll()
    },
    // 查看弹出层
    async seeQueryAll(id, index) {
      this.yearcomplianceId = id
      this.userNameyear = {
        userName: this.tableData[index].userName,
        year: this.tableData[index].assessMonth
      }
      // let parme = {
      //     targetId: id
      // }
      // let res = await getmossRecordView(parme)
      // this.mossRecordlist = res
      this.dialogVisible = true
    },
    // 删除
    async delQueryAll(id) {
      let ids = [...id]
      this.$confirm('是否确定删除当前记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let res = await delmonthassessRecord(ids)
          this.$message({
            message: res,
            type: 'success'
          })
          this.getqueryAll()
        })
        .catch(() => {
          return
        })
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
