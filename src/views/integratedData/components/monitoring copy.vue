<template>
  <div class="list_box_mo">
    <el-container>
      <el-aside width="350px">
        <div class="treeBox">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText"
            style="width: 100%; background-color: #ecf0f5"
          >
          </el-input>
          <el-tree
            class="filter-tree"
            :data="data"
            :props="defaultProps"
            :default-expand-all="false"
            :filter-node-method="filterNode"
            @node-click="treeNodeClick"
            ref="tree"
          >
          </el-tree>
        </div>
      </el-aside>
      <el-container>
        <el-header>
          <el-button
            v-for="list in list"
            :key="list.num"
            @click.prevent="setPlayerLength(list.num)"
            >{{ list.name }}</el-button
          >
          <span class="close">
            <img
              @click="fuanStatus"
              src="../../../../public/img/close1.png"
              alt=""
            />
          </span>
        </el-header>
        <el-main class="main_mo">
          <div class="video_box">
            <div
              class="video"
              v-for="(player, index) in players"
              @click="clickPlayer(player, index, $event)"
              :key="index"
              :class="{
                active: index == playerIdx,
                'col-sm-12': playerLength == 1,
                'col-sm-6': playerLength == 4,
                'col-sm-4': playerLength == 9,
                'col-sm-3': playerLength == 16,
              }"
            >
              <LivePlayer
                ref="videoPlayer"
                :videoUrl="player.url"
                :error="videoError"
                fluent
                autoplay
                live
                stretch
                :hideSnapshotButton="false"
                :hide-fullscreen-button="false"
              ></LivePlayer>
              <div class="video-close" v-on:click="closeVideo(index, true)">
                关闭
              </div>
            </div>
          </div>
          <div class="controlBox" v-if="show">
            <div
              class="arrowLeft"
              @mousedown.prevent="openYuntaiControl(2)"
              @mouseup.prevent="guanYuntaiControl(2)"
            >
              <el-button icon="el-icon-back" circle></el-button>
            </div>
            <div
              class="arrowUp"
              @mousedown.prevent="openYuntaiControl(0)"
              @mouseup.prevent="guanYuntaiControl(0)"
            >
              <el-button icon="el-icon-top" circle></el-button>
            </div>
            <div
              class="arrowRight"
              @mousedown.prevent="openYuntaiControl(3)"
              @mouseup.prevent="guanYuntaiControl(3)"
            >
              <el-button icon="el-icon-right" circle></el-button>
            </div>
            <div
              class="arrowDown"
              @mousedown.prevent="openYuntaiControl(1)"
              @mouseup.prevent="guanYuntaiControl(1)"
            >
              <el-button icon="el-icon-bottom" circle></el-button>
            </div>
            <div
              class="iconPlus"
              @mousedown.prevent="openYuntaiControl(8)"
              @mouseup.prevent="guanYuntaiControl(8)"
            >
              <el-button icon="el-icon-plus" circle></el-button>
            </div>
            <div
              class="iconMinus"
              @mousedown.prevent="openYuntaiControl(9)"
              @mouseup.prevent="guanYuntaiControl(9)"
            >
              <el-button icon="el-icon-minus" circle></el-button>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import LivePlayer from "@liveqing/liveplayer";
import { postData } from "./api";
export default {
  name: "devicePlayer",
  components: {
    LivePlayer,
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "deviceName",
      },
      accessTokenS: "", // 空字符串
      page: 1,
      count: 10,
      filterText: "",
      videoUrl: "",
      deviceSerial: "",
      show: "",
      players: [
        {
          url: "",
        },
      ],
      playerLength: 1,
      playerIdx: 0,
      device: "",
      channelId: "",
      deviceId: "",

      list: [
        {
          num: 1,
          name: "单屏",
        },
        {
          num: 4,
          name: "四分屏",
        },
        {
          num: 9,
          name: "九分屏",
        },
        {
          num: 16,
          name: "十六分屏",
        },
      ],
      data: [],
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  async mounted() {
    await this.token();

    this.$nextTick(() => {
      this.equipmentList();
    });
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    //关闭列表
    fuanStatus() {
      this.$emit("fuan", true);
    },

    async token() {
      let url = "https://open.ys7.com/api/lapp/token/get";
      let Pdata = {
        appKey: "72cfcec590fa45b2989fb6267e65a3d6",
        appSecret: "41bc7747bed41978ef7e964cc7fb7637",
      };
      const { status, data } = await postData(url, Pdata);
      if (status == 200) {
        console.log("200");
        this.accessTokenS = data.data.accessToken; //
      }
    },

    //获取设备列表
    async equipmentList() {
      let url = "https://open.ys7.com/api/lapp/device/list";
      let Pdata = {
        accessToken: this.accessTokenS,
      };
      const { status, data } = await postData(url, Pdata);
      let stat = {
        id: "",
        deviceName: "吉康项目部",
        children: [],
      };
      let stats = {
        id: "",
        deviceName: "宜遂项目部",
        children: [],
      };
      data.data.forEach((item, index) => {
        let deviceName = item.deviceName.split("-")[0];
        if (deviceName == "吉康") {
          stat.children.push(item);
          stat.id = index;
        }
        if (deviceName == "宜遂") {
          stats.children.push(item);
          stats.id = index;
        }
      });
      this.data.push(stat, stats);
      console.log(this.data, "ask等哈就看");
    },

    //开始云台控制
    async openYuntaiControl(number) {
      // this.guanYuntaiControl(number);
      let url = "https://open.ys7.com/api/lapp/device/ptz/start";
      let Pdata = {
        accessToken: this.accessTokenS,
        deviceSerial: this.deviceSerial,
        channelNo: 1,
        direction: number,
        speed: 1,
      };
      const { status, data } = await postData(url, Pdata);

      if (status == 200) {
        console.log(data.msg, "控制成功");
      }
    },
    //停止云台控制
    async guanYuntaiControl(number) {
      let url = "https://open.ys7.com/api/lapp/device/ptz/stop";
      let Pdata = {
        accessToken: this.accessTokenS,
        deviceSerial: this.deviceSerial,
        channelNo: 1,
        direction: number,
        speed: 1,
      };
      const { status, data } = await postData(url, Pdata);

      if (status == 200) {
        console.log(data.msg, "停止控制");
      }
    },

    //点击分屏

    clickPlayer(player, idx, event) {
      console.log(player, "分开", idx);
      this.playerIdx = idx;

      if (player.url != "") {
        var vars = player.url.split("?")[0];
        this.deviceSerial = vars.substring(vars.length - 8, vars.length - 17);
        this.show = true;
      }
    },
    clearVideos() {
      for (var idx in this.players) {
        this.closeVideo(idx);
      }
    },
    //点击分屏按钮
    setPlayerLength(playerNum) {
      this.show = false;
      if (playerNum == this.players.length) {
        return;
      }
      this.clearVideos();
      this.players = [];
      this.playerLength = playerNum;
      for (let index = 0; index < this.playerLength; index++) {
        this.players.push({
          url: "",
        });
      }
      this.deviceSerial = "";
      console.log(this.players, "阿萨斯就肯定会");
    },
    //关闭窗口
    closeVideo(idx) {
      let delet = {
        url: "",
      };
      this.players[idx] = delet;
    },
    //点击列表树
    async treeNodeClick(datas, node, c) {
      console.log(datas, node, c, "ashdashdjas");
      if (datas.deviceSerial == undefined) {
        return;
      }
      let url = "https://open.ys7.com/api/lapp/v2/live/address/get";
      let Pdata = {
        accessToken: this.accessTokenS,
        deviceSerial: datas.deviceSerial,
        protocol: 4,
      };
      const { status, data } = await postData(url, Pdata);

      this.closeVideo(this.playerIdx);
      this.players[this.playerIdx] = data.data;
      this.playerIdx++;

      console.log(this.players, "修改后的数组");
      if (this.players[0].url != "") {
        var vars = this.players[0].url.split("?")[0];
        this.deviceSerial = vars.substring(vars.length - 8, vars.length - 17);
      }

      this.$forceUpdate();
    },

    videoError: function (e) {
      console.log("播放器错误：" + JSON.stringify(e));
    },
  },
};
</script>

<style lang="scss" >
.list_box_mo {
  .close {
    float: right;
  }
  .treeBox {
    margin: 60px 10px 0;
    .filter-tree {
      margin-top: 20px;
      height: 744px;
      background-color: #ecf0f5;
    }
  }
  .main_mo {
    height: 850px;
    width: 100%;
    padding: 0;
    display: flex;
    .video_box {
      height: 800px;
      width: 1350px;
      display: -webkit-inline-box;
      display: -moz-inline-box;
      flex-wrap: wrap;
      .active {
        border: 1px solid red;
      }
      .video {
        height: 800px;
        width: 1350px;
        position: relative;
        &.col-sm-12 {
          margin: 4px;
          height: calc(800px / 1);
          width: calc(1310px / 1);
        }
        &.col-sm-6 {
          margin: 4px;
          height: calc(800px / 2);
          width: calc(1310px / 2);
        }
        &.col-sm-4 {
          margin: 4px;
          height: calc(800px / 3);
          width: calc(1310px / 3);
        }
        &.col-sm-3 {
          margin: 4px;
          height: calc(800px / 4);
          width: calc(1310px / 4);
        }

        .player-wrapper {
          height: 100%;
          width: 100%;
          .video-wrapper {
            padding-bottom: 0 !important;
            height: 100%;
          }
        }
        .video-close {
          position: absolute;
          top: 5px;
          right: 5px;
          color: white;
          font-size: 12px;
          background-color: fade(gray, 50%);
          padding: 2px 5px;
          cursor: pointer;
          border-radius: 2px;
          max-width: 120px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    .controlBox {
      width: 160px;
      height: 240px;
      font-size: 30px;
      position: relative;
      .arrowLeft {
        position: absolute;
        top: 60px;
        left: 0;
        .el-button {
          background-color: #fff !important;
          color: #000 !important;
        }
      }
      .arrowRight {
        position: absolute;
        top: 60px;
        right: 10px;
        .el-button {
          background-color: #fff !important;
          color: #000 !important;
        }
      }
      .arrowUp {
        position: absolute;
        top: 0;
        left: 60px;
        .el-button {
          background-color: #fff !important;
          color: #000 !important;
        }
      }
      .arrowDown {
        position: absolute;
        bottom: 80px;
        left: 60px;
        .el-button {
          background-color: #fff !important;
          color: #000 !important;
        }
      }
      .iconPlus {
        position: absolute;
        bottom: 0;
        left: 20px;
        .el-button {
          background-color: #fff !important;
          .el-icon-plus {
            color: #000 !important;
          }
        }
      }
      .iconMinus {
        position: absolute;
        bottom: 0;
        left: 110px;
        .el-button {
          background-color: #fff !important;
          .el-icon-minus {
            color: #000 !important;
          }
        }
      }
    }
  }
}
</style>