<template>
  <div class="navbar">
    <img :src="logo" class="logo" />
    <!--      <breadcrumb class="breadcrumb-container" /> -->
    <div class="companyName">{{ companyName }}</div>
    <!-- <hamburger
            :is-active="sidebar.opened"
            class="hamburger-container"
            @toggleClick="toggleSideBar"
        /> -->
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-container" style="margin-right: 50px">
          <span class="welcome">欢迎,{{ welcomeText }}</span>
          <img :src="userImge" class="user-avatar" />
        </div>
        <el-dropdown-menu
          slot="dropdown"
          class="user-dropdown"
          style="top: 4.0625rem"
        >
          <router-link to="/person">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="navbar-nav">
      <router-link target="_blank" :to="{ path: '/integratedData' }">
        <span>
          <i class="iconfont icon-shujukanban"></i>
          <em>看板</em>
        </span>
      </router-link>
      <!-- <router-link to="/">
                <span>
                    <i class="iconfont icon-shouye"></i>
                    <em>首页</em>
                </span>
            </router-link> -->
      <span>
        <server ref="child"> </server>
      </span>
      <!-- <span class="iconfont icon-UI_icon_shigu">
        <i></i>
        <em>预警</em>
      </span> -->
    </div>
  </div>
</template>

<script>
//用户信息
import { mapGetters } from "vuex";
import store from "@/store/index.js";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import userImg from "../../../public/img/userImg.gif";
import logoImg from "@/assets/logo-100.png";
import server from "./message";
export default {
  data() {
    return {
      welcomeText: store.getters.userName,
      logo: logoImg,
      companyName: "安全生产管理信息化平台",
    };
  },
  components: {
    Breadcrumb,
    Hamburger,
    server,
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
    userImge: function () {
      if (
        store.state.user.user.avatar == "" ||
        store.state.user.user.avatar === undefined
      ) {
        return userImg;
      } else {
        return (
          store.state.apiConfiguration.fileUrl +
          "/" +
          store.state.user.user.avatar
        );
      }
    },
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      sessionStorage.removeItem("papertype");
      localStorage.removeItem("flowData");
      sessionStorage.removeItem("addTask");
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
      this.$refs.child.PopupMessage(); //调用消息子组件的方法
    },
    personInfo() {
      this.$router.push({
        path: "/person",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 80px;
  overflow: hidden;
  position: fixed;
  background: #004c86;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 1002;
  width: 100%;
  transition: width 0.2s linear 0.2s;
  -webkit-transition: width 0.2s linear 0.2s;
  .hamburger-container {
    line-height: 80px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
    height: 80px;
    line-height: 80px;
    font-size: 18px;
    color: #ffffff;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 80px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.welcome {
  color: #ffffff;
  font-size: 14px;
  height: 80px;
  line-height: 80px;
  display: inline-block;
}

.navbar-nav {
  float: right;
  margin-right: 23px;
}

.navbar-nav em {
  font-style: normal;
  display: inline-block;
  height: 80px;
  line-height: 80px;
  color: #ffffff;
  font-size: 14px;
  margin-top: -9px;
  position: relative;
  top: -5px;
}

.logo {
  float: left;
  margin-top: 18px;
  margin: 18px 13px 0px 40px;
  width: 40px;
}

.companyName {
  display: inline-block;
  color: #ffffff;
  font-size: 18px;
  line-height: 80px;
  float: left;
}

.navbar-nav span {
  height: 80px;
  line-height: 80px;
  display: inline-block;
  margin-right: 12px;
  cursor: pointer;
}
</style>
