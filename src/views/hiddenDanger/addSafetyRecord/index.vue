<template>
  <!-- 安全计划——新增 -->
  <div class="safe_main">
    <div class="sxForm">
      <el-form
        ref="form"
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="检查分类" prop="checkClassId" label-width="110px">
          <el-select
            v-model="formInline.checkClassId"
            placeholder="请选择"
            @change="(val) => selectFun(val, 'checkClass', 'cb')"
            @visible-change="$forceUpdate()"
          >
            <el-option
              v-for="item in jcflList"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检查类别" prop="checkTypeId" label-width="110px">
          <el-select
            v-model="formInline.checkTypeId"
            placeholder="请选择"
            @change="(val) => selectFun(val, 'checkType', 'lb')"
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

        <el-form-item
          label="计划检查时间"
          prop="planCheckTime"
          label-width="110px"
          class="safeCheckTime"
        >
          <el-date-picker
            v-model="formInline.planCheckTime"
            type="datetime"
            placeholder="选择日期时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 200px;"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="组织部门" prop="leadDeptId" label-width="110px">
          <el-cascader
            v-model="formInline.leadDeptId"
            ref="refLeadDept"
            :show-all-levels="false"
            style="width: auto"
            :options="cascaderList"
            :props="{ checkStrictly: true, value: 'id' }"
            @change="getLeadUser"
            placeholder="选择部门"
            clearable
          ></el-cascader>
        </el-form-item>

        <el-form-item label="组织人" prop="leadUserId" label-width="110px">
          <el-select
            filterable
            v-model="formInline.leadUserId"
            placeholder="请先选择组织部门"
            @change="(val) => selectFun(val, 'leadUser')"
            @visible-change="$forceUpdate()"
          >
            <el-option
              v-for="item in leadUserList"
              :key="item.userId"
              :label="item.realName"
              :value="item.userId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="被检查单位"
          prop="becheckDeptId"
          label-width="110px"
        >
          <el-cascader
            v-model="formInline.becheckDeptId"
            ref="becheckDept"
            :show-all-levels="false"
            style="width: auto"
            :options="cascaderList"
            :props="{ checkStrictly: true, value: 'id' }"
            @change="getCheckUser"
            clearable
          ></el-cascader>
        </el-form-item>

        <el-form-item label="周期" prop="zq" label-width="110px">
          <el-select
            v-model="formInline.zq"
            placeholder="请选择"
            @visible-change="$forceUpdate()"
          >
            <el-option
              v-for="item in zqList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批" prop="isSp" label-width="110px">
          <el-radio-group v-model="isSp" @change="isSpchange">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="sxTable addSafety">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="light"
        style="width: 100%"
        height="500"
        stripe
        v-loading="loading"
        element-loading-text="拼命加载中"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"> </el-table-column>
        <el-table-column label="序号" align="center" width="60">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
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

        <el-table-column
          label="检查责任部门"
          show-overflow-tooltip
          align="center"
          width="240"
        >
          <template slot-scope="scope">
            <el-cascader
              v-model="scope.row.zcfzClassId"
              @visible-change="$forceUpdate()"
              :ref="scope.row.zcfzRef"
              :show-all-levels="false"
              :options="cascaderList"
              :props="{ checkStrictly: true, value: 'id' }"
              @change="
                (arr) => {
                  getZcfzClass(arr, scope.row)
                }
              "
              clearable
            ></el-cascader>
          </template>
        </el-table-column>
        <el-table-column
          label="检查责任人"
          show-overflow-tooltip
          align="center"
          width="240"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.zcfzUserId"
              placeholder="请选择"
              filterable
              @change="(val) => selectFun2(val, scope.row)"
              @visible-change="$forceUpdate()"
            >
              <template v-if="isShows">
                <el-option
                  v-for="item in _data['zcfzClassList' + scope.row.sbId]"
                  :key="item.userId"
                  :label="item.realName"
                  :value="item.userId"
                >
                </el-option>
              </template>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="90">
          <template slot-scope="scope">
            <el-button type="text" class="red" @click="delBtn(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="footer" v-if="isSp === 1">
        <div class="f_header">
          <span>流程设置</span>
        </div>
        <template>
          <el-form
            :model="nextData"
            class="change-form"
            :rules="rules"
            ref="form2"
            label-position="right"
            label-width="110px"
          >
            <el-form-item prop="seleSpl" label="选择审批流">
              <el-select
                v-model="nextData.seleSpl"
                placeholder="请选择"
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

            <el-form-item prop="realName" label="审批人">
              <el-input
                v-model="nextData.realName"
                maxlength="30"
                placeholder="点击选择审批人"
                @focus="showSdialog"
                readonly
              ></el-input>
              <!-- <el-button style="float:right" type="text" @click="showSdialog"
                >选择审批人</el-button
              > -->
            </el-form-item>
          </el-form>
        </template>
      </div>
    </div>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  dictType,
  safecheckDoc,
  getBusinessList,
  submitSafecheck,
  getCheckClassList,
  getCheckTypeList
} from '@/api/hiddenDanger/security'
import { getBusinesspost } from '@/api/job/safety'
import Sdialog from '@/components/selectDialog'
import { getTreeSelect, getUsersInform } from '@/api/system/process' // 部门列表
import { getBranch, getPeople } from '@/api/job/salary'
export default {
  name: 'addSafetyRecord',
  components: {
    Sdialog: Sdialog
  },
  data() {
    return {
      // 校验
      rules: {
        checkTypeId: [{ required: true, message: '请选择', trigger: 'change' }],
        checkClassId: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        leadUserId: [{ required: true, message: '请选择', trigger: 'change' }],
        planCheckTime: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        leadDeptId: [
          { required: 'array', message: '请选择', trigger: 'change' }
        ],
        becheckDeptId: [
          { required: 'array', message: '请选择', trigger: 'change' }
        ],
        zq: [{ required: true, message: '请选择', trigger: 'change' }],
        seleSpl: [
          { required: true, message: '请选择审批流', trigger: 'change' }
        ],
        realName: [
          { required: true, message: '请选择审批人', trigger: 'change' }
        ]
      },
      // 加载
      loading: false,
      treedata: [],
      // 级联选择绑定数据
      cascaderList: [],
      // 责任人列表
      leadUserList: [],
      // 检查类别
      jcList: [],
      // 检查分类
      jcflList: [],
      tableData: [],
      // 配置列表显示项
      tableCol: [
        {
          label: '检查项目',
          propVal: 'checkProject',
          width: 170,
          align: 'center'
        },
        { label: '检查内容', propVal: 'checkContent' }
      ],
      formInline: {
        // 检查类别编号
        checkTypeId: '',
        // 组织部门编号
        leadDeptId: '',
        // 组织人编号
        leadUserId: '',
        // 计划检查时间
        planCheckTime: '',
        // 被检查部门编号
        becheckDeptId: '',
        // 检查分类id
        checkClassId: '',
        // 周期
        zq: ''
      },
      nextData: {
        seleSpl: '',
        realName: ''
      },
      // 选择审批流
      seleSpl: '',
      // 检查类别名称
      checkType: '',
      // 检查分类名称
      checkClass: '',
      // 组织部门名称
      leadDept: '',
      // 组织人名称
      leadUser: '',
      // 被检查部门名称
      becheckDept: '',
      // 是否审批
      isSp: 0,
      splList: [],
      zqList: [
        {
          key: '0',
          value: '不重复'
        },
        {
          key: '0 0 0 * * ? *',
          value: '每天重复'
        },
        {
          key: '0 0 0 ? * 7',
          value: '每周重复'
        },
        {
          key: '0 0 0 1 * ? *',
          value: '每月重复'
        },
        {
          key: '0 0 0 28 12 ? *',
          value: '每年重复'
        }
      ],
      zcfzClass: [],
      isShows: true,
      sprData: {},
      checkProiect: '',
      categories: '',
      nodeName: '',
      // 批量操作数组项
      selItemArr: []
    }
  },
  methods: {
    handleSelectionChange(selItem) {
      this.selItemArr = selItem
      console.log(selItem, 'selItem')
    },
    async selectFun(val, txt, cz) {
      // val为当前选中的值  txt为传过来的字符串
      // debugger;
      if (txt) {
        // this[txt] = event.target.innerText;
        if (txt == 'checkType') {
          this.checkProiect = val
          this.checkType = event.target.innerText
          if (this.checkProiect != '' && this.categories != '') {
            this.dataRequest()
          }
        }
        if (txt == 'checkClass') {
          this.categories = val
          this.checkClass = event.target.innerText
          if (this.checkProiect != '' && this.categories != '') {
            this.dataRequest()
          }
        }
        if (txt == 'leadUser') {
          this.leadUser = event.target.innerText
        }
        if (txt == 'seleSpl') {
          let data = {
            processDefinitionKey: val
          }
          let nodeName = await getBusinesspost(data)
          this.nodeName = nodeName.nodeName
        }
      }
    },
    async dataRequest() {
      try {
        this.loading = true
        var res = await safecheckDoc({
          checkClassId: this.categories,
          checkTypeId: this.checkProiect
        })
        res.forEach((item, idx) => {
          item['zcfzClass'] = ''
          item['zcfzClassId'] = ''
          item['sbId'] = idx + 1
          item['zcfzUser'] = ''
          item['zcfzUserId'] = ''
          item['zcfzRef'] = 'zcfzRef' + (idx + 1)
          this._data['zcfzClassList' + (idx + 1)] = []
        })
        this.tableData = res
      } finally {
        this.loading = false
      }
    },

    // 添加前确认
    addOpen() {
      this.$confirm('正在执行新增操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.submitFun('form')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    selectFun2(val, rowData) {
      let hasItem = this.selItemArr.find((item) => item.sbId == rowData.sbId)
      let hasZcfzClass = this.selItemArr.find(
        (item) => item.zcfzClass && item.zcfzClass != ''
      )
      console.log(this._data, '_data', this.selItemArr, hasItem, hasZcfzClass)
      if (hasZcfzClass) {
        this.selItemArr.forEach((item) => {
          item.zcfzClass = hasZcfzClass.zcfzClass
          item.zcfzClassId = hasZcfzClass.zcfzClassId
          this._data['zcfzClassList' + item.sbId] = this._data[
            'zcfzClassList' + hasZcfzClass.sbId
          ]
        })
        // this.getZcfzClass([hasZcfzClass.zcfzClassId], hasZcfzClass)
      }
      if (this.selItemArr.length > 1 && hasItem) {
        this.selItemArr.forEach((item) => {
          item.zcfzUser = event.target.innerText
          item.zcfzUserId = rowData.zcfzUserId
        })
      } else {
        rowData.zcfzUser = event.target.innerText
      }
      console.log(val, rowData, this.selItemArr, 'this.selItemArr')
    },
    // 获取级联选择数据
    async getCascader() {
      // 组织部门
      this.cascaderList = await getBranch()
    },
    // 获取组织人列表
    async getLeadUser(arr) {
      console.log(arr, 'arr')
      // console.log(this.formInline.leadDeptId, arr)
      if (this.$refs['refLeadDept'].getCheckedNodes()[0]) {
        this.leadDept = this.$refs['refLeadDept'].getCheckedNodes()[0].label
      }
      if (arr.length > 0) {
        this.formInline.leadUserId = ''
        // this.formInline.leadDeptId = arr[arr.length - 1]
        this.leadUserList = await getPeople(arr[arr.length - 1])
      } else {
        this.formInline.leadUserId = ''
        this.leadUserList = []
      }
    },
    async getCheckUser(arr) {
      if (this.$refs['becheckDept'].getCheckedNodes()[0]) {
        this.becheckDept = this.$refs['becheckDept'].getCheckedNodes()[0].label
      }
      if (arr.length > 0) {
        // this.formInline.becheckDeptId = ''
        // this.formInline.becheckDeptId = arr[arr.length - 1]
        this.leadUserList = await getPeople(arr[arr.length - 1])
      } else {
        this.formInline.becheckDeptId = ''
        this.leadUserList = []
      }
    },
    async getZcfzClass(arr, rowData) {
      this.isShows = false
      if (arr.length > 0) {
        rowData.zcfzClassId = ''
        rowData.zcfzClassId = arr[arr.length - 1]
        this._data['zcfzClassList' + rowData.sbId] = await getPeople(
          arr[arr.length - 1]
        )
        rowData.zcfzClass = this.$refs[
          rowData.zcfzRef
        ].getCheckedNodes()[0].label
      } else {
        rowData.zcfzClassId = ''
        rowData.zcfzClass = ''
        this._data['zcfzClassList' + rowData.sbId] = []
      }
      let hasItem = this.selItemArr.find((item) => item.sbId == rowData.sbId)
      if (this.selItemArr.length > 1 && hasItem) {
        this.selItemArr.forEach((item) => {
          item.zcfzClass = rowData.zcfzClass
          item.zcfzClassId = rowData.zcfzClassId
          item.zcfzUserId = ''
          item.zcfzUser = ''
          this._data['zcfzClassList' + item.sbId] = this._data[
            'zcfzClassList' + rowData.sbId
          ]
        })
      }
      this.isShows = true
    },
    // 删除
    delBtn(rowData) {
      this.tableData.splice(this.tableData.indexOf(rowData), 1)
    },
    async isSpchange(val) {
      if (val === 1) {
        this.splList = await getBusinessList({
          businessCode: this.$store.state.approvalProcess.safecheck
        })
      } else {
        this.splList = []
        this.nextData.seleSpl = ''
        this.nextData.realName = ''
      }
    },
    async showSdialog() {
      // 树形结构
      this.treedata = await getTreeSelect()
      this.$refs.sdialog.isShow = true
    },
    choiceUser(UserID, UserObject) {
      //子组件 选择参与人 完成后调用的事件
      this.sprData = UserObject[0]
      console.log(this.sprData, 999, UserID)
      this.nextData.realName = this.sprData.realName
      this.$refs.sdialog.isShow = false
    },
    // 确定新增
    submitFun(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('正在执行新增操作, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(async () => {
              var safecheckDocVos = this.tableData.map((item) => {
                return {
                  checkContent: item.checkContent,
                  checkDutyDeptId: item.zcfzClassId,
                  checkDutyDept: item.zcfzClass,
                  checkDutyUserId: item.zcfzUserId,
                  checkDutyUser: item.zcfzUser,
                  projectName: item.checkProject
                }
              })
              var needData = {
                // 检查分类编号
                checkClassId: this.formInline.checkClassId,
                // 检查分类名称
                checkClass: this.checkClass,
                // 定时任务执行周期
                cycle: this.formInline.zq,
                // 检查类别编号
                checkTypeId: this.formInline.checkTypeId,
                // 检查类别名称
                checkType: this.checkType,
                // 组织部门编号
                leadDeptId: Array.isArray(this.formInline.leadDeptId)
                  ? this.formInline.leadDeptId[
                      this.formInline.leadDeptId.length - 1
                    ]
                  : this.formInline.leadDeptId,
                // 组织部门名称
                leadDept: this.leadDept,
                // 组织人编号
                leadUserId: this.formInline.leadUserId,
                // 组织人名称
                leadUser: this.leadUser,
                // 计划检查时间
                planCheckTime: this.formInline.planCheckTime,
                // 被检查部门编号
                becheckDeptId: Array.isArray(this.formInline.becheckDeptId)
                  ? this.formInline.becheckDeptId[
                      this.formInline.becheckDeptId.length - 1
                    ]
                  : this.formInline.becheckDeptId,
                // 被检查部门名称
                becheckDept: this.becheckDept,
                // 是否审批
                isApprove: this.isSp,
                // 关联的项目（可能有一批项目关联）
                safecheckDocVos: safecheckDocVos
              }
              if (this.isSp === 1) {
                needData.processDefinitionKey = this.nextData.seleSpl
                needData.toUser = this.sprData.userId
              }
              // console.log(this.splList,needData,456)

              // let isNext = safecheckDocVos.some((item) => {
              //   return (
              //     item.checkDutyDep != "" ||
              //     item.checkDutyDeptId != "" ||
              //     item.checkDutyUser != "" ||
              //     item.checkDutyUserId != ""
              //   );
              // });
              // debugger
              if (this.isSp === 0) {
                let res = await submitSafecheck(needData)
                if (res.indexOf('成功') != -1) {
                  this.$parent.$parent.addVisible = false
                  this.$emit('callFather')
                  this.$message.success(res)
                }
              } else if (this.isSp === 1) {
                this.$refs['form2'].validate(async (valid2) => {
                  if (valid2) {
                    let res = await submitSafecheck(needData)
                    if (res.indexOf('成功') != -1) {
                      this.$parent.$parent.addVisible = false
                      this.$emit('callFather')
                      this.$message.success(res)
                    }
                  }
                })
              } else {
                this.$message.warning('请确认表格项是否均已选择...')
              }
            })
            .catch(() => {
            })
        } else {
          this.$message.warning('请先填选表单数据...')
          return false
        }
      })
    }
  },
  async created() {
    // 检查类别
    this.jcList = await getCheckTypeList()
    // 检查分类 safecheck_type
    this.jcflList = await getCheckClassList()
    this.getCascader()
    let userData = await getUsersInform(this.userId)
    this.formInline.leadDeptId = userData.user.deptId
    this.getLeadUser([userData.user.deptId])
    this.formInline.leadUserId = this.userId
    this.leadUser = this.userName
    this.leadDept = userData.user.depts[0].deptName
  },
  computed: {
    ...mapGetters(['userId', 'userName'])
  }
}
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 20px;
  padding: 10px 0;
  background-color: #fff;
  border-radius: 4px;
  .f_header {
    span {
      font-weight: 700;
    }
    font-size: 14px !important;
    height: 40px;
    line-height: 40px;
    margin-bottom: 10px;
    border-left: 4px solid #5583fe;
    padding-left: 10px;
    border-bottom: 1px solid #eee;
    .el-button {
      height: 40px;
      line-height: 40px;
      float: right;
      padding: 0;
    }
  }
}
</style>
