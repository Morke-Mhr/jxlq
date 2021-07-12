<template>
  <div class="app-container container-table">
    <div class="table-list">
      <el-button class="table-add-btn" v-has="has.add" @click="handleAdd()"
        >新增</el-button
      >

      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%;margin-top:30px;"
        @selection-change="handleSelectionChange"
        row-key="modelId"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        stripe
      >
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column align="center" label="名称">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column align="center" label="流程定义KEY">
          <template slot-scope="scope">{{ scope.row.key }}</template>
        </el-table-column>
        <el-table-column align="center" label="版本">
          <template slot-scope="scope">{{ scope.row.version }}</template>
        </el-table-column>
        <el-table-column align="center" label="部署时间">
          <template slot-scope="scope">{{ scope.row.createbyTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">{{ scope.row.status }}</template>
        </el-table-column>
        <el-table-column fixed="right" width="500" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-has="has.edit"
              size="medium"
              @click="handleEdit(scope)"
              >编辑</el-button
            >
            <el-button
              type="text"
              v-has="has.remove"
              size="medium"
              @click="handleIssue(scope)"
              >发布</el-button
            >
            <el-button
              type="text"
              v-has="has.edit"
              size="medium"
              @click="handleAnnul(scope)"
              >撤销</el-button
            >
            <el-button
              type="text"
              v-has="has.remove"
              size="medium"
              @click="handleDelete(scope)"
              >删除</el-button
            >
            <el-button
              type="text"
              v-has="has.edit"
              size="medium"
              @click="handlePut(scope)"
              >挂起</el-button
            >
            <el-button
              type="text"
              v-has="has.edit"
              size="medium"
              @click="handleActive(scope)"
              >激活</el-button
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
        :visible.sync="dialogIframe"
        custom-class="large"
        :fullscreen="open"
      >
        <i class="el-icon-full-screen" @click="fullScreen"></i>
        <div style="height:600px">
          <iframe
            :src="url"
            ref="bdIframe"
            id="bdIframe"
            width="100%"
            height="100%"
            frameborder="0"
            scrolling="no"
          ></iframe>
        </div>
      </el-dialog>

      <el-dialog
        :visible.sync="dialogVisible"
        custom-class="small"
        :title="this.addTit"
      >
        <el-form
          :model="addData"
          :rules="formRules"
          ref="operationFome"
          label-width="80px"
          label-position="left"
        >
          <el-form-item label="模型名称" prop="name">
            <el-input
              v-model="addData.name"
              maxlength="30"
              show-word-limit
              placeholder="请输入模型名称"
            />
          </el-form-item>

          <el-form-item label="模型KEY" prop="key">
            <el-input
              v-model="addData.key"
              maxlength="30"
              show-word-limit
              placeholder="请输入模型KEY"
            />
          </el-form-item>

          <el-form-item label="描述" prop="description">
            <el-input
              v-model="addData.description"
              maxlength="100"
              show-word-limit
              placeholder="请输入描述"
            />
          </el-form-item>

          <el-form-item label="版本信息" prop="reversion">
            <el-input
              v-model="addData.reversion"
              maxlength="30"
              show-word-limit
              placeholder="请输入版本信息 (只能输入整数)"
            />
          </el-form-item>
        </el-form>
        <div style="text-align:right;">
          <el-button type="danger" @click="dialogVisible = false"
            >取消</el-button
          >
          <el-button type="primary" @click="confirm">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getAllProcessList,
  getProcessMap,
  getIssue,
  getAnnul,
  getPut,
  getDelete,
  getEdit,
  getActive,
  getAddProcessForm
} from '@/api/system/process'
import { getToken, setToken } from '@/utils/auth'
import { isEnglish, isNumber } from '@/utils/validate.js'
export default {
  data() {
    return {
      has: {
        remove: 'system:menu:remove',
        query: 'system:menu:query',
        add: 'system:menu:add',
        edit: 'system:menu:edit'
      },
      dialogIframe: false,
      addTit: '新增',
      modelId: '',
      pageForm: {
        pageNum: 1,
        pageSize: 10
      },
      addData: {
        name: '',
        key: '',
        description: '',
        reversion: ''
      },
      dialogVisible: false,
      open: false,
      total: 100,
      pageSizes: [10, 15, 20, 25, 30],
      loading: false,
      tableData: [],
      multipleSelection: [],
      //表单验证方法
      formRules: {
        key: [
          {
            required: true,
            trigger: 'blur',
            message: '只能输入英文,不能输入其他字符',
            validator: (rule, value, callback) => {
              if (value == null || value == undefined || value == '') {
                callback(new Error('只能输入英文,不能输入其他字符'))
              } else {
                if (!isEnglish(value)) {
                  callback(new Error('输入格式不正确'))
                } else {
                  callback()
                }
              }
            }
          }
        ],
        name: [
          {
            required: true,
            message: '请输入模型名称',
            trigger: 'blur'
          }
        ],
        description: [
          {
            required: true,
            message: '请输入描述',
            trigger: 'blur'
          }
        ],
        // reversion: [{
        //   required: true,
        //   message: '请输入版本信息',
        //   trigger: 'blur'
        // }],
        reversion: [
          {
            required: true,
            trigger: 'blur',
            message: '只能输入数字格式',
            validator: (rule, value, callback) => {
              if (value == null || value == undefined || value == '') {
                callback(new Error('只能输入数字格式'))
              } else {
                if (!isNumber(value)) {
                  callback(new Error('输入格式不正确'))
                } else {
                  callback()
                }
              }
            }
          }
        ]
      }
      //表单验证方法
    }
  },
  watch: {},
  computed: {
    url: function() {
      const serviceName = this.$store.state.serviceName.process
      console.log(this.$store.state.serviceName.process + '服务名')
      return (
        this.$store.state.apiConfiguration.url +
        serviceName +
        '/editor?modelId=' +
        this.modelId +
        '?Authorization=' +
        getToken()
      )
    }
  },
  created() {
    this.getProcess()
    this.closeDialogIframe()
  },
  mounted() {},
  methods: {
    closeDialogIframe() {
      let that = this
      window.addEventListener(
        'message',
        function(e) {
          var Date = e.data
          if (Date != '') {
            that.dialogIframe = false
          }
        },
        false
      )
    },
    //弹窗放大
    fullScreen() {
      this.open = !this.open
    },
    //关闭弹框的事件
    closeDialog(formName) {
      this.open = false
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getProcess()
    },
    handleSelectionChange(val) {
      if (val) {
        let arr = []
        for (let i = 0; i < val.length; i++) {
          let itme = val[i]
          arr.push(itme.id)
        }
        this.multipleSelection = [...arr]
      }
    },
    //获取列表
    async getProcess() {
      this.loading = true
      const res = await getAllProcessList(this.pageForm)
      this.tableData = res.rows
      this.total = res.total
      this.loading = false
    },
    //编辑
    handleEdit(scope) {
      this.dialogIframe = true
      this.modelId = scope.row.id
      //   this.$router.push({
      //     path: "/processMap",
      //     query: {
      //       modelId: scope.row.id,
      //     },
      //   });
    },
    //删除
    handleDelete(scope) {
      let row = scope ? scope.row : null
      this.$confirm('确定删除此流程吗?', '删除流程', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await getDelete(row.id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getProcess()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    //发布
    handleIssue(scope) {
      let row = scope ? scope.row : null
      this.$confirm('确定发布此流程吗?', '发布流程', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await getIssue(row.id)
          this.$message({
            type: 'success',
            message: '发布成功!'
          })
          this.getProcess()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    //撤销
    handleAnnul(scope) {
      let row = scope ? scope.row : null
      this.$confirm('确定撤销此流程吗?', '撤销流程', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await getAnnul(row.id)
          this.$message({
            type: 'success',
            message: '撤销成功!'
          })
          this.getProcess()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    //挂起
    handlePut(scope) {
      let row = scope ? scope.row : null
      this.$confirm('确定挂起此流程吗?', '挂起流程', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await getPut(row.id)
          this.$message({
            type: 'success',
            message: '挂起成功!'
          })
          this.getProcess()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    //激活
    handleActive(scope) {
      let row = scope ? scope.row : null
      this.$confirm('确定激活此流程吗?', '激活流程', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await getActive(row.id)
          this.$message({
            type: 'success',
            message: '激活成功!'
          })
          this.getProcess()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    //新增弹窗
    async handleAdd() {
      this.dialogVisible = true
      if (this.$refs['operationFome']) {
        this.$refs['operationFome'].resetFields()
      }
    },
    async confirm(scope) {
      this.$refs.operationFome.validate(async (valid) => {
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
        data = await getAddProcessForm(this.addData)
        this.dialogVisible = false
        this.$notify({
          title: data ? '成功' : '失败',
          dangerouslyUseHTMLString: true,
          message: data ? data.message : '服务器开小差了，请稍后再试',
          type: data ? 'success' : 'warning'
        })
        this.getProcess()
        // this.$router.push({
        // 	path: '/addProcessMap',
        // })
      })
    },
    //新增流程图跳转页面

    createrProcess() {
      this.$router.push({
        path: '/processMap'
      })
    },
    handleSelectionChange(val) {
      if (val) {
        let arr = []
        for (let i = 0; i < val.length; i++) {
          let itme = val[i]
          arr.push(itme.id)
        }
        this.multipleSelection = [...arr]
      }
    },
    handleSizeChange(val) {
      this.pageForm.pageSize = val
      this.getProcess()
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val
      this.getProcess()
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

.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;
  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  .icon-item {
    margin: 10px;
    height: 65px;
    text-align: center;
    width: 80px;
    float: left;
    font-size: 20px;
    color: #ffffff;
    cursor: pointer;
  }
  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }
  .disabled {
    pointer-events: none;
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
