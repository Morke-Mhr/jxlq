<template>
  <div class="container-table safety-plan">
    <div class="table-list confide-content">
      <div class="page-tit">编辑</div>
      <el-form
        :model="addPlan"
        :rules="formRules"
        class="clearfix"
        ref="operationFome"
        label-width="150px"
        label-position="right"
      >
        <el-form-item
          label="培训类别"
          style="width: 50%; float: left"
          prop="pxClassId"
        >
          <el-select
            v-model="addPlan.pxClassId"
            placeholder="请选择培训类别"
            @change="peojectTypeFunc"
            style="width: 100%"
          >
            <el-option
              :value="item.dictCode"
              v-for="item in classRes"
              :key="item.dictCode"
              :label="item.dictLabel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="培训主题"
          style="width: 50%; float: left"
          prop="pxTitleId"
        >
          <el-select
            v-model="addPlan.pxTitleId"
            placeholder="请选择培训主题"
            @change="peojectFunc"
            style="width: 100%"
          >
            <el-option
              :value="item.dictCode"
              v-for="item in themeRes"
              :key="item.dictCode"
              :label="item.dictLabel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="内容"
          prop="pxContent"
          style="width: 50%; float: left"
        >
          <el-input
            v-model="addPlan.pxContent"
            maxlength="300"
            show-word-limit
            placeholder="请输入内容"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item
          label="计划培训开始时间"
          prop="planStartTime"
          style="width: 50%; float: left"
        >
          <el-date-picker
            v-model="addPlan.planStartTime"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%"
            :picker-options="startOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="计划培训结束时间"
          prop="planEndTime"
          style="width: 50%; float: left"
        >
          <el-date-picker
            v-model="addPlan.planEndTime"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%"
            :picker-options="endOptions"
          >
          </el-date-picker>
        </el-form-item>
        <!-- 线下 -->
        <el-form-item
          label="课时(单位:时)"
          prop="pxClassHour"
          style="width: 50%; float: left"
          v-show="classHourShow"
        >
          <el-input
            v-model.number="addPlan.pxClassHour"
            maxlength="3"
            show-word-limit
            placeholder="请输入课时"
          />
        </el-form-item>
        <el-form-item
          label="培训方式"
          prop="pxWay"
          style="width: 50%; float: left"
        >
          <el-radio-group v-model="addPlan.pxWay" @change="wayChange">
            <el-radio :label="false" :disabled="addPlan.pxWay">线上</el-radio>
            <el-radio :label="true" :disabled="!addPlan.pxWay">线下</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="培训机构" style="width: 50%; float: left">
          <el-input
            v-model="addPlan.pxAgency"
            maxlength="30"
            show-word-limit
            placeholder="请输入培训机构"
          />
        </el-form-item>
        <el-form-item label="授课老师" style="width: 50%; float: left">
          <el-input
            v-model="addPlan.pxTeacher"
            maxlength="30"
            show-word-limit
            placeholder="请输入授课老师"
          />
        </el-form-item>
        <el-form-item
          label="培训地点"
          prop="pxPlace"
          style="width: 50%; float: left"
          v-show="AddressShow"
        >
          <el-input
            v-model="addPlan.pxPlace"
            maxlength="30"
            show-word-limit
            placeholder="请输入培训地点"
          />
        </el-form-item>
        <!-- 线上 -->
        <el-form-item
          label="关联课件"
          prop="kjName"
          style="width: 100%; float: left"
          v-show="traincoursewareShow"
        >
          <el-select
            v-model="kjName"
            placeholder="请选择主题"
            style="width: 100%"
            @change="addSelBook"
          >
            <el-option
              :value="{ value: item.traincoursewareId, label: item.kjName }"
              v-for="item in bookSelRes"
              :key="item.traincoursewareId"
              :label="item.kjName"
            ></el-option>
          </el-select>
        </el-form-item>

        <!--交底时间和交底人还没写-->

        <!-- <el-form-item label="培训人员" :rules="{
            required: true,
            message: '请选择课件附件',
            trigger: 'blur'
          }"> -->
        <div class="clearfix">
          <div class="area-confide" style="margin-bottom: 10px">
            <div class="clearfix confide">
              <label
                style="text-align: right;float:left; inline-block;width: 120px;padding: 0 12px 0 0;color: #606266;width: 150px;"
                prop="trainPersonList"
                >培训人员</label
              >
              <table style="float: left">
                <tr>
                  <td>部门</td>
                  <td style="border-left: 1px solid #dcdfe6">人员</td>
                  <td style="border-left: 1px solid #dcdfe6">操作</td>
                </tr>
                <template v-if="tabShow">
                  <tr
                    v-for="(item, index) in addPlan.trainPersonList"
                    :key="index"
                  >
                    <td>&nbsp;{{ item.dept }}</td>
                    <td style="border-left: 1px solid #dcdfe6">
                      &nbsp;{{ item.user }}
                    </td>
                    <td style="border-left: 1px solid #dcdfe6">
                      <el-button
                        type="text"
                        @click="open(index, addPlan.trainPersonList, 'tabShow')"
                        >删除</el-button
                      >
                    </td>
                  </tr>
                </template>
              </table>

              <el-button
                style="
                  font-size: 14px;
                  cursor: pointer;
                  float: right;
                  width: 70px;
                "
                @click="alertChoose"
                >选择</el-button
              >
            </div>
          </div>
        </div>
        <!-- </el-form-item> -->

        <!-- <el-form-item label="审批" prop="isApply">
          <el-radio-group v-model="addPlan.isApply">
            <el-radio label="false" @change="hiddenApply">不需要</el-radio>
            <el-radio :label="true" @change="visibleApply">需要</el-radio>
          </el-radio-group>
        </el-form-item> -->
      </el-form>

      <div v-if="addPlan.isApply">
        <div class="tit">流程设置</div>
        <el-form
          :model="nextData"
          :rules="nextDataFormRules"
          ref="nextDataFormRules"
          class="change-form"
        >
          <el-form-item prop="nodeName" label="下一个流程节点">
            <el-input
              v-model="nextData.nodeName"
              maxlength="30"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item prop="roleName" label="审批岗位">
            <el-input
              v-model="nextData.roleName"
              maxlength="30"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item prop="userName" label="审批人">
            <el-input
              v-model="nextData.userName"
              maxlength="30"
              placeholder="点击选择审批人"
              readonly
              @focus="alertChooseSp"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div style="text-align: right">
        <el-button class="confirm-btn" v-has="has.addPlanBtn" @click="addxz">
          提交
        </el-button>
        <el-button class="cancel-btn" @click="cancelBtn"> 取消 </el-button>
      </div>

      <!--穿梭框盒子-->
      <div class="sdialog">
        <el-dialog
          :visible.sync="dialogVisibleDept"
          :close-on-click-modal="false"
          :title="'选择部门'"
          custom-class="s_dialog large"
          append-to-body
        >
          <el-card class="left">
            <el-tree
              class="permission-tree"
              node-key="id"
              ref="deptTree"
              :check-strictly="checkStrictly"
              :default-expanded-keys="defaultMenutree"
              :default-checked-keys="defaultMenutree"
              :data="deptOptionsArr"
              :props="defaultProps"
              @check-change="setCheckedNodes"
              show-checkbox
            />
          </el-card>
          <el-card class="right">
            <el-transfer
              :props="{ key: 'userId', label: 'user' }"
              v-model="value"
              :data="data"
              :button-texts="['选出', '选入']"
            ></el-transfer>
          </el-card>
          <div style="text-align: right">
            <el-button tclass="tBtn selDialog" @click="selectDept">
              提交
            </el-button>
            <el-button
              class="fBtn selDialog"
              @click="dialogVisibleDept = false"
            >
              取消
            </el-button>
          </div>
        </el-dialog>
      </div>

      <!--穿梭框盒子-->
      <div class="sdialog">
        <el-dialog
          :visible.sync="dialogVisibleDeptSp"
          :close-on-click-modal="false"
          :title="'选择部门'"
          custom-class="s_dialog large"
          append-to-body
        >
          <el-card class="left">
            <el-tree
              class="permission-tree"
              node-key="id"
              ref="deptTree"
              :check-strictly="checkStrictly"
              :default-expanded-keys="defaultMenutree"
              :default-checked-keys="defaultMenutree"
              :data="deptOptions"
              :props="defaultProps"
              @check-change="setCheckedNodes"
              show-checkbox
            />
          </el-card>
          <el-card class="right">
            <el-transfer
              :props="{ key: 'userId', label: 'user' }"
              v-model="value"
              :data="data"
              :button-texts="['选出', '选入']"
            ></el-transfer>
          </el-card>
          <div style="text-align: right">
            <el-button class="tBtn selDialog" @click="selectDeptSp">
              提交
            </el-button>
            <el-button
              class="fBtn selDialog"
              @click="dialogVisibleDeptSp = false"
            >
              取消
            </el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getLoginDeptPerson,
  getTreeSelect,
  getTreeDeptByLogin
} from '@/api/system/dept'
import { getSelectTheme } from '@/api/system/class'
import {
  getModification,
  getTrainBook,
  getPlanList,
  getPlanDetail,
  getDelete
} from '@/api/safety/plan.js'

import { getChangeJobNextNode } from '@/api/system/process'
// xx
let kjName = [
  {
    required: true,
    message: '请选择关联课件',
    trigger: ['change', 'blur']
  }
]
let pxClassHour = [
  {
    required: true,
    message: '请输入课时',
    trigger: 'blur'
  },
  { type: 'number', message: '课时必须为数字值' }
]
let pxPlace = [
  {
    required: true,
    message: '请输入培训地点',
    trigger: 'blur'
  }
]

export default {
  name: 'index',
  props: {
    person: String
  },

  data() {
    const isSelect = (rule, value, callback) => {
      if (value == 0) {
        //如果值是 0，提示用户选择正确的选项
        callback(new Error('请选择'))
      } else {
        callback()
      }
    }

    return {
      tabShow: true,
      nextData: {
        nodeName: '',
        roleName: '',
        userName: ''
      },
      toUser: [],
      chooseUserId: null,
      prosessSetDialg: true,
      //课时输入框显示隐藏
      classHourShow: false,
      //培训地点输入框显示隐藏
      AddressShow: false,
      //关联课件显示隐藏
      traincoursewareShow: false,
      classRes: [],
      themeRes: [],
      bookSelRes: [],
      thirdLevelCheckboxModel: [],
      checkedDeptIndex: 0,

      jdUserOption: [],
      firstLevelRadio: {
        checkerUserId: '',
        nextChargerUserId: ''
      },
      secondLevelRadio: {
        checkerUserId: '',
        nextChargerUserId: ''
      },
      thirdLevelRadio: {
        checkerUserId: '',
        nextChargerUserId: ''
      },

      firstLevel: {
        level: 1,
        type: 'oneLevel'
      },
      secondLevel: {
        level: 2,
        type: 'twoLevel'
      },
      thirdLevel: {
        level: 3,
        type: 'threeLevel'
      },
      disabledChoose: false,
      disabledChooseNext: false,
      disabledChooseTwo: false,
      disabledChooseNextTwo: false,
      disabledChooseOne: false,
      disabledChooseNextOne: false,
      oneJd: '',
      oneNext: '',
      twoJd: '',
      twoNext: '',
      threeJd: '',
      threeNext: '',
      deptPersonProps: {
        key: 'userId',
        label: 'realName',
        disabled: false
      },
      selectDeptIndex: 1,
      data: [],
      value: [],
      has: {
        remove: '',
        query: '',
        add: '',
        edit: '',
        addPlanBtn: 'train:trainPlan:add'
      },
      dialogVisibleDept: false,
      dialogVisibleDeptSp: false,
      //搜索  项目清单
      confideItem: ['1'],
      //选择列表 项目清单
      addTotal: '',
      addPageSizes: [5],
      addPageForm: {
        pageNum: 1,
        pageSize: 10,
        jdTypeId: '',
        projectName: '',
        bid: '',
        engineName: '',
        jdUser: ''
      },
      jobProps: {
        value: 'id',
        label: 'label',
        checkStrictly: true
      },
      addPlan: {
        trainCoursewareList: [
          {
            //课件id
            traincoursewareId: ''
          }
        ],
        trainplanId: '',
        //培训人员集合
        trainPersonList: [],
        //培训主题id
        pxTitleId: '',
        //培训主题
        pxTitle: '',
        //培训类别id
        pxClassId: '',
        //培训类别
        pxClass: '',
        //培训内容
        pxContent: '',
        //培训计划开始时间
        planStartTime: '',
        //培训计划结束时间
        planEndTime: '',
        //培训课时
        pxClassHour: '',
        //培训形式
        pxWay: '',
        //培训机构
        pxAgency: '',
        //授课老师
        pxTeacher: '',
        //培训地点
        pxPlace: '',
        //是否需要审批
        isApply: ''
      },
      kjName: '', //课件名
      confideItemList: false,
      flag: true,
      defaultMenutree: [],
      multipleSelection: [],
      //穿梭框列表
      transferList: [],
      //穿梭框文件id数组
      transferListId: [],

      //选择列表
      addTableData: [],
      loading: false,
      tableData: [],
      tableKey: 0,
      listLoading: false,
      dialogVisible: false,
      deptOptions: [],
      deptOptionsArr: [],
      fileLists: [],
      checkStrictly: true,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      //部门名称
      deptLabel: [],
      currentChecke: '',
      //性质
      natureRes: [],
      //类别
      confideRes: [],
      addTotal: '',
      //选择的部门id
      chooseDeptId: '',
      deptPerson: null,
      EditTrainplanId: '', //主键ID
      startOptions: {
        disabledDate: (time) => {
          let endDateVal = this.addPlan.planEndTime
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime()
          }
        }
      },
      endOptions: {
        disabledDate: (time) => {
          let beginDateVal = this.addPlan.planStartTime
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime()
          }
        }
      },
      //表单验证方法
      formRules: {
        pxClassId: [
          {
            required: true,
            message: '请选择培训类别',
            trigger: 'change',
            validator: isSelect
          }
        ],
        pxTitleId: [
          {
            required: true,
            message: '请选择培训主题',
            trigger: 'change',
            validator: isSelect
          }
        ],
        pxContent: [
          {
            required: true,
            message: '请输入内容',
            trigger: 'blur'
          }
        ],
        planStartTime: [
          {
            required: true,
            message: '请选择计划培训开始时间',
            trigger: 'blur'
          }
        ],
        planEndTime: [
          {
            required: true,
            message: '请选择计划培训结束时间',
            trigger: 'blur'
          }
        ],

        pxWay: [
          {
            required: true,
            message: '请选择培训方式',
            trigger: 'blur'
          }
        ],
        // pxAgency: [
        //   {
        //     required: true,
        //     message: '请输入培训机构',
        //     trigger: 'blur'
        //   }
        // ],
        // pxTeacher: [
        //   {
        //     required: true,
        //     message: '请输入授课老师',
        //     trigger: 'blur'
        //   }
        // ],
        // pxClassHour,
        // pxPlace,
        // traincoursewareId,

        isApply: [
          {
            required: true,
            message: '请选择是否审批',
            trigger: 'change',
            validator: isSelect
          }
        ]
      },
      nextDataFormRules: {
        nodeName: [
          {
            required: true,
            message: '请选择下一个流程节点',
            trigger: 'blur'
          }
        ],
        roleName: [
          {
            required: true,
            message: '请选择审批岗位',
            trigger: 'blur'
          }
        ],
        userName: [
          {
            required: true,
            message: '请选择审批人',
            trigger: 'change'
          }
        ],
        trainPersonList: [
          {
            required: true,
            message: '请选择培训人员',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    getUrl() {
      return this.$store.state.apiConfiguration.url + '/fs/upload'
    }
  },
  created: async function(scope) {
    this.deptOptions = await getTreeSelect()
    this.getClassSel()
    this.getThemeSel()
    this.getNextProcess()
    this.iEditTrainplanId = this.person
    this.information()
  },
  watch: {
    // ["addPlan.pxWay"](nData) {
    //   if (nData == false) {
    //     //线上
    //     this.formRules = {
    //       ...this.formRules,
    //       "trainCoursewareList.traincoursewareId": traincoursewareId,
    //       pxClassHour: [],
    //       pxPlace: [],
    //     };
    //     this.$nextTick(() => {
    //       this.$refs.operationFome.validateField([
    //         "trainCoursewareList.traincoursewareId",
    //       ]);
    //       this.$refs.operationFome.clearValidate(["pxClassHour", "pxPlace"]);
    //     });
    //   } else {
    //     //线下
    //     this.formRules = {
    //       ...this.formRules,
    //       "trainCoursewareList.traincoursewareId": [],
    //       pxClassHour,
    //       pxPlace,
    //     };
    //     this.$nextTick(() => {
    //       this.$refs.operationFome.validateField(["pxClassHour", "pxPlace"]);
    //       this.$refs.operationFome.clearValidate([
    //         "trainCoursewareList.traincoursewareId",
    //       ]);
    //     });
    //   }
    // },
  },
  methods: {
    async information() {
      let PlanData = await getPlanDetail(this.iEditTrainplanId)
      this.addPlan = PlanData
      this.kjName = PlanData.trainCoursewareList[0].kjName
      this.addPlan.trainCoursewareList[0].traincoursewareId =
        PlanData.trainCoursewareList[0].traincoursewareId
      if (this.addPlan.pxClassHour == '') {
        this.wayChange(true)
      } else {
        this.wayChange(false)
      }
    },
    //取消操作
    cancelBtn() {
      this.$store.state.tabActive = 'plan'
      console.log(this.$store.state.tabActive)
      this.$emit('fatherMethod')
    },
    // 删除操作
    open(index, userList, isshow) {
      this[isshow] = false
      userList.splice(index, 1)
      this[isshow] = true
    },
    //获取流程回显的数据
    async getNextProcess() {
      let that = this
      //向下一个节点传参
      let nextNodesData = {
        userId: this.$store.state.user.user.userId,
        businessCode: this.$store.state.approvalProcess.trainplan
      }
      console.log('需要传参的数据结果:' + nextNodesData)
      this.nextData = await getChangeJobNextNode(nextNodesData)

      this.addPlan.businessCode = nextNodesData.businessCode
      this.addPlan.toUser = this.nextData.userId
    },
    // hiddenApply() {
    //   this.prosessSetDialg = false;
    // },
    // //单击单选按钮审批弹出窗口
    // visibleApply() {
    //   this.prosessSetDialg = true;
    //   this.getNextProcess();
    // },
    async wayChange(value) {
      let that = this
      //true为线下  false为线上
      if (value) {
        //课时输入框显示隐藏
        that.classHourShow = true
        //培训地点输入框显示隐藏
        that.AddressShow = true
        //关联课件显示隐藏
        that.traincoursewareShow = false
      } else {
        that.classHourShow = false
        //培训地点输入框显示隐藏
        that.AddressShow = false
        //关联课件显示隐藏
        that.traincoursewareShow = true
        delete that.addPlan.pxPlace
        delete that.addPlan.pxClassHour
        let planId = {
          pxClassId: that.addPlan.pxClassId,
          pxTitleId: that.addPlan.pxTitleId
        }

        if (planId.pxClassId != '' && planId.pxTitleId != '') {
          that.bookSelRes = await getTrainBook(planId)
          this.$refs.operationFome.clearValidate(['pxClassId', 'pxTitleId'])
        } else {
          this.$notify({
            title: '提示',
            message: '请先选择培训类别和培训主题!',
            duration: 2000
          })
          this.$nextTick(() => {
            this.$refs.operationFome.validateField(['pxClassId', 'pxTitleId'])
          })
        }
        // that.addSelBook();
      }
    },
    //关联课件下拉接口
    async addSelBook(val) {
      //把值赋给要传给后台的表单对象中
      // debugger;
      this.addPlan.trainCoursewareList[0].traincoursewareId = val.value
    },

    levelRadioLabel(level, label, index) {
      let reruenLabel = ''
      switch (level) {
        case 1:
          reruenLabel = 'level1'
          break
        default:
          break
      }
      reruenLabel += label + index
      return reruenLabel
    },

    //获取部门id
    async deptChange(val) {
      this.addConfide.jdDeptId = val[val.length - 1]
      this.jdUserOption = await getLoginDeptPerson(this.addConfide.jdDeptId)
      this.addConfide.jdDept = this.$refs.cascader
        .getCheckedNodes()[0]
        .pathLabels.pop()
    },
    //穿梭框获取人员
    async setCheckedNodes(nodes, checked, indeterminate) {
      console.log('setCheckedNodes', nodes, checked, indeterminate)
      this.chooseDeptId = nodes.id
      //查询指定部门id的下的人员
      let temDeptPerson = await getLoginDeptPerson(this.chooseDeptId)
      this.deptPerson = temDeptPerson
      if (checked) {
        this.deptLabel.push(nodes.label)
        //选中节点
        if (temDeptPerson.length > 0) {
          //将人员列表格式改为穿梭框可以支持的格式
          for (let i = 0; i < temDeptPerson.length; i++) {
            let temPerson = {}
            temPerson.userId = temDeptPerson[i].userId
            temPerson.user = temDeptPerson[i].realName
            temPerson.deptId = nodes.id
            temPerson.dept = nodes.label
            this.data.push(temPerson)
            this.data = this.deWeightThree('userId', this.data)
          }
        }
      } else {
        //取消选中节点
        if (temDeptPerson.length > 0) {
          let temData = this.data
          for (let i = 0; i < temData.length; i++) {
            for (let j = 0; j < temDeptPerson.length; j++) {
              if (temData[i].userId == temDeptPerson[j].userId) {
                temData.splice(i, 1)
              }
            }
          }
        }
      }
    },

    //下拉根据部门id获取部门下的人
    async getPerson() {
      let deptId = this.addConfide.jdDeptId
      let personRes = await getLoginDeptPerson(deptId)
    },
    //选择部门弹窗
    async alertChoose() {
      //清空 树 选中
      //清空 穿梭框 内容和选中的值
      this.$nextTick(() => {
        this.data = []
        this.value = []
        this.$nextTick(() => {
          this.$refs.deptTree.setCheckedKeys([])
        })
      })
      this.deptOptionsArr = await getTreeDeptByLogin()
      this.dialogVisibleDept = true
    },
    //选择审批的部门弹窗
    alertChooseSp() {
      //清空 树 选中
      //清空 穿梭框 内容和选中的值
      this.$nextTick(() => {
        this.data = []
        this.value = []
        this.$nextTick(() => {
          this.$refs.deptTree.setCheckedKeys([])
        })
      })

      this.dialogVisibleDeptSp = true
    },

    //获取分类下拉列表
    async getClassSel() {
      let dictName = 'train_type'
      this.classRes = await getSelectTheme(dictName)
    },
    //获取分类下拉id
    async peojectTypeFunc(val, vIndex) {
      let resultArr = this.classRes.filter((item) => {
        return item.dictCode === val
      })
      //把值赋给要传给后台的表单对象中
      this.addPlan.pxClassId = resultArr[0].dictCode
      this.addPlan.pxClass = resultArr[0].dictLabel //直接写val也可以
      let that = this
      let planId = {
        pxClassId: that.addPlan.pxClassId,
        pxTitleId: that.addPlan.pxTitleId
      }
      if (planId.pxTitleId != '') {
        that.bookSelRes = await getTrainBook(planId)
      }
    },
    //获取主题下拉列表
    async getThemeSel() {
      let dictType = 'training_topics'
      this.themeRes = await getSelectTheme(dictType)
    },
    //获取项目进度下拉id
    async peojectFunc(val, vIndex) {
      let resultArr = this.themeRes.filter((item) => {
        return item.dictCode === val
      })
      //把值赋给要传给后台的表单对象中
      this.addPlan.pxTitleId = resultArr[0].dictCode
      this.addPlan.pxTitle = resultArr[0].dictLabel //直接写val也可以
      let that = this
      let planId = {
        pxClassId: that.addPlan.pxClassId,
        pxTitleId: that.addPlan.pxTitleId
      }
      if (planId.pxClassId != '') {
        that.bookSelRes = await getTrainBook(planId)
      }
    },
    addxz() {
      this.$confirm('确定是否新增该计划', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.confirm()
        })
        .catch(() => {})
    },
    async confirm() {
      let PlanModification = {
        trainCoursewareList: this.addPlan.trainCoursewareList,
        trainPersonList: this.addPlan.trainPersonList,
        trainplanId: this.EditTrainplanId,
        pxTitleId: this.addPlan.pxTitleId,
        pxTitle: this.addPlan.pxTitle,
        pxClassId: this.addPlan.pxClassId,
        pxClass: this.addPlan.pxClass,
        pxContent: this.addPlan.pxContent,
        planStartTime: this.addPlan.planStartTime,
        planEndTime: this.addPlan.planEndTime,
        pxClassHour: this.addPlan.pxClassHour,
        pxWay: this.addPlan.pxWay,
        pxAgency: this.addPlan.pxAgency,
        pxTeacher: this.addPlan.pxTeacher,
        pxPlace: this.addPlan.pxPlace,
        isApply: this.addPlan.isApply
      }
      if (this.addPlan.isApply == true) {
        this.$refs.nextDataFormRules.validate(async (valid) => {
          if (!valid) {
            this.$notify({
              title: '操作失败',
              dangerouslyUseHTMLString: true,
              message: '请填写完整',
              type: 'warning'
            })
            return
          }
          let data = null
          //提交
          if (this.addPlan.trainPersonList.length == 0) {
            this.$alert('请选择培训人员', '提示', {
              dangerouslyUseHTMLString: true
            })
          } else {
            data = await getModification(PlanModification)
            this.$notify({
              title: data ? '成功' : '失败',
              dangerouslyUseHTMLString: true,
              message: data ? data.message : '服务器开小差了，请稍后再试',
              type: data ? 'success' : 'warning'
            })
            this.$emit('fatherMethod')
          }
          this.dialogVisible = false
        })
        return
      }
      this.$refs.operationFome.validate(async (valid) => {
        if (!valid) {
          this.$notify({
            title: '操作失败',
            dangerouslyUseHTMLString: true,
            message: '请填写完整',
            type: 'warning'
          })
          return
        }
        let data = null
        //提交
        if (this.addPlan.trainPersonList.length == 0) {
          this.$alert('请选择培训人员', '提示', {
            dangerouslyUseHTMLString: true
          })
        } else {
          data = await getModification(PlanModification)
          this.$notify({
            title: data ? '成功' : '失败',
            dangerouslyUseHTMLString: true,
            message: data ? data.message : '服务器开小差了，请稍后再试',
            type: data ? 'success' : 'warning'
          })
          this.$emit('fatherMethod')
        }
        this.dialogVisible = false
      })

      if (
        this.addPlan.trainPersonList == '' ||
        this.addPlan.trainPersonList == null
      ) {
        //  this.$notify({
        //   title: '操作失败',
        //   message: '请选择培训人员',
        //   type: 'warning',
        //   position:'bottom-right',
        // });
        this.$alert('请选择培训人员', '提示', {
          dangerouslyUseHTMLString: true
        })
      }
      // this.$emit("fatherMethod"); //调用父组件函数
    },
    handleSelectionChange(val) {
      if (val) {
        let arr = []
        for (let i = 0; i < val.length; i++) {
          let itme = val[i]
          arr.push(itme.deptId)
        }
        this.multipleSelection = [...arr]
      }
    },

    selectDept() {
      this.dialogVisibleDept = false

      let temCheckedDeptIndex = this.checkedDeptIndex
      let temSelectUser = []
      let spTemSelectUser = []
      let temValue = this.value
      let temData = this.data
      for (let val in temValue) {
        for (let data in temData) {
          console.log(val == data.key)
          if (temValue[val] == temData[data].userId) {
            //获取数据
            temSelectUser.push(temData[data])
            spTemSelectUser.push(temData[data])
          }
        }
      }
      this.addPlan.trainPersonList = temSelectUser
      this.chooseUserId = spTemSelectUser
      console.log(this.chooseUserId)
      // if (!this.nextData.userName) {
      //   for (let i = 0; i < this.chooseUserId.length; i++) {
      //     this.nextData.userName = this.chooseUserId[i].user;
      //     this.toUser = this.chooseUserId[i].userId;
      //   }

      //   this.addPlan.toUser = this.toUser;
      //   console.log(this.nextData.userName);
      //   console.log(this.toUser);
      // }
    },

    selectDeptSp() {
      this.dialogVisibleDeptSp = false

      let temCheckedDeptIndex = this.checkedDeptIndex
      let temSelectUser = []
      let spTemSelectUser = []
      let temValue = this.value
      let temData = this.data
      for (let val in temValue) {
        for (let data in temData) {
          console.log(val == data.key)
          if (temValue[val] == temData[data].userId) {
            //获取数据
            temSelectUser.push(temData[data])
            spTemSelectUser.push(temData[data])
          }
        }
      }
      this.chooseUserId = spTemSelectUser
      console.log(this.chooseUserId)
      if (!this.nextData.userName) {
        // this.nextData.userName = [];
        // this.toUser=[];
        // this.addPlan.toUser=[];
        for (let i = 0; i < this.chooseUserId.length; i++) {
          // this.nextData.userName.push(this.chooseUserId[i].user);
          this.nextData.userName = this.chooseUserId[i].user
          this.toUser = this.chooseUserId[i].userId
        }

        this.addPlan.toUser = this.toUser
        console.log(this.nextData.userName)
        console.log(this.toUser)
      } else {
        for (let i = 0; i < this.chooseUserId.length; i++) {
          // this.nextData.userName.push(this.chooseUserId[i].user);
          this.nextData.userName = this.chooseUserId[i].user
          this.addPlan.toUser = this.chooseUserId[i].userId
        }
      }
    },

    //map 去重
    deWeightThree(deWeightKey, arrayObj) {
      let name = deWeightKey
      let map = new Map()
      for (let item of arrayObj) {
        if (!map.has(item[name])) {
          map.set(item[name], item)
        }
      }
      return [...map.values()]
    }
  }
}
</script>

<style lang="scss" scoped>
.right {
  float: right;
  width: 65%;
}
.sdialog {
  .el-card {
    min-height: 60vh;
    height: 100%;
  }
}
.left {
  float: left;
  width: 30%;
}
.tBtn.selDialog {
  position: absolute;
  bottom: 10%;
  right: 5%;
  transform: translate(-150%, -50%);
}
.fBtn.selDialog {
  position: absolute;
  bottom: 10%;
  right: 3%;
  transform: translate(-50%, -50%);
}
.el-transfer-panel__body,
.el-transfer-panel__list {
  height: 280px;
}
.v-modal {
  z-index: 9999999 !important;
}
.el-dialog__wrapper {
  z-index: 9999999 !important;
}
.page-tit {
  font-size: 18px;
  background: #ffffff;
  height: 45px;
  line-height: 45px;
  margin-bottom: 10px;
  padding-left: 15px;
  border-radius: 5px;
}

.confide tr td {
  width: 25%;
  border-bottom: 1px solid #dcdfe6;
}

.confide table {
  width: 80%;
  float: right;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  text-align: center;
  border-bottom: none;
}

.confide tr {
  height: 32px;
  line-height: 32px;
}

.confide-content .upload-demo,
.confide-content .upload {
  width: 70%;
}

.confede-content .el-transfer {
  text-align: center;
}

.area-confide {
  margin-top: 20px;
}

.upload {
  display: inline-block;
}

.confide-content .el-tree {
  width: 30%;
  height: 40vh;
  float: left;
  overflow-y: scroll;
}

.confide-content .el-transfer {
  width: 70%;
  float: left;
}

.tit {
  font-size: 18px;
  height: 50px;
  line-height: 50px;
  color: #333;
  padding-left: 15px;
  margin-top: 18px;
  border-bottom: 1px solid #d7d7d7;
  margin-bottom: 25px;
}
.tit::before {
  display: inline-block;
  content: '';
  width: 4px;
  height: 20px;
  background: rgba(13, 116, 215, 1);
  vertical-align: -4px;
  margin-right: 9px;
}
</style>
