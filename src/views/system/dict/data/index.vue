<template>
  <div class="app-container">
    <el-form
      :inline="true"
      :model="pageForm"
      ref="pageForm"
      class="demo-form-inline"
    >
      <el-form-item prop="dictLabel" label="字典标签">
        <el-input
          v-model="pageForm.dictLabel"
          maxlength="30"
          placeholder="字典标签"
        ></el-input>
      </el-form-item>

      <el-form-item prop="status" label="字典状态">
        <el-select v-model="pageForm.status" placeholder="字典状态">
          <el-option label="请选择" value=""></el-option>
          <el-option label="正常" value="0"></el-option>
          <el-option label="停用" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-button class="chaxun" v-has="has.query" @click="getList()"
        >查询</el-button
      >
      <el-button class="chongzhi" @click="resetForm('pageForm')">重置</el-button>
    </el-form>

    <el-button type="primary" v-has="has.add" @click="handleAdd()">
      添加字典数据
    </el-button>
    <el-button type="danger" v-has="has.remove" @click="handleDelete()">
      删除字典数据
    </el-button>
    <el-button @click="handleRollback()" style="float: right;">
      返回
    </el-button>
    <el-table
      :data="tableData"
      v-loading="listLoading"
      style="width: 100%; margin-top: 30px"
      @selection-change="handleSelectionChange"
      stripe
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column align="center" label="字典标签">
        <template slot-scope="scope">
          {{ scope.row.dictLabel }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="字典类型">
        <template slot-scope="scope">
          {{ scope.row.dictType }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="字典键值">
        <template slot-scope="scope">
          {{ scope.row.dictValue }}
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="字典排序">
        <template slot-scope="scope">
          {{ scope.row.dictSort }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="样式属性">
        <template slot-scope="scope">
          {{ scope.row.cssClass }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="回显样式">
        <template slot-scope="scope">
          {{ scope.row.listClass }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否默认">
        <template slot-scope="scope">
          <span v-if="scope.row.isDefault == 'Y'">是</span>
          <span v-if="scope.row.isDefault == 'N'">否</span>
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
      <el-table-column fixed="right" width="150" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            v-has="has.edit"
            size="mini"
            @click="handleEdit(scope)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            v-has="has.remove"
            size="mini"
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
      :title="dialogType === 'edit' ? '修改字典数据信息' : '添加字典数据信息'"
      custom-class="large"
    >
      <el-form
        :model="dictData"
        :rules="formRules"
        ref="operationFome"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="字典标签" prop="dictLabel">
          <el-input
            v-model="dictData.dictLabel"
            maxlength="30"
            show-word-limit
            placeholder="字典标签"
          />
        </el-form-item>

        <el-form-item label="字典键值" prop="dictValue">
          <el-input
            v-model="dictData.dictValue"
            maxlength="100"
            show-word-limit
            placeholder="字典键值"
          />
        </el-form-item>

        <el-form-item label="字典排序" prop="roleSort">
          <el-input
            v-model="dictData.dictSort"
            type="number"
            min="0"
            max="9999"
            maxlength="9999"
            placeholder="字典排序"
          />
        </el-form-item>

        <el-form-item label="样式属性" prop="cssClass">
          <el-input
            v-model="dictData.cssClass"
            maxlength="30"
            show-word-limit
            placeholder="样式属性"
          />
        </el-form-item>
        <el-form-item label="回显样式" prop="listClass">
          <el-input
            v-model="dictData.listClass"
            maxlength="30"
            show-word-limit
            placeholder="回显样式"
          />
        </el-form-item>

        <el-form-item label="是否默认" prop="isDefault">
          <el-radio-group v-model="dictData.isDefault">
            <el-radio :label="'Y'">是</el-radio>
            <el-radio :label="'N'">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="字典状态" prop="status">
          <el-radio-group v-model="dictData.status">
            <el-radio :label="'0'">正常</el-radio>
            <el-radio :label="'1'">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="dictData.remark"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="用户描述"
          />
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button type="danger" @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="confirm"> 提交 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDictDataList,
  getDictDataDictType,
  addDictData,
  updateDictData,
  deleteDictData,
  getDictDataInfo
} from '@/api/system/dictData.js'

const defaultDictData = {
  dictCode: '',
  cssClass: '',
  dictLabel: '',
  dictSort: '',
  dictValue: '',
  isDefault: 'Y',
  listClass: '',
  remark: '',
  status: '0'
}

const MODULE_NAME = '字典数据'

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
        dictLabel: '',
        dictType: '',
        status: ''
      },
      dictData: {
        dictCode: '',
        cssClass: '',
        dictLabel: '',
        dictSort: '',
        dictValue: '',
        isDefault: 'Y',
        listClass: '',
        remark: '',
        status: '0'
      },
      multipleSelection: [],
      tableData: [],
      tableKey: 0,
      total: 100,
      pageSizes: [10, 15, 20, 25, 30],
      listLoading: false,
	  parentPageNum: '',
	  parentPageSize: '',
	  total: 100,
      dialogVisible: false,
      dialogType: 'new',
      //表单验证方法
      formRules: {
        dictLabel: [
          {
            required: true,
            message: '请输入字典标签 ',
            trigger: 'blur'
          }
        ],
        dictSort: [
          {
            required: true,
            message: '请输入字典排序',
            trigger: 'blur'
          }
        ],
        dictValue: [
          {
            required: true,
            message: '请输入字典键值',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {},
  created: function() {
    this.dictData.dictType = this.$route.query.type
    this.pageForm.dictType = this.$route.query.type
	this.parentPageSize = this.$route.query.pageSize
	this.parentPageNum = this.$route.query.pageNum
    this.getList()
  },
  methods: {
    handleRollback() {
      this.$router.push({path : '/system/dict/list',query : {
		  parentPageSize: this.parentPageSize,
		  parentPageNum: this.parentPageNum,
	  }})
    },
    handleAdd() {
      this.dialogType = 'new'
      this.dialogVisible = true
      if (this.$refs['operationFome']) {
        this.$refs['operationFome'].resetFields()
      }
      this.dictData = defaultDictData
    },
    async handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      if (this.$refs['operationFome']) {
        this.$refs['operationFome'].resetFields()
      }
      let dictCode = scope.row.dictCode
      this.dictData = await getDictDataInfo(dictCode)
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
          await deleteDictData(row ? row.dictCode : this.multipleSelection)
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
      const res = await getDictDataList(this.pageForm)
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
          this.dictData.dictType = this.pageForm.dictType
          if (isEdit) {
            data = await updateDictData(this.dictData)
          } else {
            data = await addDictData(this.dictData)
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
          arr.push(itme.dictCode)
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
