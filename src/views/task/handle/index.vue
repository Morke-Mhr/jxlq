<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
      <el-tab-pane label="待处理" name="pending">
        <!-- 搜索头 -->
        <div class="app-container">
          <div class="sxForm">
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
                <el-select
                  v-model="form.costTimeUnit"
                  placeholder="请选择时长单位"
                >
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
                <el-button class="chongzhi" @click="reset">重置</el-button>
              </div>
            </el-form>
          </div>
          <div class="sxTable">
            <el-button class="blue" @click="taskexport" :loading="exportloading"
              >导出</el-button
            >
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
                label="名称"
                width="200"
                show-overflow-tooltip
                align="center"
              >
                <template slot-scope="scope">{{ scope.row.name }}</template>
              </el-table-column>
              <el-table-column
                prop="content"
                label="目标"
                width="200"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                prop="hintMessage"
                label="说明提示"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                label="权重"
                width="80"
                show-overflow-tooltip
                align="center"
              >
                <template slot-scope="scope"
                  >{{ scope.row.priority }}级</template
                >
              </el-table-column>
              <el-table-column
                label="难度"
                width="80"
                show-overflow-tooltip
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.difficultDegree | difficulty }}
                </template>
              </el-table-column>
              <el-table-column
                label="发起人"
                width="140"
                show-overflow-tooltip
                align="center"
              >
                <template slot-scope="scope">{{ scope.row.createBy }}</template>
              </el-table-column>
              <el-table-column
                label="状态"
                width="120"
                show-overflow-tooltip
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.status | status }}
                </template>
              </el-table-column>
              <!-- <el-table-column
                label="时长"
                width="80"
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
			    width="100"
			    show-overflow-tooltip
			    align="center"
			  >
			    <template slot-scope="scope">
			      {{ scope.row.startTime}}
			    </template>
			  </el-table-column>
			  <el-table-column
			    label="结束时间"
			    width="100"
			    show-overflow-tooltip
			    align="center"
			  >
			    <template slot-scope="scope">
			      {{ scope.row.endTime}}
			    </template>
			  </el-table-column>
              <el-table-column label="操作" width="180" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    v-has="has.detailed"
                    @click="taskhandle(scope.row.taskId)"
                    >处理</el-button
                  >
                  <!-- <el-button type="text" @click="taskAppealbuttom(scope.row.taskId)">申诉</el-button> -->
                  <el-button type="text" @click="decompose(scope.row)"
                    >分解</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <!-- 处理按钮弹出层 -->
            <!--  -->
            <el-dialog
              title="任务信息"
              :close-on-click-modal="false"
              custom-class="small"
              :visible.sync="dialogHandleVisible"
            >
              <el-row>
                <el-col :span="10">
                  <div class="task-dialog-information-head">任务发起</div>
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
                    <div>{{ taskdetails.createDeptName }}</div>
                    <div>{{ taskdetails.startTime }}</div>
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
                  <el-col :span="3">说明提示：</el-col>
                  <el-col :span="21">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 3 }"
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
                        <el-button type="text" @click="downloads(scope.$index)"
                          >下载</el-button
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                </el-row>
              </div>
              <!-- 退回整改 -->
              <div v-if="taskdetails.taskFeedback ? true : false">
                <div style="margin-top:2rem"></div>
                <el-row>
                  <el-col :span="24">
                    <div class="task-dialog-information-head">退回整改</div>
                  </el-col>
                </el-row>
                <div style="margin-top:1rem"></div>
                <div class="task-dialog-information-body">
                  <el-row>
                    <el-col :span="3">
                      <p>验收满意度：</p>
                    </el-col>
                    <el-col :span="21">
                      <p>{{ taskdetails.taskFeedback.degree | degree }}</p>
                      <!-- {{ |degree}} -->
                    </el-col>
                    <el-col :span="3">退回理由：</el-col>
                    <el-col :span="21">
                      <el-input
                        type="textarea"
                        :autosize="{ minRows: 3 }"
                        :value="taskdetails.taskFeedback.content"
                        readonly
                        show-word-limit
                      ></el-input>
                    </el-col>
                  </el-row>
                </div>
              </div>

              <!-- 任务执行  -->
              <div style="margin-top:2rem"></div>
              <el-row>
                <el-col :span="24">
                  <div class="task-dialog-information-head">任务执行</div>
                </el-col>
              </el-row>
              <div style="margin-top:1rem"></div>

              <div class="task-dialog-information-body">
                <!-- 任务执行说明 -->
                <el-row>
                  <el-col :span="3"
                    ><span class="spanRed">*</span>执行说明：</el-col
                  >
                  <el-col :span="21">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 3 }"
                      placeholder="请输入任务执行情况说明"
                      v-model="explain"
					  autocomplete="off"
                      show-word-limit
                      maxlength="300"
                    ></el-input>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="3">任务附件：</el-col>
                  <el-col :span="21">
                    <el-upload
                      class="upload-demo"
                      :action="fileUrl"
                      :on-success="handleSuccess"
                      :on-error="handleError"
                      multiple
                      :on-remove="handleDelete"
                      :limit="6"
                      :file-list="taskFileList"
                    >
                      <el-button class="blue">点击上传</el-button>
                    </el-upload>
                  </el-col>
                </el-row>
                <!-- <el-row class="zhus">
                <el-col :span="24">
                    *注：图片为png、jpg后缀的，文件为doc、xls、zip等后缀的
                </el-col>
                </el-row>-->
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button class="fBtn" @click="cancelHandle"
                  >取 消</el-button
                >
                <el-button
                  class="tBtn"
                  v-has="has.putstatus"
                  @click="submitExecution"
                  >提交</el-button
                >
              </span>
            </el-dialog>

            <!-- 申诉任务弹出层 -->
            <el-dialog
              title="申诉任务"
              :close-on-click-modal="false"
              custom-class="small"
              :visible.sync="dialogAppealVisible"
            >
              <div class="task-dialog-information-appeal">
                <el-row>
                  <el-col :span="3">我想申请：</el-col>
                  <el-col :span="21">
                    <el-radio-group v-model="radio1" @change="taskfiag(radio1)">
                      <el-radio-button label="任务延期"></el-radio-button>
                      <el-radio-button label="任务撤回"></el-radio-button>
                    </el-radio-group>
                  </el-col>
                </el-row>
                <!-- 想延期到 -->
                <el-row v-show="showFileTime">
                  <el-col :span="3">
                    <span class="spanRed">*</span> 想延期到：
                  </el-col>
                  <el-col :span="21">
                    <el-date-picker
                      v-model="extensionDate"
                      :clearable="false"
                      type="date"
                      value-format="yyyy-MM-dd"
                      :picker-options="pickerOptions"
                      placeholder="选择日期"
                    ></el-date-picker>
                    <!-- +当前日期之前的日期都不可选择 -->
                  </el-col>
                </el-row>
                <!-- 申请理由 -->
                <el-row>
                  <el-col :span="3">
                    <span class="spanRed">*</span>申请理由
                  </el-col>
                  <el-col :span="21">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 3 }"
                      placeholder="请输入申请理由"
                      v-model="reason"
                      show-word-limit
                    ></el-input>
                  </el-col>
                </el-row>
                <!-- 相关附件 -->
                <el-row>
                  <el-col :span="3">相关附件</el-col>
                  <el-col :span="21">
                    <el-upload
                      class="upload-demo"
                      :action="fileUrl"
                      :on-success="handleSuccessAppeal"
                      :on-error="handleErrorAppeal"
                      multiple
                      :limit="6"
                      :on-remove="handleAppealDelete"
                      :file-list="fileListAppeal"
                    >
                      <el-button class="blue">点击上传</el-button>
                    </el-upload>
                  </el-col>
                </el-row>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button
                  class="tBtn"
                  v-has="
                    radio1 == '任务延期' ? has.postTaskAppeal : has.putstatus
                  "
                  @click="taskAppeal"
                  >提交</el-button
                >
              </span>
            </el-dialog>
            <!-- 分解 -->
            <el-dialog
              title="任务分解"
              custom-class="large"
              :close-on-click-modal="false"
              :visible.sync="dialogDecomposeVisible"
              v-if="dialogDecomposeVisible"
            >
              <decompose
                :task="task"
                :dictionaries="dictionaries"
                ref="decomposetask"
              ></decompose>
              <span slot="footer" class="dialog-footer">
                <el-button
                  type="primary"
                  @click="addTabledata"
                  icon="el-icon-plus"
                  circle
                ></el-button>
              </span>
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
      </el-tab-pane>
      <el-tab-pane label="已处理" name="processed">
        <processed :dictionaries="dictionaries" ref="processed"></processed>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import processed from './processed' //已处理的子组件
import decompose from './decompose' //分解的子组件
import { gettask } from '@/api/task/iCreated/index' //查询任务接口
import { gettaskId } from '@/api/task/iCreated/index' //查询任务接口
import { putTaskStatus } from '@/api/task/iCreated/index' //修改任务状态接口
import { postTaskAppeal } from '@/api/task/iCreated/index' //任务申诉接口
import { getSelectType } from '@/api/task/iCreated/index' //字典
import axios from 'axios'
import { getToken } from '@/utils/auth'
export default {
  components: {
    processed: processed,
    decompose: decompose
  },
  data() {
    return {
      has: {
        detailed: 'task:task:query',
        putstatus: 'task:status:edit',
        postTaskAppeal: 'checked:appeal:add',
        getlist: 'task:task:list'
      },
      form: { costTime: '', costTimeUnit: 1 },
      costTimeUnit: [
        { title: '天', value: 0 },
        { title: '小时', value: 1 },
        { title: '月', value: 2 }
      ],
      dialogHandleVisible: false, //处理任务弹出层
      dialogAppealVisible: false, //申诉任务弹出层
      dialogDecomposeVisible: false, //分解任务弹出层
      radio1: '任务延期', //申诉选择类型
      extensionDate: '', //延期日期
      pickerOptions: {
        //不可选择日期
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      showFileTime: true,
      reason: '', //申诉理由
      activeName: 'pending', //当前标签页
      circleUrl: '',
      currentPage: 1, //当前页数
      pageSize: 10, //每页多少条
      total: 0, //总条目
      explain: '', //执行说明
      tableData: [], //待处理的数据
      multipleSelection: [], //列表已选中数组
      fileList: [], //执行任务上传的文件
      taskFileList: [], //执行任务上传的文件修改后的数据
      fileUrl: '', //文件上传地址
      fileListAppeal: [], //申诉上传的文件
      task: {}, //当前任务对象 处理 申诉 分解
      taskdetails: {}, //处理任务详情
      taskId: 0, //点击处理获取的当前 任务id
      dictionaries: {},
      treedata: [],
      loading: false,
      exportloading: false
    }
  },
  created() {
    this.loading = true
    this.getsele()
    this.fileUrl = this.$store.state.apiConfiguration.fileUrl + '/fs/upload'
    this.$store.state.tabActive = 'handle'
  },
  methods: {
    addTabledata() {
      this.$refs.decomposetask.addTabledata()
    },
    async getTask() {
      this.loading = true
      let costTimeUnit = ''
      if (this.form.costTime != '') {
        costTimeUnit = this.form.costTimeUnit
      }
      let params = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        operateType: 'waiting', //查找待处理的
        createByName: this.form.createByName,
        typeId: this.form.type,
        costTime: this.form.costTime,
        costTimeUnit: costTimeUnit
      }
      const res = await gettask(params)
      for (let item of res.rows) {
        item.typeName = this.filet(item.typeId, this.dictionaries.typeType)
        item.shortMessage = ''
        item.taskFileList = item.taskFileList.filter((v) => {
          return v.executeFlag == '1'
        })
      }
      this.tableData = res.rows //任务列表
      console.log(this.tableData, 222)
      this.total = res.total
      this.loading = false
    },
    decompose(task) {
      //点击分解按钮
      this.task = task
      this.dialogDecomposeVisible = true
      this.$refs.decomposetask.refresh()
    },
	cancelHandle(){
		this.dialogHandleVisible = false
		this.explain = ""
		this.taskFileList = []
	},
    //任务执行上传
    handleSuccess(response, file, fileList) {
      //文件上传成功的回调
      console.log(response, fileList)
      if (fileList.length > 6) {
        this.$message({
          message: '最多只能上传六个文件',
          type: 'warning'
        })
        this.taskFileList = this.taskFileList.slice(0, 6)
        console.log(this.form)
        return
      }
      if (response.code != 200) {
        //判断当前文件是否上传失败
        this.$message({
          message: '文件上传失败,' + response.message,
          type: 'warning'
        })
        this.taskFileList = []
        return
      }
      let v = []
      for (let item of fileList) {
        let t = {}
        if (item.hasOwnProperty('response')) {
          let type = item.response.body.fileName.split('.').slice(-1) //type  文件格式 ：png doc 。。。
          console.log(type)
          if (type == 'jpg' || type == 'png') {
            t.type = 1
          } else if (type == 'mp3') {
            t.type = 2
          } else if (type == 'mp4') {
            t.type = 3
          } else {
            t.type = 4
          }
          t.name = item.response.body.fileName
          t.path = item.response.body.url
          t.size = item.size
          t.executeFlag = '0'
        } else {
          t = item
        }
        v.push(t)
      }
      this.taskFileList = v //上传成功，将返回结果保存到当前对象表单

      // let v = [];
      // this.fileList=fileList
      // for (let item of fileList) {
      //   if (item.response.code == 200) {
      //     const t = JSON.parse(
      //       JSON.stringify(item.response.body)
      //         .replace(/fileName/g, "name")
      //         .replace(/url/g, "path")
      //     );
      //     let type = item.raw.type.split("/")[1]; //type  文件格式 ：png doc 。。。
      //     if (type == "jpg" || type == "png") {
      //       t.type = 1;
      //     } else if (type == "mp3") {
      //       t.type = 2;
      //     } else if (type == "mp4") {
      //       t.type = 3;
      //     } else {
      //       t.type = 4;
      //     }
      //     t.size = item.size;
      //     t.executeFlag="0"
      //     v.push(t);
      //   } else {
      //     this.$message.error(
      //       "文件" + item.name + "上传失败,错误提示:" + item.response.message
      //     );
      //     return;
      //   }
      // }
    },
    handleError(err, file, fileList) {
      console.log(err)
      this.$message.error('文件上传失败')
    },
    async submitExecution() {
      //提交任务执行
      if (
        parseInt(this.taskdetails.finishAttachedFile) ||
        parseInt(this.taskdetails.finishImgFlag)
      ) {
        //判断该任务是否需要图片或者附件
        if (this.taskFileList.length == 0) {
          this.$message.error('该任务需要上传 任务附件')
          return
        }
      }
      if (!this.explain) {
        this.$message.error('请输入执行说明')
        return
      }
      //循环删除文件ID
      // for(let item in  this.taskdetails.taskFileList){
      //       if(this.taskdetails.taskFileList[item].hasOwnProperty("taskFileId")){
      //          delete this.taskdetails.taskFileList[item].taskFileId
      //       }
      //      }
      //    let filest=[...this.taskdetails.taskFileList,...this.taskFileList]
      let data = {}
      data.type = 'finish'
      data.message = this.explain
      data.taskFileList = this.taskFileList
      data.chargerId = this.$store.getters.userId
      const res = await putTaskStatus(this.taskId, data)
      this.message = ''
      this.taskFileList = []

      this.getTask()
      this.dialogHandleVisible = false
	  this.explain = ""
      this.$message({
        message: res,
        type: 'success'
      })
    },
    taskfiag(v) {
      //选择申诉类型触发
      if (v == '任务撤回') {
        this.showFileTime = false
      } else {
        this.showFileTime = true
      }
      this.reason = ''
      this.fileListAppeal = []
    },
    // 申诉上传
    handleSuccessAppeal(response, file, fileList) {
      console.log(file, fileList)
      let v = []
      for (let item of fileList) {
        if (item.response.code == 200) {
          const t = JSON.parse(
            JSON.stringify(item.response.body)
              .replace(/fileName/g, 'name')
              .replace(/url/g, 'path')
          )
          let type = item.raw.type.split('/')[1] //type  文件格式 ：png doc 。。。
          if (type == 'jpg' || type == 'png') {
            t.type = 1
          } else if (type == 'mp3') {
            t.type = 2
          } else if (type == 'mp4') {
            t.type = 3
          } else {
            t.type = 4
          }
          t.size = item.size
          v.push(t)
        } else {
          this.$message.error(
            '文件' + item.name + '上传失败,错误提示:' + item.response.message
          )
          return
        }
      }
      this.fileListAppeal = v //上传成功，将返回结果保存到当前对象表单
    },
    handleErrorAppeal(err, file, fileList) {
      console.log(err)
      this.$message.error('文件上传失败')
    },
    //从已上传文件删除文件回调 任务执行附件
    handleDelete(file, fileList) {
      console.log(fileList)
      this.taskFileList = fileList //删除成功，将返回结果保存到当前对象表单
    },
    // 申诉 撤回 附件
    handleAppealDelete(file, fileList) {
      console.log(fileList)
      this.fileListAppeal = fileList //删除成功，将返回结果保存到当前对象表单
    },
    taskAppealbuttom(taskId) {
      this.taskId = taskId
      ;(this.extensionDate = ''), (this.reason = '')
      this.fileListAppeal = []
      this.dialogAppealVisible = true
    },

    async taskAppeal() {
      //申诉提交
      if (!this.reason) {
        this.$message({
          message: '申请理由不能为空',
          type: 'warning'
        })
        return
      }
      if (this.radio1 == '任务延期') {
        //任务延期
        if (this.extensionDate == '') {
          this.$message({
            message: '请选择延期时间',
            type: 'warning'
          })
          return
        }
        for (let v of this.fileListAppeal) {
          v.saveType = 3
        }
        let params = {
          flag: 'postpone',
          content: this.reason,
          fileList: this.fileListAppeal,
          finishTime: this.extensionDate
        }
        const res = await postTaskAppeal(this.taskId, params)
        this.dialogAppealVisible = false
        this.getTask()
        this.$message({
          message: res,
          type: 'success'
        })
      } else {
        //任务撤回
        this.$confirm('是否确认撤回此任务', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            let params = {
              type: 'revocation',
              message: this.reason,
              taskFileList: this.fileListAppeal
            }
            const res = await putTaskStatus(this.taskId, params)
            this.dialogAppealVisible = false
            this.getTask()
            this.$message({
              message: res,
              type: 'success'
            })
          })
          .catch(() => {})
      }
    },
    // 附件下载
    downloads(index) {
      if (!this.taskdetails.taskFileList[index].path) {
        return
      }
      //  window.open(download + this.taskdetails.taskFileList[index].path, "_self");

      let download = this.$store.state.apiConfiguration.url //下载地址
      let fileDowloadName =
        download +
        `fs/download?name=${encodeURI(
          encodeURI(this.taskdetails.taskFileList[index].name)
        )}&path=${this.taskdetails.taskFileList[index].path}`
      location.href = fileDowloadName
    },
    //切换标签页触发
    handleClick(tab, event) {
      if (tab.name == 'processed') {
        this.$refs.processed.getTask()
      }
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

    async getsele() {
      this.dictionaries.typeType = await getSelectType('task_Type')
      this.getTask()
    },
    // 查询
    query() {
      this.pageSize = 10
      this.currentPage = 1
      this.getTask()
    },

    // 重置
    reset() {
      this.form = { costTime: '', costTimeUnit: 1 }
      this.pageSize = 10
      this.currentPage = 1
      this.getTask()
    },
    //全选
    handleSelectionChange(val) {
      this.multipleSelection = val
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
      let chargerId = [] //责任人ID
      let params = {
        type: 'revocation'
      }
      for (let v of this.multipleSelection) {
        console.log(v, 1)
        taskId.push(v.taskId)
        chargerId.push(
          v.taskUserList.filter((item) => item.userType === 1)[0].userId
        )
      }
      console.log(taskId, chargerId)
      if (value == 'withdraw') {
        //批量撤回
        const res = await putTaskStatus(taskId, params)
        this.getTask()
        this.$message({
          message: res,
          type: 'success'
        })
        return
      }
      if (value == 'Urging') {
        //批量催办
        // this.$message({
        //   message: res,
        //   type: "success"
        // });
        // return
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
    // 任务处理
    async taskhandle(taskId) {
      const res = await gettaskId(taskId)
      this.taskId = taskId
      res.responsibility = res.taskUserList.filter((obj) => obj.userType === 1)
      res.coordination = res.taskUserList.filter((obj) => obj.userType === 2)
      res.copy_give = res.taskUserList.filter((obj) => obj.userType === 3)
      res.typeName = this.filet(res.typeId, this.dictionaries.typeType)
      res.shortMessage = ''
      res.taskFileList = res.taskFileList.filter((v) => {
        return v.executeFlag == '1'
      })
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
      console.log(res)
      this.dialogHandleVisible = true
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
          '/task/processExport',
        responseType: 'blob', // 表明返回服务器返回的数据类型
        headers: {
          'Content-Type': 'application/json',
          Authorization: getToken()
        },
        params: {
          //接口参数
          createByName: this.form.createByName,
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
        link.download = '我待执行的任务.xlsx'
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
.task-dialog-information-head {
  width: 7rem;
  height: 2.5rem;
  color: #ffffff;
  font-size: 1.04rem;
  font-weight: 530;
  text-align: center;
  line-height: 2.5rem;
  border-radius: 4px;
  background: #02a7f0;
}
.task-dialog-information-headright {
  display: flex;
  height: 3rem;
}
.task-dialog-information-headright > div {
  width: 33.3%;
  line-height: 3rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.task-dialog-information-headright > div:nth-of-type(1) {
  width: 25%;
}
.task-dialog-information-headright > div:nth-of-type(2) {
  width: 40%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.task-dialog-information-headright > div:nth-of-type(3) {
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

// 申诉
.task-dialog-information-appeal > .el-row {
  margin: 1.6rem;
}
.spanRed {
  color: red;
  margin-left: -6px;
}
.item {
  margin-top: 10px;
  margin-right: 40px;
}
.heighttag {
  min-height: 5rem;
}
.zhus {
  font-size: 12px;
  color: #797979;
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

.task-dialog-information-body .el-row {
  min-height: 32px;
}
</style>
