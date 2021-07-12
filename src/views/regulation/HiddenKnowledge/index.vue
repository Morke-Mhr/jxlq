<template>
  <!--  隐患知识库 -->
  <div class="content-box app-container">
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
          :label="city.yhkTypeId"
          :key="i"
          @change="checkedFun"
          >{{ city.yhkType }}
        </el-radio>
      </el-radio-group>
    </div>
    <!-- 查询 -->
    <div class="right safe_main">
      <div class="sxForm">
        <el-form
          :inline="true"
          :model="formInline"
          ref="formInline"
          class="demo-form-inline"
        >
          <el-form-item label="隐患级别" prop="yhkLevel">
            <el-select v-model="formInline.yhkLevel" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="问题描述" prop="yhkProblem">
            <el-input
              v-model="formInline.yhkProblem"
              placeholder="问题描述"
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
          :data="tableData"
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
          <el-table-column align="center" label="级别" width="90">
            <template slot-scope="scope">
              <span v-if="scope.row.yhkLevel == 0">微小</span>
              <span v-if="scope.row.yhkLevel == 1">一般</span>
              <span v-if="scope.row.yhkLevel == 2">重大</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="问题描述"
            show-overflow-tooltip
          >
            <template slot-scope="scope">{{ scope.row.yhkProblem }}</template>
          </el-table-column>
          <el-table-column align="center" label="类别" width="210">
            <template slot-scope="scope">{{ scope.row.yhkType }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="三违行为"
            show-overflow-tooltip
          >
            <template slot-scope="scope"
              >{{ scope.row.threeViolation }}
            </template>
          </el-table-column>
          <!-- 根据权限列表显示当前列的内容 -->
          <el-table-column
            align="center"
            prop="cz"
            label="操作"
            fixed="right"
            width="145px"
          >
            <template slot-scope="scope">
              <!-- 这里可以拿到当前行的内容 row -->
              <el-button
                v-has="has.idQuery"
                type="text"
                @click="goCheck(scope, tableData)"
                >查看
              </el-button>
              <el-button
                v-has="has.idQuery"
                type="text"
                @click="goRedact(scope, tableData)"
                >编辑
              </el-button>
              <el-button
                v-has="has.delete"
                class="red"
                type="text"
                @click.native.prevent="deleteRow(scope.row.yhknowledgeId)"
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
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="80px"
            class="demo-ruleForm"
          >
            <el-form-item label="隐患级别" prop="yhkLevel">
              <el-select
                v-model="ruleForm.yhkLevel"
                placeholder="请选择"
                :disabled="forbidden"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="问题描述" prop="yhkProblem">
              <el-input
                v-model="ruleForm.yhkProblem"
                placeholder="请输入"
                autocomplete="off"
                type="textarea"
                :rows="2"
                maxlength="200"
                show-word-limit
                :disabled="forbidden"
              ></el-input>
            </el-form-item>
            <el-form-item label="违反法规" prop="yhkViolationLaw">
              <el-input
                type="textarea"
                :rows="5"
                maxlength="200"
                show-word-limit
                placeholder="请输入内容"
                v-model="ruleForm.yhkViolationLaw"
                :disabled="forbidden"
              ></el-input>
            </el-form-item>
            <el-form-item label="隐患类别" prop="dictDataYhkType">
              <el-select
                v-model="ruleForm.dictDataYhkType"
                value-key="dictCode"
                placeholder="请选择"
                :disabled="forbidden"
              >
                <el-option
                  v-for="item in Rank"
                  :key="item.dictCode"
                  :label="item.dictLabel"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="三违行为" prop="dictDataThreeViolation">
              <el-select
                v-model="ruleForm.dictDataThreeViolation"
                value-key="dictCode"
                placeholder="请选择"
                :disabled="forbidden"
              >
                <el-option
                  v-for="item in threeViolation"
                  :key="item.dictCode"
                  :label="item.dictLabel"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="治理要求" prop="zlRequire">
              <el-input
                type="textarea"
                :rows="5"
                maxlength="200"
                show-word-limit
                placeholder="请输入内容"
                v-model="ruleForm.zlRequire"
                :disabled="forbidden"
              ></el-input>
            </el-form-item>
            <el-form-item label="隐患图片" prop="fileList">
              <div class="upload">
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  :action="getUrl"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  :on-preview="handlePreview"
                  :on-success="uploadSuccess"
                  :before-upload="beforeUpload"
                  :multiple="true"
                  :file-list="fileLists"
                  name="file"
                  list-type="picture"
                >
                  <span slot="tip" class="el-upload__tip" v-if="flag == false"
                    >点击图片名下载查看</span
                  >
                  <div
                    slot="tip"
                    class="el-upload__tip"
                    style="line-height: 16px"
                    v-if="flag == true"
                  >
                    只能上传bmp、jpg，png，gif（10M）格式文件，
                  </div>

                  <el-button v-if="flag == true">选择图片</el-button>
                </el-upload>
                <div class="shade" v-if="flag == false"></div>
              </div>
            </el-form-item>
            <el-form-item label="预防措施" prop="violation">
              <el-input
                type="textarea"
                :rows="5"
                maxlength="200"
                show-word-limit
                placeholder="请输入内容"
                v-model="ruleForm.violation"
                :disabled="forbidden"
              ></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button
              class="tBtn"
              @click="submitForm('ruleForm')"
              v-if="isShow == false && flag"
              >确 定</el-button
            >
            <el-button
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
  </div>
</template>

<script>
import {
  getKnowledgeList,
  getAddKnowledgeList,
  getDeleteKnowledge,
  getCheck,
  getInquire,
  getChangeList,
  getRank,
  fsDelete,
  threeViolation,
  getTree,
} from "@/api/regulation/Knowledge";
import ImportFile from "./importFile";

export default {
  components: { ImportFile },
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
        delete: "laws:yhknowledgeDoc:delete",
        query: "law:yhknowledgeDoc:findList",
        idQuery: "law:yhknowledgeDoc:findById",
        add: "laws:yhknowledgeDoc:add",
        edit: "laws:yhknowledgeDoc:update",
        deleteFile: "laws:yhknowledgeDoc:deleteById",
        import: "law:yhknowledgeDoc:importExcel",
      },
      filterText: "",
      checkAll: false,
      checkedCities: [],
      cities: [],
      isIndeterminate: false,
      forbidden: false,
      tableData: [],
      flag: true,
      loading: true,
      dialogFormVisible: false, //打开弹框
      reminder: true, //判断是否提示删除文件
      total: 0,
      isShow: false, //确定和修改按钮
      titleType: "",
      multipleSelection: [],
      delarr: [], //全选
      options: [
        {
          value: "0",
          label: "微小",
        },
        {
          value: "1",
          label: "一般",
        },
        {
          value: "2",
          label: "重大",
        },
      ],
      Rank: [],
      threeViolation: [],
      Category: [],
      pageNum: 1, //默认当前页
      pageSize: 10,
      formInline: {
        yhkLevel: "",
        yhkProblem: "",
        yhkType: "",
      },
      fileLists: [],
      ruleForm: {
        yhkLevel: "",
        yhkProblem: "",
        yhkViolationLaw: "",
        dictDataYhkType: "",
        dictDataThreeViolation: "",
        zlRequire: "",
        violation: "",
        fileList: [], //上传文件
      },
      rules: {
        yhkLevel: [
          {
            required: true,
            message: "级别",
            trigger: "change",
            validator: isSelect,
          },
        ],
        yhkProblem: [{ required: true, message: "问题描述", trigger: "blur" }],
        // yhkViolationLaw: [
        //   { required: true, message: "违反法规", trigger: "blur" },
        // ],
        dictDataYhkType: [
          {
            required: true,
            message: "类别",
            trigger: "change",
            validator: isSelect,
          },
        ],
        // dictDataThreeViolation: [
        //   {
        //     required: true,
        //     message: "三违行为",
        //     trigger: "change",
        //     validator: isSelect,
        //   },
        // ],
        fileLists: [{ required: true, message: "附件", trigger: "blur" }],
        zlRequire: [{ required: true, message: "治理要求", trigger: "blur" }],
        // violation: [{ required: true, message: "预防措施", trigger: "blur" }],
      },
      hiddenTableHeader: false,
      isadd: false,
      command: false, //图片的url
      fileIds: [],
      formImgList: [],
    };
  },
  created() {
    this.getKnowledgeList();
    this.RankDtata();
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
        array.yhkType.match(this.filterText)
      );
      if (this.filterText == "") {
        this.getKnowledgeList();
      }
    },
    async checkedFun() {
      // debugger
      console.log(this.checkedCities + "选中的值");
      this.formInline.yhkLevel = "";
      this.formInline.yhkProblem = "";
      this.formInline.yhkType = "";
      let data = await getKnowledgeList(this.checkedCities);
      this.tableData = data.rows;
      this.total = data.total;
    },

    //创建请求列表
    async getKnowledgeList() {
      this.cities = await getTree(); //获取树形数据

      let data = await getKnowledgeList("");
      this.tableData = data.rows;
      this.total = data.total;
      this.loading = false;
    },
    //重置
    onClear(formName) {
      this.$refs[formName].resetFields();
      this.checkedCities = [];
      this.getKnowledgeList();
    },

    //检查分类
    async RankDtata() {
      this.Rank = await getRank("Hazard_category"); //类别字典
      this.threeViolation = await threeViolation("three_defy"); //三违行为
    },

    //提交查询
    async onSubmit() {
      try {
        let { yhkLevel, yhkProblem, yhkType } = this.formInline;
        let data = await getInquire(
          1,
          this.pageSize,
          yhkLevel,
          yhkProblem,
          yhkType,
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
        let { yhkLevel, yhkProblem, yhkType } = this.formInline;
        let yhkTypeIds = this.checkedCities;
        let data = await getInquire(
          this.pageNum,
          this.pageSize,
          yhkLevel,
          yhkProblem,
          yhkType,
          yhkTypeIds
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
          await getDeleteKnowledge(row);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getKnowledgeList();
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
            for (let i = 0; i < this.multipleSelection.length; i++) {
              this.delarr.push(this.multipleSelection[i].yhknowledgeId);
            }
            await getDeleteKnowledge(this.delarr);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getKnowledgeList();
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
    async handleAdd() {
      this.titleType = "新增信息";
      this.flag = true;
      this.isShow = false;
      this.dialogFormVisible = true;
      this.RankDtata();
    },
    //查看
    async goCheck(scope) {
      this.titleType = "查看信息";
      this.dialogFormVisible = true;
      this.loading = false;
      this.flag = false;
      this.forbidden = true;
      this.isShow = true;
      let changeData = await getCheck(scope.row.yhknowledgeId);
      this.ruleForm = changeData;
      let file = changeData.fileList;
      // if (file[1].fileUrl != undefined) {
      file.forEach((file) => {
        file.name = file.fileName;
        file.url = this.$store.state.apiConfiguration.fileUrl + file.fileUrl;
      });
      this.fileLists = [...file];
      // }
    },
    //编辑
    async goRedact(scope) {
      this.titleType = "编辑信息";
      this.dialogFormVisible = true;
      this.loading = false;
      this.isShow = true; //控制修改和确定按钮
      this.flag = true;
      this.fileId = "";
      this.command = true;
      this.RankDtata();
      let changeData = await getCheck(scope.row.yhknowledgeId);
      this.ruleForm = changeData;
      let file = changeData.fileList;
      // if (file[1].fileUrl != undefined) {
      file.forEach((file) => {
        file.name = file.fileName;
        file.url = this.$store.state.apiConfiguration.fileUrl + file.fileUrl;
      });
      this.fileLists = [...file];
      // }
    },
    //提交表单
    submitForm(formName) {
      console.log(this.ruleForm);
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
          data = await getAddKnowledgeList(resdata);
          this.$refs[formName].resetFields();
        } catch (e) {
          console.error("接口异常");
        }
        this.getKnowledgeList();
        this.dialogFormVisible = false;
        this.$refs.upload.clearFiles();
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
          if (this.fileIds.length != 0) {
            await fsDelete(this.fileIds);
            this.ruleForm.fileList.map((item, i) => {
              if (item.url) {
                delete this.ruleForm.fileList[i].url;
              }
            });
          } else if (this.fileLists.length != 0) {
            this.ruleForm.fileList.map((item, i) => {
              if (item.url) {
                delete this.ruleForm.fileList[i].url;
              }
            });
          }
          data = await getChangeList(this.ruleForm);
          this.$refs[formName].resetFields();
          this.getKnowledgeList();
        } catch (e) {
          console.error("接口异常");
        }
        this.dialogFormVisible = false;
        this.$notify({
          title: data ? "成功" : "失败",
          dangerouslyUseHTMLString: true,
          message: data ? data.message : "服务器开小差了，请稍后再试",
          type: data ? "success" : "warning",
        });
      });
    },
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      if (this.command == true) {
        this.fileIds.push(file.fileId);
        let index = this.ruleForm.fileList.findIndex((ele) => {
          return ele.fileId === file.fileId;
        });
        //假设没有找到
        if (index == -1) {
          return console.log("删除失败");
        }
        //删除元素
        this.ruleForm.fileList.splice(index, 1);
        if (this.ruleForm.fileList.length == 0) {
          this.formImgList = [];
        }
      }
    },
    // 下載
    handlePreview(file) {
      if (this.isShow !== false) {
        this.fileDowloadName =
          this.$store.state.apiConfiguration.url +
          `fs/download?name=${encodeURI(encodeURI(file.name))}&path=${
            file.fileUrl
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
      let arr = [];
      arr.push(res);
      arr.forEach((item) => {
        this.formImgList.push({
          fileName: item.body.fileName,
          fileUrl: item.body.url,
        });
      });
      // else {
      this.ruleForm.fileList = this.formImgList;
      // }
    },

    beforeRemove(file, fileList) {
      if (this.reminder) {
        return this.$confirm(`确定移除 ${file.name}？`);
      }
    },
    //文件校验
    beforeUpload(file) {
      console.log(file);
      let FileFormat = file.name.substring(file.name.lastIndexOf(".") + 1);
      let testmsg = FileFormat.toLowerCase();

      const extension =
        testmsg === "bmp" ||
        testmsg === "jpg" ||
        testmsg === "png" ||
        testmsg === "gif";
      const isLt2M = file.size / 1024 / 1024 < 10;
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
      this.forbidden = false;
      this.ruleForm.fileList = [];
      this.fileLists = [];
      this.fileIds = [];
      this.formImgList = [];
      this.reminder = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-upload-list--picture .el-upload-list__item {
  border: none;
}

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
}
</style>
