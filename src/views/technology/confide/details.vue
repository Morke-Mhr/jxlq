<template>
  <div class="app-container" style="background: #f4f1f2;">
    <div class="people-content">
      <el-row class="row-height">
        <el-col :span="24">
          <div class="area-tit">基础信息</div>

          <el-form :model="itemSelInfo" ref="itemSelInfo" label-width="80px" class="form-table">
            <el-form-item label="类别" prop="programName">
              <el-input type="input" v-model="itemSelInfo.programName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="项目名称" prop="nature">
              <el-input type="input" v-model="itemSelInfo.nature" placeholder="请输入项目名称" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="标段" prop="category">
              <el-input type="input" v-model="itemSelInfo.category" placeholder="请输入标段" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="单位工程名称" prop="projectName">
              <el-input type="input" v-model="itemSelInfo.projectName" placeholder="请输入单位工程名称" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="分项工程名称" prop="bid">
              <el-input type="input" v-model="itemSelInfo.bid" placeholder="请输入分项工程名称" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="交底时间" prop="projectDept">
              <el-input type="input" v-model="itemSelInfo.projectDept" placeholder="请输入交底时间" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="交底人" prop="createBy">
              <el-input type="input" v-model="itemSelInfo.createBy" placeholder="请输入交底人" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="交底部门" prop="createByDept">
              <el-input type="input" v-model="itemSelInfo.createByDept" placeholder="请输入交底部门" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="技术交底内容">
              <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="itemSelInfo.content" placeholder="请输入内容" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="" prop="createByDept"></el-form-item>
            <el-form-item label="技术交底附件" prop="createByDept">
              <el-button type="primary" @click="downLoadFile()">下载附件</el-button>
            </el-form-item>
            

          </el-form>
        </el-col>
      </el-row>


    </div>

  </div>
</template>

<script>
  import {
    getProgramItem
  } from '@/api/technology/program/program.js'
  export default {
    name: "addPeople",
    data() {
      return {
        itemSelInfo: {},
        workprogramId: this.$route.query.workprogramId, //todo

      }
    },
    created: async function() {
      this.getSelInfo();
    },
    computed: {

    },

    methods: {
      //获取方案设计信息
      async getSelInfo() {
        this.loading = true;
        const res = await getProgramItem(this.workprogramId);
        this.itemSelInfo = res;
        console.log("===1111===" + res);
        this.loading = false;
      },

      //下载附件
      async downLoadFile() {
        let data = this.itemSelInfo;
        let fileForm = {
          name: data.workProgramFileList[0].fileName,
          path: data.workProgramFileList[0].fileUrl
        }
        this.fileDowloadName =  this.$store.state.apiConfiguration.url +'jxlq-system-service' +'/fs/download?name=' + fileForm.name + '&path=' + fileForm.path;
        location.href = this.fileDowloadName;
      },
      //下载签字文件
      async downLoadSignFile() {
        let data = this.itemSelInfo;
        let fileForm = {
          path: data.recordFileUrl
        }
        this.fileDowloadName =  this.$store.state.apiConfiguration.url +'jxlq-system-service' +'/fs/download?path=' + fileForm.path;
        location.href = this.fileDowloadName;
      },

    }
  };
</script>

<style lang="scss" scoped>
  .people-content {
    border-radius: 5px;
  }

  .choose-help {
    cursor: pointer;
  }

  .page-tit {
    font-size: 18px;
    background: #FFFFFF;
    height: 45px;
    line-height: 45px;
    margin-bottom: 10px;
    padding-left: 15px;
    border-radius: 5px;
  }

  .area-tit {
    font-size: 18px;
    height: 50px;
    line-height: 50px;
    color: #333;
    padding-left: 15px;
    margin-top: 10px;
  }

  .area-tit:before {
    display: inline-block;
    content: "";
    width: 4px;
    height: 20px;
    background: rgba(13, 116, 215, 1);
    vertical-align: -4px;
    margin-right: 9px;
  }

  .form-table .el-form-item {
    width: 49%;
    display: inline-block;
  }

  .form-table textarea input {
    height: 35px;
    line-height: 35px;
  }

  .form-table .el-form-item__label {
    width: 100px !important;
  }

  .form-table .el-form-item__content {
    margin-left: 100px !important;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }


  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 300px;
    height: 300px;
    line-height: 300px;
    text-align: center;
  }

  .avatar {
    width: 300px;
    height: 300px;
    display: block;
  }

  .img-head {
    text-align: center;
    margin-top: 130px;

  }

  .row-height .el-col {
    background: #FFFFFF;
    height: 580px;
    position: relative;
    border-radius: 5px;
  }

  .row-height {
    height: 580px;
    border-radius: 5px;
  }

  .lce {
    background: #FFFFFF;
    height: 260px;
    border-radius: 5px;
  }

  .people-tree {
    height: 130px;
    overflow-y: scroll;
    z-index: 99;
  }
</style>
