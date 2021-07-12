<template>
  <!-- 岗位变更 -->
  <div class="content">
      <div class="read-only">
      </div>
    <el-form :model="jobInForm" ref="pageForm" class="change-form">
      <el-form-item prop="title" label="调出的部门">
        <el-input v-model="jobInForm.beforeDept" maxlength="30" ></el-input>
      </el-form-item>
      <el-form-item prop="title" label="调出的岗位">
        <el-input v-model="jobInForm.beforePost" maxlength="30"></el-input>
      </el-form-item>
        <el-form-item prop="title" label="选择的部门">
        <el-input v-model="jobInForm.afterDept" maxlength="30" ></el-input>
      </el-form-item>
      <el-form-item prop="title" label="选择的岗位">
        <el-input v-model="jobInForm.afterPost" maxlength="30" ></el-input>
      </el-form-item>
      <el-form-item prop="title" label="变更的原因">
        <el-input v-model="jobInForm.reason" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item prop="title" label="变更人">
        <el-input v-model="jobInForm.userName" maxlength="30" ></el-input>
      </el-form-item>
      <el-form-item prop="title" label="变更日期">
        <el-input v-model="jobInForm.changeTime" maxlength="30" ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { viewBusinessInfo } from "@/api/system/process";
export default {
  props: {
    businessKey: String,
    businessCode:String,
  },
  components: {},
  data() {
    return {
      jobInForm: {
      }
    };
  },
  created() {
     this.getAllList()
  },
  methods: {
    async getAllList() {
      const res= await viewBusinessInfo(this.businessCode,this.businessKey);
      this.jobInForm =res.body
    },
  },
};
</script>
<style lang='scss' scoped>
.read-only{
   position: absolute;
  width: 100%;
  height: 100%;
  z-index: 999;
}
//@import url(); 引入公共css类
</style>