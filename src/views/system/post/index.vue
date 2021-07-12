<template>
  <div class="app-container container-table">
    <div>
      <el-form
        :inline="true"
        :model="pageForm"
        ref="pageForm"
        class="demo-form-inline"
      >
        <el-form-item prop="postName" label="岗位名称">
          <el-input
            v-model="pageForm.postName"
            maxlength="30"
            placeholder="岗位名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="postCode" label="岗位编码">
          <el-input
            v-model="pageForm.postCode"
            maxlength="30"
            placeholder="岗位编码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="status" label="岗位状态">
          <el-select v-model="pageForm.status" placeholder="岗位状态">
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
      <el-button class="table-add-btn" v-has="has.add" @click="handleAdd()">
        添加岗位
      </el-button>
      <el-button
        class="table-default-btn"
        v-has="has.remove"
        @click="handleDelete()"
      >
        删除岗位
      </el-button>

      <el-table
        :data="tableData"
        v-loading="listLoading"
        style="width: 100%;margin-top:30px;"
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column align="center" label="岗位名称">
          <template slot-scope="scope">
            {{ scope.row.postName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="岗位编码">
          <template slot-scope="scope">
            {{ scope.row.postCode }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
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
        :visible.sync="dialogVisible"
        :title="dialogType === 'edit' ? '修改岗位信息' : '添加岗位信息'"
        custom-class="small"
      >
        <el-form
          :model="post"
          :rules="formRules"
          ref="operationFome"
          label-width="80px"
          label-position="left"
        >
          <el-form-item label="岗位名称" prop="postName">
            <el-input
              v-model="post.postName"
              maxlength="30"
              show-word-limit
              placeholder="岗位名称"
            />
          </el-form-item>
          <el-form-item label="岗位编码" prop="postCode">
            <el-input
              v-model="post.postCode"
              maxlength="30"
              show-word-limit
              placeholder="岗位编码"
            />
          </el-form-item>
          <el-form-item label="显示顺序" prop="postSort">
            <el-input
              v-model="post.postSort"
              type="number"
              min="0"
              max="9999"
              maxlength="5"
              placeholder="显示顺序"
            />
          </el-form-item>
          <el-form-item label="岗位状态" prop="status">
            <el-radio-group v-model="post.status">
              <el-radio :label="'0'">正常</el-radio>
              <el-radio :label="'1'">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              v-model="post.remark"
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
  addPost,
  updatePost,
  getPostList,
  deletePost,
  getPostInfo
} from '@/api/system/post'

const defaultPost = {
  postId: '',
  postCode: '',
  postName: '',
  postSort: '',
  status: '0',
  remark: ''
}

const MODULE_NAME = '岗位'

export default {
  name: 'index',
  data() {
    return {
      has: {
        remove: 'system:post:remove',
        query: 'system:post:query',
        add: 'system:post:add',
        edit: 'system:post:edit'
      },
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        postName: '',
        postCode: '',
        status: ''
      },
      post: {
        postId: '',
        postCode: '',
        postName: '',
        postSort: '',
        status: '0',
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
        postCode: [
          {
            required: true,
            message: '请输入岗位编码',
            trigger: 'blur'
          }
        ],
        postName: [
          {
            required: true,
            message: '请输入岗位名称',
            trigger: 'blur'
          }
        ],
        postSort: [
          {
            required: true,
            message: '请输入显示顺序',
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
      this.post = defaultPost
    },
    async handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      if (this.$refs['operationFome']) {
        this.$refs['operationFome'].resetFields()
      }
      let postId = scope.row.postId
      this.post = await getPostInfo(postId)
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
          await deletePost(row ? row.postId : this.multipleSelection)
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
      const res = await getPostList(this.pageForm)
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
            data = await updatePost(this.post)
          } else {
            data = await addPost(this.post)
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
          arr.push(itme.postId)
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
