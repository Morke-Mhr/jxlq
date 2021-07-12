<template>
  <div class="map-data">
    <ul class="normal-data">
      <li @click="torote('xm', 'zj')">
        <span>{{ mapInfo.buidingProjectCount }}个</span><span>施工中项目</span>
      </li>
      <li @click="torote('xm', 'wc')">
        <span>{{ mapInfo.finishProjectCount }}个</span><span>已竣工项目</span>
      </li>
      <li @click="torote('sg')">
        <span class="red">{{ mapInfo.accidentCount }}个</span
        ><span>事故报告</span>
      </li>
      <!-- <li><span>应急演练</span><span class="yellow">{{mapInfo.emergencyCount}}</span></li> -->
      <!-- <li><span>我的任务</span><i></i><span class="yellow">{{mapInfo.finishProjectCount}}</span></li> -->
    </ul>
    <div class="navigations">
      <el-radio-group v-model="radio1" fill="#2E4FA9" @change="mapCut">
        <el-radio-button label="1">项目地图</el-radio-button>
        <el-radio-button label="2">视频监控</el-radio-button>
      </el-radio-group>
    </div>
    <div class="hidden-danger">
      <h6 @click="danger">挂牌督办({{ hiddandangerGuapaiList.zongshu }})</h6>
      <p v-for="(gItem, gIdx) in hiddandangerGuapaiList.dataMaps" :key="gIdx">
        {{ gItem.info }}
      </p>
    </div>
    <!-- <div class="supervision">

		</div> -->
  </div>
</template>

<script>
import { mapData } from "@/api/dataBulletinBoard/index"; //地图数据
export default {
  props: {
    date_year: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      radio1: "1",
      mapInfo: {
        accidentCount: 0,
        buidingProjectCount: 0,
        emergencyCount: 0,
        finishProjectCount: 0,
        guapaiCount: 0,
      },
      hiddandangerFuxianList: [],
      hiddandangerGuapaiList: [],
    };
  },
  components: {},

  mounted() {
    this.dataBulletinBoard();
    // this.$nextTick(() => {
    // 	this.initChart();
    // });
  },
  methods: {
    mapCut() {
      this.$emit("fuan", false);
    },
    torote(v, t) {
      if (v == "xm") {
        if (t == "zj") {
          sessionStorage.setItem("item", "施工中");
        } else if (t == "wc") {
          sessionStorage.setItem("item", "已竣工");
        }
        this.$emit("pageTurn", "item");
      } else if (v == "sg") {
        this.$emit("pageTurn", "record");
      }
    },
    danger() {
      sessionStorage.setItem("yhRecord", "重大");
      this.$emit("pageTurn", "yhRecord");
    },
    async dataBulletinBoard() {
      let data = {
        queryYear: this.date_year,
      };
      let res = await mapData(data);
      console.log(res, 6666666999999);
      this.mapInfo.accidentCount = res.accidentCount;
      this.mapInfo.buidingProjectCount = res.buidingProjectCount;
      this.mapInfo.emergencyCount = res.emergencyCount;
      this.mapInfo.finishProjectCount = res.finishProjectCount;
      this.mapInfo.guapaiCount = res.guapaiCount;
      // this.hiddandangerFuxianList = res.hiddandangerFuxianList;
      this.hiddandangerGuapaiList = res.hiddandangerGuapaiList;
      this.$emit("risk", res.hiddandangerFuxianList);
      // for (let i in res) {
      // 	this.completeArr.push(res[i].completeNumber)
      // 	this.planArr.push(res[i].planNumber)
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
.map-data {
  width: 83%;
  overflow: hidden;
  color: #ffffff;
  margin: 8px 8px;
}

.normal-data {
  list-style: none;
  padding: 0px;
  margin: 0px;
  overflow: hidden;
  cursor: pointer;
}

.normal-data li {
  list-style: none;
  padding: 0px;
  margin: 0px;
  float: left;
  width: 120px;
  height: 52px;
  margin-right: 8px;
  background-image: url(../../../assets/dataBoard/titlebg1.png);
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;
}
.normal-data li:first-child {
  background-image: url(../../../assets/dataBoard/titlebg3.png);
}
.normal-data li:last-child {
  background-image: url(../../../assets/dataBoard/titlebg2.png);
}
.normal-data li span {
  display: block;
  width: 100%;
  text-align: right;
  font-size: 18px;
  padding-right: 8px;
  padding-top: 5px;
  line-height: 21px;
  color: #ffffff;
  overflow: hidden;
}

.normal-data li span:last-child {
  // line-height: 30px;
  font-size: 12px;
  color: #ffffff;
}

.normal-data li span.red {
  // color: #ff0000;
}

.normal-data li span.yellow {
  color: #e6af08;
}

.normal-data li i {
  display: block;
  width: 100%;
  height: 1px;
  background-image: url(../../../assets/dataBoard/line.png);
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;
}

.hidden-danger {
  width: 274px;
  height: 111px;
  margin-top: 396px;
  overflow: hidden;
  border: 1px solid rgba(34, 147, 254, 0.3);
  float: left;
}

.hidden-danger h6 {
  font-size: 14px;
  font-weight: 400;
  color: #fdd14a;
  margin: 0;
  background: rgba(14, 109, 233, 0.28);
  line-height: 26px;
  text-align: center;
  border-bottom: 1px solid rgba(101, 124, 168, 0.1);
  cursor: pointer;
}

.hidden-danger p {
  font-size: 12px;
  line-height: 26px;
  font-weight: 400;
  color: #ffffff;
  border-bottom: 1px solid rgba(101, 124, 168, 0.1);
  padding-left: 10px;
  margin: 0;
}

.supervision {
  width: 222px;
  height: 84px;
  margin-top: 417px;
  overflow: hidden;
  border: 1px solid rgba(34, 147, 254, 0.3);
  float: right;
  margin-right: 20px;
}

.supervision h6 {
  font-size: 14px;
  font-weight: 400;
  color: #fdd14a;
  margin: 0;
  background: rgba(14, 109, 233, 0.28);
  line-height: 26px;
  text-align: center;
  border-bottom: 1px solid rgba(101, 124, 168, 0.1);
}

.supervision p {
  font-size: 12px;
  line-height: 26px;
  font-weight: 400;
  color: #ffffff;
  border-bottom: 1px solid rgba(101, 124, 168, 0.1);
  padding-left: 35px;
  margin: 0;
}
.navigations {
  margin-top: 10px;
  display: inline-block;
  position: absolute;
}
.navigations /deep/ {
  .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 24px 0 0 24px;
  }
  .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 0 24px 24px 0;
  }
  .el-radio-button__inner {
    padding: 5px 10px;
    background: #5c6a86;
    border: 1px solid #5c6a86;
    color: #e6e5e5;
  }
}
</style>
