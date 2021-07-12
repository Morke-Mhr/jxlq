<template>
  <div id="app">
    <div class="tite">个人培训记录</div>
    <div class="container">
      <div class="top_Box">
        <div class="leftBox">
          <ul>
            <li style="font-size: 18px">{{ listDetails.userName }}</li>
            <li>
              <span>{{ listDetails.deptName }}</span>
            </li>
            <li>
              <span>{{ listDetails.postName }}</span>
            </li>
            <li>{{ listDetails.phonenumber }}</li>
          </ul>
          <p class="avatarBox"><img :src="listDetails.avatar" alt="" /></p>
        </div>
      </div>
      <div class="bottom_Box">
        <div class="left_time">
          <p><i></i><span>培训时长</span></p>
          <div class="bottom_Box_C">
            <el-progress
              type="circle"
              class="progress"
              :stroke-width="25"
              :width="240"
              :percentage="listDetails.finishstatPx"
              :show-text="false"
              color="#00FF00"
            ></el-progress>
            <div class="areadyPxhour">
              <p style="margin: 0; font-size: 20px">
                {{ listDetails.areadyPxhour }}
              </p>
              <p>培训总时长(小时)</p>
            </div>
          </div>
        </div>
        <div class="right_plan">
          <p><i></i><span>培训计划</span></p>
          <ul v-if="listDetails.trainPlanTrackVoList !== null">
            <li v-for="(item, i) in listDetails.trainPlanTrackVoList" :key="i">
              <p>
                <span class="stime">{{ item.planStartTime }} 开始</span>
                <span
                  v-html="item.pxWay == true ? '线下' : '线上'"
                  class="pxWay"
                  :style="{
                    background: item.pxWay == true ? '#409eff' : '#00FF00',
                  }"
                ></span>
              </p>
              <el-progress
                :text-inside="true"
                :stroke-width="15"
                :percentage="item.trainingProgress"
                :color="item.pxWay == true ? '#409eff' : '#00FF00'"
              ></el-progress>
            </li>
          </ul>
          <ul v-if="listDetails.trainPlanTrackVoList === null">
            <p>暂无培训信息</p>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getUserInfoMove } from "@/api/safety/plan.js";

export default {
  data() {
    return {
      listDetails: {
        deptName: "",
        postName: "",
        userName: "",
        phonenumber: "",
        avatar: "",
        needPxhour: "",
        areadyPxhour: "",
        finishstatPx: "0",
        trainPlanTrackVoList: null,
      },
      jiaodiId: "",
    };
  },
  created() {
    const { userId } = this.$route.query;
    this.userId = userId;
    this.getList();
  },
  methods: {
    async getList() {
      let v = await getUserInfoMove(this.userId);
      this.listDetails = v;
      this.listDetails.avatar =
        this.$store.state.apiConfiguration.fileUrl + "/" + v.avatar;
    },
  },
};
</script>

<style lang="scss" scoped>
#app {
  display: flex;
  flex-direction: column;
  .tite {
    height: 6vh;
    position: fixed;
    width: 100%;
    text-align: center;
    line-height: 6vh;
    font-size: 22px;
    top: 0;
    border-bottom: 1px solid #c4c4c4;
  }
  .container {
    flex: 1;
    overflow: scroll;
    margin-top: 6vh;
    padding: 0 1vh;
    .top_Box {
      border-bottom: 1px solid #c4c4c4;
      .leftBox {
        display: flex;
        justify-content: space-between;
        ul {
          display: inline-block;
          padding-left: 1vh;
          margin: 0;
          li {
            list-style: none;
            height: 40px;
            line-height: 40px;
            font-size: 14px;
          }
        }
        .avatarBox {
          width: 11vh;
          height: 11vh;
          display: inline-block;
          margin-right: 1vh;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
      }
    }
    .bottom_Box {
      margin-top: 20px;
      .left_time {
        position: relative;
        .bottom_Box_C {
          display: flex;
          justify-content: center;
          .progress {
            margin: 0 7vh;
          }
          .areadyPxhour {
            position: absolute;
            top: 45%;
            left: 35%;
            text-align: center;
          }
        }
        p {
          display: flex;
          padding: 0 1vh;
          i {
            display: inline-block;
            width: 4px;
            height: 22px;
            background: #5683fe;
            font-size: 18px;
          }
          span {
            margin-left: 10px;
            font-size: 18px;
          }
        }
      }

      .right_plan {
        border-top: 1px solid #c4c4c4;
        margin-top: 2vh;
        p {
          display: flex;
          padding: 0 1vh;
          i {
            display: inline-block;
            width: 4px;
            height: 22px;
            background: #5683fe;
          }
          span {
            margin-left: 10px;
            font-size: 18px;
          }
        }
        ul {
          padding: 0 10px;
          li {
            list-style: none;
            p {
              display: flex;
              justify-content: space-between;
              .stime {
                font-size: 12px;
              }
              .pxWay {
                font-size: 13px;
                padding: 0 10px;
                line-height: 20px;
                border-radius: 5px;
              }
            }
          }
        }
      }
    }
  }
}
</style>