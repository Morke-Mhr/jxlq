<template>
  <div class="app-container container-table">
    <div class="sxForm">
      <el-form
        :inline="true"
        :model="formInline"
        ref="formInline"
        class="demo-form-inline"
      >
        <el-form-item prop="roleName" label="角色名称">
          <el-input
            v-model="formInline.roleName"
            maxlength="30"
            placeholder="角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="roleKey" label="Role Key">
          <el-input
            v-model="formInline.roleKey"
            maxlength="30"
            placeholder="Role Key"
          ></el-input>
        </el-form-item>
        <el-form-item prop="status" label="角色状态">
          <el-select v-model="formInline.status" placeholder="角色状态">
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
          @click="getRoles"
          >查询</el-button
        >
        <el-button @click="resetForm('formInline')" class="chongzhi"
          >重置</el-button
        >
        </el-form-item>
      </el-form>
    </div>
    <div class="table-list">
      <el-button class="table-add-btn" v-has="has.add" @click="handleAddRole">
        添加角色
      </el-button>
      <el-button
        class="table-default-btn"
        v-has="has.remove"
        @click="handleDelete()"
      >
        删除角色
      </el-button>

      <el-table
        :data="rolesList"
        v-loading="loading"
        style="width: 100%;margin-top:30px;"
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column align="center" label="Role Key" width="220">
          <template slot-scope="scope">
            {{ scope.row.roleKey }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="角色名称" width="220">
          <template slot-scope="scope">
            {{ scope.row.roleName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="角色状态">
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
        :page-size="formInline.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>

      <el-dialog
        :visible.sync="dialogVisible"
        :title="dialogType === 'edit' ? '修改角色信息' : '添加角色信息'"
        custom-class="small"
      >
        <el-form
          :model="role"
          :rules="loginRules"
          ref="roleFome"
          label-width="80px"
          label-position="left"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input
              v-model="role.roleName"
              maxlength="30"
              show-word-limit
              placeholder="角色名称"
            />
          </el-form-item>
          <el-form-item label="权限字符" prop="roleKey">
            <el-input
              v-model="role.roleKey"
              maxlength="30"
              show-word-limit
              placeholder="权限字符"
            />
          </el-form-item>
          <el-form-item label="显示顺序" prop="roleSort">
            <el-input
              v-model="role.roleSort"
              type="number"
              min="0"
              max="9999"
              maxlength="5"
              placeholder="显示顺序"
            />
          </el-form-item>
          <el-form-item label="角色状态" prop="status">
            <el-radio-group v-model="role.status">
              <el-radio :label="'0'">正常</el-radio>
              <el-radio :label="'1'">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              v-model="role.remark"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              placeholder="角色描述"
            />
          </el-form-item>
          <el-form-item label="菜单选择" prop="menuIds">
            <el-tree
              ref="menuTree"
              :default-expanded-keys="defaultMenutree"
              :default-checked-keys="defaultMenutree"
              :data="menutreeSelectData"
              :props="defaultProps"
              show-checkbox
              node-key="id"
              class="permission-tree"
            />
          </el-form-item>
        </el-form>
        <div style="text-align:right;">
          <el-button class="confirm-btn" @click="confirmRole">
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
  getRoles,
  addRole,
  updateRole,
  deleteRole,
  getRoleInfo
} from '@/api/system/role'
// import {
//   getRoleDeptTreeSelect,
//   getDepttreeSelect,
// } from '@/api/system/dept'
import { getRoleMenuTreeSelect, getMenutreeSelect } from '@/api/system/menu'

import { isEnglish } from '@/utils/validate.js'

export default {
  data() {
    return {
      has: {
        remove: 'system:role:remove',
        query: 'system:role:query',
        add: 'system:role:add',
        edit: 'system:role:edit'
      },
      role: {
        roleSort: '',
        menuIds: '',
        remark: '',
        roleName: '',
        roleKey: '',

        status: '0'
      },
      formInline: {
        pageNum: 1,
        pageSize: 10,
        roleName: '',
        roleKey: '',
        status: ''
      },
      loading: false,
      total: 100,
      pageSizes: [10, 15, 20, 25, 30],
      menutreeSelect: [],
      rolesList: [],
      defaultMenutree: [],
      multipleSelection: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      //表单验证方法
      loginRules: {
        roleKey: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入正确的权限字符',
            validator: (rule, value, callback) => {
              if (value == null || value == undefined || value == '') {
                callback(new Error('请输入正确的权限字符'))
              } else {
                if (!isEnglish(value)) {
                  callback(new Error('权限字符格式不正确，只能输入英文'))
                } else {
                  callback()
                }
              }
            }
          }
        ],
        roleSort: [
          {
            required: true,
            message: '请输入正确的显示顺序',
            trigger: 'blur'
          }
        ],
        roleName: [
          {
            required: true,
            message: '请输入正确的角色名称',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    depttreeSelectData() {
      return this.depttreeSelect
    },
    menutreeSelectData() {
      return this.menutreeSelect
    }
  },
  created() {
    this.getRoles()
    this.getMenutreeSelectData()
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getRoles()
    },
    handleSelectionChange(val) {
      if (val) {
        let arr = []
        for (let i = 0; i < val.length; i++) {
          let itme = val[i]
          arr.push(itme.roleId)
        }
        this.multipleSelection = [...arr]
      }
    },
    handleSizeChange(val) {
      this.formInline.pageSize = val
      this.getRoles()
    },
    handleCurrentChange(val) {
      this.formInline.pageNum = val
      this.getRoles()
    },
    async getMenutreeSelectData() {
      const res = await getMenutreeSelect()
      this.menutreeSelect = res
    },
    async getRoles() {
      this.loading = true
      const res = await getRoles(this.formInline)
      this.rolesList = res.rows
      this.total = res.total
      this.loading = false
    },
    handleAddRole() {
      if (this.$refs.menuTree) {
        this.getMenutreeSelectData()
        this.defaultMenutree = []
        this.$refs.menuTree.setCheckedKeys([])
      }
      this.role = {
        roleSort: '',
        menuIds: '',
        remark: '',
        roleName: '',
        roleKey: '',
        status: '0'
      }
      this.dialogType = 'new'
      this.dialogVisible = true
      if (this.$refs['roleFome']) {
        this.$refs['roleFome'].resetFields()
      }
    },
    async handleEdit(scope) {
      if (this.$refs.menuTree) {
        this.getMenutreeSelectData()
        this.defaultMenutree = []
        this.$refs.menuTree.setCheckedKeys([])
      }
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      if (this.$refs['roleFome']) {
        this.$refs['roleFome'].resetFields()
      }
      let roleId = scope.row.roleId
      this.role = await getRoleInfo(roleId)

      let treeSelect = await getRoleMenuTreeSelect(roleId)

      // this.menutreeSelect = treeSelect.menus

      this.defaultMenutree = treeSelect.checkedKeys
    },
    handleDelete(scope) {
      if (!scope && this.multipleSelection.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的角色!'
        })
        return
      }
      let row = scope ? scope.row : null
      this.$confirm('确定删除角色吗?', '删除角色', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteRole(row ? row.roleId : this.multipleSelection)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getRoles()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    async confirmRole() {
      //取得选中菜单id集合
      if (this.$refs.menuTree) {
        const menuTreeKeys = new Set([
          ...this.$refs.menuTree.getHalfCheckedKeys(),
          ...this.$refs.menuTree.getCheckedKeys()
        ])

        this.role.menuIds = [...menuTreeKeys]
      }
      console.log(this.$refs.menuTree.getHalfCheckedKeys(), this.role.menuIds)
      this.$refs.roleFome.validate(async (valid) => {
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
            data = await updateRole(this.role)
          } else {
            data = await addRole(this.role)
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
        this.getRoles()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 15px;
  }

  .permission-tree {
    margin-bottom: 15px;
  }
}
</style>
