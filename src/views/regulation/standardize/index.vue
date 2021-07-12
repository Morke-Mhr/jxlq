<template>
  <div class="content-box app-container">
    <!-- 作业标准库-->
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
          :label="city.workTypeId"
          :key="i"
          @change="checkedFun"
          >{{ city.workType }}
        </el-radio>
      </el-radio-group>
    </div>

    <div class="right safe_main">
      <div class="sxForm">
        <el-form
          :inline="true"
          :model="formInline"
          ref="formInline"
          class="demo-form-inline"
        >
          <el-form-item label="作业名称" prop="workName">
            <el-input
              v-model="formInline.workName"
              placeholder="作业名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="上传人" prop="createBy">
            <el-input
              v-model="formInline.createBy"
              placeholder="上传人"
            ></el-input>
          </el-form-item>
          <div class="btnCont">
            <el-button class="chaxun" @click="onSubmit">查询</el-button>
            <el-button class="chongzhi" @click="onClear('formInline')"
              >重置
            </el-button>
          </div>
        </el-form>
      </div>
      <div class="sxTable">
        <!-- 新增及删除 -->
        <el-button class="blue" v-has="has.add" @click="handleAdd()"
          >新增</el-button
        >
        <el-button class="blue" v-has="has.delete" @click="handleDelete()"
          >批量删除
        </el-button>

        <!-- 表格 -->
        <el-table
          ref="multipleTable"
          v-loading="loading"
          :data="tableList"
          tooltip-effect="light"
          height="calc(100vh - 370px)"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          stripe
        >
          <!-- 表格部分 -->
          <el-table-column
            type="selection"
            label="全选"
            width="55"
          ></el-table-column>
          <el-table-column align="center" label="名称" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.workName }}</template>
          </el-table-column>
          <el-table-column align="center" label="类别" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.workType }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="上传人"
            show-overflow-tooltip
            width="120"
          >
            <template slot-scope="scope">{{ scope.row.createBy }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="上传时间"
            show-overflow-tooltip
          >
            <template slot-scope="scope">{{ scope.row.createTime }}</template>
          </el-table-column>
          <el-table-column align="center" label="附件" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.fileName }}</template>
          </el-table-column>
          <!-- 根据权限列表显示当前列的内容 -->
          <el-table-column prop="cz" label="操作" fixed="right" width="145px">
            <template slot-scope="scope">
              <!-- 这里可以拿到当前行的内容 row -->
              <el-button
                v-has="has.idQuery"
                type="text"
                @click="goCheck(scope, tableList)"
                >查看
              </el-button>
              <el-button
                v-has="has.idQuery"
                type="text"
                @click="goRedact(scope, tableList)"
                >编辑
              </el-button>
              <el-button
                v-has="has.delete"
                class="red"
                type="text"
                @click.native.prevent="deleteRow(scope.row.workstandardId)"
                >删除
              </el-button>
            </template>
          </el-table-column>
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
        <!-- 新增盒子 -->
        <el-dialog
          :title="titleType"
          :visible.sync="dialogFormVisible"
          @close="closeDialog"
          :close-on-click-modal="false"
          custom-class="small"
        >
          <el-form
            v-loading="loading"
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="80px"
            class="demo-ruleForm"
          >
            <el-form-item label="类别" prop="dictDataWorkType">
              <el-select
                v-model="ruleForm.dictDataWorkType"
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
            <el-form-item label="作业名称" prop="workName">
              <span class="text_area">
                <el-input
                  v-model="ruleForm.workName"
                  placeholder="请输入"
                  autocomplete="off"
                  type="textarea"
                  maxlength="50"
                  show-word-limit
                  :disabled="forbidden"
                ></el-input>
              </span>
            </el-form-item>
            <el-form-item label="附件" prop="fileList">
              <div class="upload">
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  :action="getUrl"
                  :on-remove="handleRemove"
                  :on-preview="handlePreview"
                  :before-remove="beforeRemove"
                  :on-success="uploadSuccess"
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
                    只能上传bmp、jpg，png，gif；AVI、rmvb、FLV、mp4、3GP；Doc、docx、xls、xlsx、txt、PDF；RAR、ZIP；MP3格式文件不能超过（1G），
                  </div>
                  <span slot="tip" class="el-upload__tip" v-if="flag == false"
                    >点击文件下载</span
                  >
                </el-upload>
                <div class="shade" v-if="flag == false"></div>
              </div>
            </el-form-item>
            <el-form-item label="作业要求" prop="workRequire">
              <el-input
                type="textarea"
                :rows="5"
                maxlength="300"
                show-word-limit
                placeholder="请输入内容"
                v-model="ruleForm.workRequire"
                :disabled="forbidden"
              ></el-input>
            </el-form-item>
            <el-form-item label="作业内容" prop="workContent">
              <el-input
                type="textarea"
                :rows="5"
                maxlength="300"
                show-word-limit
                placeholder="请输入内容"
                v-model="ruleForm.workContent"
                :disabled="forbidden"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" v-show="flag">
            <el-button
              v-has="has.add"
              class="tBtn"
              @click="submitForm('ruleForm')"
              v-if="isShow == false"
              >确 定
            </el-button>
            <el-button
              v-has="has.edit"
              class="tBtn"
              @click="changeForm('ruleForm')"
              v-else
              >修改
            </el-button>
            <el-button class="fBtn" @click="resetForm('ruleForm')"
              >取 消
            </el-button>
          </div>
        </el-dialog>
      </div>
    </div>
    <!-- 查询 -->
  </div>
</template>

<script>
import {
  getList,
  getAddList,
  getDelete,
  getInquire,
  getCheck,
  Classification,
  getChangeList,
  fsDelete,
  getTree,
} from "@/api/regulation/standardize";

export default {
  data() {
    const isSelect = (rule, value, callback) => {
      if (value == 0) {
        //如果值是 0，提示用户选择正确的选项
        callback(new Error("请正确选择一级标题"));
      } else {
        callback();
      }
    };

    return {
      has: {
        delete: "laws:workstandarddoc:delete",
        query: "laws:workstandarddoc:findWrapper",
        add: "laws:workstandarddoc:add",
        edit: "laws:workstandarddoc:update",
        idQuery: "laws:workstandarddoc:findById",
      },
      filterText: "",
      checkAll: false,
      checkedCities: [],
      cities: [],
      isIndeterminate: false,
      forbidden: false,
      tableList: [],
      flag: true,
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
        workName: "",
        workType: "",
        createBy: "",
      },
      options: [],
      //新增表单数据
      fileLists: [],
      ruleForm: {
        workstandardId: "",
        dictDataWorkType: "",
        workName: "",
        workRequire: "",
        workContent: "",
        fileList: [],
      },
      rules: {
        dictDataWorkType: [
          {
            required: true,
            message: "类别",
            trigger: "change",
            validator: isSelect,
          },
        ],
        workName: [{ required: true, message: "名称", trigger: "blur" }],
        fileList: [{ required: true, message: "附件", trigger: "blur" }],
        workRequire: [{ required: true, message: "要求", trigger: "blur" }],
        workContent: [{ required: true, message: "内容", trigger: "blur" }],
      },
      hiddenTableHeader: false,
      arr: [],
      fileId: "",
    };
  },
  created() {
    this.getStandardizeList();
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
    search() {
      this.cities = this.cities.filter((array) =>
        array.workType.match(this.filterText)
      );
      if (this.filterText == "") {
        this.getStandardizeList();
      }
    },
    async checkedFun() {
      // debugger
      this.loading = true;
      this.formInline.workName = "";
      this.formInline.createBy = "";
      this.formInline.workType = "";
      let data = await getList(this.checkedCities);
      this.tableList = data.rows;
      this.total = data.total;
      this.loading = false;
    },

    //创建请求列表
    async getStandardizeList() {
      this.cities = await getTree(); //获取树形数据
      this.loading = true;
      let data = await getList("");
      this.tableList = data.rows;
      this.total = data.total;
      this.loading = false;
    },
    onClear(formName) {
      // debugger;
      this.$refs[formName].resetFields();
      this.checkedCities = [];
      this.getStandardizeList();
    },
    //分类查询
    async Classification() {
      let data = "Job_category";
      this.options = await Classification(data);
    },
    //提交查询
    async onSubmit() {
      try {
        let { workName, workType, createBy } = this.formInline;
        let data = await getInquire(
          1,
          this.pageSize,
          workName,
          workType,
          createBy,
          this.checkedCities
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
        let { workName, workType, createBy } = this.formInline;
        let workTypeIds = this.checkedCities;
        let data = await getInquire(
          this.pageNum,
          this.pageSize,
          workName,
          workType,
          createBy,
          workTypeIds
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
          this.getStandardizeList();
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
              this.delarr.push(this.multipleSelection[i].workstandardId);
            }
            const yourArr = this.delarr;
            await getDelete(yourArr);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getStandardizeList();
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
      this.Classification();
    },
    //查看
    async goCheck(scope) {
      try {
        this.titleType = "查看信息";
        this.dialogFormVisible = true;
        this.loading = false;
        this.flag = false;
        this.forbidden = true;
        this.Classification();
        let data = scope.row.workstandardId;
        const changeData = await getCheck(data);
        this.ruleForm = changeData;
        this.fileLists = changeData.fileList;
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
        this.Classification();
        let data = scope.row.workstandardId;
        const changeData = await getCheck(data);
        this.ruleForm = changeData;
        this.fileLists = changeData.fileList;
      } catch (e) {
        console.error("接口异常");
      }
    },
    // 文件列表移除文件时的钩子
    async handleRemove(file, fileList) {
      if (this.flag == true) {
        this.ruleForm.fileList = [];
        this.$refs.upload.clearFiles();
        this.fileId = file.fileId;
      }
    },
    //下载
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
    //文件校验
    beforeUpload(file) {
      console.log(file);
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
        this.ruleForm.fileList = [];
        this.$message({
          message: "请上传正确的格式!",
          type: "warning",
        });
        return false;
      }
      if (!isLt2M) {
        this.ruleForm.fileList = [];
        this.$message({
          message: "上传文件大小超过限制!",
          type: "warning",
        });
        return false;
      }
    },

    //提交新增表单
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
        } catch (e) {
          console.error("接口异常");
        }
        this.dialogFormVisible = false;
        this.$refs.upload.clearFiles();
        this.getStandardizeList();
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
          if (this.fileId) {
            await fsDelete(this.fileId);
          }
        } catch (e) {
          console.error("接口异常");
        }
        this.dialogFormVisible = false;
        this.$refs.upload.clearFiles();
        this.getStandardizeList();
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
      debugger
      this.pageNum = val;
      this.onPaging();
    },
    //关闭弹框的事件
    closeDialog(formName) {
      this.flag = true;
      this.forbidden = false;
      this.ruleForm = {};
      this.ruleForm.fileList = [];
      this.$refs.upload.clearFiles();
    },
  },
};
</script>

<style lang="scss" scoped>
// .text_area /deep/ {
//   .el-textarea {
//     width: 300px;
//   }
// }
.content-box {
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

  // /deep/ .el-input__inner {
  //   padding-right: 45px;
  // }
}
</style>
