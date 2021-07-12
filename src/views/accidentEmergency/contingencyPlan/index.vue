<template>
  <div class="content-box">
    <!-- 应急预案-->
    <div class="content safe_main">
      <el-dialog
        :title="titleType + '应急预案'"
        :close-on-click-modal="false"
        custom-class="small"
        :visible.sync="dialogyjyaVisible"
        v-if="dialogyjyaVisible"
      >
        <add-list
          @func="getMsgFormSon"
          v-if="operation == 'add'"
          ref="add"
        ></add-list>
        <examine
          @func="getMsgFormSon"
          :person="personData"
          v-if="operation == 'examine'"
        ></examine>
        <span slot="footer" class="dialog-footer">
          <el-button class="tBtn" v-if="titleType == '新增'" @click="sume"
            >提交</el-button
          >
          <el-button class="fBtn" @click="dialogyjyaVisible = false"
            >取 消</el-button
          >
        </span>
      </el-dialog>
      <!-- <edit
        @func="getMsgFormSon"
        :person="personData"
        v-if="operation == 'edit'"
      ></edit>-->
      <div>
        <template>
          <div class="sxForm">
            <el-form
              :inline="true"
              :model="formInline"
              ref="formInline"
              class="demo-form-inline"
            >
              <el-form-item label="预案名称" prop="planName">
                <el-input
                  v-model="formInline.planName"
                  placeholder="预案名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="预案类别" prop="planClass">
                <el-input
                  v-model="formInline.planClass"
                  placeholder="预案类别"
                ></el-input>
              </el-form-item>
              <el-form-item label="编写部门" prop="createByDept">
                <el-input
                  v-model="formInline.createByDept"
                  placeholder="编写部门"
                ></el-input>
              </el-form-item>
              <el-form-item label="编写人" prop="createBy">
                <el-input
                  v-model="formInline.createBy"
                  placeholder="编写人"
                ></el-input>
              </el-form-item>
              <el-form-item label="发布日期" prop="releaseTime">
                <div class="block">
                  <el-date-picker
                    @change="changeTime"
                    v-model="formInline.releaseTime"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期"
                  ></el-date-picker>
                </div>
              </el-form-item>
              <div class="btnCont">
                <el-button class="chaxun" v-has="has.query" @click="onSubmit"
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
              <el-button class="blue" v-has="has.add" @click="handleAdd()"
                >新增</el-button
              >
              <el-button class="blue" v-has="has.delete" @click="handleDelete()"
                >批量删除</el-button
              >
            </div>
          </template>
          <!-- 表格 -->
          <template>
            <el-table
              ref="multipleTable"
              v-loading="loading"
              :data="tableList"
              tooltip-effect="dark"
              style="width: 100%"
              height="calc(100vh - 370px)"
              @selection-change="handleSelectionChange"
              stripe
            >
              <!-- 表格部分 -->
              <template>
                <el-table-column
                  type="selection"
                  align="center"
                  :selectable="selectInit"
                ></el-table-column>
                <el-table-column align="center" label="名称">
                  <template slot-scope="scope">
                    {{ scope.row.planName }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="类别">
                  <template slot-scope="scope">
                    {{ scope.row.planClass }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="附件">
                  <template slot-scope="scope">
                    {{ scope.row.fileName }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="编写部门">
                  <template slot-scope="scope">
                    {{ scope.row.createByDept }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="编写人">
                  <template slot-scope="scope">
                    {{ scope.row.createBy }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="发布日期">
                  <template slot-scope="scope">
                    {{ scope.row.releaseTime }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="审批状态">
                  <template slot-scope="scope">{{
                    scope.row.status | approverStatus
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
                      v-has="has.idAdd"
                      size="small"
                      type="text"
                      style="margin-left: 10px"
                      @click="Records(scope, tableList)"
                      >备案</el-button
                    >
                    <!-- <el-button
                      :disabled="scope.row.status == '1'"
                      v-has="has.edit"
                      size="small"
                      type="text"
                      style="margin-left: 10px"
                      @click="goRedact(scope, tableList)"
                      >编辑</el-button
                    >-->
                    <el-button
                      :disabled="scope.row.status == '1'"
                      v-has="has.delete"
                      class="red"
                      size="small"
                      type="text"
                      style="margin-left: 10px"
                      @click.native.prevent="
                        deleteRow(scope.row.emergencyplanId)
                      "
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
          <!-- 备案 -->
          <el-dialog
            :title="titleType"
            :visible.sync="dialogVisible"
            custom-class="small"
            @close="closeDialog"
            :close-on-click-modal="false"
          >
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="150px"
              class="demo-ruleForm"
            >
              <el-form-item label="备案提交时间" prop="recordTime">
                <div class="block">
                  <el-date-picker
                    v-model="ruleForm.recordTime"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期"
                  ></el-date-picker>
                </div>
              </el-form-item>
              <el-form-item label="备案提交单位" prop="recordUnit">
                <el-input
                  v-model="ruleForm.recordUnit"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="备案附件" prop="putOnRecorsList">
                <div class="upload" style="width: 70%">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    :action="getUrl"
                    :on-remove="handleRemove"
                    :on-preview="handlePreview"
                    :before-remove="beforeRemove"
                    :on-success="uploadSuccess"
                    multiple
                    :limit="1"
                    :file-list="fileLists"
                    name="file"
                  >
                    <el-button size="small" class="fBtn" type="primary"
                      >选择文件</el-button
                    >
                  </el-upload>
                  <div class="shade" v-if="flag == false"></div>
                </div>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button
                type="primary"
                class="tBtn"
                @click="submitRecords('ruleForm')"
                >确 定</el-button
              >
              <el-button class="fBtn" @click="dialogVisible = false"
                >取 消</el-button
              >
            </span>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getList,
  getAddList,
  getDelete,
  getInquire,
  getPaging,
  Classification,
  treeselect,
  addRecords,
} from "@/api/accidentEmergency/contingencyPlan";
import addList from "./add";
import examine from "./examine";
import edit from "./edit";
const defaultPageSize = 10;
export default {
  components: {
    addList,
    examine,
    edit,
  },
  data() {
    return {
      has: {
        delete: "safemanage:emergencyPlan:deletes",
        query: "safemanage:emergencyPlan:list",
        add: "safemanage:emergencyPlan:addplan",
        idAdd: "safemanage:emergencyPlan:add",
        edit: "safemanage:emergencyPlan:edit",
        idQuery: "safemanage:emergencyPlan:query",
      },
      tableList: [],
      flag: true,
      titleType: "",
      dialogVisible: false,
      loading: true,
      isShow: false,
      total: 0,
      multipleSelection: [],
      delarr: [], //全选
      pageNum: 1, //默认当前页
      pageSize: defaultPageSize,
      fileDowloadName: "",
      //头部查询
      formInline: {
        planName: "",
        planClass: "",
        createByDept: "",
        releaseTime: "",
        createBy: "",
      },
      //新增备案数据
      ruleForm: {
        emergencyplanId: "", //应急预案主键
        recordTime: "", //备案提交时间
        recordUnit: "", //备案提交单位
        putOnRecorsList: [],
      },

      fileLists: [],
      titleType: "",
      hiddenTableHeader: false,
      arr: [],
      operation: "",
      dialogyjyaVisible: false,
      personData: "", //传id到子组件
      treeselect: [], //获取所有部门信息
      rules: {
        recordTime: [
          { required: true, message: "备案提交时间", trigger: "blur" },
        ],
        recordUnit: [
          { required: true, message: "备案提交单位", trigger: "blur" },
        ],
        putOnRecorsList: [
          { required: true, message: "备案附件", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getAllList();
  },
  computed: {
    getUrl() {
      return (
        this.$store.state.apiConfiguration.url +
        this.$store.state.serviceName.jurisdiction +
        "/fs/upload"
      );
    },
  },
  methods: {
    // 新增
    sume() {
      this.$refs.add.submitForm();
    },
    //创建请求列表
    async getAllList() {
      let data = await getList();
      this.tableList = data.rows;
      this.total = data.total;
      this.loading = false;
      this.pageNum = 1; //默认当前页
      this.pageSize = defaultPageSize;
    },
    onClear(formName) {
      this.$refs[formName].resetFields();
      this.getAllList();
    },
    //时间置空
    changeTime(value) {
      this.$nextTick(() => {
        if (value == null) {
          this.formInline.recordTime = "";
        }
      });
    },

    //提交查询
    async onSubmit() {
      try {
        let {
          planName,
          planClass,
          createByDept,
          releaseTime,
          createBy,
        } = this.formInline;
        let data = await getInquire(
          1,
          this.pageSize,
          planName,
          planClass,
          createByDept,
          releaseTime,
          createBy
        );
        this.tableList = data.rows;
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
          planName,
          planClass,
          createByDept,
          releaseTime,
          createBy,
        } = this.formInline;
        let data = await getInquire(
          this.pageNum,
          this.pageSize,
          planName,
          planClass,
          createByDept,
          releaseTime,
          createBy
        );
        this.tableList = data.rows;
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
          this.getAllList();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    //删除多个
    handleDelete() {
      if (this.multipleSelection != "") {
        this.$confirm("确定删除吗?", "删除", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            const length = this.multipleSelection.length;
            for (let i = 0; i < length; i++) {
              this.delarr.push(this.multipleSelection[i].emergencyplanId);
            }
            const yourArr = this.delarr;
            await getDelete(yourArr);
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
    // 完成
    getMsgFormSon(data) {
      this.dialogyjyaVisible = false;
      this.operation = "";
      this.getAllList();
    },
    //新增
    handleAdd() {
      this.titleType = "新增";
      this.operation = "add";
      this.dialogyjyaVisible = true;
    },
    //备案
    Records(scope) {
      this.dialogVisible = true;
      this.titleType = "新增备案";
      this.ruleForm.emergencyplanId = scope.row.emergencyplanId;
    },
    //新增备案表单
    submitRecords(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          this.$notify({
            title: "操作失败",
            dangerouslyUseHTMLString: true,
            message: "请填写完整",
            type: "warning",
          });
          return;
        }
        this.$confirm("正在执行新增/编辑操作, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            let data = null;
            try {
              let resdata = this.ruleForm;
              data = await addRecords(resdata);
              this.$refs[formName].resetFields();
            } catch (e) {
              console.error("接口异常");
            }
            this.$refs.upload.clearFiles();
            this.dialogVisible = false;
            this.$notify({
              title: data ? "成功" : "失败",
              dangerouslyUseHTMLString: true,
              message: data ? data.message : "服务器开小差了，请稍后再试",
              type: data ? "success" : "warning",
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      });
    },

    //查看
    goCheck(scope) {
      this.titleType = "查看";
      this.operation = "examine";
      this.personData = scope.row.emergencyplanId + "";
      this.dialogyjyaVisible = true;
    },
    //编辑
    async goRedact(scope) {
      this.titleType = "编辑信息";
      this.dialogFormVisible = true;
      this.operation = "edit";
      this.personData = scope.row.emergencyplanId + "";
    },
    //下载
    handlePreview(file) {
      if (this.flag == false) {
        let row = JSON.parse(JSON.stringify(file));
        this.fileDowloadName =
          this.$store.state.apiConfiguration.url +
          `/fs/download?name=${encodeURI(encodeURI(row.name))}&path=${row.url}`;
        location.href = this.fileDowloadName;
      }
    },
    //删除文件
    async handleRemove(file, fileList) {
      let row = file;
      await fsDelete(row.fileId);
      this.ruleForm.fileList = [];
      this.$refs.upload.clearFiles();
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 上传成功时的钩子
    uploadSuccess(res, file, fileList) {
      if (res.code !== 200) {
        return this.$message({
          type: "warning",
          message: "上传失败!",
        });
      }
      let arr = [];
      arr.push(res);
      let formImgList = [];
      arr.forEach((item) => {
        formImgList.push({
          fileName: item.body.fileName,
          fileUrl: item.body.url,
        });
      });
      let arry = formImgList.pop();
      this.ruleForm.putOnRecorsList.push(arry);
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
      this.ruleForm.putOnRecorsList = [];
      this.personData = "";
      this.fileLists = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.content-box {
  background-color: #f4f1f2;
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
    padding: 15px;
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
      margin-top: 15px;
    }
  }
}
</style>
