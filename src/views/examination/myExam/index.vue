<template>
  <div class="safe_main">
    <div class="sxForm">
      <!-- 搜索头 -->
      <el-form ref="form" :model="form" :inline="true" class="demo-form-inline">
        <el-form-item label="测验类型">
          <el-select
            v-model="form.planTypeId"
            clearable
            placeholder="请选择测验类型"
          >
            <!-- exam_paperType -->
            <el-option
              v-for="(item, index) of dictionaries.planType"
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
    <div class="sxTable">
      <el-table
        v-loading="loading"
        :data="tableData"
        tooltip-effect="light"
        height="calc(100vh - 370px)"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column
          align="center"
          type="selection"
          width="55"
        ></el-table-column>
        <el-table-column align="center" label="测验起止时间" width="400">
          <template slot-scope="scope"
            >{{ scope.row.startTime }}至{{ scope.row.endTime }}</template
          >
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="测验名称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          prop="paperCount"
          label="题组数量"
          width="200"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="planTypeName"
          label="测验类型"
          width="200"
        ></el-table-column>

        <el-table-column align="center" label="状态" width="120">
          <template slot-scope="scope">{{
            scope.row.status == 0
              ? '未开始'
              : scope.row.status == 1
              ? '测验中'
              : '已结束'
          }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 0"
              @click="getpaper(scope.row.examPlanId, true)"
              type="text"
              >查看题组</el-button
            >
            <el-button
              v-else-if="scope.row.status == 2"
              v-has="has.ck"
              @click="getschoolreport(scope.row.examPlanId)"
              type="text"
              >查看成绩</el-button
            >
            <el-button
              v-else-if="scope.row.status == 1"
              @click="getpaper(scope.row.examPlanId)"
              type="text"
              >参加测试</el-button
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
    <!-- 查看题组  -->
    <el-dialog
      title="测验题组"
      :close-on-click-modal="false"
      v-if="dialogpaper"
      :visible.sync="dialogpaper"
      custom-class="large"
    >
      <paperDialog
        @startexam="startexams"
        @getexam="getexams"
        :stay="stay"
        :examPlanId="examPlanId"
      ></paperDialog>
      <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="dialogpaper = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 答题 -->
    <el-dialog
      :close-on-click-modal="false"
      v-if="dialogtopic"
      :visible.sync="dialogtopic"
      :before-close="handleClose"
      custom-class="small"
    >
      <topicDialog
        ref="topicDialog"
        @completeExam="completeExam"
        :examPlanId="examPlanId"
        :paperId="paperId"
      ></topicDialog>
      <span slot="footer" class="dialog-footer">
        <el-col :span="12" style="text-align: center;">
          <el-button class="tBtn" @click="$refs.topicDialog.lastQuestion()"
            >上一题</el-button
          >
        </el-col>
        <el-col :span="12" style="text-align: center;">
          <el-button class="tBtn" @click="$refs.topicDialog.nextQuestion()"
            >下一题</el-button
          >
        </el-col>
      </span>
    </el-dialog>
    <!-- 查看试卷 -->
    <el-dialog
      title="考试详情"
      :close-on-click-modal="false"
      :visible.sync="dialoggetpaper"
      v-if="dialoggetpaper"
      custom-class="small"
    >
      <getpaper :paperId="paperId" :examPlanId="examPlanId"></getpaper>
      <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="dialoggetpaper = false"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
    <!-- 查询成绩单 -->
    <el-dialog
      title="成绩详情"
      :close-on-click-modal="false"
      :visible.sync="dialogquery"
      v-if="dialogquery"
      custom-class="small"
    >
      <schoolReport
        @getpaperexam="getexams"
        :examPlanId="examPlanId"
      ></schoolReport>
      <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="dialogquery = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getExamMyTest } from '@/api/examination/index' //查询我的测验计划
import { getSelectType } from '@/api/examination/index' //字典
import paperDialog from './paperDialog' //查看题组
import topicDialog from './topicDialog' //答题
import getpaper from './getpaper' //查看试卷
import schoolReport from './schoolReport' //查看试卷
// getExamMyTest
export default {
  components: {
    paperDialog: paperDialog, //查看题组
    topicDialog: topicDialog, //答题
    getpaper: getpaper, //查看试卷
    schoolReport: schoolReport //成绩单
  },
  data() {
    return {
      has: {
        ck: 'exam:myPlanScore:list',
        getplan: 'exam:plan:query'
      },
      currentPage: 1, //当前页数
      total: 0, //总条目
      pageSize: 10,
      tableData: [],
      multipleSelection: [], //已选中数组
      dialogpaper: false, // 查看题组
      dialogtopic: false, //答题
      dialoggetpaper: false, //查看试卷
      dialogquery: false, //查询
      examPlanId: '', //当前测验ID
      paperId: '', //当前测验下 题组ID
      stay: '', //是否是待测验状态
      trainplanId: this.$route.query.trainplanId,
      loading: false,
      dictionaries: {
        //     status:[
        // { dictLabel: "禁用", dictCode: 0 },
        // { dictLabel: "待提交", dictCode: 1 },
        // { dictLabel: "已提交", dictCode: 4 }
        // ],
      },
      form: {}
    }
  },
  created() {
    // this.loading = true;
    this.getselect()
  },
  methods: {
    //查询我的测验计划
    async getmyexamlist() {
      let params = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        planTypeId: this.form.planTypeId,
        startTime: this.form.startTime,
        endTime: this.form.endTime,
        status: this.form.status,
        trainplanId: this.trainplanId
      }
      const res = await getExamMyTest(params)
      for (let item of res.rows) {
        item.planTypeName = this.filet(
          item.planTypeId,
          this.dictionaries.planType
        )
        item.status = this.isDuringDate(item.startTime, item.endTime) // 0：未开始 1：测验中 2：已结束
      }
      console.log(res.rows)
      this.tableData = res.rows
      this.total = res.total
      this.loading = false
    },
    async getselect() {
      this.dictionaries.planType = await getSelectType('exam_planType')
      this.getmyexamlist()
    },
    // 查询
    query() {
      this.pageSize = 10
      this.currentPage = 1
      this.getmyexamlist()
    },
    // 重置
    Reset() {
      this.form = {}
      this.pageSize = 10
      this.currentPage = 1
      this.getmyexamlist()
    },
    // 过滤
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
    // 判断状态
    isDuringDate(beginDateStr, endDateStr) {
      //[beginDateStr]:[开始时间]  [endDateStr]:[结束时间]
      var curDate = new Date(),
        beginDate = new Date(beginDateStr),
        endDate = new Date(endDateStr)
      if (curDate >= beginDate && curDate <= endDate) {
        //当前时间在起止时间内
        return 1
      } else if (curDate < beginDate) {
        //当前时间小于开始时间   前
        return 0
      } else {
        //既不在起止时间内 又不在起止时间前   后
        return 2
      }
    },
    // 查看成绩按钮
    getschoolreport(examPlanId) {
      this.examPlanId = examPlanId + ''
      this.dialogquery = true
    },
    // 开始考试按钮
    startexams(paperId) {
      //题组ID
      this.paperId = paperId + ''
      this.dialogpaper = false
      this.dialogtopic = true
    },
    // 完成考试
    completeExam() {
      this.dialogtopic = false
    },
    // 关闭考试按钮
    handleClose() {
      this.$confirm('中途退出，将要重新做答！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.dialogtopic = false
          this.$message({
            message: '退出成功',
            type: 'success'
          })
        })
        .catch(() => {})
    },
    // 查看试卷
    getexams(paperId, examPlanId) {
      this.paperId = paperId + ''
      this.examPlanId = examPlanId
      this.dialogpaper = false
      this.dialoggetpaper = true
    },

    // 题组
    getpaper(examPlanId, stay) {
      console.log(examPlanId)
      this.examPlanId = examPlanId + ''
      this.stay = stay ? true : false
      this.dialogpaper = true
    },
    //全选
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    handleSizeChange(val) {
      //分页
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.getmyexamlist()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.getmyexamlist()
    }
  }
}
</script>
<style lang="scss" scoped>
.task-header {
  margin: 1.5rem;
}
.task-header-sort {
  display: flex;
}
.task-header-sort > div {
  width: 15%;
  height: 100%;
  align-self: center;
  cursor: pointer;
}
</style>
