<template>
  <div class="app-container container-table">
    <div class="sxForm">
      <el-form
        :inline="true"
        :model="formInline"
        ref="formInline"
        class="demo-form-inline"
      >
        <el-form-item prop="menuName" label="菜单名称">
          <el-input
            v-model="formInline.menuName"
            maxlength="30"
            placeholder="菜单名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="visible" label="显示状态">
          <el-select v-model="formInline.visible" placeholder="显示状态">
            <el-option label="请选择" value=""></el-option>
            <el-option label="显示" value="0"></el-option>
            <el-option label="隐藏" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="菜单状态">
          <el-select v-model="formInline.status" placeholder="菜单状态">
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
          @click="getMenuList"
          >查询</el-button
        >
        <el-button @click="resetForm('formInline')" class="chongzhi"
          >重置</el-button
        >
        </el-form-item>
      </el-form>
    </div>
    <div class="table-list">
      <el-button class="table-add-btn" v-has="has.add" @click="handleAddMenu()">
        新增
      </el-button>

      <el-table
        :data="menuList"
        v-loading="loading"
        style="width: 100%;margin-top:30px;"
        @selection-change="handleSelectionChange"
        row-key="menuId"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column type="selection" width="55"> </el-table-column>

        <el-table-column align="center" label="菜单名称">
          <template slot-scope="scope">
            <i
              slot="prefix"
              :class="[scope.row.icon ? 'el-icon-' + scope.row.icon : '']"
            ></i>
            {{ scope.row.menuName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="显示顺序">
          <template slot-scope="scope">
            {{ scope.row.orderNum }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="显示状态">
          <template slot-scope="scope">
            <span v-if="scope.row.visible == '0'">显示</span>
            <span v-if="scope.row.visible == '1'">隐藏</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="菜单状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == '0'">正常</span>
            <span v-if="scope.row.status == '1'">停用</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="菜单类型">
          <template slot-scope="scope">
            <span v-if="scope.row.menuType == 'M'">目录</span>
            <span v-if="scope.row.menuType == 'C'">菜单</span>
            <span v-if="scope.row.menuType == 'F'">按钮</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="权限标识">
          <template slot-scope="scope">
            {{ scope.row.perms }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="220" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-has="has.add"
              size="medium"
              @click="handleAddMenu(scope)"
            >
              添加
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
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        :visible.sync="dialogVisible"
        custom-class="large"
        :title="dialogType === 'edit' ? '修改菜单信息' : '添加菜单信息'"
      >
        <el-form
          :model="menu"
          :rules="loginRules"
          ref="menuForm"
          label-width="120px"
          label-position="right"
        >
          <el-dialog
            custom-class="small"
            title="请选择节点"
            :visible.sync="innerVisible"
            append-to-body
          >
            <el-tree
              ref="menuTree"
              @node-click="checkChange"
              :check-strictly="checkStrictly"
              :data="menutreeSelectData"
              :props="defaultProps"
              :show-checkbox="false"
              node-key="id"
              class="permission-tree"
            />
          </el-dialog>

          <!--       <el-dialog width="60%" title="请选择图标" :visible.sync="innerVisible2" append-to-body>
          <div class="icons-container">
            <div class="grid">
              <div v-for="(item, index) of elementIcons" :key="index" @click="choiceIcon(item)">
                <div class="icon-item">
                  <i :class="'el-icon-' + item" />
                  <span>{{ item }}</span>
                </div>
              </div>
            </div>
          </div>

        </el-dialog> -->

          <el-form-item label="菜单类型" prop="menuType">
            <el-radio v-model="menu.menuType" :label="'M'">目录</el-radio>
            <el-radio v-model="menu.menuType" :label="'C'">菜单</el-radio>
            <el-radio v-model="menu.menuType" :label="'F'">按钮</el-radio>
          </el-form-item>

          <!--  <el-form-item label="菜单图标" prop="icon">
          <el-button type="primary" icon="el-icon-search" @click="innerVisible2 = true">点击选择图标</el-button>
          <span v-if="menu.icon != null && menu.icon !=''">
            <i slot="suffix" class="el-input__icon" :class="[menu.icon != '' ? 'el-icon-'+menu.icon:'el-icon-date']"></i>
            {{ menu.icon }}
          </span>
        </el-form-item> -->

          <el-form-item label="上级菜单标识" prop="parentId">
            <el-button
              type="primary"
              icon="el-icon-search"
              :disabled="menu.menuType == 'M'"
              @click="innerVisible = true"
              >点击选择菜单</el-button
            >
            <el-input
              placeholder="请选择菜单"
              style="width: calc(100% - 150px)"
              :disabled="true"
              v-model="menu.parentId"
              @click="innerVisible = true"
              class="input-with-select"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="菜单名称" prop="menuName">
            <el-input
              v-model="menu.menuName"
              maxlength="30"
              show-word-limit
              placeholder="菜单名称"
            />
          </el-form-item>
          <el-form-item label="显示顺序" prop="orderNum">
            <el-input
              v-model="menu.orderNum"
              type="number"
              min="0"
              max="9999"
              maxlength="5"
              placeholder="显示顺序"
            />
          </el-form-item>

          <el-form-item label="组件路径" prop="component">
            <el-input
              v-model="menu.component"
              :disabled="menu.menuType == 'M' || menu.menuType == 'F'"
              maxlength="100"
              show-word-limit
              placeholder="组件路径"
            />
          </el-form-item>
          <el-form-item label="路由地址" prop="path">
            <el-input
              v-model="menu.path"
              maxlength="100"
              show-word-limit
              placeholder="路由地址"
            />
          </el-form-item>
          <el-form-item label="权限标识" prop="perms">
            <el-input
              v-model="menu.perms"
              maxlength="100"
              :disabled="menu.menuType == 'M'"
              show-word-limit
              placeholder="权限标识"
            />
          </el-form-item>

          <el-form-item label="重定向" prop="redirect">
            <el-input
              v-model="menu.redirect"
              maxlength="100"
              show-word-limit
              placeholder="重定向"
            />
          </el-form-item>

          <el-form-item label="菜单状态" prop="status">
            <el-radio v-model="menu.status" :label="'0'">正常</el-radio>
            <el-radio v-model="menu.status" :label="'1'">停用</el-radio>
          </el-form-item>

          <el-form-item label="显示状态" prop="visible">
            <el-radio v-model="menu.visible" :label="'0'">显示</el-radio>
            <el-radio v-model="menu.visible" :label="'1'">隐藏</el-radio>
          </el-form-item>

          <el-form-item label="是否外链" prop="isFrame">
            <el-radio v-model="menu.isFrame" :label="1">否</el-radio>
            <el-radio v-model="menu.isFrame" :label="0">是</el-radio>
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="menu.remark"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              placeholder="菜单备注"
            />
          </el-form-item>
        </el-form>
        <div style="text-align:right;">
          <el-button class="confirm-btn" @click="confirmmenu">
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
  getMenuList,
  addMenu,
  updateMenu,
  deleteMenu,
  getMenuInfo,
  getMenutreeSelect
} from '@/api/system/menu'

import elementIcons from '@/views/system/menu/element-icons.js'

export default {
  data() {
    return {
      has: {
        remove: 'system:menu:remove',
        query: 'system:menu:query',
        add: 'system:menu:add',
        edit: 'system:menu:edit'
      },
      elementIcons,
      itmeLabel: '',
      menu: {
        component: '',
        icon: '',
        isFrame: 1,
        menuId: '',
        menuName: '',
        menuType: 'M',
        orderNum: '',
        params: {},
        parentId: '0',
        path: '',
        perms: '',
        remark: '',
        status: '0',
        url: '',
        visible: '0',
        redirect: ''
      },
      formInline: {
        menuName: '',
        visible: '',
        status: ''
      },
      loading: false,
      menutreeSelectData: [],
      menuList: [],
      defaultMenutree: [],
      multipleSelection: [],
      dialogVisible: false,
      innerVisible: false,
      innerVisible2: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      //表单验证方法
      loginRules: {
        // perms: [{
        //   required: true,
        //   trigger: 'blur',
        //   message: '请输入正确的权限字符',
        //   validator: (rule, value, callback) => {
        //     if (value == null || value == undefined || value == '') {
        //       callback(new Error('请输入正确的权限字符'))
        //     } else {
        //       let arr = value.split(':');
        //       if (arr.length < 3) {
        //         callback(new Error('权限字符格式不正确，例如：system:menu:add'))
        //       } else {
        //         callback()
        //       }
        //     }
        //   }
        // }],
        orderNum: [
          {
            required: true,
            message: '请输入正确的显示顺序',
            trigger: 'blur'
          }
        ],
        menuName: [
          {
            required: true,
            message: '请输入正确的菜单名称',
            trigger: 'blur'
          }
        ],
        parentId: [
          {
            required: true,
            message: '请选择一个上级菜单',
            trigger: 'click',
            validator: (rule, value, callback) => {
              if (this.menu.menuType == 'M') {
                callback()
              } else {
                if (value == null || value == undefined || value == '') {
                  callback(new Error('请选择一个上级菜单'))
                } else {
                  callback()
                }
              }
            }
          }
        ],
        // component: [
        //   {
        //   required: () => {
        //     return this.menu.menuType != 'M'
        //   },
        //   message: '请输入正确的组件路径',
        //   trigger: 'blur',
        //   validator: (rule, value, callback) => {
        //     if (this.menu.menuType == 'M') {
        //       callback()
        //     } else {
        //       if (value == null || value == undefined || value == '') {
        //         callback(new Error('请输入正确的组件路径'))
        //       } else {
        //         callback()
        //       }
        //     }
        //   }
        // }
        // ],
        path: [
          {
            required: true,
            message: '请输入正确的路由地址',
            trigger: 'blur'
          }
        ],
        orderNum: [
          {
            required: true,
            message: '请输入正确的显示顺序',
            trigger: 'blur'
          }
        ]
        // icon: [{
        //   required: true,
        //   message: '请选择一个菜单图标',
        //   trigger: 'blur'
        // }],
      }
    }
  },
  watch: {
    'menu.menuType': function(newQuestion, oldQuestion) {
      if (
        oldQuestion == 'M' &&
        newQuestion != 'M' &&
        this.menu.parentId == '0'
      ) {
        this.menu.parentId = ''
      }
      if (oldQuestion != 'M' && newQuestion == 'M') {
        if (this.menu.parentId == '') {
          this.menu.parentId = '0'
        }
      }
    }
  },
  computed: {
    getMenuId(menuId) {
      return menuId.toString()
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    checkChange(itmeForData, itmeForNode, itme) {
      this.menu.parentId = itmeForData.id
      this.itmeLabel = itmeForData.label
      this.innerVisible = false
    },
    choiceIcon(itme) {
      this.menu.icon = itme
      this.innerVisible2 = false
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getMenuList()
    },
    handleSelectionChange(val) {
      if (val) {
        let arr = []
        for (let i = 0; i < val.length; i++) {
          let itme = val[i]
          arr.push(itme.menuId)
        }
        this.multipleSelection = [...arr]
      }
    },
    async getMenuList() {
      this.loading = true
      const res = await getMenuList(this.formInline)
      this.menuList = res
      // this.total = res.total
      this.loading = false
    },
    async getMenutreeSelect() {
      let data = await getMenutreeSelect()
      this.menutreeSelectData = data
    },
    handleAddMenu(scope) {
      this.menu = {
        component: '',
        icon: '',
        isFrame: 1,
        menuId: '',
        menuName: '',
        menuType: 'M',
        orderNum: '',
        params: {},
        parentId: '0',
        path: '',
        perms: '',
        remark: '',
        status: '0',
        url: '',
        visible: '0',
        redirect: ''
      }
      this.itmeLabel = ''
      this.dialogType = 'new'
      this.dialogVisible = true
      if (this.$refs['menuForm']) {
        this.$refs['menuForm'].resetFields()
      }
      this.getMenutreeSelect()
      if (scope) {
        let menuId = scope.row.menuId
        this.menu.parentId = menuId
      }
    },
    async handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      if (this.$refs['menuForm']) {
        this.$refs['menuForm'].resetFields()
      }
      let menuId = scope.row.menuId
      this.getMenutreeSelect()
      this.menu = await getMenuInfo(menuId)
    },
    handleDelete(scope) {
      if (!scope && this.multipleSelection.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的菜单!'
        })
        return
      }
      let row = scope ? scope.row : null
      this.$confirm('确定删除菜单吗?', '删除菜单', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteMenu(row ? row.menuId : this.multipleSelection)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getMenuList()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    confirmmenu() {
      //校验表单
      this.$refs.menuForm.validate(async (valid) => {
        if (!valid) {
          this.$notify({
            title: '操作失败',
            dangerouslyUseHTMLString: true,
            message: '请填写完整',
            type: 'warning'
          })
          return
        }
        //判断状态
        const isEdit = this.dialogType === 'edit'
        //取得选中菜单id集合
        let data = null
        try {
          if (isEdit) {
            data = await updateMenu(this.menu)
          } else {
            data = await addMenu(this.menu)
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
        this.getMenuList()
      })
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
}

.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;
  background: #0d74d7;

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
</style>
