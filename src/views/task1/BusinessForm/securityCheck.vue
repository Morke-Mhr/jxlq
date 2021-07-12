<template>
  <!-- 安全检查 -->
  <div>
    <div class="formTitle height40">详情</div>
    <div style="overflow:auto">
      <el-form ref="form" :model="diaDataList" style="width:100%;padding:1rem">
        <el-row
          :gutter="20"
          v-for="(rowItem, rowIndex) in [rowsOne, rowsTwo]"
          :key="rowIndex"
        >
          <el-col
            :span="6"
            v-for="(colItem, colIndex) in rowItem"
            :key="colIndex"
          >
            <el-form-item :label="colItem.label">
              <span>{{ diaDataList[colItem.propVal] }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="formTitle height40">检查内容</div>
    <div class="sxForm">
      <el-table
        ref="multipleTable"
        :data="diaDataList.contentList"
        tooltip-effect="light"
        height="calc(100vh - 380px)"
        style="width: 100%"
        stripe
      >
        <el-table-column
          v-for="(item, index) in diaTable"
          :key="index"
          :label="item.label"
          :prop="item.propVal"
          :width="item.width"
          :align="item.align"
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
  components: {},
  data() {
    return {
      diaDataList: {},
      rowsOne: [
        { label: '检查类别', propVal: 'checkCategory' },
        { label: '计划检查时间', propVal: 'planCheckTime' },
        { label: '组织部门', propVal: 'leadDept' },
        { label: '组织人', propVal: 'leadUser' }
      ],
      rowsTwo: [
        { label: '检查分类', propVal: 'checkClass' },
        { label: '被检查单位', propVal: 'becheckDept' },
        { label: '完成时间', propVal: 'finishTime' }
        // { label: '验收人', propVal: 'ysr' },
        // { label: '验收意见', propVal: 'ysyj' }
      ],
      diaTable: [
        { label: '项目', propVal: 'projectName', width: 200, align: 'center' },
        {
          label: '检查责任部门',
          propVal: 'checkDutyDept',
          width: 300,
          align: 'center'
        },
        {
          label: '检查责任人',
          propVal: 'checkDutyUser',
          width: 100,
          align: 'center'
        },
        {
          label: '是否合格',
          propVal: 'problemTxt',
          width: 100,
          align: 'center'
        },
        {
          label: '检查时间',
          propVal: 'planCheckTime',
          width: 200,
          align: 'center'
        },
        { label: '检查内容', propVal: 'checkContent' }
      ]
    }
  },
  computed: {},
  watch: {},
  methods: {
    async getAllList(val) {
      let res = await viewBusinessInfo(this.businessCode, this.businessKey)
      this.diaDataList = res.body
      // this.diaDataList = await viewDetail({ safecheckId: val.safecheckId })
      this.diaDataList.contentList.forEach((item) => {
        item.problemTxt = this.problemList[item.problem]
      })
      console.log('查看', this.diaDataList)
    }
  },
  created() {},
  mounted() {
    this.getAllList()
  },
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {}
}
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
</style>
