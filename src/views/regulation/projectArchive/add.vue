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
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model="ruleForm.projectName"
            :disabled="true"
            style="width: 690px;"
            placeholder="请输入"
          ></el-input>
          <el-button @click="chooseList">获取列表</el-button>
        </el-form-item>
        <el-form-item label="项目标段">
          <!-- <el-input
            v-model="ruleForm.bid"
             :disabled="true"
            style="border: none;"
          ></el-input> -->
          <p style="line-height: 12px;">{{ruleForm.bid}}</p>
        </el-form-item>
        <el-form-item label="项目阶段" prop="projectStage">
          <el-input
            v-model="ruleForm.projectStage"
            placeholder="请输入"
            type="textarea"
            autocomplete="off"
            maxlength="50"

            show-word-limit
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
          <!-- <el-input
            v-model="ruleForm.docType"
            placeholder="请输入"
            autocomplete="off"
            maxlength="50"
            show-word-limit
          ></el-input> -->
        </el-form-item>
        <el-form-item label="资料名称" prop="docName">
          <el-input
            v-model="ruleForm.docName"
            placeholder="请输入"
            autocomplete="off"
            maxlength="50"
            type="textarea"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="资料附件" prop="projectDocFile">
          <div class="upload">
            <el-upload
              ref="upload"
              class="upload-demo"
              :action="getUrl"
              :on-preview="handlePreview"
              :before-remove="beforeRemove"
              :on-success="uploadSuccess"
              :before-upload="beforeUpload"
              :on-remove="handleRemove"
              multiple
              :limit="5"
              :file-list="fileList"
              name="file"
            >
              <el-button>选择文件</el-button>
              <div slot="tip" class="el-upload__tip" style="line-height: 16px">
                只能上传bmp、jpg，png，gif（10M）；AVI、rmvb、FLV、mp4、3GP（1G）；Doc、docx、xls、xlsx、txt、PDF（100M）；RAR、ZIP（50M）；MP3（50M）格式文件，
              </div>
              <span v-if="flag == false">点击文件下载</span>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="资料版本" prop="docVersion">
          <el-input
            v-model="ruleForm.docVersion"
            placeholder="请输入"
            autocomplete="off"
            type="textarea"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <!--新增盒子-->
      <el-dialog
        :visible.sync="dialogVisible"
        custom-class="large"
        :title="'新增列表'"
        :close-on-click-modal="false"
        append-to-body
      >
        <div class="inquire">
          <el-form
            :inline="true"
            :model="formInline"
            ref="formInline"
            class="demo-form-inline"
          >
            <el-form-item label="项目名称" prop="projectName">
              <el-input
                v-model="formInline.projectName"
                placeholder="项目名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="项目标段" prop="bid">
              <el-input
                v-model="formInline.bid"
                placeholder="项目标段"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="chaxun" @click="onSubmit">查询</el-button>
              <el-button class="chongzhi" @click="onClear('formInline')"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
        </div>

        <el-table
          :data="addTableData"
          ref="multipleTable"
          tooltip-effect="dark"
          v-loading="loading"
          style="width: 100%"
          :header-cell-style="{ color: '#000000', 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
          stripe
        >
          <el-table-column align="center" label="项目名称">
            <template slot-scope="scope">{{ scope.row.projectName }}</template>
          </el-table-column>
          <el-table-column align="center" label="标段">
            <template slot-scope="scope">{{ scope.row.bid }}</template>
          </el-table-column>
          <el-table-column prop="cz" label="操作">
            <template slot-scope="scope">
              <!-- 这里可以拿到当前行的内容 row -->
              <el-button
                size="small"
                type="text"
                style="margin-left: 10px"
                @click="goRedact(scope, addTableData)"
                >确定</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSize"
          background
          layout="total, prev, pager, next, sizes, jumper"
          :total="total"
        ></el-pagination>
        <span slot="footer" class="dialog-footer">
          <el-button class="fBtn" @click="dialogVisible = false"
            >关 闭</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getAddList,
  getProject,
  ProjectInquire,
  Classification
} from '@/api/regulation/project'

export default {
  components: {},
  data() {
    return {
      has: {
        add: 'laws:projectDoc:add',
        deletefile: 'laws:projectDocFile:deletefile' //附件
      },
      addTableData: [],
      fileList: [],
      flag: true,
      loading: true,
      project: [],
      options: [], //资料类别
      arr: [],
      dialogVisible: false,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      //头部查询
      formInline: {
        projectName: '',
        bid: ''
      },
      ruleForm: {
        //新增表单数据
        projectName: '',
        projectId: '',
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
    async chooseList() {
      this.dialogVisible = true
      let res = await getProject()
      this.addTableData = res.rows
      this.total = res.total
      this.loading = false
    },
    goRedact(scope) {
      let data = scope.row
      this.ruleForm.projectName = data.projectName
      this.ruleForm.projectId = data.projectId
      this.ruleForm.bid = data.bid
      this.dialogVisible = false
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
    //重置
    onClear(formName) {
      this.$refs[formName].resetFields()
      this.chooseList()
    },
    //取消
    resetForm() {
      this.$emit('func')
    },

    //新增表单
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let data = null
          try {
            data = await getAddList(this.ruleForm)
            this.$refs[formName].resetFields()
            this.$emit('func')
          } catch (e) {
            console.error('接口异常')
          }
          this.$refs.upload.clearFiles()
          this.$notify({
            title: data ? '成功' : '失败',
            dangerouslyUseHTMLString: true,
            message: data ? data.message : '服务器开小差了，请稍后再试',
            type: data ? 'success' : 'warning'
          })
        }
      })
    },
    //提交查询
    async onSubmit() {
      try {
        let resdata = this.formInline
        let { projectName, bid } = resdata
        let data = await ProjectInquire(1, this.pageSize, projectName, bid)
        this.addTableData = data.rows
        this.loading = false
      } catch (e) {
        console.error('接口异常')
      }
    },
    //分页查询
    async onPaging() {
      try {
        let resdata = this.formInline
        let { projectName, bid } = resdata
        let data = await ProjectInquire(
          this.pageNum,
          this.pageSize,
          projectName,
          bid
        )
        this.addTableData = data.rows
        console.log(this.addTableData)
        this.loading = false
      } catch (e) {
        console.error('接口异常')
      }
    },

    handlePreview(file) {
      if (this.flag == false) {
        this.fileDowloadName =
          this.$store.state.apiConfiguration.url +
          `/fs/download?name=${encodeURI(encodeURI(file.name))}&path=${
            file.url
          }`
        location.href = this.fileDowloadName
      }
    },

    handleRemove(file, fileList) {
      let index = this.ruleForm.projectDocFile.findIndex((ele) => {
        return ele.url === file.response.body.url
      })
      // debugger;
      if (index == -1) {
        return console.log('删除失败')
      }
      //删除元素
      this.ruleForm.projectDocFile.splice(index, 1)
      // await fsDelete(file.fileId);
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
    //文件大小
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
        return false
      }
      if (!isLt2M) {
        this.ruleForm.projectDocFile = []
        this.$message({
          message: '上传文件大小超过限制!',
          type: 'warning'
        })
        return false
      }
    },
    /**
     * 分页器
     */
    handleSizeChange(val) {
      this.pageSize = val
      this.onPaging()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.onPaging()
    }
  }
}
</script>
<style lang="scss" scoped>
// .demo-ruleForm /deep/{
//   .el-textarea{
//     width: 450px;
//   }
// }
.content_add_box {
  background-color: #fff;
  padding: 15px 0;
  .content_add {
    margin: auto;
    height: 100%;
    .dialog-footer {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
