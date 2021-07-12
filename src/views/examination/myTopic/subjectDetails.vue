<template>
  <div v-loading="loading">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="90px"
      class="demo-ruleForm"
    >
      <el-tag effect="dark">题目属性</el-tag>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属分类" prop="subjectId">
            <el-select
              v-model="ruleForm.subjectId"
              value-key="dictCode"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) of subject"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属主题" prop="disciplineId">
            <el-select
              v-model="ruleForm.disciplineId"
              value-key="dictCode"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) of discipline"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="难度等级" prop="difficultDegreeId">
            <el-select
              v-model="ruleForm.difficultDegreeId"
              placeholder="请选择"
              value-key="dictCode"
            >
              <el-option
                v-for="(item, index) of difficultDegree"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注说明">
        <el-input
          placeholder="请输入备注"
          type="textarea"
          :autosize="{ minRows: 3 }"
          v-model="ruleForm.descr"
        ></el-input>
      </el-form-item>

      <el-tag effect="dark">题目内容</el-tag>

      <el-form-item label="题目类型" prop="typeId">
        <el-radio-group
          v-model="ruleForm.typeId"
          @change="topictype"
          value-key="dictCode"
        >
          <el-radio
            v-for="(item, index) of type"
            :key="index"
            :label="item.dictCode"
            >{{ item.dictLabel }}</el-radio
          >
        </el-radio-group>
      </el-form-item>

      <el-form-item label="题目" prop="content">
        <el-input
          placeholder="请输入题目"
          type="textarea"
          :autosize="{ minRows: 3 }"
          v-model="ruleForm.content"
        ></el-input>
      </el-form-item>

      <el-form-item label="可选答案" v-if="answer">
        <el-table
          :data="ruleForm.questionOptionList"
          stripe
          style="width: 100%; margin-bottom: 0"
        >
          <el-table-column label="序号" width="60" align="center">
            <template slot-scope="scope">{{ scope.row.optionIndex }}</template>
          </el-table-column>
          <el-table-column label="选项内容" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input
                placeholder="不填为减少可选项"
                type="textarea"
                autosize
                maxlength="50"
                show-word-limit
                v-model="scope.row.optionDescr"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="正确答案" width="80" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.rightFlag"></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
        <div class="add-questionOptionList">
          <i class="el-icon-folder-add"></i>
          <el-button @click="addQuestionOptionList" type="text"
            >添加选项</el-button
          >
          <i class="el-icon-folder-remove"></i>
          <el-button class="red" @click="delQuestionOptionList" type="text"
            >删除选项</el-button
          >
        </div>
      </el-form-item>

      <el-form-item label="题目解析">
        <el-input
          placeholder="题目解析 简答题时为答案"
          type="textarea"
          :autosize="{ minRows: 3 }"
          v-model="ruleForm.questionExplain"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { postTopicList } from "@/api/examination/index"; //新增题目接口
import { putTopicDtails } from "@/api/examination/index"; //修改题目接口
import { getTopicDtails } from "@/api/examination/index"; //根据ID查详情
import { getSelectType } from "@/api/examination/index"; //字典
export default {
  data() {
    return {
      has: {
        add: "exam:question:add",
      },
      mask: false,
      loading: false, //加载
      put: false, //是否为修改
      ruleForm: {
        subjectId: "", //所属分类
        disciplineId: "", //主题
        gradeId: "", //年级
        content: "", //题目内容
        typeId: "", //题目类型ID
        difficultDegreeId: "", //题目难度ID
        questionExplain: "", //题目解析 简答题、填空时为答案
        descr: "", //备注信息
        questionRoot: {}, //来源类型 1-自创，2-其他资料
        questionOptionList: [
          //可选答案
          {
            optionIndex: "A", //选项标识 A、B、C、D
            optionDescr: "", //描述
            rightFlag: false, //是否为正确答案
          },
          {
            optionIndex: "B",
            optionDescr: "",
            rightFlag: false,
          },
          {
            optionIndex: "C",
            optionDescr: "",
            rightFlag: false,
          },
          {
            optionIndex: "D",
            optionDescr: "",
            rightFlag: false,
          },
        ],
        knowledgePointList: [], //知识点列表
      },
      subject: [],
      discipline: [],
      grade: [],
      difficultDegree: [],
      type: [],
      knowledgePoint: [],
      rules: {
        //验证规则
        subjectId: [
          { required: true, message: "请选择所属分类", trigger: "change" },
        ],
        disciplineId: [
          { required: true, message: "请选择主题", trigger: "change" },
        ],
        gradeId: [{ required: true, message: "请选择年级", trigger: "change" }],

        typeId: [
          { required: true, message: "请选择题目类型", trigger: "change" },
        ],
        content: [{ required: true, message: "请选择题目", trigger: "change" }],
      },
      answer: true, //选择题型 更换类型
    };
  },
  created() {
    this.getselectlist();
    this.loading = true;
  },
  mounted() {
    this.$emit("mounted");
  },
  methods: {
    // 六个下拉列表
    async getselectlist() {
      const subject = await getSelectType("exam_subject");
      const discipline = await getSelectType("exam_discipline");
      const grade = await getSelectType("exam_grade");
      const difficultDegree = await getSelectType("exam_difficultDegree");
      const type = await getSelectType("exam_type");
      let knowledgePoint = await getSelectType("exam_knowledgePoint");
      this.subject = subject;
      this.discipline = discipline;
      this.grade = grade;
      this.difficultDegree = difficultDegree;
      this.type = type;
      this.knowledgePoint = knowledgePoint;

      this.loading = false;
      // console.log(subject,discipline,grade,difficultDegree,type,knowledgePoint);
    },
    async getTopicId(TopicId, t) {
      //通过ID查找题目详细信息  t：get查询  put修改
      let params = {
        flag: "",
      };
      const res = await getTopicDtails(TopicId, params);
      // res.typeId="1303139283352211457"
      // console.log(this.type)
      if (t == "get") {
        //如果只是查询就打开遮罩层 并 关闭提交按钮
        this.mask = true;
        this.put = false;
      } else if (t == "put") {
        this.mask = false;
        this.put = true;
      } //知识点绑定问题
      let zsd = [];
      for (let item of res.knowledgePointList) {
        let vs = {};
        vs.dictLabel = item.name;
        vs.dictCode = item.dictCode + "";
        zsd.push(vs);
      }
      res.knowledgePointList = zsd;
      this.ruleForm = res;
      if (!res.hasOwnProperty("questionRoot")) {
        //判断返回结果有无questionRoot
        res.questionRoot = {};
      }
      if (!res.questionRoot) {
        res.questionRoot = {};
      }
      //如果当前题型是简答题 就把选项关掉
      if (res.questionOptionList.length == 0) {
        this.answer = false;
      } else {
        this.answer = true;
      }
      this.resetForm("ruleForm");
    },
    addTopic() {
      this.put = false;
      this.mask = false;
      this.ruleForm = {
        subjectId: "", //所属分类
        disciplineId: "", //主题
        gradeId: "", //年级
        content: "", //题目内容
        typeId: "", //题目类型ID
        difficultDegreeId: "", //题目难度ID
        questionExplain: "", //题目解析 简答题、填空时为答案
        descr: "", //备注信息
        questionRoot: {}, //来源类型 1-自创，2-其他资料
        questionOptionList: [
          //可选答案
          {
            optionIndex: "A", //选项标识 A、B、C、D
            optionDescr: "", //描述
            rightFlag: false, //是否为正确答案
          },
          {
            optionIndex: "B",
            optionDescr: "",
            rightFlag: false,
          },
          {
            optionIndex: "C",
            optionDescr: "",
            rightFlag: false,
          },
          {
            optionIndex: "D",
            optionDescr: "",
            rightFlag: false,
          },
        ],
        knowledgePointList: [], //知识点列表
      };
    },
    // 添加可选答案
    addQuestionOptionList() {
      if (this.ruleForm.questionOptionList.length > 26) {
        this.$message({
          message: "不可超出最大可选项",
          type: "warning",
        });
        return;
      }
      let Index = String.fromCharCode(
        "A".charCodeAt(0) + this.ruleForm.questionOptionList.length
      ); //字母自增
      let data = {
        optionIndex: Index,
        optionDescr: "",
        rightFlag: false,
      };
      this.ruleForm.questionOptionList.push(data);
    },
    // 删除可选答案
    delQuestionOptionList() {
      if (this.ruleForm.questionOptionList.length <= 2) {
        this.$message({
          message: "至少两个选项",
          type: "warning",
        });
        return;
      }
      this.ruleForm.questionOptionList.pop();
    },
    // 选择题目类型的change事件{
    topictype(value) {
      if (value == "1303595952662134785") {
        //如果是简答题 就一次选项框
        this.answer = false;
      } else {
        this.answer = true;
      }
    },
    // 表单验证
    submitForm(formName, status) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submit(status);
        } else {
          this.$message({
            message: "请填写完整题目表",
            type: "warning",
          });
          return false;
        }
      });
    },
    // 重置表单验证
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async submit(status) {
      //提交
      // let types=this.type.filter(item=>item.dictCode==this.ruleForm.typeId)    types=="单选题"
      if (this.ruleForm.typeId == "1303139283352211457") {
        //单选题
        if (
          this.ruleForm.questionOptionList.filter(
            //如果是单选题 只能有一个选项为true 且描述不能为空
            (item) => item.rightFlag === true
          ).length != 1
        ) {
          this.$message({
            message: "单选题只要选择一个正确答案",
            type: "warning",
          });
          return;
        } else {
          for (let v of this.ruleForm.questionOptionList.filter(
            (item) => item.rightFlag === true
          )) {
            if (v.optionDescr == "") {
              this.$message({
                message: "请输入选项内容",
                type: "warning",
              });
              return;
            }
          }
        }
      } else if (this.ruleForm.typeId == "1303139341036474370") {
        //多选题
        if (
          this.ruleForm.questionOptionList.filter(
            //如果是多选题 最少有两个选项为true 且描述不能为空
            (item) => item.rightFlag === true
          ).length < 2
        ) {
          this.$message({
            message: "多选题最少要选择两个正确答案",
            type: "warning",
          });
          return;
        } else {
          for (let v of this.ruleForm.questionOptionList.filter(
            (item) => item.rightFlag === true
          )) {
            if (v.optionDescr == "") {
              this.$message({
                message: "请输入选项内容",
                type: "warning",
              });
              return;
            }
          }
        }
      } else if (this.ruleForm.typeId == "1303595952662134785") {
        //如果是 简答题 那么题目解析不能为空
        if (!this.ruleForm.questionExplain) {
          this.$message({
            message: "简答题 ，请输入题目解析",
            type: "warning",
          });
          return;
        }
        this.ruleForm.questionOptionList = []; //如果是简答题清空选择选项
      }
      // let reduce=this.ruleForm.questionOptionList.filter(item=>item.optionDescr='')
      this.ruleForm.questionOptionList =
        this.ruleForm.questionOptionList.filter((item) => {
          return item.optionDescr != "";
        });
      console.log(this.ruleForm, 1111555);
      if (this.ruleForm.questionRoot.type == 1) {
        delete this.ruleForm.questionRoot.content;
      }
      this.ruleForm.status = status;
      let res;
      if (this.put) {
        res = await putTopicDtails(this.ruleForm); //发送修改请求
      } else {
        res = await postTopicList(this.ruleForm); //发送添加请求
      }
      this.$message({
        message: res,
        type: "success",
      });

      this.$emit("show_openTopic", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.add-questionOptionList {
  text-align: center;
  border: 0.5px solid #dcdfe6;
  border-top: 0;
}
.Mask {
  position: absolute;
  width: 100%;
  height: 100vh;
  z-index: 9999;
}
.button_right {
  text-align: right;
}
</style>
