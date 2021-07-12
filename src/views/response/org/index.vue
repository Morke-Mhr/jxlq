<template>
  <div class="app-container org" v-loading="fullscreenLoading">
    <div class="left" style="padding: 0 0 10px 0">
      <div class="org-tit">机构列表</div>
      <el-tree
        ref="deptTree"
        :check-strictly="checkStrictly"
        :default-expanded-keys="defaultMenutree"
        :default-checked-keys="defaultMenutree"
        :data="deptOptions"
        :props="defaultProps"
        @check-change="treeCheck"
        show-checkbox
        node-key="id"
        class="permission-tree"
        @check="selLookBasicInfo"
        @node-expand="nodeclick"
      />
    </div>
    <div class="right">
      <div class="right-content">
        <div class="org-tit">
          <span>{{ rightTit }}</span>
          <!--修改机构详细信息操作-->
          <div class="oprate-btn">
            <el-button
              v-has="has.edit"
              @click="EditOrgFormInfo"
              class="el-icon-edit chaxun"
              v-show="updataDeptBtn"
            >
              编辑部门
            </el-button>
            <el-button
              v-has="has.edit"
              @click="EditJobFormInfo"
              class="el-icon-edit chaxun"
              v-show="updataJobBtn"
            >
              编辑岗位
            </el-button>
            <el-button
              v-has="has.edit"
              @click="DeleteJobFormInfo"
              class="el-icon-delete chaxun"
              v-show="deleteJobBtn"
            >
              删除岗位
            </el-button>
            <el-button
              v-has="has.edit"
              @click="addOrgFormDept"
              class="iconfont-org icon-bumen chaxun"
              v-show="addDeptBtn"
            >
              新增部门
            </el-button>
            <el-button
              v-has="has.edit"
              @click="addOrgFormPost"
              class="iconfont-org icon-zhaopingangwei chaxun"
              v-show="addJobBtn"
            >
              新增岗位
            </el-button>
          </div>
        </div>

        <div class="right-form">
          <!--查看部门信息和修改子部门-->
          <el-form
            ref="basicInfo"
            :model="basicForm"
            label-width="80px"
            :rules="updataDeptRules"
            class="org-form"
            v-show="lookShow"
          >
            <el-form-item label="编号111" v-show="false">
              <el-input v-model="basicForm.deptId"></el-input>
            </el-form-item>
            <el-form-item label="排序">
              <el-input
                oninput="value=value.replace(/^\.+|[^\d.]/g,'')"
                maxlength="4"
                show-word-limit
                @blur="salaryChange($event)"
                v-model="basicForm.orderNum"
                style="width: 450px"
                :disabled="btnUpdataDept == false"
              ></el-input>
            </el-form-item>
            <el-form-item label="部门名称" prop="deptName">
              <el-input
                v-model="basicForm.deptName"
                style="width: 450px"
                :disabled="btnUpdataDept == false"
              ></el-input>
            </el-form-item>
            <el-form-item label="上级机构" v-show="parentShow">
              <el-input
                v-model="basicForm.parentName"
                :disabled="true"
                style="width: 450px"
              ></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-radio
                v-model="basicForm.status"
                :disabled="btnUpdataDept == false"
                :label="'0'"
                >启用</el-radio
              >
              <el-radio
                v-model="basicForm.status"
                :disabled="btnUpdataDept == false"
                :label="'1'"
                >禁用</el-radio
              >
            </el-form-item>
          </el-form>
          <div style="text-align: right" v-show="btnUpdataDept">
            <el-button class="tBtn" @click="confirmEditDept"> 确定 </el-button>
            <!--     <el-button class="cancel" @click="resetForm('form')">
                取消
              </el-button> -->
          </div>
          <!--查看、修改岗位信息-->
          <el-form
            ref="basicInfoJob"
            :model="basicJobForm"
            :rules="updataJobRules"
            label-width="80px"
            class="org-form"
            v-show="lookJobShow"
          >
            <el-form-item label="编号" v-show="false">
              <el-input v-model="basicJobForm.postId"></el-input>
            </el-form-item>
            <el-form-item label="排序">
              <el-input
                oninput="value=value.replace(/^\.+|[^\d.]/g,'')"
                maxlength="4"
                show-word-limit
                @blur="basicJobChange($event)"
                v-model="basicJobForm.norder"
                style="width: 450px"
              ></el-input>
            </el-form-item>
            <el-form-item label="岗位名称" prop="name">
              <el-input
                v-model="basicJobForm.name"
                style="width: 450px"
              ></el-input>
            </el-form-item>
            <el-form-item label="上级机构" v-show="parentShow">
              <el-input
                v-model="basicJobForm.deptName"
                :disabled="true"
                style="width: 450px"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="状态" prop="status">
                <el-radio v-model="basicJobForm.status" :label="'0'">启用</el-radio>
                <el-radio v-model="basicJobForm.status" :label="'1'">禁用</el-radio>
              </el-form-item> -->
          </el-form>
          <div style="text-align: right" v-show="btnLookShowJob">
            <el-button class="tBtn" @click="confirmJob"> 确定 </el-button>
            <!--     <el-button class="cancel" @click="resetForm('form')">
                取消
              </el-button> -->
          </div>
          <!--添加岗位信息-->
          <el-form
            ref="addJob"
            :model="jobForm"
            label-width="80px"
            :rules="addJobRules"
            class="org-form"
            v-show="addJobShow"
          >
            <el-form-item label="排序">
              <el-input
                oninput="value=value.replace(/^\.+|[^\d.]/g,'')"
                maxlength="4"
                show-word-limit
                @blur="jobFormChange($event)"
                v-model="jobForm.nOrder"
                style="width: 450px"
              ></el-input>
            </el-form-item>
            <el-form-item label="岗位名称" prop="name">
              <el-input v-model="jobForm.name" style="width: 450px"></el-input>
            </el-form-item>
            <el-form-item label="上级机构id" v-show="false">
              <el-input
                v-model="jobForm.deptId"
                style="width: 450px"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </el-form>
          <div style="text-align: right" v-show="btnShowJob">
            <el-button class="tBtn" @click="confirmAddJob"> 确定 </el-button>
            <!--  <el-button class="cancel" @click="resetForm('form')">
                取消
              </el-button> -->
          </div>
          <!--添加子部门信息-->
          <el-form
            ref="addDept"
            :model="deptForm"
            :rules="addDeptRules"
            label-width="80px"
            class="org-form"
            v-show="addDeptShow"
          >
            <el-form-item label="排序">
              <el-input
                oninput="value=value.replace(/^\.+|[^\d.]/g,'')"
                maxlength="4"
                show-word-limit
                @blur="deptFormChange($event)"
                v-model="deptForm.orderNum"
                style="width: 450px"
              ></el-input>
            </el-form-item>
            <el-form-item label="部门名称" prop="deptName">
              <el-input
                v-model="deptForm.deptName"
                style="width: 450px"
              ></el-input>
            </el-form-item>
            <el-form-item label="上级机构" v-show="false">
              <el-input
                v-model="deptForm.parentId"
                :disabled="true"
                style="width: 450px"
              ></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="deptForm.status">
                <el-radio v-model="basicJobForm.status" :label="'0'"
                  >启用</el-radio
                >
                <el-radio v-model="basicJobForm.status" :label="'1'"
                  >禁用</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div style="text-align: right" v-show="btnShowDept">
            <el-button class="tBtn" @click="confirmAddDept"> 确定 </el-button>
            <!--  <el-button class="cancel" @click="resetForm('form')">
                取消
              </el-button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  // getTreeDeptSelect,
  getBaseDeptInfo,
  getBaseJobInfo,
  getEditJob,
  getDeleteJob,
  getEditDept,
  getAddDept,
  getAddJob,
  getPostsBydeptId,
} from "@/api/job/org";
import { isNumber } from "@/utils/validate.js";
import { getTreeDeptSelect } from "@/api/job/workChart";
export default {
  data() {
    return {
      has: {
        remove: "system:workProcess:delete",
        editDept: "system:dept:edit",
        editJob: "business:post:edit",
        addJob: "business:post:add",
        addDept: "system:dept:addSub",
      },
      rightTit: "机构详细信息",
      //岗位按钮
      btnShowJob: false,
      //部门按钮
      btnShowDept: false,
      addDeptShow: false,
      addJobShow: false,
      lookShow: true,
      updataBtn: false,
      //上级机构输入框
      parentShow: true,
      lookJobShow: false,
      btnLookShowJob: false,
      //修改子部门按钮
      btnUpdataDept: false,
      deleteJobBtn: false,
      //查看部门基本信息
      basicForm: {
        deptId: "",
        orderNum: "",
        deptName: "",
        parentId: "",
        status: "",
      },
      //查看岗位基本信息
      basicJobForm: {
        deptId: "",
        deptName: "",
        createById: "",
        name: "",
        deleted: "",
        nOrder: "",
      },
      //修改岗位基本信息
      basicJobUpdata: {
        deptId: "",
        deptName: "",
        createById: "",
        postName: "",
        deleted: "",
        norder: "",
      },
      ///新增子部门信息
      deptParentId: "",
      deptForm: {
        parentId: "",
        deptName: "",
        orderNum: "",
        status: "",
      },
      deptFormUpdata: {
        parentId: "",
        deptName: "",
        orderNum: "",
        status: "",
        deptId: "",
      },
      //修改岗位按钮
      updataJobBtn: false,
      //修改部门按钮
      updataDeptBtn: true,
      //新增部门按钮
      addDeptBtn: true,
      //新增岗位按钮
      addJobBtn: true,
      //表单验证方法
      //添加岗位
      addJobRules: {
        // nOrder: [{
        //   required: true,
        //   trigger: 'blur',
        //   message: '请输入正确的数字',
        //   validator: (rule, value, callback) => {
        //     if (value == null || value == undefined || value == '') {
        //       callback(new Error('请输入正确的数字'))
        //     } else {
        //       if (!isNumber(value)) {
        //         callback(new Error('输入格式不正确'))
        //       } else {
        //         callback()
        //       }
        //     }
        //   }
        // }],
        name: [
          {
            required: true,
            message: "请输入岗位名称",
            trigger: "blur",
          },
        ],
      },
      //添加部门
      addDeptRules: {
        orderNum: [
          {
            required: true,
            trigger: "blur",
            message: "请输入正确的数字",
            validator: (rule, value, callback) => {
              if (value == null || value == undefined || value == "") {
                callback(new Error("请输入正确的数字"));
              } else {
                if (!isNumber(value)) {
                  callback(new Error("输入格式不正确"));
                } else {
                  callback();
                }
              }
            },
          },
        ],
        deptName: [
          {
            required: true,
            message: "请输入部门名称",
            trigger: "blur",
          },
        ],
        status: [
          {
            required: true,
            message: "请选择状态",
            trigger: "blur",
          },
        ],
      },
      //修改岗位
      updataJobRules: {
        // nOrder: [{
        //   required: true,
        //   trigger: 'blur',
        //   message: '请输入正确的数字',
        //   validator: (rule, value, callback) => {
        //     if (value == null || value == undefined || value == '') {
        //       callback(new Error('请输入正确的数字'))
        //     } else {
        //       if (!isNumber(value)) {
        //         callback(new Error('输入格式不正确'))
        //       } else {
        //         callback()
        //       }
        //     }
        //   }
        // }],
        deptName: [
          {
            required: true,
            message: "请输入岗位名称",
            trigger: "blur",
          },
        ],
      },
      //修改部门
      updataDeptRules: {
        orderNum: [
          {
            required: true,
            trigger: "blur",
            message: "请输入正确的数字",
            validator: (rule, value, callback) => {
              if (value == null || value == undefined || value == "") {
                callback(new Error("请输入正确的数字"));
              } else {
                if (!isNumber(value)) {
                  callback(new Error("输入格式不正确"));
                } else {
                  callback();
                }
              }
            },
          },
        ],
        deptName: [
          {
            required: true,
            message: "请输入岗位名称",
            trigger: "blur",
          },
        ],
        status: [
          {
            required: true,
            message: "请选择状态",
            trigger: "blur",
          },
        ],
      },
      jobDeptId: "",
      jobLable: "",
      jobForm: {
        nOrder: "",
        name: "",
        // label: this.basicJobForm.name,
        // deptId: this.basicJobForm.deptId,
        // label:this.jobLabel,
        deptId: this.jobDeptId,
      },
      //树形
      checkStrictly: true,
      // defaultMenutree: ["200"],
      deptOptions: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      id: "202",
      treeRes: "",
      postId: "",
      flag: "",
    };
  },
  created: async function () {
    //获取部门树形
    this.fullscreenLoading = true;
    this.treeRes = await getTreeDeptSelect();
    this.deptOptions = this.treeRes;
    this.$refs.deptTree.setCheckedKeys([this.treeRes[0].id], true);
    this.currentChecke = this.treeRes[0].id;
    //查看基本信息
    this.lookBasicInfo();
    this.lookJobShow = false;
    this.fullscreenLoading = false;
  },
  methods: {
    salaryChange(e) {
      this.basicForm.orderNum = e.target.value;
    },
    basicJobChange(e) {
      this.basicJobForm.norder = e.target.value;
    },
    jobFormChange(e) {
      this.jobForm.nOrder = e.target.value;
    },
    deptFormChange(e) {
      this.deptForm.orderNum = e.target.value;
    },
    // treeload
    async nodeclick(data, node) {
      console.log(node);
      node.loading = true;
      if (node.data.children.length == 1) {
        if (
          node.data.children[0].flag == "2" &&
          JSON.stringify(node.data.children[0].label) == "null"
        ) {
          node.data.children = [];
        }
      }
      let parw = {
        deptId: data.id,
      };
      let res = await getPostsBydeptId(parw);
      let treelist;
      if (node.data.hasOwnProperty("children")) {
        treelist = [...node.data.children, ...res];
      } else {
        treelist = res;
      }
      if (treelist.length == 0) {
        node.loading = false;
        return;
      }
      // 去重
      let map = new Map();
      for (let item of treelist) {
        if (!map.has(item.id)) {
          map.set(item.id, item);
        }
      }
      treelist = [...map.values()];
      this.$refs["deptTree"].updateKeyChildren(data.id, treelist);
      node.loading = false;
    },

    handleNodeClick(data) {},
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //新增岗位
    addOrgFormPost() {
      //查看岗位弹窗
      this.lookShow = false;
      //查看部门弹窗
      this.deptShow = false;
      //查看和编辑岗位窗口
      this.lookJobShow = false;
      //新增部门弹窗
      this.addDeptShow = false;
      //新增岗位弹窗
      this.addJobShow = true;
      //新增部门提交按钮
      this.btnShowDept = false;
      //新增岗位提交按钮
      this.btnShowJob = true;
      this.lookShow = false;
      this.btnLookShowJob = false;
      this.rightTit = "新增岗位信息";
    },
    //新增子部门
    addOrgFormDept() {
      this.lookShow = false;
      this.btnShowJob = false;
      this.addDeptShow = true;
      this.addJobShow = false;
      this.btnShowDept = true;
      this.lookJobShow = false;
      this.btnUpdataDept = false;
      this.btnLookShowJob = false;
      this.rightTit = "新增子部门信息";
      if (this.$refs["addDept"]) {
        this.$refs["addDept"].resetFields();
      }
    },
    //修改部门
    async EditOrgFormInfo() {
      // this.lookShow=false;
      this.btnShowJob = false;
      this.addDeptShow = false;
      this.addJobShow = false;
      this.btnShowDept = false;
      this.btnLookShowJob = false;
      this.lookJobShow = false;
      this.updataBtn = false;
      this.btnUpdataDept = true;
      this.lookShow = true;
      this.rightTit = "修改部门信息";
    },
    //修改岗位
    async EditJobFormInfo() {
      // this.lookShow=false;
      this.btnShowJob = false;
      this.addDeptShow = false;
      this.addJobShow = false;
      this.btnShowDept = false;
      this.btnLookShowJob = true;
      this.lookJobShow = true;
      this.updataBtn = false;
      this.btnUpdataDept = false;
      this.lookShow = false;
      this.rightTit = "修改岗位信息";
    },
    //删除岗位
    async DeleteJobFormInfo() {
      this.$confirm("确定要删除岗位信息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          var data = await getDeleteJob(this.basicJobForm.postId);
          this.$message({
            type: "success",
            message: "删除成功！",
          });
          //刷新树
          this.getTreeList();
          //查看基本信息
          this.lookBasicInfo();
          this.lookJobShow = false;
          this.fullscreenLoading = false;
          this.deleteJobBtn = false;
        })
        .catch(() => {});
    },

    //保存修改岗位信息
    async confirmJob() {
      this.basicJobUpdata.postId = this.basicJobForm.postId;
      this.basicJobUpdata.deptId = this.basicJobForm.deptId;
      this.basicJobUpdata.postName = this.basicJobForm.name;
      this.basicJobUpdata.nOrder = this.basicJobForm.norder;
      delete this.basicJobUpdata.createById;
      delete this.basicJobUpdata.name;
      delete this.basicJobUpdata.deptId;
      delete this.basicJobUpdata.deptName;
      delete this.basicJobUpdata.norder;
      delete this.basicJobUpdata.deleted;
      this.$refs.basicInfoJob.validate(async (valid) => {
        if (!valid) {
          this.$notify({
            title: "操作失败",
            dangerouslyUseHTMLString: true,
            message: "请填写正确的数据格式",
            type: "warning",
          });
          return;
        }
        var data = await getEditJob(this.basicJobUpdata);
        this.$notify({
          title: data ? "操作成功" : "操作失败",
          dangerouslyUseHTMLString: true,
          message: data ? data.message : "服务器开小差了，请稍后再试",
          type: data ? "success" : "warning",
        });
        this.getTreeList();
      });
    },
    //修改子部门信息
    async confirmEditDept() {
      this.deptFormUpdata.deptId = this.basicForm.deptId;
      this.deptFormUpdata.deptName = this.basicForm.deptName;
      this.deptFormUpdata.orderNum = this.basicForm.orderNum;
      this.deptFormUpdata.status = this.basicForm.status;
      this.deptFormUpdata.parentId = this.basicForm.parentId;
      this.$refs.basicInfo.validate(async (valid) => {
        if (!valid) {
          this.$notify({
            title: "操作失败",
            dangerouslyUseHTMLString: true,
            message: "请填写正确的数据格式",
            type: "warning",
          });
          return;
        }
        var data = await getEditDept(this.deptFormUpdata);
        this.$notify({
          title: data ? "操作成功" : "操作失败",
          dangerouslyUseHTMLString: true,
          message: data ? data.message : "系统正在维护中，请与管理员联系",
          type: data ? "success" : "warning",
        });
        this.getTreeList();
        this.rightTit = "查看部门信息";
        this.btnUpdataDept = false;
      });
    },
    //新增岗位提交按钮
    async confirmAddJob() {
      if (this.jobDeptId == "" || this.jobDeptId == undefined) {
        this.jobForm.deptId = this.currentChecke;
      } else {
        this.jobForm.deptId = this.jobDeptId;
      }
      this.$refs.addJob.validate(async (valid) => {
        if (!valid) {
          this.$notify({
            title: "操作失败",
            dangerouslyUseHTMLString: true,
            message: "请填写正确的数据格式",
            type: "warning",
          });
          return;
        }
        var data = await getAddJob(this.jobForm);
        this.$notify({
          title: data ? "添加成功" : "添加失败",
          dangerouslyUseHTMLString: true,
          message: data ? data.message : "服务器开小差了，请稍后再试",
          type: data ? "success" : "warning",
        });
        this.getTreeList();
        this.$refs["addJob"].resetFields();

      });
    },
    //新增子部门提交按钮
    async confirmAddDept() {
      if (this.deptParentId == "" || this.deptParentId == undefined) {
        this.deptForm.parentId = this.currentChecke;
      } else {
        this.deptForm.parentId = this.deptParentId;
      }
      this.$refs.addDept.validate(async (valid) => {
        if (!valid) {
          this.$notify({
            title: "操作失败",
            dangerouslyUseHTMLString: true,
            message: "请填写正确的数据格式",
            type: "warning",
          });
          return;
        }
        var data = await getAddDept(this.deptForm);
        this.$notify({
          title: data ? "添加成功" : "添加失败",
          dangerouslyUseHTMLString: true,
          message: data ? data.message : "服务器开小差了，请稍后再试",
          type: data ? "success" : "warning",
        });
        this.getTreeList();
        if (this.$refs["addDept"]) {
          this.$refs["addDept"].resetFields();
        }
      });
    },
    //查询信息
    async lookBasicInfo() {
      if (this.treeRes[0].flag == 1) {
        //为1进入岗位
        this.basicForm = await getBaseJobInfo(this.treeRes[0].id);
        this.lookShow = false;
        this.addJobShow = false;
        this.addDeptShow = false;
        this.btnLookShowJob = false;
        this.btnShowDept = false;
        this.lookJobShow = true;
        this.updataBtn = false;
        // this.btnLookShowJob=true;
        this.btnUpdataDept = false;
        this.btnShowJob = false;
        this.updataJobBtn = true;
        this.updataDeptBtn = false;
        this.addDeptBtn = false;
        this.addJobBtn = false;
        this.btnShowJob = false;
        this.btnLookShowJob = false;
        this.rightTit = "查看岗位信息";
        // this.basicForm = await getBaseJobInfo(202)
      } else {
        //为0进入部门
        this.addDeptShow = false;
        this.rightTit = "查看部门信息";
        this.lookShow = true;
        this.lookJobShow = false;
        this.addJobShow = false;
        this.updataJobBtn = false;
        this.updataDeptBtn = true;
        this.addDeptBtn = true;
        this.addJobBtn = true;
        this.btnUpdataDept = false;
        this.btnShowDept = false;
        this.btnLookShowJob = false;
        this.btnShowJob = false;
        this.basicForm = await getBaseDeptInfo(this.treeRes[0].id);
      }

      if (this.basicForm.parentId == "0") {
        this.parentShow = false;
      } else {
        this.parentShow = true;
      }
    },
    //单击的时候查询信息
    async selLookBasicInfo(data) {
      this.jobDeptId = data.id;
      this.jobLabel = data.label;
      this.deptParentId = data.id;
      this.lookShow = true;

      this.flag = data.flag;
      if (this.flag == 1) {
        //为1进入岗位
        this.lookShow = false;
        this.addJobShow = false;
        this.addDeptShow = false;
        this.btnLookShowJob = false;
        this.btnShowDept = false;
        this.updataBtn = false;
        this.btnLookShowJob = true;
        this.btnShowJob = false;
        this.btnUpdataDept = false;
        this.btnShowJob = false;
        this.btnLookShowJob = false;
        this.postId = data.id;
        var node = this.$refs.deptTree.getCheckedKeys();
        this.basicForm = await getBaseJobInfo(data.id);
        this.basicJobForm = await getBaseJobInfo(this.postId);

        this.lookJobShow = true;
        this.updataJobBtn = true;
        this.deleteJobBtn = true;
        this.updataDeptBtn = false;
        this.addDeptBtn = false;
        this.addJobBtn = false;
        this.rightTit = "查看岗位信息";
        // this.basicForm = await getBaseJobInfo(202)
      } else {
        //为0进入部门
        this.lookJobShow = false;
        this.lookShow = true;
        this.addDeptShow = false;
        this.addJobShow = false;
        this.basicForm = await getBaseDeptInfo(data.id);
        this.updataJobBtn = false;
        this.deleteJobBtn = false;
        this.updataDeptBtn = true;
        this.addDeptBtn = true;
        this.addJobBtn = true;
        this.btnUpdataDept = false;
        this.btnShowDept = false;
        this.btnLookShowJob = false;
        this.btnShowJob = false;
        this.rightTit = "查看部门信息";
        //this.basicForm = await getBaseJobInfo(202)
      }
      if (this.basicForm.parentId == "0") {
        this.parentShow = false;
      } else {
        this.parentShow = true;
      }
    },
    //获取树形结构
    async getTreeList() {
      if (this.$refs.deptTree) {
        this.deptOptions = await getTreeDeptSelect();
      }
    },
    treeCheck(data, isCheck, isChildrenCheck) {
      if (isCheck) {
        let keys = this.$refs.deptTree.getCheckedKeys();
        // let itme = [keys[keys.length-1]]
        if (this.currentChecke && this.currentChecke == "") {
          this.currentChecke = keys[0];
        } else {
          let this_ = this;
          keys.some((value) => {
            if (value != this_.currentChecke) {
              this_.currentChecke = value;
              return true;
            }
          });
        }
        let itme = [this.currentChecke];
        this.$refs.deptTree.setCheckedKeys(itme, true);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.org-tit {
  position: relative;
  font-size: 18px;
  height: 50px;
  line-height: 50px;
  color: #333;
  padding-left: 15px;
}

.org-tit::before {
  display: inline-block;
  content: "";
  width: 4px;
  height: 20px;
  background: rgba(13, 116, 215, 1);
  vertical-align: -4px;
  margin-right: 9px;
}

.right-form {
  padding: 15px;
  position: relative;
}

.org-tit em {
  border: 1px solid #d7d7d7;
  cursor: pointer;
  padding: 7px;
  border-radius: 3px;
}

.org .oprate-btn {
  position: absolute;
  right: 35px;
  top: 8px;
}
.org .oprate-btn .chaxun {
  background-color: #0d74d7;
  border-color: #0d74d7;
  color: #ffffff;
  text-align: center;
  height: 32px;
}

.cancel {
  width: 68px;
  height: 32px;
  line-height: 32px;
  color: #d7d7d7;
  background: #ffffff;
  border-radius: 3px;
  border: 1px solid rgba(215, 215, 215, 1);
}
</style>
