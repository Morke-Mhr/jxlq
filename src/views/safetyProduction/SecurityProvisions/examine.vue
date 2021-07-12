<template>
  <div class="content_add_box">
    <div class="content_add">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="经费类别" prop="projectStage">
          <el-select
            v-model="ruleForm.fundType"
            filterable
            placeholder="请选择"
            disabled
          >
            <el-option
              v-for="item in options"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictLabel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位名称" prop="deptId">
          <el-cascader
            disabled
            v-model="ruleForm.deptId"
            ref="myCascader"
            :options="treeselect"
            :props="optionProps"
            @change="handleChange"
            style="width: 100%"
            placeholder="请选择部门"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model="ruleForm.projectName"
            disabled
            placeholder="请输入"

          ></el-input>
        </el-form-item>
        <el-form-item label="项目标段" prop="bid">
          <el-input
            v-model="ruleForm.bid"
            disabled
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="计划实施时间" prop="planTime">
          <div class="block">
            <el-date-picker
              disabled
              v-model="ruleForm.planTime"
              type="date"
              format="yyyy-MM-dd "
              value-format="yyyy-MM-dd "
              placeholder="选择日期时间"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="经费内容" prop="fundContent">
          <el-input
            disabled
            type="textarea"
            :rows="4"
            v-model="ruleForm.fundContent"
            placeholder="请输入"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="预计金额" prop="money">
          <el-input
            disabled
            v-model="ruleForm.money"
            placeholder="请输入"
            autocomplete="off"
            type="number"
            :controls="false"
            :min="0"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            disabled
            type="textarea"
            :rows="4"
            v-model="ruleForm.remark"
            placeholder="请输入"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div>
        <Approval ref="mychild"></Approval>
      </div>

      <!-- <div class="dialog-footer">
        <el-button class="cancel-btn" @click="resetForm('ruleForm')"
          >取 消</el-button
        >
      </div> -->
    </div>
  </div>
</template>

<script>
import {
  Classification,
  getCheck,
} from "@/api/safetyProduction/SecurityProvisions";
import { getTreeSelect } from "@/api/job/safety"; //获取部门
import Approval from "@/components/approvalProcess/index";

import Sdialog from "@/components/selectDialog"; //通过部门选择人

export default {
  props: {
    person: String,
  },
  components: { Approval },

  data() {
    return {
      has: {
        add: "laws:projectDoc:add",
      },

      optionProps: {
        value: "id",
        label: "label",
        checkStrictly: true,
      },
      loading: true,
      options: {},
      ruleForm: {
        fundType: "", //经费类别
        fundTypeId: "", //经费类别编号
        deptName: "", //部门名称
        deptId: "", //部门编号
        planTime: "", //计划实施时间
        fundContent: "", // 经费内容
        money: "", //预计金额
        remark: "", //备注
        projectName: "", //项目名称
        projectId: "", //项目名称ID
        bid: "", //标段
      },
      rules: {
        fundType: [
          { required: true, message: "选择经费类别", trigger: "blur" },
        ],
        deptId: [{ required: true, message: "选择部门", trigger: "blur" }],
        planTime: [
          { required: true, message: "计划实施时间", trigger: "blur" },
        ],
        fundContent: [{ required: true, message: "经费内容", trigger: "blur" }],
        money: [{ required: true, message: "预计金额", trigger: "blur" }],
        remark: [{ required: true, message: "备注", trigger: "blur" }],
        projectName: [{ required: true, message: "项目名称", trigger: "blur" }],
        bid: [{ required: true, message: "标段", trigger: "blur" }],
        businessCode: [
          { required: true, message: "审批流程", trigger: "blur" },
        ],
        toUser: [{ required: true, message: "选择审批人", trigger: "blur" }],
      },
      treeselect: [], //获取部门
      fundplanId: "",
    };
  },
  computed: {
    getUrl() {
      return (
        this.$store.state.apiConfiguration.url +
        this.$store.state.serviceName.jurisdiction +
        "/fs/upload"
      );
    },
  },
  created() {
    this.fundplanId = this.person;
    this.department();
    this.goCheck();
  },
  methods: {
    //查看
    async goCheck() {
      try {
        let changeData = await getCheck(this.fundplanId);
        setTimeout(() => {
          this.$refs.mychild.getList(this.fundplanId); //调用子组件的审批记录
        }, 500);
        this.ruleForm = changeData;
        this.ruleForm.deptId = changeData.deptId.toString();
        let arry = [];
      } catch (e) {
        console.error("接口异常");
      }
    },

    //获取部门
    async department() {
      this.treeselect = await getTreeSelect();
    },
    handleChange(value) {
      if (value != undefined) {
        let deptname = this.$refs.myCascader.getCheckedNodes()[0].pathLabels;
        this.ruleForm.deptName = deptname[deptname.length - 1];
      }
      if (this.ruleForm.deptId != undefined) {
        this.ruleForm.deptId = this.ruleForm.deptId[
          this.ruleForm.deptId.length - 1
        ];
      }
    },

    //置空
    onClear(formName) {
      this.$refs[formName].resetFields();
      this.chooseList();
    },
    //取消
    resetForm() {
      this.$emit("func");
    },
  },
};
</script>
<style lang='scss' scoped>
.content_add_box {
  background-color: #fff;
  padding: 15px 0;
  .content_add {
    .dialog-footer {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
