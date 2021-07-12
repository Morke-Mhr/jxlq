<template>
  <div class="people-index">
    <el-dialog
      :title="titleName"
      :close-on-click-modal="false"
      custom-class="large"
      :visible.sync="dialogFormVisible"
      v-if="dialogFormVisible"
    >
      <!-- 新增 -->
      <add v-if="flag === 'Add'" @fatherMethod="fatherMethod" ref="add" />
      <!-- 编辑 -->
      <edit
        v-else-if="flag === 'Edit'"
        :editProgram="EditData"
        @fatherMethod="fatherMethod"
        ref="edit"
      />
      <!-- 查看 -->
      <look-people
        v-else-if="flag === 'LookPeople'"
        :editPrograms="DetailData"
        @fatherMethod="fatherMethod"
      />
      <!-- 岗位变更 -->
      <change
        v-else-if="flag === 'Change'"
        :editPrograms="ChangeData"
        @fatherMethod="fatherMethod"
        ref="change"
      />
      <span slot="footer" class="dialog-footer">
        <el-button class="tBtn" v-if="titleName!='查看'" @click="submit(titleName)">提 交</el-button>
        <el-button class="fBtn" @click="dialogFormVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="导入"
      :close-on-click-modal="false"
      custom-class="small"
      :visible.sync="dialogImportVisible"
      v-if="dialogImportVisible"
    >
      <import-file @fatherMethod="fatherMethodImpor" ref="import" />
      <span slot="footer" class="dialog-footer">
        <el-button class="tBtn" @click="$refs.import.submitUpload()">提 交</el-button>
        <el-button class="fBtn" @click="dialogImportVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 导入 -->
    <template>
      <div class="left">
        <el-input
          class="search"
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          style="padding: 0 8px"
        ></el-input>
        <el-tree
          class="filter-tree"
          :data="treeData"
          :props="leftDefaultProps"
          :filter-node-method="filterNode"
          check-strictly
          ref="tree"
          @node-click="handleNodeClick"
          node-key="id"
        ></el-tree>
      </div>
      <div class="right">
        <div class="sxForm">
          <el-form :inline="true" :model="pageForm" ref="pageForm" class="demo-form-inline">
            <el-form-item prop="realName" label="姓名">
              <el-input v-model="pageForm.realName" maxlength="30" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item prop="phonenumber" label="联系方式">
              <el-input v-model="pageForm.phonenumber" maxlength="30" placeholder="请输入联系方式"></el-input>
            </el-form-item>
            <el-form-item prop="deptName" label="部门">
              <el-input v-model="pageForm.deptName" maxlength="30" placeholder="请输入部门"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="chaxun" icon="el-icon-search" @click="onSubmit()">查询</el-button>
              <el-button @click="resetForm('pageForm')" class="chongzhi">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table-list" style="margin-top:0;padding:0 15px 20px">
          <el-button class="table-add-btn" v-has="has.add" @click="handleAdd()">新增</el-button>
          <!-- <el-upload class="upload-demo"
     :action="getUrl"
     :data="uploadBase"
      :before-remove="beforeRemove"
      :before-upload="beforeAvatarUpload"
      :headers="geHeaders"
      :show-file-list="false"
      :on-success="onSuccess"
       multiple :limit="3"
        :name='avatar'
         :on-exceed="handleExceed">
      <el-button class="table-import-btn">导入</el-button>
          </el-upload>-->
          <el-button class="table-import-btn" @click="handleImport()">导入</el-button>
          <el-button class="table-default-btn" @click="handleExport()">导出</el-button>
          <el-button
            class="table-default-btn"
            style="margin-left: 0px"
            v-has="has.remove"
            @click="handleDel()"
          >批量删除</el-button>

          <el-table
            :data="tableData"
            v-loading="loading"
            style="width: 100%; margin-top: 30px"
            @selection-change="handleSelectionChange"
            row-key="modelId"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            stripe
          >
            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column align="center" label="姓名" width="80">
              <template slot-scope="scope">{{ scope.row.realName }}</template>
            </el-table-column>
            <el-table-column align="center" label="性别" width="60">
              <template slot-scope="scope">
                <span v-if="scope.row.gender == '0'">男</span>
                <span v-if="scope.row.gender == '1'">女</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="部门名称" width="210">
              <template slot-scope="scope">{{ scope.row.deptName }}</template>
            </el-table-column>
            <el-table-column align="center" label="岗位">
              <template slot-scope="scope">{{ scope.row.postName }}</template>
            </el-table-column>
            <el-table-column align="center" label="联系方式" width="110">
              <template slot-scope="scope">{{ scope.row.phonenumber }}</template>
            </el-table-column>
            <el-table-column align="center" label="身份证号">
              <template slot-scope="scope">{{ scope.row.cardId }}</template>
            </el-table-column>
            <el-table-column align="center" label="入司日期" width="100">
              <template slot-scope="scope">{{ scope.row.joinTime }}</template>
            </el-table-column>
            <!-- <el-table-column align="center" label="状态" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.status=='0'">待审批</span>
          <span v-if="scope.row.status=='1'">审批中</span>
          <span v-if="scope.row.status=='2'">已完成</span>
        </template>
            </el-table-column>-->
            <el-table-column align="center" label="专职安全员" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.isSafeperson == '1'">是</span>
                <span v-if="scope.row.isSafeperson == '0'">否</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" width="220" align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="medium" @click="handleDetail(scope)">查看</el-button>
                <el-button type="text" size="medium" v-has="has.edit" @click="handleEdit(scope)">编辑</el-button>
                <el-button
                  type="text"
                  size="medium"
                  v-has="has.change"
                  @click="handleChange(scope)"
                >岗位变更</el-button>
                <el-button type="text" size="medium" v-has="has.remove" @click="handleDel(scope)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            :page-sizes="[10, 15, 20, 25, 30]"
            :page-size="pageForm.pageSize"
            @size-change="handleSizeChange"
            :current-page="pageNum"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { getPeopleList, getDeletePeopel } from "@/api/system/people";
import { getLoginDept } from "@/api/system/dept";
import { getToken } from "@/utils/auth";
import axios from "axios";
import elementIcons from "@/views/system/menu/element-icons.js";
import Add from "./addPeople";
import Edit from "./editPeople";
import Change from "./jobChange";
import LookPeople from "./lookPeople";
import importFile from "./importFile";
export default {
  components: { Add, Edit, Change, LookPeople, importFile },
  data() {
    return {
      fileList: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        },
        {
          name: "food2.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        }
      ],
      has: {
        remove: "system:user:remove",
        query: "",
        add: "system:user:add",
        edit: "system:user:edit",
        export: "system:user:export",
        details: "system:user:getBaseInfo",
        //岗位变更
        change: "system:userChange:list"
      },
      tableData: [],
      role: "",
      roleSelect: [],
      roleId: [],
      roleIdList: [],
      fromData: [],
      modelId: "",
      total: 0,
      uploadBase: {},
      //业务模块弹窗里的
      bussiness: {
        startRole: "",
        businessId: "",
        modelId: "",
        startDept: ""
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
        realName: "",
        phonenumber: "",
        deptName: "",
        deptId: ""
      },
      pageNum: 1, //默认当前页
      pageSize: 10,
      currentPage: "",
      fromBussiness: {
        bussiRolId: "",
        bussiModule: ""
      },
      //树形
      checkStrictly: true,
      defaultMenutree: [],
      deptOptions: [],
      defaultProps: {
        children: "children",
        label: "title"
      },
      elementIcons,
      itmeLabel: "",
      loading: false,
      //表单验证方法
      formRules: {},
      avatar: "file",
      flag: "",
      dialogImportVisible: false,
      titleName: "",
      dialogFormVisible: false,
      EditData: {},
      DetailData: {},
      ChangeData: {},
      treeData: [],
      // 树形控件数据
      leftDefaultProps: {
        children: "children",
        label: "label"
      },
      filterText: ""
    };
  },
  async created() {
    this.getAllList();
    this.treeData = await getLoginDept();
    // this.roleSelect = await getSelectRole();
    // //获取部门树形
    //  this.deptOptions = await getBussinessDep()
  },
  computed: {
    getUrl() {
      return "";
    },
    geHeaders() {
      return {
        Authorization: getToken()
      };
    },
    getUserImg() {
      return this.$store.state.apiConfiguration.fileUrl + this.imageUrl;
    }
  },
  methods: {
    // 弹出层提交
    submit(type) {
      if (type == "新增") {
        this.$refs.add.confirm();
      } else if (type == "修改") {
        this.$refs.edit.confirm();
      } else if (type == "岗位变更") {
        this.$refs.change.submitFun();
      }
    },
    handleNodeClick(data) {
      this.pageForm.pageNum = 1;
      this.pageForm.deptId = data.id;
      this.getAllList();
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    async onSubmit() {
      let params = {
        pageNum: 1,
        pageSize: this.pageSize,
        realName: this.pageForm.realName,
        phonenumber: this.pageForm.phonenumber,
        deptName: this.pageForm.deptName,
        deptId: this.pageForm.deptId
      };
      let data = await getPeopleList(params);
      this.tableData = data.rows;
      this.loading = false;
      this.total = data.total;
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
      this.loading = true;
      const res = await getPeopleList(this.pageForm);
      this.tableData = res.rows;
      this.total = res.total;
      console.log(res);
      console.log(res.total);
      this.loading = false;
    },
    //新增
    async handleAdd() {
      this.flag = "Add";
      this.titleName = "新增";
      this.dialogFormVisible = true;
    },
    //返回
    fatherMethod() {
      this.flag = "";
      this.dialogFormVisible = false;
      this.getAllList();
    },
    fatherMethodImpor() {
      this.dialogImportVisible = false;
      this.getAllList();
    },
    //导入
    handleImport() {
      this.dialogImportVisible = true;
    },
    //查看
    async handleDetail(scope) {
      this.titleName = "查看";
      this.flag = "LookPeople";
      this.DetailData = {
        userId: scope.row.userId,
        postId: scope.row.postId
      };
      this.dialogFormVisible = true;
    },
    //修改
    async handleEdit(scope) {
      // this.$router.push({
      //     path: '/program/edit',
      //     query: {
      //       'workprogramId': scope.row.workprogramId
      //     }
      //   })
      this.titleName = "修改";
      this.flag = "Edit";
      this.EditData = scope.row.userId;
      this.dialogFormVisible = true;
    },
    // 岗位变更
    async handleChange(scope) {
      this.titleName = "岗位变更";
      this.flag = "Change";
      this.ChangeData = {
        userId: scope.row.userId,
        userName: scope.row.userName,
        postName: scope.row.postName,
        deptName: scope.row.deptName,
        status: scope.row.status
      };
      this.dialogFormVisible = true;
    },
    //保存
    async confirm() {
      var data = await getAddRole(this.fromData);
      this.dialogVisible = false;
      this.$notify({
        title: data ? "成功" : "失败",
        dangerouslyUseHTMLString: true,
        message: data ? data.message : "服务器开小差了，请稍后再试",
        type: data ? "success" : "warning"
      });
      this.getAllList();
      console.log(this.fromData);
    },
    handleSelectionChange(val) {
      if (val) {
        let arr = [];
        for (let i = 0; i < val.length; i++) {
          let itme = val[i];
          arr.push(itme.userId);
        }
        this.multipleSelection = [...arr];
      }
    },
    //删除
    async handleDel(scope) {
      if (!scope && this.multipleSelection.length <= 0) {
        this.$message({
          type: "warning",
          message: "请选择要删除的菜单!"
        });
        return;
      }
      let row = scope ? scope.row : null;
      this.$confirm("确定删除菜单吗?", "删除菜单", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await getDeletePeopel(row ? row.userId : this.multipleSelection);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getAllList();
        })
        .catch(err => {
          console.error(err);
        });
    },
    /** 导出按钮操作 */
    async handleExport() {
      // 导出接口
      let exportUrl =
        this.$store.state.apiConfiguration.url +
        this.$store.state.serviceName.jurisdiction +
        "/user/export";
      axios({
        method: "get",
        url: exportUrl,
        responseType: "blob", // 表明返回服务器返回的数据类型
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken()
        },
        data: {
          //接口参数
        }
      }).then(function(response) {
        //创建一个隐藏的a连接，
        const link = document.createElement("a");
        let blob = new Blob([response.data], {
          type: "application/vnd.ms-excel"
        });
        link.style.display = "none";
        //设置连接
        link.href = URL.createObjectURL(blob);
        link.download = "人员台账";
        document.body.appendChild(link);
        //模拟点击事件
        link.click();
      });
    },

    /** 导入按钮操作 */
    //文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    //点击文件列表中已上传的文件时的钩子
    //文件超出个数限制时的钩子
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    onSuccess(response, file, fileList) {
      if (response.code == 200) {
        this.$message({
          type: "success",
          message: "导入成功!"
        });
      } else {
        this.$message.error("格式不正确或有重复,导入失败!");
      }
      this.getAllList();
    },
    beforeAvatarUpload(file) {
      const extension = file.name.split(".")[1] === "xls";
      const extension2 = file.name.split(".")[1] === "xlsx";
      const extension3 = file.name.split(".")[1] === "doc";
      const extension4 = file.name.split(".")[1] === "docx";
      const extension5 = file.name.split(".")[1] === "XLS";
      const extension6 = file.name.split(".")[1] === "XLSX";
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!extension && !extension2 && !extension3 && !extension4) {
        alert("上传模板只能是 xls、xlsx、XLS、XLSX、doc、docx 格式!");
      }
      if (!isLt2M) {
        console.log("上传模板大小不能超过 10MB!");
      }
      return (
        extension ||
        extension2 ||
        extension3 ||
        extension5 ||
        extension6(extension4 && isLt2M)
      );
    },

    ///页脚
    handleSizeChange(val) {
      this.pageForm.pageSize = val;
      this.onSubmit();
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val;
      this.getAllList();
    },

    //保存业务模块
    async confirmBussiness() {
      const deptTreeKeys = this.$refs.deptTree.getCheckedKeys();
      this.bussiness.startDept = deptTreeKeys[0] + "";
      var data = await getAddBussiness(this.bussiness);
      console.log(this.bussiness);
      this.dialogVisibleBussines = false;
      this.$notify({
        title: data ? "成功" : "失败",
        dangerouslyUseHTMLString: true,
        message: data ? data.message : "服务器开小差了，请稍后再试",
        type: data ? "success" : "warning"
      });
      this.getAllList();
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.pageForm.deptId = "";
      this.getAllList();
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  }
};
</script>

<style lang="scss" scoped>
.sxForm {
  padding-left: 15px;
}
.people-index {
  background-color: #fff;
  height: 80vh;
  overflow: auto;
  margin: 15px 25px;
  padding: 10px;
  .left {
    float: left;
    width: 23%;
    padding: 8px 0;
  }
  .right {
    float: right;
    width: 75%;
    padding-top: 10px;
  }
  .left,
  .right {
    height: 100%;
    border: 1px solid #eee;
    border-radius: 5px;
    overflow: auto;
  }
  .menus-table {
    margin-top: 15px;
  }

  .permission-tree {
    margin-bottom: 15px;
  }

  .upload-demo {
    display: inline-block;
  }
}

.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;

  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .icon-item {
    margin: 10px;
    height: 65px;
    text-align: center;
    width: 80px;
    float: left;
    font-size: 20px;
    color: #24292e;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>
