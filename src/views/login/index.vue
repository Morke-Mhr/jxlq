<template>
  <div style="width: 100%; height: 100%">
    <div v-if="cut == false">
      <modification @func="getMsgFormSon" @fallback="switcHover"></modification>
    </div>
    <div v-if="cut == true" class="login-container">
      <vue-particles
        :particleOpacity="0.7"
        :particlesNumber="40"
        shapeType="circle"
        :particleSize="5"
        linesColor="#dad7d7"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="2"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
        class="home_egg_particles"
      ></vue-particles>
      <div class="login_imgbox">
        <div class="login_img">
          <img :src="imgUrl_tow" alt />
        </div>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form login_panel"
          auto-complete="on"
          label-position="left"
          v-if="flag == true"
        >
          <el-form-item prop="username" class="bottom_line">
            <img :src="imgUrl_three" alt />
            <el-input
              ref="username"
              v-model="loginForm.username"
              maxlength="30"
              placeholder="用户名"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" class="bottom_line">
            <img :src="imgUrl_four" alt />
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="密码"
              name="password"
              tabindex="2"
              auto-complete="on"
              maxlength="30"
              @keyup.enter.native="handleLogin"
            ></el-input>
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </el-form-item>
          <div style="padding-top: 24px">
            <span class="register" @click="register">
              {{ flag == true ? "验证码登录" : "密码登录" }}
            </span>
            <span class="forget-pwd" @click="switcHover">忘记密码</span>
          </div>
          <el-button
            :loading="loading"
            type="primary"
            style="height: 45px!important; width: 250px"
            @click.native.prevent="login"
            >登录</el-button
          >
        </el-form>
        <!-- 验证码登录 -->
        <el-form
          ref="phoneForm"
          :model="phoneForm"
          :rules="phoneRules"
          class="login-form login_panel"
          auto-complete="on"
          label-position="left"
          v-if="flag == false"
        >
          <el-form-item prop="phonenumber" class="bottom_line">
            <img :src="imgUrl_three" alt />
            <el-input
              v-model="phoneForm.phonenumber"
              maxlength="11"
              oninput="value=value.replace(/[^\d]/g,'')"
              show-word-limit
              placeholder="手机号码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="phoneCode" class="bottom_line">
            <img :src="imgUrl_four" alt />
            <el-input
              v-model="phoneForm.phoneCode"
              maxlength="6"
              placeholder="短信验证码"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
            ></el-input>
            <span class="show-code" @click="getCode">
              {{ show == true ? "获取验证码" : count + "s" }}
            </span>
          </el-form-item>
          <div style="padding-top: 24px">
            <span class="register" @click="register">
              {{ flag == true ? "验证码登录" : "密码登录" }}
            </span>
            <span class="forget-pwd" @click="switcHover">忘记密码</span>
          </div>
          <el-button
            :loading="loading"
            type="primary"
             style="height: 45px!important; width: 250px"
            @click.native.prevent="phoneLogin"
            >登录</el-button
          >
        </el-form>

        <div class="copyright">江西省公路桥梁工程有限公司 Copyright</div>
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import { setToken, setUserId } from "@/utils/auth";
import { getCode, phoneLogin, phoneSendsms } from "@/api/login/login";
import modification from "./modification";
export default {
  name: "Login",
  components: {
    modification,
  },
  data() {
    //用户名
    const validateUsername = (rule, value, callback) => {
      if (value == null || value == undefined || value == "") {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    //密码
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("验证码不能少于6位"));
      } else {
        callback();
      }
    };
    //图片验证码
    const validateCode = (rule, value, callback) => {
      if (value == null || value == undefined || value == "") {
        callback(new Error("请输入正确的验证码"));
      } else {
        callback();
      }
    };
    //手机号
    const validatePhone = (rule, value, callback) => {
      if (value == null || value == undefined || value == "") {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    //验证码
    const validatePhoneUuid = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能少于6位"));
      } else {
        callback();
      }
    };

    return {
      imgUrl_tow: require("../../../public/img/login-pic.png"),
      imgUrl_three: require("../../../public/img/login_03.png"),
      imgUrl_four: require("../../../public/img/login_04.png"),
      loginForm: {
        username: "",
        password: "",
        code: "",
        uuid: "",
        loginType: "pc",
      },
      phoneForm: {
        phonenumber: "", //手机号码
        phoneCode: "", //手机验证码
        imageCode: "", //图片验证码
        imageUuid: "", //对应手机验证码唯一标识解释：发送短信验证返回获得。
        loginType: "pc", //登录类型|pc 电脑端  mobile 移动端
      },

      flag: true,
      show: true,
      count: "",
      cut: true,
      timer: null,
      //用户登录表单验证方法
      loginRules: {
        username: [
          {
            required: true,
            trigger: "blur",
            validator: validateUsername,
          },
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            validator: validatePhoneUuid,
          },
        ],
        code: [
          {
            required: true,
            trigger: "blur",
            validator: validateCode,
          },
        ],
      },
      //手机验证码表单验证方法
      phoneRules: {
        phonenumber: [
          {
            required: true,
            trigger: "blur",
            validator: validatePhone,
          },
        ],
        phoneCode: [
          {
            required: true,
            trigger: "blur",
            validator: validatePassword,
          },
        ],
        code: [
          {
            required: true,
            trigger: "blur",
            validator: validateCode,
          },
        ],
      },

      loading: false,
      passwordType: "password",
      redirect: undefined,
      codeImg: "",
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created: function () {
    // this.getVerificationCode();
  },
  methods: {
    async getCode() {
      if (this.phoneForm.phonenumber != "") {
        let data = null;
        try {
          let phoneValue = {
            phonenumber: this.phoneForm.phonenumber,
          };
          data = await phoneSendsms(phoneValue); //验证码接口
        } catch (e) {
          console.error("接口异常");
        }
        // debugger
        this.$notify({
          title: data.data.code == 200 ? "验证码已发送" : "验证码发送失败",
          dangerouslyUseHTMLString: true,
          message: data.data.body,
          type: data.data.code == 200 ? "success" : "warning",
        });
        if (data.data.code == 200) {
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
      } else {
        this.$notify({
          title: "操作失败",
          dangerouslyUseHTMLString: true,
          message: "请填写正确的手机号",
          type: "warning",
        });
        return;
      }
    },
    //手机号码登录
    phoneLogin() {
      this.$refs.phoneForm.validate((valid) => {
        this.loading = true;
        if (!valid) {
          this.$notify({
            title: "操作失败",
            dangerouslyUseHTMLString: true,
            message: "请填写完整",
            type: "warning",
          });
          this.loading = false;
          return;
        }
        let this_ = this;
        this.$store
          .dispatch("user/logoin", this.phoneForm)
          .then(() => {
            this_.loading = false;
            this_.$router.push({ path: "/" });
          })
          .catch(function (error) {
            this_.loading = false;
            console.error("登录失败");
          });
      });
    },

    //验证码登录
    register() {
      this.flag = !this.flag;
    },
    //忘记密码
    switcHover() {
      this.cut = !this.cut;
    },
    //完成后回调
    getMsgFormSon() {
      this.cut = true;
    },

    //用户名登录
    login() {
      this.$refs.loginForm.validate((valid) => {
        this.loading = true;
        if (!valid) {
          this.$notify({
            title: "操作失败",
            dangerouslyUseHTMLString: true,
            message: "请填写完整",
            type: "warning",
          });
          this.loading = false;
          return;
        }
        let this_ = this;
        this.$store
          .dispatch("user/logoin", this.loginForm)
          .then(() => {
            this_.loading = false;
            this_.$router.push({ path: "/" });
          })
          .catch(function (error) {
            this_.loading = false;
            console.error("登录失败");
          });
      });
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
@import "@/styles/mixin.scss";

$bg: #fff;
$cursor: #fff;
$dark_gray: #889aa4;
$light_gray: #484647;
$font_color: #484647;
$login_panel: rgba(255, 255, 255, 1);

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .verification-code {
    width: 100%;
    height: 53px;
    cursor: pointer;
  }
  .flat-angle {
    div {
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
    }
  }
  .el-input {
    display: inline-block;
    height: 53px;
    width: 80%;
    border: 0px solid #666 !important;

    input {
      margin-left: 0.7rem;
      border: 0px solid #666 !important;
      background-color: $login_panel !important;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      // padding: 12px 5px 12px 15px;
      padding-left: 10px;
      color: $light_gray;
      height: 47px;
      caret-color: $font_color;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $login_panel inset !important;
        -webkit-text-fill-color: $font_color !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    margin-bottom: 10px;
  }
  .el-form-item:first-child {
    margin-bottom: 50px !important;
  }
}
.login-container {
  min-height: 100%;
  width: 100%;
  height: 100%;
  background-color: #283443;
  background-image: url(../../../public/img/login.jpg);
  background-attachment: fixed;

  background-repeat: no-repeat;

  background-size: cover;
  overflow: hidden;

  @include respond-to("xs") {
    background-image: initial;
    background-color: #ffffff;
  }
  .login_imgbox {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .login_img {
      width: 550px;
      height: 465px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .login-form {
      height: 465px;
      padding: 3% 3%;
      position: relative;
      .forget-pwd {
        float: right;
        font-size: 14px;
        color: #1e90ff;
        cursor: pointer;
      }
      .register {
        float: left;
        font-size: 14px;
        color: #fff;
        padding: 4px 10px;
        border-radius: 5px;
        background-color: #b22222;
        cursor: pointer;
        z-index: 99;
      }
      .el-button {
        border-radius: 40px;
        width: 100%;
        margin-top: 100px;
        margin-bottom: 30px;
      }
      .bottom_line {
        display: flex;
        align-items: center;
        width: 250px;
        img {
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  .home_egg_particles {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0rem;
    bottom: 0rem;
    z-index: 0;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    .title2 {
      font-size: 28px;
      color: #333;
      margin: 0px auto 20px auto;
      text-align: left;
      font-weight: bold;
    }
    .title {
      font-size: 18px;
      color: $font_color;
      margin: 0px auto 30px auto;
      text-align: left;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .show-code {
    position: absolute;
    right: -10px;
    padding: 0 10px;
    top: 7px;
    font-size: 14px;
    color: #1e90ff;
    cursor: pointer;
    user-select: none;
  }
  .login_panel {
    background-color: $login_panel;
  }
  .bottom_line {
    color: $font_color;
    background-color: $login_panel;
    border-radius: 0px !important;
    border: 0px solid #666 !important;
    border-bottom: 1px solid #ebebeb !important;
  }
  .el-input__icon {
    font-size: 1.25rem;
    color: #484647;
  }
  .copyright {
    position: absolute;
    bottom: 30px;
    left: 50%;
    color: #ffffff;
    transform: translate(-50%, -50%);

    @include respond-to("xs") {
      left: 0%;
      color: #666666;
      transform: translate(0%, 0%);
      width: 100%;
      text-align: center;
      font-size: 0.5rem;
      margin: 0 auto;
    }
  }
}
</style>
