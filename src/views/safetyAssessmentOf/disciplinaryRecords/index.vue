<template>
  <div class="safe_main">
    <div class="sxForm">
      <el-form :inline="true" :model="formdata" class="demo-form-inline">
        <!-- 姓名 -->
        <el-form-item label="姓名">
          <el-input
            v-model="formdata.userName"
            clearable
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <!-- 类型 -->
        <el-form-item label="类型">
          <el-select
            value-key="dictCode"
            v-model="formdata.jfType"
            clearable
            placeholder="请选择类型"
          >
            <el-option
              v-for="item in disciplinaryRecords_type"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 事项 -->
        <el-form-item label="事项">
          <el-input
            v-model="formdata.matter"
            clearable
            placeholder="请输入事项"
          ></el-input>
        </el-form-item>
        <!-- 部门 -->
        <el-form-item label="部门">
          <el-input
            v-model="formdata.dept"
            clearable
            placeholder="请输入部门"
          ></el-input>
        </el-form-item>
        <!-- 金额 -->
        <el-form-item label="金额">
          <el-input
            v-model.number="formdata.money"
            clearable
            @mousewheel.native.prevent
            type="number"
            placeholder="请输入金额"
          ></el-input>
        </el-form-item>
        <!-- 其它奖罚 -->
        <div class="btnCont">
          <el-button class="chaxun" @click="onSubmit">查询</el-button>
          <el-button class="chongzhi" @click="resetForm">重置</el-button>
        </div>
      </el-form>
    </div>
    <div class="sxTable">
      <el-button class="blue" v-has="has.add" @click="addDisciplinaryRecords"
        >新增</el-button
      >
      <el-button
        class="blue"
        v-has="has.remove"
        @click="delBatchDisciplinaryRecords"
        >批量删除</el-button
      >
      <el-table
        :data="tableData"
        tooltip-effect="light"
        style="width: 100%"
        height="calc(100vh - 370px)"
        @selection-change="handleSelectionChange"
        v-loading="loadingtable"
        stripe
      >
        <el-table-column
          align="center"
          type="selection"
          width="55"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="userName"
          label="姓名"
          show-overflow-tooltip
          width="100"
        ></el-table-column>
        <el-table-column
          align="center"
          label="类型"
          show-overflow-tooltip
          width="100"
        >
          <template slot-scope="scope">{{
            scope.row.jfType | yearcompliance
          }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="matter"
          label="事项"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          prop="dept"
          label="部门"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          prop="money"
          label="金额"
          show-overflow-tooltip
          width="100"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="jfOther"
          label="其它奖罚"
          show-overflow-tooltip
          width="280"
        ></el-table-column>
        <el-table-column
          align="center"
          label="附件"
          show-overflow-tooltip
          width="110"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="download(scope.row.fileName, scope.row.fileUrl)"
              >{{ scope.row.fileName }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="remark"
          label="备注"
          show-overflow-tooltip
          width="110"
        ></el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="seeDisciplinaryRecords(scope.row.rewardpunishId)">查看</el-button> -->
            <el-button
              type="text"
              class="red"
              v-has="has.remove"
              @click="delDisciplinaryRecords(scope.row.rewardpunishId)"
              >删除</el-button
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
    <!-- 新增弹出层 -->
    <el-dialog
      title="新增"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      :close-on-click-modal="false"
      custom-class="small"
    >
      <add
        ref="disciplinary"
        :treeselect="treeselect"
        @complete="complete"
        @cancel="cancel"
      ></add>
      <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="dialogVisible = false">取 消</el-button>
        <el-button
          class="tBtn"
          @click="$refs.disciplinary.submitForm('ruleForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getTreeSelect, //获取部门
  getDisciplinaryRecords, //查询
  delDisciplinaryRecords //删除
} from '@/api/safetyAssessmentOf/index'
import add from './add' //新增子组件
export default {
  components: {
    add: add
  },
  data() {
    return {
      has: {
        remove: 'rewardPunish:post:deletes',
        add: 'rewardPunish:post:submit'
      },
      formdata: {}, //搜索表单
      disciplinaryRecords_type: [
        { dictLabel: '奖励', dictCode: 0 },
        { dictLabel: '惩罚', dictCode: 1 }
      ],
      treeselect: [], //部门树形

      tableData: [], //表格数据
      loadingtable: false, //表格加载
      dialogVisible: false, //新增弹出层
      multipleSelection: [], //已选中数组
      currentPage: 1, //分页
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.loadingtable = true
    this.getSelect()
  },
  methods: {
    // 查询
    async getDisciplinaryRecords() {
      this.loadingtable = true
      let parm = {
        userName: this.formdata.userName,
        jfType: this.formdata.jfType,
        dept: this.formdata.dept,
        matter: this.formdata.matter,
        money: this.formdata.money,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      let res = await getDisciplinaryRecords(parm)
      this.tableData = res.rows
      this.total = res.total
      this.loadingtable = false
    },
    // 查询部门树形、字典
    async getSelect() {
      this.treeselect = await getTreeSelect()
      this.getDisciplinaryRecords()
    },

    // 查询按钮
    onSubmit() {
      this.currentPage = 1
      this.pageSize = 10
      this.getDisciplinaryRecords()
    },
    // 新增
    addDisciplinaryRecords() {
      this.dialogVisible = true
    },
    // 新增完成
    complete() {
      this.dialogVisible = false
      this.getDisciplinaryRecords()
    },
    // 取消
    cancel() {
      this.dialogVisible = false
    },
    // 附件下载
    download(fileName, fileUrl) {
      let download = this.$store.state.apiConfiguration.url //下载地址
      let fileDowloadName =
        download +
        `fs/download?name=${encodeURI(encodeURI(fileName))}&path=${fileUrl}`
      location.href = fileDowloadName
    },
    // 批量删除
    async delBatchDisciplinaryRecords() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: '请选择要删除的记录',
          type: 'warning'
        })
        return
      }
      let v = []
      for (let item of this.multipleSelection) {
        v.push(item.rewardpunishId)
      }
      this.$confirm('是否确定删除已选中记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let res = await delDisciplinaryRecords(v)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getDisciplinaryRecords()
        })
        .catch(() => {
          return
        })
    },
    // 删除
    async delDisciplinaryRecords(id) {
      let v = []
      v.push(id)
      this.$confirm('是否确定删除当前记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let res = await delDisciplinaryRecords(v)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getDisciplinaryRecords()
        })
        .catch(() => {
          return
        })
    },
    // 重置
    resetForm() {
      this.formdata = {}
      this.currentPage = 1
      this.pageSize = 10
      this.getDisciplinaryRecords()
    },
    // 全选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      //分页
      this.pageSize = val
      this.getDisciplinaryRecords()
    },
    handleCurrentChange(val) {
      //分页
      this.currentPage = val
      this.getDisciplinaryRecords()
    }
  }
}
</script>
