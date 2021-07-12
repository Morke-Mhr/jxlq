<template>
  <div class="app-container container-table">
    <div class="sxForm">
      <el-form
        :inline="true"
        :model="pageForm"
        ref="pageForm"
        class="demo-form-inline"
      >
        <el-form-item prop="configName" label="参数名称">
          <el-input
            v-model="pageForm.configName"
            maxlength="30"
            placeholder="参数名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="configKey" label="参数键名">
          <el-input
            v-model="pageForm.configKey"
            maxlength="30"
            placeholder="参数键名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="status" label="系统内置">
          <el-select v-model="pageForm.configType" placeholder="系统内置">
            <el-option label="请选择" value=""></el-option>
            <el-option label="是" value="Y"></el-option>
            <el-option label="否" value="N"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="日期范围">
          <el-date-picker
            v-model="dateList"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
        <el-button
          class="chaxun"
          icon="el-icon-search"
          v-has="has.query"
          @click="getList()"
          >查询</el-button
        >
        <el-button @click="resetForm('pageForm')" class="chongzhi"
          >重置</el-button
        >
        </el-form-item>
      </el-form>
    </div>
    <div class="table-list">
      <el-button class="table-add-btn" v-has="has.add" @click="handleAdd()">
        添加参数
      </el-button>
      <el-button
        class="table-default-btn"
        v-has="has.remove"
        @click="handleDelete()"
      >
        删除参数
      </el-button>

      <el-table
        :data="tableData"
        v-loading="listLoading"
        style="width: 100%;margin-top:30px;"
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column align="center" label="参数名称">
          <template slot-scope="scope">
            {{ scope.row.configName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="参数键名">
          <template slot-scope="scope">
            {{ scope.row.configKey }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="参数键值">
          <template slot-scope="scope">
            {{ scope.row.configValue }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="系统内置">
          <template slot-scope="scope">
            <span v-if="scope.row.configType == 'Y'">是</span>
            <span v-if="scope.row.configType == 'N'">否</span>
          </template>
        </el-table-column>
        <el-table-column align="header-center" label="描述">
          <template slot-scope="scope">
            {{ scope.row.remark }}
          </template>
        </el-table-column>
        <el-table-column align="header-center" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="150" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-has="has.edit"
              size="medium"
              @click="handleEdit(scope)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              v-has="has.remove"
              size="medium"
              @click="handleDelete(scope)"
            >
              删除
            </el-button>
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
      >
      </el-pagination>

      <el-dialog
        custom-class="large"
        :visible.sync="dialogVisible"
        :title="dialogType === 'edit' ? '修改参数信息' : '添加参数信息'"
      >
        <el-form
          :model="config"
          :rules="formRules"
          ref="operationFome"
          label-width="80px"
          label-position="left"
        >
          <el-form-item label="参数名称" prop="configName">
            <el-input
              v-model="config.configName"
              maxlength="30"
              show-word-limit
              placeholder="参数名称"
            />
          </el-form-item>
          <el-form-item label="参数键名" prop="configKey">
            <el-input
              v-model="config.configKey"
              maxlength="30"
              show-word-limit
              placeholder="参数键名"
            />
          </el-form-item>

          <el-form-item label="参数键值" prop="configValue">
            <el-input
              v-model="config.configValue"
              maxlength="30"
              show-word-limit
              placeholder="参数键值"
            />
          </el-form-item>

          <el-form-item label="系统内置" prop="configType">
            <el-radio-group v-model="config.configType">
              <el-radio :label="'Y'">是</el-radio>
              <el-radio :label="'N'">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              v-model="config.remark"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              placeholder="用户描述"
            />
          </el-form-item>
        </el-form>
        <div style="text-align:right;">
          <el-button class="confirm-btn" @click="confirm">
            提交
          </el-button>
          <el-button class="cancel-btn" @click="dialogVisible = false">
            取消
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getConfigList,
  addConfig,
  updateConfig,
  deleteConfig,
  getConfigInfo
} from '@/api/system/config.js'

const defaultConfig = {
  configId: '',
  configKey: '',
  configName: '',
  configValue: '',
  configType: 'Y',
  remark: ''
}

const MODULE_NAME = '参数'

export default {
  name: 'index',
  data() {
    return {
      has: {
        remove: 'system:config:remove',
        query: 'system:config:query',
        add: 'system:config:add',
        edit: 'system:config:edit'
      },
      dateList: [],
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        configName: '',
        configKey: '',
        configType: '',
        beginTime: '',
        endTime: ''
      },
      config: {
        configId: '',
        configKey: '',
        configName: '',
        configValue: '',
        configType: 'Y',
        remark: ''
      },
      multipleSelection: [],
      tableData: [],
      tableKey: 0,
      total: 100,
      pageSizes: [10, 15, 20, 25, 30],
      listLoading: false,
      dialogVisible: false,
      dialogType: 'new',
      //表单验证方法
      formRules: {
        configName: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ],
        configKey: [
          {
            required: true,
            message: '请输入参数键名',
            trigger: 'blur'
          }
        ],
        configValue: [
          {
            required: true,
            message: '请输入参数键值',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {},
  created: function() {
    this.getList()
  },
  methods: {
    handleAdd() {
      this.dialogType = 'new'
      this.dialogVisible = true
      if (this.$refs['operationFome']) {
        this.$refs['operationFome'].resetFields()
      }
      this.config = defaultConfig
      //operationFome
    },
    async handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      if (this.$refs['operationFome']) {
        this.$refs['operationFome'].resetFields()
      }
      let configId = scope.row.configId
      this.config = await getConfigInfo(configId)
    },
    handleDelete(scope) {
      if (!scope && this.multipleSelection.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的' + MODULE_NAME + '!'
        })
        return
      }
      let row = scope ? scope.row : null
      this.$confirm('确定删除' + MODULE_NAME + '吗?', '删除' + MODULE_NAME, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteConfig(row ? row.configId : this.multipleSelection)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    resetForm(formName) {
      this.dateList = []
      this.pageForm.beginTime = ''
      this.pageForm.endTime = ''
      this.$refs[formName].resetFields()
      this.getList()
    },
    async getList() {
      this.listLoading = true
      if (this.dateList.length > 0) {
        this.pageForm.beginTime = this.$dateFormat(
          'yyyy-MM-dd',
          this.dateList[0]
        )
        this.pageForm.endTime = this.$dateFormat('yyyy-MM-dd', this.dateList[1])
      }
      const res = await getConfigList(this.pageForm)
      this.tableData = res.rows
      this.total = res.total
      this.listLoading = false
    },
    async confirm() {
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
        const isEdit = this.dialogType === 'edit'
        let data = null
        try {
          if (isEdit) {
            data = await updateConfig(this.config)
          } else {
            data = await addConfig(this.config)
          }
        } catch (e) {
          console.error('接口异常')
        }
        this.dialogVisible = false
        this.$notify({
          title: data ? '成功' : '失败',
          dangerouslyUseHTMLString: true,
          message: data ? data.body : '服务器开小差了，请稍后再试',
          type: data ? 'success' : 'warning'
        })
        this.getList()
      })
    },
    handleSelectionChange(val) {
      if (val) {
        let arr = []
        for (let i = 0; i < val.length; i++) {
          let itme = val[i]
          arr.push(itme.configId)
        }
        this.multipleSelection = [...arr]
      }
    },
    handleSizeChange(val) {
      this.pageForm.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
