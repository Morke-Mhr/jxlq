<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
      <el-tab-pane label="待验收" name="wait">
        <div class="app-container">
          <div class="sxForm">
            <!-- 搜索头 -->
            <el-form
              ref="form"
              :model="form"
              :inline="true"
              class="demo-form-inline"
            >
              <el-form-item label="创建人">
                <el-input v-model="form.createByName"></el-input>
              </el-form-item>
              <el-form-item label="任务类型">
                <el-select
                  v-model="form.type"
                  clearable
                  placeholder="请选择任务类型"
                >
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
            <!-- 待验收表格 -->
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
                  {{ scope.row.difficultDegree | difficulty }}
                </template>
              </el-table-column>
              <el-table-column
                label="责任人"
                width="100"
                show-overflow-tooltip
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.personLiable }}
                </template>
              </el-table-column>

              <!-- <el-table-column
                label="实际时长"
                width="120"
                show-overflow-tooltip
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.costTime
                  }}{{ scope.row.costTimeUnit | costTimeUnit }}
                </template>
              </el-table-column> -->
			<el-table-column
			  label="开始时间"
			  width="120"
			  show-overflow-tooltip
			  align="center"
			>
			  <template slot-scope="scope">
				{{ scope.row.startTime}}
			  </template>
			</el-table-column>
			<el-table-column
			  label="结束时间"
			  width="120"
			  show-overflow-tooltip
			  align="center"
			>
			  <template slot-scope="scope">
				{{ scope.row.endTime}}
			  </template>
			</el-table-column>
							
              <el-table-column
                prop="shortMessage"
                label="执行说明"
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
              <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    v-has="has.gettasks"
                    @click="beforeAcceptance(scope.row.taskId)"
                    >验收</el-button
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
                height="calc(100vh - 380px)"
                stripe
                style="width: 100%"
              >
                <el-table-column prop="name" label="附件名称"></el-table-column>
                <el-table-column label="附件大小">
                  <template slot-scope="scope">
                    <p>
                      {{ scope.row.size ? scope.row.size / 1000 + ' KB' : '' }}
                    </p>
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
            <!-- 验收弹出层 -->
            <el-dialog
              title="任务信息"
              :close-on-click-modal="false"
              v-if="dialogHandleVisible"
              :visible.sync="dialogHandleVisible"
              custom-class="small"
            >
              <el-row>
                <el-col :span="10">
                  <el-tag effect="dark">任务发起</el-tag>
                </el-col>
                <el-col :span="14">
                  <div class="task-dialog-information-headright">
                    <div>
                      <el-avatar
                        :size="15"
                        src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
                      ></el-avatar>
                      {{ taskdetails.createBy }}
                    </div>
                    <p>{{ taskdetails.createDeptName }}</p>
                    <p>{{ taskdetails.startTime }}</p>
                  </div>
                </el-col>
              </el-row>
              <!-- 任务信息  -->
              <div class="task-dialog-information-body">
                <el-row>
                  <el-col justify="center" :span="3">任务标题：</el-col>
                  <el-col justify="center" :span="12">
                    <span class="task-dialog-information-word">
                      {{ taskdetails.name }}
                    </span>
                  </el-col>
                  <el-col :span="9">
                    <el-tag>{{ taskdetails.typeName }}</el-tag>
                    <el-tag type="danger"
                      >权重{{ taskdetails.priority }}级</el-tag
                    >
                    <el-tag type="info">
                      {{ taskdetails.difficultDegree | difficulty }}难度
                    </el-tag>
                  </el-col>
                </el-row>
                <!-- 任务目标 -->
                <el-row>
                  <el-col :span="3">任务目标：</el-col>
                  <el-col :span="21">
                    <span class="task-dialog-information-word">
                      {{ taskdetails.content }}
                    </span>
                  </el-col>
                </el-row>
                <!-- 说明 -->
                <el-row>
                  <el-col :span="3">说明/提示：</el-col>
                  <el-col :span="21">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 3}"
                      :value="taskdetails.hintMessage"
                      readonly
                      show-word-limit
                    ></el-input>
                  </el-col>
                </el-row>
                <!-- 时间 -->
                <el-row>
                  <el-col :span="3">时间：</el-col>
                  <el-col :span="21" class="task-dialog-information-word">
                    {{ taskdetails.startTime }} 到 {{ taskdetails.endTime }}
                  </el-col>
                  <!-- <el-col :span="4">
                    时长：{{ taskdetails.costTime
                    }}{{ taskdetails.costTimeUnit | costTimeUnit }}
                  </el-col> -->
                </el-row>
                <!-- 人 -->
                <el-row :gutter="30">
                  <el-col :span="8">责任人：</el-col>
                  <el-col :span="8">协同人：</el-col>
                  <el-col :span="8">抄送人：</el-col>
                </el-row>
                <el-row :gutter="30">
                  <el-col :span="8">
                    <el-card
                      class="heighttag"
                      v-if="
                        taskdetails.responsibility
                          ? taskdetails.responsibility.length != 0
                          : false
                      "
                    >
                      <!-- 责任人 -->
                      <el-tag
                        v-for="(item, index) in taskdetails.responsibility"
                        :key="index"
                        >{{ item.userName }}</el-tag
                      >
                    </el-card>
                    <el-card class="heighttag" v-else>
                      <el-tag>无</el-tag>
                    </el-card>
                  </el-col>
                  <el-col :span="8">
                    <el-card
                      class="heighttag"
                      v-if="
                        taskdetails.coordination
                          ? taskdetails.coordination.length != 0
                          : false
                      "
                    >
                      <!-- 协同人 -->
                      <el-tag
                        v-for="(item, index) in taskdetails.coordination"
                        :key="index"
                        >{{ item.userName }}</el-tag
                      >
                    </el-card>
                    <el-card class="heighttag" v-else>
                      <el-tag>无</el-tag>
                    </el-card>
                  </el-col>
                  <el-col :span="8">
                    <el-card
                      class="heighttag"
                      v-if="
                        taskdetails.copy_give
                          ? taskdetails.copy_give.length != 0
                          : false
                      "
                    >
                      <!-- 抄送人 -->
                      <el-tag
                        v-for="(item, index) in taskdetails.copy_give"
                        :key="index"
                        >{{ item.userName }}</el-tag
                      >
                    </el-card>
                    <el-card class="heighttag" v-else>
                      <el-tag>无</el-tag>
                    </el-card>
                  </el-col>
                </el-row>
                <!-- 附件 -->
                <el-row>
                  <el-col :span="24">附件：</el-col>
                </el-row>
                <!-- 文件 -->
                <el-row>
                  <el-table
                    :data="taskdetails.isestablish"
                    height="250"
                    stripe
                    style="width: 100%"
                  >
                    <el-table-column
                      prop="name"
                      label="附件名称"
                    ></el-table-column>
                    <el-table-column label="附件大小">
                      <template slot-scope="scope">
                        <p>
                          {{
                            scope.row.size ? scope.row.size / 1000 + ' KB' : ''
                          }}
                        </p>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                      <template slot-scope="scope">
                        <el-button
                          type="text"
                          @click="downloadsLaunch(scope.$index)"
                          >下载</el-button
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                </el-row>
              </div>
              <!-- 任务执行  -->
              <div style="margin-top: 2rem"></div>
              <el-row>
                <el-col :span="10">
                  <el-tag effect="dark">任务执行</el-tag>
                </el-col>
                <el-col :span="14">
                  <div class="task-dialog-information-headright">
                    <div>
                      <el-avatar
                        :size="15"
                        src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
                      ></el-avatar>
                      {{ taskdetails.responsibility[0].userName }}
                    </div>
                    <p>{{ taskdetails.executeDeptName }}</p>
                    <p>{{ taskdetails.updateTime }}</p>
                  </div>
                </el-col>
              </el-row>
              <div style="margin-top: 1rem"></div>

              <div class="task-dialog-information-body">
                <!-- 备注说明 -->
                <el-row>
                  <el-col :span="3">执行说明：</el-col>
                  <el-col :span="21">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 3}"
                      :value="taskdetails.shortMessage"
                      readonly
                      show-word-limit
                    ></el-input>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">附件：</el-col>
                </el-row>
                <!-- 附件 -->
                <el-row>
                  <el-table
                    :data="taskdetails.ishandle"
                    height="250"
                    stripe
                    style="width: 100%"
                  >
                    <el-table-column
                      prop="name"
                      label="文件名称"
                    ></el-table-column>
                    <el-table-column label="附件大小">
                      <template slot-scope="scope">
                        <p>
                          {{
                            scope.row.size ? scope.row.size / 1000 + ' KB' : ''
                          }}
                        </p>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                      <template slot-scope="scope">
                        <el-button
                          type="text"
                          @click="downloadsImplement(scope.$index)"
                          >下载</el-button
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                </el-row>
              </div>
              <!-- 任务验收 -->
              <div style="margin-top: 2rem"></div>
              <el-row>
                <el-col :span="24">
                  <el-tag effect="dark">任务验收</el-tag>
                </el-col>
              </el-row>
              <div style="margin-top: 1rem"></div>
              <div class="task-dialog-information-body">
                <!-- 满意度 -->
                <el-row>
                  <el-col :span="3"><span class="spanRed">*</span>完成满意度:</el-col>
                  <el-col :span="21">
                    <div>
                      <el-radio-group v-model="radio" size="medium">
                        <el-radio-button label="非常满意"></el-radio-button>
                        <el-radio-button label="满意"></el-radio-button>
                        <el-radio-button label="一般"></el-radio-button>
                        <el-radio-button label="不满意"></el-radio-button>
                        <el-radio-button label="很不满意"></el-radio-button>
                      </el-radio-group>
                    </div>
                  </el-col>
                </el-row>
                <!-- 意见 -->
                <el-row>
                  <el-col :span="3"><span class="spanRed">*</span>验收意见:</el-col>
                  <el-col :span="21">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 3}"
                      v-model="opinion"
                      show-word-limit
                      maxlength="300"
                    ></el-input>
                  </el-col>
                </el-row>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button class="tBtn" v-has="has.putstatus" @click="complete"
                  >完成验收</el-button
                >
                <el-button
                  class="tBtn"
                  v-has="has.putstatus"
                  @click="rectification"
                  >退回整改</el-button
                >
                <el-button class="tBtn" @click="replace">更换责任人</el-button>
              </span>
            </el-dialog>
            <!-- 选择责任人 -->
            <sdialog
              ref="sdialog"
              @choiceUser="choiceUser"
              :showclose="true"
              :isDx="true"
              :sNeed="true"
              needData="zrUser"
              dxId="zrUserId"
              :transferProps="{
                key: 'userId',
                label: 'realName'
              }"
              :treedata="treedata"
            ></sdialog>
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
      </el-tab-pane>
      <el-tab-pane label="已验收" name="already">
        <alreadyAcceptance
          :dictionaries="dictionaries"
          ref="already"
        ></alreadyAcceptance>
      </el-tab-pane>
      <el-tab-pane label="分解任务验收" name="decompose">
        <decomposeAcceptance
          :dictionaries="dictionaries"
          ref="decompose"
        ></decomposeAcceptance>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import alreadyAcceptance from './alreadyAcceptance' //已验收
import decomposeAcceptance from './decomposeAcceptance' //分解验收
import { gettask } from '@/api/task/iCreated/index' //查询任务接口
import { gettaskId } from '@/api/task/iCreated/index' //查询任务接口
import { putTaskStatus } from '@/api/task/iCreated/index' //修改任务状态接口
import { getSelectType } from '@/api/task/iCreated/index' //字典
import Sdialog from '@/components/selectDialog' //通过部门选择人
import { getTreeSelect } from '@/api/system/process' // 部门列表
import axios from 'axios'
import { getToken } from '@/utils/auth'
export default {
  name: 'acceptanceindex',
  components: {
    alreadyAcceptance: alreadyAcceptance, //已验收子组件
    Sdialog: Sdialog,
    decomposeAcceptance: decomposeAcceptance //分解任务验收子组件
  },
  data() {
    return {
      has: {
        gettasks: 'task:task:query',
        putstatus: 'task:status:edit',
        getlist: 'task:task:list'
      },
      form: {},
      activeName: 'wait', //当前标签页
      currentPage: 1, //当前页数
      total: 0, //总条目
      pageSize: 10,
      tableData: [],
      multipleSelection: [], //已选中数组
      dialogHandleVisible: false, //验收弹出层
      innerVisible: false, //选择责任人内层弹出层
      taskId: 0, //当前待验收任务Id
      taskdetails: {}, //根据ID查询出的任务详情对象
      radio: '', //满意度
      opinion: '', // 验收意见
      dictionaries: {}, //类型字典
      FileList: [], //附件列表
      getenclosures: false,
      download: '', //下载地址
      treedata: [], //部门树形
      loading: false,
      exportloading: false
    }
  },
  created() {
    this.loading = true
    this.download = this.$store.state.apiConfiguration.fileUrl //下载地址
    this.getsele() //类型字典
    this.$store.state.tabActive = 'acceptanceCheck'
  },
  methods: {
    async getTask() {
      //查找待验收的
      this.loading = true
      let params = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        operateType: 'beforeChecked',
        isInitiate: '0', //查询没有父任务ID的
        createByName: this.form.createByName,
        typeId: this.form.type,
        endTime: this.form.endTime
      }
      const res = await gettask(params)
      this.tableData = res.rows //任务列表
      console.log(res, 1212)

      for (let item of this.tableData) {
        if (item.taskUserList.length == 0 || !item.taskUserList) {
          item.personLiable = ''
        } else {
          item.personLiable = item.taskUserList.filter(
            (obj) => obj.userType == 1
          )[0].userName
        }
        item.typeName = this.filet(item.typeId, this.dictionaries.typeType)
      }
      this.total = res.total
      this.loading = false
    },

    async getsele() {
      this.dictionaries.typeType = await getSelectType('task_Type')
      this.getTask() //任务列表
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
    handleClick(tab, event) {
      //切换标签页触发
      if (tab.name == 'already') {
        this.$refs.already.getTask()
      } else if (tab.name == 'decompose') {
        this.$refs.decompose.getTask()
      }
    },
    // 查看附件
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
      if (!!this.tableData[index].taskFileList) {
        //如果taskFileList有的话就执行下面操作
        this.tableData[index].ishandle = this.tableData[
          index
        ].taskFileList.filter((item) => {
          return item.executeFlag == '0'
        })
        this.tableData[index].isestablish = this.tableData[
          index
        ].taskFileList.filter((item) => {
          return item.executeFlag == '1'
        })
      }
      this.FileList = this.tableData[index].ishandle
      this.getenclosures = true
    },
    // 点击下载附件
    downloads(index) {
      // window.open(this.download + this.FileList[index].path, "_self");
      let download = this.$store.state.apiConfiguration.url //下载地址
      let fileDowloadName =
        download +
        `fs/download?name=${encodeURI(
          encodeURI(this.FileList[index].name)
        )}&path=${this.FileList[index].path}`
      location.href = fileDowloadName
    },

    // 点击下载发起人附件
    downloadsLaunch(index) {
      // window.open(
      //   this.download + this.taskdetails.isestablish[index].path,
      //   "_self"
      // );

      let download = this.$store.state.apiConfiguration.url //下载地址
      let fileDowloadName =
        download +
        `fs/download?name=${encodeURI(
          encodeURI(this.taskdetails.isestablish[index].name)
        )}&path=${this.taskdetails.isestablish[index].path}`
      location.href = fileDowloadName
    },
    // 点击下载执行人附件
    downloadsImplement(index) {
      // window.open(
      //   this.download + this.taskdetails.ishandle[index].path,
      //   "_self"
      // );

      let download = this.$store.state.apiConfiguration.url //下载地址
      let fileDowloadName =
        download +
        `fs/download?name=${encodeURI(
          encodeURI(this.taskdetails.ishandle[index].name)
        )}&path=${this.taskdetails.ishandle[index].path}`
      location.href = fileDowloadName
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
          '/task/pendingAcceptanceExport',
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
        link.download = '我待验收的任务.xlsx'
        document.body.appendChild(link)
        //模拟点击事件
        link.click()
        vm.exportloading = false
      })
    },
    //全选
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
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
    async beforeAcceptance(taskId) {
      this.taskId = taskId
      let res = await gettaskId(taskId)
      res.responsibility = res.taskUserList.filter((obj) => obj.userType === 1)
      res.coordination = res.taskUserList.filter((obj) => obj.userType === 2)
      res.copy_give = res.taskUserList.filter((obj) => obj.userType === 3)
      res.typeName = this.filet(res.typeId, this.dictionaries.typeType)
      this.taskdetails = res

      if (!!this.taskdetails.taskFileList) {
        //如果taskFileList有的话就执行下面操作
        this.taskdetails.ishandle = this.taskdetails.taskFileList.filter(
          (item) => {
            return item.executeFlag == '0'
          }
        )
        this.taskdetails.isestablish = this.taskdetails.taskFileList.filter(
          (item) => {
            return item.executeFlag == '1'
          }
        )
      }
      console.log(this.taskdetails)
      this.dialogHandleVisible = true
      // 清空数据
      this.value = {}
      this.radio = ''
      this.opinion = ''
    },
    async complete() {
      //完成验收
      if (this.radio == '' || this.opinion == '') {
        this.$message({
          message: '请选择满意度或输入验收意见',
          type: 'warning'
        })
        return
      }
      let radio = 0
      if (this.radio == '非常满意') {
        radio = 0
      } else if (this.radio == '满意') {
        radio = 1
      } else if (this.radio == '一般') {
        radio = 2
      } else if (this.radio == '不满意') {
        radio = 3
      } else if (this.radio == '很不满意') {
        radio = 4
      }
      let params = {
        type: 'checked',
        message: this.opinion,
        degree: radio
      }
      const res = await putTaskStatus(this.taskId, params)
      this.dialogHandleVisible = false
      this.getTask()
      this.$message({
        message: res,
        type: 'success'
      })
    },
    async rectification() {
      if (this.radio == '' || this.opinion == '') {
        this.$message({
          message: '请选择满意度或输入验收意见',
          type: 'warning'
        })
        return
      }
      let radio = 0
      if (this.radio == '非常满意') {
        radio = 0
      } else if (this.radio == '满意') {
        radio = 1
      } else if (this.radio == '一般') {
        radio = 2
      } else if (this.radio == '不满意') {
        radio = 3
      } else if (this.radio == '很不满意') {
        radio = 4
      }
      //退回整改
      this.$confirm('是否确认将此任务退回整改', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let params = {
            type: 'back',
            degree: radio,
            message: this.opinion
          }
          const res = await putTaskStatus(this.taskId, params)
          this.dialogHandleVisible = false
          this.getTask()
          this.$message({
            message: res,
            type: 'success'
          })
        })
        .catch(() => {})
    },
    //更换责任人
    async replace() {
      if (this.radio == '' || this.opinion == '') {
        this.$message({
          message: '请选择满意度或输入验收意见',
          type: 'warning'
        })
        return
      }
      this.treedata = await getTreeSelect()
      this.$refs.sdialog.isShow = true
    },
    async choiceUser(UserID, UserList) {
      if (UserID.length == 0) {
        this.$message({
          message: '请选择责任人',
          type: 'warning'
        })
        return
      }
      let primary = ''
      if (
        !this.taskdetails.taskUserList ||
        this.taskdetails.taskUserList.length == 0
      ) {
        primary = ''
      } else {
        primary = this.taskdetails.taskUserList.filter(
          (obj) => obj.userType == 1
        )[0].userId
      }
      if (primary == UserID[0]) {
        this.$message({
          message: '不能选择原责任人',
          type: 'warning'
        })
        return
      }
      let radio = 0
      if (this.radio == '非常满意') {
        radio = 0
      } else if (this.radio == '满意') {
        radio = 1
      } else if (this.radio == '一般') {
        radio = 2
      } else if (this.radio == '不满意') {
        radio = 3
      } else if (this.radio == '很不满意') {
        radio = 4
      }
      this.$refs.sdialog.isShow = false
      this.$confirm(
        '是否确认将此任务的责任人更换成' + UserList[0].userName,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          let params = {
            type: 'replaceChargePerson',
            message: this.opinion,
            degree: radio,
            dutyUserId: UserList[0].userId,
            dutyUserName: UserList[0].userName
              ? UserList[0].userName
              : UserList[0].realName
          }
          const res = await putTaskStatus(this.taskId, params)
          this.dialogHandleVisible = false
          this.getTask()
          this.$message({
            message: res,
            type: 'success'
          })
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.spanRed {
  color: red;
  margin-left: -6px;
}
.task-dialog-information-headright {
  display: flex;
  height: 3rem;
}
.task-dialog-information-headright > div {
  width: 33.3%;
  margin-right: 1px;
  line-height: 3rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.task-dialog-information-headright > div:nth-of-type(1) {
  width: 25%;
}
.task-dialog-information-headright > p:nth-of-type(1) {
  width: 40%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.task-dialog-information-headright > p:nth-of-type(2) {
  text-align: right;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-dialog-information-body {
  padding: 0.5rem;
  margin: auto;
  border: 1px solid #797979;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  min-height: 3.5rem;
}
.task-dialog-information-body > .el-row {
  margin: 0.7rem;
}
.task-dialog-information-word {
  font-size: 1.02rem;
  font-weight: 540;
}
.task-dialog-information-file {
  width: 30%;
  display: flex;
  margin: 0.7rem;
}
.task-dialog-information-file > div {
  display: flex;
  flex-wrap: wrap;
  width: 70%;
  height: 4rem;
}
.task-dialog-information-file > div > div {
  width: 100%;
  height: 50%;
}
.task-flexible {
  display: flex;
  flex-wrap: wrap;
}
.task-dialog-information-submit {
  margin-top: 2rem;
}
.heighttag {
  min-height: 5rem;
}
</style>
<style lang="scss">
.task-header {
  margin: 1.5rem;
}
.task-header-sort {
  display: flex;
}
.task-header-sort > div {
  width: 15%;
  height: 100%;
  align-self: center;
  cursor: pointer;
}
</style>
