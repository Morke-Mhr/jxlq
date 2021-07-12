<template>
  <!-- 施工方案 -->
  <!-- <div class="read-only">
      </div> -->
  <div>
    <el-row class="row-height">
      <el-col :span="24">
        <div class="area-tit">基础信息</div>

        <el-form
          :model="itemSelInfo"
          ref="itemSelInfo"
          label-width="100px"
          class="form-table"
        >
          <el-form-item label="方案名称">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3}"
              v-model="itemSelInfo.programName"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="性质" prop="nature">
            <el-input
              type="input"
              v-model="itemSelInfo.nature"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="类别">
            <el-input
              type="input"
              v-model="itemSelInfo.category"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="项目名称">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3}"
              v-model="itemSelInfo.projectName"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="标段">
            <el-input
              type="input"
              v-model="itemSelInfo.bid"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="参建子公司">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3}"
              v-model="itemSelInfo.projectDept"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="编写人">
            <el-input
              type="input"
              v-model="itemSelInfo.createBy"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="编写部门">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3}"
              v-model="itemSelInfo.createByDept"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="编写日期">
            <div class="block">
              <el-date-picker
                v-model="itemSelInfo.createTime"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :disabled="true"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="内容">
            <el-input
              v-model="itemSelInfo.content"
              type="textarea"
              :autosize="{ minRows: 3}"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="附件" class="zindex">
            <el-upload
              class="upload-demo"
              action=""
              :on-preview="handlePreview"
              multiple
              :file-list="fileList"
            >
            </el-upload>
            <div class="shade" v-show="true"></div>
          </el-form-item>
          <el-form-item></el-form-item>
          <!-- <el-form-item label="备案签字文件" prop="createByDept">
              <el-button type="primary" @click="downLoadSignFile()">下载备案签字文件</el-button>
            </el-form-item> -->
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { viewBusinessInfo } from '@/api/system/process'
export default {
  props: {
    businessKey: String,
    businessCode: String
  },
  data() {
    return {
      itemSelInfo: {},
      fileList: []
    }
  },
  created: async function() {
    this.getSelInfo()
  },
  computed: {},

  methods: {
    //获取方案设计信息
    async getSelInfo() {
      this.loading = true
      const res = await viewBusinessInfo(this.businessCode, this.businessKey)
      //  res.body.createTime=(res.body.createTime.slice(0,3)).join("-")
      this.itemSelInfo = res.body

      let fileData = res.body.workProgramFileList
      fileData.forEach((file) => {
        file.name = file.fileName
        file.url = file.fileUrl
        delete file.fileName // 删除原有的字段，也可以不删除
      })
      this.fileList = [...fileData]
      this.loading = false
    },

    //下载附件
    handlePreview(file) {
      let row = file
      this.fileDowloadName =
        this.$store.state.apiConfiguration.url +
        `fs/download?name=${encodeURI(encodeURI(row.name))}&path=${row.url}`
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
        'fs/download?path=' +
        fileForm.path
      location.href = this.fileDowloadName
    }
  }
}
</script>

<style lang="scss" scoped>
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
  content: '';
  width: 4px;
  height: 20px;
  background: rgba(13, 116, 215, 1);
  vertical-align: -4px;
  margin-right: 9px;
}
</style>
