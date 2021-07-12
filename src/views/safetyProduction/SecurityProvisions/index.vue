<template>
  <div class="content-box">
    <!--  安全计划计提-->
    <div class="content">
      <!-- 新增安全计划计提 -->
      <el-dialog
        :title="titleType + '安全计划计提'"
        :close-on-click-modal="false"
        v-if="flagdiage"
        custom-class="small"
        :visible.sync="flagdiage"
      >
        <add v-if="flag == 'add'" @func="getMsgFormSon" ref="add"></add>
        <examine
          v-if="flag == 'examine'"
          @func="getMsgFormSon"
          :person="personData"
        ></examine>
        <!-- <edit v-if="flag == 'edit'" @func="getMsgFormSon" :person="personData" ref="edit"></edit> -->
        <span slot="footer" class="dialog-footer">
          <el-button
            class="tBtn"
            v-if="titleType != '查看'"
            @click="submit(titleType)"
            >提 交</el-button
          >
          <el-button class="fBtn" @click="flagdiage = false">取 消</el-button>
        </span>
      </el-dialog>

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
              <el-form-item label="单位名称" prop="deptName">
                <el-input
                  v-model="formInline.deptName"
                  placeholder="单位名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="计划实施时间" prop="planTime">
                <div class="block">
                  <el-date-picker
                    v-model="formInline.planTime"
                    type="date"
                    format="yyyy-MM-dd "
                    value-format="yyyy-MM-dd "
                    placeholder="选择日期时间"
                  ></el-date-picker>
                </div>
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
        <div class=" sxTable">
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
              :title="titleType"
              :visible.sync="dialogFormVisible"
              @close="closeDialog"
              :close-on-click-modal="false"
              custom-class="small"
            ></el-dialog>
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
              :header-cell-style="{ 'text-align': 'center' }"
              stripe
              :cell-style="{ 'text-align': 'center' }"
            >
              <!-- 表格部分 -->
              <template>
                <el-table-column
                  type="selection"
                  align="center"
                  :selectable="selectInit"
                ></el-table-column>
                <el-table-column  show-overflow-tooltip label="经费类别">
                  <template slot-scope="scope">
                    {{ scope.row.fundType }}
                  </template>
                </el-table-column>
                <el-table-column  show-overflow-tooltip label="单位名称">
                  <template slot-scope="scope">
                    {{ scope.row.deptName }}
                  </template>
                </el-table-column>
                <el-table-column  show-overflow-tooltip label="计划实施时间">
                  <template slot-scope="scope">
                    {{ scope.row.planTime }}
                  </template>
                </el-table-column>
                <el-table-column  show-overflow-tooltip label="预计金额">
                  <template slot-scope="scope">{{ scope.row.money }}</template>
                </el-table-column>
                <el-table-column  show-overflow-tooltip label="备注">
                  <template slot-scope="scope">{{ scope.row.remark }}</template>
                </el-table-column>
                <el-table-column  show-overflow-tooltip label="审批状态">
                  <template slot-scope="scope">{{
                    scope.row.status | approverStatus
                  }}</template>
                </el-table-column>
                <el-table-column prop="cz" label="操作">
                  <template slot-scope="scope">
                    <!-- 这里可以拿到当前行的内容 row -->
                    <el-button
                      v-has="has.iDquery"
                      size="small"
                      type="text"
                      style="margin-left: 10px"
                      @click="goCheck(scope, tableData)"
                      >查看</el-button
                    >
                    <!-- <el-button
                      :disabled="scope.row.status == '1'"
                      v-has="has.edit"
                      size="small"
                      type="text"
                      style="margin-left: 10px"
                      @click="goRedact(scope, tableData)"
                    >编辑</el-button> -->
                    <el-button
                      :disabled="scope.row.status == '1'"
                      v-has="has.delete"
                      size="small"
                      type="text"
                      class="red"
                      style="margin-left: 10px"
                      @click.native.prevent="deleteRow(scope.row.fundplanId)"
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
} from "@/api/safetyProduction/SecurityProvisions";
import add from "./add";
import examine from "./examine";
import edit from "./edit";
export default {
  components: {
    add,
    examine,
    edit,
  },
  data() {
    return {
      has: {
        delete: "fundPlan:post:deletes",
        query: "fundPlan:get:list",
        add: "fundPlan:post:saveOrUpDate",
        iDquery: "fundPlan:get:quest",
        edit: "fundPlan:post:saveOrUpDate",
      },
      tableData: [],
      flag: "",
      flagdiage: false,
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
        deptName: "",
        planTime: "",
        projectName: "",
        money: "",
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
    // 弹出层提交
    submit(type) {
      // 判断调用子页面提交事件
      if (type == "新增") {
        this.$refs.add.submitForm();
      } else if (type == "修改") {
        this.$refs.edit.submitForm();
      }
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
      this.flag = "";
      this.flagdiage = false;
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
        let {
          fundTypeId,
          deptName,
          planTime,
          projectName,
          money,
        } = this.formInline;
        let data = await getInquire(
          1,
          this.pageSize,
          fundTypeId,
          deptName,
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
        let {
          fundTypeId,
          deptName,
          planTime,
          projectName,
          money,
        } = this.formInline;
        let data = await getInquire(
          this.pageNum,
          this.pageSize,
          fundTypeId,
          deptName,
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
              this.delarr.push(this.multipleSelection[i].fundplanId);
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
      this.flag = "add";
      this.flagdiage = true;
    },
    //查看
    goCheck(scope) {
      this.titleType = "查看";
      this.flag = "examine";
      this.personData = scope.row.fundplanId + "";
      this.flagdiage = true;
    },
    //编辑
    goRedact(scope) {
      this.titleType = "修改";
      this.flag = "edit";
      this.personData = scope.row.fundplanId + "";
      this.flagdiage = true;
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
