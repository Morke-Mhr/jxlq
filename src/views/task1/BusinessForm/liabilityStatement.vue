<template>
<!-- 安全责任书 -->
  <div class="app-container">
    <div class="safety-table">
      <div id="printForm">
        <div class="safety-tit">安全责任书</div>
        <table cellspacing="1" cellpadding="0">
          <tr>
            <td>部门</td>
            <td colspan="4">&nbsp;{{this.detailDate.deptName}}</td>
          </tr>
          <tr>
            <td>岗位</td>
            <td colspan="4">&nbsp;{{this.detailDate.postName}}</td>
          </tr>
          <tr>
            <td>姓名</td>
            <td colspan="4">&nbsp;{{this.detailDate.userName}}</td>
          </tr>
          <tr style="height: 180px;">
            <td>安全责任</td>
            <td colspan="4">&nbsp;{{this.detailDate.safeDuty}}</td>
          </tr>
          <tr>
            <td rowspan="6">安全目标</td>
            <td>指标</td>
            <td>目标</td>
            <td>开始时间</td>
            <td>结束时间</td>
          </tr>
          <tr v-for="(item,index) in this.detailDate.safebookTargets" :key="index">
            <td>&nbsp;{{item.workIndex}}</td>
            <td>&nbsp;{{item.targetShow}}</td>
            <td>&nbsp;{{item.startTime}}</td>
            <td>&nbsp;{{item.endTime}}</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>

          <tr style="height: 230px;">
            <td>电子签名</td>
            <td colspan="4">
              <!-- <img :src="getImge" style="width: 200px;height: 200px;" /> -->
               <img
                      v-for="(v,indexs) in this.detailDate.safebookSigns"
                      :key="indexs"
                      v-show="v.signUrl ? true : false"
                      :src="$store.state.apiConfiguration.imgFileUrl+v.signUrl"
                      style="width: 200px; height: 200px"
                    />
            </td>
          </tr>
        </table>
      </div>
      <div style="text-align: right;width: 80%;margin: 0 auto;margin-right: 16%;">
        <!-- <el-button type="primary" style="margin-top: 30px;" v-print="'#printForm'">打印</el-button> -->
      </div>
    </div>
  </div>
</template>

<script>
import { viewBusinessInfo } from "@/api/system/process";
export default {
 props: {
    businessKey: String,
    businessCode:String,
  },
  data() {
    return {
      detailDate: "",
      businessKey: "",
    };
  },
  computed: {
    getImge: function () {
      if (
        this.detailDate.signUrl == "" ||
        this.detailDate.signUrl === undefined
      ) {
        return "";
      } else {
        return (
          this.$store.state.apiConfiguration.imgFileUrl +
          this.detailDate.signUrl
        );
      }
    },
  },
  created: async function () {
    //获取数据
    this.getAllList();
  },
  methods: {
    async getAllList() {
      this.loading = false;
      let data = await viewBusinessInfo(this.businessCode, this.businessKey);
      this.detailDate = data.body;
    },
  },
};
</script>

<style lang='scss' scoped>
.safety-tit {
  width: 80%;
  margin: 0 auto;
  font-size: 16px;
  text-align: center;
  height: 35px;
  line-height: 35px;
  margin-bottom: 10px;
}
.safety-table table,
.safety-table th,
.safety-table td {
  border: 1px solid #ddd;
  border-collapse: collapse;
  text-align: center;
}
.safety-table table {
  width: 70%;
  text-align: center;
  margin: 0 auto;
}
.safety-table table tr {
  height: 35px;
  line-height: 35px;
}
.safety-table table tr td:first-child {
  width: 20%;
}

</style>