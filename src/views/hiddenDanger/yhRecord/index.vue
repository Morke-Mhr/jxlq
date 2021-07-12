<template>
  <!-- 隐患记录 -->
  <div class="safe_main">
    <div class="sxForm">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <template v-for="(value, key, index) in formInline">
          <el-form-item :key="index" :label="formInlineText[index]">
            <el-select
              clearable
              v-if="key == 'status'"
              v-model="formInline[key]"
              placeholder="请选择"
            >
              <el-option
                v-for="item in statusList"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictCode"
              >
              </el-option>
            </el-select>

            <el-select
              v-else-if="key == 'checkCategoryId'"
              v-model="formInline[key]"
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

            <el-select
              v-else-if="key == 'operaType'"
              v-model="formInline[key]"
              placeholder="请选择"
              @visible-change="$forceUpdate()"
            >
              <el-option
                v-for="item in operaTypeArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>

            <el-select
              v-else-if="key == 'hdLevel'"
              v-model="formInline[key]"
              clearable
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

            <el-input
              v-else-if="key != 'pageSize' && key != 'pageNum'"
              v-model="formInline[key]"
            ></el-input>
          </el-form-item>
        </template>
        <div class="btnCont">
          <el-button
            @click="onSubmit"
            :disabled="this.$route.params.problemDesc ? true : false"
            v-has="has.recordList"
            class="chaxun"
            >查询
          </el-button>
          <el-button class="chongzhi" @click="resetBtn" v-has="has.recordList"
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
          show-overflow-tooltip
          :align="item.align"
          :width="item.width"
        >
        </el-table-column>

        <el-table-column label="操作" align="center" width="90px">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="yhRecord(scope.row)"
              v-has="has.rectifyView"
              >查看
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
      title="查看"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      append-to-body
      custom-class="large"
    >
      <div class="formTitle height40">详情</div>
      <div style="overflow: auto">
        <el-form
          ref="form"
          :model="diaDataList"
          style="width: 45%"
          v-for="(tItem, ii) in [leftForm, rightForm]"
          :key="ii"
          :style="ii == 0 ? 'float: left;margin-right: 1.6rem' : 'float: left'"
        >
          <el-form-item
            v-for="(item, index) in tItem"
            :key="index"
            :label="item.label"
          >
            <el-input
              disabled
              class="inputAuto"
              v-if="item.type == 'input'"
              v-model="diaDataList[item.propVal]"
            ></el-input>
            <el-input
              disabled
              v-else-if="item.type == 'textarea'"
              type="textarea"
              :autosize="{ minRows: 3 }"
              v-model="diaDataList[item.propVal]"
              >textarea
            </el-input>
            <template v-else-if="item.type == 'img'">
              <div class="yhImg">
                <img
                  v-for="imgItem in diaDataList[item.propVal]"
                  :key="imgItem.pictureId"
                  :src="imgItem.pictureUrl"
                />
              </div>
            </template>
            <span v-else>{{ diaDataList[item.propVal] }}</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="formTitle height40">验收记录</div>
      <div class="sxForm">
        <el-table
          ref="multipleTable"
          :data="diaTableData"
          tooltip-effect="light"
          style="width: 100%"
          stripe
        >
          <el-table-column
            v-for="(item, index) in diaTable"
            :key="index"
            :label="item.label"
            :prop="item.propVal"
            show-overflow-tooltip
          >
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="exportBtn">打印</el-button>
        <el-button
          class="tBtn p15"
          plain
          v-if="yhtz.status == '整改中'"
          @click="exportZgnotice()"
          >打印整改通知单</el-button
        >
        <el-button class="tBtn" @click="istBtn">导入知识库</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  recordList,
  reappearDetails,
  recordView,
  showApplyhistory,
  exportWord,
  dictType,
  yhknowledgeDoc,
  exportZgnoticeWord
} from '@/api/hiddenDanger/security'

export default {
  name: 'yhRecord',
  props: {
    safecheckId: {
      type: String
    }
  },
  data() {
    return {
      // 检查类别
      jcList: [],
      // 当前查看的行数据
      nrowData: '',
      has: {
        // 隐患记录 查询
        recordList: 'hiddendanger:post:recordList',
        // 隐患记录 查看
        rectifyView: 'hiddendanger:post:recordView'
      },
      formInline: {
        // 责任部门
        dutyDept: '',
        // 检查类别
        checkCategoryId: '',
        // 隐患级别
        hdLevel: '',
        status: '',
        operaType: '',
        pageSize: 10,
        pageNum: '1'
      },
      yhList: {
        0: '微小',
        1: '一般',
        2: '重大'
      },
      yhjbList: [
        { dictCode: '0', dictLabel: '微小' },
        { dictCode: '1', dictLabel: '一般' },
        { dictCode: '2', dictLabel: '重大' }
      ],
      statusList: [
        { dictCode: 0, dictLabel: '待分配' },
        { dictCode: 1, dictLabel: '待审批' },
        { dictCode: 2, dictLabel: '待签收' },
        { dictCode: 3, dictLabel: '整改中' },
        { dictCode: 4, dictLabel: '待验收' },
        { dictCode: 5, dictLabel: '已完成' }
      ],
      operaTypeArr: [
        {
          value: '1',
          label: '我上报的'
        },
        {
          value: '2',
          label: '我分配的'
        },
        {
          value: '3',
          label: '我整改的'
        },
        {
          value: '4',
          label: '我负责的'
        }
      ],
      formInlineText: ['责任部门', '检查类别', '隐患级别', '状态', '操作类别'],
      // 配置列表显示项
      tableCol: [
        {
          label: '检查类别',
          propVal: 'checkCategory',
          width: 170,
          align: 'center'
        },
        {
          label: '登记时间',
          propVal: 'createTime',
          width: 200,
          align: 'center'
        },
        { label: '隐患级别', propVal: 'yhName', width: 90, align: 'center' },
        {
          label: '完成日期',
          propVal: 'realFinishTime',
          width: 200,
          align: 'center'
        },
        { label: '责任部门', propVal: 'dutyDept', width: 280, align: 'center' },
        { label: '责任人', propVal: 'dutyUser', width: 100, align: 'center' },
        { label: '状态', propVal: 'status', width: 100, align: 'center' },
        { label: '问题描述', propVal: 'problemDesc' }
      ],
      leftForm: [
        { label: '检查类别', propVal: 'checkCategory' },
        { label: '登记部门', propVal: 'createDept' },
        { label: '隐患级别', propVal: 'hdLevelTxt' },
        { label: '计划完成时间', propVal: 'planFinishTime' },
        { label: '责任人', propVal: 'dutyUser' },
        { label: '签收时间', propVal: 'signTime' },
        { label: '协助人', propVal: 'assistUser' },
        { label: '问题描述', propVal: 'problemDesc', type: 'textarea' },
        { label: '三违行为', propVal: 'threeBehavior', type: 'input' },
        { label: '治理要求', propVal: 'controlClaim', type: 'textarea' },
        { label: '整改内容', propVal: 'rectContent', type: 'textarea' },
        { label: '整改图片', propVal: 'leftImg', type: 'img' }
      ],
      rightForm: [
        { label: '隐患编号', propVal: 'hyId' },
        { label: '登记时间', propVal: 'createTime' },
        { label: '隐患类别', propVal: 'hdClass' },
        { label: '实际完成时间', propVal: 'realFinishTime' },
        { label: '登记人', propVal: 'createBy' },
        { label: '签收人', propVal: 'signUser' },
        { label: '实施人', propVal: 'implementer' },
        { label: '违反法规', propVal: 'violationLaw', type: 'textarea' },
        { label: '延期日期', propVal: 'delayTime', type: 'input' },
        { label: '变更原因', propVal: 'changeReason', type: 'textarea' },
        { label: '预防措施', propVal: 'precaution', type: 'textarea' },
        { label: '隐患图片', propVal: 'rightImg', type: 'img' }
      ],
      // 弹出层表格展示项
      diaTable: [
        { label: '验收时间', propVal: 'applyTime' },
        { label: '验收意见', propVal: 'applyOpnion' },
        { label: '验收人', propVal: 'applyUserName' }
      ],
      diaTableData: [],
      // 弹出层需要展示的数据
      diaDataList: {},
      tableData: [],
      //总条目
      total: 0,
      // 当前页数
      currentPage: 1,
      // 数据表单
      formDia: {},
      dialogVisible: false,
      yhtz: {}
    }
  },
  methods: {
    onSubmit() {
      this.getData('cx')
    },
    async getData(cx) {
      console.log(this.formInline)
      let res
      // 从隐患复现跳转
      if (this.$route.params.problemDesc) {
        console.log('params', this.$route.params)
        this.$route.params.pageSize = this.formInline.pageSize
        res = await reappearDetails(this.$route.params)
      } else {
        if (cx == 'cx') {
          this.formInline.pageNum = 1
          this.currentPage = 1
        }
        res = await recordList({
          ...this.formInline,
          ...{ safecheckId: this.safecheckId ? this.safecheckId : null }
        })
      }
      this.total = res.total
      this.tableData = res.rows.map((item) => {
        item.yhName = this.yhList[item.hdLevel]
        return item
      })
    },
    handleSizeChange(val) {
      this.formInline.pageSize = val
      this.getData()
    },
    handleCurrentChange(val) {
      console.log(this.$route.params)
      if (this.$route.params.problemDesc != '') {
        this.formInline.problemDesc = this.$route.params.problemDesc
        this.$route.params.pageNum = val
      }
      this.formInline.pageNum = val
      this.getData()
    },
    exportZgnotice() {
      exportZgnoticeWord({ hyId: this.yhtz.hyId })
    },
    async yhRecord(yhData) {
      this.dialogVisible = true
      console.log(yhData)
      this.yhtz = {
        hyId: yhData.hyId,
        status: yhData.status
      }
      let res = await recordView({ hyId: yhData.hyId })
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
      this.diaTableData = []
      if (res.checkHistorys != null) {
        res.checkHistorys.forEach((item) => {
          this.diaTableData.push(item)
        })
      }

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
      this.nrowData = this.diaDataList = res
      console.log(this.diaDataList, 789)
    },
    async istBtn() {
      let needData = {
        dictDataThreeViolation: {
          dictCode: this.nrowData.threeBehaviorId,
          dictLabel: this.nrowData.threeBehavior
        },
        dictDataYhkType: {
          dictCode: this.nrowData.hdClassId,
          dictLabel: this.nrowData.hdClass
        },
        fileList: this.nrowData.hiddendangerFiles.map((item) => {
          return {
            fileName: item.pictureName,
            fileUrl: item.pictureUrl.replace(
              this.$store.state.apiConfiguration.url +
                this.$store.state.serviceName.jurisdiction,
              ''
            )
          }
        }),
        violation: this.nrowData.precaution,
        yhkLevel: this.nrowData.hdLevel,
        yhkProblem: this.nrowData.problemDesc,
        yhkViolationLaw: this.nrowData.violationLaw,
        zlRequire: this.nrowData.controlClaim
      }
      console.log(this.nrowData, needData)
      let data = await yhknowledgeDoc(needData)
      if (data.includes('成功')) {
        this.$message.success(data)
      }
      this.dialogVisible = false
    },
    exportBtn() {
      exportWord({ hyId: this.diaDataList.hyId })
      // let res = await exportWord({ hyId: this.diaDataList.hyId })
      // console.log(res)
      this.dialogVisible = false
    },
    // 重置
    resetBtn() {
      this.formInline = {
        ...this.formInline,
        ...{
          // 责任部门
          dutyDept: '',
          // 检查类别
          checkCategoryId: '',
          // 隐患级别
          hdLevel: '',
          status: '',
          problemDesc: '',
          operaType: ''
        }
      }
      this.$route.params.problemDesc = null
      this.getData('cx')
    }
  },
  async created() {
    let type = sessionStorage.getItem('yhRecord')
    if (type == '重大') {
      sessionStorage.removeItem('yhRecord')
      console.log('不为空', type)

      // 检查类别
      this.formInline.hdLevel = '2'
      this.jcList = await dictType('safecheck_category')
      this.getData('cx')
    } else {
      console.log('为空')
      console.log(this.safecheckId, 'safecheckId')
      this.getData()
      // 检查类别
      this.jcList = await dictType('safecheck_category')
    }
  }
}
</script>

<style lang="scss" scoped>
.yhImg img {
  width: 230px;
  height: 260px;
  display: block;
  margin-left: 68px;
  border: 1px solid #f2f2f2;
}
</style>
