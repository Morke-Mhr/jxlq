<template>
  <div class="app-container appVersion">
    <div class="table-list">
      <el-button class="table-add-btn" @click="dialogVisible = true"
        >上传版本</el-button
      >
      <el-button class="table-default-btn" @click="deleteFun(selectIdArr)"
        >批量删除</el-button
      >
      <el-table
        :data="tableData"
        style="width: 100%;margin-top:30px;"
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column align="center" prop="versionNumber" label="版本号">
        </el-table-column>
        <el-table-column align="center" prop="createBy" label="上传人">
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="上传时间">
        </el-table-column>
        <el-table-column fixed="right" width="500" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="medium"
              @click="downLoadFile(scope.row)"
              >下载</el-button
            >
            <el-button
              type="text"
              size="medium"
              @click="deleteFun(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="pageSizes"
        :page-size="pageForm.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>

      <el-dialog
        class="tishiDialog"
        custom-class="small"
        :visible.sync="dialogVisible"
        title="上传移动端安装包"
      >
        <el-form
          :model="addData"
          :rules="rules"
          ref="addForm"
          label-width="80px"
        >
          <el-form-item class="tishi">
            <span>版本号格式举例：1.1.10或V1.1.10</span>
          </el-form-item>
          <el-form-item label="版本号:" prop="versionNumber">
            <el-input
              v-model="addData.versionNumber"
              maxlength="30"
              placeholder="请输入模型名称"
            />
          </el-form-item>

          <el-form-item label="安装包:" prop="apkFiles">
            <el-upload
              :action="getUrl"
              :headers="geHeaders"
              :on-success="sucUpload"
              :on-remove="remUpload"
              :before-upload="beforeAvatarUpload"
              :file-list="addData.apkFiles"
              list-type="text"
              :limit="1"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <div style="text-align:right;">
          <el-button type="danger" @click="dialogVisible = false"
            >取消</el-button
          >
          <el-button type="primary" @click="confirm('addForm')">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { versionManagement, apkUpload, delUpload } from '@/api/system/process'

export default {
  data() {
    var AppNumber = (rule, value, callback) => {
      let reg = /^(([A-Za-z])*[1-9]|[1-9][0-9]*)+(\.(0|[1-9][0-9]*))+(\.(0|[1-9][0-9]*|[1-9][0-9]*([A-Za-z0-9])*))+$/
      if (!value) {
        callback(new Error('请输入版本号'))
      } else if (!reg.test(value)) {
        callback(new Error('请检查输入的版本号格式是否正确'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        versionNumber: [
          {
            validator: AppNumber,
            trigger: 'blur'
          }
        ],
        apkFiles: [
          { required: 'array', message: '请上传安装包', trigger: 'change' }
        ]
      },
      tableData: [],
      pageForm: {
        pageNum: 1,
        pageSize: 10
      },
      total: 10,
      pageSizes: [1, 5, 10, 15, 20],
      dialogVisible: false,
      addData: {
        versionNumber: '',
        apkFiles: []
      },
      selectIdArr: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      let asyncData = await versionManagement(this.pageForm)
      this.tableData = asyncData.rows
      this.total = asyncData.total
    },
    handleSelectionChange(selectArr) {
      this.selectIdArr = selectArr.map((item) => {
        return item.id
      })
    },
    handleSizeChange(val) {
      this.pageForm.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val
      this.getList()
    },
    deleteFun(delArr) {
      this.$confirm('正在执行不可逆操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          if (Array.isArray(delArr)) {
            console.log(delArr, 'delArr')
          } else {
            delArr = [delArr]
          }
          let res = await delUpload(delArr)
          this.getList()
          this.$message.success(res)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    downLoadFile(rowData) {
      console.log(rowData)
      let fileDowloadName =
        this.$store.state.apiConfiguration.url +
        'jxlq-system-service' +
        '/fs/download?name=' +
        rowData.name +
        '&path=' +
        rowData.url
      location.href = fileDowloadName
    },
    confirm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let needData = {
            versionNumber: this.addData.versionNumber,
            name: this.addData.apkFiles[0].response.body.fileName,
            url: this.addData.apkFiles[0].response.body.url,
            size: this.addData.apkFiles[0].response.body.size
          }
          let res = await apkUpload(needData)
          this.getList()
          this.addData.versionNumber = ''
          this.addData.apkFiles = []
          this.dialogVisible = false
          this.$message.success(res)
        }
      })
    },
    // 文件上传前
    beforeAvatarUpload(file) {
      let extension = file.name.split('.')[file.name.split('.').length - 1]
      let extensionList = ['apk']
      if (extensionList.indexOf(extension) < 0) {
        this.$message.error('上传失败！只能上传apk格式文件!')
        return false
      }
    },
    // 文件上传成功后
    sucUpload(response, file, fileList) {
      this.addData.apkFiles = fileList
    },
    remUpload(file, fileList) {
      this.addData.apkFiles = fileList
    }
  },
  computed: {
    getUrl() {
      return (
        this.$store.state.apiConfiguration.url + 'jxlq-system-service/fs/upload'
      )
    },
    geHeaders() {
      return { Authorization: getToken() }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .menus-table {
    margin-top: 15px;
  }
  .permission-tree {
    margin-bottom: 15px;
  }
  .upload-demo {
    display: inline-block;
  }
}
.el-form-item__label {
  width: 120px;
}
.el-dialog__body {
  position: relative;
  .el-icon-full-screen {
    position: absolute;
    right: 50px;
    top: 22px;
    cursor: pointer;
  }
}
</style>
<style lang="scss">
.appVersion {
  .tishiDialog {
    .el-dialog__body {
      padding-top: 10px;
    }
  }
  .tishi {
    margin: 15px 0 5px !important;
    .el-form-item__content {
      color: #e6a23c;
      height: auto;
      line-height: 1;
    }
  }
}
</style>
