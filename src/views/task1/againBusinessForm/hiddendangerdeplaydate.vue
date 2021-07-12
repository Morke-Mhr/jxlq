<template>
  <!-- 隐患整改 延期 变更 协助人 -->
  <div>
    <el-form ref="form" :model="formDia" label-width="auto" :rules="rules">
      <el-form-item label="详情" class="formTitle"> </el-form-item>
      <el-form-item label="检查类别">
        {{ formDia.checkCategory }}
      </el-form-item>
      <el-form-item label="隐患级别">
        {{ yhList[formDia.hdLevel] }}
      </el-form-item>
      <el-form-item label="问题描述">
        {{ formDia.problemDesc }}
      </el-form-item>
      <el-form-item label="违反法规">
        {{ formDia.violationLaw }}
      </el-form-item>
      <el-form-item label="三违行为">
        {{ formDia.threeBehavior }}
      </el-form-item>
      <el-form-item label="治理要求">
        {{ formDia.controlClaim }}
      </el-form-item>
      <el-form-item label="计划完成日期">
        {{ formDia.planFinishTime }}
      </el-form-item>
      <el-form-item label="责任人">
        {{ formDia.dutyUser }}
      </el-form-item>
      <el-form-item label="实施人">
        {{ formDia.implementer }}
      </el-form-item>
      <el-form-item label="隐患图片">
        <div class="yhImg">
          <img
            v-for="item in formDia.hiddendangerFiles"
            :key="item.pictureId"
            :src="item.pictureUrl"
          />
        </div>
      </el-form-item>
      <!-- <el-form-item label="整改" class="formTitle"> </el-form-item>
      <el-form-item label="整改内容" prop="formDia2.rectContent">
        <el-input
          type="textarea"
          v-model="formDia.formDia2.rectContent"
        ></el-input>
      </el-form-item>
      <el-form-item label="预防措施" prop="formDia2.precaution">
        <el-input
          type="textarea"
          v-model="formDia.formDia2.precaution"
        ></el-input>
      </el-form-item>
      <el-form-item label="完成日期" prop="formDia2.realFinishTime">
        <el-date-picker
          v-model="formDia.formDia2.realFinishTime"
          type="datetime"
          placeholder="选择日期时间"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="整改图片" prop="formDia2.hiddendangerFiles">
        <el-upload
          :action="getUrl"
          :headers="geHeaders"
          :on-success="sucUpload"
          :on-remove="remUpload"
          :before-upload="beforeAvatarUpload"
          :file-list="formDia.formDia2.hiddendangerFiles"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item> -->
      <el-form-item prop="nextData.realName" label="审批人">
        <el-input
          v-model="formDia.nextData.realName"
          maxlength="30"
          placeholder="点击选择审批人"
          @focus="showSdialog"
          readonly
        ></el-input>
      </el-form-item>

      <!--选择审批人盒子-->
      <sdialog
        ref="sdialog"
        @choiceUser="choiceUser"
        :sNeed="true"
        dxId="user"
        :transferProps="{
          key: 'userId',
          label: 'realName'
        }"
        :treedata="treedata"
      ></sdialog>
    </el-form>
    <!-- <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="sabmitFun">重新提交</el-button>
      <el-button @click="closeFun">取 消</el-button>
    </span> -->
  </div>
</template>

<script>
import Sdialog from '@/components/selectDialog'
import { viewBusinessInfo } from '@/api/system/process'
import { getToken } from '@/utils/auth'
import { rectifyView, updateRectify } from '@/api/hiddenDanger/security'
import { getTreeSelect } from '@/api/system/process' // 部门列表

export default {
  props: {
    businessKey: String,
    businessCode: String,
    scopeRow: {}
  },
  components: {
    Sdialog: Sdialog
  },
  data() {
    return {
      // 校验
      rules: {
        'formDia2.rectContent': [
          { required: true, message: '请输入整改内容', trigger: 'blur' }
        ],
        'formDia2.precaution': [
          { required: true, message: '请输入预防措施', trigger: 'blur' }
        ],
        'formDia2.realFinishTime': [
          { required: true, message: '请选择完成日期', trigger: 'change' }
        ],
        'formDia2.hiddendangerFiles': [
          { required: 'array', message: '请上传整改图片', trigger: 'change' }
        ],
        'nextData.seleSpl': [
          { required: true, message: '请选择审批流', trigger: 'change' }
        ],
        'nextData.realName': [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      // 弹窗详情表单
      formDia: {
        formDia2: {
          // 整改内容
          rectContent: '',
          // 预防措施
          precaution: '',
          // 完成日期
          realFinishTime: '',
          // 附件集合
          hiddendangerFiles: []
        },
        nextData: {
          seleSpl: '',
          realName: ''
        }
      },
      yhList: {
        0: '微小',
        1: '一般',
        2: '重大'
      },
      treedata: [],
      sprData: {}
    }
  },
  methods: {
    // 取消
    closeFun() {
      this.$emit('closeDialog')
    },
    // 重新提交
    async sabmitFun() {
      let needData = {
        hyId: this.businessKey,
        rectContent: this.formDia.formDia2.rectContent,
        precaution: this.formDia.formDia2.precaution,
        realFinishTime: this.formDia.formDia2.realFinishTime,
        toUser: this.sprData.userId,
        businessCode: this.businessCode,
        taskId: this.scopeRow.taskId,
        hiddendangerFiles: ''
      }
      // 对需要上传的文件做处理
      needData.hiddendangerFiles = this.formDia.formDia2.hiddendangerFiles.map(
        (item) => {
          if (item.status == 'success') {
            return {
              pictureName: item.response.body.fileName,
              pictureUrl: item.response.body.url,
              pictureType: 1
            }
          }
        }
      )
      let res = await updateRectify(needData)
      this.$message.success(res)
      this.closeFun()
    },
    async showSdialog() {
      // 树形结构
      this.treedata = await getTreeSelect()
      this.$refs.sdialog.isShow = true
    },
    choiceUser(UserID, UserObject) {
      //子组件 选择参与人 完成后调用的事件
      this.sprData = UserObject[0] ? UserObject[0] : ''
      console.log(this.sprData, 999, UserID, UserObject[0])
      this.formDia.nextData.realName = this.sprData.realName
      this.$refs.sdialog.isShow = false
    },
    async getAllList() {
      let { body: res } = await viewBusinessInfo(
        this.businessCode,
        this.businessKey
      )
      res.hiddendangerFiles.forEach((item) => {
        if (
          item.pictureUrl.indexOf(
            this.$store.state.apiConfiguration.url +
              this.$store.state.serviceName.jurisdiction
          ) == '-1'
        ) {
          item.pictureUrl =
            this.$store.state.apiConfiguration.url +
            this.$store.state.serviceName.jurisdiction +
            item.pictureUrl
        }
      })
      console.log(res, 9999)
      res.leftImg = []
      res.rightImg = []

      res.hiddendangerFiles.forEach((item) => {
        if (item.pictureType == 1) {
          res.leftImg.push(item)
        } else {
          res.rightImg.push(item)
        }
      })
      res.hdLevelTxt = this.yhList[res.hdLevel]
      this.diaDataList = res
      console.log(this.diaDataList, 789)
    },
    // 文件上传前
    beforeAvatarUpload(file) {
      let extension = file.name.split('.')[1]
      let extensionList = ['bmp', 'jpg', 'png', 'gif', 'jepg']
      if (extensionList.indexOf(extension) < 0) {
        this.$message.error('上传失败！只能上传bmp,jpg,png,gif,jepg格式文件!')
        return false
        // return this.$refs.upload.abort();
      }
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 10MB!')
      }
      return isLt2M
    },
    // 文件上传成功后
    sucUpload(response, file, fileList) {
      this.formDia.formDia2.hiddendangerFiles = fileList
    },
    remUpload(file, fileList) {
      this.formDia.formDia2.hiddendangerFiles = fileList
    }
  },
  computed: {
    getUrl() {
      return (
        this.$store.state.apiConfiguration.url + 'jxlq-system-service/fs/upload'
      )
    },
    geHeaders() {
      return { Authorization: getToken() }
    }
  },
  async created() {
    var res = await rectifyView({ hyId: this.businessKey })
    res.hiddendangerFiles.forEach((item) => {
      if (
        item.pictureUrl.indexOf(
          this.$store.state.apiConfiguration.url +
            this.$store.state.serviceName.jurisdiction
        ) == '-1'
      ) {
        item.pictureUrl =
          this.$store.state.apiConfiguration.url +
          this.$store.state.serviceName.jurisdiction +
          item.pictureUrl
      }
    })
    this.formDia = {
      ...{
        formDia2: {
          // 整改内容
          rectContent: '',
          // 预防措施
          precaution: '',
          // 完成日期
          realFinishTime: '',
          // 附件集合
          hiddendangerFiles: []
        },
        nextData: {
          seleSpl: '',
          realName: ''
        }
      },
      ...res
    }
    console.log(this.formDia)
    this.yhzgDia = true
  }
}
</script>
<style lang="scss" scoped>
.yhImg img {
  width: 230px;
  height: 260px;
  display: block;
  // margin-left: 10px;
  border: 1px solid #f2f2f2;
}
.dialog-footer {
  float: right;
  margin: 10px 0;
}
//@import url(); 引入公共css类
</style>
