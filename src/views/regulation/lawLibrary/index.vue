<template>
  <div class="content-box app-container">
    <!-- 法律法规 -->
    <div class="left" style="background-color: #fff; padding: 10px">
      <el-input
        class="search inputAuto"
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        v-on:input="search"
        style="padding: 0 0px 10px; width: 100%"
      >
      </el-input>
      <el-radio-group v-model="checkedCities">
        <el-radio
          v-for="(city, i) in cities"
          :label="city.lawTypeId"
          :key="i"
          @change="checkedFun"
          >{{ city.lawType }}
        </el-radio>
      </el-radio-group>
    </div>
    <div class="right safe_main">
      <!-- 查询 -->
      <div class="sxForm">
        <el-form
          :inline="true"
          :model="formInline"
          ref="formInline"
          class="demo-form-inline"
        >
          <el-form-item label="法规名称" prop="lawName">
            <el-input
              v-model="formInline.lawName"
              placeholder="名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formInline.status" @change="changeTaye">
              <el-radio :label="true">有效</el-radio>
              <el-radio :label="false">失效</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="btnCont">
            <el-button class="chaxun" @click="onSubmit">查询</el-button>
            <el-button class="chongzhi" @click="onClear('formInline')"
              >重置
            </el-button>
          </div>
        </el-form>
      </div>

      <!-- 新增及删除 -->
      <div class="sxTable">
        <el-button class="blue" v-has="has.add" @click="handleAdd()"
          >新增
        </el-button>
        <el-button class="blue" v-has="has.delete" @click="handleDelete()"
          >批量删除
        </el-button>
        <!-- 表格 -->
        <el-table
          ref="multipleTable"
          :data="tableData"
          v-loading="loading"
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
              label="全选"
              width="55"
            ></el-table-column>
            <el-table-column align="center" label="名称" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.lawName }}</template>
            </el-table-column>
            <el-table-column align="center" label="类别" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.lawType }}</template>
            </el-table-column>
            <el-table-column
              align="center"
              label="颁布单位"
              show-overflow-tooltip
            >
              <template slot-scope="scope"
                >{{ scope.row.publishTime }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="实施时间"
              show-overflow-tooltip
              width="110"
            >
              <template slot-scope="scope"
                >{{ scope.row.implementTime }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="附件" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.fileName }}</template>
            </el-table-column>
            <el-table-column align="center" label="状态" width="90px">
              <template slot-scope="scope">
                <span v-if="scope.row.status == true">有效</span>
                <span v-if="scope.row.status == false">失效</span>
              </template>
            </el-table-column>
            <!-- 根据权限列表显示当前列的内容 -->
            <el-table-column
              align="center"
              prop="cz"
              fixed="right"
              label="操作"
              width="145px"
            >
              <template slot-scope="scope">
                <!-- 这里可以拿到当前行的内容 row -->
                <el-button
                  v-has="has.query"
                  type="text"
                  @click="goCheck(scope, tableData)"
                  >查看
                </el-button>
                <el-button
                  v-has="has.query"
                  type="text"
                  @click="goRedact(scope, tableData)"
                  >编辑
                </el-button>
                <el-button
                  v-has="has.delete"
                  class="red"
                  type="text"
                  @click.native.prevent="deleteRow(scope.row.lawdocId)"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </template>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSize"
          background
          layout="total, prev, pager, next, sizes, jumper"
          :total="total"
        ></el-pagination>
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
          label-width="80px"
          class="demo-ruleForm"
        >
          <el-form-item label="法规类别" prop="dictDataLawClass">
            <el-select
              v-model="ruleForm.dictDataLawClass"
              value-key="dictCode"
              placeholder="请选择"
              :disabled="forbidden"
            >
              <el-option
                v-for="item in options"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="法规名称" prop="lawName">
            <el-input
              v-model="ruleForm.lawName"
              placeholder="请输入"
              autocomplete="off"
              type="textarea"
              maxlength="50"
              show-word-limit
              :disabled="forbidden"
            ></el-input>
          </el-form-item>
          <el-form-item label="法规编号" prop="lawNumber">
            <el-input
              v-model="ruleForm.lawNumber"
              placeholder="请输入"
              autocomplete="off"
              maxlength="40"
              type="textarea"
              show-word-limit
              :disabled="forbidden"
            ></el-input>
          </el-form-item>
          <el-form-item label="发布时间" prop="releaseTime">
            <div class="block">
              <el-date-picker
                v-model="ruleForm.releaseTime"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :disabled="forbidden"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="颁布单位" prop="publishTime">
            <el-input
              v-model="ruleForm.publishTime"
              placeholder="请输入"
              autocomplete="off"
              maxlength="50"
              type="textarea"
              show-word-limit
              :disabled="forbidden"
            ></el-input>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <template>
              <el-radio-group
                v-model="ruleForm.status"
                @change="changeTaye"
                :disabled="forbidden"
              >
                <el-radio :label="true">生效</el-radio>
                <el-radio :label="false">失效</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>

          <el-form-item label="实施时间" prop="implementTime">
            <div class="block">
              <el-date-picker
                v-model="ruleForm.implementTime"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :disabled="forbidden"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="更新时间" prop="refreshTime">
            <div class="block">
              <el-date-picker
                v-model="ruleForm.refreshTime"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                :disabled="forbidden"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="法规附件" prop="fileList">
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
                <el-button v-if="flag == true">选择文件 </el-button>
                <div
                  slot="tip"
                  class="el-upload__tip"
                  style="line-height: 16px"
                  v-if="flag == true"
                >
                  只能上传Doc、docx、xls、xlsx、txt、pdf（100M）格式文件，
                </div>

                <span slot="tip" class="el-upload__tip" v-if="flag == false"
                  >点击文件下载</span
                >
              </el-upload>
              <div class="shade" v-if="flag == false"></div>
            </div>
          </el-form-item>
          <el-form-item label="法规简介">
            <span class="text_area">
              <el-input
                type="textarea"
                :rows="5"
                maxlength="300"
                show-word-limit
                placeholder="请输入内容"
                v-model="ruleForm.lawCentent"
                :disabled="forbidden"
              ></el-input>
            </span>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            v-has="has.add"
            class="tBtn"
            @click="submitForm('ruleForm')"
            v-if="isShow == false && flag"
            >确 定</el-button
          >
          <el-button
            v-has="has.edit"
            class="tBtn"
            @click="changeForm('ruleForm')"
            v-else-if="!isShow == false && flag"
            >修 改</el-button
          >
          <el-button class="fBtn" @click="resetForm('ruleForm')"
            >关 闭</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getList,
  getAddList,
  getCheck,
  getDelete,
  getInquire,
  getChangeList,
  Classification,
  fsDelete,
  getTree,
} from "@/api/regulation/lawLibrary";

export default {
  data() {
    const isSelect = (rule, value, callback) => {
      if (value == "") {
        //如果值是 0，提示用户选择正确的选项
        callback(new Error("请正确选择一级标题"));
      } else {
        callback();
      }
    };

    return {
      has: {
        delete: "law:lawdDoc:delete",
        query: "law:lawdDoc:findWrapper",
        add: "law:lawdDoc:add",
        edit: "law:lawdDoc:update",
      },
      filterText: "",
      checkAll: false,
      checkedCities: "",
      cities: [],
      isIndeterminate: false,
      reminder: true, //判断是否提示删除文件
      tableData: [],
      flag: true,
      titleType: "",
      dialogFormVisible: false, //打开弹框
      loading: true,
      isShow: false,
      forbidden: false,
      total: 0,
      multipleSelection: [], //全选
      delarr: [],
      pageNum: 1, //默认当前页
      pageSize: 10,
      fileId: "",
      formInline: {
        lawName: "",
        lawType: "",
        resource: "",
        status: "",
      },
      options: [],
      fileLists: [],
      ruleForm: {
        dictDataLawClass: "", //类别默认
        lawName: "", //名称
        lawNumber: "",
        releaseTime: "", //发布时间
        publishTime: "", //颁布单位
        status: "", //状态
        implementTime: "", //实施时间
        refreshTime: "", //更新时间
        lawCentent: "", //简介
        fileList: [], //上传文件
      },
      rules: {
        dictDataLawClass: [
          {
            required: true,
            message: "法规类别",
            trigger: "change",
            validator: isSelect,
          },
        ],
        lawName: [{ required: true, message: "法规名称", trigger: "blur" }],
        lawNumber: [{ required: true, message: "法规编号", trigger: "blur" }],
        // releaseTime: [{ required: true, message: "发布时间", trigger: "blur" }],
        // publishTime: [{ required: true, message: "颁布单位", trigger: "blur" }],
        status: [{ required: true, message: "状态", trigger: "blur" }],
        // implementTime: [
        //   { required: true, message: "实施时间", trigger: "blur" },
        // ],
        // refreshTime: [{ required: true, message: "更新时间", trigger: "blur" }],
        fileList: [{ required: true, message: "附件", trigger: "blur" }],
      },
      hiddenTableHeader: false,
      arr: [],
    };
  },
  created() {
    this.getClass();
    this.Classification();
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
    //树状列表
    search() {
      this.cities = this.cities.filter((array) =>
        array.lawType.match(this.filterText)
      );
      if (this.filterText == "") {
        this.getClass();
      }
    },
    async checkedFun() {
      // debugger
      console.log(this.checkedCities + "选中的值");
      this.formInline.lawName = "";
      this.formInline.status = "";
      let data = await getList(this.checkedCities);
      this.tableData = data.rows;
      this.total = data.total;
    },
    //创建请求列表
    async getClass() {
      this.cities = await getTree(); //获取树形数据

      let data = await getList("");
      this.tableData = data.rows;
      this.total = data.total;
      this.loading = false;
    },
    onClear(formName) {
      this.$refs[formName].resetFields();
      this.checkedCities = "";
      this.getClass();
    },

    changeTaye(value) {
      this.formInline.status = value;
    },
    //法规类别
    async Classification() {
      let data = "legal_type";
      this.options = await Classification(data);
    },
    //提交查询
    async onSubmit() {
      try {
        let { lawName, lawType, resource, status } = this.formInline;
        let data = await getInquire(
          1,
          this.pageSize,
          lawName,
          lawType,
          resource,
          status,
          this.checkedCities
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
        let { lawName, lawType, resource, status } = this.formInline;
        let lawTypeIds = this.checkedCities;

        let data = await getInquire(
          this.pageNum,
          this.pageSize,
          lawName,
          lawType,
          resource,
          status,
          lawTypeIds
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
              this.delarr.push(this.multipleSelection[i].lawdocId);
            }
            await getDelete(this.delarr);
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
      this.Classification();
      this.isShow = false;
    },
    //查看
    async goCheck(scope) {
      try {
        this.titleType = "查看信息";
        this.dialogFormVisible = true;
        this.loading = false;
        this.flag = false;
        (this.forbidden = true), this.Classification();
        let changeData = await getCheck(scope.row.lawdocId);
        this.ruleForm = changeData;
        this.fileLists = changeData.fileList;
        this.Classification();
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
        this.flag = true;
        const changeData = await getCheck(scope.row.lawdocId);
        this.ruleForm = changeData;
        this.fileLists = changeData.fileList;
        this.Classification();
      } catch (e) {
        console.error("接口异常");
      }
    },
    // 文件列表移除文件时的钩子
    async handleRemove(file, fileList) {
      if (this.flag == true) {
        this.fileId = file.fileId;
        this.ruleForm.fileList = [];
        this.$refs.upload.clearFiles();
      }
    },
    // 下载
    handlePreview(file) {
      if (this.flag == false) {
        this.fileDowloadName =
          this.$store.state.apiConfiguration.url +
          `fs/download?name=${encodeURI(encodeURI(file.name))}&path=${
            file.url
          }`;
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
      this.arr.push(res);
      let formImgList = [];
      this.arr.forEach((item) => {
        formImgList.push({
          fileName: item.body.fileName,
          url: item.body.url,
        });
      });
      if (formImgList.length > 1) {
        let arry = formImgList.pop();
        this.ruleForm.fileList.push(arry);
      } else {
        this.ruleForm.fileList = formImgList;
      }
    },
    //移除上一个文件
    removeLastFile(files, fileList) {
      if (fileList) {
        this.filesUpload = fileList.slice(-1);
      }
    },
    beforeRemove(file, fileList) {
      if (this.reminder) {
        return this.$confirm(`确定移除 ${file.name}？`);
      }
    },
    //文件大小
    beforeUpload(file) {
      console.log(file);
      let FileFormat = file.name.substring(file.name.lastIndexOf(".") + 1);
      let testmsg = FileFormat.toLowerCase();

      const extension =
        testmsg === "xls" ||
        testmsg === "xlsx" ||
        testmsg === "Doc" ||
        testmsg === "docx" ||
        testmsg === "txt" ||
        testmsg === "pdf";
      const isLt2M = file.size / 1024 / 1024 < 100;
      if (!extension) {
        this.$message({
          message: "请上传正确的格式!",
          type: "warning",
        });
        this.reminder = false;
        return false;
      }
      if (!isLt2M) {
        this.$message({
          message: "上传文件大小超过限制!",
          type: "warning",
        });
        this.reminder = false;
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
          data = await getAddList(this.ruleForm);
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
          data = await getChangeList(this.ruleForm);
          this.$refs[formName].resetFields();
          if (this.fileId) {
            await fsDelete(this.fileId);
          }
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
      this.forbidden = false;
       this.reminder = true;
    },
  },
};
</script>

<style lang="scss" scoped>
// .demo-ruleForm /deep/ {
//   .el-textarea {
//     width: 400px;
//   }
// }
// .text_area /deep/ {
//   .el-textarea {
//     width: 100%;
//   }
// }
.left {
  .el-radio-group {
    width: 100%;
    .el-radio {
      display: block;
      line-height: 28px;
      width: 100%;
    }

    .el-radio:hover {
      background-color: #f5f7fa;
    }
  }
}
</style>
