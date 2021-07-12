<template>
  <div v-loading="loading">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="计划属性" name="planType">
        <examPlanAttribute ref="ruleformpPlan"></examPlanAttribute>
      </el-tab-pane>
      <el-tab-pane label="测验题组" name="paper">
        <el-table
          ref="multipleTable"
          :data="paperList"
          stripe
          tooltip-effect="light"
          style="width: 100%"
          height="calc(100vh - 380px)"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          ></el-table-column>
          <el-table-column
            label="分类"
            show-overflow-tooltip
            width="160"
            align="center"
          >
            <template slot-scope="scope">{{ scope.row.subjectName }}</template>
          </el-table-column>
          <el-table-column
            prop="disciplineName"
            label="主题"
            show-overflow-tooltip
            width="160"
            align="center"
          ></el-table-column>
          <!-- <el-table-column prop="gradeName" label="班级" width="100"></el-table-column> -->
          <el-table-column
            prop="name"
            label="题组名称"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column
            prop="duration"
            label="测验时间"
            show-overflow-tooltip
            width="110"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="answerCount"
            label="答题人数"
            width="110"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="questionNum"
            label="题目数"
            width="110"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="totalScore"
            label="总分值"
            width="110"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="testProgress"
            label="测试进度"
            width="110"
            align="center"
          ></el-table-column>
          <el-table-column label="平均得分" width="110" align="center">
            <template slot-scope="scope">{{ scope.row.scoreAvg }}</template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="测验成绩" name="achievement">
        <div class="app-container" style="border: none">
          <div class="sxTable">
            <el-button class="blue" v-has="has.refresh" @click="refresh"
              >刷新排名</el-button
            >
            <!-- 表格 -->
            <el-table
              class="hasBorder"
              :data="tableDatas"
              style="width: 100%"
              height="calc(100vh - 340px)"
              stripe
            >
              <el-table-column
                prop="xh"
                label="序号"
                width="55"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column
                prop="userName"
                label="姓名"
                width="100"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                v-for="(item, index) of tabtitle"
                :key="index"
                :label="item"
                align="center"
                show-overflow-tooltip
              >
                <el-table-column
                  label="分数"
                  align="center"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    {{ scope.row.examPlanreportCardChildVos[index].score }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="是否合格"
                  width="200"
                  align="center"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <span
                      v-if="
                        scope.row.examPlanreportCardChildVos[index].isPass ==
                        '1'
                      "
                      >合格</span
                    >
                    <span
                      v-if="
                        scope.row.examPlanreportCardChildVos[index].isPass ==
                        '0'
                      "
                      >不合格</span
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  label="排名"
                  align="center"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    {{ scope.row.examPlanreportCardChildVos[index].rank }}
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                prop="score"
                label="总分数"
                width="100"
                align="center"
                show-overflow-tooltip
              ></el-table-column>

              <el-table-column
                prop="rank"
                label="总排名"
                width="100"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import examPlanAttribute from './examPlanAttribute' //计划属性表单
import { getExamPlanID, gethandRefreshRank } from '@/api/examination/index' //根据ID获取计划详细信息  刷新排名
export default {
  components: {
    examPlanAttribute: examPlanAttribute
  },
  props: {
    examPlanId: {
      type: String
    },
    dictionaries: {
      type: Object
    },
    diAgetVisible:{
      type:Boolean
    }
  },
  data() {
    return {
      has: {
        refresh: 'exam:plan:refreshRank'
      },
      activeName: 'planType',
      paperList: [],
      multipleSelection: [],
      search: '',
      loading: false,
      tabtitle: [],
      tableDatas: []
    }
  },
  created() {
    this.loading = true
    this.diAgetVisible
    this.getExamPlan()
  },
  methods: {
    // 获取计划详情
    async getExamPlan() {
      //只查找属性
      const res = await getExamPlanID(this.examPlanId) 
      this.$refs.ruleformpPlan.getditeplanType(res, true)
       this.$refs.ruleformpPlan.fuForbid(this.diAgetVisible)
      this.loading = false
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
    async getachievement() {
      //查找题组列表
      let paramsData = {
        flag: 'paper'
      }
      const res = await getExamPlanID(this.examPlanId, paramsData)
      this.paperList = res.paperList
      for (let item of this.paperList) {
        item.subjectName = this.filet(item.subjectId, this.dictionaries.subject)
        item.disciplineName = this.filet(
          item.disciplineId,
          this.dictionaries.discipline
        )
        item.gradeName = this.filet(item.gradeId, this.dictionaries.grade)
      }

      delete res.paperList
      delete res.userList
    },
    async getreportCard() {
      //查找测验成绩
      let paramsData = {
        flag: 'reportCard'
      }
      const res = await getExamPlanID(this.examPlanId, paramsData)
      let tabtitle = []
      for (let item of res[0].examPlanreportCardChildVos) {
        tabtitle.push(item.paperName)
      }
      this.tabtitle = tabtitle
      this.tableDatas = res
      console.log(res, 888)
    },
    // 刷新排名
    async refresh() {
      let examPlanId = {
        examPlanId: this.examPlanId
      }
      const res = await gethandRefreshRank(examPlanId)
      this.$message(res)
      this.getreportCard()
    },
    // 标签栏 发生改变 触发
    handleClick(tab, event) {
      if (tab.name == 'paper') {
        this.getachievement()
      } else if (tab.name == 'achievement') {
        this.getreportCard()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
