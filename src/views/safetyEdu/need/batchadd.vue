<template>
  <div class="app-container">
    <div class="sxForm">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <!-- 培训类别 -->
        <el-form-item label="培训类别">
          <el-select
            v-model="formInline.pxClassId"
            placeholder="请选择培训类别"
            @change="addseletpxClass($event, scope.$index)"
          >
            <el-option
              :value="item.dictCode"
              v-for="item in classRes"
              :key="item.dictCode"
              :label="item.dictLabel"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 培训主题 -->
        <el-form-item label="培训主题">
          <el-select
            v-model="formInline.pxTitleId"
            placeholder="请选择培训主题"
            @change="addseletpxTitle($event, scope.$index)"
          >
            <el-option
              :value="item.dictCode"
              v-for="item in themeRes"
              :key="item.dictCode"
              :label="item.dictLabel"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 部门 -->
        <el-form-item label="部门">
          <el-cascader
            v-model="formInline.pxDeptId"
            :options="deptOptions"
            :props="{ value: 'id', label: 'label', checkStrictly: true }"
            @change="select_dept"
            clearable
            :show-all-levels="false"
          ></el-cascader>
        </el-form-item>
        <!-- 岗位 -->
        <el-form-item label="岗位">
          <el-select v-model="formInline.pxPostId" placeholder="请选择岗位">
            <el-option
              v-for="item in postlist"
              :key="item.postId"
              :label="item.name"
              :value="item.postId"
            ></el-option>
          </el-select>
        </el-form-item>

        <div class="btnCont">
          <el-button class="chaxun" v-has="has.get" @click="onSubmit"
            >查询</el-button
          >
          <el-button class="chongzhi" @click="resetForm">重置</el-button>
        </div>
      </el-form>
    </div>

    <!-- table -->
    <div class="sxTable">
      <el-button class="blue" @click="exportExcel">导出Excel</el-button>
      <el-table
        :data="tableData"
        tooltip-effect="light"
        style="width: 100%"
        height="calc(100vh - 380px)"
        @selection-change="handleSelectionChange"
        v-loading="loadingtable"
        stripe
      >
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column
          prop="pxClass"
          label="培训类别"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="pxTitle"
          label="培训主题"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="pxDept"
          label="部门"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="pxPost"
          label="岗位"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="周期" show-overflow-tooltip>
          <template slot-scope="scope">{{
            scope.row.pxCycle == 0 ? '无' : '年度'
          }}</template>
        </el-table-column>
        <el-table-column
          prop="classHour"
          label="课时"
          show-overflow-tooltip
        ></el-table-column>
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
  </div>
</template>
<script>
import { getNeedList3 } from '@/api/safety/need'
import { getPostsBydeptId2 } from '@/api/job/org'
import axios from 'axios'
import { getToken } from '@/utils/auth'

export default {
  props: {
    classRes: {
      type: Array,
      default: []
    },
    themeRes: {
      type: Array,
      default: []
    },
    deptOptions: {
      type: Array,
      default: []
    }
  },

  data() {
    return {
      has: {
        get: '',
        getdetails: '',
        del: ''
      },
      currentPage: 1, //当前页数
      pageSize: 10,
      total: 0, //总条目
      tableData: [], //列表
      loadingtable: false, //加载
      formInline: {}, //搜索列表
      postlist: []
    }
  },
  created() {
    this.loadingtable = true
    this.getqueryAll()
  },
  methods: {
    // 导出
    exportExcel(v) {
      // 导出当前页
      var data = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        pxTitleId: this.formInline.pxTitleId,
        pxClassId: this.formInline.pxClassId,
        pxDeptId: this.formInline.pxDeptId,
        pxPostId: this.formInline.pxPostId
      }
      axios({
        method: 'get',
        url:
          this.$store.state.apiConfiguration.url +
          this.$store.state.serviceName.safetyEdu +
          '/trainDemand/export',
        responseType: 'blob', // 表明返回服务器返回的数据类型
        headers: {
          'Content-Type': 'application/json',
          Authorization: getToken()
        },
        params: data
      }).then(function(response) {
        //创建一个隐藏的a连接，
        const link = document.createElement('a')
        let blob = new Blob([response.data], {
          type: 'application/vnd.ms-excel'
        })
        link.style.display = 'none'
        //设置连接
        link.href = URL.createObjectURL(blob)
        link.download = '培训需求清单.xlsx'
        document.body.appendChild(link)
        //模拟点击事件
        link.click()
      })
    },
    //   选择部门
    async select_dept(v) {
      console.log(v)
      this.formInline.pxDeptId = v[v.length - 1]
      this.$set(this.formInline, 'pxPostId', '')
      //  查询岗位
      let res = await getPostsBydeptId2(this.formInline.pxDeptId)
      this.postlist = res
    },
    //   搜索
    onSubmit() {
      this.currentPage = 1
      this.pageSize = 10
      this.getqueryAll()
    },
    // 重置
    resetForm() {
      this.formInline = {}
      this.postlist = []
      this.currentPage = 1
      this.pageSize = 10
      this.getqueryAll()
    },
    //   查询数据
    async getqueryAll() {
      this.loadingtable = true
      ;(this.formInline.pageNum = this.currentPage),
        (this.formInline.pageSize = this.pageSize)
      let res = await getNeedList3(this.formInline)
      this.total = res.total
      this.tableData = res.rows
      this.loadingtable = false
    },
    // 全选
    handleSelectionChange() {},
    handleSizeChange(val) {
      //分页
      this.pageSize = val
      this.getqueryAll()
    },
    handleCurrentChange(val) {
      //分页
      this.currentPage = val
      this.getqueryAll()
    }
  }
}
</script>
<style lang="scss" scoped>
.sxForm /deep/ {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: auto;
  }
}
</style>
