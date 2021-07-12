<template>
  <div class="app-container job-change" style="background: #ffffff">
    <div class="tit">岗位变更</div>
    <el-form :model="jobInForm" :rules="rules" ref="jobInForm" class="change-form">
      <el-form-item prop="beforeDept" label="调出部门" >
        <el-input v-model="jobInForm.beforeDept" maxlength="30"  show-word-limit placeholder="请输入姓名" disabled></el-input>
      </el-form-item>
      <el-form-item prop="beforePost" label="调出岗位" >
        <el-input v-model="jobInForm.beforePost" maxlength="30"  show-word-limit placeholder="请输入调出岗位" disabled></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="选择部门" prop="afterDeptId">
            <el-cascader
              ref="cascader"
              v-model="jobInForm.afterDeptId"
              :options="treeResDept"
              :props="jobProps"
              @change="change"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="选择岗位" prop="afterPostId">
            <el-select v-model="userName" placeholder="请选择岗位" @change="pitchName">
              <el-option
                v-for="item in jobsOptions"
                :key="item.postId"
                :label="item.name"
                :value="{ value: item.postId, label: item.name }"
                :props="PeopleProps"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="变更原因" prop="reason">
        <el-input
          v-model="jobInForm.reason"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder="请输入变更原因"
          style="width: 80%"
        />
      </el-form-item>
    </el-form>
    <div class="tit">流程设置</div>
    <el-form :model="nextData" class="change-form" ref="SpJobInfo" :rules="SpJobInfo">
      <el-form-item prop="nodeName" label="下一个流程节点" style="width: 50%">
        <el-input v-model="nextData.nodeName" maxlength="30"   show-word-limit :disabled="true"></el-input>
      </el-form-item>
      <el-form-item prop="userName" label="审批人" style="width: 50%">
        <el-input
          v-model="nextData.userName"
          placeholder="点击选择审批人"
          readonly
          @focus="showSdialog"
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- <div style="text-align: right; margin-top: 20px">
      <el-button
        class="confirm-btn"
        style="width: 80px; line-height: 30px"
        @click="submitFun()"
        >确定</el-button
      >
      <el-button class="cancel-btn" @click="cancelBtn"> 取消 </el-button>
    </div>-->
    <!--选择审批人盒子-->
    <sdialog
      ref="sdialog"
      @choiceUser="choiceUser"
      :sNeed="true"
      dxId="user"
      :transferProps="{
        key: 'userId',
        label: 'realName',
      }"
      :treedata="treedata"
    ></sdialog>
  </div>
</template>

<script>
import {
  getPeopleChange,
  getAddJobChange,
  getChangeJobNextNodeS
} from "@/api/system/people";
import { getTreeDeptSelect } from "@/api/job/org";
import { getTreeSelect, tSubmit, postSubmit } from "@/api/system/process";
import Sdialog from "@/components/selectDialog";
import { getJobs } from "@/api/system/user";

// import mixin from "./mixin";
export default {
  props: {
    editPrograms: {
      type: Object,
      default: {}
    }
    // editProgram: Object,
  },
  components: {
    Sdialog
  },
  data() {
    return {
      PeopleProps: {
        value: "postId",
        label: "name"
      },
      treedata: [],
      jobsOptions: [],
      userName: "",
      isShow: false,
      jobInForm: {
        beforeDeptId: "",
        beforePostId: "",
        afterDeptId: "",
        afterPostId: "",
        reason: "",
        toUser: ""
      },
      //获取下一个流程节点数据接口参数
      reqNextData: {
        userId: this.editPrograms.userId,
        businessCode: this.$store.state.approvalProcess.postchange
      },
      nextData: {},
      jobProps: {
        value: "id",
        label: "label",
        checkStrictly: true
      },
      treeArr: [],
      treeResDept: [],
      userId: "",
      dialogVisible: false,
      treeRes: "",
      //表单验证方法
      rules: {
        afterDeptId: [
          {
            required: true,
            message: "请选择部门",
            trigger: "change"
          }
        ],
        afterPostId: [
          {
            required: true,
            message: "请选择岗位",
            trigger: "change"
          }
        ],
        reason: [
          {
            required: true,
            message: "请输入变更原因",
            trigger: "blur"
          }
        ]
      },
      //表单验证方法
      SpJobInfo: {
        nodeName: [
          {
            required: true,
            message: "请选择下一流程节点",
            trigger: "change"
          }
        ],
        userName: [
          {
            required: true,
            message: "请选择审批人",
            trigger: "change"
          }
        ]
      }
    };
  },
  created: async function() {
    this.userId = this.editPrograms.userId;
    this.jobInForm = await getPeopleChange(this.userId);
    //树形
    this.treeRes = await getTreeDeptSelect();
    this.treeResDept = await getTreeDeptSelect();
    console.log(this.treeResDept, 6666666);
    this.getNextNode();
  },

  methods: {
    cancelBtn() {
      this.$store.state.tabActive = "people";
      console.log(this.$store.state.tabActive);
      this.$emit("fatherMethod");
    },
    //获取岗位ID
    pitchName(params) {
      const { value, label } = params;
      this.jobInForm.afterPostId = value;
    },

    //选择岗位
    async change(val) {
      if (val.length >= 1) {
        this.treeArr = val;
        this.jobInForm.afterDeptId = this.treeArr[this.treeArr.length - 1];
        if (this.jobInForm.afterDeptId != "") {
          this.jobsOptions = await getJobs(this.jobInForm.afterDeptId);
        }
      } else {
        this.jobInForm.afterDeptId = "";
      }
    },
    //获取下一个审批流程
    async getNextNode() {
      let result = await getChangeJobNextNodeS(this.reqNextData);
      console.log(result,8988998)
      this.jobInForm.toUser = result.data.body.userId
      this.nextData = result.data.body;
      if (result.data.code != 200) {
        this.$emit("fatherMethod");
        this.$notify({
          title: result.data.code == 200 ? "成功" : "提示",
          dangerouslyUseHTMLString: true,
          message: result.data.code != 200 ? result.data.body : "",
          type: result.data.code == 200 ? "success" : "warning"
        });
        return;
      }
      if (!this.nextData.userName) {
        this.nextData.userName = "";
      }
    },
    choiceUser(UserID, UserObject) {
      //子组件 选择参与人 完成后调用的事件
      this.nextData.userName = UserObject[0].realName;
      this.jobInForm.toUser = UserObject[0].userId;
      this.$refs.sdialog.isShow = false;
    },
    addOpen() {
      this.$confirm("正在执行新增/编辑操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.submitFun("nextData");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },

    submitFun() {
      this.$refs.jobInForm.validate(async valid => {
        if (!valid) {
          this.$notify({
            title: "操作失败",
            dangerouslyUseHTMLString: true,
            message: "请填写完整",
            type: "warning"
          });
        } else {
          this.$refs.SpJobInfo.validate(async valid => {
            if (!valid) {
              this.$notify({
                title: "操作失败",
                dangerouslyUseHTMLString: true,
                message: "请填写完整",
                type: "warning"
              });
            } else {
              let jobData = {
                beforeDeptId: this.jobInForm.beforeDeptId,
                beforePostId: this.jobInForm.beforePostId,
                afterDeptId: this.jobInForm.afterDeptId,
                afterPostId: this.jobInForm.afterPostId,
                userId: this.editPrograms.userId,
                status: this.editPrograms.status,
                reason: this.jobInForm.reason,
                businessCode: this.$store.state.approvalProcess.postchange,
                toUser: this.jobInForm.toUser
              };
              let data = await getAddJobChange(jobData);
              this.$notify({
                title: data ? "成功" : "失败",
                dangerouslyUseHTMLString: true,
                message: data ? data.message : "服务器开小差了，请稍后再试",
                type: data ? "success" : "warning"
              });
              this.$emit("fatherMethod");
            }
          });
        }
      });
    },
    async showSdialog() {
      this.treedata = await getTreeSelect();
      this.$refs.sdialog.isShow = true;
    }

    // handleClick(tab, event) {
    //   console.log(tab, event);
    // },
    // treeCheck(data, isCheck, isChildrenCheck) {
    //   if (isCheck) {
    //     let keys = this.$refs.deptTree.getCheckedKeys();
    //     if (this.currentChecke && this.currentChecke == "") {
    //       this.currentChecke = keys[0];
    //     } else {
    //       let this_ = this;
    //       keys.some((value) => {
    //         if (value != this_.currentChecke) {
    //           this_.currentChecke = value;
    //           return true;
    //         }
    //       });
    //     }
    //     let itme = [this.currentChecke];
    //     this.$refs.deptTree.setCheckedKeys(itme, true);
    //   }
    // },
    // getCheckedNodes(leafOnly, data) {
    //   this.treeArr = leafOnly;
    //   console.log(this.treeArr);
    // },

    // getProcess() {
    //   this.dialogVisible = true;
    //   if (!this.editor) {
    //     setTimeout(() => {
    //       this.$nextTick(this.initG6Editor());
    //     }, 1000);
    //   }
    // },
    //获取下一个审批流程
    // async getNextNode() {
    //   this.nextData = await getChangeJobNextNode(this.reqNextData);
    //   if (!this.nextData.userName) {
    //     this.nextData.userName = "";
    //   }
    // },

    // //提表单
    // confirm(formName) {
    //   this.$refs[formName].validate(async (valid) => {
    //     if (!valid) {
    //       this.$notify({
    //         title: "操作失败",
    //         dangerouslyUseHTMLString: true,
    //         message: "请填写完整",
    //         type: "warning",
    //       });
    //       return;
    //     }
    //     // this.jobInForm.beforeDeptId = this.jobInForm.beforeDeptId;
    //     // this.jobInForm.beforePostId = this.jobInForm.beforePostId;
    //     // this.jobInForm.afterDeptId = this.jobInForm.afterDeptId;
    //     // this.jobInForm.afterPostId = this.jobInForm.afterPostId;
    //     this.jobInForm.userId = this.$route.query.userId;
    //     delete this.jobInForm.beforeDept;
    //     delete this.jobInForm.beforePost;
    //     delete this.jobInForm.afterPost;
    //     delete this.jobInForm.afterDept;
    //     let data = null;
    //     debugger
    //     data = await getAddJobChange(this.jobInForm);
    //     this.$notify({
    //       title: data ? "成功" : "失败",
    //       dangerouslyUseHTMLString: true,
    //       message: data ? data.message : "服务器开小差了，请稍后再试",
    //       type: data ? "success" : "warning",
    //     });
    //   });
    // },
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  border: none;
}
</style>
<style>
.tit {
  font-size: 18px;
  height: 50px;
  line-height: 50px;
  color: #333;
  padding-left: 15px;
  margin-top: 18px;
  border-bottom: 1px solid #d7d7d7;
  margin-bottom: 25px;
}
.tit::before {
  display: inline-block;
  content: "";
  width: 4px;
  height: 20px;
  background: rgba(13, 116, 215, 1);
  vertical-align: -4px;
  margin-right: 9px;
}
/*  .el-form--inline .el-form-item__content{
    display: block;
    } */
.change-form .el-form-item {
  display: block;
}
.change-form .el-input,
.change-form .el-cascader {
  /* width: 80%; */
}
.change-form .job .el-input {
  width: 100%;
}
.change-form .el-form-item__label {
  width: 120px;
}
#vue-g6-editor {
  /*  position: fixed;
      top: 80px;
      left: 115px;
      right: 0;
      bottom: 0px;
      width: 100%;
      overflow-y: scroll;
      padding: 30px; */
  width: 100%;
  height: 100%;
}

#vue-g6-editor header:nth-of-type(1) {
  background: #fbfbfb;
  line-height: 40px;
  padding-left: 20px;
  border-bottom: 1px solid #ffffff;
  box-sizing: border-box;
}

#vue-g6-editor #toolbar {
  background: #fbfbfb;
  border-bottom: 1px solid #dadce0;
  padding: 4px 14px;
}

#vue-g6-editor #toolbar i {
  font-size: 18px;
  padding: 4px;
  margin-right: 8px;
  color: #999999;
}

#vue-g6-editor #toolbar i:hover {
  cursor: pointer;
  background-color: #eeeeee;
  color: #5cb6ff;
}

.job-change #vue-g6-editor #itempannel {
  box-sizing: border-box;
  background-color: #fbfbfb;
  border-right: 1px solid #dadce0;
  height: calc(100vh - 41px - 37px);
  padding-top: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: flex-start;
  display: none;
}

#vue-g6-editor #itempannel .getItem {
  cursor: move;
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#vue-g6-editor #itempannel .getItem img {
  width: 100%;
}

#vue-g6-editor #page {
  height: calc(24vh);
  width: 100%;
}

#vue-g6-editor #page canvas {
  display: block;
  width: 100%;
  margin-left: 0px;
}

.job-change #vue-g6-editor .right-part {
  height: calc(100vh - 220px - 30px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  display: none;
}

#vue-g6-editor #detailpannel {
  flex-grow: 1;
  background-color: #fbfbfb;
  border-left: 1px solid #dadce0;
  overflow-y: scroll;
}

#vue-g6-editor #detailpannel #nodeAttributeBar .title,
#vue-g6-editor #detailpannel #edgeAttributeBar .title,
#vue-g6-editor #detailpannel #groupAttributeBar .title,
#vue-g6-editor #detailpannel #canvasAttributeBar .title,
#vue-g6-editor #detailpannel #multiAttributeBar .title {
  height: 34px;
  line-height: 34px;
  text-align: center;
  box-sizing: border-box;
  font-weight: bold;
  font-size: 13px;
  border-width: 0 0 1px 0;
  border-style: solid;
  border-color: #dadce0;
}

#vue-g6-editor #detailpannel #nodeAttributeBar .main,
#vue-g6-editor #detailpannel #edgeAttributeBar .main,
#vue-g6-editor #detailpannel #groupAttributeBar .main,
#vue-g6-editor #detailpannel #canvasAttributeBar .main,
#vue-g6-editor #detailpannel #multiAttributeBar .main {
  padding: 10px;
}

#vue-g6-editor #minimap {
  background-color: #fbfbfb;
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
}

#vue-g6-editor #minimap .title {
  height: 34px;
  line-height: 34px;
  text-align: center;
  box-sizing: border-box;
  font-weight: bold;
  font-size: 13px;
  border-width: 0 0 1px 0;
  border-style: solid;
  border-color: #dadce0;
}

#vue-g6-editor #contextmenu {
  display: none;
}

#vue-g6-editor #contextmenu .menu /deep/ .el-button {
  width: 100%;
  display: block;
  margin-left: 0;
  border-radius: 0 !important;
  border-bottom: none;
}

#vue-g6-editor #contextmenu .menu /deep/ .el-button:nth-last-of-type(1) {
  border-bottom: 1px solid #dcdfe6;
}

#vue-g6-editor .save-as-image-dialog /deep/ .el-select {
  display: block;
}

#vue-g6-editor #page canvas {
}
</style>
