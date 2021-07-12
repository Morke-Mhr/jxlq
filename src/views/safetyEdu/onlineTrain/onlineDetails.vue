<template>
  <div class="app-container" style="padding: 0px">
    <div>
      <el-row>
        <el-col :span="18" style="background: #ffffff">
          <div>
            <i
              class="el-icon-arrow-left other-bottom"
              style="margin-top: 10px"
              @click="resetForm()"
              >返回</i
            >
            <div class="theme-title">
              {{ kjName }}
            </div>
            <div class="video-box">
              <video-player
                class="video-player vjs-custom-skin"
                ref="videoPlayer"
                :playsinline="true"
                :options="playerOptions"
                @play="onPlayerPlay($event)"
                @pause="onPlayerPause($event)"
                @ended="onPlayerEnded($event)"
                @ready="playerReadied"
                @timeupdate="onPlayerTimeupdate($event)"
              ></video-player>
              <div class="theme-content">
                <span>主题 : </span>
                {{ kjTheme }}
              </div>
              <div class="theme-content">
                <span>培训类别 ：</span>{{ pxClass }}
              </div>

              <div class="theme-content">
                <div class="theme-content">
                  <span>学习状态 ：</span>
                  <!-- <span
                      v-if="studyStatus == '0'"
                      style="
                      padding: 2px;
                      background-color: #1e90ff;
                      color: #ffffff;
                      border-radius: 3px;
                    "
                  >未开始</span
                  > -->
                  <span
                    v-if="studyStatus == '1' || studyStatus == '0'"
                    style="
                      padding: 2px;
                      background-color: #ff0000;
                      color: #ffffff;
                      border-radius: 3px;
                    "
                    >进行中</span
                  >
                  <span
                    v-if="studyStatus == '2'"
                    style="
                      padding: 2px;
                      background-color: #00dd00;
                      color: #ffffff;
                      border-radius: 3px;
                    "
                    >已完成</span
                  >
                </div>
              </div>
              <div class="theme-content">
                <span>学习起止时间 ：</span>{{ startStudyTime }}至{{
                  endStudyTime
                }}
              </div>
              <!-- <object id="MediaPlayer" classid="clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95" width="800" height="600" standby="Loading Windows Media Player components…" type="application/x-oleobject" codebase="http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=6,4,7,1112">
                <param name="FileName" value="this.videoUrl">
                <param name="AutoStart" value="true">
                <param name="ShowControls" value="true">
                <param name="BufferingTime" value="2">
                <param name="ShowStatusBar" value="true">
                <param name="AutoSize" value="true">
                <param name="InvokeURLs" value="false">
                <param name="AnimationatStart" value="1">
                <param name="TransparentatStart" value="1">
                <param name="Loop" value="1">
                <embed type="application/x-mplayer2" src="this.videoUrl"></embed>
                </object> -->
            </div>
          </div>
        </el-col>
        <el-col :span="5" :offset="1" style="background: #ffffff">
          <div class="other-video">
            <div class="area-tit">同类视频</div>
            <div class="video-list">
              <p
                v-for="(item, index) in this.resultData"
                :key="index"
                class="video-name"
                @click="playVideoItem(index)"
              >
                <span>{{ item.kjName }}</span>
              </p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { videoPlayer } from "vue-video-player";
import "video.js/dist/video-js.css";
import {
  getStudyVideo,
  getStudyIsEnd,
  getStudyIsSatisfy,
  getStudyAddRecord,
  getOnlineVideo,
} from "@/api/safety/study.js";

export default {
  props: {
    study: Object,
  },
  components: {
    videoPlayer,
  },
  data() {
    return {
      //播放视频
      playerOptions: {
        // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: true, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            src: "", // 路径
            type: "video/mp4" || "video/avi" || "video/3gp", // 类型
          },
        ],
        poster: "", //你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: "请选择右边的视频列表进行播放", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: true,
          fullscreenToggle: true, //全屏按钮
        },
      },
      id: {
        pxClassId: "",
        pxTitleId: "",
      },
      //培训需求主键
      traindemandId: "",
      //课件主键
      resultData: null,
      videoUrl: "",
      kjName: "",
      kjTheme: "",
      kjClass: "",
      pxClass: "",
      studyStatus: "", //学习状态
      startStudyTime: "", //开始时间
      endStudyTime: "", //结束时间
      //上次播放结束时间  判断是否看完
      lastPlayEndTime: "",
      //效验学习的当前人是否满足需求的课时
      nextNeed: "",
      pxClassId: "",
      pxClass: "",
      pxTitle: "",
      pxTitleId: "",
      //是否看完(0否，1是)
      isEnd: "",
      addStudyRecord: {},
      Whether: "", //视频是否被点击
      relationExamId: "", //用来判断是否需要考试
      VerifyTheFirstPass: "", //是否第一遍查看
      setTime: "",
      passStatus: "", //考试状态
    };
  },
  async created() {
    // this.id = this.study;
    this.id = this.study.trainplanId;
    this.passStatus = this.study.passStatus;
    this.getDetails();
    // this.resultData = await getOnlineVideo(this.id);
    // let kjFileUrl = this.resultData[0].kjFileUrl;
    // this.playerOptions.sources[0].src =
    //     this.$store.state.apiConfiguration.url +
    //     "zqq-system-service" +
    //     kjFileUrl;

    console.log(this.playerOptions.sources[0].src);
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    },
  },
  mounted() {
    document.addEventListener("visibilitychange", this.handleVisiable);
    window.addEventListener("beforeunload", (e) => {
      this.destroy();
    });
  },
  destroyed() {
    document.removeEventListener("visibilitychange", this.handleVisiable);
  },
  beforeDestroy() {
    this.destroy();
  },
  methods: {
    //返回
    resetForm() {
      this.$emit("func");
      // clearInterval(this.setTime)
    },

    //获取详情
    async getDetails() {
      this.resultData = await getOnlineVideo(this.id);
    },
    async playVideoItem(index) {
      let kjFileUrl = this.resultData[index].kjFileUrl;
      let kjFileArr = kjFileUrl.split(":");
      if (kjFileArr[0] == "https") {
        this.playerOptions.sources[0].src = kjFileUrl;
      } else {
        this.playerOptions.sources[0].src =
          this.$store.state.apiConfiguration.url +
          this.$store.state.serviceName.jurisdiction +
          kjFileUrl;
      }
      this.relationExamId = this.resultData[index].relationExamId;
      this.kjName = this.resultData[index].kjName;
      this.kjTheme = this.resultData[index].pxTitle;
      this.kjClass = this.resultData[index].kjClass;
      this.pxClass = this.resultData[index].pxClass;
      this.relationExamId = this.resultData[index].relationExamId; //判断是否要考试
      this.startStudyTime = this.resultData[index].startStudyTime; //开始时间
      this.endStudyTime = this.resultData[index].endStudyTime; //结束时间
      this.studyStatus = this.resultData[index].studyStatus; //学习状态

      this.traincoursewareId = this.resultData[index].traincoursewareId;
      this.traindemandId = this.resultData[index].traindemandId;
      this.pxClassId = this.resultData[index].pxClassId;
      this.pxClass = this.resultData[index].pxClass;
      this.pxTitleId = this.resultData[index].pxTitleId;
      this.pxTitle = this.resultData[index].pxTitle;
      if (this.Whether != index && this.Whether != "") {
        await getStudyAddRecord(this.addStudyRecord);
      }
      this.Whether = index;
    },
    // 播放回调
    async onPlayerPlay(player) {
      console.log("player play!", player);
      //判断视频
      if (this.lastPlayEndTime > player.cache_.currentTime) {
        player.cache_.currentTime = this.lastPlayEndTime;
        player.currentTime(this.lastPlayEndTime);
      }
      console.log("看这个视频的当前时间是否已经赋值:" + player);
      let isEnd = {
        traindemandId: this.traindemandId,
        traincoursewareId: this.traincoursewareId,
        trainplanId: this.id,
      };

      //效验学习这个课件当前人是否是未看完的
      let lastPlayEndTime = await getStudyIsEnd(isEnd);
      this.lastPlayEndTime = lastPlayEndTime.lastPlayEndTime;
      //根据当前人新增培训学习记录
      //获取当前时间  以秒为单位
      let currentTime = player.cache_.currentTime;
      //获取视频总时长  以秒为单位
      let duration = player.cache_.duration;

      if (currentTime == duration) {
        this.nextNeed = true;
      } else {
        this.nextNeed = false;
      }
      this.lastPlayEndTime = currentTime;
      let addStudyRecord = {
        traincoursewareId: this.traincoursewareId,
        traindemandId: this.traindemandId,
        pxClassId: this.pxClassId,
        pxClass: this.pxClass,
        pxTitleId: this.pxTitleId,
        pxTitle: this.pxTitle,
        isEnd: this.nextNeed,
        lastPlayEndTime: this.lastPlayEndTime,
        trainplanId: this.id,
      };
      let result = await getStudyAddRecord(addStudyRecord);
      // this.setTime = setInterval(result,600000)
    },

    // 暂停回调
    async onPlayerPause(player) {
      // clearInterval(this.setTime)

      let currentTime = player.cache_.currentTime;
      //获取视频总时长  以秒为单位
      let duration = player.cache_.duration;
      if (currentTime >= duration || currentTime == duration) {
        this.nextNeed = true;
      } else {
        this.nextNeed = false;
      }
      this.lastPlayEndTime = currentTime;
      let addStudyRecord = {
        traincoursewareId: this.traincoursewareId,
        traindemandId: this.traindemandId,
        pxClassId: this.pxClassId,
        pxClass: this.pxClass,
        pxTitleId: this.pxTitleId,
        pxTitle: this.pxTitle,
        isEnd: this.nextNeed,
        lastPlayEndTime: this.lastPlayEndTime,
        trainplanId: this.id,
      };
      let result = await getStudyAddRecord(addStudyRecord);
    },

    // 视频播完回调
    async onPlayerEnded(player) {
      // clearInterval(this.setTime)
      let currentTime = player.cache_.currentTime;
      //获取视频总时长  以秒为单位
      let duration = player.cache_.duration;
      if (this.relationExamId == null) {
        this.$confirm("您已完成培训！", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
      } else {
        if (currentTime >= duration && this.passStatus != "合格") {
          this.nextNeedEnd = true;
          this.$confirm("您已完成培训,是否立即开始考试?", "提示", {
            confirmButtonText: "立即考试",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$router.push({
                path: "/examination/myExam",
                query: { trainplanId: this.id },
              });
            })
            .catch(() => {});
        } else {
          this.nextNeed = false;
        }
      }
      this.lastPlayEndTime = currentTime;
      let addStudyRecord = {
        traincoursewareId: this.traincoursewareId,
        traindemandId: this.traindemandId,
        pxClassId: this.pxClassId,
        pxClass: this.pxClass,
        pxTitleId: this.pxTitleId,
        pxTitle: this.pxTitle,
        isEnd: this.nextNeed,
        lastPlayEndTime: this.lastPlayEndTime,
        trainplanId: this.id,
      };
      let result = await getStudyAddRecord(addStudyRecord);
    },

    // //当前播放位置发生变化时触发
    async onPlayerTimeupdate(player) {
      let currentTime = player.cache_.currentTime;
      this.addStudyRecord = {
        traincoursewareId: this.traincoursewareId,
        traindemandId: this.traindemandId,
        pxClassId: this.pxClassId,
        pxClass: this.pxClass,
        pxTitleId: this.pxTitleId,
        pxTitle: this.pxTitle,
        isEnd: this.nextNeed,
        lastPlayEndTime: currentTime,
        trainplanId: this.id,
      };
 },
    //页面销户时传数据给后台
    async destroy() {
      // clearInterval(this.setTime)
      await getStudyAddRecord(this.addStudyRecord);
    },

    /* 将侦听器绑定到组件的就绪状态 */
    async playerReadied(player) {
      //效验学习的当前人是否第一遍学习
      this.VerifyTheFirstPass = await getStudyIsSatisfy(
        this.traincoursewareId,
        this.id
      );
      // document
      //   .getElementsByClassName("vjs-progress-control")[0]
      //   .addEventListener("click", function () {
      //     console.log(this.addStudyRecord + "阿达的");
      //   });

      // 找到对应元素 禁止拉动
      if (!this.VerifyTheFirstPass) {
        document.getElementsByClassName(
          "vjs-progress-control"
        )[0].style.pointerEvents = "none";
      }
      let isEnd = {
        traindemandId: this.traindemandId,
        traincoursewareId: this.traincoursewareId,
        trainplanId: this.id,
      };
      // debugger;
      //效验学习这个课件当前人是否是未看完的
      let lastPlayEndTime = await getStudyIsEnd(isEnd);
      let duration = player.cache_.duration;
      this.lastPlayEndTime = lastPlayEndTime.lastPlayEndTime
        ? lastPlayEndTime.lastPlayEndTime
        : 0;
      if (this.lastPlayEndTime == duration) {
        this.$confirm("该视频您已看完,不累计课时,是否继续观看?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            // this.$message({
            //   type: 'success',
            //   message: '删除成功!'
            // });
            this.lastPlayEndTime = 0;
            player.currentTime(0);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      }
      console.log("准备就绪:" + player.cache_.currentTime);

      // let curTime = player.cache_.currentTime;
      let curTime = this.lastPlayEndTime;

      player.currentTime(curTime);
    },
  },
};
</script>
<style>
.other-bottom {
  padding: 5px;
  cursor: pointer;
  color: #999999;
}

.video-js .vjs-big-play-button {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, 50%);
}

.video-box {
  /* width: 800px; */
  width: 85%;
  /* height: 600px; */
  margin: 10px auto;
}

/* .video-js .vjs-progress-control{
    display: none;
} */
.video-name {
  height: 30px;
  line-height: 30px;
}

.video-name span {
  cursor: pointer;
}

.area-tit {
  font-size: 18px;
  height: 50px;
  line-height: 50px;
  color: #333;
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

.kj-name {
  font-size: 26px;
  color: #000;
  font-weight: bold;
  margin-top: 27px;
}

.theme-title {
  font-size: 18px;
  display: inline-block;
  text-align: center;
  color: #5583fe;
  margin-left: 20px;
}

.theme-content {
  margin: 16px 0;
  font-size: 14px;
}

.theme-content span {
  color: #666666;
  line-height: 20px;
  font-size: 14px;
  padding-right: 20px;
}

.theme-content p {
  color: #666666;
  font-size: 14px;
  display: inline-block;
}

.other-video {
  margin-left: 30px;
  height: 710px;
}
</style>
