<template>
  <div class="app-container" style="padding:10px">
    <div class="class-page">
      <div class="class-details people-content">
        <div class="area-tit">基础信息</div>
        <el-form ref="form" :model="classDetails" label-width="90px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="会议名称：">
                <el-input
                    v-model="classDetails.meetingName"
                    :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="会议主题：">
                <el-input
                    v-model="classDetails.meetingTheme"
                    :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="开始时间：">
                <el-input
                    v-model="classDetails.startTime"
                    :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="结束时间：">
                <el-input
                    v-model="classDetails.endTime"
                    :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="地点：">
                <el-input
                    v-model="classDetails.place"
                    :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="主持人：">
                <el-input
                    v-model="classDetails.userName"
                    :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
             <el-col :span="12" class="showinput">
              <el-form-item label="主持部门：">
                <el-input
                    v-model="classDetails.dept"
                    :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="会议内容：">
                <el-input
                    type="textarea"
                    style="border:1px solid #e4e7ed"
                    :autosize="{ minRows: 3 }"
                    v-model="classDetails.meetingContent"
                    :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="class-details" v-if="getImage.length > 0">
        <div class="area-tit">现场图片</div>
        <div class="my-img-body">
          <label class="my-img-list" v-for="(item, index) of getImage"
                 :key="index">
            <img
                :src="item.fileUrl"
                class="details-img"
                @click="enlarge(item.fileUrl)"
            />
            <span>{{ item.createTime }}</span>
          </label>
        </div>
      </div>
      <el-dialog
          custom-class="small"
          title="查看图片"
          :visible.sync="innerVisible"
          append-to-body
      >
        <img :src="fdimg" width="100%"/>
        <span slot="footer" class="dialog-footer">
          <el-button class="fBtn" @click="innerVisible = false"
          >关 闭</el-button
          >
        </span>
      </el-dialog>
      <div class="class-details" v-if="getVideo.length > 0">
        <div class="area-tit">现场视频</div>
        <video
            v-for="(item, index) of getVideo"
            :key="index"
            width="320"
            height="240"
            :src="item"
            controls
            v-show="fileShow"
        >
          <!-- <source :src="this.getVideo" type="video/mp4">
          您的浏览器不支持Video标签。-->
        </video>
      </div>
      <!-- 签到 -->
      <div class="class-details" v-if="type == 1">
        <div class="area-tit">签到记录</div>
        <el-table
            :data="classDetails.preclassmeetSigninList"
            stripe
            height="300"
        >
          <el-table-column
              prop="user"
              label="参会人"
              width="240"
          ></el-table-column>
          <el-table-column label="参会状态" width="240">
            <template slot-scope="scope">{{
                scope.row.isAttend ? '已参会' : '未参会'
              }}
            </template>
          </el-table-column>
          <el-table-column label="电子签名">
            <template slot-scope="scope">
              <img
                  v-if="!(JSON.stringify(scope.row.signUrl) == 'null')"
                  :src="
                  $store.state.apiConfiguration.imgFileUrl + scope.row.signUrl
                "
                  style="width:54px;height:54px"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div class="printing" v-if="type == 1">
        <el-button class="reset-btn" @click="printings">打印</el-button>
      </div> -->
    </div>
  </div>
</template>

<script>
import {getClassTrainDetails} from '@/api/safety/classTrain.js'
import axios from 'axios'
import {getToken} from '@/utils/auth'

export default {
  props: {
    classD: String,
    type: Number
  },
  data() {
    return {
      classDetails: {},
      id: '',
      //图片
      getImage: [],
      //音频
      getAudio: '',
      //视频
      getVideo: [],
      fileShow: true,
      innerVisible: false,
      fdimg: ''
    }
  },
  created() {
    this.id = this.classD
    this.getDetails()
  },
  methods: {
    // 点击放大图片
    enlarge(url) {
      this.innerVisible = true
      this.fdimg = url
    },
    async getDetails() {
      this.classDetails = await getClassTrainDetails(this.id)
      console.log(this.classDetails, 88888888888888888888)
      if (
          this.classDetails.preclassmeetFileList == '' ||
          this.classDetails.preclassmeetFileList == null
      ) {
        this.fileShow = false
      }
      for (let i = 0; i < this.classDetails.preclassmeetFileList.length; i++) {
        //0为图片  1为音频 2为视频
        if (this.classDetails.preclassmeetFileList[i].fileType == '0') {
          this.classDetails.preclassmeetFileList[i].fileUrl = this.$store.state.apiConfiguration.imgFileUrl + this.classDetails.preclassmeetFileList[i].fileUrl;
          this.getImage.push(
              this.classDetails.preclassmeetFileList[i]
          )
        }
            // else if (this.classDetails.preclassmeetFileList[i].fileType == "1") {
            //   let audioUrl = this.classDetails.preclassmeetFileList[i].fileUrl;
            //   this.getAudio =
            //     this.$store.state.apiConfiguration.imgFileUrl + audioUrl;
        // }
        else if (this.classDetails.preclassmeetFileList[i].fileType == '2') {
          let videoUrl = this.classDetails.preclassmeetFileList[i].fileUrl
          this.getVideo.push(
              this.$store.state.apiConfiguration.imgFileUrl + videoUrl
          )
        }
      }
      console.log(this.getImage, this.getVideo, 999999999999999999)
      if (this.classDetails.status == '0') {
        this.classDetails.status = '进行中'
      } else if (this.classDetails.status == '1') {
        this.classDetails.status = '已结束'
      }
      //  let imageUrl=classDetails.preclassmeetFileList
      //  this.getImage=this.$store.state.apiConfiguration.url
    },
    // 打印
    async printings() {
      axios({
        method: 'get',
        url:
            this.$store.state.apiConfiguration.url +
            this.$store.state.serviceName.safetyEdu +
            '/preclassMeet/exportWord',
        responseType: 'blob', // 表明返回服务器返回的数据类型
        headers: {
          'Content-Type': 'application/json',
          Authorization: getToken()
        },
        //接口参数
        params: {
          preclassmeetId: this.classD
        }
      }).then(function (response) {
        console.log(response, 9888)
        //创建一个隐藏的a连接，
        const link = document.createElement('a')
        let blob = new Blob([response.data], {
          type: 'application/msword'
        })
        link.style.display = 'none'
        //设置连接
        link.href = URL.createObjectURL(blob)
        link.download = '班前培训.doc'
        document.body.appendChild(link)
        //模拟点击事件
        link.click()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.showinput /deep/{
  .el-input__inner{
    width: 500px !important;
  }
}
.printing {
  position: absolute;
  bottom: 30px;
  right: 30px;
}
</style>
<style>
.area-tit {
  font-size: 18px;
  height: 50px;
  line-height: 50px;
  color: #333;
  margin-top: 10px;
}

.area-tit span {
  font-size: 14px;
  text-align: right;
  float: right;
  padding-right: 15px;
  cursor: pointer;
}

.area-tit:before {
  display: inline-block;
  content: '';
  width: 4px;
  height: 20px;
  background: rgba(13, 116, 215, 1);
  vertical-align: -4px;
  margin-right: 9px;
}

.class-page {
  background: #ffffff;
}

.class-page .class-details input {
  border: none;
}

.class-page .el-textarea__inner {
  border: none;
}

.class-page .el-form-item__label {
  font-weight: 800;
}

.class-page .details-img {
  margin: 10px;
  height: 204px;
}

.class-page .class-details {
  padding-bottom: 20px;
  border-bottom: 1px solid #e7e7e7;
}

.class-page .class-details:last-of-type {
  border-bottom: none;
}

video,
audio {
  width: calc(25% - 10px);
  border: none;
  margin-right: 13px;
}

video:nth-of-type(4n),
audio:nth-of-type(4n) {
  width: calc(25% - 9px);
  margin-right: 0;
}

:focus {
  outline: none;
}

.rightbutton {
  text-align: right;
}

.my-img-body {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.my-img-list {
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.my-img-list img {
  width: 140px;
  height: 204px;
}

</style>
