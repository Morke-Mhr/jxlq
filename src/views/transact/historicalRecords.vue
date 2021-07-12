<template>
  <div>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      height="calc(100vh - 380px)"
      tooltip-effect="light"
    >
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column
        prop="applyDeptName"
        label="审批部门"
        width="260"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <el-table-column
        prop="applyUserName"
        label="审批人"
        width="100"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <!-- <el-table-column prop="processInstanceId" label="流程实例Key" width="125"></el-table-column> -->
      <el-table-column
        prop="applyTime"
        label="审批时间"
        width="200"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <el-table-column
        prop="applyStatus"
        label="审批状态"
        width="100"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <el-table-column
        prop="applyNode"
        label="流程名称"
        width="260"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <el-table-column
        prop="applyOpnion"
        label="审批意见"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getApprovalRecord } from '@/api/system/process'
export default {
  props: {
    currentProcessInstanceId: String
  },
  data() {
    return {
      tableData: []
    }
  },
  created() {
    //查找审批记录
    this.getrecords()
  },
  methods: {
    async getrecords() {
      const res = await getApprovalRecord(this.currentProcessInstanceId)
      console.log(res)
      this.tableData = res
    }
  }
}
</script>
<style lang="scss" scoped></style>
