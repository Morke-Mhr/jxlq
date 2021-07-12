<template>
  <div v-loading="loading">
    <div class="prohibit" v-if="prohibit"></div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="测验名称" prop="name">
        <el-input
          v-model="ruleForm.name"
          placeholder="测验名称"
          maxlength="25"
          show-word-limit
          :disabled="forbid"
        ></el-input>
      </el-form-item>
      <el-form-item label="测验开始时间" required prop="startTime">
        <el-date-picker
          v-model="ruleForm.startTime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerIssueOptions"
          type="datetime"
          @change="changeStartTime"
          placeholder="选择开始时间"
          :disabled="forbid"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="测验结束时间" required prop="endTime">
        <el-date-picker
          v-model="ruleForm.endTime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerExpireOptions"
          type="datetime"
          placeholder="选择结束时间"
          :disabled="forbid"
        ></el-date-picker>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="测验类型" prop="planTypeId">
            <el-select
              v-model="ruleForm.planTypeId"
              placeholder="测验类型"
              :disabled="forbid"
            >
              <el-option
                v-for="(item, index) of planType"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="测验方式" prop="planWayId">
            <el-select
              v-model="ruleForm.planWayId"
              placeholder="测验方式"
              :disabled="forbid"
            >
              <el-option
                v-for="(item, index) of planMode"
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
          <el-form-item label="支持AB卷">
            <el-switch
              v-model="ruleForm.abRollFlag"
              :disabled="forbid"
            ></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="可参加次数" prop="joinCount">
            <el-input
              v-model.number="ruleForm.joinCount"
              type="number"
              placeholder="次数"
              :disabled="forbid"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" class="colorred">
        <el-col :span="10" :offset="2">
          <div>注：试卷顺序不同的两套测验题组</div>
        </el-col>
        <el-col :span="10" :offset="2">
          <div>注：选择0可反复参加(默认为0)</div>
        </el-col>
      </el-row>

      <el-form-item label="备注说明">
        <!-- <span class="text_area">  -->
        <el-input
          type="textarea"
          :autosize="{ minRows: 3 }"
          v-model="ruleForm.descr"
          placeholder="备注说明"
          maxlength="200"
          show-word-limit
          :disabled="forbid"
        ></el-input>
        <!-- </span> -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getSelectType } from "@/api/examination/index"; //字典
export default {
  data() {
    const validateStartTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入测验开始时间"));
      } else {
        if (
          new Date(this.ruleForm.startTime).getTime() <= new Date().getTime() &&
          this.forbid == false
        ) {
          callback(new Error("测验开始时间必须大于当前时间！"));
        } else {
          callback();
        }
      }
    };
    const validateEndTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入测验结束时间"));
      } else {
        if (
          new Date(this.ruleForm.startTime).getTime() >=
          new Date(this.ruleForm.endTime).getTime()
        ) {
          callback(new Error("计划结束时间必须大于计划开始时间！"));
        } else {
          callback();
        }
      }
    };

    return {
      loading: false,
      ruleForm: {
        name: "",
        descr: "",
        startTime: "",
        endTime: "",
        abRollFlag: false,
        joinCount: 0,
        planTypeId: "",
        planWayId: "",
      },
      // 开始时间限制
      pickerIssueOptions: {
        disabledDate: (time) => {
          let beginDateVal = this.ruleForm.endTime;
          if (beginDateVal) {
            return time.getTime() > new Date(beginDateVal).getTime();
          }
        },
      },

      // 结束时间限制
      pickerExpireOptions: {
        disabledDate: (time) => {
          let beginDateVal = this.ruleForm.startTime;
          if (beginDateVal) {
            return (
              time.getTime() <
              new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            );
          }
        },
      },

      planType: [],
      planMode: [],
      prohibit: false,
      forbid: false, //禁止修改
      rules: {
        //表单验证
        name: [{ required: true, message: "请输入测验名称", trigger: "blur" }],
        planTypeId: [
          { required: true, message: "请选择测验类型", trigger: "change" },
        ],
        planWayId: [
          { required: true, message: "请选择测验方式", trigger: "change" },
        ],
        joinCount: [{ required: true }],
        startTime: [
          {
            required: true,
            trigger: ["change", "blur"],
            validator: validateStartTime,
          },
        ],

        endTime: [
          {
            required: true,
            trigger: ["change", "blur"],
            validator: validateEndTime,
          },
        ],
      },
    };
  },
  created() {
    //   this.loading=true
    this.getDictionariesType(); //请求字典
  },
  methods: {
    //选择开始时间，清空结束时间
    changeStartTime(date) {
      this.ruleForm.endTime = "";
      this.pickerBeginDateAfter = {
        disabledDate(time) {
          //开始时间-结束时间
          return time.getTime() < new Date(date).getTime();
        },
      };
    },

    async getDictionariesType() {
      this.planType = await getSelectType("exam_planType"); //计划类型
      this.planMode = await getSelectType("exam_planMode"); //计划方式
    },
    getditeplanType(ruleformpPlan, prohibit) {
      console.log(ruleformpPlan);
      //查看或者修改传参

      this.ruleForm = ruleformpPlan;
      if (prohibit) {
        //查看 true 修改 false
        this.prohibit = true;
      }
    },
    // 表单验证
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("submitFtrue", this.ruleForm);
        } else {
          this.$emit("submitFfalse");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //禁止修改
    fuForbid(e) {
      this.forbid = e;
    },
  },
};
</script>
<style lang="scss" scoped>
// .text_area /deep/{
//   .el-textarea{
//     width: 80%;
//   }
// }
.colorred {
  text-align: left;
  margin-bottom: 22px;
  color: red;
}
.prohibit {
  position: absolute;
  width: 100%;
  z-index: 999;
}
</style>
