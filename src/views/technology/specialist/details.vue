<template>
  <div class="speDetail" style="background: #f4f1f2;">
    <div class="people-content manage-details">
      <el-row class="row-height manage-basic">
        <el-col :span="24">
          <div class="area-tit">基础信息</div>
          <el-form
            :model="this.speData"
            ref="addData"
            label-width="120px"
            class="form-table"
          >
            <el-col :span="8">
              <el-form-item label="方案名称">
                <el-input
                  type="input"
                  v-model="speData.programName"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性质">
                <el-input
                  type="input"
                  v-model="speData.nature"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="类别">
                <el-input
                  type="input"
                  v-model="speData.category"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目名称">
                <el-input
                  type="input"
                  v-model="speData.projectName"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="标段">
                <el-input
                  type="input"
                  v-model="speData.bid"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="附件">
                <div @click="downLoadFile()">
                  <span
                    style="display:inline-block;cursor:pointer"
                    v-for="(item, index) in this.speData.expertReviewFileList"
                    :key="index"
                  >
                    {{ item.fileName }}
                  </span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="编写时间">
                <el-input
                  type="input"
                  v-model="speData.createTime"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="编写部门">
                <el-input
                  type="input"
                  v-model="speData.createByDept"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="编写人">
                <el-input
                  type="input"
                  v-model="speData.createBy"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-col>
      </el-row>
      <div class="dTableContont">
        <div class="area-tit" style="padding:0">会审内容</div>
        <el-table
          ref="multipleTable"
          :data="speData.expertReviewOpinionList"
          tooltip-effect="light"
          style="width: 100%"
          stripe
        >
          <el-table-column
            prop="jointAssessor"
            label="会审人"
            align="center"
            width="200px"
          ></el-table-column>
          <el-table-column
            prop="jointTrialOpinions"
            label="会审意见"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="jointTrialTime"
            label="会审时间"
            align="center"
            width="200px"
          ></el-table-column>
        </el-table>
        <!-- <el-row>
          <el-col class="rightbutton" :span="24">
            <el-button @click="cancel">取消</el-button>
          </el-col>
        </el-row> -->
      </div>
    </div>
  </div>
</template>

<script>
import { getSpeciaDetail } from '@/api/technology/specialist/specialist.js'
import { getToken } from '@/utils/auth'
import { isNumber, isID, isPhone } from '@/utils/validate.js'
export default {
  props: {
    speId: String
  },
  data() {
    return {
      form: {
        name: '',
        region: ''
      },
      label: [],
      jobProps: {
        value: 'id',
        label: 'label',
        checkStrictly: true
      },
      lceNum: ['1'],
      imageUrl: '',
      imageLceUrl: '',
      // manageData: {
      //   pxClass: "",
      //   pxTitle: "",
      //   planStartTime: "",
      //   planEndTime: "",
      //   pxClassHour: "",
      //   pxAgency: "",
      //   graduateDate: "",
      //   pxPlace: "",
      //   pxTeacher: "",
      //   kjName: "",
      //   userImg: "",
      //   trainplanFileList:null,
      // },
      speData: null,
      lceRes: [],
      eduRes: [],
      checkStrictly: false,
      defaultMenutree: [],
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label',
        disabled: function(data) {
          if (data.flag == '0') {
            return true
          } else {
            return false
          }
        }
      },
      lceName: 'categoryFile',
      checkStrictlyDept: false,
      defaultMenutreeDept: [],
      deptOptionsDept: [],
      defaultPropsDept: {
        children: 'children',
        label: 'label',
        disabled: function(data) {
          if (data.flag == '1') {
            return true
          } else {
            return false
          }
        }
      },
      treeArr: [],
      treeResDept: [],
      //签到人数
      signIn: '',
      //缺到人数
      lack: '',
      trainplanId: '',
      fileShow: true,
      temSignIn: [],
      temLack: []
      // optionList:{
      //   //会审人
      //   jointAssessor:null,
      //   //会审意见
      //   jointTrialOpinions:null,
      //   //会审时间
      //   jointTrialTime:null
      // ]
    }
  },
  created: async function() {
    this.getDetails()
  },
  computed: {
    getUrl() {
      return this.$store.state.apiConfiguration.url + '/fs/upload'
    },
    geHeaders() {
      return { Authorization: getToken() }
    }
  },

  methods: {
    async getDetails() {
      // let that = this
      this.expertreviewId = this.speId
      let expertreviewId = this.expertreviewId
      this.speData = await getSpeciaDetail(expertreviewId)
      console.log(this.speData)
      //  if(this.speData.expertReviewOpinionList==null||this.speData.expertReviewOpinionList==""){
      //    this.speData.expertReviewOpinionList={
      //      jointAssessor:null;
      //     jointTrialOpinions:null;
      //     jointTrialTime:null;
      //    }
      //    this.speData.expertReviewOpinionList[0].jointAssessor="暂无数据";
      //    this.speData.expertReviewOpinionList[0].jointTrialOpinions="暂无数据";
      //    this.speData.expertReviewOpinionList[0].jointTrialTime="暂无数据";
      //  }
    },
    //下载附件
    async downLoadFile() {
      let data = this.speData
      let fileForm = {
        name: data.expertReviewFileList[0].fileName,
        path: data.expertReviewFileList[0].fileUrl
      }
      this.fileDowloadName =
        this.$store.state.apiConfiguration.url +
        this.$store.state.serviceName.jurisdiction +
        '/fs/download?name=' +
        fileForm.name +
        '&path=' +
        fileForm.path
      location.href = this.fileDowloadName
    },
    getLceImg() {
      return this.$store.state.apiConfiguration.fileUrl + this.imageLceUrl
    },
    returnImgId(index) {
      return 'img' + index
    },
    returnIId(index) {
      return 'i' + index
    },
    openHelp() {
      this.itmeLabel = ''
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // cancel() {
    //   this.$emit('cancel')
    // },
    //获取证书类别下拉列表
    async getLceSel() {
      let dictName = 'certificate_category'
      this.lceRes = await getSelectLce(dictName)
      // console.log(this.workRes);
    },
    //获取学历下拉列表
    async getEduSel() {
      let dictName = 'education_type'
      this.eduRes = await getSelectEdu(dictName)
      // console.log(this.workRes);
    }

    // getCheckedNodesDept(leafOnly, includeHalfChecked, data) {
    //   this.addData.deptId = leafOnly.id
    //   console.log(this.addData.deptId);
    // }
  }
}
</script>

<style lang="scss" scoped>
.dTableContont {
  overflow: auto;
  background-color: #fff;
  border-top: 1px solid #eee;
  padding: 15px;
  .rightbutton{
    margin-top: 15px;
  }
}
</style>
