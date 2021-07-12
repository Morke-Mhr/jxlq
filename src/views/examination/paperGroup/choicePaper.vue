<template>
  <div v-loading="loading">
    <div class="choice_title">
      <el-row type="flex" align="middle">
        <el-col :span="22">
          <h2>{{ papertype.name }}</h2>
        </el-col>
        <el-col :span="2">
          <el-button type="text" @click="edittype">
            编辑属性
            <i class="el-icon-caret-bottom"></i>
          </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <!-- <el-tag effect="dark">{{ papertype.grade.dictLabel }}</el-tag> -->
          <el-tag effect="dark">{{ papertype.paperType.dictLabel }}</el-tag>
          <el-tag effect="dark">{{ papertype.duration }}分钟</el-tag>
          <el-tag effect="dark">{{ papertype.totalScore }}分</el-tag>
          <el-tag effect="dark">{{ papertype.questionNum }}题</el-tag>
          <el-tag effect="dark">{{ papertype.passScore }}分合格</el-tag>
        </el-col>
      </el-row>
    </div>

    <div class="chice_button_right">
      <el-button class="blue" style="margin-bottom: 0" @click="manualseTopic"
        >手动选题</el-button
      >
    </div>
    <!-- 手动选题 -->
    <el-dialog
      custom-class="large"
      title="题目列表"
      :visible.sync="innerVisible"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="safe_main">
        <div class="sxForm">
          <!-- 搜索头 -->
          <el-form
            ref="form"
            :model="form"
            :inline="true"
            class="demo-form-inline"
          >
            <el-form-item label="题目标题" prop="kjName">
              <el-input
                v-model="form.content"
                show-word-limit
                placeholder="请输入题目标题"
              />
            </el-form-item>
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
            <el-form-item label="题型">
              <el-select
                v-model="form.questionTypeId"
                clearable
                placeholder="请选择题型"
              >
                <el-option
                  v-for="(item, index) of dictionaries.questionTypeList"
                  :key="index"
                  :label="item.dictLabel"
                  :value="item.dictCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <div class="btnCont">
              <el-button class="chaxun" @click="query">查询</el-button>
              <el-button class="chongzhi" @click="Reset">重置</el-button>
            </div>
          </el-form>
        </div>
        <div class="sxTable">
          <el-table
            :data="manualSelected"
            height="calc(100vh - 380px)"
            @selection-change="manualSelected_handleSelectionChange"
            tooltip-effect="light"
            style="width: 100%"
            stripe
            v-loading="manualLoading"
          >
            <el-table-column
              type="selection"
              width="55"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="subjectName"
              label="分类"
              show-overflow-tooltip
              width="150"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="disciplineName"
              label="主题"
              show-overflow-tooltip
              width="150"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="typeName"
              label="题型"
              width="110"
              align="center"
            ></el-table-column>
            <!-- <el-table-column
                      prop="gradeName"
                      label="适应班级"
                      width="130"
                        ></el-table-column>-->
            <el-table-column
              prop="difficultDegreeName"
              label="难度等级"
              width="110"
              align="center"
            ></el-table-column>
            <el-table-column label="题目" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.content }}</template>
            </el-table-column>
            <el-table-column label="正确率" width="110" align="center">
              <template slot-scope="scope">
                {{
                  scope.row.rightProportion
                    ? scope.row.rightProportion + "%"
                    : "暂无"
                }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-row class="choice_bottom" type="flex" align="middle">
          <el-col :span="16">
            <el-row type="flex" align="middle" :gutter="10">
              <el-col :span="5">
                题目数
                <span class="rdenumber"
                  >{{ manualSelected_multipleSelection.length }}题</span
                >
                /{{ manualSelected.length }}题
              </el-col>
              <el-col
                :span="3"
                v-for="(item, index) of manualQuestionType"
                :key="index"
              >
                {{ item.dictLabel }}
                <span class="rdenumber">
                  {{
                    item.hasOwnProperty("manualquestionType")
                      ? item.manualquestionType.length
                      : 0
                  }} </span
                >题
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="innerVisible = false">返回</el-button>
        <el-button class="tBtn" @click="manualdetermine">确定</el-button>
      </span>
    </el-dialog>

    <!-- 选题列表 -->
    <el-table
      :data="SelectedTopicList"
      height="calc(100vh - 380px)"
      tooltip-effect="light"
      @selection-change="SelectedTopicList_handleSelectionChange"
      style="width: 100%"
      stripe
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      ></el-table-column>
      <el-table-column label="题号" width="90" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column
        prop="typeName"
        label="题型"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="subjectName"
        label="分类"
        show-overflow-tooltip
        width="160"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="disciplineName"
        label="主题"
        show-overflow-tooltip
        width="160"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="difficultDegreeName"
        label="难度等级"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column label="题目" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.content }}</template>
      </el-table-column>
      <el-table-column label="分值" width="100" align="center">
        <template slot-scope="scope">
          <el-row type="flex" align="middle" :gutter="7">
            <el-col :span="19">
              <el-input
                :inline="true"
                onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
                @mousewheel.native.prevent
                type="number"
                v-model.number="scope.row.score"
                @change="modifyScore"
              ></el-input>
            </el-col>
            <el-col :span="4">分</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="canceltopic(scope.row.questionId)"
            >取消</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <p class="tips">(请先选好题目 再修改分值)</p>
    <!-- 提交 -->
    <el-row class="choice_bottom" type="flex" align="middle">
      <el-col :span="16">
        <el-row type="flex" align="middle" :gutter="10">
          <el-col :span="5">
            题目数
            <span class="rdenumber">{{ SelectedTopicList.length }}题</span>
            /{{ papertype.questionNum }}题
          </el-col>
          <el-col :span="3" v-for="(item, index) of questionType" :key="index">
            {{ item.dictLabel }}
            <span class="rdenumber">
              {{
                item.hasOwnProperty("questionType")
                  ? item.questionType.length
                  : 0
              }} </span
            >题
          </el-col>
        </el-row>
        <el-row type="flex" align="middle" :gutter="10">
          <el-col :span="5">
            总分值
            <span class="rdenumber">{{ nowScore }}分</span>
            /{{ papertype.totalScore }}分
          </el-col>
          <el-col :span="3" v-for="(item, index) of questionType" :key="index">
            {{ item.dictLabel }}
            <span class="rdenumber">
              {{
                item.hasOwnProperty("totalScore") ? item.totalScore : 0
              }} </span
            >分
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  getSelectedTopicList,
  postTest,
  putTest,
  getExamType,
} from "@/api/examination/index"; //选题列表
import { getSelectType } from "@/api/examination/index"; //字典

export default {
  props: {
    dictionaries: {
      default: {},
    },
  },
  data() {
    return {
      search: "",
      papertype: {}, //属性页面填写的值
      nowScore: 0, // 现在多少分
      loading: false, //加载
      innerVisible: false, //手动选题弹出层
      manualLoading: false, // 手动选题 加载
      questionType: [], //题型列表
      manualQuestionType: [],
      choiceQuestion: 0, //已选题型
      judgeQuestion: 0,
      MultipleChoiceQuestion: 0,
      blanksQuestion: 0,

      form: {},
      manualSelected: [],
      SelectedTopicList: [],
      SelectedTopicList_multipleSelection: [], //添加题组 已选中数组
      manualSelected_multipleSelection: [], //手动选题 已选中数组
    };
  },
  created() {
    this.$emit("created");
    this.getSelect();
  },
  methods: {
    async getSelect() {
      this.questionType = await getSelectType("exam_type");
      this.difficultDegree = await getSelectType("exam_difficultDegree");
      this.papertype = JSON.parse(sessionStorage.getItem("papertype"));
      this.dictionaries.questionTypeList = await getExamType();
      console.log("questionTypeList", this.dictionaries.questionTypeList);
      if (this.papertype.paperId) {
        //判断是编辑还是新增
        this.SelectedTopicList = this.papertype.emPaperQuestions;
        this.calculationScore(); //统计已选题目分数
        this.separateTypeScore(); //计算各题型选择了多少个及分数
      }
    },
    // 获取选题列表
    getTopicList() {
      //    // 根据题目数量和总分值 计算平均分数
      for (let item in this.SelectedTopicList) {
        //  this.SelectedTopicList[item].score = parseInt(
        //   this.papertype.totalScore / this.papertype.questionNum
        // );
        this.$set(
          this.SelectedTopicList[item],
          "score",
          parseInt(this.papertype.totalScore / this.papertype.questionNum)
        );
        if (item == this.SelectedTopicList.length - 1) {
          //  this.SelectedTopicList[item].score =
          //   parseInt(this.papertype.totalScore / this.papertype.questionNum) +
          //   (this.papertype.totalScore % this.papertype.questionNum);
          this.$set(
            this.SelectedTopicList[item],
            "score",
            parseInt(
              parseInt(this.papertype.totalScore / this.papertype.questionNum) +
                (this.papertype.totalScore % this.papertype.questionNum)
            )
          );
        }
      }
      this.calculationScore(); //统计已选题目分数
      this.separateTypeScore(); //计算各题型选择了多少个及分数
    },
    // 过滤 字典ID获得名称
    filet(id, idList) {
      if (!Array.isArray(idList)) {
        return;
      }
      id = idList.filter((item) => item.dictCode == id);
      if (id.length > 0) {
        id = id[0].dictLabel;
      } else {
        id = "";
      }
      return id;
    },
    //修改分数时 同步
    modifyScore() {
      this.calculationScore(); //统计已选题目分数
      this.separateTypeScore(); //计算各题型选择了多少个及分数
    },
    // 计算当前多少分
    calculationScore() {
      let nowScore = 0;
      for (let item of this.SelectedTopicList) {
        if (item.hasOwnProperty("score")) {
          if (item.score == "") {
            item.score = 0;
          }
          nowScore = item.score + nowScore;
        }
      }
      this.nowScore = nowScore;
    },
    // 计算各题型多少个及分数
    separateTypeScore() {
      for (let item of this.questionType) {
        item.questionType = this.SelectedTopicList.filter(
          //获取对应所有选中的题型
          (v) => v.typeId == item.dictCode
        );

        let Score = 0; //计算 对应题型的分数
        for (let t of item.questionType) {
          if (t.hasOwnProperty("score")) {
            if (t.score == "") {
              t.score = 0;
            }
            Score = t.score + Score;
          }
        }
        item.totalScore = Score;
      }
    },
    // 计算 手动选题列表 题型
    manualseparateTypeScore() {
      this.manualQuestionType = this.questionType;
      for (let item of this.manualQuestionType) {
        item.manualquestionType = this.manualSelected_multipleSelection.filter(
          //获取对应所有选中的题型
          (v) => v.typeId == item.dictCode
        );
      }
    },
    // 全选
    SelectedTopicList_handleSelectionChange(val) {
      this.SelectedTopicList_multipleSelection = val; //已选中数组
    },
    // 手动选题全选
    manualSelected_handleSelectionChange(val) {
      this.manualSelected_multipleSelection = val;
      this.manualseparateTypeScore(); //计算各题型选择了多少个及分数
    },
    // 返回到属性编辑页面
    edittype() {
      this.$emit("edittype");
    },
    // 手动选题按钮
    async manualseTopic() {
      this.innerVisible = true;
      this.manualLoading = true;
      let ids = [];
      for (let item of this.SelectedTopicList) {
        ids.push(item.questionId);
      }
      let subjectId = [];
      if (this.form.subjectId) {
        subjectId = [this.form.subjectId];
      }
      let disciplineId = [];
      if (this.form.disciplineId) {
        disciplineId = [this.form.disciplineId];
      }
      let content = "";
      if (this.form.content) {
        content = this.form.content;
      }
      let _typeId = "";
      if (this.form.questionTypeId) {
        _typeId = this.form.questionTypeId;
      }
      // let  gradeId=[]
      // if(!!this.form.gradeId){
      // gradeId=[this.form.gradeId]
      // }
      let params = {
        flag: "handMovement",
        filterQuestionIdList: ids,
        subjectIdList: subjectId,
        disciplineIdList: disciplineId,
        content: content,
        typeId: _typeId,
        // gradeIdList:gradeId,
      };
      let res = await getSelectedTopicList(params);
      console.log(111, res);
      // debugger;
      //difficultDegreeId
      for (let item of res) {
        //根据当前ID对比字典 获取当前名称
        item.subjectName = this.filet(
          item.subjectId,
          this.dictionaries.subject
        );
        item.typeName = this.filet(item.typeId, this.questionType);
        item.difficultDegreeName = this.filet(
          item.difficultDegreeId,
          this.difficultDegree
        );
        // item.gradeName = this.filet(item.gradeId, this.dictionaries.grade);

        item.disciplineName = this.filet(
          item.disciplineId,
          this.dictionaries.discipline
        );
      }
      this.manualSelected = res;
      this.manualLoading = false;
      // console.log(this.SelectedTopicList)
    },
    // 手动选题 搜索
    query() {
      this.manualseTopic();
    },
    Reset() {
      this.form = {};
      this.manualseTopic();
    },
    // 手动选题 确定按钮
    manualdetermine() {
      this.loading = true;
      if (
        this.SelectedTopicList.length +
          this.manualSelected_multipleSelection.length >
        this.papertype.questionNum
      ) {
        this.$message("总题数不能大于" + this.papertype.questionNum + "题");
        this.loading = false;
        return;
      }
      this.SelectedTopicList = [
        ...this.SelectedTopicList,
        ...this.manualSelected_multipleSelection,
      ]; //合并
      // 题目去重
      let map = new Map();
      for (let item of this.SelectedTopicList) {
        if (!map.has(item.questionId)) {
          map.set(item.questionId, item);
        }
      }
      this.SelectedTopicList = [...map.values()];
      console.log(this.SelectedTopicList);
      this.getTopicList();
      this.innerVisible = false;
      this.loading = false;
    },
    // 取消按钮
    canceltopic(Id) {
      //只能判断 ==   !=要加return
      this.SelectedTopicList = this.SelectedTopicList.filter((v) => {
        return v.questionId != Id;
      }); //把对应的题目ID筛选出来删除
      this.getTopicList();
    },
    // 新增题组  提交
    async addpaperGroup(state) {
      //提交完成要删除题组属性缓存
      if (this.SelectedTopicList.length != this.papertype.questionNum) {
        this.$message(`总题数应为${this.papertype.questionNum}题`);
        return;
      }
      if (this.nowScore != this.papertype.totalScore) {
        this.$message(`总分数应为${this.papertype.totalScore}分`);
        return;
      }

      let Knowledge = [];
      // 如果有知识点
      if (!!this.papertype.emKnowledgePointList) {
        this.papertype.emKnowledgePointList.map((item) => {
          Knowledge.push({
            dictCode: item.dictCode,
            name: item.dictLabel,
          });
        });
      }

      let Questions = [];
      this.SelectedTopicList.map((item) => {
        Questions.push({
          questionId: item.questionId,
          score: item.score,
          sort: "",
          duration: "",
          durationType: "",
        });
      });
      let arryData = {
        subjectId: this.papertype.subjectId, //分类id
        disciplineId: this.papertype.disciplineId, //主题id
        paperTypeId: this.papertype.paperTypeId, //题组（试卷）类别Id
        // gradeId: this.papertype.gradeId, //适用年级Id
        name: this.papertype.name, //题组（试卷）名称
        questionNum: this.papertype.questionNum, //题目数量
        duration: this.papertype.duration, //试卷限制作答的时间
        durationType: this.papertype.durationType, //限制作答的时间单位,1秒,2分,3时,4天,5周,6月,7季度,8年
        singleDuration: this.papertype.singleDuration, //试卷单题限制作答的时间
        singleDurationType: this.papertype.singleDurationType, //限制单题作答的时间单位，
        totalScore: this.papertype.totalScore, //题组（试卷）总分
        passScore: this.papertype.passScore, //number类型，及格分数
        status: state, //1-仅保存，4-保存并提交
        descr: this.papertype.descr, //题组（试卷）描述
        emKnowledgePointList: Knowledge, //知识点
        emPaperQuestions: Questions, //题组题目
      };
      let resData = null;

      if (!this.papertype.paperId) {
        //判断是编辑还是新增
        try {
          resData = await postTest(arryData);
          this.$emit("func");
          this.innerVisible = false;
        } catch (e) {
          console.error("接口异常");
        }
      } else {
        try {
          arryData.paperId = this.papertype.paperId;
          resData = await putTest(arryData);
          this.$emit("func");
          this.innerVisible = false;
        } catch (e) {
          console.error("接口异常");
        }
      }
      if (resData != null) {
        this.$notify({
          title: "成功",
          dangerouslyUseHTMLString: true,
          // message:  resData.message ,
          type: "success",
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.choice_title {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.choice_bottom {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 0.4rem;
  margin: 1rem;
}

.chice_button_right {
  text-align: right;
  margin: 1rem;
}

.rdenumber {
  color: red;
}

.tips {
  text-align: right;
  color: #8c8d8f;
}
</style>
<style lang="scss">
/* element样式重置 start */
/* 去掉input尾部上下小箭头 start */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  -o-appearance: none !important;
  -ms-appearance: none !important;
  appearance: none !important;
  margin: 0;
}

input[type="number"] {
  -webkit-appearance: textfield;
  -moz-appearance: textfield;
  -o-appearance: textfield;
  -ms-appearance: textfield;
  appearance: textfield;
}

/* 去掉input尾部上下小箭头 end */
</style>
