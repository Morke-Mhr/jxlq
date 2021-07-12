
<template>
  <!-- 摄像头初稿样品 -->
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
              @mousedown.prevent="openYuntaiControl(3)"
              @mouseup.prevent="openYuntaiControl(0)"
            >
              <el-button icon="el-icon-back" circle></el-button>
            </div>
            <div
              class="arrowUp"
              @mousedown.prevent="openYuntaiControl(1)"
              @mouseup.prevent="openYuntaiControl(0)"
            >
              <el-button icon="el-icon-top" circle></el-button>
            </div>
            <div
              class="arrowRight"
              @mousedown.prevent="openYuntaiControl(4)"
              @mouseup.prevent="openYuntaiControl(0)"
            >
              <el-button icon="el-icon-right" circle></el-button>
            </div>
            <div
              class="arrowDown"
              @mousedown.prevent="openYuntaiControl(2)"
              @mouseup.prevent="openYuntaiControl(0)"
            >
              <el-button icon="el-icon-bottom" circle></el-button>
            </div>
            <div
              class="iconPlus"
              @mousedown.prevent="openYuntaiControl(5)"
              @mouseup.prevent="openYuntaiControl(0)"
            >
              <el-button icon="el-icon-plus" circle></el-button>
            </div>
            <div
              class="iconMinus"
              @mousedown.prevent="openYuntaiControl(6)"
              @mouseup.prevent="openYuntaiControl(0)"
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
import { getDataList, getDataSingle, postControl } from "./api";
export default {
  name: "devicePlayer",
  components: {
    LivePlayer,
  },
  data() {
    return {
      defaultProps: {
        children: "subcatalog",
        label: "projectName",
      },
      accessTokenS: "", // 空字符串
      filterText: "",
      videoUrl: "",
      deviceSerial: "", //通道号
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
        // {
        //   num: 9,
        //   name: "九分屏",
        // },
        // {
        //   num: 16,
        //   name: "十六分屏",
        // },
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
    this.$nextTick(() => {
      this.equipmentList();
    });
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      // debugger
      return data.projectName.indexOf(value) !== -1;
    },
    //关闭列表
    fuanStatus() {
      this.$emit("fuan", true);
    },

    //获取设备列表
    async equipmentList() {
      const { status, data } = await getDataList();
      this.data = data;
      console.log(data, "ask等哈就看");
    },

    //开始云台控制
    async openYuntaiControl(number) {
      // this.openYuntaiControl(number);
      const { status, data } = await postControl(this.deviceSerial, number);

      if (status == 200) {
        console.log(data.msg, "控制成功");
      }
    },

    //点击分屏

    clickPlayer(player, idx, event) {
      console.log(player, "分开", idx);
      this.playerIdx = idx;
      if (player.url != "") {
        var vars = player.url.split("_")[2];
        this.deviceSerial = vars;
        this.show = true;
      }
    },
    //
    // clearVideos() {
    //   for (var idx in this.players) {
    //     this.closeVideo(idx);
    //   }
    // },
    //点击分屏按钮
    setPlayerLength(playerNum) {
      this.show = false;
      if (playerNum == this.players.length) {
        return;
      }

      // this.clearVideos();
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
      if (this.playerIdx == this.playerLength && this.playerIdx != 0) {
        return;
      }

      if (node.childNodes != "") {
        return;
      }
      let deviceId = datas.deviceId;
      const { status, data } = await getDataSingle(deviceId);
      this.closeVideo(this.playerIdx);

      this.players[this.playerIdx].url = data.fmp4;
      this.$forceUpdate();
      this.playerIdx++;

      console.log(this.players, "修改后的数组");

      // if (this.players[0].url != "") {
      //   var vars = player.url.split("_")[2];
      //   this.deviceSerial = vars;
      // }
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
    margin: 64px 10px 0;
    .filter-tree {
      margin-top: 20px;
      height: 748px;
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