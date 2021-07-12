<template>
  <div style="background: #f4f1f2">
    <div>
      <el-row class="row-height">
        <el-col :span="24">
          <div class="area-tit">基础信息</div>
          <el-form
            :rules="formRules"
            :model="addData"
            ref="addData"
            label-width="100px"
            class="form-table"
          >
            <el-form-item label="用户账号" prop="userName">
              <el-input
                type="input"
                v-model="addData.userName"
                placeholder="请输入用户账号"
                :disabled="true"
              ></el-input>
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
            <!--    <el-form-item label="选择岗位" prop="postId" style="width: 100%;">
              <el-cascader ref="cascader" v-model="addData.postId":options="this.treeResDept" :props="jobProps" style="width: 100%;"
                @change="change" clearable></el-cascader>
            </el-form-item>-->
            <el-form-item label="岗位名称" prop="postName">
              <el-input type="input" v-model="addData.postName" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="专职安全员" prop="isSafeperson">
              <el-radio v-model="addData.isSafeperson" :label="'1'">是</el-radio>
              <el-radio v-model="addData.isSafeperson" :label="'0'">否</el-radio>
            </el-form-item>
          </el-form>
        </el-col>
        <!--     <el-col :span="7" :offset="1">
          <div class="img-head">
              <el-upload class="avatar-uploader"
                :action="getUrl"
                :headers="geHeaders"
                :show-file-list="false"
                :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                <img v-if="this.imageUrl" :src="getUserImg" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          </div>
        </el-col>-->
      </el-row>
      <el-row>
        <div class="lce" v-show="lceShow">
          <div class="area-tit">
            证书信息
            <span @click="addLce"></span>
          </div>

          <!--         {{addData}} -->
          <div
            v-for="(list, index) in lceData"
            :key="index"
            style="background: #FFFFFF; height: 260px; position: relative"
          >
            <!--     {{lceData}} -->
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
                <img :src="getLceImg(index)" style="width: 200px; height: 200px" />
              </div>
            </el-col>
            <el-col :span="17">
              <el-form :model="list" label-width="80px" class="form-table">
                <el-form-item label="证书类别">
                  <el-select v-model="list.category" placeholder="请选择类别" @change="peojectTypeFunc">
                    <el-option
                      :value="item.dictCode"
                      v-for="item in lceRes"
                      :key="item.dictCode"
                      :label="item.dictLabel"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <!--   <el-select v-model="addData.education" placeholder="请选择类别" style="width:80%">
                  <el-option label="区域一" :value="item.dictLabel" v-for="item in eduRes" :key="item.dictCode" :label="item.dictLabel"></el-option>
                </el-select>-->
                <!--
                <el-form-item label="项目类型" prop="projectTypeId">
                  <el-select v-model="itemModel.projectTypeId" placeholder="请选择项目类型" style="width:100%" @change="peojectTypeFunc">
                    <el-option label="区域一" :value="item.dictCode" v-for="item in itemRes" :key="item.dictCode" :label="item.dictLabel"></el-option>
                  </el-select>
                </el-form-item>-->
                <el-form-item label="证书名称">
                  <el-input type="input" v-model="list.name" placeholder="请输入证书名称"></el-input>
                </el-form-item>
                <el-form-item label="发证日期">
                  <div class="block">
                    <el-date-picker
                      v-model="list.useTime"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                    ></el-date-picker>
                  </div>
                </el-form-item>
                <el-form-item label="发证单位">
                  <el-input type="input" v-model="list.unit" placeholder="请输入发证单位"></el-input>
                </el-form-item>
                <el-form-item label="有效期">
                  <div class="block">
                    <el-date-picker
                      v-model="list.effectiveTime"
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
        <el-button class="confirm-btn" @click="confirm"> 确定 </el-button>
        <el-button class="cancel-btn" @click="cancelBtn"> 取消 </el-button>
      </div>-->
    </div>
  </div>
</template>

<script>
import {
  getEditPeople,
  getAddImg,
  getPeopleInfo,
  getPeopleInfoCer
} from "@/api/system/people";
import { getTreeDeptSelect } from "@/api/job/org";
import { getSelectLce, getSelectEdu } from "@/api/system/class";
import axios from "axios";
import request from "@/utils/request";
import store from "@/store";
import { getToken } from "@/utils/auth";
import { isNumber, isID, isPhone } from "@/utils/validate.js";
export default {
  name: "addPeople",
  props: {
    editProgram: String
  },
  data() {
    return {
      form: {
        name: "",
        region: ""
      },
      label: [],
      jobProps: {
        value: "id",
        label: "label",
        checkStrictly: true
      },
      lceNum: "1",
      imageUrl: "",
      addData: {
        userId: this.editProgram,
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
        userCertificate: []
      },
      lceData: [],
      temLceData: null,
      lceShow: true,
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
            trigger: "blur"
          }
        ],
        postId: [
          {
            required: true,
            message: "请选择岗位",
            trigger: "blur"
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
    let that = this;
    this.treeRes = await getTreeDeptSelect();
    this.deptOptions = this.treeRes;
    this.treeResDept = await getTreeDeptSelect();
    this.getLceSel();
    this.getEduSel();
    console.log("this.addData.userId:", this.addData.userId);
    let temAddData = await getPeopleInfo(this.addData.userId);
    this.addData = temAddData;
    let temLceData = await getPeopleInfoCer(this.addData.userId);
    this.lceData.push(temLceData);
    // if (this.addData.userCertificate.length == 0 || this.addData.userCertificate==undefined) {
    //      this.addData.userCertificate = this.temLceData
    // }else{
    //   this.addData.userCertificate = this.temLceData
    // }
    console.log("this.addData.userCertificate", this.addData.userCertificate);
    if (!this.addData.userCertificate) {
      this.addData.userCertificate = temLceData;
      this.$set(this.addData, "userCertificate", temLceData);
    }
    that.getLceData();
    console.log(this.addData);
    console.log(this.addData.userCertificate);
  },
  computed: {},

  methods: {
    openHelp() {
      this.itmeLabel = "";
      this.dialogType = "new";
      this.dialogVisible = true;
    },
    cancelBtn() {
      this.$store.state.tabActive = "people";
      console.log(this.$store.state.tabActive);
      this.$emit("fatherMethod");
    },
    getLceImg(index) {
      return (
        this.$store.state.apiConfiguration.fileUrl +
        this.lceData[index].categoryFile
      );
    },
    async getLceData() {
      this.lceData = await getPeopleInfoCer(this.addData.userId);
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = res.body.url;
      console.log(this.$store.apiConfiguration.fileUrl + this.imageUrl);
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
        this.addData.userCertificate = this.lceData;
        delete this.addData.deptName;
        delete this.addData.postName;
        delete this.addData.nickName;
        delete this.addData.createBy;
        delete this.addData.createTime;
        delete this.addData.userCertificate.createBy;
        delete this.addData.userCertificate.createTime;
        data = await getEditPeople(this.addData);

        this.dialogVisible = false;
        this.$notify({
          title: data ? "成功" : "失败",
          dangerouslyUseHTMLString: true,
          message: data ? data.message : "服务器开小差了，请稍后再试",
          type: data ? "success" : "warning"
        });
        this.$emit("fatherMethod");
      });
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
    change(val) {
      let nodesObj = this.$refs["cascader"].getCheckedNodes();
      console.log(nodesObj);
      // if(this.treeResDept[0].children.length==0){

      // }else if(this.treeResDept[0].children.length>0){
      // this.addData.postIds=this.treeArr[this.treeArr.length-1];
      //  this.addData.deptIds=this.treeArr[this.treeArr.length-2];
      //  }
      if (nodesObj[0].data.flag == 0) {
        delete this.addData.postId;
        this.addData.deptId = nodesObj[0].data.id;
      } else if (nodesObj[0].data.flag == 1) {
        this.treeArr = nodesObj[0].path;
        this.addData.postId = this.treeArr[this.treeArr.length - 1];
        this.addData.deptId = this.treeArr[this.treeArr.length - 2];
      }
    },
    //添加证书盒子
    addLce() {
      this.lceData.length++;
    },
    deleteLce(index) {
      this.addData.userCertificate.splice(index);
      this.lceData.splice(index);
    },
    //获取证书类别下拉列表
    async getLceSel() {
      let dictName = "certificate_category";
      this.lceRes = await getSelectLce(dictName);
      console.log("lceRes:", this.lceRes);
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
    },
    backPage() {
      this.$router.go(-1);
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
.area-tit span {
  font-size: 14px;
  text-align: right;
  float: right;
  padding-right: 15px;
  cursor: pointer;
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
  width: 300px;
  height: 300px;
  display: block;
}

.img-head {
  text-align: center;
  margin-top: 0px;
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
</style>
