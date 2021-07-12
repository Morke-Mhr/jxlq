<template>
  <div class="content_look">
    <div class="content_box">
      <div style="float:right">
        <el-button class="fBtn" @click="resetForm()">返回</el-button>
        <el-button class="tBtn" @click="printAqrj">打印</el-button>
      </div>

      <table
        border="1"
        cellspacing="0"
        id="printForm"
        style="border-collapse: collapse; width: 85%; float: left"
      >
        <caption class="title" style="margin-bottom: 20px; font-size: 32px">
          安全日志
        </caption>
        <caption
          class="title"
          style="font-size: 18px; margin: 0 0 8px 12px; text-align: left"
        >
          单位名称：{{
            ruleForm.deptName
          }}
        </caption>
        <tr class="list" style="height: 80px">
          <td style="text-align: center; width: 10%">日期</td>
          <td style="text-align: center; width: 23%">{{ ruleForm.logTime }}</td>
          <td style="text-align: center; width: 10%">天气</td>
          <td style="text-align: center; width: 23%">
            {{ ruleForm.weatherName }}
          </td>
          <td style="text-align: center; width: 10%">记录人</td>
          <td style="text-align: center; width: 23%">
            {{ ruleForm.postName }}{{ ruleForm.createBy }}
          </td>
        </tr>
        <tr class="list2" style="min-height: 100px">
          <td
            style="padding: 6px 10px; text-align: left"
            valign="top"
            colspan="6"
          >
            <h5 style="margin: 0; padding-top: 10px">今日完成工作记述：</h5>
            <br />
            {{ ruleForm.todayFinish }}
          </td>
        </tr>
        <tr class="list2" style="min-height: 100px">
          <td
            style="padding: 6px 10px; text-align: left"
            valign="top"
            colspan="6"
          >
            <h5 style="margin: 0; padding-top: 10px">
              今日工作备忘和明天工作安排：
            </h5>
            <br />
            {{ ruleForm.todayMemo }}
            {{ ruleForm.tomorrowWork }}
          </td>
        </tr>
        <tr class="list2" style="min-height: 100px">
          <td
            style="padding: 6px 10px; text-align: left"
            valign="top"
            colspan="6"
          >
            <h5 style="margin: 0; padding-top: 10px">检查情况及采取的措施：</h5>
            <br />
            {{ ruleForm.checkSituation }}
          </td>
        </tr>
        <tr class="list2" style="min-height: 50px">
          <td
            style="padding: 6px 10px; text-align: left"
            valign="top"
            colspan="6"
          >
            <h5 style="margin: 0; padding-top: 10px">其他有关事项记录：</h5>
            <br />
            {{ ruleForm.otherMatter }}
          </td>
        </tr>
        <tr class="list2">
          <td
            style="padding: 0 10px; text-align: center; width: 20%"
            colspan="2"
          >
            签字
          </td>
          <td style="padding: 0 10px; text-align: center" colspan="4">
            <img class="img" :src="ruleForm.signUrl" alt="" />
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { getCheck, printAqrj } from '@/api/hiddenDanger/security'

export default {
  props: {
    person: String
  },
  data() {
    return {
      ruleForm: {
        safelogId: null,
        deptName: '',
        postName: '',
        createBy: '',
        logTime: '',
        weatherName: '',
        todayFinish: '',
        todayMemo: '',
        tomorrowWork: '',
        checkSituation: '',
        otherMatter: '',
        signUrl: ''
      },
      id: ''
    }
  },
  created() {
    this.id = this.person
    this.goCheck()
  },
  methods: {
    async goCheck() {
      try {
        this.loading = false
        let data = this.id
        let resData = await getCheck(data)
        this.ruleForm = resData
        this.ruleForm.signUrl =
          this.$store.state.apiConfiguration.fileUrl + resData.signUrl
      } catch (e) {
        console.error('接口异常')
      }
    },

    //取消
    resetForm() {
      this.$emit('func')
    },

    printAqrj() {
      printAqrj({ safelogId: this.ruleForm.safelogId })
    }
  }
}
</script>
<style lang="scss" scoped>
.content_look {
  background-color: #fff;
  padding: 20px 0;
  .content_box {
    margin: 30px auto;
    width: 62%;
    overflow: hidden;
    table {
      border-collapse: collapse;
      width: 85%;
      float: left;
      .title {
        margin-bottom: 20px;
        font-size: 32px;
      }
      .list {
        height: 36px;
        td {
          padding-left: 10px;
          text-align: center;
        }
      }
      .list2 {
        height: 130px;
        td {
          padding: 0 10px;
          text-align: left;
        }
        .img {
          height: 110px;
        }
      }
      tr {
        th {
          width: 30%;
        }
      }
    }
    .cancel-btn {
      float: right;
      margin-left: 20px;
    }
    .table-add-btn {
      float: right;
    }
  }
}
</style>
