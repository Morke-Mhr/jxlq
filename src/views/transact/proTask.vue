<template>
  <div class="pt_main">
    <el-alert
      v-if="operaType == 2"
      title="消息提示"
      type="info"
      :closable="false"
      description="请至移动端完成电子签署任务"
      show-icon
    ></el-alert>
    <el-form
      v-if="operaType != 2"
      ref="pt_form"
      :model="formData"
      :label-position="'top'"
      :rules="rules"
    >
      <el-form-item v-if="operaType != 3" label="处理意见" prop="opinion">
        <el-input
          type="textarea"
          v-model.trim="formData.opinion"
          placeholder="请输入意见"
        ></el-input>
      </el-form-item>
      <div v-if="proTaskData.nodeId ? true : false">
        <el-form-item class="Opinion_box" label="下一个流程节点">
          <el-input
            v-model="formData.nodeName"
            maxlength="30"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item class="Opinion_box" label="审批岗位">
          <el-input
            v-model="formData.roleName"
            maxlength="30"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item class="Opinion_box" prop="userName" label="审批人">
          <el-input
            v-model="formData.userName"
            maxlength="30"
            placeholder="点击选择审批人"
            readonly
            @focus="showSdialogsp"
          ></el-input>
          <!-- <span
            style="color:#0d74d7;font-size: 14px;float: right;cursor: pointer;"
            @click="showSdialogsp"
          >选择审批人</span> -->
        </el-form-item>
      </div>
      <div class="process_node">
        <div class="node_box" v-for="(item, i) in Processdata" :key="i">
          <div
            :class="[
              item.processStatus == 0
                ? 'node_box1'
                : [item.processStatus == 1 ? 'node_box2' : 'node_box3'],
            ]"
          >
            <span class="triangle_left"></span>
            <div class="node_list">
              <p class="node_bt">{{ item.nodeName }}</p>
              <p class="node_bm">
                <span>{{ item.roleName }}</span>
                <span>{{ item.userName }}</span>
              </p>
            </div>
            <span class="triangle_right"></span>
          </div>
        </div>
        <div class="node_box">
          <div class="node_box3">
            <span class="triangle_left"></span>
            <div class="node_list node_list_last">审批完成</div>
          </div>
        </div>
      </div>
      <el-form-item
        v-if="selectPeople ? true : false"
        prop="businessName"
        :label="selectPeople"
      >
        <el-input
          v-model="formData.businessName"
          maxlength="30"
          :placeholder="'请选择' + selectPeople"
          :disabled="true"
        ></el-input>
        <!-- <el-button style="float: right" @click="showSdialog">选择{{ selectPeople }}</el-button> -->
        <span
          style="color: #0d74d7; font-size: 14px; float: right; cursor: pointer"
          @click="showSdialog"
          >选择{{ selectPeople }}</span
        >
      </el-form-item>

      <el-form-item v-if="operaType == 0" style="float: right">
        <el-button class="tBtn" @click="onSubmit('pt_form', 1)">同意</el-button>
        <el-button class="fBtn" @click="onSubmit('pt_form', 0)" type="danger"
          >驳回</el-button
        >
      </el-form-item>
      <el-form-item v-else-if="operaType == 1" style="float: right">
        <el-button class="tBtn" @click="isSubmit">确认提交</el-button>
      </el-form-item>
      <el-form-item v-else-if="operaType == 3" style="float: right">
        <el-button class="tBtn" @click="isSubmit">重新提交</el-button>
      </el-form-item>
    </el-form>
    <!--选择审批人盒子-->
    <sdialog
      ref="pr_sdialog"
      @choiceUser="choiceUser"
      :showclose="true"
      :transferProps="{
        key: 'userId',
        label: 'realName',
      }"
      :isDx="selectPeople == '实施人' ? true : false"
      :sNeed="true"
      :treedata="treedata"
      :modal="false"
    ></sdialog>

    <sdialog
      ref="sp_sdialog"
      @choiceUser="choiceporn"
      :showclose="true"
      :transferProps="{
        key: 'userId',
        label: 'realName',
      }"
      :isDx="true"
      :sNeed="true"
      :treedata="treedata"
      :modal="false"
    ></sdialog>
  </div>
</template>

<script>
import Sdialog from "@/components/selectDialog";
import {
  getTreeSelect,
  audit,
  complete,
  getProcessRoleByModelName,
} from "@/api/system/process";

export default {
  name: "proTask",
  props: {
    operaType: {
      type: String,
      default: "1",
    },
    proTaskData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    Sdialog,
  },
  data() {
    return {
      treedata: [],
      opinion: "",
      rules: {
        opinion: [
          { required: true, message: "请输入处理意见", trigger: "blur" },
        ],
        userName: [
          { required: true, message: "请选择审批人", trigger: "change" },
        ],
        businessName: [
          { required: true, message: "请选择人员", trigger: "change" },
        ],
      },
      toUser: "",
      formData: {
        opinion: "",
        nodeName: "",
        roleName: "",
        userName: "",
        businessName: "", //已选人员名称
      },
      selectPeople: "",
      businessParam: [], //已选人员信息
      Processdata: [],
    };
  },
  created() {
    console.log(this.proTaskData, 123);
    this.toUser = this.proTaskData.userId ? this.proTaskData.userId : "";
    this.formData.nodeName = this.proTaskData.nodeName
      ? this.proTaskData.nodeName
      : "";
    this.formData.roleName = this.proTaskData.roleName
      ? this.proTaskData.roleName
      : "";
    this.formData.userName = this.proTaskData.userName
      ? this.proTaskData.userName
      : "";
    this.workingProcess();
  },

  mounted() {
    // 通过正则去筛选 是否需要选择人员
    const implementerReg = /^hiddendangerimplementer/;
    const helperReg = /^hiddendangerhelper/;
    if (implementerReg.test(this.proTaskData.businessCode)) {
      //实施人
      this.selectPeople = "实施人";
    } else if (helperReg.test(this.proTaskData.businessCode)) {
      //协助人
      this.selectPeople = "协助人";
    }
  },
  methods: {
    async workingProcess() {
      let data = {
        processInstanceId: this.proTaskData.processInstanceId,
        processName: this.proTaskData.processName,
        taskName: this.proTaskData.taskName,
      };

      this.Processdata = await getProcessRoleByModelName(data);
    },
    // 选择人员按钮
    async showSdialog() {
      this.treedata = await getTreeSelect();
      this.$refs.pr_sdialog.isShow = true;
    },
    // 选择 审批人
    async showSdialogsp() {
      this.treedata = await getTreeSelect();
      this.$refs.sp_sdialog.isShow = true;
    },

    // 同意 或 驳回 按钮
    onSubmit(formName, status) {
      if (!this.formData.opinion) {
        this.$message({
          message: "请输入处理意见",
          type: "warning",
        });
        return;
      }
      if (!status) {
        // this.formData.opinion = "";
        //判断是否是驳回
        this.$confirm("是否确定驳回该任务", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            this.Submit(status);
            return;
          })
          .catch(() => {});
        return;
      }
      // 如果是点击通过，审批意见可填可不填，系统默认为同意通过
      if (status == 1 && this.formData.opinion == "") {
        this.$set(this.formData, "opinion", "同意通过");
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.Submit(status);
        } else {
          console.log(valid);
          return false;
        }
      });
    },
    //如果是驳回 不需要选择审批人什么的
    async Submit(status) {
      var paramsData = {
        userId: this.proTaskData.userId1,
        taskId: this.proTaskData.taskId,
        businessKey: this.proTaskData.businessKey,
        businessCode: this.proTaskData.businessCode,
        opinion: this.formData.opinion,
        status: status,
        toUser: this.toUser,
      };
      // 判断是否需要添加人员信息
      if (this.selectPeople ? true : false) {
        paramsData.businessParam = this.businessParam;
      }
      var res = await audit(paramsData);
      if (res == "操作成功") {
        this.$message.success("操作成功");
        this.formData = {};
      } else {
        this.$message.error(res);
      }
      // console.log(paramsData, res)
      this.$emit("complete");
    },
    // 确认提交 按钮
    async isSubmit() {
      var paramsData = {
        // businessCode: this.proTaskData.userId1,
        businessCode: this.proTaskData.businessCode,
        taskId: this.proTaskData.taskId,
        businessKey: this.proTaskData.businessKey,
        toUser: this.toUser,
      };
      var res = await complete(paramsData);
      this.$emit("complete");
      this.$message.success(res);
      console.log(paramsData, res);
    },
    // 子组件 选择完成后的回调
    async choiceUser(UserID, UserObject) {
      if (UserID.length == 0) {
        this.$message({
          message: "请选择人员",
          type: "warning",
        });
        return;
      }
      console.log(UserObject);
      let n = ""; //所有已选 人员 名称的集合
      let User = []; //过滤所有对象 只保留 名称和ID
      for (let item of UserObject) {
        let nameID = {};
        n = n + item.realName + "、";
        nameID.paramKey = item.userId;
        nameID.paramValue = item.realName;
        User.push(nameID);
      }
      n = n.slice(0, n.length - 1);
      this.formData.businessName = n;
      this.businessParam = User; //将选择好的人员信息 给到特殊参数中
      this.$refs.pr_sdialog.isShow = false;
    },
    //选择完 审批人
    async choiceporn(UserID, UserObject) {
      if (UserID.length == 0) {
        this.$message({
          message: "请选择审批人",
          type: "warning",
        });
        return;
      }
      this.formData.userName = UserObject[0].realName;
      this.toUser = UserObject[0].userId;
      this.$refs.sp_sdialog.isShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.Opinion_box {
  width: 30%;
  margin-right: 3%;
  display: inline-block;
}
.process_node {
  display: flex;
  flex-wrap: wrap;
  margin: 20px 0;
  .node_box {
    width: 20%;
    height: 60px;
    margin-bottom: 10px;
    //流程节点框
    .node_box1,
    .node_box2,
    .node_box3 {
      display: flex;
      width: 100%;
      height: 60px;
      .node_list_last {
        line-height: 60px;
      }
      .node_list {
        margin-bottom: 10px;
        color: #fff;
        text-align: center;
        height: 60px;
        width: 100%;
        .node_bt {
          margin: 0;
          line-height: 30px;
        }
        .node_bm {
          margin: 0;
          line-height: 24px;
        }
      }
    }
    //审批完的
    .node_box1 {
      .node_list {
        background-color: #00c06a;
      }
      .triangle_right {
        width: 0;
        height: 0;
        border-top: 30px solid #fff;
        border-bottom: 30px solid #fff;
        border-right: 0px solid #fff;
        border-left: 15px solid #00c06a;
      }
      .triangle_left {
        width: 0;
        height: 0;
        border-top: 30px solid #00c06a;
        border-bottom: 30px solid #00c06a;
        border-right: 0px solid #00c06a;
        border-left: 15px solid #fff;
      }
    }
    //审批中的
    .node_box2 {
      .node_list {
        background-color: #c00000;
      }
      .triangle_right {
        width: 0;
        height: 0;
        border-top: 30px solid #fff;
        border-bottom: 30px solid #fff;
        border-right: 0px solid #fff;
        border-left: 15px solid #c00000;
      }
      .triangle_left {
        width: 0;
        height: 0;
        border-top: 30px solid #c00000;
        border-bottom: 30px solid #c00000;
        border-right: 0px solid #c00000;
        border-left: 15px solid #fff;
      }
    }
    //未审批的
    .node_box3 {
      .node_list {
        background-color: #b0b0b0;
      }
      .triangle_right {
        width: 0;
        height: 0;
        border-top: 30px solid #fff;
        border-bottom: 30px solid #fff;
        border-right: 0px solid #fff;
        border-left: 15px solid #b0b0b0;
      }
      .triangle_left {
        width: 0;
        height: 0;
        border-top: 30px solid #b0b0b0;
        border-bottom: 30px solid #b0b0b0;
        border-right: 0px solid #b0b0b0;
        border-left: 15px solid #fff;
      }
    }
  }
}
.process_node .node_box:first-of-type .node_box1 .triangle_left {
  border: none;
}
.process_node .node_box:last-child .node_box3 .triangle_right {
  border: none;
}
</style>
