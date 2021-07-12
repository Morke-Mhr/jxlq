<template>
  <div class="app-container container-table">
    <div>
      <el-form
        :inline="true"
        :model="pageForm"
        ref="pageForm"
        class="demo-form-inline"
      >
        <el-form-item prop="name" label="表单名称">
          <el-input
            v-model="pageForm.name"
            maxlength="30"
            placeholder="表单名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code" label="表单编码">
          <el-input
            v-model="pageForm.code"
            maxlength="30"
            placeholder="表单编码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-select v-model="pageForm.status" placeholder="状态">
            <el-option label="请选择" value=""></el-option>
            <el-option label="未同步" value="1"></el-option>
            <el-option label="已修改待同步" value="2"></el-option>
            <el-option label="已同步" value="3"></el-option>
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
          <el-button class="chaxun" v-has="has.query" @click="getList()"
            >查询</el-button
          >
          <el-button class="chongzhi" @click="resetForm('pageForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-list">
      <el-button class="table-add-btn" v-has="has.add" @click="handleAdd()">
        添加表单
      </el-button>
      <el-button
        class="table-default-btn"
        v-has="has.remove"
        @click="handleDelete()"
      >
        删除表单
      </el-button>

      <el-table
        :data="tableData"
        v-loading="listLoading"
        style="width: 100%;margin-top:30px;"
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column align="center" label="表单名称">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="表单编码">
          <template slot-scope="scope">
            {{ scope.row.code }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="表单状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1" style="color:red">未同步</span>
            <span v-if="scope.row.status == 2" style="color:red"
              >修改待同步</span
            >
            <span v-if="scope.row.status == 3" style="color:green">已同步</span>
          </template>
        </el-table-column>
        <el-table-column align="header-center" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="250" align="center" label="操作">
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
              v-has="has.edit"
              size="medium"
              @click="handlesheji(scope)"
            >
              设计
            </el-button>
            <el-button
              type="text"
              v-has="has.remove"
              size="medium"
              @click="handleDelete(scope)"
            >
              同步数据库
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

      <!-- 表单设计窗 -->
      <el-dialog
        :visible.sync="dialogVisible"
        custom-class="large"
        title="表单设计"
      >
        <v-customform></v-customform>
      </el-dialog>

      <!-- 表单编辑窗 -->
      <el-dialog
        :visible.sync="dialogVisible2"
        custom-class="small"
        :title="dialogType === 'edit' ? '修改表单' : '新增表单'"
      >
        <el-form
          :model="ctForm"
          :rules="formRules"
          ref="operationFome"
          label-width="120px"
          label-position="left"
        >
          <el-form-item label="表单名称" prop="name">
            <el-input
              v-model="ctForm.name"
              maxlength="30"
              show-word-limit
              placeholder="表单名称"
            />
          </el-form-item>
          <el-form-item label="表单编码" prop="code">
            <el-input
              v-model="ctForm.code"
              maxlength="30"
              show-word-limit
              placeholder="表单编码"
              :disabled="ctForm.id != ''"
            />
          </el-form-item>
        </el-form>

        <div style="text-align:right;">
          <el-button type="danger" @click="dialogVisible2 = false">
            取消
          </el-button>
          <el-button type="primary" @click="confirm">
            提交
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Customform from '../../../components/Customform'
import { getFormList, addForm } from '@/api/customTask/fromApi'
export default {
  data() {
    return {
      has: {
        remove: 'system:user:remove',
        query: 'system:user:query',
        add: 'system:user:add',
        edit: 'system:user:edit'
      },
      dateList: [],
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        code: '',
        status: '',
        beginTime: '',
        endTime: ''
      },
      ctForm: {
        id: '',
        name: '',
        code: ''
      },
      tableData: [],
      tableKey: 0,
      total: 100,
      pageSizes: [10, 15, 20, 25, 30],
      listLoading: false,
      dialogVisible: false, //表单设计窗口
      dialogVisible2: false, //表单编辑
      dialogType: 'new',
      formRules: {
        name: [
          {
            required: true,
            message: '请输入表单名称',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入表单编码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    async getList() {
      this.listLoading = true
      if (this.dateList.length > 0) {
        this.pageForm.beginTime = this.$dateFormat(
          'yyyy-MM-dd',
          this.dateList[0]
        )
        this.pageForm.endTime = this.$dateFormat('yyyy-MM-dd', this.dateList[1])
      }
      const res = await getFormList(this.pageForm)
      this.tableData = res.rows
      this.total = res.total
      this.listLoading = false
    },
    resetForm(formName) {
      this.dateList = []
      this.pageForm.beginTime = ''
      this.pageForm.endTime = ''
      this.$refs[formName].resetFields()
      this.getList()
    },
    handleSelectionChange(val) {
      if (val) {
        let arr = []
        for (let i = 0; i < val.length; i++) {
          let itme = val[i]
          arr.push(itme.userId)
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
    },
    async handleAdd() {
      this.dialogType = 'new'
      this.dialogVisible2 = true
      if (this.$refs['operationFome']) {
        this.$refs['operationFome'].resetFields()
      }
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
        let data = null
        try {
          if (this.dialogType === 'edit') {
            data = await updateUse(this.ctForm)
          } else {
            data = await addForm(this.ctForm)
          }
        } catch (e) {
          console.error('接口异常')
        }
        this.dialogVisible2 = false
        this.$notify({
          title: data ? '成功' : '失败',
          dangerouslyUseHTMLString: true,
          message: data ? data.message : '服务器开小差了，请稍后再试',
          type: data ? 'success' : 'warning'
        })
        this.getList()
      })
    },
    handlesheji(data) {
      this.dialogVisible = true
    }
  },
  created: async function() {
    this.getList()
  },
  components: {
    'v-customform': Customform
  }
}
</script>

<style lang="scss" scoped></style>
