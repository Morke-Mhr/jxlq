<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="部门" prop="dept">
        <el-cascader
          ref="cascader"
          v-model="ruleForm.dept"
          :options="treeselect"
          :props="optionProps"
          @change="deptchange"
        ></el-cascader>
      </el-form-item>

      <el-form-item label="姓名" prop="userName">
        <!-- <el-input v-model="ruleForm.userName"  @change="choice"></el-input> -->
        <el-select
          value-key="userId"
          v-model="ruleForm.userNamelist"
          @change="choice"
          placeholder="请选择类型"
        >
          <el-option
            v-for="item in userNamelist"
            :key="item.userId"
            :label="item.realName"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="类型" prop="jfType">
        <el-select
          value-key="dictCode"
          v-model="ruleForm.jfType"
          placeholder="请选择类型"
        >
          <el-option
            v-for="item in disciplinaryRecords_type"
            :key="item.dictCode"
            :label="item.dictLabel"
            :value="item.dictCode"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="金额(元)" prop="money">
        <el-input
          v-model.number="ruleForm.money"
          type="number"
          maxlength="8"
          show-word-limit
          oninput="if(value.length>5)value=value.slice(0,5)"
           placeholder="请输入不超5位的数字"
        ></el-input>
      </el-form-item>

      <el-form-item label="其他奖罚" prop="jfOther">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3 }"
          maxlength="350"
          show-word-limit
          v-model="ruleForm.jfOther"
        ></el-input>
      </el-form-item>
      <el-form-item label="事项" prop="matter">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3 }"
          maxlength="300"
          show-word-limit
          placeholder="请输入事项"
          v-model="ruleForm.matter"
        ></el-input>
      </el-form-item>

      <el-form-item label="记录附件">
        <el-upload
          class="upload-demo"
          ref="upload"
          :limit="1"
          :action="fileUrl"
          :file-list="fileList"
          :on-success="uploadsuccess"
          :on-error="uploaderror"
          :on-remove="uploadremove"
        >
          <el-button class="blue" slot="trigger">选取附件</el-button>
        </el-upload>
      </el-form-item>

      <el-form-item label="备注">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3 }"
          maxlength="300"
          show-word-limit
          placeholder="请输入备注"
          v-model="ruleForm.remark"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  addDisciplinaryRecords,
  getUserListByDeptId,
} from "@/api/safetyAssessmentOf/index"; //新增
export default {
  props: {
    treeselect: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      ruleForm: {},
      disciplinaryRecords_type: [
        { dictLabel: "奖励", dictCode: 0 },
        { dictLabel: "惩罚", dictCode: 1 },
      ],
      rules: {
        userName: [
          { required: true, message: "请选择人员", trigger: "change" },
        ],
        dept: [{ required: true, message: "请选择部门", trigger: "change" }],
        jfType: [{ required: true, message: "请选择类型", trigger: "change" }],
        matter: [{ required: true, message: "请输入事项", trigger: "blur" }],
        money: [{ required: true, message: "请输入金额", trigger: "blur" }],
        jfOther: [
          { required: true, message: "请输入其他奖罚", trigger: "blur" },
        ],
      },
      optionProps: {
        value: "label",
        checkStrictly: true,
      },
      fileList: [],
      fileUrl: "",
      userNamelist: [],
    };
  },
  created() {
    this.fileUrl = this.$store.state.apiConfiguration.fileUrl + "/fs/upload";
  },
  methods: {
    //   提交
    submitForm(formName) {
      console.log(this.ruleForm);

      this.$refs[formName].validate((valid) => {
        if (valid) {
          // if (
          //   !this.ruleForm.hasOwnProperty("fileName") ||
          //   this.ruleForm.fileName == ""
          // ) {
          //   this.$message({
          //     message: "请上传附件",
          //     type: "warning"
          //   });
          //   return;
          // }
          this.submit();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 提交
    async submit() {
      console.log(this.ruleForm);
      delete this.ruleForm.userNamelist;
      let res = await addDisciplinaryRecords(this.ruleForm);
      this.$message({
        message: res,
        type: "success",
      });
      this.$emit("complete");
    },
    // 取消
    resetForm() {
      this.$emit("cancel");
    },
    choice(value) {
      this.$set(
        this.ruleForm,
        "userName",
        value.userName ? value.userName : value.realName
      );
      this.$set(this.ruleForm, "userId", value.userId);
    },
    // //  选完人回调
    // choiceUser(UserId, UserList) {
    //   if (UserId.length == 0) {
    //     this.$message({
    //       message: "请选择人员",
    //       type: "warning"
    //     });
    //     return;
    //   }
    //   let UserLists = UserList[0];
    //   this.$set(
    //     this.ruleForm,
    //     "userName",
    //     UserLists.userName ? UserLists.userName : UserLists.realName
    //   );
    //   this.$set(this.ruleForm, "userId", UserLists.userId);
    //   console.log(this.ruleForm);
    //   this.$refs.sdialog.isShow = false;
    // },
    // 部门选择change
    async deptchange() {
      let dept = this.$refs["cascader"].getCheckedNodes()[0];
      this.$set(this.ruleForm, "dept", dept.data.label);
      this.$set(this.ruleForm, "deptId", dept.data.id);
      let v = {};
      v.deptId = dept.data.id;
      this.userNamelist = await getUserListByDeptId(v);
    },
    // 上传成功的回调
    uploadsuccess(response, file, fileList) {
      console.log(fileList, file);
      if (file.response.code == 200) {
        this.$set(this.ruleForm, "fileName", file.response.body.fileName);
        this.$set(this.ruleForm, "fileUrl", file.response.body.url);
        file.response.body = JSON.parse(
          JSON.stringify(file.response.body).replace(/fileName/g, "name")
        );
        let v = [];
        v.push(file.response.body);
        this.fileList = v;
      } else {
        this.$message({
          message: file.response.message,
          type: "warning",
        });
        this.fileList = [];
      }
      console.log(this.ruleForm);
    },
    // 上传失败的回调
    uploaderror() {
      this.$message({
        message: err,
        type: "warning",
      });
      console.log(err, file);
    },
    // 文件列表移除文件时的回调
    uploadremove(fileList) {
      this.ruleForm.fileName = "";
      this.ruleForm.fileUrl = "";
      this.fileList = [];

      console.log(this.ruleForm);
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  appearance: none !important;
}
</style>
