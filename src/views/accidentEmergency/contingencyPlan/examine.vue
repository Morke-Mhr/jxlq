<template>
  <div class="content_add_box">
    <div class="content_add">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="类别" prop="planClass">
          <el-input
            v-model="ruleForm.planClass"
            :disabled="true"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="预案名称" prop="planName">
          <el-input
            v-model="ruleForm.planName"
            :disabled="true"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="预案内容" prop="planContent">
          <el-input
            type="textarea"
            :rows="5"
            :disabled="true"
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
              multiple
              :limit="1"
              :file-list="ruleForm.fileLists"
              name="file"
            >
              <span slot="tip" class="el-upload__tip">点击文件下载</span>
            </el-upload>
            <div class="shade"></div>
          </div>
        </el-form-item>
        <el-form-item label="发布时间" :disabled="true" prop="releaseTime">
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
            <div>
        <Approval ref="mychild"></Approval>
      </div>

      <!-- <div class="dialog-footer">
        <el-button class="cancel-btn" @click="resetForm">取 消</el-button>
      </div> -->
    </div>
  </div>
</template>

<script>
import {
  getBusinessList,
  Classification,
  getAddList,
  getCheck,
} from "@/api/accidentEmergency/contingencyPlan"; //分类字典
import Approval from "@/components/approvalProcess/index";

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
      options: [], //类别
      fileLists: [],
      flag: true,
      loading: false,
      ruleForm: {},
      rules: {},
      dialogVisible: false,
      emergencyplanId: "",
    };
  },
  computed: {
    getUrl() {
      return (
        this.$store.state.apiConfiguration.url +
        "jxlq-system-service" +
        "/fs/upload"
      );
    },
  },
  created() {
    this.emergencyplanId = this.person;
    this.loading = true;
    this.goCheck();
  },
  methods: {
    //查看
    async goCheck() {
      try {
        let changeData = await getCheck(this.emergencyplanId);
        setTimeout(() => {
          this.$refs.mychild.getList(this.emergencyplanId); //调用子组件的审批记录
        }, 500);

        this.ruleForm = changeData;
        let arry = [];
        changeData.emergencyplanFileList.map((item) => {
          arry.push(
            Object.assign({}, { name: item.fileName, url: item.fileUrl })
          );
        });
        this.ruleForm.fileLists = [...arry];
      } catch (e) {
        console.error("接口异常");
      }
    },

    // 取消
    resetForm() {
      this.$emit("func");
    },
    // 文件列表移除文件时的钩子
    async handleRemove(file, fileList) {
      if (this.flag == false) {
        let row = file;
        await fsDelete(row.fileId);
        this.ruleForm.fileList = [];
        this.$refs.upload.clearFiles();
      }
    },
    //下载
    handlePreview(file) {
      let row = file;
      this.fileDowloadName =
        this.$store.state.apiConfiguration.url +
        "jxlq-system-service" +
        `/fs/download?name=${encodeURI(encodeURI(row.name))}&path=${row.url}`;
      location.href = this.fileDowloadName;
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
.content-bottom {
  background-color: #fff;
  padding: 10px;
}
.upload {
  position: relative;
}
.shade {
  position: absolute;
  right: 0;
  height: 100%;
  width: 10%;
  top: 0;
  z-index: 999999;
  background-color: #fff;
}
</style>
