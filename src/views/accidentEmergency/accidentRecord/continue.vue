<template>
    <!-- 续报-->
    <div >
        <!-- class content -->
        <!-- 查询 -->
          <div class="sxForm">
            <el-form
              :inline="true"
              :model="formInline"
              ref="formInline"
              class="demo-form-inline"
            >
              <el-form-item label="续报时间" prop="occurTime">
                <div class="block">
                  <el-date-picker
                    v-model="formInline.occurTime"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期"
                  ></el-date-picker>
                </div>
              </el-form-item>
              <el-form-item label="报送部门" prop="createByDept">
                <el-input
                  v-model="formInline.createByDept"
                  placeholder="报送部门"
                ></el-input>
              </el-form-item>
              <el-form-item label="报送人" prop="createBy">
                <el-input
                  v-model="formInline.createBy"
                  placeholder="报送部门"
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
        <div class="sxTable">
          <!-- 新增及删除 -->
          <template>
            <div class="header-right">
              <el-button class="blue" v-has="has.add" @click="handleAdd()"
                >新增</el-button
              >
              <el-button class="blue" v-has="has.delete" @click="handleDelete()"
                >批量删除</el-button
              >
              <el-button class="blue" @click="handleReturn()">返回</el-button>
            </div>
          </template>
          <!-- 新增盒子 -->
          <el-dialog
            :title="titleType"
            :visible.sync="dialogFormVisible"
            custom-class="small"
            @close="closeDialog"
            :close-on-click-modal="false"
          >
            <continue-add
              v-if="flag == 'add'"
              @func="getMsgFormSon"
              :person="dentId"
              ref="add"
            ></continue-add>
            <continue-examine
              v-if="flag == 'continueExamine'"
              @func="getMsgFormSon"
              :person="renewalId"
            ></continue-examine>
            <continue-edit
              v-if="flag == 'continueEdit'"
              @func="getMsgFormSon"
              :person="renewalId"
              ref="edit"
            ></continue-edit>
            <span slot="footer" class="dialog-footer">
              <el-button
                class="tBtn"
                v-if="titleType != '查看信息'"
                @click="sume(titleType)"
                >提 交</el-button
              >
              <el-button class="fBtn" @click="dialogFormVisible = false"
                >取 消</el-button
              >
            </span>
          </el-dialog>
          <!-- 表格 -->
          <template>
            <el-table
              ref="multipleTable"
              v-loading="loading"
              :data="tableList"
              tooltip-effect="dark"
              height="calc(100vh - 370px)"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              stripe
            >
              <!-- 表格部分 -->
              <template>
                <el-table-column
                  type="selection"
                  label="全选"
                  width="55"
                ></el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  label="续报时间"
                >
                  <template slot-scope="scope">{{
                    scope.row.occurTime
                  }}</template>
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  label="报送部门"
                >
                  <template slot-scope="scope">{{
                    scope.row.createByDept
                  }}</template>
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  label="报送人"
                >
                  <template slot-scope="scope">{{
                    scope.row.createBy
                  }}</template>
                </el-table-column>
                <!-- 根据权限列表显示当前列的内容 -->
                <el-table-column align="center" prop="cz" label="操作">
                  <template slot-scope="scope">
                    <!-- 这里可以拿到当前行的内容 row -->
                    <el-button
                      v-has="has.idQuery"
                      size="small"
                      type="text"
                      style="margin-left: 10px"
                      @click="goCheck(scope, tableList)"
                      >查看</el-button
                    >
                    <el-button
                      v-has="has.edit"
                      size="small"
                      type="text"
                      style="margin-left: 10px"
                      @click="goRedact(scope, tableList)"
                      >编辑</el-button
                    >
                    <el-button
                      v-has="has.delete"
                      size="small"
                      type="text"
                      class="red"
                      style="margin-left: 10px"
                      @click.native.prevent="deleteRow(scope.row.renewalId)"
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
</template>

<script>
import {
  getContinueList,
  getContinueAdd,
  getContinueDelete,
  getContinueDetails,
  getContinuePut,
  getContinueInquire,
} from "@/api/accidentEmergency/accidentRecord";
import continueAdd from "./continueDdd";
import continueExamine from "./continueExamine";
import continueEdit from "./continueEdit";

const defaultPageSize = 10;
export default {
  components: {
    continueAdd,
    continueExamine,
    continueEdit,
  },
  props: {
    person: String,
  },
  data() {
    return {
      has: {
        delete: "safemanage:accidentRenewal:deletes",
        query: "safemanage:accidentRenewal:query",
        add: "safemanage:accidentRenewal:add",
        edit: "safemanage:accidentRenewal:edit",
        idQuery: "safemanage:accidentRenewal:query",
      },

      tableList: [],
      flag: "",
      titleType: "",
      dialogFormVisible: false,
      loading: true,
      isShow: false,
      total: 0,
      multipleSelection: [],
      delarr: [], //全选
      pageNum: 1, //默认当前页
      pageSize: 10,
      fileDowloadName: "",
      //头部查询
      formInline: {
        occurTime: "",
        createByDept: "",
        createBy: "",
      },
      options: [],
      //新增表单数据
      fileLists: [],
      hiddenTableHeader: false,
      arr: [],
      accidentId: "",
      dentId: "",
      renewalId: "",
    };
  },
  created() {
    this.accidentId = this.person;
    this.getAllList();
  },
  computed: {
    getUrl() {
      return this.$store.state.apiConfiguration.url + "/fs/upload";
    },
  },
  methods: {
    sume(type) {
      if (type == "新增信息") {
        this.$refs.add.submitForm();
      } else if (type == "编辑信息") {
        this.$refs.edit.submitForm();
      }
    },
    //创建请求列表
    async getAllList() {
      let data = await getContinueList(this.accidentId);
      this.tableList = data.rows;
      this.total = data.total;
      this.loading = false;
    },
    onClear(formName) {
      this.$refs[formName].resetFields();
      this.getAllList();
    },
    //时间置空
    changeTime(value) {
      this.$nextTick(() => {
        if (value == null) {
          this.formInline.occurTime = "";
        }
      });
    },
    //提交查询
    async onSubmit() {
      try {
        let { occurTime, createByDept, createBy } = this.formInline;
        let data = await getContinueInquire(
          this.accidentId,
          1,
          this.pageSize,
          occurTime,
          createByDept,
          createBy
        );
        this.tableList = data.rows;
        this.total = data.total;
        this.loading = false;
      } catch (e) {
        console.error("接口异常");
      }
    },
    //分页面查询
    async onPaging() {
      try {
        let { occurTime, createByDept, createBy } = this.formInline;
        let data = await getContinueInquire(
          this.accidentId,
          this.pageNum,
          this.pageSize,
          occurTime,
          createByDept,
          createBy
        );
        this.tableList = data.rows;
        this.loading = false;
      } catch (e) {
        console.error("接口异常");
      }
    },

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
          await getContinueDelete(row);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getAllList();
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
              this.delarr.push(this.multipleSelection[i].renewalId);
            }
            const yourArr = this.delarr;
            await getContinueDelete(yourArr);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getAllList();
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
      this.titleType = "新增信息";
      this.dialogFormVisible = true;
      this.isShow = false;
      this.flag = "add";
      this.dentId = this.accidentId;
      console.log(this.dentId + "转的");
    },
    //新增完成后回调
    getMsgFormSon() {
      this.dialogFormVisible = false;
      this.getAllList();
    },
    handleReturn() {
      this.$emit("func");
    },
    //查看
    goCheck(scope) {
      this.titleType = "查看信息";
      this.dialogFormVisible = true;
      this.loading = false;
      this.flag = "continueExamine";
      this.renewalId = scope.row.renewalId;
    },
    //编辑
    async goRedact(scope) {
      this.titleType = "编辑信息";
      this.dialogFormVisible = true;
      this.loading = false;
      this.flag = "continueEdit";
      this.renewalId = scope.row.renewalId;
    },

    // //提交新增表单
    // submitForm(formName) {
    //   this.$refs[formName].validate(async (valid) => {
    //     if (!valid) {
    //       this.$notify({
    //         title: "操作失败",
    //         dangerouslyUseHTMLString: true,
    //         message: "请填写完整",
    //         type: "warning",
    //       });
    //       return;
    //     }
    //     let data = null;
    //     try {
    //       let resdata = this.ruleForm;
    //       data = await getContinueAdd(resdata);
    //       this.$refs[formName].resetFields();
    //     } catch (e) {
    //       console.error("接口异常");
    //     }
    //     this.dialogFormVisible = false;
    //     this.getAllList();
    //     this.$notify({
    //       title: data ? "成功" : "失败",
    //       dangerouslyUseHTMLString: true,
    //       message: data ? data.message : "服务器开小差了，请稍后再试",
    //       type: data ? "success" : "warning",
    //     });
    //   });
    // },
    //修改
    async changeForm() {
      let data = null;
      try {
        let resdata = this.ruleForm;
        data = await getChangeList(resdata);
      } catch (e) {
        console.error("接口异常");
      }
      this.dialogFormVisible = false;
      this.getAllList();
      this.$notify({
        title: data ? "成功" : "失败",
        dangerouslyUseHTMLString: true,
        message: data ? data.message : "服务器开小差了，请稍后再试",
        type: data ? "success" : "warning",
      });
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
      this.ruleForm = {};
      this.ruleForm.fileList = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.content-box {
  background-color: #f4f1f2;
  .content {
    .inquire {
      display: flex;
      padding-top: 15px;
      margin-bottom: 15px;
      background-color: #fff;
      .demo-form-inline {
        margin-left: 20px;
      }
    }
    .content-bottom {
      background-color: #fff;
      padding: 10px;
      .upload {
        position: relative;
        .shade {
          position: absolute;
          right: 0;
          height: 100%;
          width: 30%;
          top: 0;
          z-index: 999999;
          background-color: #fff;
        }
      }

      .header-right {
        margin-bottom: 15px;
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
        margin-top: 20px;
      }
    }
  }
}
</style>
