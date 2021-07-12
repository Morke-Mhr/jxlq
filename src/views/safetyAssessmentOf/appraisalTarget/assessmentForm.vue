<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item
        label="选择部门和岗位"
        prop="postId"
        style="width: 100%"
        label-width="120"
      >
        <el-cascader
          ref="cascader"
          v-model="ruleForm.deptId"
          :options="treeResDept"
          :props="jobProps"
          @change="changeDept($event)"
          clearable
        ></el-cascader>
        <el-select
          v-model="userName"
          placeholder="请选择岗位"
          @change="pitchName"
        >
          <el-option
            v-for="item in jobsOptions"
            :key="item.postId"
            :label="item.name"
            :value="{ value: item.postId, label: item.name }"
            :props="PeopleProps"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <div class="popover_t">
        <el-popover
          placement="top-start"
          width="82"
          trigger="hover"
          content="指示说明"
        >
          <i
            slot="reference"
            class="el-icon-warning-outline"
            @click="reminder"
          ></i>
        </el-popover>
      </div>
      <!-- 表格 -->
      <el-table :data="ruleForm.targeContentVos" style="width: 100%" stripe>
        <el-table-column label="周期">
          <template slot-scope="scope">
            <el-select v-model="scope.row.period" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="工作内容" width="180">
          <template slot-scope="scope">
            <el-select
              value-key="classdictId"
              @change="dictNumbers(scope.$index)"
              v-model="scope.row.workContentXX"
              placeholder="请选择"
            >
              <el-option
                v-for="item in dictNumber"
                :key="item.classdictId"
                :label="item.dictName"
                :value="item"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="指标" width="180">
          <template slot-scope="scope">
            <el-select
              value-key="classdictId"
              v-model="scope.row.workYX"
              placeholder="请选择"
            >
              <el-option
                v-for="item in scope.row.workkX"
                :key="item.classdictId"
                :label="item.dictName"
                :value="item"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="基准数">
          <template slot-scope="scope">
            <el-input
              v-model.number="scope.row.baseNum"
              @mousewheel.native.prevent
              type="number"
              autocomplete="off"
             oninput="if(value<0)value=0"
            ></el-input>
          </template>
        </el-table-column>

        <el-table-column label="规则" width="60">
          <template>
            <p>X>N</p>
          </template>
        </el-table-column>

        <el-table-column label="分值">
          <template slot-scope="scope">
            <el-input
              v-model.number="scope.row.score"
              @mousewheel.native.prevent
              type="number"
              autocomplete="off"
              oninput="if(value<0)value=0"
              placeholder="请输入0-100之间的数字"
            ></el-input>
          </template>
        </el-table-column>

        <el-table-column label="扣分方式">
          <template slot-scope="scope">
            <el-select v-model="scope.row.subtractType" placeholder="请选择">
              <el-option
                v-for="item in subtract"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="addrufm">添加</el-button>
            <el-button type="text" @click="eidrufm(scope.$index)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      custom-class="small"
      append-to-body
    >
      <div>
        1、单项扣分方式：
        考核分直接减分值：比如签订安全责任书，基准值（X）是1份,实际签署0份，设定的分值是1分，所有本次指标考核减1分。<br />
        2、合计扣分方式：
        考核分通过(X-N)*1公式减分值：比如签订安全责任书，基准值（X）是1份，实际签署0份，设定的分值是2分，所以本次指标考核减
        （1-0）*2 为2分。
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  addequeryAll,
  getTreeSelect, //获取部门
} from "@/api/safetyAssessmentOf/index"; //获取部门岗位
import {
  getdictNumber, //分类字典
  getBusinessList, //分类字典
} from "@/api/job/safety";
import { getTreeDeptByLogin } from "@/api/job/org";
import { getJobs } from "@/api/system/user";

export default {
  loadNumber(row) {
    var elValue = row.release_proportion;
    var reg = /^((?!0)\d{1,2})$/;
    if (!reg.test(elValue)) {
      row.release_proportion = "";
    }
    return row.release_proportion;
  },
  props: {
    addSee: {
      //判断是新增还是查看
      type: Boolean,
      default: true,
    },
    assesstargetId: {
      //考核ID
      type: String,
      default: "",
    },
  },
  data() {
    return {
      has: {
        add: "assessTarget:post:submit",
      },
      PeopleProps: {
        value: "postId",
        label: "name",
      },
      userName: "",
      treeResDept: [], //部门
      jobsOptions: [], //部门岗位
      jobProps: {
        value: "id",
        label: "label",
        checkStrictly: true,
      },
      dialogVisible: false,
      options: [
        {
          value: "1",
          label: "年度",
        },
        {
          value: "2",
          label: "月度",
        },
      ],
      subtract: [
        {
          value: "1",
          label: "单项",
        },
        {
          value: "2",
          label: "合计",
        },
      ],
      ruleForm: {
        //表单
        targeContentVos: [{ score: "", baseNum: "" }],
        deptId: "",
        dept: "",
        post: "",
        postId: "",
      },
      dictNumber: [], //工作内容
      rules: {
        selectvalue: [
          { required: true, message: "请选择岗位", trigger: "change" },
        ],
        // deptId: [{ required: true, message: "请选择部门", trigger: "change" }]
      },
    };
  },
  created() {
    this.jobContent();
  },
  methods: {
    async jobContent() {
      //考试内容
      this.dictNumber = await getdictNumber("DICT_WORKCONTENT");
      // 部门
      this.treeResDept = await getTreeDeptByLogin();
    },
    //选择岗位
    async changeDept(val) {
      if (val.length >= 1) {
        this.treeArr = val;
        this.ruleForm.deptId = this.treeArr[this.treeArr.length - 1];
        if (this.ruleForm.deptId != "") {
          this.ruleForm.postId = "";
          this.jobsOptions = await getJobs(this.ruleForm.deptId);
        }
      } else {
        this.ruleForm.postId = "";
      }
      this.ruleForm.dept =
        this.$refs["cascader"].getCheckedNodes()[0].pathNodes[
          this.$refs["cascader"].getCheckedNodes()[0].pathNodes.length - 1
        ].label;
    },
    //获取岗位ID
    pitchName(params) {
      const { value, label } = params;
      this.ruleForm.postId = value;
      this.ruleForm.post = label;
    },

    //表单提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submit();
        } else {
          return false;
        }
      });
    },
    //重置表单
    resetForm(formName) {
      this.$emit("complete");
      // this.$refs[formName].resetFields();
    },
    // 提交
    async submit() {
      for (let v of this.ruleForm.targeContentVos) {
        if (Object.getOwnPropertyNames(v).length < 8) {
          this.$message({
            message: "请填写完整指标内容",
            type: "warning",
          });
          return;
        }
        if (!(v.score >= 0 && v.score <= 100)) {
          this.$message({
            message: "请按照规定填写分值（0 ~ 100）",
            type: "warning",
          });
          return;
        }
      }
      for (let item of this.ruleForm.targeContentVos) {
        item.rule = "X>N";
        item.baseNum = parseInt(item.baseNum);
        item.score = parseInt(item.score);
        //工作任务
        item.workContent = item.workContentXX.dictName;
        item.workContentId = item.workContentXX.classdictId;
        //工作指标
        item.workIndex = item.workYX.dictName;
        item.workIndexId = item.workYX.classdictId;
        delete item.workYX;
        delete item.workContentXX;
        delete item.workkX;
      }
      delete this.ruleForm.selectvalue;
      const res = await addequeryAll(this.ruleForm);
      this.$message({
        message: res,
        type: "success",
      });
      this.resetForm();
    },
    // 选择部门
    // treeselectChange() {
    //   this.ruleForm.dept = this.$refs["treeselect"].getCheckedNodes()[0].label;
    //   console.log(this.ruleForm.dept);
    // },
    //选择职位
    treedataDeptChange() {
      // if (this.$refs["treedataDept"].getCheckedNodes()[0].data.flag == "0") {
      //   this.$message({
      //     message: "请选择岗位",
      //     type: "warning"
      //   });
      //   this.ruleForm.selectvalue = [];
      //   return;
      // }
      // // 岗位
      // this.ruleForm.post = this.$refs[
      //   "treedataDept"
      // ].getCheckedNodes()[0].label;
      // // 岗位id
      // this.ruleForm.postId = this.$refs[
      //   "treedataDept"
      // ].getCheckedNodes()[0].value;
      // // 如果直接选择的是岗位，着部门为空
      // if (
      //   this.$refs["treedataDept"].getCheckedNodes()[0].pathNodes.length == 1
      // ) {
      //   this.ruleForm.dept = "";
      //   this.ruleForm.deptId = "";
      //   return;
      // }
      // // 部门
      // this.ruleForm.dept = this.$refs[
      //   "treedataDept"
      // ].getCheckedNodes()[0].pathNodes[
      //   this.$refs["treedataDept"].getCheckedNodes()[0].pathNodes.length - 2
      // ].label;
      // // 部门id
      // this.ruleForm.deptId = this.$refs[
      //   "treedataDept"
      // ].getCheckedNodes()[0].pathNodes[
      //   this.$refs["treedataDept"].getCheckedNodes()[0].pathNodes.length - 2
      // ].value;
    },

    // 添加考核内容
    addrufm() {
      this.ruleForm.targeContentVos.push({ score: "", baseNum: "" });
    },
    // 删除考核内容
    eidrufm(index) {
      if (this.ruleForm.targeContentVos.length <= 1) {
        this.$message({
          message: "至少需要一个考核内容",
          type: "warning",
        });
        return;
      }
      this.ruleForm.targeContentVos.splice(index, 1);
    },
    //  查找指标
    async dictNumbers(index) {
      const res = await getdictNumber(
        this.ruleForm.targeContentVos[index].workContentXX.dictNumber
      );
      if (res.length < 0) {
        //如果没有结果着为空
        this.ruleForm.targeContentVos[index].workkX = [];
        return;
      }
      this.$set(this.ruleForm.targeContentVos[index], "workYX", res[0]); //每次改变第一选项时，清空已选第二选项默认为可选项的第一个
      this.$set(this.ruleForm.targeContentVos[index], "workkX", res);
    },
    reminder() {
      this.dialogVisible = true;
    },
  },
};
</script>
<style lang="scss">
.popover_t {
  float: right;
  font-size: 20px;
  margin: 0 10px;
}

.el-popover {
  background-color: #000 !important;
  color: #fff !important;
  min-width: 82px;
  padding: 7px 10px;
  border: none;

  .popper__arrow::after {
    border-top-color: #000 !important;
  }
}

.el-icon-warning-outline {
  cursor: pointer;
}

.endcol {
  text-align: right;
  margin-top: 2rem;
}
</style>