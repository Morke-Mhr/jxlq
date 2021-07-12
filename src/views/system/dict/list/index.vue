<template>
  <div class="app-container container-table">
    <div class="sxForm">
      <el-form
        :inline="true"
        :model="pageForm"
        ref="pageForm"
        class="demo-form-inline"
      >
        <el-form-item prop="dictName" label="字典名称">
          <el-input
            v-model="pageForm.dictName"
            maxlength="30"
            placeholder="字典名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="dictType" label="字典类型">
          <el-input
            v-model="pageForm.dictType"
            maxlength="30"
            placeholder="字典类型"
          ></el-input>
        </el-form-item>
        <el-form-item prop="status" label="字典状态">
          <el-select v-model="pageForm.status" placeholder="字典状态">
            <el-option label="请选择" value=""></el-option>
            <el-option label="正常" value="0"></el-option>
            <el-option label="停用" value="1"></el-option>
          </el-select>
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
      <el-button
        class="table-add-btn"
        style="width: 120px"
        v-has="has.add"
        @click="handleAdd()"
      >
        添加字典类型
      </el-button>
      <el-button
        class="table-default-btn"
        style="width: 120px"
        v-has="has.remove"
        @click="handleDelete()"
      >
        删除字典类型
      </el-button>

      <el-table
        :data="tableData"
        v-loading="listLoading"
        style="width: 100%; margin-top: 30px"
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column align="center" label="字典名称">
          <template slot-scope="scope">
            {{ scope.row.dictName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="字典类型">
          <template slot-scope="scope">
            {{ scope.row.dictType }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="字典状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == '0'">正常</span>
            <span v-if="scope.row.status == '1'">停用</span>
          </template>
        </el-table-column>
        <el-table-column align="header-center" label="描述">
          <template slot-scope="scope">
            {{ scope.row.remark }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="250" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-has="has.edit"
              @click="toOffspring(scope)"
              size="medium"
            >
              字典数据列表
            </el-button>
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
              :disabled="scope.row.status == '0'"
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
		:current-page="pageForm.pageNum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>

      <el-dialog
        :visible.sync="dialogVisible"
        :title="dialogType === 'edit' ? '修改字典类型信息' : '添加字典类型信息'"
        custom-class="large"
      >
        <el-form
          :model="dictType"
          :rules="formRules"
          ref="operationFome"
          label-width="80px"
          label-position="left"
        >
          <el-form-item label="字典名称" prop="dictName">
            <el-input
              v-model="dictType.dictName"
              maxlength="30"
              show-word-limit
              placeholder="字典名称"
            />
          </el-form-item>
          <el-form-item label="字典类型" prop="dictType">
            <el-input
              v-model="dictType.dictType"
              maxlength="30"
              show-word-limit
              placeholder="字典类型"
            />
          </el-form-item>
          <el-form-item label="字典状态" prop="status">
            <el-radio-group v-model="dictType.status">
              <el-radio :label="'0'">正常</el-radio>
              <el-radio :label="'1'">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              v-model="dictType.remark"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              placeholder="用户描述"
            />
          </el-form-item>
        </el-form>
        <div style="text-align: right">
          <el-button class="confirm-btn" @click="confirm"> 提交 </el-button>
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
  getDictTypeList,
  getDictTypeOptionselect,
  addDictType,
  updateDictType,
  deleteDictType,
  getDictTypeInfo
} from '@/api/system/dictType.js'

const defaultDictType = {
  dictId: '',
  dictName: '',
  dictType: '',
  remark: '',
  status: '0'
}

const MODULE_NAME = '字典类型'

export default {
  name: 'index',
  data() {
    return {
      has: {
        remove: 'system:dict:remove',
        query: 'system:dict:query',
        add: 'system:dict:add',
        edit: 'system:dict:edit'
      },
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        dictName: '',
        dictType: '',
        status: ''
      },
      dictType: {
        dictId: '',
        dictName: '',
        dictType: '',
        remark: '',
        status: '0'
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
        dictName: [
          {
            required: true,
            message: '请输入字典名称',
            trigger: 'blur'
          }
        ],
        dictType: [
          {
            required: true,
            message: '请输入字典类型',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {},
  created: function() {
	if(this.$route.query.parentPageNum != undefined){
	  this.pageForm.pageNum = this.$route.query.parentPageNum  
	}
    this.getList()
  },
  methods: {
    toOffspring(scope) {
      this.$router.push({ path: 'data', query: {
		  type: scope.row.dictType ,
		  pageSize: this.pageForm.pageSize ,
		  pageNum: this.pageForm.pageNum ,
		  } })
    },
    handleAdd() {
      this.dialogType = 'new'
      this.dialogVisible = true
      if (this.$refs['operationFome']) {
        this.$refs['operationFome'].resetFields()
      }
      this.dictType = defaultDictType
    },
    async handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      if (this.$refs['operationFome']) {
        this.$refs['operationFome'].resetFields()
      }
      let dictId = scope.row.dictId
      this.dictType = await getDictTypeInfo(dictId)
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
          await deleteDictType(row ? row.dictId : this.multipleSelection)
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
      this.$refs[formName].resetFields()
      this.getList()
    },
    async getList() {
      this.listLoading = true
      const res = await getDictTypeList(this.pageForm)
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
            data = await updateDictType(this.dictType)
          } else {
            data = await addDictType(this.dictType)
          }
        } catch (e) {
          console.error('接口异常')
        }
        this.dialogVisible = false
        this.$notify({
          title: data ? '成功' : '失败',
          dangerouslyUseHTMLString: true,
          message: data ? data.message : '服务器开小差了，请稍后再试',
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
          arr.push(itme.dictId)
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
