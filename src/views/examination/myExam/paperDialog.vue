<template>
  <div v-loading="loading">
    <el-row class="bootm_margin"> </el-row>
    <!-- bge -->
    <el-table
      :data="tableData"
      height="calc(100vh - 370px)"
      tooltip-effect="light"
      stripe
      style="width: 100%"
    >
      <el-table-column
        prop="subjectName"
        label="分类"
        show-overflow-tooltip
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="disciplineName"
        label="主题"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <!-- <el-table-column prop="gradeName" label="适应班级" width="130"></el-table-column> -->
      <el-table-column
        prop="name"
        label="题组名称"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <el-table-column
        prop="passScore"
        label="及格分数"
        width="100"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <el-table-column
        prop="questionNum"
        label="题目数"
        width="100"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <el-table-column
        prop="totalScore"
        label="总分值"
        width="100"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <el-table-column
        label="测试状态"
        width="100"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="scope">{{
          scope.row.examStatus | examStatus
        }}</template>
      </el-table-column>
      <el-table-column
        prop="score"
        label="测试得分"
        width="100"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <el-table-column
        prop="score"
        label="是否合格"
        width="100"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.passStatus == '1'" style="color: green;"
            >合格</span
          >
          <span v-if="scope.row.passStatus == '0'" style="color: red;"
            >不合格</span
          >
          <span v-if="scope.row.passStatus == '2'">未考试</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="reexamCount"
        label="可考试次数"
        width="150"
        show-overflow-tooltip
        align="center"
      ></el-table-column>

      <el-table-column label="操作" v-if="stay" width="110" align="center">
        <template>
          <p>测验还未开始</p>
        </template>
      </el-table-column>
      <el-table-column v-else label="操作" width="110" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            v-if="scope.row.examStatus == 0"
            :disabled="scope.row.reexamCount == '0'"
            v-has="has.ks"
            @click="startexam(scope.row.paperId)"
            >参加考试</el-button
          >
          <el-button
            type="text"
            v-if="scope.row.reexamStatus == '1'"
            v-has="has.ks"
            @click="startexam(scope.row.paperId)"
            >补考</el-button
          >

          <el-button
            type="text"
            v-if="scope.row.examStatus == 1"
            v-has="has.ck"
            @click="getexam(scope.row.paperId, examPlanId)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-row class="botton_style">
      <el-col>
        <el-row class="botton_style_row">
          <el-col :span="3">总题组数：{{ totalNumber }}</el-col>
          <el-col :span="3">已完成测试：{{ Completed }}</el-col>
        </el-row>
        <el-row class="botton_style_row">
          <el-col :span="3">总分值：{{ totalScore }}分</el-col>
          <el-col :span="3">总得分：{{ totalScorede }}分</el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getSelectType } from '@/api/examination/index' //字典
import { getTestPaperList } from '@/api/examination/index' //计划题组

export default {
  props: {
    examPlanId: {
      //测验计划ID
      type: String,
      default: ''
    },
    stay: {
      //待测验状态
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      has: {
        ks: 'exam:mtTest:startQuestion',
        ck: 'exam:mtTest:showQuestion'
      },
      search: '',
      totalNumber: '',
      Completed: '',
      totalScore: '',
      totalScorede: '',
      tableData: [],
      dictionaries: [],
      loading: false
    }
  },
  created() {
    this.loading = true
    console.log(this.stay)
    this.getexampaper()
  },
  methods: {
    monisju() {
      //计算 题组数 和 分值
      this.totalNumber = this.tableData.length
      this.Completed = this.tableData.filter(
        (item) => item.examStatus == 1
      ).length
      this.totalScore = 0
      let totlefen = this.tableData.map((item) => {
        this.totalScore = item.totalScore + this.totalScore
      })
      this.totalScorede = 0
      let totlefende = this.tableData.map((item) => {
        if (item.score === '' || !item.hasOwnProperty('score')) {
          return
        }
        this.totalScorede = parseInt(item.score) + this.totalScorede
      })
      this.loading = false
    },
    // 查询要考试的 题组
    async getexampaper() {
      const res = await getTestPaperList(this.examPlanId)
      this.dictionaries.paperType = await getSelectType('exam_paperType')
      this.dictionaries.subject = await getSelectType('exam_subject')
      this.dictionaries.discipline = await getSelectType('exam_discipline')
      this.dictionaries.grade = await getSelectType('exam_grade')

      for (let item of res) {
        //根据当前id对比字典 获取当前名称
        item.subjectName = this.filet(item.subjectId, this.dictionaries.subject)
        item.paperTypeName = this.filet(
          item.paperTypeId,
          this.dictionaries.paperType
        )
        item.disciplineName = this.filet(
          item.disciplineId,
          this.dictionaries.discipline
        )
        item.gradeName = this.filet(item.gradeId, this.dictionaries.grade)
      }
      console.log(this.tableData)
      this.tableData = res
      this.monisju()
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
    // 开始考试
    startexam(paperId) {
      this.$emit('startexam', paperId)
    },
    // 查看结果
    getexam(paperId, examPlanId) {
      this.$emit('getexam', paperId, examPlanId)
    }
  }
}
</script>
<style lang="scss" scoped>
.bootm_margin {
  margin-bottom: 2rem;
}
.botton_style {
  margin-top: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.botton_style_row {
  margin: 1rem 0;
  padding-left: 1rem;
}
</style>
