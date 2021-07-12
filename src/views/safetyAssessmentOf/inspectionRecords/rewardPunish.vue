<template>
  <div class="app-container" style="border:none">
    <div class="sxForm">
      <el-form :inline="true" :model="ruleForm" class="demo-form-inline">
        <!-- 工作内容 -->
        <el-form-item label="工作内容">
          <el-select
            value-key="classdictId"
            @change="dictNumbers"
            v-model="ruleForm.workContents"
            placeholder="请选择"
          >
            <el-option
              v-for="item in work"
              :key="item.classdictId"
              :label="item.dictName"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 指标 -->
        <el-form-item label="指标">
          <el-select
            value-key="classdictId"
            v-model="ruleForm.workIndexs"
            placeholder="请选择"
          >
            <el-option
              v-for="item in workindex"
              :key="item.classdictId"
              :label="item.dictName"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="btnCont">
          <el-button class="chaxun" @click="onSubmit">查询</el-button>
          <el-button class="chongzhi" @click="resetForm">重置</el-button>
        </div>
      </el-form>
    </div>
    <div class="sxTable">
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
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column label="姓名" show-overflow-tooltip align="center">
          <template>{{ userNameyear.userName }}</template>
        </el-table-column>
        <el-table-column label="月度" show-overflow-tooltip align="center">
          <template>{{ userNameyear.year }}</template>
        </el-table-column>
        <el-table-column
          prop="workContent"
          label="工作内容"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          prop="workIndex"
          label="指标"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          prop="score"
          label="减分数"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <!--            <el-table-column label="达标">-->
        <!--                <template slot-scope="scope">{{-->
        <!--                        scope.row.isQualified | year_compliance_detail-->
        <!--                    }}-->
        <!--                </template>-->
        <!--            </el-table-column>-->
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
  </div>
</template>
<script>
import {
  getdictNumber //分类字典
} from '@/api/job/safety'
import {
  getmossRecordView //月度安全考核记录查看
} from '@/api/safetyAssessmentOf/index'
import { getyearcompliancedetail } from '@/api/safetyAssessmentOf/index'

export default {
  props: {
    yearcomplianceId: {
      type: String,
      default: ''
    },
    userNameyear: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      work: [],
      workindex: [],
      ruleForm: {},
      tableData: [],
      multipleSelection: [],
      loadingtable: false,
      currentPage: 1, //分页
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.getdict()
  },
  methods: {
    async getdict() {
      this.work = await getdictNumber('DICT_WORKCONTENT')
      this.gettassesst()
    },
    async gettassesst() {
      this.loadingtable = true
      let param = {
        monthassessId: this.yearcomplianceId,
        workContentId: this.ruleForm.workContent,
        workIndexId: this.ruleForm.workIndex,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      let res = await getmossRecordView(param)
      this.tableData = res.rows
      this.total = res.total
      this.loadingtable = false
    },
    // 查询指标
    async dictNumbers(value) {
      const res = await getdictNumber(value.dictNumber)
      console.log(res)
      if (res.length < 0) {
        //如果没有结果着为空
        this.workindex = []
        return
      }
      this.workindex = res
      this.$set(this.ruleForm, 'workIndexs', {})
      console.log(this.ruleForm, 88)
    },
    // 查询
    onSubmit() {
      this.ruleForm.workContent = this.ruleForm.workContents
        ? this.ruleForm.workContents.classdictId
          ? this.ruleForm.workContents.classdictId
          : ''
        : ''
      this.ruleForm.workIndex = this.ruleForm.workIndexs
        ? this.ruleForm.workIndexs.classdictId
          ? this.ruleForm.workIndexs.classdictId
          : ''
        : ''
      this.currentPage = 1
      this.pageSize = 10
      this.gettassesst()
    },
    // 重置
    resetForm() {
      this.ruleForm = {}
      this.workindex = []
      this.currentPage = 1
      this.pageSize = 10
      this.gettassesst()
    },
    // 全选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      //分页
      this.pageSize = val
      this.gettassesst()
    },
    handleCurrentChange(val) {
      //分页
      this.currentPage = val
      this.gettassesst()
    }
  }
}
</script>
<style lang="scss" scoped></style>
