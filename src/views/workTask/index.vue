<template>
  <div class="app-container">
    <el-form
      :inline="true"
      :model="pageForm"
      ref="pageForm"
      class="demo-form-inline"
    >
      <el-form-item prop="title" label="类型">
        <el-select v-model="pageForm.businessType" placeholder="类型">
          <el-option label="请选择" value=""></el-option>
          <el-option label="其它" value="0"></el-option>
          <el-option label="新增" value="1"></el-option>
          <el-option label="修改" value="2"></el-option>
          <el-option label="删除" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="operName" label="子类">
        <el-select v-model="pageForm.businessType" placeholder="子类">
          <el-option label="请选择" value=""></el-option>
          <el-option label="其它" value="0"></el-option>
          <el-option label="新增" value="1"></el-option>
          <el-option label="修改" value="2"></el-option>
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

      <el-form-item prop="status" label="责任人">
        <el-input
          v-model="pageForm.status"
          maxlength="30"
          placeholder="责任人"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="chaxun" v-has="has.query" @click="getList()"
          >查询</el-button
        >
        <el-button class="chongzhi" @click="resetForm('pageForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button
      type="primary"
      v-has="has.add"
      @click="handleAddClass()"
      icon="el-icon-plus"
    >
      新增任务
    </el-button>
    <el-button
      type="primary"
      v-has="has.add"
      @click="handleAddClass()"
      icon="el-icon-plus"
    >
      导入
    </el-button>
    <el-button
      type="primary"
      v-has="has.add"
      @click="handleAddClass()"
      icon="el-icon-plus"
    >
      报审
    </el-button>
    <el-button type="danger" v-has="has.remove" @click="handleDelete()">
      删除
    </el-button>
    <el-button
      type="primary"
      v-has="has.add"
      @click="handleAddClass()"
      icon="el-icon-plus"
    >
      复制
    </el-button>
    <el-table
      :data="classList"
      v-loading="loading"
      style="width: 100%;margin-top:30px;"
      @selection-change="handleSelectionChange"
      row-key="classdictId"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      stripe
    >
      <el-table-column type="selection" width="55"> </el-table-column>

      <el-table-column align="center" label="分类名称">
        <template slot-scope="scope">
          {{ scope.row.dictName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否是业务数据">
        <template slot-scope="scope">
          <span v-if="scope.row.business == true">是</span>
          <span v-if="scope.row.business == false">否</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="260" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="success"
            v-has="has.add"
            size="mini"
            @click="handleAddClass(scope)"
          >
            查看
          </el-button>
          <el-button
            type="primary"
            v-has="has.edit"
            size="mini"
            @click="handleEdit(scope)"
            :disabled="scope.row.business"
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
      custom-class="large"
      :title="dialogType === 'edit' ? '修改' : '新增'"
    >
      <el-form
        :model="modelClass"
        :rules="loginRules"
        ref="classForm"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="分类名称" prop="dictName">
          <el-input
            v-model="modelClass.dictName"
            placeholder="请输入分类名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmmenu">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getClassList,
  getAddClassList,
  getUpdataClassList,
  getClassSelect,
  getDeleteClass
} from '@/api/system/class'

import elementIcons from '@/views/system/class/element-icons.js'

export default {
  data() {
    return {
      has: {
        remove: 'system:menu:remove',
        query: 'system:menu:query',
        add: 'system:menu:add',
        edit: 'system:menu:edit'
      },
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
      elementIcons,
      itmeLabel: '',
      modelClass: {
        dictName: '',
        pclassdictId: ''
      },
      classdictId: '',
      dictName: [],
      classProps: {
        value: 'classdictId',
        label: 'dictName',
        checkStrictly: true
      },
      loading: false,
      classtreeSelectData: [],
      classList: [],
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
        dictName: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入正确的分类名称'
          }
        ],
        component: [
          {
            required: () => {
              return this.menu.menuType != 'M'
            },
            message: '请输入正确的组件路径',
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.menu.menuType == 'M') {
                callback()
              } else {
                if (value == null || value == undefined || value == '') {
                  callback(new Error('请输入正确的组件路径'))
                } else {
                  callback()
                }
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    getClassId(classdictId) {
      return classdictId.toString()
    }
  },
  created() {
    this.getClass()
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
      this.getClass()
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
    async getClass() {
      this.loading = true
      this.classList = await getClassList()

      // this.total = res.total
      this.loading = false
    },
    //新增
    handleAddClass(scope) {
      this.itmeLabel = ''
      this.dialogType = 'new'
      this.dialogVisible = true
      if (this.$refs['classForm']) {
        this.$refs['classForm'].resetFields()
      }
      if (scope) {
        let pclassdictId = scope.row.pclassdictId
        this.modelClass.pclassdictId = pclassdictId
        this.dictName = []
        this.dictName.push(this.modelClass.pclassdictId)
      }
    },
    //编辑
    async handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      if (this.$refs['classForm']) {
        this.$refs['classForm'].resetFields()
      }
      let pclassdictId = scope.row.pclassdictId
      let classdictId = scope.row.classdictId
      this.modelClass = await getClassSelect(classdictId)
      this.dictName = []
      this.dictName.push(this.modelClass.pclassdictId)
    },
    //删除
    handleDelete(scope) {
      let row = scope ? scope.row : null
      this.$confirm('确定删除菜单吗?', '删除菜单', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await getDeleteClass(row.classdictId)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getClass()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    confirmmenu() {
      //校验表单
      this.$refs.classForm.validate(async (valid) => {
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
        this.modelClass.pclassdictId = this.dictName[this.dictName.length - 1]
        try {
          if (isEdit) {
            data = await getUpdataClassList(this.modelClass)
          } else {
            delete this.modelClass.updateBy
            data = await getAddClassList(this.modelClass)
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
        this.getClass()
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
</style>
