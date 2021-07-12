<template>
  <div class="app-container">
    <div class="sxForm">
      <el-form
        :inline="true"
        :model="pageForm"
        ref="pageForm"
        class="demo-form-inline"
      >
        <el-form-item label="培训类别" prop="pxClassId">
          <el-select
            v-model="pageForm.pxClassId"
            placeholder="请选择类别"
            style="width: 100%"
          >
            <el-option
              :value="item.dictCode"
              v-for="item in classRes"
              :key="item.dictCode"
              :label="item.dictLabel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="培训主题" prop="pxTitleId">
          <el-select
            v-model="pageForm.pxTitleId"
            placeholder="请选择主题"
            style="width: 100%"
          >
            <el-option
              :value="item.dictCode"
              v-for="item in themeRes"
              :key="item.dictCode"
              :label="item.dictLabel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="pageForm.status"
            placeholder="请选择状态"
            style="width: 100%"
          >
            <el-option
              :value="item.value"
              v-for="item in status"
              :key="item.value"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="btnCont">
          <el-button class="chaxun" v-has="has.query" @click="handleSearach"
            >查询</el-button
          >
          <el-button @click="resetForm('pageForm')" class="chongzhi"
            >重置</el-button
          >
        </div>
      </el-form>
    </div>
    <div class="sxTable">
      <el-button class="blue" @click="exportExcel">导出Excel</el-button>
      <div class="standing_title">
        <p>
          计划培训人数：
          <span>{{ statistics.mustFinish }}</span>
        </p>
        <p>
          已签到人数：
          <span>{{ statistics.finishCount }}</span>
        </p>
        <p>
          未签到人数：
          <span>{{ statistics.unFinishCount }}</span>
        </p>
      </div>
      <el-table
        :data="tableData"
        ref="multipleTable"
        stripe
        tooltip-effect="light"
        height="calc(100vh - 380px)"
        v-loading="loading"
      >
        <el-table-column align="center" label="培训类别" width="120" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.pxClass }}</template>
        </el-table-column>
        <el-table-column align="center" label="培训主题" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.pxTitle }}</template>
        </el-table-column>
        <el-table-column align="center" label="组织部门" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.deptName }}</template>
        </el-table-column>
        <el-table-column align="center" label="组织人" width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.createBy }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="培训开始时间"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{ scope.row.planStartTime }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="培训结束时间"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{ scope.row.planEndTime }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="培训方式"
          width="80"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{
            scope.row.pxWay == 0 ? '线上' : '线下'
          }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="培训课时"
          width="80"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{ scope.row.pxClassHour }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="计划培训人数"
          width="80"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{ scope.row.allcount }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="已签到人数"
          width="80"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{ scope.row.finishCount }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="未签到人数"
          width="80"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{
            scope.row.unfinishedCount
          }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="状态"
          width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{
            scope.row.status | approverStatusxx
          }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="是否考试"
          width="80"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{
            scope.row.examFlag == 0 ? '不需要' : '需要'
          }}</template>
        </el-table-column>
        <!-- <el-table-column fixed="right" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="del(scope)" v-has="has.del">删除</el-button>
        </template>
      </el-table-column> -->
      </el-table>

      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="pageSizes"
        :page-size="pageForm.pageSize"
        @size-change="handleSizeChange"
        :current-page.sync="pageForm.pageNum"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import {
  getTrainPlanAccountList,
  getTrainPlanAccountSumData
} from '@/api/safety/plan.js'
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
    }
  },
  data() {
    return {
      // 权限
      has: {},
      status: [
        { name: '不需要审批', value: '0' },
        { name: '审批中', value: '1' },
        { name: '审批驳回', value: '2' },
        { name: '审批通过', value: '3' }
      ],
      pageSizes: [10, 20, 30, 40],
      tableData: [],
      total: 0,
      pageForm: {
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      loading: false,
      statistics: {}
    }
  },
  mounted() {
    this.loading = true
    this.getAllList()
  },
  methods: {
    //  查询详情
    async getAllList() {
      this.loading = true
      this.statistics = await getTrainPlanAccountSumData(this.pageForm)
      let res = await getTrainPlanAccountList(this.pageForm)
      this.tableData = res.rows
      this.total = res.total
      this.loading = false
    },
    handleSearach() {
      this.pageForm.pageNum = 1
      this.pageForm.pageSize = 10
      this.getAllList()
    },
    resetForm() {
      this.pageForm = {}
      this.pageForm.pageNum = 1
      this.pageForm.pageSize = 10
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
    },
    // 删除
    //    async del(scope) {
    //       this.$confirm("是否确定删除此培训计划, 是否继续?", "提示", {
    //         confirmButtonText: "确定",
    //         cancelButtonText: "取消",
    //         type: "warning"
    //       })
    //         .then(async () => {
    //         //   const res = await deleteTopicDtails(questionId);
    //           this.$message({
    //             message: res,
    //             type: "success"
    //           });
    //           this.getAllList();
    //         })
    //         .catch(() => {});
    //     },
    // 导出
    exportExcel(v) {
      // 导出当前页
      var data = this.pageForm
      axios({
        method: 'get',
        url:
          this.$store.state.apiConfiguration.url +
          this.$store.state.serviceName.safetyEdu +
          '/trainPlan/exportPlanAccountList',
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
        link.download = '培训计划台账.xlsx'
        document.body.appendChild(link)
        //模拟点击事件
        link.click()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.safe_main .sxForm::after {
  display: none;
}
h3 {
  text-align: center;
}
.standing_title {
  float: right;
  display: flex;
  //   margin: 10px;
}
.standing_title > p {
  margin: 10px;
}
.standing_title span {
  color: #175eb6;
}
</style>
