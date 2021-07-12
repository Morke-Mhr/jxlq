<template>
  <div class="app-container personal-page" style="background: #f2f2f2">
    <div class="personal">
      <el-row :gutter="20">
        <el-col :span="7">
          <div class="person-info">
            <div class="head-img">
              <img :src="userImge" />
            </div>
            <div class="personal-name">{{ name }}</div>
            <div class="info-font person-dept">{{ postDeptName }}</div>
            <div class="person-email info-font">邮箱:{{ email }}</div>
            <div class="person-telphone info-font">电话:{{ telphone }}</div>
            <div class="person-info-btn">
              <span @click="editDialg">编辑</span>
              <span @click="editPasswordDialg">修改密码</span>
            </div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="safety-reward">
            <div class="area-tit">安全奖罚</div>
            <ve-line id="rewardChart" :data="chartData1" ref="chart4"></ve-line>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="person-my-log">
            <div class="area-tit">我的日志</div>
            <div class="my-log">
              <el-calendar v-model="value">
                <template slot="dateCell" slot-scope="{ date, data }">{{
                  data.day
                    .split('-')
                    .slice(2)
                    .join('-')
                }}</template>
              </el-calendar>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="center-part">
        <el-col :span="17">
          <div class="personal-task">
            <div class="area-tit">
              <span>任务统计</span>
              <el-select
                v-model="monthValue"
                placeholder="月度筛选"
                @change="ChangeMonth"
                style="width: 110px; float: right; margin-right: 20px"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <el-col :span="16">
              <div class="fl-task-box clearfix">
                <span class="task-tit">完成任务数</span>
                <div class="progress-box">
                  <el-progress
                    :text-inside="true"
                    :stroke-width="20"
                    :percentage="endTask.completionRate"
                    :color="endTaskColor"
                  ></el-progress>
                </div>
                <div class="task-num">
                  <p>
                    总任务:<span>{{ endTask.totalNumber }}</span>
                  </p>
                  <p>
                    已完成:<span>{{ endTask.completedNumber }}</span>
                  </p>
                </div>
              </div>
              <div class="fl-task-box clearfix">
                <span class="task-tit">完成隐患整改数</span>
                <div class="progress-box">
                  <el-progress
                    :text-inside="true"
                    :stroke-width="20"
                    :percentage="endHidden.completionRate"
                    :color="endHiddenColor"
                  ></el-progress>
                </div>
                <div class="task-num">
                  <p>
                    总任务:<span>{{ endHidden.totalNumber }}</span>
                  </p>
                  <p>
                    已整改:<span>{{ endHidden.completedNumber }}</span>
                  </p>
                </div>
              </div>
              <div class="fl-task-box">
                <span class="task-tit">参加培训数</span>
                <div class="progress-box">
                  <el-progress
                    :text-inside="true"
                    :stroke-width="20"
                    :percentage="joinTrain.completionRate"
                    :color="joinTrainColor"
                  ></el-progress>
                </div>
                <div class="task-num">
                  <p>
                    总任务:<span>{{ joinTrain.totalNumber }}</span>
                  </p>
                  <p>
                    已参加:<span>{{ joinTrain.completedNumber }}</span>
                  </p>
                </div>
              </div>
            </el-col>
            <el-col :span="8" style="text-align: center; margin-top: 30px">
              <el-progress
                type="circle"
                :stroke-width="12"
                :percentage="totalCompletionRate"
                :format="format"
              ></el-progress>
            </el-col>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="person-process">
            <div class="area-tit">流程图</div>
            <div class="process-box">
              <p
                v-for="(item, index) in processNum"
                :key="index"
                @click="getProcess(index)"
              >
                {{ item.workprocessName }}
              </p>
              <!-- <p v-for="(item,index) in processNum">{{item}}</p> -->
            </div>
            <el-dialog
              title="流程图"
              :visible.sync="dialogVisibleT"
              custom-class="large"
              :before-close="handleClose"
              append-to-body
            >
              <div id="vue-g6-editor">
                <div class="editor" style="width: 100%">
                  <!-- 元素面板 + 画布 + 属性栏 -->
                  <el-row>
                    <!-- 画布 -->
                    <el-col :span="24"
                      ><div
                        id="page"
                        style="width: 100%; display: block; height: 92vh"
                      ></div
                    ></el-col>
                    <!-- 属性栏 -->
                  </el-row>
                </div>
              </div>
            </el-dialog>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="person-footer">
        <el-col :span="17">
          <div class="fl-safety">
            <div class="area-tit">安全绩效</div>
            <!-- <div id="safetyCharts"></div> -->
            <ve-histogram id="safetyCharts" :data="chartData2"></ve-histogram>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="person-job">
            <div class="area-tit">岗位职责</div>
            <div class="my-job">
              <p>{{ JobPosition.responsibility }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!--日志弹窗-->
    <el-card class="box-card" v-show="cardDay">
      <div slot="header" class="clearfix">
        <!-- <span>卡片名称</span> -->
        <el-button
          style="float: right; padding: 3px 0; border: none"
          icon="el-icon-close"
          @click="cardDay = false"
        ></el-button>
      </div>
      <div class="card-content">
        <div class="log-Info">
          <div>{{ this.name }}</div>
          <div class="log-position">{{ this.postDeptName }}</div>
          <div class="weather-position">
            <div id="he-plugin-simple"></div>
          </div>
        </div>
        <div class="log-area">
          <div class="log-tit">今日完成工作记述</div>
          <div class="log-content">
            {{ lookSecurity.todayFinish }}
          </div>
        </div>
        <div class="log-area">
          <div class="log-tit">今日工作备忘</div>
          <div class="log-content">{{ lookSecurity.todayMemo }}</div>
        </div>
        <div class="log-area">
          <div class="log-tit">明日工作安排</div>
          <div class="log-content">{{ lookSecurity.tomorrowWork }}</div>
        </div>
        <div class="log-area">
          <div class="log-tit">检查情况及采取措施</div>
          <div class="log-content">{{ lookSecurity.checkSituation }}</div>
        </div>
        <div class="log-area">
          <div class="log-tit">其他有关事项记录</div>
          <div class="log-content">{{ lookSecurity.otherMatter }}</div>
        </div>
        <div class="log-sign">
          <div class="log-tit">
            电子签名:<span>
              <img
                class="img"
                :src="
                  $store.state.apiConfiguration.fileUrl + lookSecurity.signUrl
                "
                alt=""
              />
            </span>
          </div>
        </div>
      </div>
    </el-card>

    <!--编辑弹窗-->
    <el-dialog
      title="编辑"
      :visible.sync="editDialgVisible"
      custom-class="large"
      left
    >
      <el-form
        :model="user"
        :rules="formRules"
        ref="user"
        label-width="120px"
        label-position="left"
      >
        <el-form-item label="上传头像">
          <el-upload
            class="avatar-uploader"
            :action="getUrl"
            :headers="geHeaders"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="user.avatar" :src="getUserImg" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="岗位">
          <el-input
            v-model="user.postName"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="岗位"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="phonenumber">
          <el-input
            v-model="user.phonenumber"
            maxlength="11"
            show-word-limit
            placeholder="手机号码"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input
            v-model="user.email"
            maxlength="30"
            show-word-limit
            placeholder="用户邮箱"
          />
        </el-form-item>
      </el-form>
      <!-- <span>需要注意的是内容是默认不居中的</span> -->
      <div style="text-align: right">
        <el-button class="confirm-btn" @click="confimInfo"> 提交 </el-button>
        <el-button class="cancel-btn" @click="editDialgVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

    <!--修改密码弹窗-->
    <el-dialog
      title="修改密码"
      :visible.sync="editPasswordDialgVisible"
      custom-class="small"
      left
    >
      <el-form
        :model="editPass"
        :rules="formRules"
        ref="editPass"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="editPass.oldPassword"
            maxlength="16"
            show-word-limit
            minlength="6"
            placeholder="原密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="editPass.newPassword"
            maxlength="16"
            minlength="6"
            show-word-limit
            placeholder="请输入6~16位新密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="affirmPassword">
          <el-input
            v-model="editPass.affirmPassword"
            maxlength="16"
            minlength="6"
            show-word-limit
            placeholder="确认密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <!-- <span>需要注意的是内容是默认不居中的</span> -->
      <div style="text-align: right">
        <el-button class="confirm-btn" @click="confimPassword('editPass')">
          提交
        </el-button>
        <el-button class="cancel-btn" @click="editPasswordDialgVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import headImg from '@/assets/header.png'
// import './heweather.js';
import weather from './heweather.js'
import store from '@/store/index.js'
import { getToken } from '@/utils/auth'
import { isBasicDate } from '@/utils/date'
import userImg from '../../../public/img/userImg.gif'
// import { getJobPosition } from "@/api/job/jobPosition"; //流程图
import {
  getUser,
  getCheck,
  rewardPunishMoneyChart,
  assessmentRecordByMonth,
  getMyTaskStatistics
} from '@/api/system/user'
import { getlookWorkchart } from '@/api/job/workChart'
import { getJobPosition } from '@/api/job/jobPosition' //岗位职责
import { getEditPassword, getEditInfo } from '@/api/personCenter/index'
import G6Editor from '@antv/g6-editor'
let date = new Date()
let dateMonth = date.getMonth()

export default {
  data() {
    return {
      //用户id
      userId: store.getters.userId,
      //头像
      headImg: headImg,
      //姓名
      name: store.getters.userName,
      // name: "江海达",
      //部门
      postDeptName: '',
      //邮箱
      email: '11982797@qq.com',
      //电话
      telphone: '1871982973',
      //岗位职责
      JobPosition: '',
      //日志表
      value: new Date(),
      //安全日志弹框数据
      lookSecurity: {},
      //选择的月份
      dateMonth: dateMonth,
      //流程图弹窗
      dialogVisibleT: false,
      //完成任务数进度条颜色
      endTaskColor: '#F7B500',
      endTask: {},
      //完成隐患整改进度条颜色
      endHiddenColor: '#5583FE',
      endHidden: {},
      //参加培训书进度条颜色
      joinTrainColor: '#ED625E',
      joinTrain: {},
      //已完成饼状图
      totalCompletionRate: '',
      //流程图
      processNum: [],
      num: 5,
      monthValue: '',
      //安全奖罚
      chartData1: {
        columns: ['日期', '奖励金额', '惩罚金额'],
        rows: []
      },
      chartData2: {
        columns: ['日期', '分数'],
        rows: []
      },
      //日历卡片
      cardDay: false,
      //编辑弹窗
      editDialgVisible: false,
      //修改密码弹窗
      editPasswordDialgVisible: false,
      //编辑对象
      user: {
        email: '1256358@qq.com',
        avatar: '',
        phonenumber: '8888',
        postName: '',
        userId: '',
        userName: '',
        gender: '',
        realName: '',
        remark: '',
        cardId: '',
        userBirth: ''
      },
      //修改密码
      editPass: {
        //原密码
        oldPassword: '',
        //新密码
        newPassword: '',
        //确认密码
        affirmPassword: ''
      },
      //表单验证方法
      formRules: {
        oldPassword: [
          {
            required: true,
            message: '请输入原密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur'
          }
        ],
        newPassword: [
          {
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur'
          }
        ],
        affirmPassword: [
          {
            required: true,
            message: '请输入确认密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur'
          }
        ]
      },
      options: [
        {
          value: '1',
          label: '一月'
        },
        {
          value: '2',
          label: '二月'
        },
        {
          value: '3',
          label: '三月'
        },
        {
          value: '4',
          label: '四月'
        },
        {
          value: '5',
          label: '五月'
        },
        {
          value: '6',
          label: '六月'
        },
        {
          value: '7',
          label: '七月'
        },
        {
          value: '8',
          label: '八月'
        },
        {
          value: '9',
          label: '九月'
        },
        {
          value: '10',
          label: '十月'
        },
        {
          value: '11',
          label: '十一月'
        },
        {
          value: '12',
          label: '十二月'
        }
      ]
    }
  },
  created() {
    this.MyTaskStatistics()
  },
  computed: {
    userImge: function() {
      if (
        store.state.user.user.avatar == '' ||
        store.state.user.user.avatar === undefined
      ) {
        return userImg
      } else {
        return (
          store.state.apiConfiguration.fileUrl +
          '/' +
          store.state.user.user.avatar
        )
      }
    },
    getUrl() {
      return store.state.apiConfiguration.imgFileUrl + '/user/profile/avatar'
    },
    geHeaders() {
      return { Authorization: getToken() }
    },
    getUserImg() {
      return store.state.apiConfiguration.fileUrl + '/' + this.user.avatar
    }
  },
  mounted() {
    this.getRewardChart()
    this.myLogAlert()
    //个人信息接口
    this.getUserInfo()
    weather('he-plugin-simple')
  },
  methods: {
    //修改个人信息
    async confimInfo() {
      delete this.user.postName
      let res = await getEditInfo(this.user)
      this.$notify({
        title: res ? '成功' : '失败',
        dangerouslyUseHTMLString: true,
        message: res ? res.message : '服务器开小差了，请稍后再试',
        type: res ? 'success' : 'warning'
      })
      this.editDialgVisible = false
    },

    //提交密码
    confimPassword(editpassForm) {
		this.$refs[editpassForm].validate(async (valid) => {
			if (!valid) {
				  this.$notify({
					title: "操作失败",
					dangerouslyUseHTMLString: true,
					message: "请填写完整",
					type: "warning",
				  });
				  return;
				}
				if (this.editPass.newPassword != this.editPass.affirmPassword) {
				  this.$message({
					message: '确认密码与新密码不一致!',
					type: 'warning'
				  })
				} else if (this.editPass.newPassword == this.editPass.affirmPassword) {
				  this.getEditPass()
				  this.editPasswordDialgVisible = false
				}	
		});
    },
    //重置密码接口
    async getEditPass() {
      let data = {
        oldPassword: this.editPass.oldPassword,
        newPassword: this.editPass.newPassword
      }
      let res = await getEditPassword(data)
      this.$notify({
        title: res ? '成功' : '失败',
        dangerouslyUseHTMLString: true,
        message: res ? res.message : '服务器开小差了，请稍后再试',
        type: res ? 'success' : 'warning'
      })
    },
    //获取个人信息接口
    async getUserInfo() {
      let res = await getUser(this.userId)
      let deptName = res.user.depts[0].deptName
      let postName = res.user.businessPosts[0].name
      let resData = await getJobPosition(res.user.businessPosts[0].postId)
      this.JobPosition = resData
      this.processNum = resData.workProcessList
      //岗位和部门
      this.postDeptName = deptName + '/' + postName
      //邮箱
      this.email = res.user.email
      //手机号
      this.telphone = res.user.phonenumber
    },
    // 初始化
    initG6Editor() {
      const _this = this
      if (_this.editor) {
        return false
      }

      const editor = new G6Editor()
      this.editor = editor

      G6Editor.track(false)
      const Command = G6Editor.Command
      // 注册新命令save
      Command.registerCommand('save', {
        // 禁止保存命令进入队列
        queue: false,
        // 命令是否可用
        enable: (editor) => {
          return true
        },
        // 正向命令
        execute(editor) {
          let needSaveData = editor.getCurrentPage().save()
          localStorage.setItem('flowData', JSON.stringify(needSaveData))
          _this.save(needSaveData)
          // _this.$message.success("数据已保存");
        },
        // 反向命令
        back(editor) {},
        // 快捷键：Ctrl + S
        shortcutCodes: [['metaKey', 's'], ['ctrlKey', 's']]
      })
      // 画布
      this.flow = new G6Editor.Flow({
        graph: {
          container: 'page',
          fitView: 'autoZoom'
        },
        align: {
          line: {
            // 对齐线颜色
            stroke: '#FA8C16',
            // 对齐线粗细
            lineWidth: 1
          },
          // 开启全方位对齐
          item: true,
          // 网格对齐
          grid: true
        },
        grid: {
          // 网孔尺寸
          cell: 18
        },
        shortcut: {
          // 开启自定义命令保存的快捷键
          save: true
        }
      })
      window.flow = this.flow

      // 设置边
      this.flow.getGraph().edge({
        shape: 'flow-polyline'
      })

      // 元素面板栏
      const itempannel = new G6Editor.Itempannel({
        container: 'itempannel'
      })

      editor.add(flow)
      editor.add(itempannel)
      window.editor = editor

      // 获取当前画布
      var currentPage = editor.getCurrentPage()
      currentPage.on('afterchange', (e) => {
        if (e.action === 'add') {
          if (
            e.model.nodetype === 'startNode' ||
            e.model.nodetype === 'endNode'
          ) {
            let nodes = this.editor.getCurrentPage().getNodes()
            for (const item of nodes) {
              if (
                item.model.nodetype === e.model.nodetype &&
                item.model.id !== e.model.id
              ) {
                this.editor.getCurrentPage().remove(e.item)
                this.$message.warning('只能有一个开始节点或结束节点')
              }
            }
          }
        }
      })
      currentPage.on('node:click', (ev) => {
        var selectedItemDataModel = ev.item.model
        let self = this
        // 如果选择的对象是节点
        if (ev.item.isNode) {
          this.nodeAttributeForm.label = selectedItemDataModel.label
          this.nodeAttributeForm.width = selectedItemDataModel.size.split(
            '*'
          )[0]
          this.nodeAttributeForm.height = selectedItemDataModel.size.split(
            '*'
          )[1]
          this.nodeAttributeForm.color = selectedItemDataModel.color
          this.jobForm.nodeId = selectedItemDataModel.id
          this.getTree()
          //根据节点显示工作岗位
          getNodeIdJob(this.jobForm.nodeId).then(function(response) {
            for (var i = 0; i < response.length; i++) {
              self.jobForm.postName.push(response[i].postName)
              self.jobForm.postId.push(response[i].postId)
              self.$refs.deptTree.setCheckedKeys(self.jobForm.postId, true)
            }
          })
          this.jobForm.postName.splice(0, this.jobForm.postName.length)
          this.jobForm.postId.splice(0, this.jobForm.postName.length)
          //根据节点显示作业指导书
          getNodeIdBook(this.jobForm.nodeId).then(function(response) {
            self.tableData = response.rows
            self.total = response.total
          })
          this.addBtn = true
        }
        // 如果选择的对象是边
        if (ev.item.isEdge) {
          ev.item.graph.edge({
            shape: 'flow-polyline-round'
          })
          this.edgeAttributeForm.label = selectedItemDataModel.label
          this.edgeAttributeForm.shape = selectedItemDataModel.shape
        }
      })
      // 监听（删除后）事件
      currentPage.on('afterdelete', (ev) => {})
    },

    //流程图
    getProcess(index) {
      if (this.postId != '') {
        this.dialogVisibleT = true
        setTimeout(() => {
          // this.curID = index;
          this.initG6Editor()
          this.getLookChart(index)
        }, 100)
      }
    },
    //请求单个流程图
    async getLookChart(index) {
      this.loading = true
      let processMap = await getlookWorkchart(
        this.JobPosition.workProcessList[index].workprocessId,
        {
          selectNodeIds: this.JobPosition.workProcessList[index].selectNodeIds
        }
      )
      this.flow.read(processMap)
      this.loading = false
    },

    //编辑弹窗
    async editDialg() {
      this.editDialgVisible = true
      //查看个人信息
      let res = await getUser(this.userId)
      let deptName = res.user.depts[0].deptName
      let postName = res.user.businessPosts[0].name
      //岗位和部门
      this.postDeptName = deptName + '/' + postName
      this.user.postName = this.postDeptName
      //邮箱
      this.email = res.user.email
      this.user.email = this.email
      //手机号
      this.telphone = res.user.phonenumber
      this.user.phonenumber = this.telphone
      //头像
      this.user.avatar = res.user.avatar

      //把字段传给修改的对象字段里面去
      this.user.userId = this.userId
      this.user.userName = res.user.userName
      this.user.phonenumber = res.user.phonenumber
      this.user.email = res.user.email
      this.user.gender = res.user.gender
      this.user.realName = res.user.realName
      this.user.remark = res.user.remark
      this.user.avatar = res.user.avatar
      this.user.cardId = res.user.cardId
      this.user.userBirth = res.user.userBirth
    },
    //修改密码弹窗
    editPasswordDialg() {
      this.editPasswordDialgVisible = true
    },
    //我的日志
    myLogAlert() {
      let chooseDay = document.querySelectorAll('.el-calendar-day')
      ;[].forEach.call(chooseDay, (item) =>
        item.addEventListener('click', handler.bind(this))
      )
      async function handler(e) {
        let currentTarget = e.currentTarget,
          day = currentTarget.textContent
        let [year, month] = document
            .querySelector('.el-calendar__title')
            .textContent.replace(
              /(?<year>[0-9]+).*?(?<month>[0-9]+).*/g,
              '$<year>.$<month>'
            )
            .split('.'),
          date = new Date(year, month - 1, day)
        date = isBasicDate(date)
        console.log(date)
        this.lookSecurity = await getCheck(date, this.userId)

        // debugger;
        this.cardDay = true
      }
    },
    //安全奖罚
    async getRewardChart() {
      let MoneyChart = await rewardPunishMoneyChart()
      let RecordByMonth = await assessmentRecordByMonth()

      for (var i = 0; i < MoneyChart.length; i++) {
        this.chartData1.rows.push({
          日期: MoneyChart[i].month,
          奖励金额: MoneyChart[i].rewardMoney,
          惩罚金额: MoneyChart[i].punishMoney
        })
      }
      for (var i = 0; i < RecordByMonth.length; i++) {
        this.chartData2.rows.push({
          日期: RecordByMonth[i].month,
          分数: RecordByMonth[i].totalScore
        })
      }

      // debugger
    },
    format(percentage) {
      return percentage == 100 ? '全部完成' : `${percentage}%` + '\n' + '已完成'
    },

    //任务统计
    async MyTaskStatistics() {
      let resData = await getMyTaskStatistics(this.dateMonth)
      this.endTask = resData.taskNumberVo
      this.endTask.completionRate = Math.round(
        resData.taskNumberVo.completionRate * 100
      )
      this.endHidden = resData.hiddendangerNumberVo
      this.endHidden.completionRate = Math.round(
        resData.hiddendangerNumberVo.completionRate * 100
      )
      this.joinTrain = resData.trainPlanNumberVo
      this.joinTrain.completionRate = Math.round(
        resData.trainPlanNumberVo.completionRate * 100
      )
      this.totalCompletionRate = Math.round(resData.totalCompletionRate * 100)
      // debugger;
    },
    //选中的月份
    ChangeMonth(e) {
      this.dateMonth = e
      this.MyTaskStatistics()
    },

    //tab事件
    handleTabClick(tab, event) {
      console.log(tab, event)
    },
    //上传头像函数
    handleAvatarSuccess(res, file) {
      this.user.avatar = res.body
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    }
  }
}
</script>
<style lang="scss" scoped>
  .area-tit /deep/{
    .el-input__inner{
      width: 110px;
    }
  }
</style>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9 !important;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.personal-page {
  .el-card {
    position: absolute;
    top: 18%;
    right: 20%;
    width: 350px;
  }
  .card-content {
    .log-position {
      font-size: 12px;
    }
  }
  .log-area {
    margin-top: 15px;
    .log-content {
      height: 50px;
      overflow: hidden;
      padding-bottom: 5px;
      border-bottom: 1px solid #ccc;
    }
  }
  .log-sign {
    margin-top: 15px;
  }
  .log-tit {
    font-weight: 600;
    span {
      font-weight: normal;
    }
  }
  .log-Info {
    position: relative;
    .weather-position {
      position: absolute;
      right: 15px;
      top: 5px;
      display: inline-block;
      width: 90px;
    }
  }
}
.personal {
  .area-tit {
    font-size: 18px;
    height: 50px;
    line-height: 50px;
    color: #333;
    padding-left: 20px;
    margin-top: 0px;
    &::before {
      display: inline-block;
      content: '';
      width: 4px;
      height: 20px;
      background: rgba(13, 116, 215, 1);
      vertical-align: -4px;
      margin-right: 9px;
    }
  }
  .person-info {
    background: #ffffff;
    text-align: center;
    padding: 32px 0px;
    height: 360px;
    .head-img {
      img {
        width: 98px;
        height: 98px;
        border-radius: 50%;
      }
    }
    .personal-name {
      font-size: 36px;
      color: #666;
      margin-top: 11px;
    }
    .info-font {
      font-size: 20px;
      color: #666;
      line-height: 28px;
    }
    .person-email {
      margin-top: 22px;
    }
    .person-info-btn {
      margin-top: 21px;
    }
    .person-info-btn span {
      color: #5583fe;
      font-size: 20px;
      cursor: pointer;
    }
  }
  .safety-reward {
    background: #ffffff;
    #rewardChart {
      height: 310px !important;
      width: 100%;
      canvas {
        height: 310px !important;
      }
    }
  }
  .person-my-log {
    background: #ffffff;
    .my-log {
      height: 310px;
      .el-calendar {
        height: 310px;
      }
      .el-calendar-table .el-calendar-day {
        height: 33px;
      }
      .el-calendar__body {
        padding: 12px 20px 12px;
      }
      .el-calendar-table thead th {
        padding: 5px;
      }
      .el-calendar__header {
        padding: 5px 20px;
      }
    }
  }
  .center-part {
    margin-top: 20px;
    .personal-task {
      background: #ffffff;
      // position: relative;
      height: 316px;
      .el-progress-circle {
        height: 151px !important;
        width: 151px !important;
      }
      .progress-box {
        position: absolute;
        width: 100%;
        top: 0px;
        left: 165px;
      }
      .el-progress__text {
        white-space: pre-wrap;
      }

      .two-progress {
        position: absolute;
        width: 100%;
        top: 125px;
        left: 100px;
      }
      .el-progress-bar {
        width: 58%;
      }

      .fl-task-box {
        height: 80px;
        position: relative;
      }
      .el-tabs__content {
        margin-top: 25px;
      }
      .task-tit {
        margin-top: 16px;
        display: inline-block;
        width: 150px;
        text-align: right;
        font-size: 18px;
        font-weight: 500;
        color: #333;
      }
      //进度条加了80px
      .progress-box {
        top: 16px;
      }
      // .progress-box-two {
      //   top: 16px;
      // }
      // .progress-box-three {
      //   top: 16px;
      // }
      //任务数也加了80px
      // .task-num-two {
      //   position: absolute;
      //   right: 0;
      //   top: 0px;
      //   p {
      //     margin: 0px;
      //     line-height: 25px;
      //     font-size: 18px;
      //     color: #333;
      //   }
      // }
      .task-num {
        position: absolute;
        right: 0;
        top: 0px;
        p {
          margin: 0px;
          line-height: 25px;
          font-size: 18px;
          color: #333;
        }
      }
      #taskPieChart {
        width: 100%;
        height: 200px;
      }
    }
    .person-process {
      background: #ffffff;
      height: 316px;
      .process-box {
        height: 260px;
        overflow: auto;
        p {
          font-size: 14px;
          color: #5b8ff9;
          padding-left: 32px;
          margin: 0px;
          line-height: 30px;
          cursor: pointer;
        }
      }
    }
  }
  .person-footer {
    margin-top: 20px;
    .fl-safety {
      background: #ffffff;
      height: 320px;
    }
    #safetyCharts {
      height: 260px !important;
      width: 100%;
      canvas {
        height: 260px !important;
      }
    }
    .person-job {
      background: #ffffff;
      height: 320px;
      .my-job {
        height: 254px;
        overflow: auto;
        p {
          color: #333;
          padding-left: 32px;
        }
      }
    }
  }
}
</style>
