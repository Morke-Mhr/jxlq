<template>
  <div class="app_container">
    <el-dropdown>
      <span class="iconfont icon-xiaoxi">
        <div style="z-index: 9999" v-if="sum != ''">
          {{ sum > 99 ? "99+" : sum }}
        </div>
        <span class="el-dropdown-link">消息</span>
        <el-dropdown-menu class="dropdown">
          <div
            style="background-color: #f4f1f2; line-height: 24px; padding: 5px"
            v-if="sum != ''"
          >
            <span class="type" style="font-size: 13px; margin-right: 40px"
              >消息类型</span
            >
            <span class="number" style="font-size: 13px">数量</span>
          </div>
          <div
            v-else
            style="
              background-color: #f4f1f2;
              line-height: 24px;
              padding: 8px 20px;
            "
          >
            <span class="number" style="font-size: 13px">暂无消息</span>
          </div>
          <el-dropdown-item
            style="padding: 0 5px"
            v-for="item in cities"
            :key="item.typeCode"
          >
            <div @click="jump(item.typeCode)" v-if="item.msgCount != '0'">
              <span style="font-size: 13px">
                {{ item.type }}
              </span>
              <span
                style="
                  font-size: 13px;
                  float: right;
                  margin-right: 10px;
                  color: #66b1ff;
                "
              >
                {{ item.msgCount }}
              </span>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </span>
    </el-dropdown>
  </div>
</template>

<script>
// import { messageRead } from "@/api/login/messageRead";

import { mapState } from "vuex";
import axios from "axios";
import { getToken } from "@/utils/auth";

export default {
  name: "online",
  data() {
    return {
      cities: [],
      sum: "",
      path: `ws://${
        this.$store.state.apiConfiguration.messageUrl +
        this.$store.state.serviceName.message
      }/websocket/${this.$store.state.user.user.userId}`,
      token: getToken(),
      resDataMeg: "",
      WebSocket: "",
      ws: "",
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user.user,
    }),
  },
  mounted() {
    //断开连接
    window.addEventListener("beforeunload", (e) => this.websocketclose());
  },
  created() {
    this.AllMsg();
    this.ws = new WebSocket(this.path); //
    this.initWebSocket();
  },
  // destroyed() {
  //   console.log("我已经离开了！");
  //   this.PopupMessage();
  // },
  methods: {
    //获取消息列表
    AllMsg() {
      axios({
        method: "get",
        url:
          this.$store.state.apiConfiguration.url +
          this.$store.state.serviceName.message +
          `/sysmessage/getMyAllMsg/${0}`,
        responseType: "json", // 表明返回服务器返回的数据类型
        headers: {
          "Content-Type": "application/json",
          Authorization: this.token,
        },
        data: {
          //接口参数
        },
      }).then((res) => {
        this.cities = res.data.body;
        let arrSum = this.cities.map((item) => {
          return Number(item.msgCount);
        });
        this.sum = arrSum.reduce((n, m) => n + m);
      });
    },

    initWebSocket() {
      //初始化weosocket
      this.ws.onopen = this.websocketonopen;
      this.ws.onerror = this.websocketonerror;
      this.ws.onmessage = this.websocketonmessage;
      this.ws.onclose = this.websocketclose;
    },
    // 点击
    async jump(e) {
      axios({
        method: "get",
        url:
          this.$store.state.apiConfiguration.url +
          this.$store.state.serviceName.message +
          `/sysmessage/checkMsg?msgTpeCode=${e}`,
        responseType: "json", // 表明返回服务器返回的数据类型
        headers: {
          "Content-Type": "application/json",
          Authorization: this.token,
        },
      }).then((res) => {
        if (res.data.code == 200) {
          this.AllMsg(); //请求后刷新接口
        }
      });
      switch (e) {
        case "msg-schedule": //日程
          this.$router.push({ path: "/task/handle" });
          break;
        case "msg-taskurge": //催办
          this.$router.push({ path: "/task/handle" });
          break;
        case "msg-check-task": //完成任务验收
          this.$router.push({ path: "/task/acceptanceCheck" });
          break;
        case "msg-cc-task": //抄送给我的
          this.$router.push({ path: "/task/coordination" });
          break;
        case "msg-assist-task": //协同给我的
          this.$router.push({ path: "/task/coordination" });
          break;
        case "msg-totask": //待办任务
          this.$router.push({ path: "/task/handle" });
          break;
        case "msg-back-task": //退回整改任务
          this.$router.push({ path: "/task/handle" });
          break;
        case "msg-taskovertime": //任务超期
          this.$router.push({ path: "/task/handle" });
          break;
        case "msg-apply": //我的审批
          this.$router.push({ path: "/task/task1" });
          break;
        case "msg-meeting": //会议通知
          this.$router.push({ path: "/safetyEdu/classTrain" });
          break;
        case "msg-safetrain": //安全培训
          this.$router.push({ path: "/safetyEdu/study" });
          break;
        case "msg-exam": //安全考试
          this.$router.push({ path: "/examination/myExam" });
          break;
        case "msg-safejiaodi": //安全技术交底
          this.$router.push({ path: "/technology/confide" });
          break;
        case "msg-safecheck": //安全检查
          this.$router.push({ path: "/security/safetyRecord" });
          break;
        case "msg-alertinfo": //告警信息
          this.$router.push({ path: "/monitor/server" });
          break;
        case "msg-announcement": //通知公告
          this.$router.push({ path: "/notification" });
          break;
        case "msg-hiddendanger-fenpei": //隐患待分配
          this.$router.push({ path: "/security/yhDistribution" });
          break;
        case "msg-hiddendanger-sign": //隐患待签收
          this.$router.push({ path: "/security/yhSign" });
          break;
        case "msg-hiddendanger-deal": //隐患整改
          this.$router.push({ path: "/security/yhAbarbeitung" });
          break;
        case "msg-mtype-apply-days": //待审批每天提醒
          this.$router.push({ path: "/task/task1" });
          break;
        case "msg-other": //其他消息提醒
          location.reload();
          break;
        case "msg-system": //系统消息
          location.reload();
          break;
      }
    },
    websocketonopen() {
      //连接建立之后执行send方法发送数据
      console.log("连接成功");
    },
    websocketonerror() {
      //连接建立失败重连
      console.log("连接失败");
    },
    websocketonmessage(e) {
      let data = JSON.parse(e.data);
      //数据接收
      this.$notify({
        title: data.type,
        dangerouslyUseHTMLString: true,
        message: data.title,
        type: "success",
        position: "bottom-right",
      });
      // debugger
      this.cities.find((item) => {
        if (item.typeCode === data.typeCode && "msg-system" !== data.typeCode) {
          item.msgCount++;
          this.sum++;
          let i = 0;
        }
      });
    },
    websocketsend(Data) {
      //数据发送
      websock.send(Data);
    },
    PopupMessage() {
      axios({
        method: "get",
        url:
          this.$store.state.apiConfiguration.url +
          this.$store.state.serviceName.message +
          `/sysmessage/stopWebSocket`,
        responseType: "json", // 表明返回服务器返回的数据类型
        headers: {
          "Content-Type": "application/json",
          Authorization: this.token,
        },
      }).then((res) => {});
    },
    websocketclose() {
      //关闭
      this.ws.close();
      console.log("WebSocket连接已关闭");
    },
    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    windowonbeforeunload() {
      WebSocket.close();
      console.log("断开连接");
    },
  },
};
</script>

<style >
.app_container {
  display: inline-block;
  padding: 0;
}
.app_container .iconfont span {
  font-size: 14px;
  font-style: normal;
  position: relative;
  color: #fff;
  top: -5px;
}
.app_container .iconfont .dropdown .top_t {
  font-size: 12px !important;
}
.app_container .iconfont {
  position: relative;
}
.app_container .iconfont div {
  text-align: center;
  line-height: 23px;
  width: 23px;
  height: 23px;
  border-radius: 50%;
  background-color: red;
  color: #fff;
  font-style: normal;
  font-size: 12px;
  position: absolute;
  top: -11px;
  left: 12px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.el-dropdown-menu {
  top: 46px !important;
  padding: 8px 0px;
}
.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
