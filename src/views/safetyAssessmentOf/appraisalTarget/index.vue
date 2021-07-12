<template>
  <div class="app-container">
    <!-- 部门岗位下拉列表 -->
    <div class="left">
      <el-tree
        :data="treedataDept"
        :props="treeProps"
        show-checkbox
        :check-strictly="true"
        class="tree"
        ref="treeForm"
        node-key="id"
        :default-expanded-keys="['200']"
        @check-change="handleNodeClick"
        @node-expand="nodeclick"
        v-loading="loadingtree"
      ></el-tree>
    </div>
    <div class="right safe_main">
      <div class="sxForm">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <!-- 部门 -->
          <el-form-item label="部门">
            <el-input
              v-model="formInline.department"
              clearable
              placeholder="请输入部门"
            ></el-input>
          </el-form-item>
          <!-- 岗位 -->
          <el-form-item label="岗位">
            <el-input
              v-model="formInline.post"
              clearable
              placeholder="请输入岗位"
            ></el-input>
          </el-form-item>
          <!-- 工作内容 -->
          <el-form-item label="工作内容">
            <el-select
              value-key="classdictId"
              @change="dictNumbers"
              v-model="formInline.workContent"
              placeholder="请选择"
            >
              <el-option
                v-for="item in work"
                :key="item.classdictId"
                :label="item.dictName"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 指标 -->
          <el-form-item label="指标">
            <el-select
              value-key="classdictId"
              v-model="formInline.workIndex"
              placeholder="请选择"
            >
              <el-option
                v-for="item in workindex"
                :key="item.classdictId"
                :label="item.dictName"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <div class="btnCont">
            <el-button v-has="has.get" class="chaxun" @click="onSubmit"
              >查询
            </el-button>
            <el-button class="chongzhi" @click="resetForm">重置</el-button>
          </div>
        </el-form>
      </div>
      <div class="sxTable">
        <el-button class="blue" v-has="has.add" @click="addform"
          >新增</el-button
        >
        <el-button class="blue" v-has="has.del" @click="batchDel"
          >批量删除</el-button
        >
        <!-- 表格 -->
        <el-table
          :data="tableData"
          tooltip-effect="light"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          v-loading="loadingtable"
          height="calc(100vh - 370px)"
          stripe
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="dept"
            label="部门"
            show-overflow-tooltip
            width="220"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="post"
            label="岗位"
            show-overflow-tooltip
            width="110"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="workContent"
            label="工作内容"
            show-overflow-tooltip
            width="110"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="period"
            label="周期"
            width="80"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="scope"
              >{{ scope.row.period == 1 ? '年度' : '月度' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="baseNum"
            label="基准数"
            width="80"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column
            prop="rule"
            label="规则"
            show-overflow-tooltip
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="score"
            label="分值"
            width="80"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column
            prop="subtractType"
            label="扣分方式"
            show-overflow-tooltip
            width="90"
            align="center"
          >
            <template slot-scope="scope"
              >{{ scope.row.subtractType == 1 ? '单项' : '合计' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="workIndex"
            label="指标"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作" fixed="right" width="90" align="center">
            <template slot-scope="scope">
              <!-- <el-button type="text" @click="seeQueryAll(scope.row.assesstargetId)">查看</el-button> -->
              <el-button
                type="text"
                class="red"
                v-has="has.del"
                @click="delQueryAll(scope.row.assesstargetId)"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          background
          layout="total, prev, pager, next,sizes,jumper"
          :total="total"
        ></el-pagination>
      </div>
      <!-- 新增查看 弹出层 -->
      <el-dialog
        title="安全考核设置"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        v-if="dialogVisible"
        custom-class="large"
      >
        <assessmentForm
          ref="assessmentForm"
          :addSee="addSee"
          @complete="complete"
          :assesstargetId="assesstargetId"
        ></assessmentForm>
        <span slot="footer" class="dialog-footer">
          <el-button
            class="fBtn"
            @click="$refs.assessmentForm.resetForm('ruleForm')"
            >取 消</el-button
          >
          <el-button
            class="tBtn"
            @click="$refs.assessmentForm.submitForm('ruleForm')"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getdictNumber //分类字典
} from '@/api/job/safety'
import { getPostsBydeptId } from '@/api/job/org'
import {
  getTreeDeptSelect, //部门岗位列表
  getqueryAll, //岗位安全考核目标全部查询
  delequeryAll //岗位安全考核目标删除
} from '@/api/safetyAssessmentOf/index'
import assessmentForm from './assessmentForm'

export default {
  components: {
    assessmentForm: assessmentForm
  },
  data() {
    return {
      has: {
        del: 'assessTarget:post:deletes',
        add: 'assessTarget:post:submit',
        get: 'assessTarget:post:queryAll'
      },

      treedataDept: [],
      treeProps: {
        children: 'children',
        label: 'label'
      },
      work: [], //工作内容可选
      workindex: [], //指标可选

      formInline: {
        //搜索表单
        department: '', //部门ID
        workContent: {}, //工作内容
        post: '' //岗位ID
      },
      tableData: [], //岗位安全考核目标
      multipleSelection: [], //岗位安全考核目标全选
      search: {
        dept: '',
        post: '',
        workContent: '',
        workIndex: ''
      },
      dialogVisible: false, //子组件弹出层
      currentPage: 1, //当前页数
      total: 0, //总条目
      pageSize: 10,
      loadingtable: false, //表格加载
      loadingtree: false, //部门下拉加载
      addSee: true, //是通过添加还是查看进入子组件
      assesstargetId: '', //如果是查看 就传入考核ID 子组件
      checkedId: ''
    }
  },

  created() {
    this.getTree()
    this.getqueryAll()
  },
  mounted() {},
  methods: {
    async nodeclick(data, node) {
      console.log(data, node)

      node.loading = true
      if (node.data.children.length == 1) {
        if (
          node.data.children[0].flag == '2' &&
          JSON.stringify(node.data.children[0].label) == 'null'
        ) {
          node.data.children = []
        }
      }
      let parw = {
        deptId: data.id
      }
      let res = await getPostsBydeptId(parw)
      let treelist
      if (node.data.hasOwnProperty('children')) {
        treelist = [...node.data.children, ...res]
      } else {
        treelist = res
      }
      if (treelist.length == 0) {
        node.loading = false
        return
      }
      // 去重
      let map = new Map()
      for (let item of treelist) {
        if (!map.has(item.id)) {
          map.set(item.id, item)
        }
      }
      treelist = [...map.values()]
      this.$refs['treeForm'].updateKeyChildren(data.id, treelist)
      node.loading = false
    },
    //   部门岗位列表 工作内容
    async getTree() {
      this.loadingtree = true

      this.treedataDept = await getTreeDeptSelect()
      this.work = await getdictNumber('DICT_WORKCONTENT')
      this.loadingtree = false
    },
    //  部门岗位列表选中事件
    handleNodeClick(data, checked, node) {
      let keys = this.$refs.treeForm.getCheckedKeys()
      if (checked === true) {
        this.checkedId = data.id
        this.$refs.treeForm.setCheckedKeys([data.id])
        this.formInline.department = ''
        if (data.flag == '0') {
          this.formInline.department = data.label
          this.formInline.post = ''
        } else if (data.flag == '1') {
          this.formInline.post = data.label
        }
      } else {
        if (data.id == this.checkedId) {
          this.formInline.department = ''
          this.formInline.post = ''
        }
      }
      this.onSubmit()
    },
    // 查询指标
    async dictNumbers(value) {
      const res = await getdictNumber(value.dictNumber)
      console.log(res)
      if (res.length < 0) {
        //如果没有结果着为空
        this.workindex = []
        return
      }
      this.workindex = res
      this.$set(this.formInline, 'workIndex', {})
    },
    // 查询按钮
    onSubmit() {
      this.currentPage = 1
      this.pageSize = 10
      let search = {}

      search.dept = this.formInline.department
      search.post = this.formInline.post
      search.workContent = this.formInline.workContent
        ? this.formInline.workContent.dictName
          ? this.formInline.workContent.dictName
          : ''
        : ''
      search.workIndex = this.formInline.workIndex
        ? this.formInline.workIndex.dictName
          ? this.formInline.workIndex.dictName
          : ''
        : ''
      this.search = search

      this.getqueryAll()
    },
    // 重置
    resetForm() {
      this.currentPage = 1
      this.pageSize = 10
      this.workindex = []
      this.formInline = {
        department: '',
        workContent: {},
        workIndex: {},
        post: ''
      }
      this.search = {
        dept: '',
        post: '',
        workContent: '',
        workIndex: ''
      }
      this.getqueryAll()
    },
    // 岗位安全考核目标全部查询
    async getqueryAll() {
      this.loadingtable = true
      let params = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        dept: this.search.dept,
        post: this.search.post,
        workContent: this.search.workContent,
        workIndex: this.search.workIndex
      }
      let res = await getqueryAll(params)
      this.tableData = res.rows
      this.total = res.total
      this.loadingtable = false
    },
    // 全选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 批量删除
    async batchDel() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: '请选择要删除的考核目标',
          type: 'warning'
        })
        return
      }
      let idList = []
      for (let v of this.multipleSelection) {
        idList.push(v.assesstargetId)
      }
      // let parem = {
      //   "idList":idList
      // };
      this.$confirm('是否确认删除这些考核目标', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await delequeryAll(idList)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getqueryAll()
        })
        .catch(() => {})
    },

    handleSizeChange(val) {
      //分页
      this.pageSize = val
      this.getqueryAll()
    },
    handleCurrentChange(val) {
      //分页
      this.currentPage = val
      this.getqueryAll()
    },
    // 查看
    seeQueryAll(ID) {
      this.assesstargetId = ID
      this.addSee = false
      this.dialogVisible = true
    },
    // 删除
    async delQueryAll(ID) {
      let list = []
      list.push(ID)
      // let parem = {
      //   idList: list
      // };
      this.$confirm('是否确认删除该考核目标', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await delequeryAll(list)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getqueryAll()
        })
        .catch(() => {})
    },
    // 新增
    addform() {
      this.addSee = true
      this.dialogVisible = true
    },
    // 新增完成
    complete() {
      this.dialogVisible = false
      this.getqueryAll()
    }
  }
}
</script>