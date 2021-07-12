<template>
  <div v-loading="loading" class="app-container">
    <!-- 搜索头 -->
    <div class="sxForm">
      <el-form ref="form" :model="form" :inline="true" class="demo-form-inline">
        <el-form-item label="分类">
          <el-select
            v-model="form.subjectId"
            clearable
            placeholder="请选择分类"
          >
            <el-option
              v-for="(item, index) of dictionaries.subject"
              :key="index"
              :label="item.dictLabel"
              :value="item.dictCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主题">
          <el-select
            v-model="form.disciplineId"
            clearable
            placeholder="请选择主题"
          >
            <el-option
              v-for="(item, index) of dictionaries.discipline"
              :key="index"
              :label="item.dictLabel"
              :value="item.dictCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题组模板">
          <el-select
            v-model="form.paperTypeId"
            clearable
            placeholder="请选择题型"
          >
            <el-option
              v-for="(item, index) of dictionaries.paperType"
              :key="index"
              :label="item.dictLabel"
              :value="item.dictCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" clearable placeholder="请选择状态">
            <el-option
              v-for="(item, index) of dictionaries.status"
              :key="index"
              :label="item.dictLabel"
              :value="item.dictCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="btnCont">
          <el-button class="chaxun" v-has="has.getpaper" @click="query"
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
        height="calc(100vh - 380px)"
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column
          align="center"
          type="selection"
          width="55"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="subjectName"
          label="分类"
          show-overflow-tooltip
          width="160"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="disciplineName"
          label="主题"
          show-overflow-tooltip
          width="160"
        ></el-table-column>
        <el-table-column align="center" label="题组名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button
              type="text"
              v-has="has.getpaper"
              @click="paperDetailsVisible(scope.row.paperId)"
              >{{ scope.row.name }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="paperTypeName"
          label="题组模板"
          width="110"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column
          align="center"
          prop="questionNum"
          label="题目数量"
          width="110"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          prop="totalScore"
          label="总分值"
          width="110"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          prop="createBy"
          label="创始人"
          width="110"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          show-overflow-tooltip
          width="160"
        >
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="状态"
          show-overflow-tooltip
          width="110"
        >
          <template slot-scope="scope">{{
            scope.row.status | exam_topicState
          }}</template>
        </el-table-column>
        <!-- <el-table-column label="标签" width="120">
        <template></template>
      </el-table-column> -->
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
    <!-- 题组详情 -->
    <el-dialog
      title="题组详情"
      :close-on-click-modal="false"
      custom-class="large"
      v-if="dialogDetailsVisible"
      :visible.sync="dialogDetailsVisible"
    >
      <paperDetails :paperId="paperId"></paperDetails>
      <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="dialogDetailsVisible = false"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getPaperList } from '@/api/examination/index' //查询题组列表接口
import paperDetails from './paperDetails' //题组详情
import { getSelectType } from '@/api/examination/index' //字典

export default {
  components: {
    paperDetails: paperDetails
  },
  props: {
    dictionaries: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      has: {
        getpaper: 'exam:paper:query'
      },
      search: '', // 搜索
      tableData: [], //列表 list
      multipleSelection: [], //已选中数组
      total: 0, //条目
      pageSize: 10,
      currentPage: 1,
      dialogDetailsVisible: false,
      paperId: 0, // 当前题组id
      subject: [], //字典获取的值 班级 科目 分类 ...
      grade: [],
      paperType: [],
      discipline: [],
      loading: false,
      form: {} //搜索列表
    }
  },
  created() {
    this.loading = true
    this.getPapertable()
  },
  methods: {
    // 获取题组（试卷）列表
    async getPapertable() {
      let params = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        flag: 'official',
        subjectId: this.form.subjectId,
        disciplineId: this.form.disciplineId,
        paperTypeId: this.form.paperTypeId,
        status: this.form.status
      }
      const res = await getPaperList(params)
      console.log(this.dictionaries)
      for (let item of res.rows) {
        //根据当前ID对比字典 获取当前名称
        item.subjectName = this.filet(item.subjectId, this.dictionaries.subject)
        item.gradeName = this.filet(item.gradeId, this.dictionaries.grade)
        item.paperTypeName = this.filet(
          item.paperTypeId,
          this.dictionaries.paperType
        )
        item.disciplineName = this.filet(
          item.disciplineId,
          this.dictionaries.discipline
        )
      }
      this.tableData = res.rows

      this.total = res.total
      this.loading = false
      console.log(res)
    },

    // 查询
    query() {
      this.pageSize = 10
      this.currentPage = 1
      this.getPapertable()
    },
    // 重置
    Reset() {
      this.form = {}
      this.pageSize = 10
      this.currentPage = 1
      this.getPapertable()
    },
    filet(id, idList) {
      if (!Array.isArray(idList)) {
        return
      }
      id = idList.filter((item) => item.dictCode == id)
      if (id.length > 0) {
        id = id[0].dictLabel
      } else {
        id = ''
      }
      return id
    },
    //全选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      //分页
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.getPapertable()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.getPapertable()
    },
    //打开题组详情 并传入 当前题组ID
    paperDetailsVisible(paperId) {
      this.dialogDetailsVisible = true
      this.paperId = paperId
    }
  }
}
</script>
<style lang="scss" scoped></style>
