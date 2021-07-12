<template>
  <div class="app">
    <el-container>
      <el-header class="header">
        <div class="left">
          <img :src="logo" class="logo" @click="bounce" />
          <h3 @click="bounce">江西路桥安全生产管理信息化平台</h3>
        </div>
        <div class="right">
          <span class="text" @click="bounce">欢迎，请登录</span>
          <span class="icon"><i class="el-icon-user-solid"></i></span>
        </div>
      </el-header>
      <el-main class="el_main">
        <div class="Main">
          <span class="text">{{ text }}</span>
          <div class="Main_content" v-if="flag == '1'">
            <div class="Main_box">
              <img :src="webImg" alt="" />
              <span>请先填写您的登录手机号码</span><br />
              <el-input
                class="el_input"
                placeholder="请输入手机号"
                v-model="phoneValue"
                clearable
                style="width: 300px"
                maxlength="11"
                @blur="animate()"
              >
              </el-input
              ><br />
              <div class="button-box">
                <el-button
                  type="primary"
                  class="el_button2 el_buttonF"
                  @click="fallback"
                  >返回</el-button
                >
                <el-button
                  type="primary"
                  class="el_button2 el_buttonF"
                  @click="nextVerify"
                  >下一步</el-button
                >
              </div>
            </div>
          </div>
          <div class="Main_content" v-if="flag == '2'">
            <div class="Main_box">
              <img :src="webImg" alt="" />
              <span>正在用{{ phone }}手机号进行验</span><br />
              <el-input
                class="el_input"
                placeholder="6位数验证码"
                v-model="authCode"
                maxlength="6"
                clearable
                style="width: 185px"
              >
              </el-input>
              <el-button type="primary" class="el_button1" @click="getCode">
                {{
                  show == true ? "发送验证码" : count + "s" + "后重新发送"
                }}</el-button
              >
              <br />
              <el-button type="primary" class="el_button2" @click="nextPass"
                >下一步</el-button
              >
            </div>
          </div>
          <div class="Main_content" v-if="flag == '3'">
            <div class="Main_box">
              <img :src="webImg" alt="" />
              <span>请重新设置账号密码</span><br />
              <el-form
                :model="ruleForm"
                status-icon
                :rules="rules"
                ref="ruleForm"
                label-width="80px"
                style="margin-top: 14px"
                class="demo-ruleForm"
              >
                <el-form-item
                  label="新密码"
                  prop="newPassword"
                  style="margin-left: -70px"
                >
                  <el-input
                    type="password"
                    v-model="ruleForm.newPassword"
                    autocomplete="off"
                    show-password
                    maxlength="20"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="确认密码"
                  prop="ckPassword"
                  style="margin-left: -70px"
                >
                  <el-input
                    type="password"
                    v-model="ruleForm.ckPassword"
                    autocomplete="off"
                    show-password
                    maxlength="20"
                  ></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" class="el_button2" @click="accomplish"
                  >完成</el-button
                >
              </span>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import logoImg from "@/assets/logo.png";
import { isPhone } from "@/utils/validate.js";
import {
  getCode,
  phoneLogin,
  phoneSendsms,
  queryPhone,
  PwdPhone,
  checkPwdPhone,
} from "@/api/login/login";

export default {
  components: {},
  data() {
    var validatePass3 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.ckPassword !== "") {
          this.$refs.ruleForm.validateField("ckPassword");
        }
        callback();
      }
    };
    var validatePass4 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      webImg: require("../../../public/img/web.png"),
      logo: logoImg,
      phoneValue: "", //手机号
      authCode: "", //验证码
      phone: "",
      show: true,
      timer: null,
      count: "",
      flag: "1",
      text: "验证手机号码",
      obtainedPass: false, //是否发送了验证码
      ruleForm: {
        newPassword: "",
        phonenumber: "",
        ckPassword: "",
      },
      //密码表单验证
      rules: {
        newPassword: [
          { required: true, validator: validatePass3, trigger: "blur" },
        ],
        ckPassword: [
          { required: true, validator: validatePass4, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //验证手机号码是否正确
    animate() {
      if (!isPhone(this.phoneValue)) {
        this.$notify({
          title: "操作失败",
          dangerouslyUseHTMLString: true,
          message: "请填写正确的手机号",
          type: "warning",
        });
        return;
      }
    },
    //跳转到下一步获取验证码
    async nextVerify() {
      if (!isPhone(this.phoneValue)) {
        this.$notify({
          title: "操作失败",
          dangerouslyUseHTMLString: true,
          message: "请填写正确的手机号",
          type: "warning",
        });
        return;
      }
      let result = await queryPhone(this.phoneValue);
      if (result.data.code == 200) {
        let data = this.phoneValue;
        let start = data.slice(0, 3);
        let end = data.slice(-4);
        this.phone = `${start}****${end}`;
        this.flag = "2";
        this.text = "手机验证";
      }
      this.$notify({
        title: result.data.code == 200 ? "验证成功" : "验证失败",
        dangerouslyUseHTMLString: true,
        message: result.data.code != 200 ? result.data.body : "",
        type: result.data.code == 200 ? "success" : "warning",
      });
    },

    //发送验证码后倒计时
    async getCode() {
      if (this.phoneValue != "") {
        let data = null;
        try {
          let phoneValue = {
            phonenumber: this.phoneValue,
          };

          data = await phoneSendsms(phoneValue); //验证码接口
          if (data.data.code == 200) {
            this.obtainedPass = true;
          }
        } catch (e) {
          console.error("接口异常");
        }
        this.$notify({
          title: data.data.code == 200 ? "已发送" : "发送失败",
          dangerouslyUseHTMLString: true,
          message: data.data.code != 200 ? data.data.body : "验证码已发送",
          type: data.data.code == 200 ? "success" : "warning",
        });
        const TIME_COUNT = 60;
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.show = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.show = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000);
        }
      }
    },
    //返回首页
    fallback() {
      this.$emit("fallback");
    },
    //跳转到下一步修改密码
    async nextPass() {
      if (this.obtainedPass == false) {
        this.$notify({
          title: "操作失败",
          dangerouslyUseHTMLString: true,
          message: "请先获取验证码",
          type: "warning",
        });
        return;
      }
      if (this.authCode == "" || this.authCode.length != 6) {
        this.$notify({
          title: "操作失败",
          dangerouslyUseHTMLString: true,
          message: "请填写正确验证码",
          type: "warning",
        });
      } else {
        let phoneValue = {
          phonenumber: this.phoneValue,
          code: this.authCode,
        };
        let result = await checkPwdPhone(phoneValue); //验证码接口
        if (result.data.code == 200) {
          this.flag = "3";
          this.text = "找回密码";
        }
        this.$notify({
          title: result.data.code == 200 ? "验证成功" : "验证失败",
          dangerouslyUseHTMLString: true,
          message: result.data.code != 200 ? result.data.body : "",
          type: result.data.code == 200 ? "success" : "warning",
        });

        // else {
        //   this.$notify({
        //     title: "操作失败",
        //     dangerouslyUseHTMLString: true,
        //     message: "验证码错误",
        //     type: "warning",
        //   });
        // }
      }
    },
    //完成修改密码
    accomplish() {
      this.$refs.ruleForm.validate(async (valid) => {
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
        this.ruleForm.phonenumber = this.phoneValue;
        delete this.ruleForm.ckPassword;
        data = await PwdPhone(this.ruleForm);
        this.$notify({
          title: data.data.code == 200 ? "密码修改成功" : "密码修改失败",
          dangerouslyUseHTMLString: true,
          message: data.data.code != 200 ? data.data.body : " ",
          type: data.data.code == 200 ? "success" : "warning",
        });
        if (data.data.code == 200) {
          this.$emit("func");
        }
      });
    },
    //返回登录
    bounce() {
      this.$emit("func");
    },
  },
};
</script>
<style lang='scss' scoped>
.app {
  .header {
    height: 80px !important;
    background-color: #0d74d7;
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    .left {
      display: inline-block;
      .logo {
        float: left;
        margin-top: 18px;
        margin: 18px 13px 0px 37px;
        width: 40px;
      }
      h3 {
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 40px;
        display: inline-block;
      }
    }
    .right {
      display: flex;
      align-items: center;
      .text {
        line-height: 80px;
      }
      .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #d8d8d8;
        margin-left: 10px;
        i {
          color: #333333;
          font-size: 20px;
        }
      }
    }
  }
  .el_main {
    height: 900px;
    width: 100%;
    background: #f2f2f2;
    .Main {
      padding: 10px;
      height: 800px;
      background: #ffffff;
      .text {
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 25px;
      }
      .Main_content {
        text-align: center;
        margin-top: 85px;
        .Main_box {
          text-align: left;
          margin: 0 auto;
          width: 300px;
          .button-box {
            display: flex;
            justify-content: space-between;
            .el_buttonF {
              width: 140px !important;
            }
          }
          .el-input>.el-input__inner {
            width: 185px !important;
          }
          .el_input {
            margin: 14px 0 40px 0;
          }
          .el_button1 {
            width: 110px;
            background-color: #5583fe;
            // padding: 12px 9px;
          }
          .el_button2 {
            width: 300px;
            background-color: #5583fe;
          }
          img {
            width: 16px;
            height: 16px;
            margin-bottom: -3px;
          }
          span {
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            line-height: 20px;
          }
        }
      }
    }
  }
}
//@import url(); 引入公共css类
</style>