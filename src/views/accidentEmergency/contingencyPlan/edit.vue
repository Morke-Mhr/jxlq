<template>
  <div class="content_add_box">
    <div class="content_add">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
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
              <el-button size="small" type="primary" v-if="flag == true"
                >选择文件</el-button
              >
              <div slot="tip" class="el-upload__tip" style="line-height: 16px">
                只能上传bmp、jpg，png，gif（10M）；AVI、rmvb、FLV、mp4、3GP（1G）；Doc、docx、xls、xlsx、txt、PDF（100M）；RAR、ZIP（50M）；MP3（50M）格式文件，
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
      </el-form>
      <div class="dialog-footer">
        <el-button class="confirm-btn" @click="addOpen()">确 定</el-button>
        <el-button class="cancel-btn" @click="resetForm">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getBusinessList,
  Classification,
  getCheck,
  getChangeList,
} from "@/api/accidentEmergency/contingencyPlan"; //分类字典
import Sdialog from "@/components/selectDialog"; //通过部门选择人

export default {
  components: {
    Sdialog,
  },
  props: {
    person: String,
  },
  data() {
    return {
      nextData: [],
      Datas: {
        processDefinitionKey: "",
        userName: "",
      },
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
          { required: true, message: "审批流程", trigger: "blur" },
        ],
        toUser: [{ required: true, message: "选择审批人", trigger: "blur" }],
      },
      treeselect: [], //选择部门
      UserList: [], //选择人员
      addList: [], //提交数组
      dialogVisible: false,
      emergencyplanId: "",
      fileFormat:'',
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
    this.emergencyplanId = this.person;
    // 获取审批流
    this.Classifications();
    this.goCheck();
  },
  methods: {
    //预案类别
    async Classifications() {
      let data = "emergencyplan_category";
      this.options = await Classification(data);
    },
    //获取岗位
    async getPostDept() {
      const res = await getPostAndDept(this.ruleForm.userId); //查找岗位
      this.ruleForm.postName = res.beforePost; //岗位名称
      this.ruleForm.deptName = res.beforeDept; //部门名称
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
    //查看
    async goCheck() {
      try {
        let data = this.emergencyplanId;
        this.ruleForm = await getCheck(data);
        let arry = [];
        this.ruleForm.emergencyplanFileList.map((item) => {
          arry.push(
            Object.assign({}, { name: item.fileName, url: item.fileUrl })
          );
        });
        this.fileLists = arry;
      } catch (e) {
        console.error("接口异常");
      }
    },

    // 新增安全目标
    addsafety() {
      this.ruleForm.safebookTargets.push({ workIndex: { dictName: "" } });
    },
    // 取消
    resetForm() {
      this.$emit("func");
    },
    addOpen() {
      this.$confirm("正在执行新增/编辑操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.submitForm("ruleForm");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },

    //新增表单
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          this.$notify({
            title: "操作失败",
            dangerouslyUseHTMLString: true,
            message: "请填写完整",
            type: "warning",
          });
          return;
        }
        let data = null;
        try {
          data = await getChangeList(this.ruleForm);
          this.$refs[formName].resetFields();
          this.$refs.upload.clearFiles();
        } catch (e) {
          console.error("接口异常");
        }
        this.$emit("func");
        this.$notify({
          title: data ? "成功" : "失败",
          dangerouslyUseHTMLString: true,
          message: data ? data.message : "服务器开小差了，请稍后再试",
          type: data ? "success" : "warning",
        });
      });
    },

    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      this.ruleForm.planFileList = [];
      this.$refs.upload.clearFiles();
    },
    //下载
    handlePreview(file) {
      if (this.flag == false) {
        this.fileDowloadName =
          this.$store.state.apiConfiguration.url +
          `/fs/download?name=${encodeURI(encodeURI(file.name))}&path=${file.url}`;
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
