<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane
        label="题组属性"
        name="papertype"
        v-loading="papertypeLoading"
      >
        <!-- 题组属性 -->
        <papertype ref="papertype"></papertype>
      </el-tab-pane>
      <el-tab-pane label="题目列表" name="topiclist">
        <!-- 题目列表 -->
        <el-table
          :data="paperdel.questionList"
          tooltip-effect="light"
          stripe
          style="width: 100%"
          height="calc(100vh - 380px)"
        >
          <el-table-column label="题号" width="55" align="center">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column
            prop="typeName"
            label="题型"
            width="100"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column
            prop="content"
            label="题目"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="subjectName"
            label="分类"
            width="160"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column
            prop="disciplineName"
            label="主题"
            width="160"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <!-- <el-table-column prop="gradeName" label="适应班级" width="110"></el-table-column> -->
          <el-table-column
            prop="difficultDegreeName"
            label="难度"
            width="110"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column
            prop="score"
            label="分值"
            width="100"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column label="正确率" width="110" show-overflow-tooltip align="center">
            <template slot-scope="scope"
              >{{ scope.row.rightProportion }}%</template
            >
          </el-table-column>
        </el-table>
        <el-row class="choice_bottom" type="flex" align="middle">
          <el-col :span="16">
            <el-row type="flex" align="middle" :gutter="10">
              <el-col :span="5">题目数{{ questionListLength }}题</el-col>
              <el-col
                :span="3"
                v-for="(item, index) of questionType"
                :key="index"
              >
                {{ item.dictLabel }}
                <span class="rdenumber">{{
                  item.hasOwnProperty('questionType')
                    ? item.questionType.length
                    : 0
                }}</span
                >题
              </el-col>
            </el-row>
            <el-row type="flex" align="middle" :gutter="10">
              <el-col :span="5">总分值{{ paperdel.totalScore }}分</el-col>
              <el-col
                :span="3"
                v-for="(item, index) of questionType"
                :key="index"
              >
                {{ item.dictLabel }}
                <span class="rdenumber">{{
                  item.hasOwnProperty('totalScore') ? item.totalScore : 0
                }}</span
                >分
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8" style="text-align: right;">
            <!-- <el-button type="primary">题组预览</el-button> -->
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="测验记录" name="testRecord">
        <!-- 测验记录-->
        <el-table
          :data="paperdel.planList"
          tooltip-effect="light"
          stripe
          style="width: 100%"
          height="calc(100vh - 380px)"
        >
          <el-table-column label="起止时间" show-overflow-tooltip align="center">
            <template slot-scope="scope"
              >{{ scope.row.startTime }}至{{ scope.row.endTime }}</template
            >
          </el-table-column>
          <el-table-column
            prop="name"
            label="测验名称"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column
            prop="joinUserCount"
            label="测验人数"
            width="150"
            align="center"
          ></el-table-column>
          <el-table-column label="测验类型" width="150" align="center">
            <template slot-scope="scope">{{ scope.row.planTypeName }}</template>
          </el-table-column>
          <el-table-column
            prop="planStatusText"
            label="测验状态"
            width="150"
            align="center"
          ></el-table-column>
          <el-table-column label="平均得分" width="150" align="center">
            <template slot-scope="scope">{{
              scope.row.avgScore.toFixed(2)
            }}</template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getPaperId } from '@/api/examination/index' //根据ID查询题组信息信息
import { getSelectType } from '@/api/examination/index' //字典

import papertype from './papertype' //题组属性

export default {
  props: ['paperId'],
  components: {
    papertype: papertype
  },
  data() {
    return {
      activeName: 'papertype', //当前标签页
      papertypeLoading: false, //属性加载
      processRecordLoading: false, //流程记录加载
      paperdel: {},
      questionType: [],
      questionListLength: '',
      paperType: [], //字典获取的值 班级 科目 分类 ...
      subject: [],
      grade: [],
      discipline: [],
      difficultDegree: [],
      planType: [],
      step: []
    }
  },
  created() {
    this.papertypeLoading = true
    this.getIdPaper()
  },
  methods: {
    async getIdPaper() {
      //查询详情

      const res = await getPaperId(this.paperId)

      this.$refs.papertype.paperDetails(res)
      this.paperdel = res
      this.questionListLength = this.paperdel.questionList.length
      this.questionType = await getSelectType('exam_type') //题目类型
      this.paperType = await getSelectType('exam_paperType') //题组模板
      this.subject = await getSelectType('exam_subject') //分类
      this.grade = await getSelectType('exam_grade') //班级
      this.difficultDegree = await getSelectType('exam_difficultDegree') //难度
      this.discipline = await getSelectType('exam_discipline') //科目
      this.planType = await getSelectType('exam_planType') //测验类型

      for (let item of this.paperdel.questionList) {
        item.subjectName = this.filet(item.subjectId, this.subject)
        item.gradeName = this.filet(item.gradeId, this.grade)
        item.disciplineName = this.filet(item.disciplineId, this.discipline)
        item.typeName = this.filet(item.typeId, this.questionType)
        item.difficultDegreeName = this.filet(
          item.difficultDegreeId,
          this.difficultDegree
        )
      }

      for (let t of this.paperdel.planList) {
        //测验记录
        if (!(JSON.stringify(t) == '{}')) {
          t.planTypeName = this.filet(t.planTypeId, this.planType)
        }
      }
      this.separateTypeScore()
      this.papertypeLoading = false
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
    separateTypeScore() {
      for (let item of this.questionType) {
        item.questionType = this.paperdel.questionList.filter(
          (v) => v.typeId == item.dictCode
        )

        let Score = 0 //计算 对应题型的分数
        for (let t of item.questionType) {
          if (t.hasOwnProperty('score')) {
            if (t.score == '') {
              t.score = 0
            }
            Score = t.score + Score
          }
        }
        item.totalScore = Score
      }
    },

    //   切换tab
    handleClick() {}
  }
}
</script>
<style lang="scss">
.choice_bottom {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 0.4rem;
  margin: 1rem;
}
.tag {
  margin: 1rem;
}
</style>
