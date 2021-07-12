<template>
  <div v-loading="loading">
    <el-row>
      <el-col :span="5">{{ res.disciplineName }}</el-col>
      <el-col :span="5">科目：{{ res.subjectName }}</el-col>
      <!-- <el-col :span="5">年级：{{res.gradeName}}</el-col> -->
    </el-row>
    <!-- 倒计时 -->
    <el-row class="el_row_mag" type="flex" align="middle">
      <el-col :span="12">
        <h2>倒计时：{{ h }}:{{ m }}:{{ s }}</h2>
      </el-col>
      <el-col :span="12" class="el_col_right">
        <el-button @click="handPapers">交卷</el-button>
      </el-col>
    </el-row>
    <div class="topicblock" v-loading="questionAnswer">
      <el-row>
        <el-col :span="12">
          <el-tag>{{ currentTopic.typeName }}</el-tag>
        </el-col>
        <el-col :span="12" class="el_col_right">
          {{ currentTopicIndex + 1 }}/{{ res.emPaperQuestions.length }}题
          <span
            style="color: red"
          >{{ currentTopic.score }}分</span>
        </el-col>
      </el-row>
      <div class="text_topic">{{ currentTopic.content }}</div>
      <!-- 答题选 -->
      <div>
        <el-row class="eltextareatop" v-if="currentTopic.typeId == '1303595952662134785'">
          <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="currentTopic.answerList"></el-input>
        </el-row>
        <el-row v-else>
          <el-radio-group v-model="currentTopic.answerList" v-if="currentTopic.typeName == '单选题'">
            <el-row
              v-for="(item, index) of currentTopic.questionOptionsList"
              :key="index"
              class="optionstyle"
            >
              <el-radio :label="item.answerId">
                {{
                item.optionIndex + ' ' + item.optionDescr
                }}
              </el-radio>
            </el-row>
          </el-radio-group>
          <el-checkbox-group v-model="currentTopic.answerList" v-else>
            >
            <el-row
              v-for="(item, index) of currentTopic.questionOptionsList"
              :key="index"
              class="optionstyle"
            >
              <el-checkbox :label="item.answerId">
                {{
                item.optionIndex + ' ' + item.optionDescr
                }}
              </el-checkbox>
            </el-row>
          </el-checkbox-group>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import { getSelectType } from "@/api/examination/index"; //字典
import { getmyTeststartQuestion } from "@/api/examination/index"; //查找试卷题目
import { postMyTest } from "@/api/examination/index"; //交卷

export default {
  props: {
    paperId: {
      //题组ID
      type: String,
      default: ""
    },
    examPlanId: {
      //计划ID
      type: String,
      default: ""
    }
  },
  data() {
    return {
      res: {},
      type: [], //题型
      currentTopic: {}, //当前题目对象
      currentTopicIndex: 0, //当前题目在所有题目里的下标
      loading: false, //加载所有题目数据
      questionAnswer: false, //单个题目数据
      h: "#",
      m: "#",
      s: "#",
      mytimes: null,
      arrtime: 600000
    };
  },
  created() {
    // this.loading = true;
    this.getSelect();
  },
  mounted() {
    // window.clearInterval(this.mytimes);
    let date = new Date(); //开始考试时间
    this.beginTime =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date
        .getDate()
        .toString()
        .padStart(2, "0") +
      " " +
      date
        .getHours()
        .toString()
        .padStart(2, "0") +
      ":" +
      date
        .getMinutes()
        .toString()
        .padStart(2, "0") +
      ":" +
      date
        .getSeconds()
        .toString()
        .padStart(2, "0");
  },
  beforeDestroy() {
    window.clearInterval(this.mytimes);
  },
  methods: {
    // 获取字典
    async getSelect() {
      this.type = await getSelectType("exam_type");
      let parm = {
        flag: "goTest"
      };
      const res = await getmyTeststartQuestion(this.paperId, parm);
      for (let item of res.emPaperQuestions) {
        //获取返回结果中的 题目列表
        item.answerList = []; //给每个题目中新增一个 用户选择答案ID的数组   接口好了之后 直接把下面的for解开即可
      }
      // console.log(res)
      for (let item of res.emPaperQuestions) {
        //过滤题型
        item.typeName = this.filet(item.typeId, this.type);
      }
      console.log(res,22222)
      if (res.minute != 0) {
        // 考试截止时间
        let date = new Date();
        let now = date.getTime();
        res.minute = parseInt(now) + parseInt(res.minute) * 60 * 1000;
        // 开始倒计时
        this.countTime();
      }
      this.res = res;
      this.currentTopic = this.res.emPaperQuestions[this.currentTopicIndex];
      this.loading = false;
    },
    // 过滤
    filet(id, idList) {
      if (!Array.isArray(idList)) {
        return;
      }
      id = idList.filter(item => item.dictCode == id);
      if (id.length > 0) {
        id = id[0].dictLabel;
      } else {
        id = "";
      }
      return id;
    },
    // 上一题
    lastQuestion() {
      if (this.currentTopicIndex > 0) {
        this.currentTopicIndex--;
        this.questionAnswer = true;
        this.currentTopic = this.res.emPaperQuestions[this.currentTopicIndex];
        this.questionAnswer = false;
      } else {
        this.$message({
          message: "没有上一题了",
          type: "warning"
        });
      }
    },
    // 下一题
    nextQuestion() {
      let type = this.currentTopic.typeId;
      if (this.currentTopic.answerList.length == 0) {
        //判断选择答案是否为空
        if (type == "1303595952662134785") {
          this.$message({
            message: "请输入答案",
            type: "warning"
          });
        } else {
          this.$message({
            message: "请选择答案",
            type: "warning"
          });
        }
        return;
      }
      if (type == "1303139283352211457") {
        if (Array.isArray(this.currentTopic.answerList)) {
          this.$message({
            message: "此题是单选题，只能选择一个答案",
            type: "warning"
          });
          return;
        }
      }
      if (type == "1303139341036474370") {
        if (this.currentTopic.answerList.length < 2) {
          this.$message({
            message: "此题是多选题，最少选择两个答案",
            type: "warning"
          });
          return;
        }
      }
      if (type == "1303595952662134785") {
        // if (this.currentTopic.answerList=="") {
        //   this.$message({
        //     message: "请输入答案",
        //     type: "warning"
        //   });
        //   return;
        // }
      }
      if (this.res.emPaperQuestions.length > this.currentTopicIndex + 1) {
        //判断是否是最后一题
        this.currentTopicIndex++;
        this.questionAnswer = true;
        this.currentTopic = this.res.emPaperQuestions[this.currentTopicIndex];
        this.questionAnswer = false;
      } else {
        this.$message({
          message: "已经后一题了",
          type: "warning"
        });
      }
    },
    // 交卷
    handPapers() {
      this.$confirm("确认无误，提交试卷", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.handPaperSubmit();
        })
        .catch(() => {
          return;
        });
    },
    // 提交
    async handPaperSubmit() {
      let enddate = new Date(); //交卷时间
      let endTime =
        enddate.getFullYear() +
        "-" +
        (enddate.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        enddate
          .getDate()
          .toString()
          .padStart(2, "0") +
        " " +
        enddate
          .getHours()
          .toString()
          .padStart(2, "0") +
        ":" +
        enddate
          .getMinutes()
          .toString()
          .padStart(2, "0") +
        ":" +
        enddate
          .getSeconds()
          .toString()
          .padStart(2, "0");
      let parms = {};
      let questionAnswerList = [];
      for (let item of this.res.emPaperQuestions) {
        //将 考试结果转换成后台接收的格式
        let v = {};
        v.questionId = item.questionId;
        v.answers = Array.isArray(item.answerList)
          ? item.answerList
          : [item.answerList];
        questionAnswerList.push(v);
      }
      parms.examPlanId = this.examPlanId; //计划ID
      parms.paperId = this.paperId; //  试卷ID
      parms.paperName = this.res.name; //试卷名称
      parms.beginTime = this.beginTime; //开始时间
      parms.endTime = endTime; //结束时间
      parms.questionAnswerList = questionAnswerList; //做答列表
      // 交卷
      const res = await postMyTest(parms);
      // this.$message(res);
      window.clearInterval(this.mytimes);
      this.$message({
        message: res,
        type: "warning"
      });

      this.$emit("completeExam");
    },
    // 倒计时
    countTime() {
      //获取当前时间
      var date = new Date();
      var now = date.getTime();
      //设置截止时间
      var end = this.res.minute;
      //时间差
      var leftTime = end - now;
      //定义变量 d,h,m,s保存倒计时的时间
      if (leftTime >= 0) {
        // this.d = Math.floor(leftTime / 1000 / 60 / 60 / 24) //天数我没用到，暂且写上
        this.h = Math.floor((leftTime / 1000 / 60 / 60) % 24);
        this.m = Math.floor((leftTime / 1000 / 60) % 60);
        this.s = Math.floor((leftTime / 1000) % 60);
      }
      if (leftTime <= this.arrtime) {
        this.$message({
          message: "距离考试结束小于10分钟，请注意时间！",
          type: "warning"
        });
        this.arrtime = -1000;
      }
      this.mytimes = setTimeout(this.countTime, 1000);
      if (leftTime <= 0) {
        this.handPaperSubmit();
        window.clearInterval(this.mytimes);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.el_col_right {
  text-align: right;
}
.el_row_mag {
  margin: 1rem 0;
}
.topicblock {
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
  font-size: 30px;
}
.buttom_botton {
  text-align: center;
  margin-top: 2rem;
}
.eltextareatop {
  margin-top: 1rem;
}
</style>
