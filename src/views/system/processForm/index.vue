<template>
  <div class="app-container container-table">
    <div class="sxForm">
      <el-form
        :inline="true"
        :model="pageForm"
        ref="pageForm"
        class="demo-form-inline"
      >
        <el-form-item prop="name" label="名称">
          <el-input
            v-model="pageForm.name"
            maxlength="30"
            placeholder="名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
        <el-button
          class="chaxun"
          icon="el-icon-search"
          v-has="has.query"
          @click="getAllList()"
          >查询</el-button
        >
        <el-button @click="resetForm('pageForm')" class="chongzhi"
          >重置</el-button
        >
        </el-form-item>
      </el-form>
    </div>
    <div class="table-list">
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%;margin-top:30px;"
        @selection-change="handleSelectionChange"
        row-key="modelId"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        stripe
      >
        <el-table-column type="selection" width="55"> </el-table-column>

        <el-table-column align="center" label="名称">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="流程定义KEY">
          <template slot-scope="scope">
            {{ scope.row.key }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="版本">
          <template slot-scope="scope">
            {{ scope.row.reversion }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="部署时间">
          <template slot-scope="scope">
            {{ scope.row.createbyTime }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="260" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-has="has.edit"
              size="mini"
              @click="handleRole(scope)"
            >
              角色表单管理
            </el-button>

            <el-button
              type="text"
              v-has="has.remove"
              size="mini"
              @click="handleBussines(scope)"
            >
              业务关联设置
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

      <!-- <el-dialog :visible.sync="dialogVisible" title="角色表单管理">
      <el-row style="margin-bottom: 5px;">
        <el-col :span="8">
          <span class="tit-process" style="font-size: 18px;height: 35px;line-height: 35px;">节点名称</span>
        </el-col>
        <el-col :span="8">
          <span class="tit-process" style="font-size: 18px;height: 35px;line-height: 35px;">候选角色</span>
        </el-col>
        <el-col :span="8">
          <span class="tit-process" style="font-size: 18px;height: 35px;line-height: 35px;">候选部门</span>
        </el-col>
      </el-row>
      <div v-if="roleIdList.length > 0" v-for="(objItme,index) in roleData" :key="objItme.nodeId">
        <el-row style="margin-bottom: 5px;">
          <el-col :span="8">
            <span class="title-process" style="font-size: 16px;height: 40px;line-height: 40px;">{{ objItme.nodeName }}</span>
          </el-col>
          <el-col :span="8">
            <el-select v-model="roleIdList[index]['roleId']" placeholder="业务模块" @change="(value) =>{setObject(value,objItme.nodeId)}"
              style="width: 100%;">
              <el-option label="区域一" v-for="item in roleSelect" :value="item.roleId" :key="item.roleName" :label="item.roleName"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-tree class="permission-tree"
              show-checkbox
              node-key="key"
              :ref="setTreeRef(index)"
              :check-strictly="checkStrictly"
              :default-expanded-keys="defaultRoletree"
              :default-checked-keys="defaultCheckedRoletree"
              :data="deptOptionsRole"
              :props="defaultProps"
              :highlight-current="true"
              @check-change='(data, checked, indeterminate) => {treeCheckRole(data, checked, indeterminate,index,objItme.nodeId)}'
            />
          </el-col>
        </el-row>
      </div>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          关闭
        </el-button>
        <el-button type="primary" @click="confirm">
          保存
        </el-button>
      </div>
    </el-dialog>
 -->

      <el-dialog
        :visible.sync="dialogVisible"
        title="角色表单管理"
        custom-class="small"
      >
        <el-row style="margin-bottom: 5px;">
          <el-col :span="8">
            <span
              class="tit-process"
              style="font-size: 18px;height: 35px;line-height: 35px;"
              >节点名称</span
            >
          </el-col>
          <el-col :span="8">
            <span
              class="tit-process"
              style="font-size: 18px;height: 35px;line-height: 35px;"
              >候选角色</span
            >
          </el-col>
          <el-col :span="8">
            <span
              class="tit-process"
              style="font-size: 18px;height: 35px;line-height: 35px;"
              >候选部门</span
            >
          </el-col>
        </el-row>
        <template v-if="roleIdList.length > 0">
          <div v-for="(objItme, index) in fromData" :key="objItme.nodeId">
            <el-row style="margin-bottom: 5px;">
              <el-col :span="8">
                <span
                  class="title-process"
                  style="font-size: 16px;height: 40px;line-height: 40px;"
                  >{{ objItme.nodeName }}</span
                >
              </el-col>
              <el-col :span="8">
                <el-select
                  v-model="roleIdList[index]['roleId']"
                  placeholder="请选择角色"
                  @change="
                    (value) => {
                      setObject(value, objItme.nodeId)
                    }
                  "
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in roleSelect"
                    :value="item.roleId"
                    :key="item.roleName"
                    :label="item.roleName"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-tree
                  class="permission-tree"
                  show-checkbox
                  node-key="id"
                  :ref="setTreeRef(index)"
                  :check-strictly="checkStrictly"
                  :default-expanded-keys="defaultRoletree"
                  :default-checked-keys="setCheckedRoletree(objItme.deptId)"
                  :data="deptOptionsRole"
                  :props="defaultProps"
                  :highlight-current="true"
                  @check-change="
                    (data, checked, indeterminate) => {
                      treeCheckRole(
                        data,
                        checked,
                        indeterminate,
                        index,
                        objItme.nodeId
                      )
                    }
                  "
                />
              </el-col>
            </el-row>
          </div>
        </template>
        <div style="text-align:right;">
          <el-button @click="dialogVisible = false" class="cancel-btn">
            关闭
          </el-button>
          <el-button @click="confirm" class="confirm-btn">
            保存
          </el-button>
        </div>
      </el-dialog>

      <el-dialog
        :visible.sync="dialogVisibleBussines"
        title="业务关联设置"
        custom-class="small"
      >
        <el-form
          ref="fromBussiness"
          :model="bussiness"
          :rules="formRules"
          label-width="80px"
        >
          <el-form-item label="发起角色">
            <el-select
              v-model="bussiness.startRole"
              placeholder="请选择发起角色"
              style="width: 100%;"
            >
              <el-option
                v-for="item in bussiRoleSel"
                :value="item.roleId"
                :key="item.roleName"
                :label="item.roleName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发起部门">
            <el-tree
              ref="deptTree"
              :check-strictly="checkStrictly"
              :default-expanded-keys="defaultMenutree"
              :default-checked-keys="defaultMenutree"
              :data="deptOptions"
              :props="defaultProps"
              @check-change="treeCheck"
              show-checkbox
              node-key="id"
              class="permission-tree"
            />
          </el-form-item>
          <el-form-item label="业务模块" prop="businessCode">
            <el-select
              v-model="bussiness.businessCode"
              placeholder="请选择业务模块"
              style="width: 100%;"
            >
              <el-option
                v-for="item in bussiModuleSel"
                :value="item.businessCode"
                :key="item.businessCode"
                :label="item.businessName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div style="text-align:right;">
          <el-button @click="dialogVisibleBussines = false" class="cancel-btn">
            关闭
          </el-button>
          <el-button
            type="primary"
            @click="confirmBussiness"
            class="confirm-btn"
          >
            保存
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getAllProcessList,
  getSelectRole,
  getAddRole,
  getNodeRole,
  getQueryRole,
  getQueryBussiness,
  getBussinessRole,
  getBussinessAll,
  getBussinessDep,
  getAddBussiness
} from '@/api/system/processForm'

import elementIcons from '@/views/system/menu/element-icons.js'
export default {
  data() {
    return {
      keys: null,
      fileList: [
        {
          name: 'food.jpeg',
          url:
            'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        },
        {
          name: 'food2.jpeg',
          url:
            'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }
      ],
      has: {
        remove: 'system:menu:remove',
        query: 'system:menu:query',
        add: 'system:menu:add',
        edit: 'system:menu:edit'
      },
      tableData: [],
      role: '',
      roleSelect: [],
      roleId: [],
      roleIdList: [],
      fromData: {
        startDept: ''
      },
      modelId: '',
      //业务模块弹窗里的
      bussiness: {
        startRole: '',
        businessCode: '',
        modelId: '',
        startDept: ''
      },
      roleData: [],
      dialogVisible: false,
      dialogVisibleBussines: false,
      //获取角色下拉
      //获取业务模块角色下拉

      bussiRoleSel: [],
      //获取业务模块下拉

      bussiModuleSel: [],

      //搜索
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        name: ''
      },
      total: 100,
      pageSizes: [10, 15, 20, 25, 30],
      fromBussiness: {
        bussiRolId: '',
        bussiModule: ''
      },
      //树形
      checkStrictly: true,
      defaultMenutree: [],
      defaultCheckedRoletree: [],
      deptOptions: [],
      deptOptionsRole: [],
      defaultRoletree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      deptProps: {
        children: 'children',
        label: 'label'
      },
      elementIcons,
      itmeLabel: '',
      loading: false,
      //表单验证方法
      formRules: {
        businessCode: [
          {
            required: true,
            message: '请选择业务模块',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created: async function() {
    this.getAllList()
    this.roleSelect = await getSelectRole()
    //获取部门树形
    this.deptOptions = await getBussinessDep()
    this.deptOptionsRole = await getBussinessDep()
  },

  methods: {
    //设置tree ref
    setTreeRef(index) {
      return 'deptTreeRole' + index
    },
    //设置tree 默认选中
    setCheckedRoletree(deptId) {
      return [deptId]
    },
    setObject(value, nodeId) {
      console.log('before.fromData:', this.fromData)
      console.log(value, nodeId)

      let lint = -1

      for (let i = 0; i < this.roleData.length; i++) {
        let itme = this.roleData[i]
        if (itme.nodeId === nodeId) {
          lint = i
          this.fromData[lint].nodeId = itme.nodeId
          this.fromData[lint].nodeName = itme.nodeName
        }
      }

      for (let t = 0; t < this.roleSelect.length; t++) {
        let itmeT = this.roleSelect[t]

        if (itmeT.roleId == value) {
          console.log(itmeT)
          this.fromData[lint].roleId = itmeT.roleId
          this.fromData[lint].roleName = itmeT.roleName

          this.fromData[lint].modelId = this.roleData[lint].modelId
          this.fromData[lint].modelName = this.roleData[lint].modelName
          this.fromData[lint].norder = this.roleData[lint].norder
        }
      }

      console.log('next.fromData:', this.fromData)
      console.log('this.fromData:', this.fromData)
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
    //获取列表数据
    //获取列表
    async getAllList() {
      this.loading = true
      const res = await getAllProcessList(this.pageForm)
      this.tableData = res.rows
      this.total = res.total
      this.loading = false
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getAllList()
    },
    //角色表单管理
    async handleRole(scope) {
      let id = scope.row.id
      //获取左边节点数据接口
      this.roleData = await getNodeRole(id)
      //获取右边所有下拉数据的接口
      this.roleSelect = await getSelectRole()
      //获取初始结构
      this.fromData = await getQueryRole(id)
      //再进行修改或添加
      this.roleIdList = []
      //初始化选择对象
      for (let i = 0; i < this.roleData.length; i++) {
        this.roleIdList.push({
          roleId: '',
          roleName: '',
          deptId: '',
          deptName: ''
        })
      }
      // let forLen = this.fromData.length
      //补充剩下的
      for (let i = 0; i < this.roleData.length; i++) {
        if (this.fromData.length < this.roleData.length) {
          this.fromData.push({})
        }
        // console.log(i, this.fromData.length, this.roleData.length)
        this.fromData[i].nodeId = this.roleData[i].nodeId
        this.fromData[i].nodeName = this.roleData[i].nodeName
        this.fromData[i].modelId = this.roleData[i].modelId
        this.fromData[i].modelName = this.roleData[i].modelName
        this.fromData[i].norder = this.roleData[i].norder
      }
      //选中选择对象
      for (let i = 0; i < this.fromData.length; i++) {
        let itme = this.fromData[i]
        if (itme.roleId && itme.roleId != '' && itme.roleId != null) {
          this.roleIdList[i].roleId = itme.roleId
          this.roleIdList[i].roleName = itme.roleName
          this.roleIdList[i].deptId = itme.deptId
          this.roleIdList[i].deptName = itme.deptName
        } else {
          this.roleIdList[i].roleId = ''
          this.roleIdList[i].roleName = ''
          this.roleIdList[i].deptId = ''
          this.roleIdList[i].deptName = ''
        }
      }

      // this.$refs[`deptTreeRole${index}`][0].setCheckedKeys([this.fromData.deptId],true)
      // this.defaultRoletree = [];
      // if(this.$refs[`deptTreeRole${index}`]){
      //   this.deptOptionsRole = await getBussinessDep()
      //   this.$refs.deptTreeRole.setCheckedKeys([this.fromData.startDept],true)
      // }
      this.dialogVisible = true
    },
    //获取下拉所有角色列表
    async getRoleSel() {
      this.roleSelect = await getSelectRole()
    },
    //保存
    async confirm() {
      console.log(this.fromData)
      // return false
      var data = await getAddRole(this.fromData)
      this.dialogVisible = false

      this.$notify({
        title: data ? '成功' : '失败',
        dangerouslyUseHTMLString: true,
        message: data ? data.message : '服务器开小差了，请稍后再试',
        type: data ? 'success' : 'warning'
      })
      this.getAllList()
      console.log(this.fromData)
    },

    ///页脚
    handleSizeChange(val) {
      this.pageForm.pageSize = val
      this.getAllList()
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val
      this.getAllList()
    },
    //
    async handleBussines(scope) {
      let id = scope.row.id
      this.bussiness.modelId = scope.row.id
      this.modelId = scope.row.id
      this.defaultMenutree = []
      //查看关联接口
      this.bussiness = await getQueryBussiness(id)
      //获取角色下拉
      this.bussiRoleSel = await getBussinessRole()
      console.log(this.bussiness)
      if (this.$refs.deptTree) {
        this.deptOptions = await getBussinessDep()
        this.$refs.deptTree.setCheckedKeys([this.bussiness.startDept], true)
      }
      if (this.$refs['fromBussiness']) {
        this.$refs['fromBussiness'].resetFields()
      }
      //获取业务模块下拉
      this.bussiModuleSel = await getBussinessAll()
      console.log(this.bussiModuleSel)

      this.dialogVisibleBussines = true
    },
    //保存业务模块
    async confirmBussiness(scope) {
      const deptTreeKeys = this.$refs.deptTree.getCheckedKeys()
      this.bussiness.startDept = deptTreeKeys[0] + ''
      if (this.bussiness.startDept == 'undefined') {
        this.bussiness.startDept = ''
      }
      this.bussiness.modelId = this.modelId
      this.$refs.fromBussiness.validate(async (valid) => {
        if (!valid) {
          this.$notify({
            title: '操作失败',
            dangerouslyUseHTMLString: true,
            message: '请填写正确的数据格式',
            type: 'warning'
          })
          return
        }
        var data = await getAddBussiness(this.bussiness)
        console.log(this.bussiness)
        this.dialogVisibleBussines = false
        this.$notify({
          title: data ? '成功' : '失败',
          dangerouslyUseHTMLString: true,
          message: data ? data.message : '服务器开小差了，请稍后再试',
          type: data ? 'success' : 'warning'
        })
        this.getAllList()
      })
    },

    treeCheck(data, isCheck, isChildrenCheck) {
      if (isCheck) {
        let keys = this.$refs.deptTree.getCheckedKeys()
        // let itme = [keys[keys.length-1]]
        if (this.currentChecke && this.currentChecke == '') {
          this.currentChecke = keys[0]
        } else {
          let this_ = this
          keys.some((value) => {
            if (value != this_.currentChecke) {
              this_.currentChecke = value
              return true
            }
          })
        }
        let itme = [this.currentChecke]
        this.$refs.deptTree.setCheckedKeys(itme, true)
      }
    },
    treeCheckRole(data, checked, indeterminate, index, nodeId) {
      if (checked) {
        this.$refs[`deptTreeRole${index}`][0].setCheckedNodes([data])

        for (let i = 0; i < this.roleData.length; i++) {
          let itme = this.roleData[i]
          if (itme.nodeId === nodeId) {
            this.fromData[i].deptId = data.id
            this.fromData[i].deptName = data.label
          }
        }
      }
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
    color: #24292e;
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
