<template>
  <div class="content_add_box">
    <div class="content_add" v-loading="loading">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="项目名称" prop="projectName">
          <el-select
            v-model="ruleForm.projectName"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in project"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目标段" prop="bid">
          <el-input
            v-model="ruleForm.bid"
            placeholder="请输入"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目阶段" prop="projectStage">
          <el-input
            v-model="ruleForm.projectStage"
            placeholder="请输入"
            type="textarea"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="资料类别" prop="docType">
          <el-select
            v-model="ruleForm.docType"
            @change="selectWorkName"
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
        <el-form-item label="资料名称" prop="docName">
          <el-input
            v-model="ruleForm.docName"
            type="textarea"
            placeholder="请输入"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="资料附件" prop="projectDocFile">
          <div class="upload">
            <el-upload
              ref="upload"
              class="upload-demo"
              :action="getUrl"
              :on-remove="handleRemove"
              :on-preview="handlePreview"
              :before-remove="beforeRemove"
              :on-success="uploadSuccess"
              :before-upload="beforeUpload"
              multiple
              :limit="5"
              :file-list="fileList"
              name="file"
            >
              <el-button>选择文件</el-button>
              <div slot="tip" class="el-upload__tip" style="line-height: 16px">
                只能上传bmp、jpg，png，gif（10M）；AVI、rmvb、FLV、mp4、3GP（1G）；Doc、docx、xls、xlsx、txt、PDF（100M）；RAR、ZIP（50M）；MP3（50M）格式文件，
              </div>
              <span slot="tip" class="el-upload__tip" v-if="flag == false"
                >点击文件下载</span
              >
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="资料版本" prop="docVersion">
          <el-input
            v-model="ruleForm.docVersion"
            placeholder="请输入"
            type="textarea"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  getLookList,
  getChangeList,
  getProject,
  fsDelete,
  Classification
} from '@/api/regulation/project'

export default {
  props: {
    person: String
  },
  data() {
    return {
      has: {
        add: 'laws:projectDoc:add',
        deletefile: 'laws:projectDocFile:deletefile' //附件
      },
      fileList: [],
      flag: true,
      project: [],
      loading: true,
      arr: [],
      options: [], //资料类别
      ruleForm: {
        //新增表单数据
        projectName: '',
        bid: '',
        projectStage: '',
        docType: '',
        docTypeId: '',
        docName: '',
        docVersion: '',
        projectDocFile: []
      },
      rules: {
        projectName: [{ required: true, message: '项目名称', trigger: 'blur' }],
        bid: [{ required: true, message: '标段', trigger: 'blur' }],
        projectStage: [
          { required: true, message: '项目阶段', trigger: 'blur' }
        ],
        docType: [{ required: true, message: '类别', trigger: 'blur' }],
        docName: [{ required: true, message: '资料名称', trigger: 'blur' }],
        projectDocFile: [{ required: true, message: '附件', trigger: 'blur' }],
        docVersion: [{ required: true, message: '版本', trigger: 'blur' }]
      },
      id: ''
    }
  },
  created() {
    this.id = this.person
    this.goRedact()
    this.Classification()
  },
  computed: {
    getUrl() {
      return (
        this.$store.state.apiConfiguration.url +
        this.$store.state.serviceName.jurisdiction +
        '/fs/upload'
      )
    }
  },
  methods: {
    //项目获取
    async getProject() {
      this.project = await getProject()
    },
    async goRedact() {
      try {
        let projectdocId = this.id
        let changeData = await getLookList(projectdocId)
        this.ruleForm = changeData
        this.fileList = changeData.projectDocFile
        this.loading = false
      } catch (e) {
        console.error('接口异常')
      }
    },
    //资料类型
    async Classification() {
      let data = 'datafile_type'
      this.options = await Classification(data)
    },

    selectWorkName(e) {
      this.options.map((item) => {
        if (item.dictLabel == e) {
          this.ruleForm.docTypeId = item.dictCode
        }
      })
    },

    //返回上一级路由
    back() {
      this.$router.back()
    },
    //修改
    changeForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          this.$notify({
            title: '操作失败',
            dangerouslyUseHTMLString: true,
            message: '请填写完整',
            type: 'warning'
          })
          return
        }
        let data = null
        try {
          data = await getChangeList(this.ruleForm)
          this.$refs[formName].resetFields()
          this.$refs.upload.clearFiles()
          this.$emit('func')
        } catch (e) {
          console.error('接口异常')
        }
        this.$notify({
          title: data ? '成功' : '失败',
          dangerouslyUseHTMLString: true,
          message: data ? data.message : '服务器开小差了，请稍后再试',
          type: data ? 'success' : 'warning'
        })
      })
    },
    // 文件列表移除文件时的钩子
    async handleRemove(file, fileList) {
      let index = this.ruleForm.projectDocFile.findIndex((ele) => {
        return ele.fileId === file.fileId
      })
      //假设没有找到
      console.log(index)
      if (index == -1) {
        return console.log('删除失败')
      }
      //删除元素
      this.ruleForm.projectDocFile.splice(index, 1)
      await fsDelete(file.fileId)
    },
    handlePreview(file) {
      this.fileDowloadName =
        this.$store.state.apiConfiguration.url +
        `fs/download?name=${encodeURI(encodeURI(file.name))}&path=${file.url}`
      location.href = this.fileDowloadName
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 上传成功时的钩子
    uploadSuccess(res, file, fileList) {
      if (res.code !== 200) {
        return this.$message({
          type: 'warning',
          message: '上传失败!'
        })
      }
      this.arr.push(res)
      let formImgList = []
      this.arr.forEach((item) => {
        formImgList.push({
          name: item.body.fileName,
          url: item.body.url
        })
      })
      this.ruleForm.projectDocFile = formImgList
    },
    //文件校验
    beforeUpload(file) {
      console.log(file)
      let FileFormat = file.name.substring(file.name.lastIndexOf('.') + 1)
      let testmsg = FileFormat.toLowerCase()
      const extension =
        testmsg === 'xls' ||
        testmsg === 'xlsx' ||
        testmsg === 'doc' ||
        testmsg === 'docx' ||
        testmsg === 'txt' ||
        testmsg === 'pdf' ||
        testmsg === 'bmp' ||
        testmsg === 'jpg' ||
        testmsg === 'png' ||
        testmsg === 'gif' ||
        testmsg === 'avi' ||
        testmsg === 'rmvb' ||
        testmsg === 'flv' ||
        testmsg === 'mp4' ||
        testmsg === '3gp' ||
        testmsg === 'rar' ||
        testmsg === 'zip' ||
        testmsg === 'mp3'

      const isLt2M = file.size / 1024 / 1024 < 1000
      if (!extension) {
        this.ruleForm.projectDocFile = []
        this.$message({
          message: '请上传正确的格式!',
          type: 'warning'
        })
      }
      if (!isLt2M) {
        this.ruleForm.projectDocFile = []
        this.$message({
          message: '上传文件大小超过限制!',
          type: 'warning'
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
// .demo-ruleForm /deep/{
//   .el-textarea{
//     width: 300px;
//   }
// }
.content_add_box {
  background-color: #fff;
  padding: 15px 0;
  .content_add {
    margin: 30px auto;
    .dialog-footer {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
