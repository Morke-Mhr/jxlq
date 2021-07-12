<template>
  <div class="app-container">
    <div class="sxForm">
      <el-form ref="form" :model="form" :inline="true" class="demo-form-inline">
        <!-- <el-form-item label="责任人">
            <el-input v-model="form.chargerName" ></el-input>
        </el-form-item>-->
        <el-form-item label="任务类型">
          <el-select v-model="form.type" clearable placeholder="请选择任务类型">
            <el-option
              v-for="(item, index) of typeType"
              :key="index"
              :label="item.dictLabel"
              :value="item.dictCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="时长">
          <el-input
            v-model.number="form.costTime"
            @mousewheel.native.prevent
            oninput="value=value.replace(/[^\d]/g,'')"
            type="number"
            placeholder="时长"
          ></el-input>
        </el-form-item>
        <el-form-item label="时长单位">
          <el-select v-model="form.costTimeUnit" placeholder="请选择时长单位">
            <el-option
              v-for="(item, index) of costTimeUnit"
              :key="index"
              :label="item.title"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <div class="btnCont">
          <el-button class="chaxun" v-has="has.getlist" @click="query"
            >查询</el-button
          >
          <el-button class="chongzhi" @click="Reset">重置</el-button>
        </div>
      </el-form>
    </div>
    <!-- 表头 -->
    <div class="sxTable">
      <el-button class="blue" @click="taskexport()" :loading="exportloading"
        >导出</el-button
      >
      <el-button class="blue" @click="taskbatch('withdraw')">批量撤回</el-button>
      <el-button class="blue" v-has="has.taskUrge" @click="taskbatch('Urging')"
        >批量催办</el-button
      >
      <el-table 
	    style="width: 100%"
	    class="table"
		tooltip-effect="light"
		stripe
		>
        <el-table-column label="任务名称" show-overflow-tooltip></el-table-column>
        <el-table-column label="任务目标" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column label="任务时长"></el-table-column> -->
		<el-table-column label="开始时间"></el-table-column>
		<el-table-column label="结束时间"></el-table-column>
        <el-table-column label="到期天数"></el-table-column>
        <el-table-column label="任务进度"></el-table-column>
        <el-table-column label="类型" width="100"></el-table-column>
        <el-table-column label="权重" width="100"></el-table-column>
        <el-table-column label="难度" width="100"></el-table-column>
      </el-table>
      <!-- 折叠面板 -->
      <el-collapse
        v-model="activeNames"
        @change="handleChange"
        accordion
        v-loading="loading"
      >
        <el-collapse-item
          v-for="(item, index) of taskDecomposeList"
          :key="index"
          :name="index"
        >
          <template slot="title">
            <el-row type="flex" align="middle" class="row" :gutter="24">
              <!-- 标题 -->
              <el-col :span="3" class="col-overflow">{{ item.name }}</el-col>
              <!-- 任务目标 -->
              <el-col :span="4" class="col-overflow">{{ item.content }}</el-col>
              <!-- 任务时长 -->
              <!-- <el-col :span="4" class="col-progress">
                {{ item.costTime }}{{ item.costTimeUnit | costTimeUnit }}
              </el-col> -->
			  <!-- 任务开始时间和结束时间-->
			  <el-col :span="4" class="col-progress">
			    {{ item.startTime }}
			  </el-col>
			  <el-col :span="3" class="col-progress">
			    {{ item.endTime }}
			  </el-col>
              <!-- 时间 -->
              <el-col :span="3" class="col-progress">
                {{ item.endTimeText }}
              </el-col>
              <!-- 进度 -->
              <el-col :span="3">
                <!-- 完成进度 -->
                <el-progress
                  :percentage="item.completeRate"
                ></el-progress> </el-col
              >
              <!-- 标签 -->
              <el-col :span="4" class="col-overflow">
                <el-row>
                  <el-col :span="8">
                    <el-tag>{{ item.typeName }}</el-tag>
                  </el-col>
                  <el-col :span="8">
                    <el-tag type="success">{{ item.priority }}级</el-tag>
                  </el-col>
                  <el-col :span="8">
                    <el-tag type="danger">
                      {{ item.difficultDegree | difficulty }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
          <!-- 表格 -->
          <el-table
            ref="multipleTable"
            :data="item.subTaskList"
            tooltip-effect="light"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            stripe
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="类型" width="120">
              <template slot-scope="scope">{{ scope.row.typeName }}</template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称"
              width="140"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="content"
              label="目标"
              width="280"
              show-overflow-tooltip
            ></el-table-column>

            <el-table-column
              prop="hintMessage"
              label="执行说明"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="权重" width="130">
              <template slot-scope="scope"
                >权重{{ scope.row.priority }}级</template
              >
            </el-table-column>
            <el-table-column label="难度" width="130">
              <template slot-scope="scope">
                {{ scope.row.difficultDegree | difficulty }}
              </template>
            </el-table-column>
            <el-table-column label="责任人" width="130">
              <template slot-scope="scope">
                {{ scope.row.dutyUserName }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="120">
              <template slot-scope="scope">
                {{ scope.row.status | status }}
              </template>
            </el-table-column>
            <!-- <el-table-column label="时长" width="120">
              <template slot-scope="scope">
                {{ scope.row.endTimeText }}
              </template>
            </el-table-column> -->
			<el-table-column label="开始时间" width="100">
			  <template slot-scope="scope">
			    {{ scope.row.startTime }}
			  </template>
			</el-table-column>
			<el-table-column label="结束时间" width="100">
			  <template slot-scope="scope">
			    {{ scope.row.endTime }}
			  </template>
			</el-table-column>
            <el-table-column label="操作" width="110">
              <template slot-scope="scope" v-if="scope.row.status != 11">
                <el-button
                  type="text"
                  v-has="has.putstatus"
                  @click="taskWithdraw(scope.row.taskId)"
                  >撤回</el-button
                >
                <el-button
                  type="text"
                  v-has="has.taskUrge"
                  v-if="scope.row.status == 2 || scope.row.status == 3"
                  @click="taskUrging(index, scope.$index)"
                  >催办</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        background
        layout="total,  prev, pager, next,sizes,jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { gettask } from '@/api/task/iCreated/index' //查询任务接口
import { putTaskStatus } from '@/api/task/iCreated/index' //修改任务状态接口
import { getSelectType } from '@/api/task/iCreated/index' //字典
import { posttaskUrge } from '@/api/task/iCreated/index' //催办
import { postRetractTask } from '@/api/task/iCreated/index' //撤回
import axios from 'axios'
import { getToken } from '@/utils/auth'
export default {
  name: 'decompose',
  data() {
    return {
      has: {
        putstatus: 'task:status:edit',
        getlist: 'task:task:list',
        taskUrge: 'task:post:taskUrge'
      },
      search: '', //搜索内容
      activeNames: [], //打开的下拉
      multipleSelection: [], //已选中数组
      currentPage: 1, //当前页数
      pageSize: 10,
      total: 0, //总条目
      taskDecomposeList: [], //分解任务列表
      typeType: [],
      form: { costTime: '', costTimeUnit: 1 },
      costTimeUnit: [
        { title: '天', value: 0 },
        { title: '小时', value: 1 },
        { title: '月', value: 2 }
      ],
      loading: false,
      treedata: [],
      exportloading: false
    }
  },
  created() {
    this.loading = true
    this.getsele()
  },
  methods: {
    async getTask() {
      this.loading = true
      //我分解的
      let costTimeUnit = ''
      if (this.form.costTime != '') {
        costTimeUnit = this.form.costTimeUnit
      }
      let params = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        operateType: 'split', //查询我分解的
        chargerName: this.form.chargerName,
        typeId: this.form.type,
        costTime: this.form.costTime,
        costTimeUnit: costTimeUnit
      }
      const res = await gettask(params)
      console.log(res) //任务列表
      for (let item of res.rows) {
        item.typeName = this.filet(item.typeId, this.typeType)
        for (let v of item.subTaskList) {
          v.typeName = this.filet(v.typeId, this.typeType)
        }
      }
      this.taskDecomposeList = res.rows
      this.total = res.total
      this.loading = false
    },
    handleChange(val) {
      //折叠面板发生改变
    },
    async getsele() {
      this.typeType = await getSelectType('task_Type')
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
    // 查询
    query() {
      this.pageSize = 10
      this.currentPage = 1
      this.getTask()
    },
    // 重置
    Reset() {
      this.form = { costTime: '', costTimeUnit: 1 }
      this.pageSize = 10
      this.currentPage = 1
      this.getTask()
    },
    //表格全选
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    // 催办
    async taskUrging(index, tasklistindex) {
      //index:taskDecomposeList 父任务下标  tasklistindex子任务下标
      // 点击催办时 判断当前时间时间戳 减去 最新催办时间 如果大于半小时 则允许催办
      //  let currentTime=new Date().getTime()
      //  let urgingTimes=localStorage.getItem("urgingTime")
      //  console.log(urgingTimes)
      //  if(!(JSON.stringify(urgingTimes)==="null")){
      //   if(!(currentTime-urgingTimes > 1800000 ) ){
      //   this.$message({
      //       message: "每半个小时才能催办一次！",
      //       type: "warning"
      //     });
      //       return
      //   }
      //  }
      let parm = []
      let t = {}
      t.dutyUserName = this.taskDecomposeList[index].subTaskList[
        tasklistindex
      ].dutyUserName
      t.dutyUserId = this.taskDecomposeList[index].subTaskList[
        tasklistindex
      ].dutyUserId
      t.taskName = this.taskDecomposeList[index].subTaskList[tasklistindex].name
      t.taskId = this.taskDecomposeList[index].subTaskList[tasklistindex].taskId

      parm.push(t)
      const res = await posttaskUrge(parm)
      this.$message({
        message: res,
        type: 'success'
      })
      // 催办成功后 更新最新催办时间到localStorage
      //  let urgingTime=new Date().getTime()
      //   localStorage.setItem("urgingTime",urgingTime);
    },
    // 撤回
    async taskWithdraw(id) {
      this.$confirm('是否确定撤回该任务', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let taskId = []
          taskId.push(id)
          const res = await postRetractTask(taskId)
          this.getTask()
          this.$message({
            message: res,
            type: 'success'
          })
          return
        })
        .catch(() => {})
    },

    // 批量执行
    async taskbatch(value) {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: '请选择执行批量操作的任务',
          type: 'warning'
        })
        return
      }
      let taskId = [] //任务ID
      let parm = []
      for (let v of this.multipleSelection) {
        let t = {}
        t.dutyUserName = v.dutyUserName
        t.dutyUserId = v.dutyUserId
        t.taskName = v.name
        t.taskId = v.taskId
        parm.push(t)
        taskId.push(v.taskId)
      }
      if (value == 'withdraw') {
        //批量撤回
        this.$confirm('是否批量撤回这些任务', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            const res = await postRetractTask(taskId)
            this.getTask()
            this.$message({
              message: res,
              type: 'success'
            })
            return
          })
          .catch(() => {})
      }
      if (value == 'Urging') {
        for (let item of this.multipleSelection) {
          if (item.status != 2 && item.status != 3) {
            this.$message({
              message: '只能催办状态为已发布和待执行的任务',
              type: 'warning'
            })
            return
          }
        }
        // 点击催办时 判断当前时间时间戳 减去 最新催办时间 如果大于半小时 则允许催办
        //  let currentTime=new Date().getTime()
        //  let urgingTimes=localStorage.getItem("urgingTime")
        //  console.log(urgingTimes)
        //  if(!(JSON.stringify(urgingTimes)==="null")){
        //   if(!(currentTime-urgingTimes > 1800000 ) ){
        //   this.$message({
        //       message: "每半个小时才能催办一次！",
        //       type: "warning"
        //     });
        //       return
        //   }
        //  }
        //批量催办
        const res = await posttaskUrge(parm)
        this.$message({
          message: res,
          type: 'success'
        })
        // 催办成功后 更新最新催办时间到localStorage
        //  let urgingTime=new Date().getTime()
        //   localStorage.setItem("urgingTime",urgingTime);
        return
      }
    },
    handleSizeChange(val) {
      //分页
      this.pageSize = val
      this.getTask()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getTask()
    },
    // 导出
    async taskexport() {
      // 导出接口
      let vm = this
      vm.exportloading = true
      let costTimeUnit = ''
      if (this.form.costTime != '') {
        costTimeUnit = this.form.costTimeUnit
      }
      axios({
        method: 'get',
        url:
          this.$store.state.apiConfiguration.url +
          this.$store.state.serviceName.task +
          '/task/breakDownExport',
        responseType: 'blob', // 表明返回服务器返回的数据类型
        headers: {
          'Content-Type': 'application/json',
          Authorization: getToken()
        },
        //接口参数
        params: {
          chargerName: this.form.chargerName,
          typeId: this.form.type,
          costTime: this.form.costTime,
          costTimeUnit: costTimeUnit
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
        link.download = '我分解的任务.xlsx'
        document.body.appendChild(link)
        //模拟点击事件
        link.click()
        vm.exportloading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
}
.col-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.col-progress {
  line-height: 3rem;
}

.table /deep/ {
  //修改element组件样式  但只作用于当前页面
  .el-table__body-wrapper {
    display: none;
  }
}
.bottom-top-mag {
  margin-bottom: 1rem;
}
</style>
