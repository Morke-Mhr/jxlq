<template>
  <!-- 隐患签收 -->
  <div class="safe_main">
    <div class="sxForm">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="问题描述">
          <el-input v-model="formInline.problemDesc"></el-input>
        </el-form-item>
        <el-form-item label="检查类别">
          <el-select
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
        </el-form-item>
        <el-form-item label="隐患级别">
          <el-select
            v-model="formInline.hdLevel"
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
        </el-form-item>
        <el-form-item label="责任人">
          <el-input v-model="formInline.dutyUser"></el-input>
        </el-form-item>
        <el-form-item label="实施人">
          <el-input v-model="formInline.implementer"></el-input>
        </el-form-item>
        <div class="btnCont">
          <el-button @click="onSubmit" v-has="has.signForList" class="chaxun"
            >查询</el-button
          >
          <el-button class="chongzhi" @click="resetBtn" v-has="has.signForList"
            >重置</el-button
          >
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
          prop="checkCategory"
          label="检查类别"
          align="center"
          width="170px"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="yhName"
          label="隐患级别"
          align="center"
          width="90px"
        >
        </el-table-column>
        <el-table-column
          prop="createDept"
          label="登记部门"
          align="center"
          width="280px"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="dutyUser"
          label="责任人"
          align="center"
          width="100px"
        >
        </el-table-column>
        <el-table-column
          prop="implementer"
          label="实施人"
          align="center"
          width="100px"
        >
        </el-table-column>
        <el-table-column
          prop="planFinishTime"
          label="计划完成日期"
          align="center"
          width="150px"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          align="center"
          width="110px"
        >
        </el-table-column>
        <el-table-column
          prop="problemDesc"
          label="问题描述"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column label="操作" align="center" width="90px">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="signBtn(scope.row)"
              v-has="has.signForView"
              >签收</el-button
            >
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
      title="签收"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      custom-class="small"
    >
      <el-form ref="form" :model="formDia" label-width="auto">
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
        <el-form-item label="计划完成时间">
          {{ formDia.planFinishTime }}
        </el-form-item>
        <el-form-item label="责任人">
          {{ formDia.dutyUser }}
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
        <el-form-item
          prop="implementer"
          label="实施人"
          :rules="{ required: true, message: '请选择', trigger: 'change' }"
        >
          <el-select
            v-model="formDia.implementer"
            placeholder="请选择"
            @change="(val) => selectFun(val, 'implementerTxt')"
            @visible-change="$forceUpdate()"
          >
            <el-option
              v-for="item in ssrList"
              :key="item.userId"
              :label="item.realName"
              :value="item.userId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="dialogVisible = false">取 消</el-button>
        <el-button class="tBtn p15" plain @click="exportZgnotice()"
          >打印整改通知单</el-button
        >
        <el-button class="tBtn" @click="signOpen()" v-has="has.signForEdit"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  signForList,
  signForView,
  signForEdit,
  dictType,
  exportZgnoticeWord
} from '@/api/hiddenDanger/security'
import { getPeople } from '@/api/job/salary'
const defaultPageSize = 10
export default {
  data() {
    return {
      // 检查类别
      jcList: [],
      has: {
        // 隐患签收全部查询
        signForList: 'hiddendanger:post:signForList',
        // 隐患签收编辑查看
        signForView: 'hiddendanger:post:signForView',
        // 隐患签收编辑
        signForEdit: 'hiddendanger:post:signForEdit'
      },
      yhjbList: [
        { dictCode: '0', dictLabel: '微小' },
        { dictCode: '1', dictLabel: '一般' },
        { dictCode: '2', dictLabel: '重大' }
      ],
      formInline: {
        problemDesc: '',
        checkCategoryId: '',
        hdLevel: '',
        implementer: '',
        dutyUser: '',
        pageSize: defaultPageSize,
        pageNum: '1'
      },
      yhList: {
        0: '微小',
        1: '一般',
        2: '重大'
      },
      tableData: [],
      //总条目
      total: 0,
      // 当前页数
      currentPage: 1,
      //默认当前页
      pageNum: 1,
      // 所选中项的id
      delArr: [],
      dialogVisible: false,
      formDia: {
        // 实施人
        implementer: ''
      },
      // 实施人列表
      ssrList: [],
      implementerTxt: ''
    }
  },
  methods: {
    // 签收前确认
    signOpen() {
      this.$confirm('正在执行隐患签收操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.istBtn('form')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    exportZgnotice() {
      exportZgnoticeWord({ hyId: this.formDia.hyId })
    },

    selectFun(val, txt) {
      // val为当前选中的值  txt为传过来的字符串
      if (txt) {
        this[txt] = event.target.innerText
      }
      // console.log(val,txt,this[txt])
    },
    onSubmit() {
      this.getData('cx')
    },
    handleSizeChange(val) {
      this.formInline.pageSize = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.formInline.pageNum = val
      this.getData()
    },
    async getData(cx) {
      if (cx == 'cx') {
        this.formInline.pageNum = 1
        this.currentPage = 1
      }
      let res = await signForList(this.formInline)
      this.total = res.total
      this.tableData = res.rows.map((item) => {
        item.yhName = this.yhList[item.hdLevel]
        return item
      })
      // this.tableData = res.rows
      console.log(this.tableData, 789)
    },
    async signBtn(rowData) {
      var res = await signForView({ hyId: rowData.hyId })
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
      this.formDia = { ...this.formDia, ...res }
      this.ssrList = await getPeople(rowData.dutyDeptId)
      this.dialogVisible = true
      console.log(rowData, this.formDia, this.ssrList, 999)
    },
    istBtn(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let signData = {
            hyId: this.formDia.hyId,
            implementer: this.implementerTxt,
            implementerId: this.formDia.implementer
          }
          var res = await signForEdit(signData)
          // console.log(this.formDia,res)
          this.$message.success(res)
          this.getData('cx')
          this.dialogVisible = false
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
          problemDesc: '',
          checkCategoryId: '',
          hdLevel: '',
          implementer: '',
          dutyUser: ''
        }
      }
      this.getData('cx')
    }
  },
  async created() {
    this.getData()
    // 检查类别
    this.jcList = await dictType('safecheck_category')
  }
}
</script>
<style lang="scss" scoped>
.yhImg img {
  width: 230px;
  height: 260px;
}
</style>
