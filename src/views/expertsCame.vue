<template>
  <div class="expertsCame">
    <el-form ref="form">
      <el-form-item label="方案名称:">
        {{ workProgram.programName }}
      </el-form-item>
      <el-form-item label="方案性质:">
        {{ workProgram.nature }}
      </el-form-item>
      <el-form-item label="方案类别:">
        {{ workProgram.category }}
      </el-form-item>
      <el-form-item label="编写人:">
        {{ workProgram.createBy }}
      </el-form-item>
      <el-form-item label="方案概况:" style="margin-top:5px!important">
        <el-input
          type="textarea"
          :autosize="{ minRows: 6 }"
          v-model="workProgram.content"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item label="分部分项开工时间:">
        {{ workProgram.startTime }}
      </el-form-item>
      <div class="ctitle">附件</div>
      <el-form-item>
        <div class="my-list">
          <template v-for="(item, index) in workProgram.workProgramFileList">
            <el-row :key="index">
              <el-col :span="18" class="whiteSpace">
                <img src="../../public/img/filedome.png" />
                <span>
                  {{ item.fileName }}
                </span>
              </el-col>
              <el-col :span="6">
                <el-button
                  class="downloadBtn"
                  icon="el-icon-download"
                  @click="downLoadFile(index,0)"
                  >下载</el-button
                >
              </el-col>
            </el-row>
          </template>
        </div>
      </el-form-item>

      <el-form-item label="项目名称:" style="margin-top:5px!important">
        {{ newDisclosureHead.projectName }}
      </el-form-item>
      <el-form-item label="工序名称:">
        {{ newDisclosureHead.processName }}
      </el-form-item>
      <el-form-item label="交底部位:">
        {{ newDisclosureHead.disclosurePosition }}
      </el-form-item>
      <el-form-item label="施工单位:">
        {{ newDisclosureHead.constructionUnit }}
      </el-form-item>
      <el-form-item label="交底内容:" style="margin-top:5px!important">
        <el-input
          type="textarea"
          :autosize="{ minRows: 6 }"
          v-model="newDisclosureHead.jdContent"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item label="技术要求:" style="margin-top:5px!important">
        <el-input
          type="textarea"
          :autosize="{ minRows: 6 }"
          v-model="newDisclosureHead.technicalRequirement"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item label="注意事项/风险:" style="margin-top:5px!important">
        <el-input
          type="textarea"
          :autosize="{ minRows: 6 }"
          v-model="newDisclosureHead.mattersNeedingAttention"
          readonly
        ></el-input>
      </el-form-item>

      <div class="ctitle">附件</div>
      <el-form-item>
        <div class="my-list">
          <template v-for="(item, index) in newDisclosureHead.newDisclosureFileList">
            <el-row :key="index">
              <el-col :span="18" class="whiteSpace">
                <img src="../../public/img/filedome.png" />
                <span>
                  {{ item.jiaodiFileName }}
                </span>
              </el-col>
              <el-col :span="6">
                <el-button
                  class="downloadBtn"
                  icon="el-icon-download"
                  @click="downLoadFile(index,1)"
                  >下载</el-button
                >
              </el-col>
            </el-row>
          </template>
        </div>
      </el-form-item>
      <el-button
        class="submitBtn"
        type="primary"
        @click="submitForm"
        >签字
      </el-button>
    </el-form>
  </div>
</template>

<script type="text/javascript" src="https://js.cdn.aliyun.dcloud.net.cn/dev/uni-app/uni.webview.1.5.2.js"></script>
<script>
	document.addEventListener('UniAppJSBridgeReady', function() {
			document.getElementById('testdiv').addEventListener('click', function() {
				uni.postMessage({ 
					data: {
						action: '这是我传递的数据1',
						account: '123456789'
					}
				});
			})
		});
import {
  getDisclosureInfo,
  workProgramDetail
} from '@/api/system/class'

export default {
  data() {
    return {
	  info:{},
      businessTypeId: '',
	  jiaodiId:'',
	  newDisclosureHead:{},
	  workProgram:{}
    }
  },
	mounted(){
		const {jiaodiId} = this.$route.query
		this.jiaodiId = jiaodiId
		this.handleGetDisclosureInfo(this.$route.query)
	},
  methods: {
    async handleGetDisclosureInfo(obj){
		const data = await getDisclosureInfo(obj)
		const {newDisclosureHead,workProgram} = data.data.body
		this.newDisclosureHead = newDisclosureHead
		this.workProgram = workProgram
	},
    submitForm() {
		const userList = this.newDisclosureHead.newDisclosureUsersList.map(item=>item.bottonUser)
		this.$router.push('expertsSignature?userList='+userList.join(',')+'&jiaodiId='+this.jiaodiId)
    },

    //下载附件
    async downLoadFile(e,type) {
      let data = type?this.newDisclosureHead:this.workProgram
      let fileForm = {
        name: type?data.newDisclosureFileList[e].jiaodiFileName:data.workProgramFileList[e].fileName,
        path: type?data.newDisclosureFileList[e].jiaodiFileUrl:data.workProgramFileList[e].fileUrl
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
  }
}
</script>

<style lang="scss">
.expertsCame {
  padding-top: 5px;
  padding-bottom: 2vh;
  background-color: #f0f0f0;
  .whiteSpace {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
	text-align: left;
  }
  .ctitle {
    padding: 0 10px;
    background-color: #fff;
    color: #606266;
    margin-top: 5px;
    font-size: 14px;
    font-weight: 700;
    line-height: 6vh;
  }
  .el-form {
    background-color: #f0f0f0;
    .el-form-item {
      padding: 0 10px;
      background-color: #fff;
      border-bottom: 1px solid #eee;
      text-align: right;
      margin: 0 !important;
      .downloadBtn {
        width: 100%;
        height: 5vh !important;
        line-height: 5vh !important;
        color: #fff;
        font-size: 16px;
        background-color: #5583fe;
        border-radius: 2.5vh;
        border: none;
      }
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
        border-radius: 0;
      }
    }
    .submitBtn {
      display: block;
      width: 85%;
      margin: 2vh auto 0;
      height: 36px !important;
      line-height: 36px !important;
      background-color: #5583fe;
    }
  }
}

.my-list {
  display: flex;
  flex-direction: column;
  img {
    height: 6vh !important;
    vertical-align: middle;
  }
  .whiteSpace {
    span {
      color: #999999;
      cursor: pointer;
    }
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
