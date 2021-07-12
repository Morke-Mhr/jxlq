<template>
  <div class="content_box">
    <div class="content_heard">
      <div class="content_left">
        <div class="content_top">
          <div class="title_box"><i></i> <span>待办中心</span></div>
          <ul class="ul_box">
            <li class="list_box" @click="skip('taskCount')">
              <img :src="webImg1" alt="" />
              <div>
                <p :class="[flag == true ? 'p1' : 'p']">
                  {{ taskCount != undefined ? taskCount : 0 }}
                </p>
                <p>待审批</p>
              </div>
            </li>
            <li class="list_box" @click="skip('hrectifyCount')">
              <img :src="webImg3" alt="" />
              <div>
                <p>
                  {{ hrectifyCount != undefined ? hrectifyCount : 0 }}
                </p>
                <p>隐患整改</p>
              </div>
            </li>
            <li class="list_box" @click="skip('hdubanCount')">
              <img :src="webImg2" alt="" />
              <div>
                <p>
                  {{ hdubanCount != undefined ? hdubanCount : 0 }}
                </p>
                <p>隐患督办</p>
              </div>
            </li>
            <li class="list_box" @click="skip('ToTaskCount')">
              <img :src="webImg" alt="" />
              <div>
                <p>{{ ToTaskCount != undefined ? ToTaskCount : 0 }}</p>
                <p>待办任务</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="content_bottom">
          <div class="title_box"><i></i> <span>快捷方式</span></div>
          <ul class="ul_box">
            <li class="list_box" @click="skip(' newTask')">
              <div>
                <img :src="pxImg3" alt="" />
                <p>新增任务</p>
              </div>
            </li>
            <li class="list_box" @click="skip('yhAppear')">
              <div>
                <img :src="pxImg4" alt="" />
                <p>隐患上报</p>
              </div>
            </li>
            <li class="list_box" @click="skip('addMeeting')">
              <div>
                <img :src="pxImg5" alt="" />
                <p>新增会议</p>
              </div>
            </li>
            <li class="list_box" @click="skip('exam')">
              <div>
                <img :src="pxImg" alt="" />
                <p>开始考试</p>
              </div>
            </li>
            <li class="list_box" @click="skip('yhRecord')">
              <div>
                <img :src="pxImg1" alt="" />
                <p>隐患记录</p>
              </div>
            </li>
            <!-- <li class="list_box">
              <div>
                <img :src="pxImg2" alt="" />
                <p></p>
              </div>
            </li> -->
          </ul>
        </div>
      </div>
      <div class="content_right">
        <div class="title_box">
          <i></i>
          <span>通知公告</span>
          <img :src="pxImg6" alt="" @click="informList()" />
        </div>
        <div class="list_box">
          <p v-for="(item, i) in listObj" :key="i" @click="popUp(item)">
            <span>{{ item.title }}</span>
            <span>{{ item.createTime }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="content_footer">
      <div class="content_left">
        <div class="content_top">
          <div class="title_box">
            <i></i>
            <span>教育培训</span>
          </div>
          <template>
            <div class="video">
              <div
                v-for="item in list"
                :key="item.id"
                class="video_list"
                @mouseenter="mouseover(item.id)"
                @mouseleave="mouseLeave(item.id)"
              >
                <video
                  class="video-js"
                  :id="'video' + item.id"
                  :controls="!flag && n == item.id"
                  poster="webImg"
                  preload="metadata"
                >
                  <source :src="item.src" type="video/mp4" />
                </video>
                <p>{{ item.title }}</p>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="content_right">
        <div class="title_box">
          <div>
            <i></i>
            <span>安全作业指导书</span>
          </div>
          <span
            class="icon"
            @click="$router.push({ path: '/standard/standardize' })"
            >全部</span
          >
        </div>
        <div class="list_box">
          <p v-for="(item, i) in listDoc" :key="i" @click="checkZy(item)">
            <span>{{ item.workName }}</span>
            <span>{{ item.createTime }}</span>
          </p>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      custom-class="large"
      :before-close="handleClose"
    >
      <div class="information">
        <p class="title" v-html="caption"></p>
        <div class="time_m">
          <span>{{ releaseTime }}</span>
          <span>{{ publisher }} ({{ dept }})</span>
        </div>
        <div class="Publish_Content" v-html="PublishContent"></div>
        <div>
          附件：<span
            style="color: #5583fe; cursor: pointer"
            @click="handledownload"
            >{{ fileName }}</span
          >
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisibleZY"
      custom-class="small"
      @close="closeDialog"
    >
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="类别" prop="dictDataWorkType">
          <el-select
            v-model="ruleForm.workType"
            value-key="dictCode"
            filterable
            disabled
          >
            <el-option
              v-for="item in options"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作业名称" prop="workName">
          <el-input
            v-model="ruleForm.workName"
            placeholder="请输入"
            autocomplete="off"
            maxlength="50"
            show-word-limit
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="附件" prop="fileList">
          <div class="upload">
            <el-upload
              class="upload-demo"
              ref="upload"
              :action="getUrl"
              :on-preview="handlePreview"
              multiple
              :limit="1"
              :file-list="fileLists"
              name="file"
            >
              <span slot="tip" class="el-upload__tip">点击文件下载</span>
            </el-upload>
            <div class="shade"></div>
          </div>
        </el-form-item>
        <el-form-item label="作业要求" prop="workRequire">
          <div v-html="ruleForm.workRequire" class="Reqtitle_box"></div>
        </el-form-item>
        <el-form-item label="作业内容" prop="workContent">
          <div v-html="ruleForm.workContent" class="Reqtitle_box"></div>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleZY = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import echarts from 'echarts'
import {
  taskCount,
  getYhrectifyCount,
  getYhdubanCount,
  getToTaskCount,
  getNoticesPage,
  noticeView
} from '@/api/homepage/miduser'
import { videoList, getList } from '@/api/homepage/basicuser'

export default {
  name: 'leader',
  data() {
    return {
      webImg: require('../../../../public/img/icon.png'),
      webImg1: require('../../../../public/img/icon(1).png'),
      webImg2: require('../../../../public/img/icon(2).png'),
      webImg3: require('../../../../public/img/icon(3).png'),
      webImg4: require('../../../../public/img/icon(4).png'),
      webImg5: require('../../../../public/img/icon(5).png'),
      webImg6: require('../../../../public/img/icon(6).png'),
      webImg7: require('../../../../public/img/icon(7).png'),
      pxImg: require('../../../../public/img/tubiao(1).png'),
      pxImg1: require('../../../../public/img/tubiao(2).png'),
      pxImg2: require('../../../../public/img/tubiao(3).png'),
      pxImg3: require('../../../../public/img/tubiao(5).png'),
      pxImg4: require('../../../../public/img/tubiao(6).png'),
      pxImg5: require('../../../../public/img/tubiao(7).png'),
      pxImg6: require('../../../../public/img/tubiao(4).png'),
      options: [],
      listObj: [], //通知公告
      taskCount: 0, //待审批数量
      hrectifyCount: 0, //隐患整改数量
      hdubanCount: 0, //隐患督办数量
      ToTaskCount: 0, //待办任务
      listDoc: [],
      caption: '', //标题
      releaseTime: '', //发布时间
      publisher: '', //发布人
      PublishContent: '', //发布内容
      dept: '', //部门
      fileName: '', //附件
      fileUrl: '', //附件地址
      ruleForm: {
        workstandardId: '',
        dictDataWorkType: '',
        workName: '',
        workRequire: '',
        workContent: ''
      },
      fileLists: [],

      dialogVisible: false,
      dialogVisibleZY: false,
      activeName: '1',
      list: [],
      flag: true,
      n: 0
    }
  },
  computed: {
    getUrl() {
      return (
        this.$store.state.apiConfiguration.url +
        this.$store.state.serviceName.jurisdiction +
        '/fs/upload'
      )
    }
  },
  created() {
    this.TodoCenter()
  },
  watch: {
    list: function() {
      var _this = this
      _this.$nextTick(function() {
        this.findvideocover()
      })
    }
  },
  methods: {
    async TodoCenter() {
      this.taskCount = await taskCount()
      this.hrectifyCount = await getYhrectifyCount()
      this.hdubanCount = await getYhdubanCount()
      this.ToTaskCount = await getToTaskCount()
      this.listObj = await getNoticesPage()
      let resDoc = await getList()
      this.listDoc = resDoc.rows

      //基层首页-课件的视频列表
      let resVideo = await videoList()
      for (var i = 0; i < resVideo.length; i++) {
        this.list.push({
          src:
            this.$store.state.apiConfiguration.url +
            this.$store.state.serviceName.jurisdiction +
            resVideo[i].kjFileUrl,
          title: resVideo[i].kjName,
          id: i
        })
      }
    },
    mouseover(index) {
      //移进显示
      this.flag = false
      this.n = index
    },
    mouseLeave(index) {
      //移出不显示
      this.flag = true
      this.n = index
    },
    findvideocover() {
      for (let index = 0; index < this.list.length; index++) {
        let size = 160
        // 获取video节点
        const video = document.getElementById(`video${this.list[index].id}`)
        video.width = size
        video.height = size
        video.currentTime = 0.5 // 第一帧
        //创建canvas对象
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        this.$nextTick(() => {
          // 利用canvas对象方法绘图
          canvas
            .getContext('2d')
            .drawImage(video, 0, 0, canvas.width, canvas.height)
          // 转换成base64形式
          const img = canvas.toDataURL('image/jpeg') // 这个就是图片的base64
          this.coverUrl = img
        })
      }
    },
    async popUp(item) {
      this.dialogVisible = true
      this.caption = item.title
      this.releaseTime = item.createTime
      this.publisher = item.createBy
      this.PublishContent = item.content
      this.dept = item.dept
      this.fileName = item.fileName
      await noticeView(item.noticeId)
    },
    checkZy(item) {
      this.dialogVisibleZY = true
      this.ruleForm = item
      if (item.fileName != null) {
        this.fileLists.push(
          Object.assign({}, { name: item.fileName, url: item.fileUrl })
        )
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    handledownload() {
      this.fileDowloadName =
        this.$store.state.apiConfiguration.url +
        `fs/download?name=${encodeURI(encodeURI(this.fileName))}&path=${
          this.fileUrl
        }`
      location.href = this.fileDowloadName
    },
    ZYdownload() {
      this.fileDowloadName =
        this.$store.state.apiConfiguration.url +
        `fs/download?name=${encodeURI(encodeURI(this.ZYfileName))}&path=${
          this.ZYfileUrl
        }`
      location.href = this.fileDowloadName
    },

    //跳转页面
    skip(v, e) {
      switch (v) {
        case 'taskCount': //待审批
          if (this.taskCount > 0) {
            this.$router.push({ path: '/task/task1' })
          }
          break
        case 'hrectifyCount': //隐患整改
          if (this.hrectifyCount > 0) {
            this.$router.push({ path: '/security/yhRecord' })
          }
          break
        case 'hdubanCount': //隐患督办
          if (this.hdubanCount > 0) {
            this.$router.push({ path: '/security/yhRecord' })
          }
          break
        case 'ToTaskCount': //待办任务
          if (this.ToTaskCount > 0) {
            this.$router.push({ path: '/task/handle' })
          }
          break
        case 'TimeTaskCount': //已超期任务,query: {query:'already'}
          if (this.TimeTaskCount > 0) {
            this.$router.push({ path: '/task/handle' })
          }
          break
        case 'finishedTaskCount': //已完成任务
          if (this.finishedTaskCount > 0) {
            this.$router.push({ path: '/task/handle' })
          }
          break
        case 'DoingTaskCount': //在办任务
          if (this.DoingTaskCount > 0) {
            // this.$router.push({ path: "/safetyEdu/manage" });
          }
          break
        case 'DevCheckCount': //特种设备
          if (this.DevCheckCount > 0) {
            this.$router.push({ path: '/equipment/inspectionRecord' })
          }
          break
        case 'newTask': //新增任务
          this.$router.push({ path: '/task/iCreated' })
          break
        case 'yhAppear': //隐患上报
          this.$router.push({ path: '/security/yhReport' })
          break
        case 'addMeeting': //新增会议
          break
        case 'exam': //开始考试
          // this.$router.push({ path: "/security/yhDistribution" });
          break
        case 'yhRecord': //隐患记录
          this.$router.push({ path: '/security/yhRecord' })
          break
      }
    },
    informList() {
      this.$router.push({ path: '/notification' })
    },
    //关闭弹框的事件
    closeDialog(formName) {
      this.ruleForm = {}
      this.fileLists = []
      this.$refs.upload.clearFiles()
    },
    //下载附件
    handlePreview(file) {
      let row = file
      this.fileDowloadName =
        this.$store.state.apiConfiguration.url +
        `fs/download?name=${encodeURI(encodeURI(row.name))}&path=${row.url}`
      location.href = this.fileDowloadName
    }
  }
}
</script>

<style lang="scss" scoped>
.content_box {
  padding: 20px;
  .content_heard {
    display: flex;
    justify-items: flex-end;
    height: 398px;
    margin-bottom: 12px;
    .content_left {
      width: 70%;
      flex-direction: column;
      display: flex;
      justify-items: flex-end;
      .content_top {
        height: 182px;
        // width: 876px;
        background-color: #ffffff;
        margin-bottom: 12px;
        .title_box {
          height: 22px;
          font-size: 16px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #333333;
          line-height: 22px;
          margin: 16px 0;
          display: flex;
          span {
            margin-left: 20px;
          }
          i {
            display: inline-block;
            width: 4px;
            height: 22px;
            background: #5683fe;
          }
        }
        .ul_box {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          padding: 0 20px;
          .list_box {
            list-style-type: none;
            cursor: pointer;
            width: 24%;
            height: 100px;
            margin-bottom: 10px;
            background: #fafafa;
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
            border-radius: 4px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 0 4%;
            img {
              width: 48px;
              height: 48px;
            }
            div {
              text-align: center;
              p:first-child {
                font-size: 24px;
                font-family: DINAlternate-Bold, DINAlternate;
                font-weight: bold;
                color: #5583fe;
                line-height: 0px;
              }
              p:last-child {
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
              }
            }
          }
        }
      }
      .content_bottom {
        height: 203px;
        // width: 876px;
        background-color: #ffffff;
        .title_box {
          height: 22px;
          font-size: 16px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #333333;
          line-height: 22px;
          margin: 16px 0;
          display: flex;
          margin-bottom: 29px;
          span {
            margin-left: 20px;
          }
          i {
            display: inline-block;
            width: 4px;
            height: 22px;
            background: #5683fe;
          }
        }

        .ul_box {
          display: flex;
          justify-content: space-around;
          padding: 0 20px;
          .list_box {
            cursor: pointer;
            list-style-type: none;
            width: 198px;
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            div > div {
              width: 68px;
              height: 68px;
              background: #f7b500;
              border-radius: 21px;
              display: flex;
              justify-content: center;
              align-items: center;
              i {
                font-size: 39px;
                color: #ffffff;
              }
            }
            div > p {
              font-size: 16px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
            }
            div > p:last-child {
              height: 18px;
            }
          }
        }
      }
    }
    .content_right {
      width: 30%;
      background-color: #ffffff;
      margin-left: 13px;
      .title_box {
        height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 22px;
        margin: 16px 0;
        display: flex;
        position: relative;
        span {
          margin-left: 20px;
        }
        img {
          width: 20px;
          height: 20px;
          cursor: pointer;
          position: absolute;
          right: 20px;
        }
        i {
          display: inline-block;
          width: 4px;
          height: 22px;
          background: #5683fe;
        }
      }
      .list_box {
        padding: 0 23px;
        height: 332px;
        overflow: hidden;
        p {
          cursor: pointer;
          height: 48px;
          padding: 0 5px;
          line-height: 48px;
          margin: 0;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          display: flex;
          justify-content: space-between;
        }
        span:first-child {
          max-width: 40%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        p:nth-child(odd) {
          background: #f6f7fb;
        }
      }
    }
  }
  .content_footer {
    height: 550px;
    display: flex;
    justify-items: flex-end;
    height: 430px;
    margin-bottom: 12px;
    .content_left {
      width: 70%;
      flex-direction: column;
      display: flex;
      justify-items: flex-end;
      .content_top {
        background-color: #ffffff;
        margin-bottom: 12px;
        .video {
          display: flex;
          flex-wrap: wrap;
          height: 400px;
          overflow: hidden;
          padding: 0 10px;
          .video_list {
            margin: 0 1%;
            width: 31%;
            p {
              margin: 10px 0;
              text-align: center;
              height: 22px;
              font-size: 12px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
            }
            .video-js {
              width: 100%;
              height: 160px;
            }
          }
        }

        .title_box {
          height: 22px;
          font-size: 16px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #333333;
          line-height: 22px;
          margin: 16px 0;
          display: flex;
          span {
            margin-left: 20px;
          }
          i {
            display: inline-block;
            width: 4px;
            height: 22px;
            background: #5683fe;
          }
        }
        .ul_box {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          padding: 0 20px;
          .list_box {
            list-style-type: none;
            cursor: pointer;
            width: 198px;
            height: 90px;
            margin-bottom: 10px;
            background: #fafafa;
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
            border-radius: 4px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 0 30px;
            img {
              width: 48px;
              height: 48px;
            }
            div p:first-child {
              font-size: 24px;
              font-family: DINAlternate-Bold, DINAlternate;
              font-weight: bold;
              color: #5583fe;
              line-height: 0px;
            }
            div p:last-child {
              font-size: 16px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
            }
          }
        }
      }
    }
    .content_right {
      width: 29%;
      background-color: #ffffff;
      margin-left: 13px;
      height: 454px;
      .title_box {
        height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 22px;
        margin: 16px 0;
        justify-content: space-between;
        display: flex;
        div {
          display: flex;
          span {
            margin-left: 20px;
          }
        }
        .icon {
          cursor: pointer;
          margin-right: 10px;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #5583fe;
          line-height: 22px;
        }
        i {
          display: inline-block;
          width: 4px;
          height: 22px;
          background: #5683fe;
        }
      }
      .list_box {
        padding: 0 23px;
        height: 380px;
        overflow: hidden;
        p {
          cursor: pointer;
          height: 48px;
          padding: 0 5px;
          line-height: 48px;
          margin: 0;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          display: flex;
          justify-content: space-between;
        }
        span:first-child {
          max-width: 45%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        p:nth-child(odd) {
          background: #f6f7fb;
        }
      }
    }
  }
  .information {
    border: 1px solid #000;
    padding: 0 20px 20px 20px;
    .title {
      text-align: center;
      font-size: 28px;
      font-weight: 400;
      line-height: 28px;
      color: #000;
    }
    .time_m {
      text-align: center;
      margin-bottom: 20px;
      span {
        margin: 0 20px;
        color: #000;
        font-size: 18px;
      }
    }
    .Publish_Content {
      border: 1px solid #000;
      width: 100%;
      min-height: 300px;
      max-height: 500px;
      margin-bottom: 20px;
      padding: 20px;
      overflow: auto;
    }
  }
  .Reqtitle_box {
    border: 1px solid #000;
    min-height: 150px;
    max-height: 200px;
    overflow: auto;
    line-height: 20px;
    padding: 10px;
    margin: 0;
  }
}
</style>
<style lang="scss">
.content_footer
  .el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item.is-active {
  width: 130px;
  height: 50px;
  line-height: 50px;
  background: #5583fe;
  border-radius: 4px;
  color: #ffffff;
}
.content_footer .el-tabs--border-card > .el-tabs__header .el-tabs__item {
  height: 50px;
}
.content_footer .el-tabs__active-bar {
  display: none;
}
.content_footer .el-tabs__item {
  text-align: center;
  width: 130px;
  line-height: 50px;
}
</style>
