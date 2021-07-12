<template>
  <div v-loading="loading" class="app-container">
    <!-- 搜索头 -->
    <div class="sxForm">
      <el-form ref="form" :model="form" :inline="true" class="demo-form-inline">
        <el-form-item label="测验类型">
          <el-select
            v-model="form.planTypeId"
            clearable
            placeholder="请选择测验类型"
          >
            <!-- exam_paperType -->
            <el-option
              v-for="(item, index) of dictionaries.planType"
              :key="index"
              :label="item.dictLabel"
              :value="item.dictCode"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="测验开始时间">
          <el-date-picker
            v-model="form.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="测验结束时间">
          <el-date-picker
            v-model="form.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <div class="btnCont">
          <el-button class="chaxun" v-has="has.getplan" @click="query"
            >查询</el-button
          >
          <el-button class="chongzhi" @click="Reset">重置</el-button>
        </div>
      </el-form>
    </div>
    <div class="sxTable">
      <!-- 表格 -->
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="light"
        style="width: 100%"
        height="calc(100vh - 380px)"
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column
          align="center"
          type="selection"
          width="55"
        ></el-table-column>
        <el-table-column
          align="center"
          label="检测起止时间"
          width="330"
          show-overflow-tooltip
        >
          <template slot-scope="scope"
            >{{ scope.row.startTime }} ~ {{ scope.row.endTime }}</template
          >
        </el-table-column>
        <el-table-column align="center" label="测验名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="getplan(scope.row.examPlanId)">{{
              scope.row.name
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="paperCount"
          label="题组数量"
          width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          prop="planTypeName"
          label="测验类型"
          width="150"
          show-overflow-tooltip
        ></el-table-column>
        <!-- <el-table-column prop="joinUserCount" label="参加人数" width="150"></el-table-column> -->

        <!-- <el-table-column label="标签" width="200">
        <template></template>
      </el-table-column> -->
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
    <!-- 查看 -->
    <el-dialog
      title="测验计划"
      :visible.sync="diAgetVisible"
      v-if="diAgetVisible"
      custom-class="large"
      :close-on-click-modal="false"
    >
      <getExamPlan
        :dictionaries="dictionaries"
        :examPlanId="examPlanId"
        :diAgetVisible="diAgetVisible"
      ></getExamPlan>
      <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="diAgetVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getexamPlanList } from "@/api/examination/index"; //查询测验计划接口
import { getSelectType } from "@/api/examination/index"; //字典
import getExamPlan from "./getExamPlan";
import axios from "axios";
import { getToken } from "@/utils/auth";
export default {
  props: {
    dictionaries: {
      type: Object,
    },
  },
  components: {
    getExamPlan: getExamPlan,
  },
  data() {
    return {
      has: {
        getplan: "exam:plan:query",
      },
      activeName: "myExamPlans", // 当前标签页
      search: "", // 搜索
      tableData: [], //列表 list
      multipleSelection: [], //已选中数组
      total: 0, //条目
      pageSize: 10,
      currentPage: 1,
      loading: false,
      diAgetVisible: false,
      examPlanId: 0,
      form: {},
      exportloading: false,
    };
  },
  created() {
    this.loading = true;
    this.getExamPlanTable();
  },
  methods: {
    async getExamPlanTable() {
      //查找测验计划
      let params = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        flag: "official",
        planTypeId: this.form.planTypeId,
        startTime: this.form.startTime,
        endTime: this.form.endTime,
        status: this.form.status,
      };
      const res = await getexamPlanList(params);
      // this.planType = await getSelectType("exam_planType");
      for (let item of res.rows) {
        item.planTypeName = this.dictionaries.planType.filter(
          (v) => v.dictCode == item.planTypeId
        );
        if (item.planTypeName.length > 0) {
          item.planTypeName = item.planTypeName[0].dictLabel;
        } else {
          item.planTypeName = "";
        }
      }
      this.tableData = res.rows;
      this.total = res.total;
      this.loading = false;
    },
    // 查询
    query() {
      this.pageSize = 10;
      this.currentPage = 1;
      this.getExamPlanTable();
    },
    // 重置
    Reset() {
      this.form = {};
      this.pageSize = 10;
      this.currentPage = 1;
      this.getExamPlanTable();
    },
    handleClick(tab, event) {
      //切换标签页触发
    },
    //全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      //分页
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getExamPlanTable();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getExamPlanTable();
    },
    getplan(examPlanId) {
      //查看计划
      this.examPlanId = examPlanId + "";
      this.diAgetVisible = true;
    },
    // 导出
    async examTopicexport() {
      this.exportloading = true;
      axios({
        method: "get",
        url:
          this.$store.state.apiConfiguration.url +
          this.$store.state.serviceName.examination +
          "/exam/export",
        responseType: "blob", // 表明返回服务器返回的数据类型
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken(),
        },
        //接口参数
        params: {
          planTypeId: this.form.planTypeId,
          startTime: this.form.startTime,
          endTime: this.form.endTime,
          status: this.form.status,
        },
      }).then((response) => {
        //创建一个隐藏的a连接，
        const link = document.createElement("a");
        let blob = new Blob([response.data], {
          type: "application/vnd.ms-excel",
        });
        link.style.display = "none";
        //设置连接
        link.href = URL.createObjectURL(blob);
        link.download = "测验计划.xlsx";
        document.body.appendChild(link);
        //模拟点击事件
        link.click();
        this.exportloading = false;
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
