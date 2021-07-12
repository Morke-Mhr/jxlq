<template>
  <!-- 工程项目档案库 -->
  <div class="app-container">
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
        ref="tree"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
      >
        <!-- <span class="custom-tree-node" slot-scope="{ node }">
          <el-tooltip
            effect="light"
            :content="node.label"
            placement="top-start"
          >
            <span class="el-tree-node__label">
              {{ node.label | ellipsis(12) }}
            </span>
          </el-tooltip>
        </span> -->
      </el-tree>
    </div>
    <div class="right safe_main">
      <div class="sxForm">
        <el-form
          :inline="true"
          :model="formInline"
          ref="formInline"
          class="demo-form-inline"
        >
          <el-form-item label="项目名称" prop="projectName">
            <el-input
              v-model="formInline.projectName"
              placeholder="项目名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="项目标段" prop="bid">
            <el-input
              v-model="formInline.bid"
              placeholder="项目标段"
            ></el-input>
          </el-form-item>
          <el-form-item label="资料名称" prop="docName">
            <el-input
              v-model="formInline.docName"
              placeholder="资料名称"
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
        <div class="header-right">
          <el-button class="blue" v-has="has.add" @click="handleAdd()">新增</el-button>
          <el-button class="blue" v-has="has.delete" @click="handleDelete()"
            >批量删除
          </el-button>
        </div>
        <!-- 表格 -->
        <el-table
          ref="multipleTable"
          :data="tableList"
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
               align="center"
              width="55"
            ></el-table-column>
            <el-table-column  align="center" prop="projectName" label="项目名称">
              <template slot-scope="scope"
                >{{ scope.row.projectName }}
              </template>
            </el-table-column>
            <el-table-column  align="center" prop="bid" label="标段" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.bid }}</template>
            </el-table-column>
            <el-table-column
             align="center"
              prop="docType"
              label="类别"
              show-overflow-tooltip
              width="110"
            >
              <template slot-scope="scope">{{ scope.row.docType }}</template>
            </el-table-column>
            <el-table-column
             align="center"
              prop="docName"
              label="资料名称"
              show-overflow-tooltip
            >
              <template slot-scope="scope">{{ scope.row.docName }}</template>
            </el-table-column>
            <el-table-column
             align="center"
              prop="docVersion"
              label="版本"
              show-overflow-tooltip
              width="110"
            >
              <template slot-scope="scope">{{ scope.row.docVersion }}</template>
            </el-table-column>
            <el-table-column
             align="center"
              prop="createBy"
              label="上传人"
              show-overflow-tooltip
              width="110"
            >
              <template slot-scope="scope">{{ scope.row.createBy }}</template>
            </el-table-column>
            <!-- 根据权限列表显示当前列的内容 -->
            <el-table-column   align="center" fixed="right" prop="cz" label="操作" width="110px">
              <template slot-scope="scope">
                <!-- 这里可以拿到当前行的内容 row -->
                <el-button
                  v-has="has.edit"
                  type="text"
                  @click="goRedact(scope, tableList)"
                  >编辑
                </el-button>
                <el-button
                  v-has="has.delete"
                  class="red"
                  type="text"
                  @click.native.prevent="deleteRow(scope.row.projectdocId)"
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
          :page-sizes="[5, 10, 20, 30]"
          :page-size="pageSize"
          background
          layout="total, prev, pager, next, sizes, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>

    <el-dialog
      title="工程项目档案"
      :visible.sync="dialogVisible"
      custom-class="small"
    >
      <add ref="projectAdd" v-if="flag === 'Add'" @func="getMsgFormSon" />
      <amend
        ref="amend"
        v-if="flag === 'Amend'"
        :person="personData"
        @func="getMsgFormSon"
      />
      <span slot="footer" class="dialog-footer">
        <el-button class="tBtn" @click="tBtnFun">确 定</el-button>
        <el-button class="fBtn" @click="getMsgFormSon">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getList,
  getInquire,
  getDelete,
  getTree,
} from "@/api/regulation/project";
import Add from "./add";
import Amend from "./amend";

export default {
  components: { Add, Amend },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  data() {
    return {
      checkAll: true,
      defaultProps: {
        children: "projectTreeToNameParamList",
        label: "nodeName",
      },
      filterText: "",
      data: [],
      has: {
        delete: "laws:projectDocFile:delete",
        query: "laws:projectDoc:findWrapper",
        add: "laws:projectDoc:add",
        edit: "laws:projectDoc:update",
        idQuery: "laws:projectDoc:findById",
        deletefile: "laws:projectDocFile:deletefile", //附件
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
      pageSize: 10,
      formInline: {
        //头部查询
        projectName: "",
        bid: "",
        docType: "",
        docName: "",
      },
      hiddenTableHeader: false,
      dialogVisible: false,
      flag: "",
      personData: {},
      listIds: [],
    };
  },
  created() {
    this.getProjectList();
  },

  methods: {
    tBtnFun() {
      if (this.flag === "Add") {
        this.$refs.projectAdd.submitForm("ruleForm");
      } else if (this.flag === "Amend") {
        this.$refs.amend.changeForm("ruleForm");
      }
    },
    async handleNodeClick(a, b) {
      // debugger;
      console.log("接收的参数1", b.parent.key);
      console.log("接收的参数2", b.key);
      this.formInline.bid = "";
      this.formInline.docName = "";
      this.formInline.docType = "";
      this.formInline.projectName = "";
      if (b.level > 1) {
        let arry = [];
        arry = arry.concat(b.parent.key, b.key);
        this.listIds = arry;
        let data = await getList(arry);
        this.tableList = data.rows;
        this.total = data.total;
      }
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.nodeName.indexOf(value) !== -1;
    },
    // v-on:input="inputFunc"  输入框加上
    //  async inputFunc() {
    //     console.log(this.filterText + "请求");
    //     let data = await searchTree(this.filterText); //获取树形数据
    //     this.tableList = data.rows;
    //     this.total = data.total;
    //     this.loading = false;

    //   },
    //创建请求列表
    async getProjectList() {
      this.data = await getTree(); //获取树形数据
      console.log(111, this.data);
      let data = await getList("");
      this.tableList = data.rows;
      this.total = data.total;
      this.loading = false;
    },

    onClear(formName) {
      this.$refs[formName].resetFields();
      this.listIds = [];
      this.getProjectList();
    },
    //提交查询
    async onSubmit() {
      try {
        let { projectName, bid, docType, docName } = this.formInline;
        let data = await getInquire(
          1,
          this.pageSize,
          projectName,
          bid,
          docType,
          docName,
          this.listIds
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
        let { projectName, bid, docType, docName } = this.formInline;
        let ids = this.listIds;
        let data = await getInquire(
          this.pageNum,
          this.pageSize,
          projectName,
          bid,
          docType,
          docName,
          ids
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
          this.getProjectList();
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
              this.delarr.push(this.multipleSelection[i].projectdocId);
            }
            await getDelete(this.delarr);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getProjectList();
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
      this.flag = "Amend";
      this.dialogVisible = true;
      this.personData = scope.row.projectdocId;
    },
    //新增
    handleAdd() {
      this.flag = "Add";
      this.dialogVisible = true;
    },
    //完成后回调
    getMsgFormSon() {
      this.dialogVisible = false;
      this.flag = " ";
      this.getProjectList();
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
  },
};
</script>
