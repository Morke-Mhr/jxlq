<template>
  <div>
    <div>
      <el-row class="row-height">
        <el-col :span="24">
          <div class="formTitle height40">基础信息</div>
          <el-form
            :model="itemSelInfo"
            ref="itemSelInfo"
            label-width="100px"
            class="form-table"
          >
            <el-form-item label="方案名称" prop="programName">
              <el-input
                v-model="itemSelInfo.programName"
                type="textarea"
                autosize
                placeholder="请输入方案名称"
                :disabled="true"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="" prop="programName"> </el-form-item> -->
            <el-form-item label="性质" prop="nature">
              <el-input
                type="input"
                v-model="itemSelInfo.nature"
                placeholder="请输入性质"
                :disabled="true"
              ></el-input>
            </el-form-item>
            <el-form-item label="类别" prop="category">
              <el-input
                type="input"
                v-model="itemSelInfo.category"
                placeholder="请输入类别"
                :disabled="true"
              ></el-input>
            </el-form-item>
            <el-form-item label="项目名称" prop="projectName">
              <el-input
                type="input"
                v-model="itemSelInfo.projectName"
                placeholder="请输入项目名称"
                :disabled="true"
              ></el-input>
            </el-form-item>
            <el-form-item label="标段" prop="bid">
              <el-input
                type="input"
                v-model="itemSelInfo.bid"
                placeholder="请输入标段"
                :disabled="true"
              ></el-input>
            </el-form-item>
            <el-form-item label="参建子公司" prop="projectDept">
              <el-input
                type="input"
                v-model="itemSelInfo.projectDept"
                placeholder="请输入参建子公司"
                :disabled="true"
              ></el-input>
            </el-form-item>
			<el-form-item label="内容">
			  <el-input
				type="textarea"
				:autosize="{ minRows: 2, maxRows: 4 }"
				v-model="itemSelInfo.content"
				placeholder="请输入内容"
				:disabled="true"
			  ></el-input>
			</el-form-item>
			<el-form-item label="开工日期" prop="startTime">
			  <el-input
			    v-model="itemSelInfo.startTime"
			    type="input"
			    :disabled="true"
			  ></el-input>
			</el-form-item>
            <el-form-item label="编写部门" prop="createByDept">
              <el-input
                v-model="itemSelInfo.createByDept"
                type="input"
                placeholder="请输入编写部门"
                :disabled="true"
              ></el-input>
            </el-form-item>
			<el-form-item label="编写人" prop="createBy">
			  <el-input
				type="input"
				v-model="itemSelInfo.createBy"
				placeholder="请输入编写人"
				:disabled="true"
			  ></el-input>
			</el-form-item>
            <el-form-item label="编写日期">
              <div class="block">
                <el-date-picker
                  v-model="itemSelInfo.createTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :disabled="true"
                >
                </el-date-picker>
              </div>
            </el-form-item>
            <!-- <el-form-item label="" prop="createByDept"></el-form-item> -->
            <el-form-item label="附件" prop="createByDept">
              <el-button @click="downLoadFile()">下载附件</el-button>
              <span style="font-size: 12px">{{ this.fileName }}</span>
            </el-form-item>
            <el-form-item prop="createByDept"></el-form-item>
            <el-form-item
              label="备案签字文件"
              prop="recordFileUrl"
              v-show="recordShow"
            >
              <el-button @click="downLoadSignFile()"
                >下载备案签字文件</el-button
              >
            </el-form-item>
            <approval ref="mychild" v-if="itemSelInfo.isApply"></approval>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getProgramItem } from '@/api/technology/program/program.js'
import Approval from '@/components/approvalProcess/index'
export default {
  components: { Approval },
  props: {
    editPrograms: String
  },
  data() {
    return {
      itemSelInfo: {},
      id: '',
      recordShow: true,
      fileName: ''
    }
  },
  created: async function() {
    this.id = this.editPrograms
    this.getSelInfo()
  },
  computed: {},

  methods: {
    //获取方案设计信息
    async getSelInfo() {
      this.loading = true
      const res = await getProgramItem(this.id)
      this.itemSelInfo = res
	  if(this.itemSelInfo.isApply){
		  setTimeout(() => {
			this.$refs.mychild.getList(this.editPrograms) //调用子组件的审批记录
		  }, 500)
	  }
      if (
        this.itemSelInfo.recordFileUrl == null ||
        this.itemSelInfo.recordFileUrl == ''
      ) {
        this.recordShow = false
      } else {
        this.recordShow = true
      }

      if (
        this.itemSelInfo.workProgramFileList != null ||
        this.itemSelInfo.workProgramFileList != ''
      ) {
        this.fileName = this.itemSelInfo.workProgramFileList[0].fileName
      }
      this.loading = false
    },

    //下载附件
    async downLoadFile() {
      let data = this.itemSelInfo
      let fileForm = {
        name: data.workProgramFileList[0].fileName,
        path: data.workProgramFileList[0].fileUrl
      }
      this.fileDowloadName =
        this.$store.state.apiConfiguration.url +
        'jxlq-system-service' +
        '/fs/download?name=' +
        fileForm.name +
        '&path=' +
        fileForm.path
      location.href = this.fileDowloadName
    },
    //下载签字文件
    async downLoadSignFile() {
      let data = this.itemSelInfo
      let fileForm = {
        path: data.recordFileUrl
      }
      this.fileDowloadName =
        this.$store.state.apiConfiguration.url +
        'jxlq-system-service' +
        '/fs/download?path=' +
        fileForm.path
      location.href = this.fileDowloadName
    }
  }
}
</script>

<style lang="scss" scoped>
.form-table /deep/{
  .el-textarea{
    width: 300px;
  }
}
.people-content {
  border-radius: 5px;
}

.choose-help {
  cursor: pointer;
}

.page-tit {
  font-size: 18px;
  background: #ffffff;
  height: 45px;
  line-height: 45px;
  margin-bottom: 10px;
  padding-left: 15px;
  border-radius: 5px;
}

.form-table .el-form-item {
  width: 49%;
  display: inline-block;
  vertical-align:middle;
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
  border-color: #409eff;
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
  background: #ffffff;
  position: relative;
  border-radius: 5px;
}

.row-height {
  border-radius: 5px;
}

.lce {
  background: #ffffff;
  height: 260px;
  border-radius: 5px;
}

.people-tree {
  height: 130px;
  overflow-y: scroll;
  z-index: 99;
}
</style>
