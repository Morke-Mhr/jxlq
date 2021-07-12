<template>
  <!-- 培训计划 -->
  <div>
    <!-- <div class="read-only"></div> -->
    <el-form ref="itemSelInfo" label-width="150px" class="form-table clearfix">
      <el-form-item label="主题" style="width: 50%;float: left;">
        <el-input
          type="input"
          :disabled="true"
          v-model="detailDate.pxTitle"
        ></el-input>
      </el-form-item>
      <el-form-item label="类别" style="width: 50%;float: left;">
        <el-input
          type="input"
          :disabled="true"
          v-model="detailDate.pxClass"
        ></el-input>
      </el-form-item>
      <el-form-item label="计划培训开始时间" style="width: 50%;float: left;">
        <el-input
          type="input"
          :disabled="true"
          v-model="detailDate.planStartTime"
        ></el-input>
      </el-form-item>
      <el-form-item label="计划培训结束时间" style="width: 50%;float: left;">
        <el-input
          type="input"
          :disabled="true"
          v-model="detailDate.planEndTime"
        ></el-input>
      </el-form-item>
      <el-form-item label="课时" style="width: 50%;float: left;">
        <el-input
          type="input"
          :disabled="true"
          v-model="detailDate.pxClassHour"
        ></el-input>
      </el-form-item>
      <el-form-item label="地点" style="width: 50%;float: left;">
        <el-input
          type="input"
          :disabled="true"
          v-model="detailDate.pxPlace"
        ></el-input>
      </el-form-item>
      <el-form-item label="培训机构" style="width: 50%;float: left;">
        <el-input
          type="input"
          :disabled="true"
          v-model="detailDate.pxAgency"
        ></el-input>
      </el-form-item>
      <el-form-item label="授课老师" style="width: 50%;float: left;">
        <el-input
          type="input"
          :disabled="true"
          v-model="detailDate.pxTeacher"
        ></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input
          type="textarea"
          :disabled="true"
          v-model="detailDate.pxContent"
        ></el-input>
      </el-form-item>
      <el-form-item label></el-form-item>
      <el-form-item class="zindex" label="关联课件" style="width: 100%;">
        <div
          class="upload"
          v-if="
            detailDate.trainCoursewareList &&
              detailDate.trainCoursewareList.length > 0
          "
        >
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="getUrl"
            :on-preview="handlePreview"
            multiple
            :limit="1"
            :file-list="detailDate.trainCoursewareList"
            name="file"
          >
            <!-- <el-button type="text">点击下载文件</el-button> -->
          </el-upload>
          <div class="shade"></div>
        </div>

        <!-- <el-button class="zindex" icon="el-icon-paperclip" @click="downLoadFile">下载附件</el-button> -->
      </el-form-item>
      <div class="clearfix">
        <div class="area-confide" style="margin-bottom: 10px;">
          <div class="clearfix confide">
            <label
              style="text-align: right;float:left; inline-block;width:120px;padding: 0 12px 0 0;color: #606266;width:150px;"
              >培训人员</label
            >
            <table style="float: left;">
              <tr
                v-for="(item, index) in this.detailDate.trainPersonList"
                :key="index"
              >
                <!-- <td>&nbsp;{{item.dept}}</td> -->
                <td>&nbsp;{{ item.user }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { viewBusinessInfo } from '@/api/system/process'
export default {
  components: {},
  props: {
    businessKey: String,
    businessCode: String
  },
  data() {
    return {
      //查看详情字段
      detailDate: {
        //主题
        pxTitle: '',
        //培训类别
        pxClass: '',
        //培训内容
        pxContent: '',
        //计划培训开始时间
        planStartTime: '',
        //计划培训结束时间
        planEndTime: '',
        //授课老师
        pxTeacher: '',
        //培训机构
        pxAgency: '',
        //地点
        pxPlace: '',
        //培训课时
        pxClassHour: '',
        //培训人员集合
        trainPersonList: [
          {
            //人员
            user: ''
          }
        ],
        //课件集合
        trainCoursewareList: [
          {
            //课件名称
            kjName: '',
            //课件附件url
            kjFileUrl: ''
          }
        ],
        //培训附件list
        trainplanFileList: [
          {
            //附件名称
            pictureName: '',
            //附件url
            pictureUrl: ''
          }
        ]
      }
    }
  },
  computed: {
    getUrl() {
      return (
        this.$store.state.apiConfiguration.url +
        'jxlq-system-service' +
        '/fs/upload'
      )
    }
  },
  created() {
    this.getAllList()
  },
  methods: {
    async getAllList() {
      const res = await viewBusinessInfo(this.businessCode, this.businessKey)
      if (res.body.trainCoursewareList) {
        for (let item of res.body.trainCoursewareList) {
          item.name = item.kjName
          item.url = item.kjFileUrl
        }
      }
      if (res.body.planStartTime) {
        let star = new Date(res.body.planStartTime)
        res.body.planStartTime =
          star.getFullYear() +
          '-' +
          (star.getMonth() + 1) +
          '-' +
          star.getDate() +
          ' ' +
          star.getHours() +
          ':' +
          star.getMinutes() +
          ':' +
          star.getSeconds()
      }
      if (res.body.planEndTime) {
        let end = new Date(res.body.planEndTime)
        res.body.planEndTime =
          end.getFullYear() +
          '-' +
          (end.getMonth() + 1) +
          '-' +
          end.getDate() +
          ' ' +
          end.getHours() +
          ':' +
          end.getMinutes() +
          ':' +
          end.getSeconds()
      }
      this.detailDate = res.body
      console.log(this.detailDate, 88888)
    },
    downLoadFile() {
      // console.log(1121)
    },
    //下载
    handlePreview(file) {
      let row = file
      console.log(row)
      this.fileDowloadName =
        this.$store.state.apiConfiguration.url +
        'jxlq-system-service' +
        `/fs/download?name=${encodeURI(encodeURI(row.name))}&path=${row.url}`
      location.href = this.fileDowloadName
    }
  }
}
</script>
<style lang="scss" scoped>
.read-only {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 999;
}
// .zindex {
//   position: absolute;
//   width: 100%;
//   z-index: 1999;
// }
//@import url(); 引入公共css类
</style>
