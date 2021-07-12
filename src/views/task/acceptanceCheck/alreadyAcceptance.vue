<template>
  <div class="app-container">
    <!-- 搜索头 -->
    <div class="sxForm">
      <el-form ref="form" :model="form" :inline="true" class="demo-form-inline">
        <el-form-item label="创建人">
          <el-input v-model="form.createByName"></el-input>
        </el-form-item>
        <el-form-item label="任务类型">
          <el-select v-model="form.type" clearable placeholder="请选择任务类型">
            <el-option
              v-for="(item, index) of dictionaries.typeType"
              :key="index"
              :label="item.dictLabel"
              :value="item.dictCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="form.endTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <div class="btnCont">
          <el-button class="chaxun" v-has="has.getlist" @click="query"
            >查询</el-button
          >
          <el-button class="chongzhi" @click="Reset">重置</el-button>
        </div>
      </el-form>
    </div>
    <div class="sxTable">
      <el-button class="blue" @click="taskexport" :loading="exportloading"
        >导出</el-button
      >
      <!-- 已验收表格 -->
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="light"
        style="width: 100%"
        height="calc(100vh - 380px)"
        @selection-change="handleSelectionChange"
        v-loading="loading"
        stripe
      >
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column
          label="类型"
          width="120"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">{{ scope.row.typeName }}</template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          width="240"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <!-- 满意度 -->
        <el-table-column
          label="满意度"
          width="100"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">
            {{
              scope.row.taskFeedback
                ? scope.row.taskFeedback.degree
                : '' | degree
            }}
          </template>
        </el-table-column>

        <el-table-column
          label="权重"
          width="100"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope"
            >{{ scope.row.priority }}级</template
          >
        </el-table-column>
        <el-table-column
          label="难度"
          width="100"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">
            {{
              scope.row.difficultDegree
                ? scope.row.difficultDegree
                : '' | difficulty
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="责任人"
          width="100"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">{{ scope.row.personLiable }}</template>
        </el-table-column>

        <!-- <el-table-column
          label="实际时长"
          width="120"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.costTime }}{{ scope.row.costTimeUnit | costTimeUnit }}
          </template>
        </el-table-column> -->
				<el-table-column
				  label="开始时间"
				  width="120"
				  show-overflow-tooltip
				  align="center"
				>
				  <template slot-scope="scope">
				    {{ scope.row.startTime }}
				  </template>
				</el-table-column>
				<el-table-column
				  label="结束时间"
				  width="120"
				  show-overflow-tooltip
				  align="center"
				>
				  <template slot-scope="scope">
				    {{ scope.row.endTime }}
				  </template>
				</el-table-column>
				
        <!-- 验收意见 -->
        <el-table-column
          prop="taskFeedback.content"
          label="验收意见"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="执行附件"
          width="100"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="enclosure(scope.$index)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 查看附件 -->
      <el-dialog
        title="附件"
        :visible.sync="getenclosures"
        :close-on-click-modal="false"
        custom-class="small"
      >
        <el-table
          :data="FileList"
          stripe
          height="calc(100vh - 380px)"
          style="width: 100%"
        >
          <el-table-column prop="name" label="附件名称"></el-table-column>
          <el-table-column label="附件大小">
            <template slot-scope="scope">
              <p>{{ scope.row.size ? scope.row.size / 1000 + ' KB' : '' }}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="downloads(scope.$index)"
                >下载</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        background
        layout="total, prev, pager, next,sizes,jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { gettask } from '@/api/task/iCreated/index' //查询任务接口
import axios from 'axios'
import { getToken } from '@/utils/auth'
export default {
  props: {
    dictionaries: {
      type: Object,
      default: {}
    }
  },

  data() {
    return {
      has: {
        getlist: 'task:task:list'
      },
      form: {},
      currentPage: 1, //当前页数
      total: 0, //总条目
      pageSize: 10,
      tableData: [],
      multipleSelection: [], //已选中数组
      FileList: [],
      getenclosures: false,
      loading: false,
      treedata: [], //部门树形
      exportloading: false
    }
  },
  created() {
    this.loading = true
    this.getTask()
  },
  methods: {
    async getTask() {
      //查找已验收的
      this.loading = true
      let params = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        operateType: 'afterChecked',
        createByName: this.form.createByName,
        typeId: this.form.type,
        endTime: this.form.endTime
      }
      const res = await gettask(params)
      this.tableData = res.rows //任务列表
      for (let item of this.tableData) {
        item.personLiable = item.taskUserList.filter(
          (obj) => obj.userType === 1
        )
        if (item.personLiable.length > 0) {
          item.personLiable = item.personLiable[0].userName
        } else {
          item.personLiable = ''
        }
        item.typeName = this.filet(item.typeId, this.dictionaries.typeType)
      }
      this.total = res.total
      this.loading = false
    },
    // 查询
    query() {
      this.pageSize = 10
      this.currentPage = 1
      this.getTask()
    },
    // 重置
    Reset() {
      this.form = {}
      this.pageSize = 10
      this.currentPage = 1
      this.getTask()
    },

    // 过滤
    filet(id, idList) {
      if (!Array.isArray(idList)) {
        return
      }
      id = idList.filter((item) => item.dictCode == id)
      if (id.length > 0) {
        id = id[0].dictLabel
      } else {
        id = ''
      }
      return id
    },
    // 导出
    async taskexport() {
      // 导出接口
      let vm = this
      vm.exportloading = true

      axios({
        method: 'get',
        url:
          this.$store.state.apiConfiguration.url +
          this.$store.state.serviceName.task +
          '/task/acceptedExport',
        responseType: 'blob', // 表明返回服务器返回的数据类型
        headers: {
          'Content-Type': 'application/json',
          Authorization: getToken()
        },
        params: {
          //接口参数
          createByName: this.form.createByName,
          typeId: this.form.type,
          endTime: this.form.endTime
        }
      }).then(function(response) {
        //创建一个隐藏的a连接，
        const link = document.createElement('a')
        let blob = new Blob([response.data], {
          type: 'application/vnd.ms-excel'
        })
        link.style.display = 'none'
        //设置连接
        link.href = URL.createObjectURL(blob)
        link.download = '我已验收的任务.xlsx'
        document.body.appendChild(link)
        //模拟点击事件
        link.click()
        vm.exportloading = false
      })
    },
    // 查看执行附件
    enclosure(index) {
      if (
        typeof this.tableData[index].taskFileList == 'undefined' ||
        this.tableData[index].taskFileList.length == 0
      ) {
        this.$message({
          message: '该任务暂未上传附件',
          type: 'warning'
        })
        return
      }
      this.FileList = this.tableData[index].taskFileList.filter((item) => {
        return item.executeFlag == '0'
      })
      this.getenclosures = true
    },
    // 点击下载附件
    downloads(index) {
      // let download = this.$store.state.apiConfiguration.fileUrl; //下载地址
      // window.open(download + this.FileList[index].path, "_self");
      let download = this.$store.state.apiConfiguration.url //下载地址
      let fileDowloadName =
        download +
        `fs/download?name=${encodeURI(
          encodeURI(this.FileList[index].name)
        )}&path=${this.FileList[index].path}`
      location.href = fileDowloadName
    },
    //全选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      //分页
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.getTask()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.getTask()
    }
  }
}
</script>
<style lang="scss" scoped></style>
