<template>
  <div style="background: #f4f1f2">
    <div>
      <el-row class="row-height">
        <el-col :span="16">
          <div class="area-tit">基础信息</div>
          <el-form
            :rules="formRules"
            :model="addData"
            ref="addData"
            label-width="100px"
            class="form-table"
          >
            <el-form-item label="用户账号" prop="userName">
              <el-input type="input" v-model="addData.userName" placeholder="请输入用户账号"></el-input>
            </el-form-item>
            <el-form-item label="真实姓名" prop="realName">
              <el-input type="input" v-model="addData.realName" placeholder="请输入真实姓名"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-radio v-model="addData.gender" :label="'0'">男</el-radio>
              <el-radio v-model="addData.gender" :label="'1'">女</el-radio>
            </el-form-item>
            <el-form-item label="身份证号码" prop="cardId">
              <el-input type="input" v-model="addData.cardId" placeholder="请输入身份证号码"></el-input>
            </el-form-item>
            <el-form-item label="入司日期">
              <div class="block">
                <el-date-picker
                  v-model="addData.joinTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="学历">
              <el-select
                v-model="addData.educationId"
                placeholder="请选择类别"
                @change="peojectTypeFunc"
              >
                <el-option
                  :value="item.dictCode"
                  v-for="item in eduRes"
                  :key="item.dictCode"
                  :label="item.dictLabel"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="毕业学校">
              <el-input type="input" v-model="addData.graduateSchool" placeholder="请输入毕业学校"></el-input>
            </el-form-item>
            <el-form-item label="毕业日期">
              <div class="block">
                <el-date-picker
                  v-model="addData.graduateDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="出生日期">
              <div class="block">
                <el-date-picker
                  v-model="addData.userBirth"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input type="input" v-model="addData.phonenumber" placeholder="请输入手机号码"></el-input>
            </el-form-item>
            <!--  <el-form-item label="邮箱">
            <el-input type="input" v-model="addData.phonenumber" placeholder="请输入邮箱"></el-input>
            </el-form-item>-->
            <div class="area-tit">岗位信息</div>
            <!--     <el-form-item label="选择部门" prop="deptIds">
            <el-tree ref="deptTreeDept" :check-strictly="checkStrictly"
                :default-expanded-keys="defaultMenutreeDept"
                  :default-checked-keys="defaultMenutreeDept"
               :data="deptOptionsDept" :props="defaultPropsDept" @check-change="treeCheckDept"  show-checkbox
              node-key="id" class="people-tree" @check="getCheckedNodesDept"/>
            </el-form-item>-->
            <!-- <el-form-item label="选择岗位" prop="postIds">
          <el-tree ref="deptTree" :check-strictly="checkStrictly"
              :default-expanded-keys="defaultMenutree"
                :default-checked-keys="defaultMenutree"
             :data="deptOptions" :props="defaultProps" @check-change="treeCheck"  show-checkbox
            node-key="id" class="people-tree" @check="getCheckedNodes"/>
            </el-form-item>-->
            <!--  <el-form-item label="职称">
            <el-select v-model="addData.jobTitle" placeholder="业务模块" style="width:80%">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
            </el-form-item>-->
            <!-- <el-form-item label="选择岗位" prop="postId" style="width: 100%">
              <el-cascader
                ref="cascader"
                v-model="addData.postId"
                :options="this.treeResDept"
                :props="jobProps"
                style="width: 50%"
                @change="change"
                clearable
              ></el-cascader>
            </el-form-item>-->
            <el-form-item label="部门" prop="deptId">
              <el-cascader
                :show-all-levels="false"
                ref="cascader"
                v-model="addData.deptId"
                :options="this.treeResDept"
                :props="jobProps"
                @change="change"
                clearable
              ></el-cascader>
            </el-form-item>
            <el-form-item label="岗位" prop="postId">
              <el-select v-model="userName" placeholder="请选择岗位" @change="pitchName">
                <el-option
                  v-for="item in jobsOptions"
                  :key="item.postId"
                  :label="item.name"
                  :value="{ value: item.postId, label: item.name }"
                  :props="PeopleProps"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="专职安全员" prop="isSafeperson">
              <el-radio-group v-model="addData.isSafeperson">
                <el-radio :label="'1'">是</el-radio>
                <el-radio :label="'0'">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <!--   <el-form-item label="职称">
              <el-select v-model="addData.jobTitle" placeholder="职称" style="width:80%">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>-->
          </el-form>
        </el-col>
        <el-col :span="7" :offset="1">
          <div class="img-head">
            <el-upload
              class="avatar-uploader"
              :action="getUrl"
              :headers="geHeaders"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="this.imageUrl" :src="getUserImg" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <div class="lce">
          <div class="area-tit">
            证书信息
            <span
              style="
                font-size: 14px;
                text-align: right;
                float: right;
                padding-right: 15px;
                cursor: pointer;
                color:#409eff;
              "
              @click="addLce"
            >添加证书</span>
          </div>
          <div
            v-for="(itme, index) in lceNum"
            :key="index"
            style="background: #FFFFFF; height: 260px; position: relative"
          >
            <div
              style="
                position: absolute;
                right: 20px;
                cursor: pointer;
                top: 5px;
                z-index: 9;
              "
              @click="deleteLce(index)"
            >删除</div>
            <el-col :span="7">
              <div class="img-head">
                <el-upload
                  class="avatar-uploader"
                  :action="getUrl"
                  :headers="geHeaders"
                  :show-file-list="false"
                  :on-success="
                    (response, file, fileList) => {
                      handleAvatarSuccessLce(response, file, fileList, index)
                    }
                  "
                  :before-upload="beforeAvatarUploadLce"
                >
                  <img
                    v-if="addData.userCertificate[index].categoryFile"
                    :src="getLceImg(index)"
                    class="avatar"
                  />

                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
            </el-col>
            <el-col :span="17">
              <el-form :model="addData" label-width="80px" class="form-table">
                <el-form-item label="证书类别">
                  <el-select v-model="addData.userCertificate[index].category" placeholder="请选择类别">
                    <el-option
                      :value="item.dictCode"
                      v-for="item in lceRes"
                      :key="item.dictCode"
                      :label="item.dictLabel"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="证书名称">
                  <el-input
                    type="input"
                    v-model="addData.userCertificate[index].name"
                    placeholder="请输入证书名称"
                  ></el-input>
                </el-form-item>
                <el-form-item label="发证日期">
                  <div class="block">
                    <el-date-picker
                      v-model="addData.userCertificate[index].useTime"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                    ></el-date-picker>
                  </div>
                </el-form-item>
                <el-form-item label="发证单位">
                  <el-input
                    type="input"
                    v-model="addData.userCertificate[index].unit"
                    placeholder="请输入发证单位"
                  ></el-input>
                </el-form-item>
                <el-form-item label="有效期">
                  <div class="block">
                    <el-date-picker
                      v-model="addData.userCertificate[index].effectiveTime"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                    ></el-date-picker>
                  </div>
                </el-form-item>
              </el-form>
            </el-col>
          </div>
        </div>
      </el-row>
      <!-- <div style="text-align: right; margin-top: 100px">
        <el-button class="confirm-btn" @click="confirm">确定</el-button>
        <el-button class="cancel-btn" @click="cancelBtn">取消</el-button>
      </div>-->
    </div>
  </div>
</template>

<script>
import { getAddPeople, getAddImg } from "@/api/system/people";
import { getTreeDeptSelect, getTreeDeptByLogin } from "@/api/job/org";
import { getSelectLce, getSelectEdu } from "@/api/system/class";
import { getJobs } from "@/api/system/user";

import { getToken } from "@/utils/auth";
import { isNumber, isID, isPhone } from "@/utils/validate.js";
export default {
  name: "addPeople",
  data() {
    return {
      PeopleProps: {
        value: "postId",
        label: "name"
      },

      form: {
        name: "",
        region: ""
      },
      jobsOptions: [],
      userName: "",
      label: [],
      jobProps: {
        value: "id",
        label: "label",
        checkStrictly: true
      },
      lceNum: ["1"],
      imageUrl: "",
      imageLceUrl: "",
      addData: {
        realName: "",
        gender: "",
        cardId: "",
        joinTime: "",
        education: "",
        educationId: "",
        graduateSchool: "",
        graduateDate: "",
        userBirth: "",
        phonenumber: "",
        isSafeperson: "",
        postId: "",
        deptId: "",
        userName: "",
        flag: "1",
        userCertificate: [
          {
            category: "",
            name: "",
            categoryFile: "",
            useTime: "",
            effectiveTime: "",
            unit: ""
          }
        ]
      },

      lceRes: [],
      eduRes: [],
      checkStrictly: false,
      defaultMenutree: [],
      deptOptions: [],
      defaultProps: {
        children: "children",
        label: "label",
        disabled: function(data, node) {
          if (data.flag == "0") {
            return true;
          } else {
            return false;
          }
        }
      },
      lceName: "categoryFile",
      checkStrictlyDept: false,
      defaultMenutreeDept: [],
      deptOptionsDept: [],
      defaultPropsDept: {
        children: "children",
        label: "label",
        disabled: function(data, node) {
          if (data.flag == "1") {
            return true;
          } else {
            return false;
          }
        }
      },
      treeArr: [],
      treeResDept: [],
      //表单验证方法
      formRules: {
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
        gender: [
          {
            required: true,
            message: "请选择性别",
            trigger: "change"
          }
        ],
        deptId: [
          {
            required: true,
            message: "请选择部门",
            trigger: "change"
          }
        ],
        postId: [
          {
            required: true,
            message: "请选择岗位",
            trigger: "change"
          }
        ],
        cardId: [
          {
            required: true,
            trigger: "blur",
            message: "请输入正确的身份证号码",
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
        phonenumber: [
          {
            required: true,
            trigger: "blur",
            message: "请输入正确的手机号码",
            validator: (rule, value, callback) => {
              if (value == null || value == undefined || value == "") {
                callback(new Error("请输入正确的手机号码"));
              } else {
                if (!isPhone(value)) {
                  callback(new Error("手机号码格式不正确"));
                } else {
                  callback();
                }
              }
            }
          }
        ]
      }
    };
  },
  created: async function() {
    this.treeRes = await getTreeDeptSelect();
    this.deptOptions = this.treeRes;
    this.treeResDept = await getTreeDeptByLogin();
    this.getLceSel();
    this.getEduSel();
    // this.deptOptionsDept = this.treeResDept;
  },
  computed: {
    getUrl() {
      return (
        this.$store.state.apiConfiguration.url +
        this.$store.state.serviceName.jurisdiction +
        "/fs/upload"
      );
    },
    geHeaders() {
      return { Authorization: getToken() };
    },
    getUserImg() {
      return (
        this.$store.state.apiConfiguration.url +
        this.$store.state.serviceName.jurisdiction +
        this.imageUrl
      );
    }
  },

  methods: {
    //获取岗位ID
    pitchName(params) {
      const { value, label } = params;
      this.addData.postId = value;
    },

    getLceImg(index) {
      return (
        this.$store.state.apiConfiguration.url +
        this.$store.state.serviceName.jurisdiction +
        this.imageLceUrl
      );
      //return this.$store.state.apiConfiguration.fileUrl + this.imageLceUrl
    },
    returnImgId(index) {
      return "img" + index;
    },
    returnIId(index) {
      return "i" + index;
    },
    openHelp() {
      this.itmeLabel = "";
      this.dialogType = "new";
      this.dialogVisible = true;
    },
    handleAvatarSuccess(res, file) {
      if (res.code == 200) {
        this.imageUrl = res.body.url;
        this.$message({
          message: "上传图片附件成功!",
          type: "success"
        });
      } else {
        this.$message.error("上传图片附件失败");
      }
      // console.log(this.$store.apiConfiguration.fileUrl + this.imageUrl);
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

    handleAvatarSuccessLce(res, file, fileList, index) {
      if (res.code == 200) {
        this.imageLceUrl = res.body.url;
        this.addData.userCertificate[index].categoryFile = this.imageLceUrl;
        this.$message({
          message: "上传图片附件成功!",
          type: "success"
        });
      } else {
        this.$message.error("上传图片附件失败");
      }
      // console.log(this.$store.apiConfiguration.fileUrl + res.body.url);
    },
    beforeAvatarUploadLce(file) {
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
    async confirm() {
      //校验表单
      this.$refs.addData.validate(async valid => {
        if (!valid) {
          this.$notify({
            title: "操作失败",
            dangerouslyUseHTMLString: true,
            message: "请填写完整",
            type: "warning"
          });
          return;
        }
        //取得选中菜单id集合
        let data = null;
        // this.addData.userName = this.addData.realName;
        // this.addData.nickName = this.addData.realName
        delete this.addData.nickName;
        data = await getAddPeople(this.addData);

        this.dialogVisible = false;
        this.$notify({
          title: data ? "成功" : "失败",
          dangerouslyUseHTMLString: true,
          message: data ? data.message : "服务器开小差了，请稍后再试",
          type: data ? "success" : "warning"
        });
        // this.$router.push({
        //   path: '/people/index',
        // })
        this.$emit("fatherMethod");
      });
    },
    cancelBtn() {
      this.$store.state.tabActive = "people";
      console.log(this.$store.state.tabActive);
      this.$emit("fatherMethod");
    },
    treeCheck(data, isCheck, isChildrenCheck) {
      if (isCheck) {
        let keys = this.$refs.deptTree.getCheckedKeys();
        // let itme = [keys[keys.length-1]]
        if (this.currentChecke && this.currentChecke == "") {
          this.currentChecke = keys[0];
        } else {
          let this_ = this;
          keys.some(value => {
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
    treeCheckDept(data, isCheck, isChildrenCheck) {
      if (isCheck) {
        let keys = this.$refs.deptTreeDept.getCheckedKeys();
        // let itme = [keys[keys.length-1]]
        if (this.currentChecke && this.currentChecke == "") {
          this.currentChecke = keys[0];
        } else {
          let this_ = this;
          keys.some(value => {
            if (value != this_.currentChecke) {
              this_.currentChecke = value;
              return true;
            }
          });
        }
        let itme = [this.currentChecke];
        this.$refs.deptTreeDept.setCheckedKeys(itme, true);
      }
    },
    getCheckedNodes(leafOnly, data) {
      this.treeArr = leafOnly;
      console.log(this.treeArr);
    },
    //根据选择部门获取岗位
    // change(val) {
    //   let nodesObj = this.$refs["cascader"].getCheckedNodes();
    //   if (nodesObj[0].data.flag == 0) {
    //     delete this.addData.postId;
    //     this.addData.deptId = nodesObj[0].data.id;
    //   } else if (nodesObj[0].data.flag == 1) {
    //     this.treeArr = nodesObj[0].path;
    //     this.addData.postId = this.treeArr[this.treeArr.length - 1];
    //     this.addData.deptId = this.treeArr[this.treeArr.length - 2];
    //   }
    // },
    //选择岗位
    async change(val) {
      if (val.length >= 1) {
        this.treeArr = val;
        this.addData.deptId = this.treeArr[this.treeArr.length - 1];
        console.log(this.addData.deptId + "获取到了ID");
        if (this.addData.deptId != "") {
          this.addData.postId = "";
          this.jobsOptions = await getJobs(this.addData.deptId);
        }
      } else {
        this.addData.postId = "";
      }
    },

    //添加证书盒子
    addLce() {
      let temUserCertificate = {
        category: "",
        name: "",
        categoryFile: "",
        useTime: "",
        effectiveTime: "",
        unit: ""
      };
      this.addData.userCertificate.push(temUserCertificate);
      this.lceNum.push("next");
    },
    deleteLce(index) {
      this.addData.userCertificate.splice(index);
      this.lceNum.splice(index);
    },
    //获取证书类别下拉列表
    async getLceSel() {
      let dictName = "certificate_category";
      this.lceRes = await getSelectLce(dictName);
      // console.log(this.workRes);
    },
    //获取学历下拉列表
    async getEduSel() {
      let dictName = "education_type";
      this.eduRes = await getSelectEdu(dictName);
      // console.log(this.workRes);
    },
    //获取学历名字
    peojectTypeFunc(val, vIndex) {
      let resultArr = this.eduRes.filter(item => {
        return item.dictCode === val;
      });
      //把值赋给要传给后台的表单对象中

      // this.itemModel.education = resultArr[0].dictCode;
      this.addData.education = resultArr[0].dictLabel; //直接写val也可以
    }

    // getCheckedNodesDept(leafOnly, includeHalfChecked, data) {
    //   this.addData.deptId = leafOnly.id
    //   console.log(this.addData.deptId);
    // }
  }
};
</script>

<style lang="scss" scoped>
.people-content {
  border-radius: 5px;
}

.choose-help {
  cursor: pointer;
}

.page-tit {
  font-size: 18px;
  background: #ffffff;
  height: 45px;
  line-height: 45px;
  margin-bottom: 10px;
  padding-left: 15px;
  border-radius: 5px;
}

.area-tit {
  font-size: 18px;
  height: 50px;
  line-height: 50px;
  color: #333;
  padding-left: 15px;
  margin-top: 10px;
}

.area-tit:before {
  display: inline-block;
  content: "";
  width: 4px;
  height: 20px;
  background: rgba(13, 116, 215, 1);
  vertical-align: -4px;
  margin-right: 9px;
}

.form-table .el-form-item {
  width: 49%;
  display: inline-block;
}

.form-table textarea input {
  height: 35px;
  line-height: 35px;
}

.form-table .el-form-item__label {
  width: 100px !important;
}

.form-table .el-form-item__content {
  margin-left: 100px !important;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
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
  width: 300px;
  height: 300px;
  line-height: 300px;
  text-align: center;
}

.avatar {
  width: 200px;
  height: 200px;
  display: block;
}

.img-head {
  text-align: center;
  margin-top: 130px;
}

.row-height .el-col {
  background: #ffffff;
  height: 580px;
  position: relative;
  border-radius: 5px;
}

.row-height {
  height: 580px;
  border-radius: 5px;
}

.lce {
  background: #ffffff;
  height: 260px;
  border-radius: 5px;
}

.people-tree {
  height: 130px;
  overflow-y: scroll;
  z-index: 99;
}
.lce .avatar-uploader-icon {
  height: 200px;
  line-height: 200px;
}
.lce .img-head {
  margin-top: 0px;
}
</style>
