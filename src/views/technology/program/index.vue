<template>
  <div class="safe_main">
    <div class="sxForm">
      <el-form
        :inline="true"
        :model="pageForm"
        ref="pageForm"
        class="demo-form-inline"
      >
        <el-form-item prop="programName" label="方案名称">
          <el-input
            v-model="pageForm.programName"
            maxlength="30"
            placeholder="请输入方案名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="natureId" label="方案性质">
          <el-select
            v-model="pageForm.natureId"
            placeholder="请选择方案性质"
            style="width: 100%"
          >
            <el-option
              :value="item.dictCode"
              v-for="item in natureRes"
              :key="item.dictCode"
              :label="item.dictLabel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="categoryId" label="方案类别">
          <el-select
            v-model="pageForm.categoryId"
            placeholder="请选择方案类别"
            style="width: 100%"
          >
            <el-option
              :value="item.dictCode"
              v-for="item in typeRes"
              :key="item.dictCode"
              :label="item.dictLabel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="bid" label="标段">
          <el-input
            v-model="pageForm.bid"
            maxlength="30"
            placeholder="请输入标段"
          ></el-input>
        </el-form-item>
        <el-form-item prop="projectName" label="项目名称">
          <el-input
            v-model="pageForm.projectName"
            maxlength="30"
            placeholder="请输入项目名称"
          ></el-input>
        </el-form-item>
        <el-form-item class="btnCont">
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
    <div class="sxTable">
      <el-button v-has="has.add" class="blue"  @click="handleAdd()">
        新增
      </el-button>
      <el-button v-has="has.remove" class="blue"  @click="handleDel(scope)">
        批量删除
      </el-button>

      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%"
        tooltip-effect="light"
        @selection-change="handleSelectionChange"
         height="calc(100vh - 370px)"
        row-key="workprogramId"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        stripe
      >
        <el-table-column type="selection" width="55"> </el-table-column>

        <el-table-column label="方案名称" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.programName }}
          </template>
        </el-table-column>
        <el-table-column label="方案性质" show-overflow-tooltip width="200">
          <template slot-scope="scope">
            {{ scope.row.nature }}
          </template>
        </el-table-column>
        <el-table-column label="方案类别" show-overflow-tooltip width="100">
          <template slot-scope="scope">
            {{ scope.row.category }}
          </template>
        </el-table-column>
        <el-table-column label="项目名称" show-overflow-tooltip width="300">
          <template slot-scope="scope">
            {{ scope.row.projectName }}
          </template>
        </el-table-column>
        <el-table-column label="标段" show-overflow-tooltip width="200">
          <template slot-scope="scope">
            {{ scope.row.bid }}
          </template>
        </el-table-column>
        <el-table-column label="开工时间" show-overflow-tooltip width="150">
          <template slot-scope="scope">
            {{ scope.row.startTime }}
          </template>
        </el-table-column>
		<el-table-column label="审批状态" show-overflow-tooltip width="110">
		  <template slot-scope="scope">
		    <span v-if="scope.row.isApply == false">不需要审批</span>
		    <span v-if="scope.row.isApply == true">{{
		      scope.row.status | approverStatus
		    }}</span>
		  </template>
		</el-table-column>
        <!-- <el-table-column label="编写时间" show-overflow-tooltip width="210">
          <template slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column> -->

        <el-table-column fixed="right" width="110" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetail(scope)">
              查看
            </el-button>
            <!-- <el-button type="text" @click="handleEdit(scope)"  v-show="scope.row.status!=1">
                修改
              </el-button> -->
            <el-button
              type="text"
			  class="red"
              v-has="has.remove"
              @click="handleDel(scope)"
              v-show="!scope.row.isApply"
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
    </div>
    <!-- 弹窗 -->
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
	  v-if="dialogVisible"
      custom-class="small"
    >
      <add
        ref="programAdd"
        v-if="flag === 'Add'"
        @fatherMethod="fatherMethod"
      />
      <edit v-else-if="flag === 'Edit'" :editProgram="EditData" />
      <detailse
        v-else-if="flag === 'Details'"
        :editPrograms="EditData"
        @fatherMethod="fatherMethod"
      />
      <span slot="footer" class="dialog-footer">
        <el-button
          v-if="flag === 'Add'"
          class="tBtn"
          @click="$refs.programAdd.confirm()"
          >提 交</el-button
        >
        <el-button class="fBtn" @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getProgramList,
  getDeleteProgram
} from '@/api/technology/program/program.js'
import { getSelectTechItem } from '@/api/system/class'
import elementIcons from '@/views/system/menu/element-icons.js'
import Add from './add'
import Edit from './edit'
import Detailse from './detailse'

//新增表单字段对象
const defaultItem = {
  //项目名称
  projectName: '',
  //标段
  bid: '',
  //项目部编号
  projectDeptId: '',
  //项目部
  projectDept: '',
  //项目类型编号
  projectTypeId: '',
  //项目类型
  projectType: '',
  //项目进度编号
  projectProcessId: '',
  //项目进度
  projectProcess: '',
  //开始时间
  startTime: '',
  //结束时间
  endTime: ''
}
export default {
  components: { Add, Edit, Detailse },
  data() {
    return {
      has: {
        remove: 'safemanage:workProgram:remove',
        query: 'safemanage:workProgram:query',
        add: 'safemanage:workProgram:add'
      },
      addTit: '新增',
      tableData: [],
      total: 100,
      pageSizes: [10, 15, 20, 25, 30],
      dialogVisible: false,

      //搜索
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        projectName: '',
        programName: '',
        bid: '',
        natureId: '',
        categoryId: ''
      },
      //树形
      checkStrictly: true,
      defaultMenutree: [],
      deptOptions: [],
      multipleSelection: [],
      dialogType: 'new',
      defaultProps: {
        children: 'children',
        label: 'label',
        disabled: function(data) {
          if (data.flag == '1') {
            return true
          } else {
            return false
          }
        }
      },
      elementIcons,

      loading: false,
      //表单验证方法
      formRules: {
        projectName: [
          {
            required: true,
            message: '请输入项目名称',
            trigger: 'blur'
          }
        ],
        projectDept: [
          {
            required: true,
            message: '请选择项目部',
            trigger: 'blur'
          }
        ],
        bid: [
          {
            required: true,
            message: '请输入标段',
            trigger: 'blur'
          }
        ],
        projectTypeId: [
          {
            required: true,
            message: '请选择项目类型',
            trigger: 'blur'
          }
        ],
        projectProcessId: [
          {
            required: true,
            message: '请选择项目进度',
            trigger: 'blur'
          }
        ],
        startTime: [
          {
            required: true,
            message: '请选择开始时间',
            trigger: 'blur'
          }
        ],
        endTime: [
          {
            required: true,
            message: '请选择结束时间',
            trigger: 'blur'
          }
        ]
      },
      //新增表单字段对象
      itemModel: {
        //项目名称
        projectName: '',
        //标段
        bid: '',
        //项目部编号
        projectDeptId: '',
        //项目部
        projectDept: '',
        //项目类型编号
        projectTypeId: '',
        //项目类型
        projectType: '',
        //项目进度编号
        projectProcessId: '',
        //项目进度
        projectProcess: '',
        //开始时间
        startTime: '',
        //结束时间
        endTime: ''
      },
      //方案性质数组
      natureRes: [],
      //方案类别数组
      typeRes: [],
      flag: '',
      title: '查看详情',
      EditData: {}
    }
  },
  created: async function() {
    this.getAllList()
    this.getNatureSel()
    this.getTypeSel()
  },

  methods: {
    handleSelectionChange(val) {
      if (val) {
        let arr = []
        for (let i = 0; i < val.length; i++) {
          let itme = val[i]
          arr.push(itme.workprogramId)
        }
        this.multipleSelection = [...arr]
      }
    },
    //返回列表
    fatherMethod() {
      this.flag = ''
      this.dialogVisible = false;
      this.getAllList()
    },
    //新增
    async handleAdd() {
      this.flag = 'Add'
      this.title = '新增'
      this.dialogVisible = true
      if (this.$refs['operationFome']) {
        this.$refs['operationFome'].resetFields()
      }
    },
    //修改
    async handleEdit(scope) {
      this.flag = 'Edit'
      this.title = '修改'
      this.dialogVisible = true
      this.EditData = scope.row.workprogramId
    },
    //获取列表数据
    //获取列表
    async getAllList() {
      this.loading = true
      const res = await getProgramList(this.pageForm)
      this.tableData = res.rows
      this.total = res.total
      console.log(res)
      console.log(res.rows)
      this.loading = false
    },
    //获取方案性质下拉
    async getNatureSel() {
      let dictName = 'program_nature'
      this.natureRes = await getSelectTechItem(dictName)
    },
    //获取方案类别下拉
    async getTypeSel() {
      let dictName = 'scheme_category'
      this.typeRes = await getSelectTechItem(dictName)
    },

    //获取项目进度下拉id
    peojectFunc(val, vIndex) {
      let resultArr = this.natureRes.filter((item) => {
        return item.dictCode === val
      })
      //把值赋给要传给后台的表单对象中
      this.itemModel.projectProcessId = resultArr[0].dictCode
      this.itemModel.projectProcess = resultArr[0].dictLabel //直接写val也可以
    },
    //获取项目类型下拉id
    peojectTypeFunc(val, vIndex) {
      let resultArr = this.typeRes.filter((item) => {
        return item.dictCode === val
      })
      //把值赋给要传给后台的表单对象中
      this.itemModel.projectTypeId = resultArr[0].dictCode
      this.itemModel.projectType = resultArr[0].dictLabel //直接写val也可以
    },
    //删除
    async handleDel(scope) {
      if (!scope && this.multipleSelection.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的选项！'
        })
        return
      }
      let row = scope ? scope.row : null
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await getDeleteProgram(
            row ? row.workprogramId : this.multipleSelection
          )
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
          this.getAllList()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    //查看
    handleDetail(scope) {
      this.flag = 'Details'
      this.title = '查看详情'
      this.dialogVisible = true
      this.EditData = scope.row.workprogramId
    },

    treeCheck(data, isCheck, isChildrenCheck) {
      if (isCheck) {
        this.itemModel.projectDeptId = data.id
        this.itemModel.projectDept = data.label
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
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getAllList()
    },

    ///页脚
    handleSizeChange(val) {
      this.pageForm.pageSize = val
      this.getAllList()
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val
      this.getAllList()
    }
  }
}
</script>
