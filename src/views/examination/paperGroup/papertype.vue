<template>
  <div v-loading="loading">
    <div v-if="Mask" class="mask"></div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="题组名称" prop="name">
            <el-input
              v-model="ruleForm.name"
              placeholder="请选择题组名称"
              maxlength="30"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="知识点">
            <el-select
              v-model="ruleForm.emKnowledgePointList"
              multiple
              value-key="dictCode"
              collapse-tags
              placeholder="知识点"
            >
              <el-option
                v-for="(item, index) of knowledgePoint"
                :label="item.dictLabel"
                :value="item"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="题组模板" prop="paperTypeId">
            <el-select
              v-model="ruleForm.paperTypeId"
              placeholder="请选择题组模板"
            >
              <el-option
                v-for="(item, index) of paperType"
                :label="item.dictLabel"
                :value="item.dictCode"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合格分数" prop="passScore">
            <el-input
              v-model.number="ruleForm.passScore"
              maxlength="5"
              show-word-limit
              type="number"
              oninput="if(value.length>5)value=value.slice(0,5)"
              placeholder="请输入合格分数（不超5位数）"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属分类" prop="subjectId">
            <el-select
              v-model="ruleForm.subjectId"
              placeholder="请选择所属分类"
            >
              <el-option
                v-for="(item, index) of subject"
                :label="item.dictLabel"
                :value="item.dictCode"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属主题" prop="disciplineId">
            <el-select
              v-model="ruleForm.disciplineId"
              placeholder="请选择所属主题"
            >
              <el-option
                v-for="(item, index) of discipline"
                :label="item.dictLabel"
                :value="item.dictCode"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-form-item label="适用班级" prop="gradeId">
              <el-select v-model="ruleForm.gradeId" placeholder="请选择适用班级">
                <el-option
                  v-for="(item, index) of grade"
                  :label="item.dictLabel"
                  :value="item.dictCode"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>-->

      <el-row>
        <el-col :span="12">
          <el-form-item label="题目总数" prop="questionNum">
            <el-input
              v-model.number="ruleForm.questionNum"
              maxlength="4"
              show-word-limit
              placeholder="请输入题目总数（不超4位数）"
              type="number"
              oninput="if(value.length>4)value=value.slice(0,4)"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="试卷总分" prop="totalScore">
            <el-input
              v-model.number="ruleForm.totalScore"
              maxlength="4"
              show-word-limit
              type="number"
              oninput="if(value.length>4)value=value.slice(0,4)"
              placeholder="请输入试卷总分（不超4位数）"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="测验总时长" prop="duration">
            <el-row>
              <el-col :span="16">
                <el-input
                  v-model.number="ruleForm.duration"
                  maxlength="4"
                  show-word-limit
                  type="number"
                  oninput="if(value.length>4)value=value.slice(0,4)"
                  placeholder="请输入测验总时长（不超4位数）"
                ></el-input>
              </el-col>
              <el-col :span="8">
                <el-select v-model="ruleForm.durationType">
                  <el-option
                    v-for="item in papertypetime"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="单题时长">
            <el-row>
              <el-col :span="16">
                <el-input
                  v-model.number="ruleForm.singleDuration"
                  maxlength="4"
                  show-word-limit
                  type="number"
                  oninput="if(value.length>4)value=value.slice(0,4)"
                  placeholder="请输入单题时长（不超4位数）"
                ></el-input>
              </el-col>
              <el-col :span="8">
                <el-select v-model="ruleForm.singleDurationType">
                  <el-option
                    v-for="item in papertypetime"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="end" v-if="!Mask">
        <el-col class="el-form-item papert_center" :offset="2" :span="10"
          >设置为0时不限时</el-col
        >
        <el-col class="el-form-item papert_center" :offset="2" :span="10"
          >设置为0时不限时</el-col
        >
      </el-row>
      <el-form-item label="备注说明">
        <span class="text_area">
          <el-input
            :autosize="{ minRows: 3 }"
            type="textarea"
            v-model="ruleForm.descr"
          ></el-input>
        </span>
      </el-form-item>
      <!-- <el-form-item class="button_right" v-if="!Mask">
              <el-divider></el-divider>
              <el-button type="primary" @click="submitForm('ruleForm')"
                >开始选题</el-button
              >
            </el-form-item>-->
    </el-form>
  </div>
</template>
<script>
import { getSelectType } from "@/api/examination/index"; //字典

export default {
  props: {
    person: Object,
  },
  data() {
    return {
      // ruleForm: {
      //   durationType: 2,
      //   singleDurationType: 1
      // },
      papertypetime: [
        // { name: "秒", value: 1 },
        {
          name: "分",
          value: 2,
        },
        {
          name: "时",
          value: 3,
        },
        {
          name: "天",
          value: 4,
        },
        // { name: "周", value: 5 },
        // { name: "月", value: 6 },
        // { name: "季度", valu: 7 },
        // { name: "年", value: 8 },
      ],
      loading: false,
      ruleForm: {
        subjectId: "", //分类id
        disciplineId: "", //主题id
        paperTypeId: "", //题组（试卷）类别Id
        // gradeId: "", //适用年级Id
        name: "", //题组（试卷）名称
        questionNum: "", //number类型 题目数量
        duration: "", //number类型 试卷限制作答的时间
        durationType: "", //限制作答的时间单位，1-秒，2-分，3-时，4-天，5-周，6-月，7-季度，8-年
        singleDuration: "", //number类型 试卷单题限制作答的时间
        singleDurationType: "", //限制单题作答的时间单位，1-秒，2-分，3-时，4-天，5-周，6-月，7-季度，8-年
        totalScore: "", //number类型 题组（试卷）总分
        passScore: "", //number类型，及格分数
        status: "", //1-仅保存，2-保存并提交
        descr: "", //题组（试卷）描述
        emKnowledgePointList: [], //参考题目是指点信息
        emPaperQuestions: [], //题目集合
      },
      subject: [], //字典获取的值 班级 科目 分类 ...
      discipline: [],
      grade: [],
      knowledgePoint: [],
      paperType: [],
      Mask: false, //遮罩 不可输入
      paperData: {}, //接收传过来的ID
      rules: {
        subjectId: [
          {
            required: true,
            message: "请选择所属分类",
            trigger: "change",
          },
        ],
        disciplineId: [
          {
            required: true,
            message: "请选择所属科目",
            trigger: "change",
          },
        ],
        // gradeId: [
        //   { required: true, message: "请选择适用班级", trigger: "change" },
        // ],
        name: [
          {
            required: true,
            message: "请输入题组名称",
            trigger: "blur",
          },
        ],
        paperTypeId: [
          {
            required: true,
            message: "请选择题组模板",
            trigger: "change",
          },
        ],
        duration: [
          {
            required: true,
            message: "请输入测验总时长",
            trigger: "blur",
          },
        ],
        questionNum: [
          {
            required: true,
            message: "请输入题目总数",
            trigger: "blur",
          },
        ],
        totalScore: [
          {
            required: true,
            message: "请输入试卷总分",
            trigger: "blur",
          },
        ],
        passScore: [
          {
            required: true,
            message: "请输入合格分数",
            trigger: "blur",
          },
        ],
      },
    };
  },
  // beforeCreate() {
  //     this.$refs.ruleForm.resetFields();
  //
  // },
  // beforeMount() {
  //     this.$refs.ruleForm.resetFields();
  //
  // },
  // mounted() {
  //     this.$refs.ruleForm.resetFields();
  //
  // },
  // beforeUpdate() {
  //     this.$refs.ruleForm.resetFields();
  //
  // },
  // updated() {
  //     this.$refs.ruleForm.resetFields();
  //
  // },
  // beforeDestroy() {
  //     this.$refs.ruleForm.resetFields();
  //
  // },
  created() {
    if (this.person) {
      // debugger
      this.paperData = this.person;
    }
    // console.log(JSON.stringify(this.paperData) + "创建了");
    this.getselectlist();
    this.loading = true;
  },
  destroyed() {
    console.log("销毁了");
  },
  methods: {
    inputhandle({ target }) {
      this.verificationVal = target.value = target.value.replace(/[^0-9]/g, "");
    },

    async getselectlist() {
      //字典
      this.subject = await getSelectType("exam_subject");
      this.discipline = await getSelectType("exam_discipline");
      this.grade = await getSelectType("exam_grade");
      this.knowledgePoint = await getSelectType("exam_knowledgePoint");
      this.paperType = await getSelectType("exam_paperType");
      this.loading = false;
      if (this.person) {
        this.ruleForm = this.paperData;

        if (this.ruleForm) {
          this.$refs.ruleForm.resetFields();
        }
      }
    },
    submitForm(formName) {
      var vm = this;
      console.log(this.ruleForm);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.ruleForm.durationType) {
            this.$message({
              message: "请选择总时长单位",
              type: "warning",
            });
            return;
          }
          // 将填写好的值保存到缓存 并跳转到选题页面
          this.ruleForm.paperType = this.paperType.filter(
            (item) => item.dictCode == this.ruleForm.paperTypeId
          )[0];
          sessionStorage.setItem("papertype", JSON.stringify(this.ruleForm));
          vm.$emit("choicePaper");
        } else {
          this.$message({
            message: "带星号的为必填项",
            type: "warning",
          });
          return false;
        }
      });
    },
    // 此方法主要 作为查看题组详情子组件才触发
    paperDetails(Papertable) {
      //Papertable:根据ID查找出来的详情
      this.ruleForm = Papertable;
      this.Mask = true;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
<style lang="scss" scoped>
.button_right {
  text-align: right;
}

.papert_center {
  text-align: left;
  color: red;
}

.mask {
  position: absolute;
  width: 100%;
  // height: 100vh;
  // background: #254;
  z-index: 999;
}
</style>
