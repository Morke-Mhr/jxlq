<template>
  <div v-if="tableData != null">
    <!-- <p style="margin-left: -40px; font-weight: 600">审批记录</p> -->
    <!-- <table border="1" style="border-collapse: collapse; width: 100%">
      <tr>
        <th class="Title1">审批部门</th>
        <th class="Title1">审批岗位</th>
        <th class="Title2">审批人</th>
        <th class="Title1">审批时间</th>
        <th class="Title2">审批状态</th>
        <th class="Title3">审批意见</th>
      </tr>
      <tr v-for="(item, index) in tableData" :key="index">
        <td>{{ item.applyDeptName }}</td>
        <td>{{ item.applyNode }}</td>
        <td>{{ item.applyUserName }}</td>
        <td>{{ item.applyTime }}</td>
        <td>{{ item.applyStatus }}</td>
        <td>{{ item.applyOpnion }}</td>
      </tr>
    </table> -->
    <div class="formTitle height40">审批记录</div>
    <el-table
      :data="tableData"
      style="width: 100%"
      tooltip-effect="light"
      stripe
    >
      <el-table-column
      align="center"
        prop="applyDeptName"
        label="审批部门"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
      align="center"
        prop="applyNode"
        label="审批岗位"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
      align="center"
        prop="applyUserName"
        label="审批人"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
      align="center"
        prop="applyTime"
        label="审批时间"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
      align="center"
        prop="applyStatus"
        label="审批状态"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
      align="center"
        prop="applyOpnion"
        label="审批意见"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getApproval } from '@/api/approval/approvalProcess'
export default {
  //   props: {
  //     person: String,
  //   },
  data() {
    return {
      tableData: [],
      businessKey: ''
    }
  },
  created() {
    // this.businessKey = this.person;
    // this.getList();
  },
  methods: {
    async getList(e) {
      this.tableData = await getApproval(e)
    }
  }
}
</script>
