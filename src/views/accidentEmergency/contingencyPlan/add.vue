<template>
  <div class="content_add_box">
    <div class="content_add">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="110px"
        class="demo-ruleForm"
      >
        <el-form-item label="类别" prop="planClass">
          <el-select
            v-model="ruleForm.planClass"
            @change="ChangeStatus"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictLabel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预案名称" prop="planName">
          <el-input v-model="ruleForm.planName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="预案内容" prop="planContent">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            v-model="ruleForm.planContent"
          ></el-input>
        </el-form-item>
        <el-form-item label="附件" prop="planFileList">
          <div class="upload">
            <el-upload
              class="upload-demo"
              ref="upload"
              :action="getUrl"
              :on-remove="handleRemove"
              :on-preview="handlePreview"
              :before-remove="beforeRemove"
              :on-success="uploadSuccess"
              :before-upload="beforeUpload"
              multiple
              :limit="1"
              :file-list="fileLists"
              name="file"
            >
              <el-button
                size="small"
                type="primary"
                class="fBtn"
                v-if="flag == true"
                >选择文件</el-button
              >
              <div slot="tip" class="el-upload__tip" style="line-height: 16px">
                只能上传bmp、jpg，png，gif；AVI、rmvb、FLV、mp4、3GP；Doc、docx、xls、xlsx、txt、PDF；RAR、ZIP；MP3格式文件不能超过（1G），
              </div>
              <span v-if="flag == false">点击文件下载</span>
            </el-upload>
            <div class="shade" v-if="flag == false"></div>
          </div>
        </el-form-item>
        <el-form-item label="发布时间" prop="releaseTime">
          <div class="block">
            <el-date-picker
              v-model="ruleForm.releaseTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
        </el-form-item>

        <!-- 审批流程 -->
        <el-form-item>
          <div class="tit">流程设置</div>
          <el-form-item label="选择审批流" prop="processDefinitionKey">
            <el-select
              @change="processNode"
              v-model="ruleForm.processDefinitionKey"
              placeholder="请选择"
            >
              <el-option
                v-for="item in nextData"
                :key="item.id"
                :label="item.businessName"
                :value="item.processDefinitionKey"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="审批岗位">
            <el-input v-model="nodeName" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="审批人" prop="toUser" style="margin-top: 25px">
            <el-input
              v-model="toUserName"
              readonly
              @focus="alertChooseSp"
              placeholder="点击选择审批人"
            ></el-input>
            <!-- <el-col :span="19" style="padding-left: 25px">
                <el-button type="text" @click="alertChooseSp"
                  >选择审批人</el-button
                >
              </el-col> -->
          </el-form-item>
        </el-form-item>
      </el-form>
      <!-- 选择审批流 -->
      <Sdialog
        ref="sdialog"
        @choiceUser="choiceUser"
        :isDx="isDx"
        :sNeed="sNeed"
        :transferProps="{ key: 'userId', label: 'realName' }"
        :treedata="treeselect"
      ></Sdialog>
      <!-- <div class="dialog-footer">
        <el-button class="confirm-btn" @click="addOpen()">确 定</el-button>
        <el-button class="cancel-btn" @click="resetForm">取 消</el-button>
      </div> -->
    </div>
  </div>
</template>

<script>
import { getBusinesspost } from "@/api/job/safety";
import {
  getBusinessList,
  Classification,
  getAddList,
  getCheck,
} from "@/api/accidentEmergency/contingencyPlan";
import { getTreeSelect } from "@/api/job/safety"; //获取部门

import Sdialog from "@/components/selectDialog"; //通过部门选择人

export default {
  components: {
    Sdialog,
  },
  data() {
    return {
      isDx: true, //是否单选 子组件
      sNeed: true, //是否传值
      nodeName: "",
      nextData: [],
      has: {
        add: "laws:projectDoc:add",
      },
      options: [], //类别
      fileLists: [],
      flag: true,
      loading: false,
      toUserName: "",
      ruleForm: {
        planClass: "", //预案类别|字典
        planClassId: "", //预案类别编号|字典
        planName: "", //预案名称
        planContent: "", //预案内容
        releaseTime: "", //发布时间
        planFileList: [],
        toUser: "",
      },
      rules: {
        planClass: [{ required: true, message: "预案类别", trigger: "change" }],
        planName: [{ required: true, message: "预案名称", trigger: "blur" }],
        planContent: [
          { required: true, message: "预案内容", trigger: "change" },
        ],
        releaseTime: [{ required: true, message: "发布时间", trigger: "blur" }],
        planFileList: [{ required: true, message: "附件", trigger: "blur" }],
        processDefinitionKey: [
          { required: true, message: "审批流程", trigger: "change" },
        ],
        toUser: [{ required: true, message: "选择审批人", trigger: "change" }],
      },
      treeselect: [], //选择部门
      UserList: [], //选择人员
      addList: [], //提交数组
      dialogVisible: false,
      emergencyplanId: "",
      fileFormat: true,
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
    this.loading = true;
    // 获取审批流
    this.getNextProce();
    this.Classifications();
  },
  methods: {
    // 选择审批流
    async processNode(v) {
      let data = {
        processDefinitionKey: v,
      };
      let nodeName = await getBusinesspost(data);
      this.nodeName = nodeName.nodeName;
      // console.log(nodeName.nodeName)
    },
    //预案类别
    async Classifications() {
      let data = "emergencyplan_category";
      this.options = await Classification(data);
      this.treeselect = await getTreeSelect();
    },
    //预案类别
    ChangeStatus(e) {
      let operUserIds = [];
      this.options.map((item) => {
        if (item.dictLabel == e) {
          operUserIds.push(item.dictCode);
        }
      });
      this.ruleForm.planClassId = operUserIds.toString();
    },

    // 获取审批流
    async getNextProce() {
      let pamrs = {
        businessCode: this.$store.state.approvalProcess.emergencyplan,
      };
      this.nextData = await getBusinessList(pamrs);
    },
    // 获取审批人
    alertChooseSp() {
      this.isDx = true;
      this.sNeed = true;
      this.$refs.sdialog.isShow = true;
    },
    // 新增审批人 完成后的事件
    choiceUser(UserID, UserObject) {
      if (UserID.length == 0) {
        this.$message({
          message: "请选择审批人",
          type: "warning",
        });
        return;
      }
      console.log(UserObject);
      this.toUserName = UserObject[0].realName;
      this.ruleForm.toUser = UserObject[0].userId;

      this.$refs.sdialog.isShow = false;
    },
    // 取消
    resetForm() {
      this.$emit("func");
    },
    //新增表单
    submitForm(formName) {
      this.$refs["ruleForm"].validate((valid) => {
        if (!valid) {
          this.$notify({
            title: "操作失败",
            dangerouslyUseHTMLString: true,
            message: "请填写完整",
            type: "warning",
          });
          return;
        }
        this.$confirm("正在执行新增/编辑操作, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            let data = null;
            try {
              let resdata = this.ruleForm;
              data = await getAddList(resdata);
              this.$refs["ruleForm"].resetFields();
            } catch (e) {
              console.error("接口异常");
            }
            this.$refs.upload.clearFiles();
            this.$emit("func");
            this.$notify({
              title: data ? "成功" : "失败",
              dangerouslyUseHTMLString: true,
              message: data ? data.message : "服务器开小差了，请稍后再试",
              type: data ? "success" : "warning",
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      });
    },

    // 文件列表移除文件时的钩子
    async handleRemove(file, fileList) {
      this.ruleForm.planFileList = [];
      this.$refs.upload.clearFiles();
    },
    //下载
    handlePreview(file) {
      if (this.flag == false) {
        this.fileDowloadName =
          this.$store.state.apiConfiguration.url +
          `/fs/download?name=${encodeURI(encodeURI(file.name))}&path=${
            file.url
          }`;
        location.href = this.fileDowloadName;
      }
    },
    beforeRemove(file, fileList) {
      if (this.fileFormat) {
        return this.$confirm(`确定移除 ${file.name}？`);
      }
    },
    // 上传成功时的钩子
    uploadSuccess(res, file, fileList) {
      if (res.code !== 200) {
        return this.$message({
          type: "warning",
          message: "上传失败!",
        });
      }
      let arr = [];
      arr.push(res);
      let formImgList = [];
      arr.forEach((item) => {
        formImgList.push({
          fileName: item.body.fileName,
          fileUrl: item.body.url,
        });
      });
      let arry = formImgList.pop();
      this.ruleForm.planFileList.push(arry);
      this.fileFormat = true;
    },
    //文件校验
    beforeUpload(file) {
      this.fileFormat = false;
      let FileFormat = file.name.substring(file.name.lastIndexOf(".") + 1);
      let testmsg = FileFormat.toLowerCase();
      const extension =
        testmsg === "xls" ||
        testmsg === "xlsx" ||
        testmsg === "doc" ||
        testmsg === "docx" ||
        testmsg === "txt" ||
        testmsg === "pdf" ||
        testmsg === "bmp" ||
        testmsg === "jpg" ||
        testmsg === "png" ||
        testmsg === "gif" ||
        testmsg === "avi" ||
        testmsg === "rmvb" ||
        testmsg === "flv" ||
        testmsg === "mp4" ||
        testmsg === "3gp" ||
        testmsg === "rar" ||
        testmsg === "zip" ||
        testmsg === "mp3";
      const isLt2M = file.size / 1024 / 1024 < 1000;
      if (!extension) {
        this.$message({
          message: "请上传正确的格式!",
          type: "error",
        });
        this.$refs.upload.clearFiles();
        return false;
      }
      if (!isLt2M) {
        this.$message({
          message: "上传文件大小超过限制!",
          type: "error",
        });
        this.$refs.upload.clearFiles();
        return false;
      }
      // return extension || isLt2M;
    },
  },
};
</script>
<style scoped>
.content_add_box {
  background-color: #fff;
  padding: 15px 0;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
.content_add_box .el-input__inner {
  border: none !important;
}
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
</style>
