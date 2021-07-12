<template>
  <div class="app-container container-table">
    <div class="sxForm">
      <el-form
        :inline="true"
        :model="pageForm"
        ref="pageForm"
        class="demo-form-inline"
      >
        <el-form-item prop="title" label="模块标题">
          <el-input
            v-model="pageForm.title"
            maxlength="30"
            placeholder="模块标题"
          ></el-input>
        </el-form-item>
        <el-form-item prop="operName" label="操作人员">
          <el-input
            v-model="pageForm.operName"
            maxlength="30"
            placeholder="操作人员"
          ></el-input>
        </el-form-item>

        <el-form-item prop="businessType" label="业务类型">
          <el-select v-model="pageForm.businessType" placeholder="业务类型">
            <el-option label="请选择" value=""></el-option>
            <el-option label="其它" value="0"></el-option>
            <el-option label="新增" value="1"></el-option>
            <el-option label="修改" value="2"></el-option>
            <el-option label="删除" value="3"></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item prop="status" label="操作状态">
          <el-select v-model="pageForm.status" placeholder="操作状态">
            <el-option label="请选择" value=""></el-option>
            <el-option label="正常" value="0"></el-option>
            <el-option label="异常" value="1"></el-option>
          </el-select>
        </el-form-item> -->

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
            type="primary"
            v-has="has.query"
            class="chaxun"
            icon="el-icon-search"
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
      <el-button
        class="table-default-btn"
        v-has="has.remove"
        @click="handleDelete()"
      >
        删除日志
      </el-button>
      <el-button
        class="table-default-btn"
        v-has="has.remove"
        @click="handleClean()"
      >
        清空日志
      </el-button>

      <el-table
        :data="tableData"
        v-loading="listLoading"
        style="width: 100%;margin-top:30px;"
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column align="center" label="操作人员">
          <template slot-scope="scope">
            {{ scope.row.operName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作地点">
          <template slot-scope="scope">
            {{ scope.row.operLocation }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="模块标题">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="业务类型">
          <template slot-scope="scope">
            <span v-if="scope.row.businessType == '0'">其它</span>
            <span v-if="scope.row.businessType == '1'">新增</span>
            <span v-if="scope.row.businessType == '2'">修改</span>
            <span v-if="scope.row.businessType == '3'">删除</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == '0'">正常</span>
            <span v-if="scope.row.status == '1'">异常</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作时间 ">
          <template slot-scope="scope">
            {{ scope.row.operTime }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="180" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-has="has.see"
              size="medium"
              @click="handleSee(scope)"
            >
              查看
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
        :visible.sync="dialogVisible"
        title="查看详情"
        custom-class="large"
      >
        <el-form
          :model="operlog"
          ref="operationFome"
          label-width="80px"
          label-position="left"
        >
          <el-form-item label="模块标题" prop="title">
            <el-input
              v-model="operlog.title"
              maxlength="30"
              disabled="disabled"
              placeholder="模块标题"
            />
          </el-form-item>
          <el-form-item label="操作人员" prop="operName">
            <el-input
              v-model="operlog.operName"
              maxlength="30"
              disabled="disabled"
              placeholder="操作人员"
            />
          </el-form-item>
          <el-form-item label="操作地点" prop="operLocation">
            <el-input
              v-model="operlog.operLocation"
              maxlength="30"
              disabled="disabled"
              placeholder="操作地点"
            />
          </el-form-item>
          <el-form-item label="操作时间" prop="operTime">
            <el-input
              v-model="operlog.operTime"
              maxlength="30"
              disabled="disabled"
              placeholder="操作时间"
            />
          </el-form-item>
          <el-form-item label="主机地址" prop="operIp">
            <el-input
              v-model="operlog.operIp"
              maxlength="30"
              disabled="disabled"
              placeholder="主机地址"
            />
          </el-form-item>
          <el-form-item label="请求URL" prop="operUrl">
            <el-input
              v-model="operlog.operUrl"
              maxlength="30"
              disabled="disabled"
              placeholder="请求URL"
            />
          </el-form-item>
          <el-form-item label="请求参数" prop="operParam">
            <el-input
              v-model="operlog.operParam"
              maxlength="30"
              disabled="disabled"
              placeholder="请求参数"
            />
          </el-form-item>
          <el-form-item label="请求方式" prop="requestMethod">
            <el-input
              v-model="operlog.requestMethod"
              maxlength="30"
              disabled="disabled"
              placeholder="请求方式"
            />
          </el-form-item>
          <el-form-item label="方法名称" prop="method">
            <el-input
              v-model="operlog.method"
              maxlength="30"
              disabled="disabled"
              placeholder="方法名称"
            />
          </el-form-item>

          <el-form-item label="返回参数">
            <el-input
              v-model="operlog.jsonResult"
              disabled="disabled"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              placeholder="用户描述"
            />
          </el-form-item>

          <el-form-item label="错误消息" prop="errorMsg">
            <el-input
              v-model="operlog.errorMsg"
              maxlength="30"
              disabled="disabled"
            />
          </el-form-item>

          <el-form-item label="操作状态" prop="businessType">
            <el-radio-group v-model="operlog.businessType">
              <el-radio disabled :label="0">其他</el-radio>
              <el-radio disabled :label="1">新增</el-radio>
              <el-radio disabled :label="2">修改</el-radio>
              <el-radio disabled :label="3">删除</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="操作状态" prop="status">
            <el-radio-group v-model="operlog.status">
              <el-radio disabled :label="0">正常</el-radio>
              <el-radio disabled :label="1">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div style="text-align:right;">
          <el-button type="danger" @click="dialogVisible = false">
            取消
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getOperLogList,
  cleanOperLog,
  deleteOperLog,
  getOperLogInfo
} from '@/api/log/operLog.js'

const MODULE_NAME = '操作日志'

export default {
  name: 'index',
  data() {
    return {
      has: {
        remove: 'system:operlog:remove',
        see: 'system:operlog:see',
        query: 'system:operlog:query',
        add: 'system:operlog:add',
        edit: 'system:operlog:edit'
      },
      dateList: [],
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        title: '',
        operName: '',

        businessType: '',
        status: '',
        beginTime: '',
        endTime: ''
      },
      operlog: {},
      dialogVisible: false,
      multipleSelection: [],
      tableData: [],
      tableKey: 0,
      total: 100,
      pageSizes: [10, 15, 20, 25, 30],
      listLoading: false
    }
  },
  computed: {},
  created: function() {
    this.getList()
  },
  methods: {
    handleClean() {
      this.$confirm('确定清空' + MODULE_NAME + '吗?', '清空' + MODULE_NAME, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await cleanOperLog()
          this.$message({
            type: 'success',
            message: '清空成功!'
          })
          this.getList()
        })
        .catch((err) => {
          console.error(err)
        })
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
          await deleteOperLog(row ? row.operId : this.multipleSelection)
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
    async handleSee(scope) {
      let operId = scope.row.operId
      this.operlog = await getOperLogInfo(operId)
      this.dialogVisible = true
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
      const res = await getOperLogList(this.pageForm)
      this.tableData = res.rows
      this.total = res.total
      this.listLoading = false
    },
    handleSelectionChange(val) {
      if (val) {
        let arr = []
        for (let i = 0; i < val.length; i++) {
          let itme = val[i]
          arr.push(itme.operId)
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
