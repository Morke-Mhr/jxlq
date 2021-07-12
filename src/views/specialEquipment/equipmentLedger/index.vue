<template>
  <!-- 设备台账 -->
  <div class="content-box">
    <div class="content">
      <el-dialog
        :title="titlename + '设备台账'"
        :close-on-click-modal="false"
        custom-class="small"
        :visible.sync="dialogsbtzVisible"
        v-if="dialogsbtzVisible"
      >
        <add v-if="flag === 'Add'" @func="getMsgFormSon" ref="add" />
        <amend
          v-else-if="flag === 'Amend'"
          :person="personData"
          @func="getMsgFormSon"
          ref="edit"
        />
        <span slot="footer" class="dialog-footer">
          <el-button class="tBtn" @click="submit(titlename)">确定</el-button>
          <el-button class="fBtn" @click="dialogsbtzVisible = false"
            >取 消</el-button
          >
        </span>
      </el-dialog>
      <div class="safe_main">
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
                  placeholder="设备名称"
                ></el-input>
              </el-form-item>
              <!-- <el-form-item label="规格型号" prop="devModel">
                <el-input v-model="formInline.devModel" placeholder="规格型号"></el-input>
              </el-form-item> -->
              <el-form-item label="投用日期" prop="useTime">
                <div class="block">
                  <el-date-picker
                    @change="changeTime"
                    v-model="formInline.useTime"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  ></el-date-picker>
                </div>
              </el-form-item>
              <el-form-item label="使用状态" prop="statusName">
                <el-select v-model="formInline.statusName" placeholder="请选择">
                  <el-option
                    v-for="item in quipment"
                    :key="item.dictCode"
                    :label="item.dictLabel"
                    :value="item.dictLabel"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="使用部门" prop="dept">
                <el-input
                  v-model="formInline.dept"
                  placeholder="使用部门"
                ></el-input>
              </el-form-item>
              <!-- <el-form-item label="生产厂家" prop="factory">
                <el-input v-model="formInline.factory" placeholder="生产厂家"></el-input>
              </el-form-item> -->
              <el-form-item label="检测周期" prop="testCycle">
                <el-input
                  v-model="formInline.testCycle"
                  placeholder="检测周期"
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
              :data="tableList"
              v-loading="loading"
              tooltip-effect="light"
              style="width: 100%"
              height="calc(100vh - 370px)"
              @selection-change="handleSelectionChange"
              :header-cell-style="{ 'text-align': 'center' }"
              :cell-style="{ 'text-align': 'center' }"
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
                  show-overflow-tooltip
                  prop="devNumber"
                  label="设备编号"
                >
                  <template slot-scope="scope">
                    {{ scope.row.devNumber }}
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="devName"
                  label="设备名称"
                >
                  <template slot-scope="scope">
                    {{ scope.row.devName }}
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="devModel"
                  label="规格型号"
                >
                  <template slot-scope="scope">
                    {{ scope.row.devModel }}
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="useTime"
                  label="投用日期"
                >
                  <template slot-scope="scope">
                    {{ scope.row.useTime }}
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="statusName"
                  label="使用状态"
                >
                  <template slot-scope="scope">
                    {{ scope.row.statusName }}
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="dept"
                  label="使用部门"
                >
                  <template slot-scope="scope">{{ scope.row.dept }}</template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="factory"
                  label="生产厂家"
                >
                  <template slot-scope="scope">
                    {{ scope.row.factory }}
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="testCycle"
                  label="检测周期"
                >
                  <template slot-scope="scope">
                    1{{ scope.row.testCycle }}{{ scope.row.cycleTimes }}次
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="projectDocFile"
                  label="备注"
                >
                  <template slot-scope="scope">{{ scope.row.remark }}</template>
                </el-table-column>
                <!-- 根据权限列表显示当前列的内容 -->
                <el-table-column prop="cz" label="操作" width="180">
                  <template slot-scope="scope">
                    <!-- 这里可以拿到当前行的内容 row -->
                    <el-button
                      v-has="has.edit"
                      size="small"
                      type="text"
                      style="margin-left: 0"
                      @click="goRedact(scope, tableList)"
                      >编辑</el-button
                    >
                    <el-button
                      v-has="has.inAdd"
                      size="small"
                      type="text"
                      style="margin-left: 0"
                      @click="Detection(scope, tableList)"
                      >添加检测记录</el-button
                    >
                    <el-button
                      v-has="has.delete"
                      size="small"
                      type="text"
                      class="red"
                      style="margin-left: 0"
                      @click.native.prevent="deleteRow(scope.row.specialdevId)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </template>
            </el-table>
          </template>
          <!-- 新增检查记录盒子 -->
          <template>
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
                    ></el-date-picker>
                  </div>
                </el-form-item>
                <el-form-item label="检测单位" prop="testUnit">
                  <el-input
                    v-model="ruleForm.testUnit"
                    placeholder="请输入"
                    autocomplete="off"
                    maxlength="100"
                     show-word-limit
                  ></el-input>
                </el-form-item>
                <el-form-item label="整改要求" prop="requirement">
                  <el-input
                    v-model="ruleForm.requirement"
                    type="textarea"
                    :rows="5"
                    placeholder="请输入"
                    autocomplete="off"
                    maxlength="300"
                     show-word-limit
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
                    ></el-date-picker>
                  </div>
                </el-form-item>
                <el-form-item label="检测结果" prop="testResult">
                  <el-input
                    v-model="ruleForm.testResult"
                    :rows="5"
                    placeholder="请输入"
                    type="textarea"
                     show-word-limit
                    autocomplete="off"
                    maxlength="200"
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
                    ></el-date-picker>
                  </div>
                </el-form-item>
                <el-form-item label="使用证编号" prop="licenseNumber">
                  <el-input
                    v-model="ruleForm.licenseNumber"
                    placeholder="请输入"
                    autocomplete="off"
                    maxlength="50"
                     show-word-limit
                  ></el-input>
                </el-form-item>
                <el-form-item label="附件" prop="fileUrl">
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
                      <el-button size="small" type="primary"
                        >选择文件</el-button
                      >
                      <div
                        slot="tip"
                        class="el-upload__tip"
                        style="line-height: 16px"
                      >
                        只能上传bmp,jpg,png,gif（10M）;AVI,rmvb,FLV,mp4,3GP（1G）;Doc,docx,xls,xlsx,txt,PDF（100M）;RAR,ZIP（50M）;MP3（50M）格式文件。
                      </div>
                    </el-upload>
                  </div>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button
                  v-has="has.add"
                  class="tBtn"
                  @click="submitReq('ruleForm')"
                  >确 定</el-button
                >
                <el-button class="fBtn" @click="resetForm('ruleForm')"
                  >取 消</el-button
                >
              </div>
            </el-dialog>
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
  getInquire,
  getPaging,
  treeselect,
  specialequipment,
  postAddList,
} from "@/api/specialEquipment/equipmentLedger";
var token = localStorage.getItem("token");
const defaultPageSize = 10;
import Add from "./add";
import Amend from "./amend";
export default {
  components: { Add, Amend },
  data() {
    return {
      has: {
        delete: "safemanage:specialDev:delete",
        query: "safemanage:specialDev:list",
        add: "safemanage:specialDev:add",
        edit: "safemanage:specialDev:edit",
        inAdd: "safemanage:specialDevtest:add",
      },
      fileName: "fileName",
      tableList: [],
      dialogFormVisible: false, //打开弹框
      loading: true,
      total: 0,
      isShow: false,
      multipleSelection: [], //全选
      delarr: [], //全选
      pageNum: 1, //默认当前页
      pageSize: defaultPageSize,
      formInline: {
        devName: "",
        devModel: "",
        useTime: "",
        statusName: "",
        dept: "",
        factory: "",
        testCycle: "",
      },
      ruleForm: {
        specialdevId: "",
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
        fileUrl: [{ required: true, message: "附件", trigger: "change" }],
      },
      fileLists: [],
      hiddenTableHeader: false,
      flag: "",
      dialogsbtzVisible: false,
      titlename: "",
      personData: {},
      treeselect: [],
      quipment: [],
      titleType: "",
      optionProps: {
        value: "id",
      },
    };
  },
  created() {
    this.getEqList();
    this.department();
    this.SQstatus();
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
    submit(type) {
      if (type == "新增") {
        this.$refs.add.submitForm("ruleForm");
      } else if (type == "编辑") {
        this.$refs.edit.submitForm("ruleForm");
      }
    },
    //创建请求列表
    async getEqList() {
      let data = await getList();
      this.tableList = data.rows;
      this.total = data.total;
      this.loading = false;
    },
    //获取部门
    async department() {
      this.treeselect = await treeselect();
    },
    //获取状态
    async SQstatus() {
      this.quipment = await specialequipment("specialequipment_status");
    },
    //新增完后返回到列表页
    getMsgFormSon(data) {
      this.dialogsbtzVisible = false;
      this.flag = "";
      this.getEqList();
    },
    //新增检测记录
    Detection(scope) {
      this.titleType = "新增检查记录";
      this.dialogFormVisible = true;
      this.ruleForm.specialdevId = scope.row.specialdevId;
    },

    //置空
    onClear(formName) {
      this.$refs[formName].resetFields();
      this.getEqList();
    },
    changeTime(value) {
      this.$nextTick(() => {
        if (value == null) {
          this.formInline.useTime = "";
        }
      });
    },
    //提交查询
    async onSubmit() {
      try {
        let {
          devName,
          devModel,
          useTime,
          statusName,
          dept,
          factory,
          testCycle,
        } = this.formInline;
        let data = await getInquire(
          1,
          this.pageSize,
          devName,
          devModel,
          useTime,
          statusName,
          dept,
          factory,
          testCycle
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
          devName,
          devModel,
          useTime,
          statusName,
          dept,
          factory,
          testCycle,
        } = this.formInline;
        let data = await getInquire(
          this.pageNum,
          this.pageSize,
          devName,
          devModel,
          useTime,
          statusName,
          dept,
          factory,
          testCycle
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
          await getDelete(row);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getEqList();
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
              this.delarr.push(this.multipleSelection[i].specialdevId);
            }
            const yourArr = this.delarr;
            await getDelete(yourArr);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getEqList();
            this.$refs.multipleTable.clearSelection();
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        this.$message.error("请选择要删除项");
      }
    },
    //编辑
    goRedact(scope) {
      this.titlename = "编辑";
      this.flag = "Amend";
      this.personData = scope.row.specialdevId;
      this.dialogsbtzVisible = true;
    },
    //新增
    handleAdd() {
      this.titlename = "新增";
      this.flag = "Add";
      this.dialogsbtzVisible = true;
    },
    //新增表单
    submitReq(formName) {
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
          data = await postAddList(resdata);
          this.$refs[formName].resetFields();
          this.dialogFormVisible = false;
        } catch (e) {
          console.error("接口异常");
        }
        this.$notify({
          title: data ? "成功" : "失败",
          dangerouslyUseHTMLString: true,
          message: data ? data.message : "服务器开小差了，请稍后再试",
          type: data ? "success" : "warning",
        });
      });
    },

    // 文件列表移除文件时的钩子
    async handleRemove(file, fileList) {
      if (this.flag == false) {
        let row = file;
        await fsDelete(row.fileId);
        this.ruleForm.fileList = [];
        this.$refs.upload.clearFiles();
      }
    },
    // 下载
    handlePreview(file) {
      if (this.flag == false) {
        let row = file;
        this.fileDowloadName =
          this.$store.state.apiConfiguration.url +
          `/fs/download?name=${encodeURI(encodeURI(row.name))}&path=${row.url}`;
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
    //文件大小
    beforeUpload(file) {
      console.log(file);
      let FileFormat = file.name.substring(file.name.lastIndexOf(".") + 1);
      let testmsg = FileFormat.toLowerCase();
      const extension = testmsg === "xls";
      const extension2 = testmsg === "xlsx";
      const extension3 = testmsg === "doc";
      const extension4 = testmsg === "docx";
      const extension5 = testmsg === "txt";
      const extension6 = testmsg === "pdf";
      const extension7 = testmsg === "bmp";
      const extension8 = testmsg === "jpg";
      const extension9 = testmsg === "png";
      const extension10 = testmsg === "gif";
      const extension11 = testmsg === "avi";
      const extension12 = testmsg === "rmvb";
      const extension13 = testmsg === "flv";
      const extension14 = testmsg === "mp4";
      const extension15 = testmsg === "3gp";
      const extension16 = testmsg === "rar";
      const extension17 = testmsg === "zip";
      const extension18 = testmsg === "mp3";

      const isLt2M = file.size / 1024 / 1024 < 1000;
      if (
        !extension &&
        !extension2 &&
        !extension3 &&
        !extension4 &&
        !extension5 &&
        !extension6 &&
        !extension7 &&
        !extension8 &&
        !extension9 &&
        !extension10 &&
        !extension11 &&
        !extension12 &&
        !extension13 &&
        !extension14 &&
        !extension15 &&
        !extension16 &&
        !extension17 &&
        !extension18
      ) {
        this.ruleForm.projectDocFile = [];
        this.$message({
          message: "请上传正确的格式!",
          type: "warning",
        });
      }
      if (!isLt2M) {
        this.ruleForm.projectDocFile = [];
        this.$message({
          message: "上传文件大小超过限制!",
          type: "warning",
        });
      }
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
    // 表单取消
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
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
}
</style>
