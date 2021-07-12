<template>
  <div class="content-box">
    <div class="content safe_main">
      <!-- 查询 -->
      <template>
        <div class="sxForm">
          <el-form
            :inline="true"
            :model="formInline"
            ref="formInline"
            class="demo-form-inline"
          >
            <el-form-item label="设备名称" prop="devName">
              <el-input
                v-model="formInline.devName"
                placeholder="名称"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="规格型号" prop="devModel">
              <el-input
                v-model="formInline.devModel"
                placeholder="规格型号"
              ></el-input>
            </el-form-item> -->
            <el-form-item label="检测日期" prop="testTime">
              <div class="block">
                <el-date-picker
                  v-model="formInline.testTime"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                ></el-date-picker>
              </div>
            </el-form-item>
            <!-- <el-form-item label="检测单位" prop="testUnit">
              <el-input
                v-model="formInline.testUnit"
                placeholder="检测单位"
              ></el-input>
            </el-form-item> -->
            <el-form-item label="使用部门" prop="dept">
              <el-input
                v-model="formInline.dept"
                placeholder="使用部门"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="复检日期" prop="reviewTime">
              <div class="block">
                <el-date-picker
                  v-model="formInline.reviewTime"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                ></el-date-picker>
              </div>
            </el-form-item> -->
            <el-form-item label="检测周期" prop="testCycle">
              <div class="block">
                <el-date-picker
                  v-model="formInline.testCycle"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                ></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="下次检测日期" prop="nextTestTime">
              <div class="block">
                <el-date-picker
                  v-model="formInline.nextTestTime"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                ></el-date-picker>
              </div>
            </el-form-item>
            <!-- <el-form-item label="附件" prop="fileName">
              <el-input
                v-model="formInline.fileName"
                placeholder="附件"
              ></el-input>
            </el-form-item> -->
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
          >
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="110px"
              class="demo-ruleForm"
            >
              <el-form-item label="检测日期" prop="testTime">
                <div class="block">
                  <el-date-picker
                    v-model="ruleForm.testTime"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    :disabled="ckaflag"
                  ></el-date-picker>
                </div>
              </el-form-item>
              <el-form-item label="检测单位" prop="testUnit">
                <el-input
                  v-model="ruleForm.testUnit"
                  placeholder="请输入"
                  autocomplete="off"
                  :disabled="ckaflag"
                ></el-input>
              </el-form-item>
              <el-form-item label="整改要求" prop="requirement">
                <el-input
                  v-model="ruleForm.requirement"
                  placeholder="请输入"
                  autocomplete="off"
                  :disabled="ckaflag"
                ></el-input>
              </el-form-item>
              <el-form-item label="复检日期" prop="reviewTime">
                <div class="block">
                  <el-date-picker
                    v-model="ruleForm.reviewTime"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    :disabled="ckaflag"
                  ></el-date-picker>
                </div>
              </el-form-item>
              <el-form-item label="检测结果" prop="testResult">
                <el-input
                  v-model="ruleForm.testResult"
                  placeholder="请输入"
                  autocomplete="off"
                  :disabled="ckaflag"
                ></el-input>
              </el-form-item>
              <el-form-item label="下次检测日期" prop="nextTestTime">
                <div class="block">
                  <el-date-picker
                    v-model="ruleForm.nextTestTime"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    :disabled="ckaflag"
                  ></el-date-picker>
                </div>
              </el-form-item>
              <el-form-item label="使用证编号" prop="licenseNumber">
                <el-input
                  v-model="ruleForm.licenseNumber"
                  placeholder="请输入"
                  autocomplete="off"
                  :disabled="ckaflag"
                ></el-input>
              </el-form-item>
              <el-form-item label="附件" prop="fileName">
                <div class="upload">
                  <el-upload
                    ref="upload"
                    class="upload-demo"
                    :action="getUrl"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    :on-preview="handlePreview"
                    :on-success="uploadSuccess"
                    :on-change="removeLastFile"
                    :before-upload="beforeUpload"
                    multiple
                    :limit="1"
                    :file-list="fileLists"
                    name="file"
                  >
                    <el-button size="small" type="primary" v-if="flag == true"
                      >选择文件</el-button
                    >
                    <div
                      slot="tip"
                      class="el-upload__tip"
                      style="line-height: 16px"
                      v-if="flag == true"
                    >
                      只能上传bmp,jpg,png,gif（10M）;AVI,rmvb,FLV,mp4,3GP（1G）;Doc,docx,xls,xlsx,txt,PDF（100M）;RAR,ZIP（50M）;MP3（50M）格式文件。
                    </div>
                    <span slot="tip" class="el-upload__tip" v-if="flag == false"
                      >点击文件下载查看</span
                    >
                  </el-upload>
                  <div class="shade" v-if="flag == false"></div>
                </div>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-show="flag">
              <el-button
                v-has="has.add"
                class="tBtn"
                @click="submitForm('ruleForm')"
                v-if="isShow == false"
                >确定</el-button
              >
              <el-button
                v-has="has.edit"
                class="tBtn"
                @click="changeForm('ruleForm')"
                v-else
                >确定</el-button
              >
              <el-button class="fBtn" @click="resetForm('ruleForm')"
                >取 消</el-button
              >
            </div>
            <div slot="footer" class="dialog-footer" v-show="!flag">
              <el-button class="fBtn" @click="resetForm('ruleForm')"
                >取 消</el-button
              >
            </div>
          </el-dialog>
        </template>
        <!-- 表格 -->
        <template>
          <el-table
            ref="multipleTable"
            :data="tableData"
            v-loading="loading"
            tooltip-effect="light"
            style="width: 100%"
            height="calc(100vh - 370px)"
            @selection-change="handleSelectionChange"
            :header-cell-style="{ 'text-align': 'center' }"
            stripe
            :cell-style="{ 'text-align': 'center' }"
          >
            <!-- 表格部分 -->
            <template>
              <el-table-column
                type="selection"
                label="全选"
                width="55"
              ></el-table-column>
              <el-table-column show-overflow-tooltip label="设备编号">
                <template slot-scope="scope">{{
                  scope.row.devNumber
                }}</template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label="设备名称">
                <template slot-scope="scope">{{ scope.row.devName }}</template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label="规格型号">
                <template slot-scope="scope">{{ scope.row.devModel }}</template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label="检测日期">
                <template slot-scope="scope">{{ scope.row.testTime }}</template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label="检测单位">
                <template slot-scope="scope">{{ scope.row.testUnit }}</template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label="使用部门">
                <template slot-scope="scope">{{ scope.row.dept }}</template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label="复检日期">
                <template slot-scope="scope">{{
                  scope.row.reviewTime
                }}</template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label="下次检测日期">
                <template slot-scope="scope">{{
                  scope.row.nextTestTime
                }}</template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label="附件">
                <template slot-scope="scope">{{ scope.row.fileName }}</template>
              </el-table-column>
              <!-- 根据权限列表显示当前列的内容 -->
              <el-table-column prop="cz" label="操作">
                <template slot-scope="scope">
                  <!-- 这里可以拿到当前行的内容 row -->
                  <el-button
                    v-has="has.idQuery"
                    size="small"
                    type="text"
                    style="margin-left: 2px"
                    @click="goCheck(scope, tableData)"
                    >查看</el-button
                  >
                  <el-button
                    v-has="has.edit"
                    size="small"
                    type="text"
                    style="margin-left: 2px"
                    @click="goRedact(scope, tableData)"
                    >编辑</el-button
                  >
                  <el-button
                    v-has="has.delete"
                    size="small"
                    class="red"
                    type="text"
                    style="margin-left: 2px"
                    @click.native.prevent="deleteRow(scope.row.specialdevId)"
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
</template>

<script>
import {
  getList,
  getAddList,
  getCheck,
  getDelete,
  getPaging,
  getInquire,
  getChangeList,
  fsDelete,
  treeselect,
} from "@/api/specialEquipment/inspectionRecord";

const defaultPageSize = 10;
export default {
  data() {
    return {
      has: {
        delete: "safemanage:specialDev:delete",
        query: "safemanage:specialdevTest:list",
        add: "safemanage:specialDev:add",
        edit: "safemanage:specialDev:edit",
        idQuery: "safemanage:specialDev:list",
      },

      tableData: [],
      flag: true,
      titleType: "",
      ckaflag:'',
      dialogFormVisible: false, //打开弹框
      loading: true,
      isShow: false,
      total: 0,
      multipleSelection: [], //全选
      delarr: [],
      pageNum: 0, //默认当前页
      pageSize: defaultPageSize,
      formInline: {
        devName: "",
        devModel: "",
        testTime: "",
        testUnit: "",
        dept: "",
        reviewTime: "",
        testCycle: "",
        nextTestTime: "",
        fileName: "",
      },
      options: [],
      fileLists: [],
      ruleForm: {
        testTime: "",
        testUnit: "",
        requirement: "",
        reviewTime: "",
        testResult: "",
        nextTestTime: "",
        licenseNumber: "",
        fileName: "",
        fileUrl: "",
      },
      rules: {
        testTime: [{ required: true, message: "检测日期", trigger: "blur" }],
        testUnit: [{ required: true, message: "检测单位", trigger: "blur" }],
        requirement: [{ required: true, message: "整改要求", trigger: "blur" }],
        reviewTime: [{ required: true, message: "复检日期", trigger: "blur" }],
        testResult: [{ required: true, message: "检测结果", trigger: "blur" }],
        nextTestTime: [
          { required: true, message: "下次检测日期", trigger: "blur" },
        ],
        licenseNumber: [
          { required: true, message: "使用证编号", trigger: "blur" },
        ],
        fileName: [{ required: true, message: "附件", trigger: "change" }],
      },
      hiddenTableHeader: false,
      arr: [],
      treeselect: [],
    };
  },
  created() {
    this.getClass();
  },
  computed: {
    getUrl() {
      return this.$store.state.apiConfiguration.url + "/fs/upload";
    },
  },
  watch: {
    //监听日期为null时变成空字符串
    "formInline.testTime": {
      handler(newVal, oldVal) {
        if (newVal == null) {
          this.formInline.testTime = "";
        }
      },
      deep: true,
    },
    "formInline.reviewTime": {
      handler(newVal, oldVal) {
        if (newVal == null) {
          this.formInline.reviewTime = "";
        }
      },
      deep: true,
    },
    "formInline.testCycle": {
      handler(newVal, oldVal) {
        if (newVal == null) {
          this.formInline.testCycle = "";
        }
      },
      deep: true,
    },
    "formInline.nextTestTime": {
      handler(newVal, oldVal) {
        if (newVal == null) {
          this.formInline.nextTestTime = "";
        }
      },
      deep: true,
    },
  },
  methods: {
    //创建请求列表
    async getClass() {
      let data = await getList();
      this.tableData = data.rows;
      this.total = data.total;
      this.loading = false;
    },
    onClear(formName) {
      this.$refs[formName].resetFields();
      this.getClass();
    },

    changeTaye(value) {
      this.formInline.status = value;
    },

    //获取部门
    async department() {
      this.treeselect = await treeselect();
    },
    //提交查询
    async onSubmit() {
      try {
        let {
          devName,
          devModel,
          testTime,
          testUnit,
          dept,
          reviewTime,
          testCycle,
          nextTestTime,
          fileName,
        } = this.formInline;
        let data = await getInquire(
          1,
          this.pageSize,
          devName,
          devModel,
          testTime,
          testUnit,
          dept,
          reviewTime,
          testCycle,
          nextTestTime,
          fileName
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
          devName,
          devModel,
          testTime,
          testUnit,
          dept,
          reviewTime,
          testCycle,
          nextTestTime,
          fileName,
        } = this.formInline;
        let data = await getInquire(
          this.pageNum,
          this.pageSize,
          devName,
          devModel,
          testTime,
          testUnit,
          dept,
          reviewTime,
          testCycle,
          nextTestTime,
          fileName
        );
        this.tableData = data.rows;
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
          await getDelete(row);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getClass();
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
              this.delarr.push(this.multipleSelection[i].specialdevId);
            }
            const yourArr = JSON.parse(JSON.stringify(this.delarr));
            await getDelete(yourArr);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getClass();
            yourArr = [];
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
    },
    //查看
    async goCheck(scope) {
      try {
        this.titleType = "查看信息";
        this.dialogFormVisible = true;
        this.loading = false;
        this.isShow = true;
        this.ckaflag = true;
        this.flag = false;
        let data = scope.row.specialdevtestId;
        let changeData = await getCheck(data);
        this.ruleForm = changeData;
        this.fileLists.push(
          Object.assign(
            {},
            { name: changeData.fileName, url: changeData.fileUrl }
          )
        );
      } catch (e) {
        console.error("接口异常");
      }
    },
    //编辑
    async goRedact(scope) {
      try {
        this.titleType = "编辑信息";
        this.dialogFormVisible = true;
        this.loading = false;
        this.isShow = true;
        this.ckaflag=false;
        let data = scope.row.specialdevtestId;
        let changeData = await getCheck(data);
        this.ruleForm = changeData;
        this.fileLists.push(
          Object.assign(
            {},
            { name: changeData.fileName, url: changeData.fileUrl }
          )
        );
        console.log(this.fileLists);
      } catch (e) {
        console.error("接口异常");
      }
    },
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      this.ruleForm.fileName = "";
      this.ruleForm.fileUrl = "";
    },
    // 下载
    handlePreview(file) {
      if (this.flag == false) {
        let row = file;
        this.fileDowloadName =
          this.$store.state.apiConfiguration.url +
          `fs/download?name=${encodeURI(encodeURI(row.name))}&path=${row.url}`;
        location.href = this.fileDowloadName;
      }
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
      arr.forEach((item) => {
        this.ruleForm.fileName = item.body.fileName;
        this.ruleForm.fileUrl = item.body.url;
      });
    },
    //移除上一个文件
    removeLastFile(files, fileList) {
      if (fileList) {
        this.filesUpload = fileList.slice(-1);
      }
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    //文件校验
    beforeUpload(file) {
      let FileFormat = file.name.substring(file.name.lastIndexOf(".") + 1);
      let testmsg = FileFormat.toLowerCase();
      const extension =
        testmsg === "xls" ||
        testmsg === "xlsx" ||
        testmsg === "doc" ||
        testmsg === "docx" ||
        testmsg === "txt" ||
        testmsg === "pdf" ||
        testmsg === "bmp" ||
        testmsg === "jpg" ||
        testmsg === "png" ||
        testmsg === "gif" ||
        testmsg === "avi" ||
        testmsg === "rmvb" ||
        testmsg === "flv" ||
        testmsg === "mp4" ||
        testmsg === "3gp" ||
        testmsg === "rar" ||
        testmsg === "zip" ||
        testmsg === "mp3";

      const isLt2M = file.size / 1024 / 1024 < 1000;
      if (!extension) {
        this.ruleForm.projectDocFile = [];
        this.$message({
          message: "请上传正确的附件格式!",
          type: "warning",
        });
        return false;
      }
      if (!isLt2M) {
        this.ruleForm.projectDocFile = [];
        this.$message({
          message: "上传文件大小超过限制!",
          type: "warning",
        });
        return false;
      }
    },

    //提交表单
    submitForm(formName) {
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
        let data = null;
        try {
          let resdata = this.ruleForm;
          data = await getAddList(resdata);
          this.$refs[formName].resetFields();
          this.getClass();
        } catch (e) {
          console.error("接口异常");
        }
        this.$refs.upload.clearFiles();
        this.dialogFormVisible = false;
        this.$notify({
          title: data ? "成功" : "失败",
          dangerouslyUseHTMLString: true,
          message: data ? data.message : "服务器开小差了，请稍后再试",
          type: data ? "success" : "warning",
        });
      });
    },
    //修改
    changeForm(formName) {
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
        let data = null;
        try {
          let resdata = this.ruleForm;
          data = await getChangeList(resdata);
          this.$refs[formName].resetFields();
        } catch (e) {
          console.error("接口异常");
        }
        this.getClass();
        this.dialogFormVisible = false;
        this.$notify({
          title: data ? "成功" : "失败",
          dangerouslyUseHTMLString: true,
          message: data ? data.message : "服务器开小差了，请稍后再试",
          type: data ? "success" : "warning",
        });
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
      this.fileLists = [];
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
      padding: 15px;
      .upload {
        position: relative;
        .shade {
          position: absolute;
          right: 0;
          height: 100%;
          width: 5%;
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
}
</style>
