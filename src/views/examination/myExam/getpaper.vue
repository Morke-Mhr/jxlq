<template>
  <div v-loading="loading">
    <el-row
      type="flex"
      justify="space-around"
      align="middle"
      class="getpaper_title"
    >
      <el-col :span="5">{{ tabledata.paperName }}</el-col>
      <el-col :span="5">分类：{{ tabledata.subjectName }}</el-col>
      <el-col :span="5">测验模板：{{ tabledata.paperTypeName }}</el-col>
      <el-col class="el_col_right" :span="4">
        <span class="green" v-if="tabledata.passStatus == '1'">合格</span>
        <span class="reddad" v-if="tabledata.passStatus == '0'">不合格</span>
      </el-col>
      <el-col class="el_col_right reddad" :span="4"
        >{{ tabledata.score }}分</el-col
      >
    </el-row>
    <!--  -->
    <div
      class="topicblock"
      v-for="(item, index) of tabledata.questionList"
      :key="index"
    >
      <el-row type="flex" align="middle">
        <el-tag style="margin-right: 10px">{{ item.typeName }}</el-tag>
        <el-col :span="12">
          {{ index + 1 }}/{{ tabledata.questionList.length }}题
          <span style="color: red">{{ item.score }}分</span>
        </el-col>
        <el-col :span="10" class="el_col_right">
          <el-tag :type="item.rightFlag == 1 ? 'success' : 'danger'">{{
            item.rightFlag == 1 ? '回答正确' : '回答错误'
          }}</el-tag>
        </el-col>
      </el-row>
      <div class="text_topic">{{ item.content }}</div>
      <!-- 答题选 -->
      <!-- rightFlag :0 错误 false  :1 正确 true  -->
      <div class="checkboxs" v-if="item.rightFlag == 1">
        <el-row v-for="(t, i) of item.rightAnswer" :key="i">
          <el-col :span="12">
            <el-checkbox disabled v-model="tom"
              >{{ t.optionIndex + '　　' }}{{ t.optionDescr }}</el-checkbox
            >
          </el-col>
          <el-col class="el_col_right zq" :span="12">正确答案</el-col>
        </el-row>
      </div>
      <!--  -->
      <div class="checkboxs" v-else>
        <el-row v-for="(t, i) of item.rightAnswer" :key="i">
          <el-col :span="12">
            <el-checkbox disabled v-model="tom"
              >{{ t.optionIndex + '　　' }}{{ t.optionDescr }}</el-checkbox
            >
          </el-col>
          <el-col class="el_col_right zq" :span="12">正确答案</el-col>
        </el-row>
        <el-row v-for="(v, l) of item.myAnswer" :key="l">
          <el-col :span="12">
            <el-checkbox disabled v-model="tom"
              >{{ v.optionIndex + '　　' }}{{ v.optionDescr }}</el-checkbox
            >
          </el-col>
          <el-col class="el_col_right cw" :span="12">你的选择</el-col>
        </el-row>
      </div>
      <!--  -->
      答案解析:
      <div class="text_topic bodes">{{ item.questionExplain }}</div>
    </div>
  </div>
</template>
<script>
import { getmyTestshowQuestion } from '@/api/examination/index' //查看试卷
export default {
  props: {
    paperId: {
      //题目ID
      type: String,
      default: ''
    },
    examPlanId: {
      //计划ID
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tom: false,
      loading: false,
      tabledata: {}
    }
  },
  created() {
    this.loading = true
    this.getTestquestion()
  },
  methods: {
    async getTestquestion() {
      //查询题目列表  无
      let params = {
        flag: 'view',
        examPlanId: this.examPlanId
      }
      const res = await getmyTestshowQuestion(this.paperId, params)
      this.tabledata = res
      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.el_col_right {
  text-align: right;
}
.getpaper_title {
  padding: 1rem;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.topicblock {
  margin-top: 2rem;
  min-height: 20rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  padding: 1rem;
}
.text_topic {
  margin-top: 1rem;
  font-size: 19px;
  text-indent: 2rem;
  user-select: none;
}
.optionstyle {
  margin: 0.5rem;
  font-size: 25px;
}
.bodes {
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.checkboxs {
  margin: 3rem;
  font-size: 20px;
}
.reddad {
  font-size: 28px;
  color: red;
}
.green {
  font-size: 28px;
  color: #00dd00;
}
.cw {
  color: red;
}
.zq {
  color: #70b603;
}
</style>
