<template>
  <el-form :model="user" :rules="formRules" ref="operationFome" label-width="120px" label-position="left" class="info-ruleForm">


    <el-form-item label="用户昵称" prop="nickName">
      <el-col :span="12">
        <el-input v-model="user.nickName" maxlength="30" show-word-limit placeholder="用户昵称" />
      </el-col>
    </el-form-item>
    <el-form-item label="手机号码" prop="phonenumber">
      <el-col :span="12">
        <el-input v-model="user.phonenumber" maxlength="11" show-word-limit placeholder="手机号码" />
      </el-col>
    </el-form-item>
    <el-form-item label="用户邮箱" prop="email">
      <el-col :span="12">
        <el-input v-model="user.email" maxlength="30" show-word-limit placeholder="用户邮箱" />
      </el-col>
    </el-form-item>
    <el-form-item label="用户真实姓名" prop="realName">
      <el-col :span="12">
        <el-input v-model="user.realName" maxlength="30" show-word-limit placeholder="用户真实姓名" />
      </el-col>
    </el-form-item>
    <el-form-item label="用户性别" prop="gender">
      <el-select v-model="user.gender" placeholder="用户性别">
        <el-option label="男" value="0"></el-option>
        <el-option label="女" value="1"></el-option>
      </el-select>
    </el-form-item>
<!--    <el-form-item label="身份类型" prop="cardType">
      <el-select v-model="user.cardType" placeholder="身份类型">
        <el-option label="请选择" value=""></el-option>
        <el-option label="身份证" value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="身份ID" prop="cardId">
      <el-col :span="12">
        <el-input v-model="user.cardId" :disabled="user.cardType != 1" maxlength="30" show-word-limit placeholder="身份ID" />
      </el-col>
    </el-form-item> -->
     <el-form-item label="上传头像">
          <el-upload class="avatar-uploader"
            :action="getUrl"
            :headers="geHeaders"
            :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="user.avatar" :src="getUserImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
    <el-form-item label="备注">
      <el-col :span="12">
        <el-input v-model="user.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="用户描述" />
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-button class="chaxun" @click="updataInfo">保存</el-button>
      <el-button class="chongzhi" @click="resetForm('operationFome')">重置</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
  import {
    getProfilr,
    updateProfilr
  } from '@/api/system/uesrinfo.js'

  import store from '@/store/index.js'
  import { getToken } from '@/utils/auth'

  import {
    isMaill,
    isID,
    isPhone
  } from '@/utils/validate.js'
  export default {
    name: 'info',
    data() {
      return {
        user: {
          userId: '',
          nickName: '',
          realName: '',
          userBirth: '',
          gender: '0',
          password: '',
          phonenumber: '',
          email: '',
          cardType: '',
          cardId: '',
          status: '0',
          avatar: '',
          remark: ''
        },
        formRules: {
          email: [{
            required: true,
            trigger: 'blur',
            message: '请输入正确的邮箱号码',
            validator: (rule, value, callback) => {
              if (value == null || value == undefined || value == '') {
                callback(new Error('请输入正确的邮箱号码'))
              } else {
                if (!isMaill(value)) {
                  callback(new Error('电话格式不正确'))
                } else {
                  callback()
                }
              }
            }
          }],
          phonenumber: [{
            required: true,
            trigger: 'blur',
            message: '请输入正确的电话号码',
            validator: (rule, value, callback) => {
              if (value == null || value == undefined || value == '') {
                callback(new Error('请输入正确的电话号码'))
              } else {
                if (!isPhone(value)) {
                  callback(new Error('邮箱格式不正确'))
                } else {
                  callback()
                }
              }
            }
          }],
          cardId: [{
            required: false,
            trigger: 'blur',
            message: '请输入正确的身份证号码',
            validator: (rule, value, callback) => {
              if(this.user.cardType != 1){
                callback()
              }
              if (value == null || value == undefined || value == '') {
                callback(new Error('请输入正确的身份证号码'))
              } else {
                if (!isID(value)) {
                  callback(new Error('身份证号码格式不正确'))
                } else {
                  callback()
                }
              }
            }
          }],
          userName: [{
            required: true,
            message: '请输入用户账号',
            trigger: 'blur'
          }],
          nickName: [{
            required: true,
            message: '请输入用户昵称',
            trigger: 'blur'
          }],
          roleIds: [{
            required: true,
            message: '请至少选择一个角色',
            trigger: 'click'
          }],
          password: [{
            required: true,
            message: '请输入用户密码',
            trigger: 'click'
          }]
        }
      };
    },
    computed: {
      getUrl(){
          return store.state.apiConfiguration.url + store.state.serviceName.userProfileAvatar + '/user/profile/avatar';
      },
      geHeaders(){
        return {'Authorization':getToken()}
      },
      getUserImg(){
        return store.state.apiConfiguration.fileUrl + this.user.avatar
      }
    },
    methods: {
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleAvatarSuccess(res, file) {
        this.user.avatar = res.body;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      async getInfo() {
        let ref = await getProfilr();
        this.user = ref.user
      },
      async updataInfo() {

        this.$refs.operationFome.validate(async valid => {
          if (!valid) {
            this.$notify({
              title: '操作失败',
              dangerouslyUseHTMLString: true,
              message: '请填写完整',
              type: 'warning'
            })
            return
          }
          let data = null;
          data = await updateProfilr(this.user);
          this.$notify({
            title: data ? '成功' : '失败',
            dangerouslyUseHTMLString: true,
            message: data ? data.message : '服务器开小差了，请稍后再试',
            type: data ? 'success' : 'warning'
          })
          this.getInfo()
        })
      },

    },
    created: function() {
      this.getInfo()
    }
  }
</script>
<style lang="scss">
  .info-ruleForm {
    margin-top: 50px;
    margin-left: 50px;
  }

  $input_wide:100%;

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9 !important;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
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
