<template>
  <div class="expertsCame">
    <el-form ref="form" :model="form" label-width="19vw">
      <!-- <template>
        <el-form-item label="项目名称">
          {{ busData.projectName }}按实际的哈尽快
        </el-form-item>
        <el-form-item label="标段">
          {{ busData.bid }}
        </el-form-item>
        <el-form-item label="项目类型">
          {{ busData.projectType }}
        </el-form-item>
        <el-form-item label="项目类型">
          {{ busData.projectProcess }}
        </el-form-item>
        <el-form-item label="项目概况">
          {{ busData.survey }}
        </el-form-item>
        <el-form-item label="方案附件">
          <div class="my-list">
            <span
              v-for="(item, index) in busData.newProjectFileList"
              :key="index"
              @click="downLoadFile(index)"
            >
              {{ item.fileName }}
            </span>
          </div>
        </el-form-item>
      </template> -->
      <template>
        <el-form-item label="项目名称">
          {{ busData.projectName }}
        </el-form-item>
        <el-form-item label="方案名称">
          {{ busData.programName }}
        </el-form-item>
        <el-form-item label="方案性质">
          {{ busData.nature }}
        </el-form-item>
        <el-form-item label="方案类别">
          {{ busData.category }}
        </el-form-item>
        <el-form-item label="编写人员">
          {{ busData.createBy }}
        </el-form-item>
       <!-- <el-form-item label="项目概况">
          {{ busData.content }}
        </el-form-item> -->
        <el-form-item label="方案附件">
          <div class="my-list">
            <span
              v-for="(item, index) in busData.expertReviewFileList"
              :key="index"
              @click="downLoadFile(index)"
            >
              {{ item.fileName }}
            </span>
          </div>
        </el-form-item>
      </template>
      <el-form-item label-width="0" style="border:none">
        <el-input
          type="textarea"
          v-model="form.jointTrialOpinions"
          placeholder="会审意见"
        ></el-input>
      </el-form-item>
      <el-form-item label="你的名字">
        <el-input
          v-model="form.jointAssessor"
          placeholder="请输入名字"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="form.phone" placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item label="验证码" class="my-item">
        <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
        <el-button @click="getCode" :disabled="isDisabled">{{
          btnTxt
        }}</el-button>
      </el-form-item>
      <el-button
        class="submitBtn"
        type="primary"
        @click="submitForm('form')"
        :disabled="btnDisabled"
        >提交
      </el-button>
    </el-form>
  </div>
</template>

<script>
import {
  getMyCode,
  // getOpinionCode,
  //newExpertReviewOpinionAdd,
  expertReviewOpinionAdd,
  expertReviewOpinion
} from '@/api/system/class'

export default {
  data() {
    return {
      form: { jointAssessor: '', jointTrialOpinions: '', phone: '', code: '' },
      formData: {},
      btnDisabled: false,
      isDisabled: false,
      btnTxt: '获取验证码',
      // isShow: false,
      busData: {},
      businessTypeId: '',
	  expertreviewId:''
    }
  },
  methods: {
    async getCode() {
      let _self = this
      this.isDisabled = true
      let num = 60
      let setTime = setInterval(function() {
        num--
        if (num <= 0) {
          _self.isDisabled = false
          _self.btnTxt = '获取验证码'
          clearInterval(setTime)
        } else {
          _self.btnTxt = num + 's'
        }
      }, 1000)
      console.log(
        '触发获取验证码点击按钮',
        this.form.phone,
        /^1[3|4|5|7|8]\d{9}$/.test(this.form.phone),
        this.btnDisabled
      )
      if (
        this.form.phone &&
        /^1[3|4|5|7|8]\d{9}$/.test(this.form.phone) &&
        !this.btnDisabled
      ) {
        // 获取验证码
        console.log('获取验证码1')
        var { data: res } = await getMyCode({
          phonenumber: this.form.phone
        })
        console.log('获取验证码结果', res)

        if (res.code == 200) {
          this.$message({
            message: res.body,
            type: 'success',
            offset: 30,
            duration: 1500
          })
        } else {
          this.$message({
            message: res.body,
            type: 'error',
            offset: 30,
            duration: 1500
          })
        }
      } else if (!this.form.phone.trim() && !this.btnDisabled) {
        this.$message({
          message: '请填写手机号码',
          type: 'error',
          offset: 30,
          duration: 1000
        })
      } else if (
        !/^1[3|4|5|7|8]\d{9}$/.test(this.form.phone) &&
        !this.btnDisabled
      ) {
        this.$message({
          message: '请填写正确手机号码',
          type: 'error',
          offset: 30,
          duration: 1000
        })
      }
    },
    async submitForm() {
      if (
        this.form.jointAssessor.trim() &&
        this.form.jointTrialOpinions.trim() &&
        this.form.phone.trim() &&
        this.form.code.trim() &&
        /^1[3|4|5|7|8]\d{9}$/.test(this.form.phone) &&
        !this.btnDisabled
      ) {
        var { data: res } = await expertReviewOpinionAdd({
          erId:this.expertreviewId,
          jointAssessor: this.form.jointAssessor,
          jointTrialOpinions: this.form.jointTrialOpinions,
          phonenumber: this.form.phone,
          code: this.form.code
        })
        console.log('提交结果', res)
        this.btnDisabled = true
        if (res.code == 200) {
          this.$message({
            message: res.body,
            type: 'success',
            offset: 30,
            duration: 1500
          })
        } else {
          this.$message({
            message: res.body,
            type: 'error',
            offset: 30,
            duration: 1500
          })
        }
        setInterval(() => {
          this.btnDisabled = false
        }, 1500)
      } else if (!this.form.jointTrialOpinions.trim() && !this.btnDisabled) {
        this.$message({
          message: '请填写会审意见',
          type: 'error',
          offset: 30,
          duration: 1000
        })
      } else if (!this.form.jointAssessor.trim() && !this.btnDisabled) {
        this.$message({
          message: '请填写名字',
          type: 'error',
          offset: 30,
          duration: 1000
        })
      } else if (!this.form.phone.trim() && !this.btnDisabled) {
        this.$message({
          message: '请填写手机号码',
          type: 'error',
          offset: 30,
          duration: 1000
        })
      } else if (
        !/^1[3|4|5|7|8]\d{9}$/.test(this.form.phone) &&
        !this.btnDisabled
      ) {
        this.$message({
          message: '请填写正确手机号码',
          type: 'error',
          offset: 30,
          duration: 1000
        })
      } else if (!this.form.code.trim() && !this.btnDisabled) {
        this.$message({
          message: '请填写验证码',
          type: 'error',
          offset: 30,
          duration: 1000
        })
      }
    },

    //下载附件
    async downLoadFile(e) {
      let data = this.busData	  
      let fileForm = {
        name: data.expertReviewFileList[e].fileName,
        path: data.expertReviewFileList[e].fileUrl
      }
      let nameS = fileForm.path.substring(fileForm.path.lastIndexOf('.') + 1)
      let nameN = fileForm.name.substring(0, fileForm.name.lastIndexOf('.'))
      this.fileDowloadName =
        this.$store.state.apiConfiguration.url +
        this.$store.state.serviceName.jurisdiction +
        '/fs/download?name=' +
        encodeURI(encodeURI(nameN + '.' + nameS)) +
        '&path=' +
        fileForm.path
      location.href = this.fileDowloadName
    }
  },
  async created() {
    const { expertreviewId } = this.$route.query
    let busData = await expertReviewOpinion({
		expertreviewId
    })
	this.expertreviewId = expertreviewId
    this.busData = busData.data.body
  }
}
</script>

<style lang="scss">
.expertsCame {
  padding: 0 2vw;

  .el-form-item {
    border-bottom: 1px solid #eee;
    margin: 0 !important;

    .el-form-item__label,
    .el-form-item__content {
      line-height: 8vh !important;

      .el-input {
        .el-input__inner {
          border: none;
          height: 8vh !important;
          line-height: 8vh !important;
        }
      }
    }

    .el-textarea__inner {
      padding: 5px;
      border: none;
      border-bottom: 1px solid #eee;
      border-radius: 0;
    }
  }

  .submitBtn {
    display: block;
    width: 85%;
    margin: 5vh auto;
  }
}

.my-list {
  display: flex;
  flex-direction: column;

  span {
    margin: 10px 0;
    cursor: pointer;
  }
}

.my-item {
  width: 100%;

  .el-form-item__content {
    display: flex;
    align-items: center;

    .el-input {
      flex: 1;

      .el-input__inner {
        width: 100%;
      }
    }
  }
}
</style>
