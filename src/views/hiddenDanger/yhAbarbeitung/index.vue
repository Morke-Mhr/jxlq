<template>
  <!-- 隐患整改 -->
  <div class="safe_main">
    <div class="sxForm">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <template v-for="(value, key, index) in formInline">
          <el-form-item
            :key="index"
            v-if="key != 'pageSize' && key != 'pageNum'"
            :label="formInlineText[index]"
          >
            <el-select
              clearable
              v-if="formInlineText[index] == '隐患级别'"
              v-model="formInline[key]"
              placeholder="请选择"
            >
              <el-option
                v-for="item in yhjbList"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictCode"
              >
              </el-option>
            </el-select>
            <el-select
              v-else-if="formInlineText[index] == '检查类别'"
              v-model="formInline.checkCategoryId"
              placeholder="请选择"
              @visible-change="$forceUpdate()"
            >
              <el-option
                v-for="item in jcList"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictCode"
              >
              </el-option>
            </el-select>
            <el-input v-else v-model="formInline[key]"></el-input>
          </el-form-item>
        </template>
        <div class="btnCont">
          <el-button @click="onSubmit" v-has="has.rectifyList" class="chaxun"
            >查询
          </el-button>
          <el-button class="chongzhi" @click="resetBtn" v-has="has.rectifyList"
            >重置
          </el-button>
        </div>
      </el-form>
    </div>
    <div class="sxTable">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="light"
        style="width: 100%"
        height="calc(100vh - 370px)"
        stripe
      >
        <el-table-column
          v-for="(item, index) in tableCol"
          :key="index"
          :label="item.label"
          :prop="item.propVal"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column label="操作" align="center" width="145px">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="zgBtn(scope.row)"
              v-has="has.rectifyView"
              >整改
            </el-button>

            <el-button
              type="text"
              @click="ycApply(scope.row)"
              v-has="has.deviantApply"
              >异常申请
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[1, 10, 20, 30]"
        :page-size="formInline.pageSize"
        background
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog
      title="隐患整改"
      :close-on-click-modal="false"
      :visible.sync="yhzgDia"
      custom-class="small"
    >
      <el-form ref="form" :model="formDia" label-width="auto" :rules="rules">
        <el-form-item label="详情" class="formTitle"></el-form-item>
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
        <el-form-item label="整改" class="formTitle"></el-form-item>
        <el-form-item label="整改内容" prop="formDia2.rectContent">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3 }"
            v-model="formDia.formDia2.rectContent"
            maxlength="300"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="预防措施" prop="formDia2.precaution">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3 }"
            v-model="formDia.formDia2.precaution"
            maxlength="300"
            show-word-limit
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
            <el-button class="p15">点击上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="流程设置" class="formTitle"></el-form-item>
        <el-form-item prop="nextData.seleSpl" label="选择审批流">
          <el-select
            v-model="formDia.nextData.seleSpl"
            placeholder="请选择审批流"
            @change="(val) => selectFun(val, 'seleSpl')"
            @visible-change="$forceUpdate()"
          >
            <el-option
              v-for="item in splList"
              :key="item.id"
              :label="item.businessName"
              :value="item.processDefinitionKey"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批岗位">
          <el-input v-model="nodeName" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item prop="formDia.dutyUser" label="审批人">
          <el-input
            v-model="formDia.dutyUser"
            maxlength="30"
            readonly
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="yhzgDia = false">取 消</el-button>
        <el-button class="tBtn" @click="zgOpen('整改','form')" v-has="has.rectifyEdit"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="异常申请"
      :close-on-click-modal="false"
      :visible.sync="ycsqDia"
      custom-class="small"
    >
      <el-tabs v-model="activeTab" type="border-card" @tab-click="tabClick">
        <el-tab-pane label="申请延期" name="form1">
          <el-form ref="form1" label-width="auto" :model="firstData">
            <el-form-item label="详情" class="formTitle"></el-form-item>
            <el-form-item
              label="延期日期"
              prop="historyDelayTime"
              :rules="{
                required: true,
                message: '请选择日期时间',
                trigger: 'blur,change'
              }"
            >
              <el-date-picker
                v-model="firstData.historyDelayTime"
                type="datetime"
                placeholder="选择日期时间"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label="延期原因"
              prop="changeReason"
              :rules="{
                required: true,
                message: '请填写延期原因',
                trigger: 'blur,change'
              }"
            >
              <el-input
                type="textarea"
                :autosize="{ minRows: 3 }"
                v-model="firstData.changeReason"
                maxlength="200"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="变更实施人" name="form2">
          <el-form ref="form2" label-width="auto" :model="secData">
            <el-form-item label="详情" class="formTitle"></el-form-item>
            <el-form-item
              label="变更原因"
              prop="changeReason"
              :rules="{
                required: true,
                message: '请填写变更原因',
                trigger: 'blur,change'
              }"
            >
              <el-input
                type="textarea"
                :autosize="{ minRows: 3 }"
                v-model="secData.changeReason"
                maxlength="200"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="申请协助人" name="form3">
          <el-form ref="form3" label-width="auto" :model="threeData">
            <el-form-item label="详情" class="formTitle"></el-form-item>
            <el-form-item
              label="申请原因"
              prop="changeReason"
              :rules="{
                required: true,
                message: '请填写申请原因',
                trigger: 'blur,change'
              }"
            >
              <el-input
                type="textarea"
                :autosize="{ minRows: 3 }"
                v-model="threeData.changeReason"
                maxlength="200"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="ycsqDia = false">取 消</el-button>
        <el-button class="tBtn" @click="zgOpen('异常申请',activeTab)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getBusinesspost } from '@/api/job/safety'

const defaultPageSize = 10
import Sdialog from '@/components/selectDialog'
import { getTreeSelect } from '@/api/system/process' // 部门列表
import { getToken } from '@/utils/auth'
import {
  rectifyList,
  rectifyView,
  rectifyEdit,
  getBusinessList,
  deviantApply,
  dictType
} from '@/api/hiddenDanger/security'

export default {
  components: {
    Sdialog: Sdialog
  },
  data() {
    return {
      nodeName: '',
      // 检查类别
      jcList: [],
      has: {
        // 隐患整改 查询
        rectifyList: 'hiddendanger:post:rectifyList',
        // 隐患整改查看
        rectifyView: 'hiddendanger:post:rectifyView',
        // 隐患整改编辑
        rectifyEdit: 'hiddendanger:post:rectifyEdit',
        // 隐患整改异常申请
        deviantApply: 'hiddendanger:post:deviantApply'
      },
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
        ]
      },
      yhjbList: [
        { dictCode: '0', dictLabel: '微小' },
        { dictCode: '1', dictLabel: '一般' },
        { dictCode: '2', dictLabel: '重大' }
      ],
      formInline: {
        // 问题描述
        problemDesc: '',
        // 检查类别
        checkCategoryId: '',
        // 隐患级别
        hdLevel: '',
        // 责任人
        dutyUser: '',
        // 实施人
        // implementer: '',
        pageSize: defaultPageSize,
        pageNum: '1'
      },
      formInlineText: ['问题描述', '检查类别', '隐患级别', '责任人'],
      // 配置列表显示项
      tableCol: [
        { label: '问题描述', propVal: 'problemDesc' },
        { label: '检查类别', propVal: 'checkCategory' },
        { label: '隐患级别', propVal: 'yhName' },
        { label: '责任人', propVal: 'dutyUser' },
        // { label: '实施人', propVal: 'implementer' },
        { label: '计划完成时间', propVal: 'planFinishTime' },
        { label: '完成时间', propVal: 'realFinishTime' },
        { label: '状态', propVal: 'status' }
      ],
      tableData: [],
      //总条目
      total: 0,
      // 当前页数
      currentPage: 1,
      // 弹窗
      yhzgDia: false,
      // 异常申请弹窗
      ycsqDia: false,
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
      seleSpl: '',
      splList: [],
      treedata: [],
      sprData: {},
      // tab选中项 与当前需要验证的表单ref同值
      activeTab: 'form1',
      // 第一个tab数据
      firstData: {
        // 申请延期
        realFinishTime: '',
        changeReason: ''
      },
      // 二
      secData: {
        changeReason: ''
      },
      // 三
      threeData: {
        changeReason: ''
      },
      reqData: {
        hyId: '',
        // 异常处理类型
        signType: '',
        // 业务模块编号
        processDefinitionKey: '',
        // 审批人ID
        toUser: ''
      },
      // 当前计划完成日
      nowPlanFinishTime: null
    }
  },
  methods: {
    // 整改前确认
    zgOpen(cls,activeTab) {
      this.$refs[activeTab].validate(async (valid) => {
        if (valid) {
          this.$confirm('正在执行不可逆操作, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              if (cls == '整改') {
                this.istBtn('form')
              } else if (cls == '异常申请') {
                this.ycApplyBtn()
              }
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
        } else {
          this.$message({
            type: 'error',
            message: '有必填项未填写'
          })
          return false
        }
      })
    },
    onSubmit() {
      this.getData('cx')
    },
    async getData(cx) {
      console.log(this.formInline)
      if (cx == 'cx') {
        this.formInline.pageNum = 1
        this.currentPage = 1
      }
      let res = await rectifyList(this.formInline)
      this.total = res.total
      this.tableData = res.rows.map((item) => {
        item.yhName = this.yhList[item.hdLevel]
        return item
      })
      console.log(res, 999)
    },
    handleSizeChange(val) {
      this.formInline.pageSize = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.formInline.pageNum = val
      this.getData()
    },
    // 整改事件
    async zgBtn(rowData) {
      var res = await rectifyView({ hyId: rowData.hyId })
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
    },
    // 确定按钮事件
    istBtn(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          var editData = {
            hyId: this.formDia.hyId,
            rectContent: this.formDia.formDia2.rectContent,
            precaution: this.formDia.formDia2.precaution,
            realFinishTime: this.formDia.formDia2.realFinishTime,
            processDefinitionKey: this.formDia.nextData.seleSpl,
            toUser: this.formDia.dutyUserId
          }
          // 对需要上传的文件做处理
          editData.hiddendangerFiles = this.formDia.formDia2.hiddendangerFiles.map(
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
          console.log(editData)
          var res = await rectifyEdit(editData)
          this.$message.success(res)
          this.resetBtn()
          this.yhzgDia = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    ycApply(ycData) {
      this.firstData = {
        // 申请延期
        realFinishTime: '',
        changeReason: ''
      }
      ;(this.secData = {
        changeReason: ''
      }),
        (this.threeData = {
          changeReason: ''
        })
      this.reqData.hyId = ycData.hyId
      this.reqData.toUser = ycData.dutyUserId
      this.ycsqDia = true
      this.nowPlanFinishTime = ycData.planFinishTime
      console.log('异常申请', ycData)
    },
    async selectFun(val, txt) {
      // val为当前选中的值  txt为传过来的字符串
      if (txt) {
        this[txt] = event.target.innerText
      }
      // console.log(val,txt,this[txt])
      if (txt == 'seleSpl') {
        let data = {
          processDefinitionKey: val
        }
        let nodeName = await getBusinesspost(data)
        this.nodeName = nodeName.nodeName
      }
    },
    async Spchange() {
      this.formDia.nextData.seleSpl = ''
      this.splList = await getBusinessList({
        businessCode: this.$store.state.approvalProcess.hiddendangercheck
      })
    },
    async showSdialog() {
      // 树形结构
      this.treedata = await getTreeSelect()
      this.$refs.sdialog.isShow = true
    },
    tabClick(tab, event) {
      console.log(tab, event, this.activeTab)
    },
    ycApplyBtn() {
      this.$refs[this.activeTab].validate(async (valid) => {
        if (valid) {
          var dataObj = {}
          this.reqData.signType = this.activeTab
          if (this.activeTab == 'form1') {
            this.reqData.processDefinitionKey = 'hiddendangerdeplaydate'
            dataObj = { ...this.reqData, ...this.firstData }
          } else if (this.activeTab == 'form2') {
            this.reqData.processDefinitionKey = 'hiddendangerimplementer'
            dataObj = { ...this.reqData, ...this.secData }
          } else if (this.activeTab == 'form3') {
            this.reqData.processDefinitionKey = 'hiddendangerhelper'
            dataObj = { ...this.reqData, ...this.threeData }
          }
          console.log(this.nowPlanFinishTime, 789789789)
          if (
            !this.nowPlanFinishTime ||
            !dataObj.historyDelayTime ||
            this.nowPlanFinishTime.replace(/\-/g, '') <=
              dataObj.historyDelayTime.replace(/\-/g, '')
          ) {
            var res = await deviantApply(dataObj)
            // console.log(res)
            this.$message.success(res)
            this.resetBtn()
            this.ycsqDia = false
          } else {
            this.$message.error('申请延期日期不能早于计划完成时间')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置
    resetBtn() {
      this.formInline = {
        ...this.formInline,
        ...{
          // 问题描述
          problemDesc: '',
          // 检查类别
          checkCategoryId: '',
          // 隐患级别
          hdLevel: '',
          // 责任人
          dutyUser: ''
          // 实施人
          // implementer: ''
        }
      }
      this.getData('cx')
    }
  },
  async created() {
    this.getData()
    this.Spchange()
    // 检查类别
    this.jcList = await dictType('safecheck_category')
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
  }
}
</script>

<style lang="scss" scoped>
.yhImg img {
  width: 230px;
  height: 260px;
}
</style>
