<template>
  <div v-loading="loading" class="safe_main">
    <!-- 搜索头 -->
    <div class="sxForm">
      <el-form ref="form" :model="form" :inline="true" class="demo-form-inline">
        <el-form-item label="测验类型">
          <el-select
            v-model="form.planTypeId"
            clearable
            placeholder="请选择测验类型"
          >
            <!-- exam_paperType -->
            <el-option
              v-for="(item, index) of dictionaries"
              :key="index"
              :label="item.dictLabel"
              :value="item.dictCode"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="测验开始时间">
          <el-date-picker
            v-model="form.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="测验结束时间">
          <el-date-picker
            v-model="form.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <div class="btnCont">
          <el-button class="chaxun" v-has="has.getplan" @click="query"
            >查询</el-button
          >
          <el-button class="chongzhi" @click="Reset">重置</el-button>
        </div>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="sxTable">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="light"
        style="width: 100%"
        height="calc(100vh - 370px)"
        stripe
      >
        <el-table-column
          prop="planTypeName"
          label="测验类型"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="paperCount"
          label="题组数量"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column label="检测起止时间" width="330" align="center">
          <template slot-scope="scope"
            >{{ scope.row.startTime }} 到 {{ scope.row.endTime }}</template
          >
        </el-table-column>
        <el-table-column label="测验名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text">{{ scope.row.name }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="cz" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <!-- 这里可以拿到当前行的内容 row -->
            <el-button size="small" type="text" @click="goRedact(scope)"
              >确定</el-button
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
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { getexamPlanList, getexamOtherPlanList } from '@/api/examination/index' //查询测验计划接口
import { getSelectType } from '@/api/examination/index' //字典
export default {
  // components: {
  //   getExamPlan: getExamPlan,
  // },
  data() {
    return {
      has: {
        getplan: 'exam:plan:query'
      },
      tableData: [], //列表 list
      total: 0, //条目
      pageSize: 10,
      currentPage: 1,
      loading: false,
      form: {
        startTime: '',
        endTime: ''
      },
      dictionaries: []
    }
  },
  created() {
    this.loading = true
    this.getExamPlanTable()
  },
  methods: {
    //选择的考试列表
    goRedact(e) {
      this.$emit('func', e)
    },
    async getExamPlanTable() {
      //查找测验计划
      this.dictionaries = await getSelectType('exam_planType')

      let params = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        flag: 'official',
        planTypeId: this.form.planTypeId,
        startTime: this.form.startTime,
        endTime: this.form.endTime,
        status: this.form.status
      }
      // const res = await getexamPlanList(params);
      const res = await getexamOtherPlanList(params)
      for (let item of res.rows) {
        item.planTypeName = this.dictionaries.filter(
          (v) => v.dictCode == item.planTypeId
        )
        if (item.planTypeName.length > 0) {
          item.planTypeName = item.planTypeName[0].dictLabel
        } else {
          item.planTypeName = ''
        }
      }
      this.tableData = res.rows
      this.total = res.total
      this.loading = false
    },
    // 查询
    query() {
      this.pageSize = 10
      this.currentPage = 1
      this.getExamPlanTable()
    },
    // 重置
    Reset() {
      this.form = {}
      this.pageSize = 10
      this.currentPage = 1
      this.getExamPlanTable()
    },
    handleClick(tab, event) {
      //切换标签页触发
    },
    handleSizeChange(val) {
      //分页
      this.pageSize = val
      this.getExamPlanTable()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getExamPlanTable()
    }
  }
}
</script>
<style lang="scss" scoped></style>
