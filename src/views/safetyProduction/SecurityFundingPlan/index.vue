<template>
  <div class="content-box">
    <!--  安全经费计提-->
    <div class="content">
      <el-dialog
        :title="titleType + '安全经费计提'"
        :close-on-click-modal="false"
        v-if="flag"
        custom-class="small"
        :visible.sync="flag"
      >
        <add @func="getMsgFormSon" ref="add"></add>
        <span slot="footer" class="dialog-footer">
          <el-button class="tBtn" @click="submit(titleType)">提 交</el-button>
          <el-button class="fBtn" @click="flag = false">取 消</el-button>
        </span>
      </el-dialog>
      <!-- <add v-if="flag == 'add'" @func="getMsgFormSon"></add> -->
      <!-- <edit
        v-if="flag == 'edit'"
        @func="getMsgFormSon"
        :person="personData"
      ></edit> -->
      <div class="safe_main">
        <!-- 查询 -->
        <template>
          <div class="sxForm">
            <el-form
              :inline="true"
              :model="formInline"
              ref="formInline"
              class="demo-form-inline"
            >
              <el-form-item label=" 经费类别" prop="fundType">
                <el-select
                  v-model="formInline.fundType"
                  @change="ChangeStatus"
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.dictCode"
                    :label="item.dictLabel"
                    :value="item.dictLabel"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="标段" prop="bid">
                <el-input
                  v-model="formInline.bid"
                  placeholder="标段"
                ></el-input>
              </el-form-item>
              <el-form-item label="项目名称" prop="projectName">
                <el-input
                  v-model="formInline.projectName"
                  placeholder="项目名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="本次申报金额" prop="money">
                <el-input
                  v-model="formInline.money"
                  placeholder="本次申报金额"
                ></el-input>
              </el-form-item>
              <div class="btnCont">
                <el-button v-has="has.query" class="chaxun" @click="onSubmit"
                  >查询</el-button
                >
                <el-button class="chongzhi" @click="onClear('formInline')"
                  >重置</el-button
                >
              </div>
            </el-form>
          </div>
        </template>
        <div class="sxTable">
          <!-- 新增及删除 -->
          <template>
            <div class="header-right">
              <el-button v-has="has.add" class="blue" @click="handleAdd()"
                >新增</el-button
              >
              <el-button v-has="has.delete" class="blue" @click="handleDelete()"
                >批量删除</el-button
              >
            </div>
            <el-dialog
              custom-class="large"
              :title="titleType"
              :visible.sync="dialogFormVisible"
              @close="closeDialog"
              :close-on-click-modal="false"
            >
            </el-dialog>
          </template>
          <!-- 表格 -->
          <template>
            <el-table
              ref="multipleTable"
              v-loading="loading"
              :data="tableData"
             tooltip-effect="light"
               height="calc(100vh - 370px)"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              stripe
            >
              <!-- 表格部分 -->
              <template>
                <el-table-column
                  type="selection"
                  align="center"
                  :selectable="selectInit"
                >
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  label="经费类别"
                >
                  <template slot-scope="scope"
                    >{{ scope.row.fundType }}
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  label="项目名称"
                >
                  <template slot-scope="scope">{{
                    scope.row.projectName
                  }}</template>
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  label="项目标段"
                >
                  <template slot-scope="scope">{{ scope.row.bid }}</template>
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  label="本次申报金额"
                >
                  <template slot-scope="scope">{{ scope.row.money }}</template>
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  label="安全经费概述"
                >
                  <template slot-scope="scope">{{
                    scope.row.overview
                  }}</template>
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  label="申请人"
                >
                  <template slot-scope="scope">{{
                    scope.row.createBy
                  }}</template>
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  label="申请时间"
                >
                  <template slot-scope="scope">{{
                    scope.row.createTime
                  }}</template>
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  label="审批状态"
                >
                  <template slot-scope="scope">
                    {{ scope.row.status | approverStatus }}
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="cz" label="操作">
                  <template slot-scope="scope">
                    <!-- 这里可以拿到当前行的内容 row -->
                    <!-- <el-button
                      :disabled="scope.row.status == '1'"
                      v-has="has.query"
                      size="small"
                      type="text"
                      style="margin-left: 10px"
                      @click="goRedact(scope, tableData)"
                      >编辑</el-button
                    > -->
                    <el-button
                      :disabled="scope.row.status == '1'"
                      v-has="has.delete"
                      size="small"
                      type="text"
                      class="red"
                      style="margin-left: 10px"
                      @click.native.prevent="deleteRow(scope.row.fundaccrualId)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </template>
            </el-table>
          </template>
          <!-- 分页器 -->
          <template>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNum"
              :page-sizes="[5, 10, 20, 50]"
              :page-size="pageSize"
              layout="total, prev, pager, next, sizes, jumper"
              :total="total"
            ></el-pagination>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getList,
  getDelete,
  getProject,
  Classification,
  getInquire,
} from "@/api/safetyProduction/SecurityFundingPlan";
import add from "./add";
import edit from "./edit";
export default {
  components: {
    add,
    edit,
  },
  data() {
    return {
      has: {
        delete: "fundAccrual:post:deletes",
        query: "fundAccrual:get:quest",
        add: "fundAccrual:post:saveOrUpDate",
        edit: "fundAccrual:post:saveOrUpDate",
      },
      tableData: [],
      flag: false,
      titleType: "",
      dialogFormVisible: false, //打开弹框
      loading: true,
      isShow: false,
      total: 0,
      multipleSelection: [], //全选
      delarr: [], //全选
      pageNum: 1, //默认当前页
      pageSize: 10,
      formInline: {
        fundTypeId: "",
        fundType: "",
        bid: "",
        planTime: "",
        money: "",
        projectName: "",
      },
      hiddenTableHeader: false,
      options: {}, //经费类别
      personData: "",
    };
  },
  created() {
    this.getList();
    this.Classifications();
  },
  methods: {
    //
    submit(type) {
      this.$refs.add.submitForm();
    },
    //创建请求列表
    async getList() {
      let data = await getList();
      this.tableData = data.rows;
      this.total = data.total;
      this.loading = false;
    },
    //置空
    onClear(formName) {
      this.$refs[formName].resetFields();
      this.formInline.fundTypeId = "";
      this.getList();
    },
    //完成后回调
    getMsgFormSon() {
      this.flag = false;
      this.getList();
    },
    //经费类别
    async Classifications() {
      this.options = await Classification("Funding_category");
    },
    //选择经费类别
    ChangeStatus(e) {
      this.options.map((item) => {
        if (item.dictLabel == e) {
          this.formInline.fundTypeId = item.dictCode;
        }
      });
    },
    //提交查询
    async onSubmit() {
      try {
        let { fundTypeId, bid, planTime, projectName, money } = this.formInline;
        let data = await getInquire(
          1,
          this.pageSize,
          fundTypeId,
          bid,
          planTime,
          projectName,
          money
        );
        this.tableData = data.rows;
        this.total = data.total;
        this.loading = false;
      } catch (e) {
        console.error("接口异常");
      }
    },
    //分页查询
    async onPaging() {
      try {
        let { fundTypeId, bid, planTime, projectName, money } = this.formInline;
        let data = await getInquire(
          this.pageNum,
          this.pageSize,
          fundTypeId,
          bid,
          planTime,
          projectName,
          money
        );
        this.tableData = data.rows;
        this.loading = false;
      } catch (e) {
        console.error("接口异常");
      }
    },
    //不能勾选的
    selectInit(row, index) {
      if (row.status == "1") {
        return false; //不可勾选
      } else {
        return true; //可勾选
      }
    },
    //勾选全部
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //删除单个
    deleteRow(row) {
      this.$confirm("确定删除吗?", "删除", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await getDelete(row);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getList();
        })
        .catch((err) => {
          console.error(err);
        });
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
            const length = this.multipleSelection.length;
            for (let i = 0; i < length; i++) {
              this.delarr.push(this.multipleSelection[i].fundaccrualId);
            }
            const yourArr = this.delarr;
            await getDelete(yourArr);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getList();
            this.$refs.multipleTable.clearSelection();
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        this.$message.error("请选择要删除项");
      }
    },
    //新增
    handleAdd() {
      this.titleType = "新增";
      this.flag = true;
    },
    //编辑
    goRedact(scope) {
      this.flag = "edit";
      this.personData = scope.row.fundaccrualId + "";
    },
    // 表单取消
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
    /**
     * 分页器
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.onPaging();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.onPaging();
    },
    //关闭弹框的事件
    closeDialog(formName) {
      this.flag = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.content-box {
  background-color: #f4f1f2;
  .content {
    .content-bottom {
      background-color: #fff;
      padding: 15px;
      .header-right {
        margin-bottom: 15px;
        margin-left: 20px;
      }
      .el-table th.gutter {
        /*
    * 解决element-ui 表格篡位的问题 👇
    */
        display: table-cell !important;
      }
      .el-button--small,
      .el-button--small.is-round {
        margin-left: 20px;
      }
      .el-pagination {
        display: flex;
        justify-content: flex-end;
        margin-top: 15px;
      }
    }
  }
}
</style>
