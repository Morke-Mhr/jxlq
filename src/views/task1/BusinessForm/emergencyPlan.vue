<template>
  <!-- 应急预案 -->
  <div class="content_add_box">
    <!-- <div class="read-only">
      </div> -->
    <div class="content_add">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="类别">
          <el-input v-model="ruleForm.planClass" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="预案名称">
          <el-input v-model="ruleForm.planName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="预案内容">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3 }"
            :disabled="true"
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
              :disabled="true"
              :limit="1"
              :file-list="ruleForm.fileLists"
              name="file"
            >
              <!-- <el-button type="text">点击下载文件</el-button> -->
            </el-upload>
            <div class="shade"></div>
          </div>
        </el-form-item>
        <el-form-item label="发布时间" prop="releaseTime">
          <div class="block">
            <el-date-picker
              v-model="ruleForm.releaseTime"
              value-format="yyyy-MM-dd"
              type="date"
              :disabled="true"
            ></el-date-picker>
          </div>
        </el-form-item>
      </el-form>
      <div class="dialog-footer"></div>
    </div>
  </div>
</template>

<script>
import Sdialog from '@/components/selectDialog' //通过部门选择人
import { viewBusinessInfo } from '@/api/system/process'

export default {
  components: {
    Sdialog
  },
  props: {
    businessKey: String,
    businessCode: String
  },
  data() {
    return {
      has: {
        add: 'laws:projectDoc:add'
      },
      optionProps: {
        value: 'id'
      },
      options: [], //类别
      fileLists: [],
      flag: true,
      loading: false,
      ruleForm: {},
      rules: {},
      dialogVisible: false
    }
  },
  computed: {
    getUrl() {
      return (
        this.$store.state.apiConfiguration.url +
        'jxlq-system-service' +
        '/fs/upload'
      )
    }
  },
  created() {
    this.loading = true
    this.goCheck()
  },
  methods: {
    //查看
    async goCheck() {
      try {
        const changeData = await viewBusinessInfo(
          this.businessCode,
          this.businessKey
        )
        this.ruleForm = changeData.body
        let arry = []
        changeData.body.emergencyplanFileList.map((item) => {
          arry.push(
            Object.assign({}, { name: item.fileName, url: item.fileUrl })
          )
        })
        this.ruleForm.fileLists = [...arry]
      } catch (e) {
        console.error('接口异常')
      }
    },

    // 文件列表移除文件时的钩子
    async handleRemove(file, fileList) {
      if (this.flag == false) {
        let row = file
        await fsDelete(row.fileId)
        this.ruleForm.fileList = []
        this.$refs.upload.clearFiles()
      }
    },
    //下载
    handlePreview(file) {
      let row = file
      this.fileDowloadName =
        this.$store.state.apiConfiguration.url +
        'jxlq-system-service' +
        `/fs/download?name=${encodeURI(encodeURI(row.name))}&path=${row.url}`
      location.href = this.fileDowloadName
    }
  }
}
</script>
<style scoped>
.content_add_box {
  background-color: #fff;
  padding: 15px 0;
}
.content_add {
  margin: 2rem auto;
  width: 50%;
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
  content: '';
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
  width: 30%;
  top: 0;
  z-index: 999999;
  background-color: #fff;
}
/* .read-only{
   position: absolute;
  width: 100%;
  height: 100%;
  z-index: 999;
} */
/* .zindex{
  position: absolute;  
  z-index: 1999;
} */
</style>
