<template>
  <div v-loading="loading">
    <el-row type="flex" align="middle">
      <!-- 左边 -->
      <el-col :span="18">
        <el-row>
          <el-col :span="8">
            <div>
              <img
                src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
                class="headimg"
              />
            </div>
          </el-col>
          <el-col :span="10">
            <div class="headimg">
              <h2>{{ tableData.examPlanName }}</h2>
            </div>
          </el-col>
          <!-- <el-col :span="8">
            <div>
              <h3
                v-if="tableData.paperScoreList[0].passStatus == '1'"
                style="color: #ff0000"
              >
                恭喜您通过考试，成绩合格！
              </h3>
              <h3
                v-if="tableData.paperScoreList[0].passStatus == '0'"
                style="color: #00ffff"
              >
                对不起，您的成绩不合格！
              </h3>
            </div>
          </el-col> -->
        </el-row>
      </el-col>
      <el-col :span="6" class="el_col_right">
        <p class="reddad">{{ tableData.score }}</p>
        <p class="hiend">第{{ tableData.rank }}名</p>
      </el-col>
    </el-row>
    <!-- 成绩栏 -->
    <el-table
      :data="tableData.paperScoreList"
      style="width: 100%"
      height="calc(100vh - 370px)"
      stripe
    >
      <el-table-column
        label="序号"
        width="55"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column
        prop="paperName"
        label="题组名称"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <el-table-column
        prop="score"
        color="red"
        label="得分"
        width="100"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <el-table-column
        prop="rank"
        label="是否合格"
        width="100"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.passStatus == '1'">合格</span>
          <span v-if="scope.row.passStatus == '0'">不合格</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="rank"
        label="排名"
        width="100"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <el-table-column label="操作" width="110" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="gepaper(scope.row.paperId)"
            >查看试卷</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getTestPlanScore } from '@/api/examination/index' //计划成绩
import { getSelectType } from '@/api/examination/index' //字典

export default {
  props: {
    examPlanId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      tableData: {
        score: '359',
        rank: '18',
        paperScoreList: [
          {
            subjectId: '1',
            subjectName: '代数',
            score: '78',
            rank: '52'
          },
          {
            subjectId: '2',
            subjectName: '语文',
            score: '88',
            rank: '43'
          },
          {
            subjectId: '3',
            subjectName: '英语',
            score: '68',
            rank: '95'
          },
          {
            subjectId: '4',
            subjectName: '历史',
            score: '98',
            rank: '2'
          }
        ]
      },
      subject: []
    }
  },
  created() {
    // this.loading = true;
    this.getTestScore()
  },
  methods: {
    //查看计划各科成绩  无
    async getTestScore() {
      const res = await getTestPlanScore(this.examPlanId) //题组名称 题组ID
      this.subject = await getSelectType('exam_subject')
      for (let item of res.paperScoreList) {
        //根据当前id对比字典 获取当前名称
        item.subjectName = this.filet(item.subjectId, this.subject)
      }
      console.log(res)
      this.tableData = res
      this.loading = false
    },
    // 查看试卷
    gepaper(Id) {
      this.$emit('getpaperexam', Id, this.examPlanId)
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
    }
  }
}
</script>
<style lang="scss" scoped>
.el_col_right {
  text-align: right;
}
.reddad {
  font-size: 28px;
  color: red;
}
.hiend {
  font-size: 18px;
  color: #000;
  font-weight: 600;
}
.headimg {
  width: 80%;
  height: 80%;
}
</style>
