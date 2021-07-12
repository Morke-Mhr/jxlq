<template>
  <div class="app-container container-table">
    <div class="sxForm">
      <el-form :inline="true" :model="pageForm" ref="pageForm" class="demo-form-inline">
        <el-form-item prop="userName" label="用户账号">
          <el-input v-model="pageForm.userName" maxlength="30" placeholder="用户账号"></el-input>
        </el-form-item>
        <el-form-item prop="realName" label="真实姓名">
          <el-input v-model="pageForm.realName" maxlength="30" placeholder="真实姓名"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="用户状态">
          <el-select v-model="pageForm.status" placeholder="用户状态">
            <el-option label="正常" value="0"></el-option>
            <el-option label="停用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="日期范围">
          <el-date-picker
            v-model="dateList"
            @change="dateChange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button class="chaxun" icon="el-icon-search" v-has="has.query" @click="getList()">查询</el-button>
          <el-button @click="resetForm('pageForm')" class="chongzhi">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-list">
      <el-button class="table-add-btn" v-has="has.add" @click="handleAdd()">添加用户</el-button>
      <el-button class="table-default-btn" v-has="has.remove" @click="handleDelete()">删除用户</el-button>

      <el-table
        :data="tableData"
        v-loading="listLoading"
        style="width: 100%; margin-top: 30px"
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column align="center" label="用户账号">
          <template slot-scope="scope">{{ scope.row.userName }}</template>
        </el-table-column>
        <el-table-column align="center" label="真实姓名">
          <template slot-scope="scope">{{ scope.row.realName }}</template>
        </el-table-column>
        <el-table-column align="center" label="用户状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == '0'">正常</span>
            <span v-if="scope.row.status == '1'">停用</span>
          </template>
        </el-table-column>
        <el-table-column align="header-center" label="描述">
          <template slot-scope="scope">{{ scope.row.remark }}</template>
        </el-table-column>
        <el-table-column align="header-center" label="创建时间">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column fixed="right" width="200" align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" v-has="has.edit" size="medium" @click="handlePwd(scope)">重置密码</el-button>
            <el-button type="text" v-has="has.edit" size="medium" @click="handleEdit(scope)">编辑</el-button>
            <el-button type="text" v-has="has.remove" size="medium" @click="handleDelete(scope)">删除</el-button>
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
      ></el-pagination>

      <el-dialog
        :visible.sync="dialogVisible"
        custom-class="small"
        :title="dialogType === 'edit' ? '修改用户信息' : '添加用户信息'"
      >
        <el-form
          :model="user"
          :rules="formRules"
          ref="operationFome"
          label-width="120px"
          label-position="left"
        >
          <el-form-item label="用户账号" prop="userName">
            <el-input
              v-model="user.userName"
              maxlength="30"
              show-word-limit
              placeholder="用户账号"
              :disabled="this.editDisabled"
            />
          </el-form-item>
          <el-form-item v-if="dialogType != 'edit'" label="用户密码" prop="password">
            <el-input
              v-model="user.password"
              maxlength="30"
              show-word-limit
              type="password"
              placeholder="请输入6~16位密码"
            />
          </el-form-item>
          <el-form-item v-if="dialogType != 'edit'" label="确认密码" prop="confirmPwd">
            <el-input
              v-model="user.confirmPwd"
              maxlength="30"
              show-word-limit
              size="small"
              type="password"
              placeholder="请再次输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="user.realName" maxlength="30" show-word-limit placeholder="真实姓名" />
          </el-form-item>
          <el-form-item label="身份证号" prop="cardId">
            <el-input v-model="user.cardId" maxlength="18" show-word-limit placeholder="身份证号" />
          </el-form-item>
          <el-form-item label="用户角色" prop="roleIds">
            <el-select
              class="select-width"
              v-model="user.roleIds"
              multiple
              collapse-tags
              placeholder="请选择"
            >
              <el-option
                v-for="item in roleOptions"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input v-model="user.phonenumber" maxlength="11" show-word-limit placeholder="手机号码" />
          </el-form-item>
          <el-form-item label="用户邮箱">
            <el-input v-model="user.email" maxlength="30" show-word-limit placeholder="用户邮箱" />
          </el-form-item>
          <el-form-item label="选择部门和岗位" prop="postId" style="width: 100%">
            <el-row>
              <el-col :span="12">
                <el-cascader
                  ref="cascader"
                  v-model="user.deptId"
                  :options="this.treeResDept"
                  :props="jobProps"
                  @change="change"
                  clearable
                  :show-all-levels="false"
                ></el-cascader>
              </el-col>
              <el-col :span="12">
                <el-select v-model="userName" placeholder="请选择岗位" @change="pitchName">
                  <el-option
                    v-for="item in jobsOptions"
                    :key="item.postId"
                    :label="item.name"
                    :value="{ value: item.postId, label: item.name }"
                    :props="PeopleProps"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="出生日期" prop="userBirth">
            <el-date-picker
              v-model="user.userBirth"
              type="date"
              placeholder="出生日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="用户性别" prop="gender">
            <el-select v-model="user.gender" placeholder="用户性别">
              <el-option label="男" value="0"></el-option>
              <el-option label="女" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户状态" prop="status">
            <el-radio-group v-model="user.status">
              <el-radio :label="'0'">正常</el-radio>
              <el-radio :label="'1'">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上传头像">
            <el-upload
              class="avatar-uploader"
              ref="upload"
              :action="getUrl"
              :headers="geHeaders"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="user.avatar" :src="getUserImg" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              v-model="user.remark"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              placeholder="用户描述"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button class="tBtn" @click="confirm">提交</el-button>
          <el-button class="fBtn" @click="dialogVisible = false">取消</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="重置密码"
        :visible.sync="dialogVisibleP"
        custom-class="small"
        @close="closeDialogPw"
      >
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="新密码" prop="pass">
            <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleP = false">取 消</el-button>
          <el-button type="primary" @click="addSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  addUser,
  updateUse,
  updateUserStatus,
  getUserList,
  updateUserPwwd,
  deleteUser,
  getUserInfo,
  UserPwd,
  getJobs,
  getTreeDeptSelect
} from "@/api/system/user";
import { getRolesOptionselect } from "@/api/system/role";

import { getPostOptionselect } from "@/api/system/post";

import { getDepttreeSelect } from "@/api/system/dept";

import { isMaill, isID, isPhone } from "@/utils/validate.js";

import store from "@/store/index.js";

import { getToken } from "@/utils/auth";

const defaultUser = {
  userId: "",
  userName: "",
  realName: "",
  userBirth: "",
  gender: "0",
  roleIds: [],
  deptId: "",
  postId: "",
  password: "",
  phonenumber: "",
  email: "",
  cardType: "",
  cardId: "",
  status: "0",
  avatar: "",
  remark: ""
};

export default {
  name: "index",
  data() {
    //新增表单是的密码验证
    var validatePass = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.user.confirmPwd != "") {
          this.$refs.operationFome.validateField("confirmPwd");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请再次输入密码"));
      } else if (value != this.user.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    //重置密码时的表单验证
    var validatePass3 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass4 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      PeopleProps: {
        value: "postId",
        label: "name"
      },

      has: {
        remove: "system:usermanage:remove",
        query: "system:user:query",
        add: "system:user:add",
        edit: "system:user:edit"
      },
      dateList: [],
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        userName: "",
        phonenumber: "",
        status: "",
        beginTime: "",
        endTime: "",
        realName: ""
      },
      user: {
        userId: "",
        userName: "",
        realName: "",
        userBirth: "",
        gender: "0",
        roleIds: [],
        // deptIds:[],
        // postIds:[],
        password: "",
        confirmPwd: "", //确认密码
        phonenumber: "",
        email: "",
        cardType: "",
        cardId: "",
        status: "0",
        avatar: "",
        remark: "",
        flag: "0",
        postId: "",
        deptId: ""
      },
      userName: "",
      ruleForm: {
        password: "",
        checkPass: "",
        userId: ""
      },
      jobProps: {
        value: "id",
        label: "label",
        checkStrictly: true
      },
      treeResDept: [],
      multipleSelection: [],
      tableData: [],
      tableKey: 0,
      total: 100,
      pageSizes: [10, 15, 20, 25, 30],
      listLoading: false,
      dialogVisible: false,
      dialogVisibleP: false, //重置密码框
      dialogType: "new",
      roleOptions: [],
      deptOptions: [],
      postOptions: [],
      defaultTree: [],
      jobsOptions: [], //岗位信息
      checkStrictly: true,
      defaultProps: {
        children: "children",
        label: "label"
      },
      editDisabled: false,
      reeArr: [],
      //表单验证方法
      formRules: {
        phonenumber: [
          {
            required: true,
            trigger: "blur",
            // message: '请输入正确的电话号码',
            validator: (rule, value, callback) => {
              if (value == null || value == undefined || value == "") {
                callback(new Error("请输入正确的电话号码"));
              } else {
                if (!isPhone(value)) {
                  callback(new Error("电话号码格式不正确"));
                } else {
                  callback();
                }
              }
            }
          }
        ],
        cardId: [
          {
            required: true,
            trigger: "blur",
            // message: '请输入正确的身份证号码',
            validator: (rule, value, callback) => {
              if (value == null || value == undefined || value == "") {
                callback(new Error("请输入正确的身份证号码"));
              } else {
                if (!isID(value)) {
                  callback(new Error("身份证号码格式不正确"));
                } else {
                  callback();
                }
              }
            }
          }
        ],
        // 邮箱校验
        email: [
          {
            required: true,
            trigger: "blur",
            // message: '请输入正确的用户邮箱',
            validator: (rule, value, callback) => {
              if (value == null || value == undefined || value == "") {
                callback(new Error("请输入正确的用户邮箱"));
              } else {
                if (!isMaill(value)) {
                  callback(new Error("用户邮箱格式不正确"));
                } else {
                  callback();
                }
              }
            }
          }
        ],
        userName: [
          {
            required: true,
            message: "请输入用户账号",
            trigger: "blur"
          }
        ],
        realName: [
          {
            required: true,
            message: "请输入真实姓名",
            trigger: "blur"
          }
        ],
        roleIds: [
          {
            required: true,
            message: "请至少选择一个角色",
            trigger: "click"
          }
        ],

        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur"
          },
          { validator: validatePass, trigger: "blur" }
        ],
        confirmPwd: [
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur"
          },
          { validator: validatePass2, trigger: "blur", required: true }
        ],
        postId: [
          {
            required: true,
            message: "请选择岗位",
            trigger: "blur"
          }
        ]
      },
      //密码表单验证
      rules: {
        pass: [{ validator: validatePass3, trigger: "blur" }],
        checkPass: [{ validator: validatePass4, trigger: "blur" }]
      }
    };
  },
  computed: {
    getUrl() {
      return (
        store.state.apiConfiguration.url +
        store.state.serviceName.jurisdiction +
        "/user/profile/avatar"
      );
    },
    geHeaders() {
      return { Authorization: getToken() };
    },
    getUserImg() {
      // return store.state.apiConfiguration.fileUrl + this.user.avatar
      return store.state.apiConfiguration.url + this.user.avatar;
    }
  },
  created: async function() {
    this.getList();
    this.roleOptions = await getRolesOptionselect();
    this.deptOptions = await getDepttreeSelect();
    this.postOptions = await getPostOptionselect();
    this.treeResDept = await getTreeDeptSelect();
  },
  methods: {
    //日期时间置空
    dateChange(value) {
      if (value == null) {
        this.dateList = [];
        this.pageForm.beginTime = "";
        this.pageForm.endTime = "";
      } else {
        this.pageForm.beginTime = this.$dateFormat(
          "yyyy-MM-dd",
          this.dateList[0]
        );
        this.pageForm.endTime = this.$dateFormat(
          "yyyy-MM-dd",
          this.dateList[1]
        );
      }
    },
    async getList() {
      this.listLoading = true;
      const res = await getUserList(this.pageForm);
      this.tableData = res.rows;
      this.total = res.total;
      this.listLoading = false;
    },
    //重置密码
    handlePwd(scope) {
      this.dialogVisibleP = true;
      this.ruleForm.userId = scope.row.userId;
    },
    //提交修改密码
    async addSubmit() {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) {
          this.$notify({
            title: "操作失败",
            dangerouslyUseHTMLString: true,
            message: "请填写完整",
            type: "warning"
          });
          return;
        }
        let data = null;
        try {
          delete this.ruleForm.checkPass;
          data = await UserPwd(this.ruleForm);
        } catch (e) {
          console.error("接口异常");
        }
        this.dialogVisibleP = false;
        this.$notify({
          title: data ? "成功" : "失败",
          dangerouslyUseHTMLString: true,
          message: data ? data.message : "服务器开小差了，请稍后再试",
          type: data ? "success" : "warning"
        });
        this.getList();
      });
    },
    //添加用户
    async handleAdd() {
      this.dialogType = "new";
      this.dialogVisible = true;
      this.editDisabled = false;
      if (this.$refs["operationFome"]) {
        this.$refs["operationFome"].resetFields();
      }
      if (this.$refs.deptTree) {
        this.deptOptions = await getDepttreeSelect();
        this.$refs.deptTree.setCheckedKeys([], false);
      }
      this.user = defaultUser;
    },
    pitchName(params) {
      const { value, label } = params;
      this.user.postId = value;
    },
    //编辑用户
    async handleEdit(scope) {
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.editDisabled = true;
      if (this.$refs["operationFome"]) {
        this.$refs["operationFome"].resetFields();
      }
      let userId = scope.row.userId;
      let { user } = await getUserInfo(userId);
      // user.deptId = []
      // user.postId= []
      user.roleIds = [];
      this.user = user;
      if (user.businessPosts) {
        this.user.postId = user.businessPosts[0].postId;
        this.userName = user.businessPosts[0].name;
      }

      if (this.user.roles) {
        this.user.roles.forEach((value, index) => {
          this.user.roleIds.push(value.roleId);
        });
      }
      if (this.user.deptId) {
        this.jobsOptions = await getJobs(this.user.deptId);
      }
    },
    //提交表单
    async confirm() {
      this.$refs.operationFome.validate(async valid => {
        if (!valid) {
          this.$notify({
            title: "操作失败",
            dangerouslyUseHTMLString: true,
            message: "请填写完整",
            type: "warning"
          });
          return;
        }
        const isEdit = this.dialogType === "edit";
        let data = null;
        try {
          if (isEdit) {
            delete this.user.roles;
            delete this.user.depts;
            delete this.user.posts;
            delete this.user.admin;
            data = await updateUse(this.user);
          } else {
            this.user.confirmPwd = undefined;
            data = await addUser(this.user);
          }
        } catch (e) {
          console.error("接口异常");
        }
        this.dialogVisible = false;
        this.$notify({
          title: data ? "成功" : "失败",
          dangerouslyUseHTMLString: true,
          message: data ? data.message : "服务器开小差了，请稍后再试",
          type: data ? "success" : "warning"
        });
        this.getList();
      });
    },
    //删除用户
    handleDelete(scope) {
      if (!scope && this.multipleSelection.length <= 0) {
        this.$message({
          type: "warning",
          message: "请选择要删除的用户!"
        });
        return;
      }
      let row = scope ? scope.row : null;
      this.$confirm("确定删除用户吗?", "删除用户", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await deleteUser(row ? row.userId : this.multipleSelection);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getList();
        })
        .catch(err => {
          console.error(err);
        });
    },
    //重置
    resetForm(formName) {
      this.dateList = [];
      this.pageForm.beginTime = "";
      this.pageForm.endTime = "";
      this.$refs[formName].resetFields();
      this.getList();
    },
    //
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
    handleSizeChange(val) {
      this.pageForm.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val;
      this.getList();
    },
    handleAvatarSuccess(res, file) {
      this.user.avatar = res.body;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //选择岗位
    async change(val) {
      // let nodesObj = this.$refs["cascader"].getCheckedNodes();
      // if (nodesObj[0].data.flag == 0) {
      //   delete this.user.postId;
      //   this.user.deptId = nodesObj[0].data.id;
      // } else if (nodesObj[0].data.flag == 1) {
      if (val.length > 0) {
        this.treeArr = val;
        this.user.deptId = this.treeArr[this.treeArr.length - 1];
        // this.user.deptId = this.treeArr[this.treeArr.length - 2];
        // }
        console.log(this.user.deptId + "获取到了ID");
        if (this.user.deptId != "") {
          this.user.postId = "";
          this.jobsOptions = await getJobs(this.user.deptId);
        }
        this.userName = "";
      } else {
        this.user.postId = "";
        this.userName = "";
        this.jobsOptions = [];
      }
    },
    //关闭弹框的事件
    closeDialog(formName) {
      this.treeResDept = [];
      this.$refs.upload.clearFiles();
    },
    //关闭修改弹框的事件
    closeDialogPw(formName) {
      this.ruleForm = {};
    }
  }
};
</script>

<style lang="scss">
$input_wide: 100%;

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9 !important;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.select-width {
  width: $input_wide;
}
</style>
