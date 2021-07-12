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
            <div id="rewardChart"></div>
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
            <div class="area-tit">任务统计</div>

            <el-tabs v-model="activeName" @tab-click="handleTabClick">
              <el-tab-pane label="今日" name="first">
                <el-col :span="16">
                  <div class="fl-task-box clearfix">
                    <span class="task-tit">完成任务数</span>
                    <div class="progress-box">
                      <el-progress
                        :text-inside="true"
                        :stroke-width="20"
                        :percentage="70"
                        :color="endTaskColor"
                      ></el-progress>
                    </div>
                    <div class="task-num">
                      <p>总任务:<span>5</span></p>
                      <p>未完成:<span>3</span></p>
                    </div>
                  </div>
                  <div class="fl-task-box clearfix">
                    <span class="task-tit">完成隐患整改数</span>
                    <div class="progress-box">
                      <el-progress
                        :text-inside="true"
                        :stroke-width="20"
                        :percentage="70"
                        :color="endHiddenColor"
                      ></el-progress>
                    </div>
                    <div class="task-num">
                      <p>总任务:<span>5</span></p>
                      <p>未完成:<span>3</span></p>
                    </div>
                  </div>
                  <div class="fl-task-box">
                    <span class="task-tit">参加培训数</span>
                    <div class="progress-box">
                      <el-progress
                        :text-inside="true"
                        :stroke-width="20"
                        :percentage="70"
                        :color="joinTrainColor"
                      ></el-progress>
                    </div>
                    <div class="task-num">
                      <p>总任务:<span>5</span></p>
                      <p>未完成:<span>3</span></p>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div id="taskPieChart"></div>
                </el-col>
              </el-tab-pane>
              <el-tab-pane label="昨日" name="second"> </el-tab-pane>
              <el-tab-pane label="本周" name="third">角色管理</el-tab-pane>
              <el-tab-pane label="本月" name="fourth">定时任务补偿</el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="person-process">
            <div class="area-tit">流程图</div>
            <div class="process-box">
              <p v-for="(item, index) in num" :key="index">流程A</p>
              <!-- <p v-for="(item,index) in processNum">{{item}}</p> -->
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="person-footer">
        <el-col :span="17">
          <div class="fl-safety">
            <div class="area-tit">安全绩效</div>
            <div id="safetyCharts"></div>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="person-job">
            <div class="area-tit">岗位职责</div>
            <div class="my-job">
              <p>我的岗位职责</p>
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
          <!-- <div>{{data.day}}</div> -->
          <div class="weather-position">
            <div id="he-plugin-simple"></div>
            <!-- <div id="weather-today"></div> -->
          </div>
        </div>
        <div class="log-area">
          <div class="log-tit">今日完成工作记述</div>
          <div class="log-content"></div>
        </div>
        <div class="log-area">
          <div class="log-tit">今日工作备忘</div>
          <div class="log-content"></div>
        </div>
        <div class="log-area">
          <div class="log-tit">明日工作安排</div>
          <div class="log-content"></div>
        </div>
        <div class="log-area">
          <div class="log-tit">检查情况及采取措施</div>
          <div class="log-content"></div>
        </div>
        <div class="log-area">
          <div class="log-tit">其他有关事项记录</div>
          <div class="log-content"></div>
        </div>
        <div class="log-sign">
          <div class="log-tit">电子签名:<span>甄帅</span></div>
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
        ref="operationFome"
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
        ref="operationFome"
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
        <el-button class="confirm-btn" @click="confimPassword">
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
import echarts from 'echarts'
// import './heweather.js';
import weather from './heweather.js'
import store from '@/store/index.js'
import { getToken } from '@/utils/auth'
import { isBasicDate } from '@/utils/date'
import userImg from '../../../public/img/userImg.gif'
import { getUser } from '@/api/system/user'
import { getEditPassword, getEditInfo } from '@/api/personCenter/index'
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
      //日志表
      value: new Date(),
      //tab
      activeName: 'first',
      //完成任务数进度条颜色
      endTaskColor: '#F7B500',
      //完成隐患整改进度条颜色
      endHiddenColor: '#5583FE',
      //参加培训书进度条颜色
      joinTrainColor: '#ED625E',
      processNum: ['流程A', '流程B', '流程C', '流程D'],
      num: 5,
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
      }
    }
  },
  created() {},
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
    this.getTaskPieChart()
    this.getSafetyCharts()
    this.myLogAlert()
    //个人信息接口
    this.getUserInfo()
    weather('he-plugin-simple')
    //     window.WIDGET = {
    //   CONFIG: {
    //     "modules": "01",
    //     "background": 5,
    //     "tmpColor": "101010",
    //     "tmpSize": "12",
    //     "cityColor": "171717",
    //     "citySize": "12",
    //     "aqiSize": "12",
    //     "weatherIconSize": "12",
    //     "alertIconSize": 18,
    //     "padding": "10px 10px 10px 10px",
    //     "shadow": "1",
    //     "language": "auto",
    //     "fixed": "false",
    //     "vertical": "middle",
    //     "horizontal": "center",
    //     "key": "c9e0a8109c3d473caf43baf934297087"
    //   }
    // };
    // (function (d) {
    //   var c = d.createElement('link')
    //   c.rel = 'stylesheet'
    //   c.href = 'https://widget.heweather.net/simple/static/css/he-simple.css?v=1.3'
    //   var s = d.createElement('script')
    //   s.src = 'https://widget.heweather.net/simple/static/js/he-simple.js?v=1.3'
    //   var sn = d.getElementsByTagName('script')[0]
    //   sn.parentNode.insertBefore(c, sn)
    //   sn.parentNode.insertBefore(s, sn)
    // })(document)
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
    confimPassword() {
      if (this.editPass.newPassword != this.editPass.affirmPassword) {
        this.$message({
          message: '确认密码与新密码不一致!',
          type: 'warning'
        })
      } else if (this.editPass.newPassword == this.editPass.affirmPassword) {
        this.getEditPass()
        this.editPasswordDialgVisible = false
      }
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
      //岗位和部门
      this.postDeptName = deptName + '/' + postName
      //邮箱
      this.email = res.user.email
      //手机号
      this.telphone = res.user.phonenumber
      console.log(res)
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
    myLogAlert() {
      let chooseDay = document.querySelectorAll('.el-calendar-day')
      ;[].forEach.call(chooseDay, (item) =>
        item.addEventListener('click', handler.bind(this))
      )
      function handler(e) {
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
        this.cardDay = true
      }
    },
    getRewardChart() {
      this.rewardChart = this.$echarts.init(
        document.getElementById('rewardChart')
      )
      //   this.rewardChart = this.$echarts.init(this.$refs["rewardChart"]);
      this.rewardChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['奖励', '惩罚']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          axisLabel: {
            fontSize: 12,
            color: '#999999'
          },
          //坐标轴线
          axisLine: {
            lineStyle: {
              color: '#EFEFEF'
            }
          },
          //坐标轴刻度
          axisTick: {
            lineStyle: {
              color: '#EFEFEF'
            }
          },
          //网格线
          splitLine: {
            show: true,
            lineStyle: {
              color: '#EFEFEF'
            }
          }
        },
        yAxis: {
          type: 'value',
          //坐标轴线
          axisLine: {
            lineStyle: {
              color: '#EFEFEF'
            }
          },
          axisLabel: {
            fontSize: 12,
            color: '#999999'
          }
        },
        series: [
          {
            name: '奖励',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210],
            color: '#74A0FA'
          },
          {
            name: '惩罚',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310],
            color: '#63DAAB'
          }
        ]
      })
    },
    //完成任务饼图
    getTaskPieChart() {
      this.taskPieChart = this.$echarts.init(
        document.getElementById('taskPieChart')
      )
      //   this.rewardChart = this.$echarts.init(this.$refs["rewardChart"]);
      this.taskPieChart.setOption({
        color: ['#5B8FF9', '#D7D7D7'],
        // tooltip: {
        //   trigger: "item",
        //   formatter: "{a} <br/>{b}: {c} ({d}%)"
        // },
        tooltip: {
          trigger: 'item',
          //d是百分百 c是个数
          formatter: '{b}: {d}%',
          textStyle: {
            fontSize: 18
          }
        },
        legend: {
          show: false
        },
        graphic: {
          //图形中间文字
          type: 'text',
          left: 'center',
          top: '105',
          style: {
            text: '已完成\n52%',
            textAlign: 'center',
            fill: '#333',
            fontSize: 18
          }
        },
        series: [
          {
            name: '已完成',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '60%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '18'
              }
            },
            labelLine: {
              show: false
            },
            data: [{ value: 52, name: '已完成' }, { value: 48, name: '未完成' }]
          }
        ]
      })
    },
    //安全绩效柱状图
    getSafetyCharts() {
      this.safetyCharts = this.$echarts.init(
        document.getElementById('safetyCharts')
      )
      //   this.rewardChart = this.$echarts.init(this.$refs["rewardChart"]);
      this.safetyCharts.setOption({
        color: ['#6395FA'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              fontSize: 12,
              color: '#999999'
            },
            //坐标轴线
            axisLine: {
              lineStyle: {
                color: '#EFEFEF'
              }
            },
            //坐标轴刻度
            axisTick: {
              lineStyle: {
                color: '#EFEFEF'
              }
            },
            //网格线
            splitLine: {
              show: true,
              lineStyle: {
                color: '#EFEFEF'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            //坐标轴线
            axisLine: {
              lineStyle: {
                color: '#EFEFEF'
              }
            },
            axisLabel: {
              fontSize: 12,
              color: '#999999'
            }
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: 32,
            data: [10, 52, 200, 334, 390, 330, 220]
          }
        ]
      })
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
    }
  }
}
</script>

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
      height: 310px;
      width: 100%;
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
      .el-tabs__header {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        text-align: center;
      }
      .el-tabs__nav-wrap::after {
        display: none;
      }
      .el-tabs__item.is-active {
        color: #0d74d7;
      }
      .el-tabs__active-bar {
        background: #0d74d7;
      }
      //   .el-tabs__nav{
      //       float:none;
      //       text-align: center;
      //      margin: 0 auto;
      //   }
      .el-tabs__nav-scroll {
        margin-left: 40%;
      }
      // .el-progress{
      //     display: inline-block;
      // }
      .progress-box {
        position: absolute;
        width: 100%;
        top: 0px;
        left: 165px;
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
      // .task-num-one {
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
        p {
          font-size: 14px;
          color: #5b8ff9;
          padding-left: 32px;
          margin: 0px;
          line-height: 30px;
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
      height: 260px;
      width: 100%;
    }
    .person-job {
      background: #ffffff;
      height: 320px;
      .my-job {
        p {
          color: #5b8ff9;
          padding-left: 32px;
        }
      }
    }
  }
}
</style>
