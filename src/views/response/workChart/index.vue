<template>
  <div class="container-table safe_main">
    <!-- <el-button
      v-if="workFlag == 'Add' || workFlag === 'Edit' || workFlag === 'Setjob'"
      class="table-default-btn my-work-btn"
      @click="fatherMethod"
      >取消并返回</el-button
    > -->
    <add v-if="workFlag === 'Add'" @fatherMethod="fatherMethod" />
    <edit
      v-else-if="workFlag === 'Edit'"
      :edit="EditData"
      @fatherMethod="fatherMethod"
    />
    <setjob
      @fatherMethod="fatherMethod"
      v-else-if="workFlag === 'Setjob'"
      :edit="EditData"
    />
    <div v-else>
      <div class="sxForm">
        <el-form
          :inline="true"
          :model="pageForm"
          ref="pageForm"
          class="demo-form-inline"
        >
          <el-form-item prop="name" label="流程名称">
            <el-input
              v-model="pageForm.name"
              maxlength="30"
              placeholder="请输入名称"
            ></el-input>
          </el-form-item>
          <el-form-item prop="status" label="状态">
            <el-select v-model="pageForm.status" placeholder="状态">
              <el-option label="请选择" value=""></el-option>
              <el-option label="编辑中" value="0"></el-option>
              <el-option label="已提交" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="createBy" label="创建人">
            <el-input
              v-model="pageForm.createBy"
              maxlength="30"
              placeholder="请输入创建人"
            ></el-input>
          </el-form-item>
          <el-form-item prop="createByTime" label="创建时间">
            <div class="block">
              <el-date-picker
                v-model="pageForm.createByTime"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </div>
          </el-form-item>
          <div class="btnCont">
            <el-button
              class="chaxun"
              icon="el-icon-search"
              v-has="has.query"
              @click="handleSearach"
              >查询</el-button
            >
            <el-button @click="resetForm('pageForm')" class="chongzhi"
              >重置</el-button
            >
          </div>
        </el-form>
      </div>
      <div class="sxTable">
        <el-button v-has="has.add" class="blue" @click="handleAdd()">
          新增
        </el-button>
        <el-button v-has="has.remove" class="blue" @click="handleDel(scope)">
          批量删除
        </el-button>
        <el-table
          :data="tableData"
          :row-class-name="activeRow"
          v-loading="loading"
          height="calc(100vh - 370px)"
          style="width: 100%"
          tooltip-effect="light"
          @selection-change="handleSelectionChange"
          row-key="modelId"
          :default-sort="{ prop: 'createByTime', order: 'descending' }"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          stripe
        >
          <el-table-column type="selection" width="55"> </el-table-column>

          <el-table-column
            align="center"
            prop="name"
            sortable
            label="工作流程图名称"
             show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="description"
            sortable
            label="工作流程图描述"
             show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.description }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="createBy"
            sortable
            label="创建人"
             show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.createBy }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="createByTime"
            sortable
            label="创建时间"
             show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.createByTime }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="status"
            sortable
            label="状态"
            width="120px"
             show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status == '0'">编辑中</span>
              <span v-if="scope.row.status == '1'" style="color: #409eff"
                >已提交</span
              >
            </template>
          </el-table-column>

          <el-table-column
            fixed="right"
            width="250px"
            align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                style="margin-left: 0px"
                size="medium"
                v-has="has.edit"
                @click="handleEdit(scope)"
              >
                修改
              </el-button>
              <el-button
                type="text"
                 class="red"
                style="margin-left: 0px"
                size="medium"
                v-show="scope.row.status == 0"
                v-has="has.remove"
                @click="handleDel(scope)"
              >
                删除
              </el-button>
              <el-button
                type="text"
                style="margin-left: 0px"
                size="medium"
                v-show="scope.row.status == 0"
                v-has="has.put"
                @click="handleSubmit(scope)"
                id="submit-btn"
              >
                提交
              </el-button>
              <el-button
                type="text"
                style="margin-left: 0px"
                size="medium"
                v-has="has.set"
                v-show="scope.row.status == 1"
                @click="handleSet(scope)"
              >
                设置岗位
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-sizes="pageSizes"
          :page-size="pageForm.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getWorkchartList,
  getDelWorkchart,
  getlookWorkchart,
  getSubmitWorkchart,
} from "@/api/job/workChart";
// import {
//   isBasicDate,
// } from '@/utils/date.js'
import elementIcons from "@/views/system/menu/element-icons.js";
import Add from "./add";
import Edit from "./edit";
import Setjob from "./setJob";
// const defaultDept = {
//   deptId:'',
//   deptName:'',
//   email:'',
//   leader:'',
//   orderNum:'',
//   parentId:'',
//   phone:'',
//   status:'0'
// }
export default {
  components: { Add, Edit, Setjob },
  data() {
    return {
      fileList: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
        {
          name: "food2.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
      ],
      has: {
        remove: "system:workProcess:delete",
        query: "system:workProcess:list",
        add: "system:workProcess:addWorkProcess",
        edit: "system:workProcess:update",
        put: "system:workProcess:update",
        set: "system:workProcess:setPost",
      },
      tableData: [],
      role: "",
      roleSelect: [],
      roleId: [],
      roleIdList: [],
      fromData: [],
      modelId: "",
      total: 100,
      pageSizes: [10, 15, 20, 25, 30],
      //业务模块弹窗里的
      bussiness: {
        startRole: "",
        businessId: "",
        modelId: "",
        startDept: "",
      },
      roleData: [],
      dialogVisible: false,
      dialogVisibleBussines: false,
      //获取角色下拉
      //获取业务模块角色下拉

      bussiRoleSel: [],
      //获取业务模块下拉

      bussiModuleSel: [],

      //搜索
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        name: "",
        createBy: "",
        createByTime: "",
        status: "",
      },
      fromBussiness: {
        bussiRolId: "",
        bussiModule: "",
      },
      //树形
      checkStrictly: true,
      defaultMenutree: [],
      deptOptions: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      workprocessId: "",
      elementIcons,
      itmeLabel: "",
      //				roleForm: {
      //					'component': '',
      //				},
      loading: false,
      //表单验证方法
      formRules: {},
      workFlag: "",
      EditData: "",
    };
  },
  created: async function () {
    this.handleSearach();
    // this.roleSelect = await getSelectRole();
    // //获取部门树形
    //  this.deptOptions = await getBussinessDep()
  },

  methods: {
    handleSearach() {
      this.pageForm.pageNum = 1;
      this.getAllList();
    },
    handleSelectionChange(val) {
      if (val) {
        let arr = [];
        for (let i = 0; i < val.length; i++) {
          let itme = val[i];
          arr.push(itme.id);
        }
        this.multipleSelection = [...arr];
      }
    },
    //获取列表数据
    //获取列表
    async getAllList() {
      // this.loading = true;
      // const res = await getWorkchartList(this.pageForm);
      // this.tableData = res.rows;
      // this.total = res.total;
      // console.log(res);
      // console.log(res.rows);
      // this.loading = false;
      this.loading = true;
      // this.pageForm.pageNum=1;
      const res = await getWorkchartList({
        ...this.pageForm,
        pageNum: 1,
        pageSize: 100000,
      });
      this.tableData = res.rows.slice(
        (this.pageForm.pageNum - 1) * this.pageForm.pageSize,
        (this.pageForm.pageNum - 1) * this.pageForm.pageSize +
          this.pageForm.pageSize
      );
      this.total = res.total;
      this.loading = false;
    },
    //新增
    // async handleAdd() {
    //   this.$router.push({
    //     path: "/workChart/add"
    //   });
    // },
    async handleAdd() {
      this.workFlag = "Add";
    },
    async handleEdit(scope) {
      this.workFlag = "Edit";
      this.EditData = scope.row.workprocessId;
    },
    //返回列表
    fatherMethod() {
      this.workFlag = "";
      this.getAllList();
    },
    async handleSet(scope) {
      this.workFlag = "Setjob";
      this.EditData = scope.row.workprocessId;
    },
    // async handleSet(scope) {
    //   this.$router.push({
    //     path: "/workChart/setJob",
    //     query: {
    //       workprocessId: scope.row.workprocessId
    //     }
    //   });
    // },
    handleSelectionChange(val) {
      if (val) {
        let arr = [];
        for (let i = 0; i < val.length; i++) {
          let itme = val[i];
          arr.push(itme.workprocessId);
        }
        this.multipleSelection = [...arr];
      }
    },
    activeRow({ row, rowIndex }) {
      return "active-row";
    },
    //删除
    async handleDel(scope) {
      if (!scope && this.multipleSelection.length <= 0) {
        this.$message({
          type: "warning",
          message: "请选择要删除的菜单!",
        });
        return;
      }
      let row = scope ? scope.row : null;
      this.$confirm("确定删除吗?", "删除", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await getDelWorkchart(
            row ? row.workprocessId : this.multipleSelection
          );
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
    //查看
    async handleDetail() {
      this.$router.push({
        path: "/people/lookPeople",
      });
    },
    //编辑
    // async handleEdit(scope) {
    //   this.$router.push({
    //     path: "/workChart/edit",
    //     query: {
    //       workprocessId: scope.row.workprocessId
    //     }
    //   });
    // },
    //提交
    async handleSubmit(scope) {
      this.workprocessId = scope.row.workprocessId;
      var data = await getSubmitWorkchart(this.workprocessId);
      this.$notify({
        title: data ? "操作成功" : "操作失败",
        dangerouslyUseHTMLString: true,
        message: data ? data.message : "系统正在维护中，请与管理员联系",
        type: data ? "success" : "warning",
      });
      this.getAllList();
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.handleSearach();
    },

    ///页脚
    handleSizeChange(val) {
      this.pageForm.pageSize = val;
      this.handleSearach();
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val;
      this.getAllList();
    },
  },
};
</script>

<style scoped>
.container-table {
  position: relative;
}

.my-work-btn {
  width: auto;
  margin: 10px 0 0 15px;
}
</style>
