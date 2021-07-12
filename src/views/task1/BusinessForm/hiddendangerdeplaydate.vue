<template>
  <!-- 隐患整改 延期 变更 协助人 -->
  <div class="sxForm">
    <div class="formTitle height40">详情</div>
    <div style="overflow: auto">
      <el-form
        ref="form"
        :model="diaDataList"
        style="width: 45%"
        v-for="(tItem, ii) in [leftForm, rightForm]"
        :key="ii"
        :style="ii == 0 ? 'float: left;margin-right: 1.6rem' : 'float: left'"
      >
        <el-form-item
          v-for="(item, index) in tItem"
          :key="index"
          :label="item.label"
        >
          <el-input
            disabled
            v-if="item.type == 'input'"
            v-model="diaDataList[item.propVal]"
          ></el-input>
          <el-input
            disabled
            v-else-if="item.type == 'textarea'"
            type="textarea"
            :autosize="{ minRows: 3}"
            v-model="diaDataList[item.propVal]"
            ></el-input
          >
          <template v-else-if="item.type == 'img'">
            <div class="yhImg">
              <img
                v-for="imgItem in diaDataList[item.propVal]"
                :key="imgItem.pictureId"
                :src="imgItem.pictureUrl"
              />
            </div>
          </template>
          <span v-else>{{ diaDataList[item.propVal] }}</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="formTitle height40">验收记录</div>
    <div class="sxForm">
      <el-table
        ref="multipleTable"
        :data="diaTableData"
        tooltip-effect="light"
        style="width: 100%"
        height="calc(100vh - 380px)"
        stripe
      >
        <el-table-column
          v-for="(item, index) in diaTable"
          :key="index"
          :label="item.label"
          :prop="item.propVal"
          show-overflow-tooltip
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { viewBusinessInfo } from '@/api/system/process'

export default {
  props: {
    businessKey: String,
    businessCode: String
  },
  data() {
    return {
      diaDataList: {},
      leftForm: [
        { label: '检查类别', propVal: 'checkCategory' },
        { label: '登记部门', propVal: 'createDept' },
        { label: '隐患级别', propVal: 'hdLevelTxt' },
        { label: '计划完成时间', propVal: 'planFinishTime' },
        { label: '责任人', propVal: 'dutyUser' },
        { label: '签收时间', propVal: 'signTime' },
        { label: '协助人', propVal: 'assistUser' },
        { label: '问题描述', propVal: 'problemDesc', type: 'textarea' },
        { label: '三违行为', propVal: 'threeBehavior', type: 'input' },
        { label: '治理要求', propVal: 'controlClaim', type: 'textarea' },
        { label: '整改内容', propVal: 'rectContent', type: 'textarea' },
        { label: '整改图片', propVal: 'leftImg', type: 'img' }
      ],
      rightForm: [
        { label: '隐患编号', propVal: 'hyId' },
        { label: '登记时间', propVal: 'createTime' },
        { label: '隐患类别', propVal: 'hdClass' },
        { label: '实际完成时间', propVal: 'realFinishTime' },
        { label: '登记人', propVal: 'createBy' },
        { label: '签收人', propVal: 'signUser' },
        { label: '实施人', propVal: 'implementer' },
        { label: '违反法规', propVal: 'violationLaw', type: 'textarea' },
        { label: '延期日期', propVal: 'historyDelayTime', type: 'input' },
        { label: '变更原因', propVal: 'changeReason', type: 'textarea' },
        { label: '预防措施', propVal: 'precaution', type: 'textarea' },
        { label: '隐患图片', propVal: 'rightImg', type: 'img' }
      ],
      // 弹出层表格展示项
      diaTable: [
        { label: '验收时间', propVal: 'applyTime' },
        { label: '验收意见', propVal: 'applyOpnion' },
        { label: '验收人', propVal: 'applyUserName' }
      ],
      // 弹出层需要展示的数据
      diaTableData: [],
      yhList: {
        0: '微小',
        1: '一般',
        2: '重大'
      }
    }
  },
  created() {
    this.getAllList()
  },
  methods: {
    async getAllList() {
      let { body: res } = await viewBusinessInfo(
        this.businessCode,
        this.businessKey
      )
      res.hiddendangerFiles.forEach((item) => {
        if (
          item.pictureUrl.indexOf(
            this.$store.state.apiConfiguration.url +
              this.$store.state.serviceName.jurisdiction
          ) == '-1'
        ) {
          item.pictureUrl =
            this.$store.state.apiConfiguration.url +
            this.$store.state.serviceName.jurisdiction +
            item.pictureUrl
        }
      })
      console.log(res, 9999)
      res.leftImg = []
      res.rightImg = []
      this.diaTableData = []
      if (res.checkHistorys != null) {
        res.checkHistorys.forEach((item) => {
          this.diaTableData.push(item)
        })
      }

      res.hiddendangerFiles.forEach((item) => {
        if (item.pictureType == 1) {
          res.leftImg.push(item)
        } else {
          res.rightImg.push(item)
        }
      })
      res.hdLevelTxt = this.yhList[res.hdLevel]
      this.diaDataList = res
      console.log(this.diaDataList, 789)
    }
  }
}
</script>
<style lang="scss" scoped>
.yhImg img {
  width: 230px;
  height: 260px;
  display: block;
  margin-left: 68px;
  border: 1px solid #f2f2f2;
}
//@import url(); 引入公共css类
</style>
