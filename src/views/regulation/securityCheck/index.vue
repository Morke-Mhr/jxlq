<template>
  <div class="content-box app-container">
    <!--  安全检查标准库-->
    <div class="left">
      <el-input
        class="search inputAuto"
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        style="padding: 0 10px 10px; width: 100%"
      >
      </el-input>

      <el-tree
        class="filter-tree"
        empty-text="拼命加载中..."
        :data="data"
        :props="defaultProps"
        node-key="id"
        :filter-node-method="filterNode"
        ref="tree"
        @node-click="handleNodeClick"
      >
        <!-- <span class="custom-tree-node" slot-scope="{ node }">
            <el-tooltip
              effect="light"
              :content="node.label"
              placement="top-start"
            >
              <span class="el-tree-node__label">
                {{ node.label | ellipsis(16) }}
              </span>
            </el-tooltip>
          </span> -->
      </el-tree>
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
          <el-form-item label="检查项目" prop="checkProject">
            <el-input
              v-model="formInline.checkProject"
              placeholder="检查项目"
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

      <!-- 新增及删除 -->
      <div class="sxTable">
        <el-button class="blue" v-has="has.add" @click="handleAdd()">新增</el-button>
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
          :cell-style="{ 'text-align': 'center' }"
        >
          <!-- 表格部分 -->
          <el-table-column
            type="selection"
            label="全选"
            width="55"
          ></el-table-column>
          <el-table-column align="center" label="检查分类" show-overflow-tooltip width="150">
            <template slot-scope="scope">{{ scope.row.checkClass }}</template>
          </el-table-column>
          <el-table-column align="center" label="检查负责人" show-overflow-tooltip width="150">
            <template slot-scope="scope">{{ scope.row.checkType }}</template>
          </el-table-column>
          <el-table-column align="center" label="检查项目" show-overflow-tooltip width="150">
            <template slot-scope="scope">{{ scope.row.checkProject }}</template>
          </el-table-column>
          <el-table-column align="center" label="检查内容" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.checkContent }}</template>
          </el-table-column>
          <el-table-column align="center" label="检查要求" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.checkRequire }}</template>
          </el-table-column>
          <el-table-column align="center" prop="cz" label="操作" fixed="right" width="145px">
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
                @click.native.prevent="deleteRow(scope.row.safecheckdocId)"
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
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="检查分类" prop="dictDataClass">
              <el-select
                v-model="ruleForm.dictDataClass"
                value-key="dictCode"
                placeholder="请选择"
                :disabled="forbidden"
              >
                <el-option
                  v-for="item in dictDataClass"
                  :key="item.dictCode"
                  :label="item.dictLabel"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="检查负责人" prop="dictDataCategory">
              <el-select
                v-model="ruleForm.dictDataCategory"
                value-key="dictCode"
                placeholder="请选择"
                :disabled="forbidden"
              >
                <el-option
                  v-for="item in dictDataType"
                  :key="item.dictCode"
                  :label="item.dictLabel"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="检查项目" prop="checkProject">
              <el-input
                v-model="ruleForm.checkProject"
                placeholder="请输入"
                autocomplete="off"
                type="textarea"
                maxlength="50"
                show-word-limit
                :disabled="forbidden"
              ></el-input>
            </el-form-item>
            <el-form-item label="检查内容" prop="checkContent">
              <el-input
                type="textarea"
                :rows="5"
                maxlength="300"
                show-word-limit
                placeholder="请输入内容"
                v-model="ruleForm.checkContent"
                :disabled="forbidden"
              ></el-input>
            </el-form-item>
            <el-form-item label="检查要求" prop="checkRequire">
              <el-input
                type="textarea"
                :rows="5"
                maxlength="300"
                show-word-limit
                placeholder="请输入内容"
                v-model="ruleForm.checkRequire"
                :disabled="forbidden"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button
              v-has="has.add"
              class="tBtn"
              @click="submitForm('ruleForm')"
              v-if="isShow == false && flag"
              >确 定
            </el-button>
            <el-button
              v-has="has.edit"
              class="tBtn"
              @click="changeForm('ruleForm')"
              v-else-if="!isShow == false && flag"
              >修改
            </el-button>
            <el-button class="fBtn" @click="resetForm('ruleForm')"
              >关 闭
            </el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getExamineList,
  getAddList,
  getDelete,
  getChangeList,
  getInquire,
  getCheck,
  getCheckClass,
  getCheckType,
  getTree,
} from "@/api/regulation/securityCheck";

export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },

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
        delete: "laws:safecheckDoc:delete",
        query: "laws:safecheckDoc:findWrapper",
        add: "laws:safecheckDoc:add",
        edit: "laws:safecheckDoc:update",
      },
      checkAll: true,
      defaultProps: {
        children: "safecheckClassVoList",
        label: "nodeName",
      },
      forbidden: false,
      filterText: "",
      data: [],
      dictDataClass: [],
      dictDataType: [],
      tableData: [],
      flag: true,
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
        //头部查询
        checkClass: "",
        checkType: "",
        checkProject: "",
      },
      //新增表单数据
      ruleForm: {
        dictDataClass: "",
        dictDataCategory: "",
        checkProject: "",
        checkContent: "",
        checkRequire: "",
      },
      rules: {
        dictDataClass: [
          {
            required: true,
            message: "检查分类",
            trigger: "change",
            validator: isSelect,
          },
        ],
        dictDataCategory: [
          {
            required: true,
            message: "检查类别",
            trigger: "change",
            validator: isSelect,
          },
        ],
        checkProject: [
          { required: true, message: "检查项目", trigger: "blur" },
        ],
        checkContent: [
          { required: true, message: "检查内容", trigger: "blur" },
        ],
        // checkRequire: [
        //   { required: true, message: "检查要求", trigger: "blur" },
        // ],
      },
      hiddenTableHeader: false,
      listIds: [],
    };
  },
  created() {
    this.getList();
    this.Class();
  },
  methods: {
    async handleNodeClick(a, b) {
      if (b.level > 1) {
        this.loading = true;
        let arry = [];
        arry = arry.concat(b.parent.key, b.key);
        this.formInline.checkClass = "";
        this.formInline.checkProject = "";
        this.formInline.checkType = "";
        this.listIds = arry;
        let data = await getExamineList(arry);
        this.tableData = data.rows;
        this.total = data.total;
        this.loading = false;
      }
    },
    // checked1() {
    //   // el-tree全选事件
    //   if (this.checkAll) {
    //     // 全选
    //     this.$nextTick(function () {
    //       this.$refs.tree.setCheckedNodes(this.data);
    //     });
    //     this.checkAll = !this.checkAll;
    //   } else {
    //     // 取消选中
    //     this.$nextTick(function () {
    //       this.$refs.tree.setCheckedKeys([]);
    //     });
    //     this.checkAll = !this.checkAll;
    //   }
    //   this.getList();
    // },

    filterNode(value, data) {
      if (!value) return true;
      return data.nodeName.indexOf(value) !== -1;
    },
    //创建请求列表
    async getList() {
      this.data = await getTree(); //获取树形数据
      this.loading = true;
      let data = await getExamineList("");
      this.tableData = data.rows;
      this.total = data.total;
      this.loading = false;
    },
    onClear(formName) {
      this.$refs[formName].resetFields();
      this.listIds = [];
      this.getList();
    },
    //检查分类
    async Class() {
      this.dictDataClass = await getCheckClass("safecheck_type");
      this.dictDataType = await getCheckType("safecheck_category");
    },

    //提交查询
    async onSubmit() {
      try {
        let { checkClass, checkType, checkProject } = this.formInline;
        let data = await getInquire(
          1,
          this.pageSize,
          checkClass,
          checkType,
          checkProject,
          this.listIds
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
        let { checkClass, checkType, checkProject } = this.formInline;
        let ids = this.listIds;
        let data = await getInquire(
          this.pageNum,
          this.pageSize,
          checkClass,
          checkType,
          checkProject,
          ids
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
              this.delarr.push(this.multipleSelection[i].safecheckdocId);
            }
            await getDelete(this.delarr);
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
      this.titleType = "新增信息";
      this.dialogFormVisible = true;
      this.isShow = false;
      this.Class();
    },
    //查看
    async goCheck(scope) {
      try {
        this.titleType = "查看信息";
        this.dialogFormVisible = true;
        this.loading = false;
        this.forbidden = true;
        this.flag = false;
        this.Class();
        this.ruleForm = await getCheck(scope.row.safecheckdocId);
      } catch (e) {
        console.error("接口异常");
      }
    },
    //编辑
    async goRedact(scope) {
      try {
        this.titleType = "编辑信息";
        this.flag = true;
        this.dialogFormVisible = true;
        this.loading = false;
        this.isShow = true;
        this.Class();
        this.ruleForm = await getCheck(scope.row.safecheckdocId);
      } catch (e) {
        console.error("接口异常");
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
          this.getList();
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
    //修改
    async changeForm(formName) {
      let data = null;
      try {
        data = await getChangeList(this.ruleForm);
        this.$refs[formName].resetFields();
        this.getList();
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
    },
  },
};
</script>
