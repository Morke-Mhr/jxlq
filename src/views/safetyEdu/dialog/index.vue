<template>
  <!-- 培训跟踪 -->
  <div >
    <!-- 培训详情 -->
    <div>
      <div class="top_Box">
        <div class="leftBox">
          <p class="avatarBox"><img :src="listDetails.avatar" alt="" /></p>
          <ul>
            <li style="font-size: 30px">{{ listDetails.userName }}</li>
            <li>
              <span>{{ listDetails.deptName }}</span>
              <span style="margin-left: 20px">{{ listDetails.postName }}</span>
            </li>
            <li>{{ listDetails.phonenumber }}</li>
          </ul>
        </div>
        <div id="qrcode"></div>
      </div>
      <div class="bottom_Box">
        <div class="left_time">
          <p><i></i><span>培训时长</span></p>
          <el-progress
            type="circle"
            class="progress"
            :stroke-width="30"
            :width="250"
            :percentage="parseFloat(listDetails.finishstatPx)"
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
                :percentage="parseFloat(item.trainingProgress)"
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
import { getUserInfoM } from "@/api/safety/plan.js";
import QRCode from "qrcodejs2";
export default {
  props: {
    person: String,
  },

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
    };
  },
  created() {
    this.dowClick();
  },
  methods: {
    async dowClick() {
      let v = await getUserInfoM(this.person);
      this.listDetails = v;
      this.listDetails.avatar =
        this.$store.state.apiConfiguration.fileUrl + "/" + v.avatar;
      if (this.person) {
        // 防止网络不佳时重复生成
        if (
          document.getElementById("qrcode") &&
          document.getElementById("qrcode").innerHTML != ""
        ) {
          this.ewmClose();
        }
        this.dialogVisible = true;
        this.$nextTick(() => {
          let qrcode = new QRCode(document.getElementById("qrcode"), {
            // text: 'http://www.baidu.com',
            width: 120,
            height: 120,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H,
          });
          // 第一次生成还有问题
          qrcode.makeCode(
            `${this.$store.state.apiConfiguration.htmlUrl}#/personalDetails?userId=${this.person}`
          );
        });
      } else {
        this.$message.error("获取数据失败");
      }
    },
    // 二维码关闭
    ewmClose() {
      document.getElementById("qrcode").innerHTML = "";
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .deptLabel .el-input .el-input__inner {
  width: 350px !important;
}
/deep/.el-dialog .el-dialog__body {
  height: auto;
}

.top_Box {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #c4c4c4;
  padding: 0 10px 20px 10px;
  .leftBox {
    width: 80%;
    // display: flex;
    // justify-content: space-between;
    ul {
      display: inline-block;
      padding-left: 15px;
      margin: 0;
      li {
        list-style: none;
        height: 40px;
        line-height: 40px;
      }
    }
    .avatarBox {
      width: 100px;
      height: 100px;
      display: inline-block;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
  #qrcode {
    width: 120px;
    height: 120px;
    margin-top: 10px;
  }
}
.bottom_Box {
  display: flex;
  margin-top: 20px;
  padding-left: 10px;
  .left_time {
    width: 400px;
    position: relative;
    .progress {
      position: absolute;
      top: 22%;
      left: 15%;
    }
    .areadyPxhour {
      position: absolute;
      top: 45%;
      left: 35%;
      text-align: center;
    }
    p {
      display: flex;
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
    width: 50%;
    p {
      display: flex;
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
      height: 400px;
      overflow: auto;
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
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
