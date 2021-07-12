<template>
  <div class="content_imp_box">
    <div class="box">
      <span class="box-left">选择文件</span>
      <div class="box-updad">
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="getUrl"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :before-upload="beforeAvatarUpload"
          multiple
          :limit="1"
          :on-success="onSuccess"
          :headers="geHeaders"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :auto-upload="false"
        >
          <el-button>选取文件</el-button>
        </el-upload>
      </div>
      <span
        v-has="has.downLoad"
        class="box-right"
        @click="fileDownload()"
        style="color: #096dd9; cursor: pointer"
        >下载模版</span
      >
      <el-button v-has="has.add" class="table-add-btn" @click="submitUpload"
        >提交</el-button
      >
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getToken } from "@/utils/auth";

export default {
  components: {},
  data() {
    return {
      fileList: [],
      has: {
        downLoad: "law:hiddendanger:downLoadTemplate",
        add: "law:hiddendanger:importExcel",
      },
    };
  },
  computed: {
    getUrl() {
      return (
        this.$store.state.apiConfiguration.url +
        this.$store.state.serviceName.jurisdiction +
        "/yhknowledgeDoc/importHiddendanger"
      );
    },
    geHeaders() {
      return {
        Authorization: getToken(),
      };
    },
  },
  methods: {
    async fileDownload() {
      // 导出接口
      axios({
        method: "get",
        url:
          this.$store.state.apiConfiguration.url +
          this.$store.state.serviceName.jurisdiction +
          "/yhknowledgeDoc/downLoadTemplate",
        responseType: "blob", // 表明返回服务器返回的数据类型
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken(),
        },
        data: {
          //接口参数
        },
      }).then(function (response) {
        //创建一个隐藏的a连接，
        const link = document.createElement("a");
        let blob = new Blob([response.data], {
          type: "application/vnd.ms-excel",
        });
        link.style.display = "none";
        //设置连接
        link.href = URL.createObjectURL(blob);
        link.download = "隐患知识库.xlsx";
        document.body.appendChild(link);
        //模拟点击事件
        link.click();
      });
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    onSuccess(response, file, fileList) {
      this.$notify({
        title: response ? "成功" : "失败",
        dangerouslyUseHTMLString: true,
        message: response ? response.message : "服务器开小差了，请稍后再试",
        type: response ? "success" : "warning",
      });
      this.$refs.upload.clearFiles();
    },
    //文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    //点击文件列表中已上传的文件时的钩子
    //文件超出个数限制时的钩子
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    beforeAvatarUpload(file) {
      var FileExt = file.name.replace(/.+\./, "");
      if (
        [
          "jpg",
          "png",
          "txt",
          "zip",
          "rar",
          "pdf",
          "doc",
          "docx",
          "xlsx",
        ].indexOf(FileExt.toLowerCase()) === -1
      ) {
        this.$message({
          type: "warning",
          message:
            "请上传后缀名为jpg、png、txt、pdf、doc、docx、xlsx、zip或rar的附件！",
        });
        return false;
      }
    },
  },
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.content_imp_box {
  background-color: #fff;
  padding: 15px 0;
  .box {
    width: 70%;
    margin: auto;
    display: flex;
    align-items: center;
    .box-left {
      margin-right: 20px;
    }
    .box-right {
      margin: 0 20px;
    }
    .box-upda {
      width: 50%;
      border: 1px solid #efefef;
      padding: 10px 20px;
    }
  }
}
</style>
