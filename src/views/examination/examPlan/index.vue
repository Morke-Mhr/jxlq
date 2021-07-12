<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="我的考试计划" name="myExamPlans" v-loading="loading">
        <div class="app-container">
          <!-- 搜索头 -->
          <div class="sxForm">
            <el-form
              ref="form"
              :model="form"
              :inline="true"
              class="demo-form-inline"
            >
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

              <el-form-item label="状态">
                <el-select
                  v-model="form.status"
                  clearable
                  placeholder="请选择状态"
                >
                  <el-option
                    v-for="(item, index) of dictionaries.status"
                    :key="index"
                    :label="item.dictLabel"
                    :value="item.dictCode"
                  ></el-option>
                </el-select>
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
            <el-button class="blue" @click="addexamplans()">新增</el-button>
            <el-button class="blue" v-has="has.delplan" @click="handleDelete()"
              >批量删除
            </el-button>

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
              <el-table-column
                align="center"
                label="测验名称"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    v-has="has.getplan"
                    @click="getplan(scope.row.examPlanId)"
                    >{{ scope.row.name }}</el-button
                  >
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
              <el-table-column
                align="center"
                prop="joinUserCount"
                label="参加人数"
                width="150"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                align="center"
                label="状态"
                width="130"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.status | exam_topicState }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="150">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    v-has="has.putplan"
					v-if="scope.row.status == 1"
                    @click="
                      editexamplans(scope.row.examPlanId, scope.row.status)
                    "
                    >编辑</el-button
                  >
                  <el-button
                    type="text"
                    class="red"
                    v-has="has.delplan"
                    @click="
                      deleteexamplans(scope.row.examPlanId, scope.row.status)
                    "
                    >删除</el-button
                  >
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
          <!-- 新增修改  -->
          <el-dialog
            title="考试计划"
            :visible.sync="diAaddVisible"
            v-if="diAaddVisible"
            @close="stepbuttom = false"
            custom-class="large"
            :close-on-click-modal="false"
          >
            <addExamPlan
              ref="addExamPlan"
              @planComplete="planComplete"
              :examIDPlan="examIDPlan"
              :addeitd="addeitd"
            ></addExamPlan>
            <span slot="footer" class="dialog-footer" v-if="stepbuttom">
              <el-button
                v-if="$refs.addExamPlan.lastbuttoms"
                class="tBtn"
                @click="$refs.addExamPlan.last()"
                >上一步</el-button
              >
              <el-button
                v-if="$refs.addExamPlan.buttoms"
                v-has="addeitd ? has.addplan : has.putplan"
                class="tBtn"
                @click="$refs.addExamPlan.next()"
                >{{ $refs.addExamPlan.bootn_type }}</el-button
              >
            </span>
          </el-dialog>
          <!-- 查看 -->
          <el-dialog
            title="考试计划"
            :visible.sync="diAgetVisible"
            v-if="diAgetVisible"
            custom-class="large"
            :close-on-click-modal="false"
          >
            <getExamPlan
              :dictionaries="dictionaries"
              :examPlanId="examPlanId"
              :diAgetVisible='diAgetVisible'
            ></getExamPlan>
            <span slot="footer" class="dialog-footer">
              <el-button class="fBtn" @click="diAgetVisible = false"
                >关 闭</el-button
              >
            </span>
          </el-dialog>
        </div>
      </el-tab-pane>
      <el-tab-pane label="考试计划" name="examPlans">
        <publicExamPlan
          ref="examPlans"
          :dictionaries="dictionaries"
        ></publicExamPlan>
      </el-tab-pane>
      <!-- <el-tab-pane label="测验统计" name="statisticsplan">
    <statisticsplan  :dictionaries="dictionaries"></statisticsplan>
      </el-tab-pane>-->
    </el-tabs>
  </div>
</template>
<script>
import { getexamPlanList } from "@/api/examination/index"; //查询考试计划接口
import { getSelectType } from "@/api/examination/index"; //字典
import { delExamPlanID } from "@/api/examination/index"; //查询考试计划接口
import publicExamPlan from "./publicExamPlan"; //公共计划
import addExamPlan from "./addExamPlan"; //新增子弹出层
import getExamPlan from "./getExamPlan"; //查看子弹出层
import statisticsplan from "./statisticsplan"; //测验统计
import axios from "axios";
import { getToken } from "@/utils/auth";
export default {
  components: {
    publicExamPlan: publicExamPlan, //考试计划
    addExamPlan: addExamPlan,
    getExamPlan: getExamPlan,
    statisticsplan: statisticsplan, // 统计
  },
  data() {
    return {
      has: {
        getplan: "exam:plan:query",
        putplan: "exam:plan:edit",
        delplan: "exam:plan:remove",
        addplan: "exam:plan:add",
      },
      stepbuttom: false,
      activeName: "myExamPlans", // 当前标签页
      search: "", // 搜索
      tableData: [], //列表 list
      multipleSelection: [], //已选中数组
      total: 0, //条目
      pageSize: 10,
      currentPage: 1,
      loading: false,
      diAaddVisible: false, //新增****
      diAgetVisible: false, //查看
      addeitd: true,
      examPlanId: "", //当前点击的计划ID
      examIDPlan: "",
      exportloading: false,
      delarr:[],//全选
      dictionaries: {
        status: [
          { dictLabel: "禁用", dictCode: 0 },
          { dictLabel: "待提交", dictCode: 1 },
          { dictLabel: "已提交", dictCode: 4 },
        ],
      },
      form: {},
    };
  },
  created() {
    this.loading = true;
    this.getdact();
  },
  methods: {
    async getExamPlanTable() {
      //查找考试计划
      let params = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        planTypeId: this.form.planTypeId,
        startTime: this.form.startTime,
        endTime: this.form.endTime,
        status: this.form.status,
      };
      const res = await getexamPlanList(params);
      for (let item of res.rows) {
        item.planTypeName = this.filet(
          item.planTypeId,
          this.dictionaries.planType
        );
        // item.paperTypeName = this.filet(item.paperTypeId, this.dictionaries.paperType); 测验模板
      }
      this.tableData = res.rows;
      this.total = res.total;
      this.loading = false;
    },
    async getdact() {
      this.dictionaries.planType = await getSelectType("exam_planType");
      this.dictionaries.paperType = await getSelectType("exam_paperType"); //测验模板
      this.dictionaries.subject = await getSelectType("exam_subject");
      this.dictionaries.discipline = await getSelectType("exam_discipline");
      this.dictionaries.grade = await getSelectType("exam_grade");
      this.getExamPlanTable();
    },

    // 过滤
    filet(id, idList) {
      if (!Array.isArray(idList)) {
        return;
      }

      id = idList.filter((item) => item.dictCode == id);
      if (id.length > 0) {
        id = id[0].dictLabel;
      } else {
        id = "";
      }
      return id;
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
      if (tab.name == "myExamPlans") {
        this.getExamPlanTable();
      } else if (tab.name == "examPlans") {
        this.$refs.examPlans.getExamPlanTable();
      }
    },
    //删除多个
    handleDelete() {
      console.log(this.multipleSelection);
      if (this.multipleSelection != "") {
        this.$confirm("确定删除吗?", "删除", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            for (let i = 0; i < this.multipleSelection.length; i++) {
              this.delarr.push(this.multipleSelection[i].examPlanId);
            }
            await delExamPlanID(this.delarr);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
             this.getExamPlanTable();
            this.$refs.multipleTable.clearSelection();
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        this.$message.error("请选择要删除项");
      }
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
    addexamplans() {
      //新增计划
      this.addeitd = true;
      this.diAaddVisible = true;
      let addbuttom = setInterval(() => {
        if (this.$refs.addExamPlan) {
          this.stepbuttom = true;
          clearInterval(addbuttom);
        }
      }, 200);
    },
    planComplete() {
      //新增或修改完成
      this.diAaddVisible = false;
      this.stepbuttom = false;
      this.getExamPlanTable();
    },
    editexamplans(examPlanId, status) {
      //修改计划
      // if (status == 4) {
      //   this.$message({
      //     type: "info",
      //     message: "不能编辑审核通过的计划"
      //   });
      //   return;
      // }

      this.addeitd = false;
      this.examIDPlan = examPlanId + "";
      this.diAaddVisible = true;
      let addbuttom = setInterval(() => {
        if (this.$refs.addExamPlan) {
          this.stepbuttom = true;
          clearInterval(addbuttom);
        }
      }, 200);
    },
    getplan(examPlanId) {
      //查看计划
      this.examPlanId = examPlanId + "";
      this.diAgetVisible = true;
    },
    // 删除计划
    deleteexamplans(examPlanId, status) {
      // if (status == 4) {
      //   this.$message({
      //     type: "info",
      //     message: "不能删除审核通过的计划"
      //   });
      //   return;
      // }
      this.$confirm("是否确定删除此计划, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await delExamPlanID(examPlanId);
          this.getExamPlanTable();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {});
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
        link.download = "我的考试计划.xlsx";
        document.body.appendChild(link);
        //模拟点击事件
        link.click();
        this.exportloading = false;
      });
    },
  },
};
</script>
