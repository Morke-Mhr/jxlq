<template>
  <!-- 隐患复现 -->
  <div class="safe_main">
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
          label="隐患描述名称"
          prop="problemDesc"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>

        <el-table-column label="出现次数" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="toYhRecord(scope.row.problemDesc)">{{
              scope.row.problemCount
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[1, 10, 20, 30]"
        :page-size="formInline.pageSize"
        background
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
const defaultPageSize = 10
import { reappearList } from '@/api/hiddenDanger/security'
export default {
  data() {
    return {
      formInline: {
        pageSize: defaultPageSize,
        pageNum: '1'
      },
      formInlineText: ['问题描述', '检查类别', '隐患级别', '责任人', '实施人'],
      // 配置列表显示项
      tableCol: [
        { label: '问题描述', propVal: 'problemDesc' },
        { label: '检查类别', propVal: 'checkCategory' },
        { label: '隐患级别', propVal: 'hdLevel' },
        { label: '责任人', propVal: 'dutyUser' },
        { label: '实施人', propVal: 'implementer' },
        { label: '计划完成时间', propVal: 'planFinishTime' },
        { label: '完成时间', propVal: 'realFinishTime' }
      ],
      tableData: [],
      //总条目
      total: 0,
      // 当前页数
      currentPage: 1
    }
  },
  methods: {
    onSubmit() {
      this.getData('cx')
    },
    async getData(cx) {
      console.log(this.formInline)
      if (cx == 'cx') {
        this.formInline.pageNum = 1
        this.currentPage = 1
      }
      let res = await reappearList(this.formInline)
      this.total = res.total
      this.tableData = res.rows
      console.log(res, 999)
    },
    handleSizeChange(val) {
      this.formInline.pageSize = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.formInline.pageNum = val
      this.getData()
    },
    toYhRecord(problemDesc) {
      this.$store.state.tabActive = 'yhRecord'
      this.$router.push({
        name: 'yhrecord',
        params: {
          problemDesc: problemDesc,
          pageSize: defaultPageSize,
          pageNum: '1'
        }
      })
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style lang="" scoped></style>
