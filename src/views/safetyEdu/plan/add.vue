<template>
  <div v-loading="loading" class="stepsBox">
    <el-steps :active="active" finish-status="success">
      <el-step title="计划详情"></el-step>
      <el-step title="培训人员"></el-step>
    </el-steps>
    <el-tabs v-model="activeName" type="card" ref="tabs">
      <el-tab-pane label="计划详情" name="plandetails">
        <div class="container-table safety-plan">
          <div class="confide-content">
            <div class="tabsTit"><span>详情</span></div>
            <el-form
              :model="addPlan"
              :rules="formRules"
              class="clearfix"
              ref="operationFome"
              label-width="135px"
              label-position="right"
            >
              <el-form-item label="培训类别" prop="pxClassId">
                <el-select
                  v-model="addPlan.pxClassId"
                  :disabled="true"
                  placeholder="请选择培训类别"
                  @change="peojectTypeFunc"
                >
                  <el-option
                    :value="item.dictCode"
                    v-for="item in classRes"
                    :key="item.dictCode"
                    :label="item.dictLabel"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="培训主题" prop="pxTitleId">
                <el-select
                  v-model="addPlan.pxTitleId"
                  :disabled="true"
                  placeholder="请选择培训主题"
                  @change="peojectFunc"
                >
                  <el-option
                    :value="item.dictCode"
                    v-for="item in themeRes"
                    :key="item.dictCode"
                    :label="item.dictLabel"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- 线下 -->
              <el-form-item label="需求课时(单位:时)">
                <el-input
                  v-model.number="addPlan.classHour"
                  maxlength="3"
                  :disabled="true"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item label="培训方式" prop="pxWay">
                <el-radio-group v-model="addPlan.pxWay" @change="wayChange">
                  <el-radio :label="0">线上</el-radio>
                  <el-radio :label="1">线下</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="计划培训开始时间" prop="planStartTime">
                <el-date-picker
                  v-model="addPlan.planStartTime"
                  type="datetime"
                  placeholder="选择日期"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="startOptions"
                  @change="changeStartTime"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="计划培训结束时间" prop="planEndTime">
                <el-date-picker
                  v-model="addPlan.planEndTime"
                  type="datetime"
                  placeholder="选择日期"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="endOptions"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="内容" prop="pxContent">
                <span class="text_area">
                  <el-input
                    v-model="addPlan.pxContent"
                    maxlength="300"
                    show-word-limit
                    type="textarea"
                    :autosize="{ minRows: 5, maxRows: 9 }"
                    placeholder="请输入内容"
                  />
                </span>
              </el-form-item>
              <el-form-item label="培训机构" v-if="AddressShow">
                <el-input
                  v-model="addPlan.pxAgency"
                  maxlength="30"
                  show-word-limit
                  placeholder="请输入培训机构"
                />
              </el-form-item>
              <el-form-item label="授课老师" v-if="AddressShow">
                <el-input
                  v-model="addPlan.pxTeacher"
                  maxlength="30"
                  show-word-limit
                  placeholder="请输入授课老师"
                />
              </el-form-item>
              <el-form-item
                label="课时(单位:时)"
                prop="pxClassHour"
                v-if="classHourShow"
              >
                <el-input
                  v-model.number="addPlan.pxClassHour"
                  maxlength="3"
                  show-word-limit
                  placeholder="请输入课时"
                />
              </el-form-item>
              <!-- 线上 -->
              <el-form-item
                label="关联课件"
                prop="trainCoursewareList.traincoursewareId"
                v-if="traincoursewareShow"
              >
                <el-select
                  v-model="addPlan.trainCoursewareList.traincoursewareId"
                  placeholder="请选择关联课件"
                  @change="addSelBook($event)"
                >
                  <el-option
                    :value="item.traincoursewareId"
                    v-for="item in bookSelRes"
                    :key="item.traincoursewareId"
                    :label="item.kjName"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="学习时长(单位:时)"
                prop="timess"
                v-if="traincoursewareTimeShow"
              >
                <el-input v-model="addPlan.timess" readonly> </el-input>
              </el-form-item>
              <template v-if="classRelationExam">
                <el-form-item label="关联考试名称">
                  <el-input
                    v-model="addPlan.relationExamName"
                    :disabled="true"
                    placeholder="请输入"
                  />
                </el-form-item>
                <el-form-item style="margin: 0 !important">
                  <el-button
                    @click="chooseList"
                    class="blue"
                    style="margin: 0 0 20px 0px; vertical-align: middle"
                    >关联考试</el-button
                  >
                </el-form-item>
              </template>
              <el-form-item label="培训地点" prop="pxPlace" v-if="AddressShow">
                <el-input
                  v-model="addPlan.pxPlace"
                  maxlength="30"
                  show-word-limit
                  placeholder="请输入培训地点"
                />
              </el-form-item>
              <el-form-item label="审批" prop="isApply">
                <el-radio-group v-model="addPlan.isApply">
                  <el-radio :label="0" @change="hiddenApply">不需要</el-radio>
                  <el-radio :label="1" @change="visibleApply">需要</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
            <div v-show="prosessSetDialg">
              <div class="tabsTit" style="margin-top: 60px">
                <span>流程设置</span>
              </div>
              <el-form
                :model="nextData"
                :rules="nextDataFormRules"
                ref="nextDataFormRules"
                class="clearfix"
                label-width="135px"
                label-position="right"
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

            <el-dialog
              title="选择关联的考试"
              :visible.sync="dialogVisibleExam"
              custom-class="large"
              append-to-body
              :close-on-click-modal="false"
            >
              <publicExamPlan @func="getMsgFormSon"></publicExamPlan>
              <span slot="footer" class="dialog-footer">
                <el-button class="fBtn" @click="dialogVisibleExam = false"
                  >取 消</el-button
                >
              </span>
            </el-dialog>

            <!--选择审批人-->
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
                  <el-button
                    type="primary"
                    class="tBtn selDialog"
                    @click="selectDeptSp"
                    >提交</el-button
                  >
                  <el-button
                    class="fBtn selDialog"
                    @click="dialogVisibleDeptSp = false"
                    >取消</el-button
                  >
                </div>
              </el-dialog>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="培训人员" name="trainee">
        <el-form
          :model="addPlan"
          :rules="formRules"
          class="clearfix"
          ref="operationFomes"
          label-width="135px"
          label-position="right"
        >
          <div class="clearfix">
            <div class="btnBox">
              <span
                >培训人员列表：合计<i>{{ totaladdPlan }}</i
                >人</span
              >
              <el-button @click="alertDel()">批量删除 </el-button>
              <el-button @click="alertEmpty()">清空人员</el-button>
              <el-button class="blue" @click="alertChoose">添加人员</el-button>
            </div>
            <el-table
              :data="addPlan.trainPersonList"
              height="calc(100vh - 370px)"
              row-key="safebookId"
              v-loading="loading"
              @selection-change="handleSelectionChangeDel"
              :tree-props="{
                children: 'children',
                hasChildren: 'hasChildren',
              }"
              tooltip-effect="light"
              stripe
            >
              <el-table-column
                align="center"
                type="selection"
                width="55"
              ></el-table-column>
              <el-table-column
                align="center"
                label="部门"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{ scope.row.deptName }}</template>
              </el-table-column>
              <el-table-column
                align="center"
                label="岗位"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{ scope.row.postName }}</template>
              </el-table-column>
              <el-table-column
                align="center"
                label="姓名"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{ scope.row.userName }}</template>
              </el-table-column>
              <el-table-column
                align="center"
                label="时长要求"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{
                  scope.row.classHour
                }}</template>
              </el-table-column>
              <el-table-column
                align="center"
                label="已培训时长"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{
                  scope.row.yipeixunHour
                }}</template>
              </el-table-column>
              <el-table-column
                align="center"
                label="剩余培训时长"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{
                  scope.row.shengyuHour
                }}</template>
              </el-table-column>
              <el-table-column
                align="center"
                label="操作"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-button type="text" @click="alertDel(scope.row.id)"
                    >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="totaladdPlan"
              :current-page="addPlanpageNum"
              :page-sizes="[5, 10, 20, 50]"
              :page-size="addPlanpageSize"
              @size-change="handleSizeChangeaddPlan"
              @current-change="handleCurrentChangeaddPlan"
            ></el-pagination>
          </div>
        </el-form>

        <!--选择人员弹窗-->
        <div class="sdialog">
          <el-dialog
            :visible.sync="dialogVisibleDept"
            :close-on-click-modal="false"
            :title="'选择人员'"
            custom-class="s_dialog large"
            append-to-body
          >
            <div class="titBox">
              <span
                >应培训：<i>{{ total }}</i
                >人</span
              >
              <!-- <span>已完成：<i>50</i>人</span>
              <span>未完成：<i>50</i>人</span> -->
            </div>
            <div class="sxForm">
              <el-form
                :inline="true"
                :model="pageForm"
                ref="pageForm"
                class="demo-form-inline"
              >
                <el-form-item prop="querykeywords" label="关键字">
                  <el-input
                    v-model="pageForm.querykeywords"
                    maxlength="30"
                    placeholder="关键字"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="status" label="筛选条件">
                  <el-select v-model="pageForm.status" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="只显示未完成人员" value="0"></el-option>
                  </el-select>
                </el-form-item>
                <div class="btnCont">
                  <el-button
                    class="chaxun"
                    v-has="has.query"
                    @click="alertChoose()"
                    >查询
                  </el-button>
                  <el-button @click="resetForm('pageForm')" class="chongzhi"
                    >重置</el-button
                  >
                </div>
              </el-form>
            </div>
            <div class="sxTable">
              <el-table
                :data="tableDataRy"
                v-loading="loading"
                style="width: 100%"
                tooltip-effect="light"
                height="calc(100vh - 380px)"
                @selection-change="handleSelectionChangeRy"
                row-key="safebookId"
                :tree-props="{
                  children: 'children',
                  hasChildren: 'hasChildren',
                }"
                stripe
              >
                <el-table-column
                  type="selection"
                  width="55"
                  align="center"
                ></el-table-column>

                <el-table-column
                  label="部门"
                  show-overflow-tooltip
                  align="center"
                  width="160"
                >
                  <template slot-scope="scope">{{
                    scope.row.deptName
                  }}</template>
                </el-table-column>
                <el-table-column
                  label="岗位"
                  show-overflow-tooltip
                  align="center"
                >
                  <template slot-scope="scope">{{
                    scope.row.postName
                  }}</template>
                </el-table-column>
                <el-table-column
                  label="姓名"
                  show-overflow-tooltip
                  align="center"
                >
                  <template slot-scope="scope">{{
                    scope.row.userName
                  }}</template>
                </el-table-column>
                <el-table-column
                  label="时长要求"
                  show-overflow-tooltip
                  align="center"
                >
                  <template slot-scope="scope">{{
                    scope.row.classHour
                  }}</template>
                </el-table-column>
                <el-table-column
                  label="已培训时长"
                  show-overflow-tooltip
                  align="center"
                >
                  <template slot-scope="scope">{{
                    scope.row.yipeixunHour
                  }}</template>
                </el-table-column>
                <el-table-column
                  label="线上培训时长"
                  show-overflow-tooltip
                  align="center"
                >
                  <template slot-scope="scope">{{
                    scope.row.xianshangHour
                  }}</template>
                </el-table-column>
                <el-table-column
                  label="线下培训时长"
                  show-overflow-tooltip
                  align="center"
                >
                  <template slot-scope="scope">{{
                    scope.row.xiangxiaHour
                  }}</template>
                </el-table-column>
              </el-table>

              <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                :page-sizes="pageSizes"
                :page-size="pageForm.pageSize"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              ></el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button class="fBtn" @click="handleAddPeopleAll()"
                >选择所有人</el-button
              >
              <el-button class="fBtn" @click="handleAddPeople()"
                >选择部分人</el-button
              >
            </span>
          </el-dialog>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import {
  getLoginDeptPerson,
  getTreeSelect,
  getTreeDeptByLogin,
} from "@/api/system/dept";
import { getSelectTheme } from "@/api/system/class";
import {
  getAddPlan,
  getTrainBook,
  getVedioTime,
  getVedioTimes,
  getUserListByTrainDemand,
  getList,
  getTrainplanSelectUser,
  trainplanSelectUseraddAll,
  trainplanSelectUserDel,
  clearData,
} from "@/api/safety/plan.js";
import { getChangeJobNextNode } from "@/api/system/process";
import publicExamPlan from "./publicExamPlan";

let traincoursewareId = [
  {
    required: true,
    message: "请选择关联课件",
    trigger: ["change", "blur"],
  },
];
let pxClassHour = [
  {
    required: true,
    message: "请输入课时",
    trigger: "blur",
  },
  { type: "number", message: "课时必须为数字值" },
];
let pxPlace = [
  {
    required: true,
    message: "请输入培训地点",
    trigger: "blur",
  },
];
export default {
  props: {
    trainDemandId: {
      type: String,
      default: "",
    },
    trainpxdata: {
      type: Object,
      default: {},
    },
  },
  name: "index",
  components: {
    publicExamPlan, //测验计划
  },

  data() {
    const isSelect = (rule, value, callback) => {
      if (value == 0) {
        //如果值是 0，提示用户选择正确的选项
        callback(new Error("请选择"));
      } else {
        callback();
      }
    };

    const validateStartTime = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入计划开始时间"));
      } else {
        if (
          new Date(this.addPlan.planStartTime).getTime() <= new Date().getTime()
        ) {
          callback(new Error("计划开始时间必须大于当前时间！"));
        } else {
          callback();
        }
      }
    };
    const validateEndTime = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入计划结束时间"));
      } else {
        if (
          new Date(this.addPlan.planStartTime).getTime() >=
          new Date(this.addPlan.planEndTime).getTime()
        ) {
          callback(new Error("计划结束时间必须大于计划开始时间！"));
        } else {
          callback();
        }
      }
    };

    return {
      tabShow: true,
      nextData: {
        nodeName: "",
        roleName: "",
        userName: "",
      },
      toUser: [],
      chooseUserId: null,
      prosessSetDialg: false,
      //课时输入框显示隐藏
      classHourShow: false,
      classRelationExam: true,
      //培训地点输入框显示隐藏
      AddressShow: false,
      //关联课件显示隐藏
      traincoursewareShow: true,
      classRes: [],
      themeRes: [],
      bookSelRes: [],
      jdUserOption: [],
      data: [],
      value: [],
      has: {
        remove: "",
        query: "",
        add: "",
        edit: "",
        addPlanBtn: "train:trainPlan:add",
      },
      dialogVisibleDept: false,
      dialogVisibleDeptSp: false,
      //搜索  项目清单
      confideItem: ["1"],
      //选择列表 项目清单
      addPlan: {
        trainCoursewareList: [
          {
            //课件id
            traincoursewareId: "",
          },
        ],
        //培训人员集合
        trainPersonList: [],
        //任务id
        taskId: "1301097346164154369",
        //培训主题id
        pxTitleId: "",
        //培训主题
        pxTitle: "",
        //培训类别id
        pxClassId: "",
        //培训类别
        pxClass: "",
        //培训内容
        pxContent: "",
        //培训计划开始时间
        planStartTime: "",
        //培训计划结束时间
        planEndTime: "",
        //培训课时
        pxClassHour: "",
        classHour: "",
        //培训形式
        pxWay: 0,
        //培训机构
        pxAgency: "",
        //授课老师
        pxTeacher: "",
        //培训地点
        pxPlace: "",
        //是否需要审批
        isApply: 0,
        //关联的考试名称
        relationExamName: "",
        //关联的考试ID
        relationExamId: "",
        //学习时长
        timess: "",
      },
      //学习时长
      timess: "",
      defaultMenutree: [],
      multipleSelection: [],
      //选择列表
      loading: false,
      tableData: [],
      tableKey: 0,
      listLoading: false,
      dialogVisible: false,
      dialogVisibleExam: false, //关联考试的弹框
      dialogType: "new",
      deptOptions: [],
      deptOptionsArr: [],
      fileLists: [],
      checkStrictly: true,
      defaultProps: {
        children: "children",
        label: "label",
      },
      //部门名称
      deptLabel: [],
      //选择的部门id
      chooseDeptId: "",
      deptPerson: null,
      startOptions: {
        disabledDate: (time) => {
          let beginDateVal = this.addPlan.planEndTime;
          if (beginDateVal) {
            return time.getTime() > new Date(beginDateVal).getTime();
          }
        },
      },
      endOptions: {
        disabledDate: (time) => {
          let beginDateVal = this.addPlan.planStartTime;
          if (beginDateVal) {
            return (
              time.getTime() <
              new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            );
          }
        },
      },
      //下一步
      lastbuttoms: false,
      buttoms: true,
      active: 0,
      activeName: "plandetails",
      bootn_type: "下一步",
      times: [],
      traincoursewareTimeShow: false,
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        pxTitleId: "",
        pxClassId: "",
        classHour: "",
        querykeywords: "",
        status: "",
      },
      totaladdPlan: 0,
      addPlanpageNum: 1,
      addPlanpageSize: 10,
      tableDataRy: [],
      total: 0,
      pageSizes: [10, 15, 20, 25, 30],
      //人员列表
      peopleNum: [],
      peopleNums: [],
      ids: "",
      //表单验证方法
      formRules: {
        pxClassId: [
          {
            required: true,
            message: "请选择培训类别",
            trigger: "change",
            validator: isSelect,
          },
        ],
        pxTitleId: [
          {
            required: true,
            message: "请选择培训主题",
            trigger: "change",
            validator: isSelect,
          },
        ],
        pxContent: [
          {
            required: true,
            message: "请输入内容",
            trigger: "blur",
          },
        ],
        planStartTime: [
          {
            required: true,
            trigger: "blur",
            validator: validateStartTime,
          },
        ],
        planEndTime: [
          {
            required: true,
            trigger: "blur",
            validator: validateEndTime,
          },
        ],
        "trainCoursewareList.traincoursewareId": [
          {
            required: true,
            message: "请选择关联课件",
            trigger: ["change", "blur"],
          },
        ],
        pxWay: [
          {
            required: true,
            message: "请选择培训方式",
            trigger: "blur",
          },
        ],
        isApply: [
          {
            required: true,
            message: "请选择是否审批",
            trigger: "change",
            // validator: isSelect
          },
        ],
      },
      nextDataFormRules: {
        nodeName: [
          {
            required: true,
            message: "请选择下一个流程节点",
            trigger: "blur",
          },
        ],
        roleName: [
          {
            required: true,
            message: "请选择审批岗位",
            trigger: "blur",
          },
        ],
        userName: [
          {
            required: true,
            message: "请选择审批人",
            trigger: "change",
          },
        ],
        trainPersonList: [
          {
            required: true,
            message: "请选择培训人员",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    getUrl() {
      return this.$store.state.apiConfiguration.url + "/fs/upload";
    },
  },
  created: async function (scope) {
    console.log(this.trainDemandId);
    this.deptOptions = await getTreeSelect();
    this.getClassSel();
    this.getThemeSel();
  },
  mounted: async function () {
    this.addPlan.pxClass = this.trainpxdata.pxClass;
    this.addPlan.pxTitle = this.trainpxdata.pxTitle;
    this.addPlan.pxClassId = this.trainpxdata.pxClassId;
    this.addPlan.pxTitleId = this.trainpxdata.pxTitleId;
    this.addPlan.classHour = this.trainpxdata.classHour;
    if (this.addPlan.pxClassId != "" && this.addPlan.pxTitleId != "") {
      this.bookSelRes = [];
      let planId = {
        pxClassId: this.addPlan.pxClassId,
        pxTitleId: this.addPlan.pxTitleId,
      };
      let TempBookSelRes = await getTrainBook(planId);
      this.times = [];
      for (let i = 0; i < TempBookSelRes.length; i++) {
        let itme22 = TempBookSelRes[i];
        let vedioTimes = await getVedioTime(itme22.kjFileUrl);
        let vedioTimess = await getVedioTimes(itme22.kjFileUrl);
        itme22.kjName = itme22.kjName + "[" + vedioTimes + "]";
        this.bookSelRes.push(itme22);
        this.times.push({
          vtimes: vedioTimes,
          vtimess: vedioTimess,
          vtit: itme22.traincoursewareId,
        });
      }
      this.$refs.operationFome.clearValidate(["pxClassId", "pxTitleId"]);
    }
  },
  watch: {
    ["addPlan.pxWay"](nData) {
      if (nData == 0) {
        //线上
        this.formRules = {
          ...this.formRules,
          "trainCoursewareList.traincoursewareId": traincoursewareId,
          pxClassHour: [],
          pxPlace: [],
        };

        this.$nextTick(() => {
          this.$refs.operationFome.validateField([
            "trainCoursewareList.traincoursewareId",
          ]);
          this.$refs.operationFome.clearValidate(["pxClassHour", "pxPlace"]);
        });
      } else {
        //线下
        this.formRules = {
          ...this.formRules,
          "trainCoursewareList.traincoursewareId": [],
          pxClassHour,
          pxPlace,
        };
        this.$nextTick(() => {
          this.$refs.operationFome.validateField(["pxClassHour", "pxPlace"]);
          // this.$refs.operationFome.clearValidate([
          //   'trainCoursewareList.traincoursewareId'
          // ])
        });
      }
    },
  },
  methods: {
    //批量删除
    async alertDel(id) {
      if (
        (this.ids != "" && this.ids != undefined) ||
        (id != "" && id != undefined)
      ) {
        this.$confirm("确定删除吗?", "删除", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            await trainplanSelectUserDel(this.ids ? this.ids : id);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.peopleList();
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        this.$message.error("请选择要删除项");
      }
    },
    //清空
    async alertEmpty() {
      this.$confirm("确定清空吗?", "清空", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await clearData();
          this.$message({
            type: "success",
            message: "清空成功!",
          });
          this.peopleList();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    //选择全部人
    async handleAddPeopleAll() {
      let data = {
        pxTitleId: this.addPlan.pxTitleId + "",
        pxClassId: this.addPlan.pxClassId + "",
        classHour: this.addPlan.classHour + "",
        querykeywords: this.pageForm.querykeywords,
        status: this.pageForm.status,
      };
      this.$confirm("确定选择培训人员吗?", "选择培训人员", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await trainplanSelectUseraddAll(data);
          this.dialogVisibleDept = false;
          this.peopleList();
          this.$message({
            type: "success",
            message: "选择成功!",
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
    //选择部分人
    async handleAddPeople() {
      if (this.peopleNum != "") {
        let data = JSON.stringify(this.peopleNum);
        this.$confirm("确定选择培训人员吗?", "选择培训人员", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            await getTrainplanSelectUser(data);
            this.dialogVisibleDept = false;
            this.peopleList();
            this.$message({
              type: "success",
              message: "选择成功!",
            });
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        this.$message.error("请选择培训人员");
      }
    },
    //已选中的人员
    async peopleList() {
      let data = {
        pageNum: this.addPlanpageNum,
        pageSize: this.addPlanpageSize,
      };
      let row = await getList(data);
      this.addPlan.trainPersonList = row.rows;
      this.totaladdPlan = row.total;
    },
    // 上一步
    last() {
      if (this.active == 1) {
        this.lastbuttoms = false;
        this.active = 0;
        this.activeName = "plandetails";
        this.bootn_type = "下一步";
      }
    },
    // 下一步
    async next() {
      if (this.active++ > 1) {
        // 所有 步骤完成 提交 +
        this.$emit("fatherMethod");
        this.active = 0;
      }
      if (this.active == 0) {
        this.bootn_type = "下一步";
        this.activeName = "plandetails";
        this.lastbuttoms = false;
      } else if (this.active == 1) {
        if (this.addPlan.isApply == 0) {
          this.$refs.operationFome.validate(async (valid) => {
            if (!valid) {
              this.$notify({
                title: "操作失败",
                dangerouslyUseHTMLString: true,
                message: "请填写完整",
                type: "warning",
              });
              this.active = 0;
              return;
            } else {
              this.peopleList();
              this.lastbuttoms = true;
              this.activeName = "trainee";
              this.bootn_type = "提交";
            }
          });
        } else {
          this.$refs.operationFome.validate(async (valid) => {
            if (!valid) {
              this.$notify({
                title: "操作失败",
                dangerouslyUseHTMLString: true,
                message: "请填写完整",
                type: "warning",
              });
              this.active = 0;
              return;
            }
          });
          this.$refs.nextDataFormRules.validate(async (valid) => {
            if (!valid) {
              this.$notify({
                title: "操作失败",
                dangerouslyUseHTMLString: true,
                message: "请填写完整",
                type: "warning",
              });
              this.active = 0;
              return;
            } else {
              this.peopleList();
              this.lastbuttoms = true;
              this.activeName = "trainee";
              this.bootn_type = "提交";
            }
          });
        }
      }
    },
    //选择开始时间，清空结束时间
    changeStartTime(date) {
      this.addPlan.planEndTime = "";
      this.pickerBeginDateAfter = {
        disabledDate(time) {
          //开始时间-结束时间
          return time.getTime() < new Date(date).getTime();
        },
      };
    },
    //获取列表
    chooseList() {
      this.dialogVisibleExam = true;
    },
    getMsgFormSon(e) {
      this.addPlan.relationExamName = e.row.name;
      this.addPlan.relationExamId = e.row.examPlanId;
      this.dialogVisibleExam = false;
    },
    //取消操作
    cancelBtn() {
      this.$store.state.tabActive = "plan";
      console.log(this.$store.state.tabActive);
      this.$emit("fatherMethod");
    },
    // 删除操作
    open(index, userList, isshow) {
      this[isshow] = false;
      userList.splice(index, 1);
      this[isshow] = true;
    },
    //获取流程回显的数据
    async getNextProcess() {
      //向下一个节点传参
      let nextNodesData = {
        userId: this.$store.state.user.user.userId,
        businessCode: this.$store.state.approvalProcess.trainplan,
      };
      this.nextData = await getChangeJobNextNode(nextNodesData);
      this.addPlan.businessCode = nextNodesData.businessCode;
      this.addPlan.toUser = this.nextData.userId;
    },
    hiddenApply() {
      this.addPlan.isApply = 0;
      this.prosessSetDialg = false;
    },
    //单击单选按钮审批弹出窗口
    visibleApply() {
      this.addPlan.isApply = 1;
      this.prosessSetDialg = true;
      this.getNextProcess();
    },
    async wayChange(value) {
      let that = this;
      //true为线下  false为线上
      if (value) {
        //课时输入框显示隐藏
        that.classHourShow = true;
        that.classRelationExam = false;
        //培训地点输入框显示隐藏
        that.AddressShow = true;
        //关联课件显示隐藏
        that.traincoursewareShow = false;
        //学习时长显示隐藏
        that.traincoursewareTimeShow = false;
        that.addPlan.trainCoursewareList.traincoursewareId = "";
        that.addPlan.pxClassHour = "";
      } else {
        that.classRelationExam = true;
        that.classHourShow = false;
        //培训地点输入框显示隐藏
        that.AddressShow = false;
        //关联课件显示隐藏
        that.traincoursewareShow = true;
        // delete that.addPlan.pxPlace
        // delete that.addPlan.pxClassHour
        let planId = {
          pxClassId: that.addPlan.pxClassId,
          pxTitleId: that.addPlan.pxTitleId,
        };

        if (planId.pxClassId != "" && planId.pxTitleId != "") {
          that.bookSelRes = [];
          let TempBookSelRes = await getTrainBook(planId);
          let time = [];
          for (let i = 0; i < TempBookSelRes.length; i++) {
            let itme22 = TempBookSelRes[i];
            let vedioTimes = await getVedioTime(itme22.kjFileUrl);
            let vedioTimess = await getVedioTimes(itme22.kjFileUrl);
            console.log(vedioTimess, "4444444444444444");
            itme22.kjName = itme22.kjName + "[" + vedioTimes + "]";
            that.bookSelRes.push(itme22);
            time.push({
              vtimes: vedioTimes,
              vtimess: vedioTimess,
              vtit: itme22.traincoursewareId,
            });
          }
          that.times = time;
          // console.log(that.bookSelRes, '135613')
          this.$refs.operationFome.clearValidate(["pxClassId", "pxTitleId"]);
        } else {
          this.$notify({
            title: "提示",
            message: "请先选择培训类别和培训主题!",
            duration: 2000,
          });
          this.$nextTick(() => {
            this.$refs.operationFome.validateField(["pxClassId", "pxTitleId"]);
          });
        }
        // that.addSelBook();
      }
    },
    //关联课件下拉接口
    async addSelBook(val) {
      //把值赋给要传给后台的表单对象中
      this.addPlan.trainCoursewareList[0].traincoursewareId = val;
      this.times.forEach((itemss) => {
        if (itemss.vtit == val.toString()) {
          this.addPlan.timess = itemss.vtimess;
          this.addPlan.pxClassHour = itemss.vtimess;
        }
      });
      console.log(
        this.addPlan.trainCoursewareList[0].traincoursewareId,
        this.addPlan.timess,
        "1111"
      );
      this.traincoursewareTimeShow = true;
    },
    //获取部门id
    async deptChange(val) {
      this.addConfide.jdDeptId = val[val.length - 1];
      this.jdUserOption = await getLoginDeptPerson(this.addConfide.jdDeptId);
      this.addConfide.jdDept = this.$refs.cascader
        .getCheckedNodes()[0]
        .pathLabels.pop();
    },
    //穿梭框获取人员
    async setCheckedNodes(nodes, checked, indeterminate) {
      console.log("setCheckedNodes", nodes, checked, indeterminate);
      this.chooseDeptId = nodes.id;
      //查询指定部门id的下的人员
      let temDeptPerson = await getLoginDeptPerson(this.chooseDeptId);
      this.deptPerson = temDeptPerson;
      if (checked) {
        this.deptLabel.push(nodes.label);
        //选中节点
        if (temDeptPerson.length > 0) {
          //将人员列表格式改为穿梭框可以支持的格式
          for (let i = 0; i < temDeptPerson.length; i++) {
            let temPerson = {};
            temPerson.userId = temDeptPerson[i].userId;
            temPerson.user = temDeptPerson[i].realName;
            temPerson.deptId = nodes.id;
            temPerson.dept = nodes.label;
            this.data.push(temPerson);
            this.data = this.deWeightThree("userId", this.data);
          }
        }
      } else {
        //取消选中节点
        if (temDeptPerson.length > 0) {
          let temData = this.data;
          for (let i = 0; i < temData.length; i++) {
            for (let j = 0; j < temDeptPerson.length; j++) {
              if (temData[i].userId == temDeptPerson[j].userId) {
                temData.splice(i, 1);
              }
            }
          }
        }
      }
    },

    //下拉根据部门id获取部门下的人
    async getPerson() {
      let deptId = this.addConfide.jdDeptId;
      let personRes = await getLoginDeptPerson(deptId);
      console.log("部门：" + personRes);
    },
    //选择部门弹窗
    async alertChoose() {
      let data = {
        pageNum: this.pageForm.pageNum,
        pageSize: this.pageForm.pageSize,
        pxTitleId: this.addPlan.pxTitleId + "",
        pxClassId: this.addPlan.pxClassId + "",
        classHour: this.addPlan.classHour + "",
        querykeywords: this.pageForm.querykeywords,
        status: this.pageForm.status,
      };
      let row = await getUserListByTrainDemand(data);
      this.tableDataRy = row.rows;
      this.total = row.total;
      this.dialogVisibleDept = true;
    },
    //选择审批的部门弹窗
    alertChooseSp() {
      //清空 树 选中
      //清空 穿梭框 内容和选中的值
      this.$nextTick(() => {
        this.data = [];
        this.value = [];
        this.$nextTick(() => {
          this.$refs.deptTree.setCheckedKeys([]);
        });
      });

      this.dialogVisibleDeptSp = true;
    },

    //获取分类下拉列表
    async getClassSel() {
      let dictName = "train_type";
      this.classRes = await getSelectTheme(dictName);
    },
    //获取分类下拉id
    async peojectTypeFunc(val, vIndex) {
      let resultArr = this.classRes.filter((item) => {
        return item.dictCode === val;
      });
      //把值赋给要传给后台的表单对象中
      this.addPlan.pxClassId = resultArr[0].dictCode;
      this.addPlan.pxClass = resultArr[0].dictLabel; //直接写val也可以
      let that = this;
      let planId = {
        pxClassId: that.addPlan.pxClassId,
        pxTitleId: that.addPlan.pxTitleId,
      };
      if (planId.pxTitleId != "") {
        let TempBookSelRes = await getTrainBook(planId);
        for (let i = 0; i < TempBookSelRes.length; i++) {
          let itme22 = TempBookSelRes[i];
          let vedioTimes = await getVedioTime(itme22.kjFileUrl);
          let vedioTimess = await getVedioTimes(itme22.kjFileUrl);
          console.log(vedioTimess, "55555555555");
          itme22.kjName = itme22.kjName + "[" + vedioTimes + "]";
          console.log(itme22.kjName);
          that.bookSelRes.push(itme22);
        }
      }
    },
    //获取主题下拉列表
    async getThemeSel() {
      let dictType = "training_topics";
      this.themeRes = await getSelectTheme(dictType);
    },
    //获取项目进度下拉id
    async peojectFunc(val, vIndex) {
      let resultArr = this.themeRes.filter((item) => {
        return item.dictCode === val;
      });
      //把值赋给要传给后台的表单对象中
      this.addPlan.pxTitleId = resultArr[0].dictCode;
      this.addPlan.pxTitle = resultArr[0].dictLabel; //直接写val也可以
      let that = this;
      let planId = {
        pxClassId: that.addPlan.pxClassId,
        pxTitleId: that.addPlan.pxTitleId,
      };
      if (planId.pxClassId != "") {
        let TempBookSelRes = await getTrainBook(planId);
        for (let i = 0; i < TempBookSelRes.length; i++) {
          let itme22 = TempBookSelRes[i];
          let vedioTimes = await getVedioTime(itme22.kjFileUrl);
          let vedioTimess = await getVedioTimes(itme22.kjFileUrl);
          console.log(vedioTimess, "4444444444444444");
          itme22.kjName = itme22.kjName + "[" + vedioTimes + "]";
          console.log(itme22.kjName);
          that.bookSelRes.push(itme22);
        }
      }
    },
    //提交
    async confirm() {
      if (this.addPlan.isApply == true) {
        this.$refs.nextDataFormRules.validate(async (valid) => {
          if (!valid) {
            this.$notify({
              title: "操作失败",
              dangerouslyUseHTMLString: true,
              message: "请填写完整",
              type: "warning",
            });
            return;
          }
          // const isEdit = this.dialogType === 'edit'
          let data = null;
          //提交
          // this.addPlan.taskId = '1301097346164154369'
          // this.addPlan.trainDemandId = this.trainDemandId
          if (this.addPlan.trainPersonList.length == 0) {
            this.$alert("请选择培训人员", "提示", {
              dangerouslyUseHTMLString: true,
            });
          } else {
            this.addPlan.trainPersonList.forEach((itemsP) => {
              delete itemsP.id;
              delete itemsP.createBy;
              delete itemsP.createById;
              delete itemsP.createTime;
              itemsP.dept = itemsP.deptName;
              itemsP.user = itemsP.userName;
              delete itemsP.deptName;
              delete itemsP.userName;
            });
            delete this.addPlan.timess;
            console.log(this.addPlan.trainPersonList, "202143");
            data = await getAddPlan(this.addPlan);
            this.$notify({
              title: data ? "成功" : "失败",
              dangerouslyUseHTMLString: true,
              message: data ? data.message : "服务器开小差了，请稍后再试",
              type: data ? "success" : "warning",
            });
            if (data === "新增培训计划成功") {
              await clearData();
            }
            this.$emit("fatherMethod");
          }
          this.dialogVisible = false;
        });
        return;
      }

      let data = null;
      //提交
      // this.addPlan.taskId = '1301097346164154369'
      // this.addPlan.trainDemandId = this.trainDemandId
      if (this.addPlan.trainPersonList.length == 0) {
        this.$alert("请选择培训人员", "提示", {
          dangerouslyUseHTMLString: true,
        });
      } else {
        this.addPlan.trainPersonList.forEach((itemsP) => {
          delete itemsP.id;
          delete itemsP.createBy;
          delete itemsP.createById;
          delete itemsP.createTime;
          itemsP.dept = itemsP.deptName;
          itemsP.user = itemsP.userName;
          delete itemsP.deptName;
          delete itemsP.userName;
        });
        delete this.addPlan.timess;
        data = await getAddPlan(this.addPlan);
        this.$notify({
          title: data ? "成功" : "失败",
          dangerouslyUseHTMLString: true,
          message: data ? data.message : "服务器开小差了，请稍后再试",
          type: data ? "success" : "warning",
        });

        if (data === "新增培训计划成功") {
          await clearData();
        }
        this.$emit("fatherMethod");
      }
      this.dialogVisible = false;
      // })

      // if (
      //   this.addPlan.trainPersonList == '' ||
      //   this.addPlan.trainPersonList == null
      // ) {
      //   this.$alert('请选择培训人员', '提示', {
      //     dangerouslyUseHTMLString: true
      //   })
      // }
    },
    handleSelectionChange(val) {
      if (val) {
        let arr = [];
        for (let i = 0; i < val.length; i++) {
          let itme = val[i];
          arr.push(itme.deptId);
        }
        this.multipleSelection = [...arr];
      }
    },
    //勾选的人
    handleSelectionChangeRy(val) {
      this.peopleNum = val;
    },
    //勾选的人
    handleSelectionChangeDel(val) {
      let ids = "";
      val.forEach((itemsval) => {
        ids += itemsval.id + ",";
      });
      this.ids = ids;
    },
    //页脚
    handleSizeChange(val) {
      this.pageForm.pageSize = val;
      this.alertChoose();
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val;
      this.alertChoose();
    },
    //页脚
    handleSizeChangeaddPlan(val) {
      this.addPlanpageSize = val;
      this.peopleList();
    },
    handleCurrentChangeaddPlan(val) {
      this.addPlanpageNum = val;
      this.peopleList();
    },

    selectDeptSp() {
      this.dialogVisibleDeptSp = false;

      let temSelectUser = [];
      let spTemSelectUser = [];
      let temValue = this.value;
      let temData = this.data;
      for (let val in temValue) {
        for (let data in temData) {
          console.log(val == data.key);
          if (temValue[val] == temData[data].userId) {
            //获取数据
            temSelectUser.push(temData[data]);
            spTemSelectUser.push(temData[data]);
          }
        }
      }
      this.chooseUserId = spTemSelectUser;
      // console.log(this.chooseUserId)
      if (!this.nextData.userName) {
        for (let i = 0; i < this.chooseUserId.length; i++) {
          this.nextData.userName = this.chooseUserId[i].user;
          this.toUser = this.chooseUserId[i].userId;
        }

        this.addPlan.toUser = this.toUser;
        console.log(this.nextData.userName);
        console.log(this.toUser);
      } else {
        for (let i = 0; i < this.chooseUserId.length; i++) {
          // this.nextData.userName.push(this.chooseUserId[i].user);
          this.nextData.userName = this.chooseUserId[i].user;
          this.addPlan.toUser = this.chooseUserId[i].userId;
        }
      }
    },

    //map 去重
    deWeightThree(deWeightKey, arrayObj) {
      let name = deWeightKey;
      let map = new Map();
      for (let item of arrayObj) {
        if (!map.has(item[name])) {
          map.set(item[name], item);
        }
      }
      return [...map.values()];
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.alertChoose();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog .el-dialog__body {
  height: 85vh;
}
.stepsBox {
  text-align: center;
}
.stepsBox .el-steps--horizontal {
  width: 100%;
  margin: 0 auto;
}
::v-deep .el-step.is-horizontal {
  flex-basis: 50% !important;
}
::v-deep .el-step:last-of-type .el-step__line {
  display: block;
}
::v-deep .el-step__head.is-process {
  color: #175eb6;
  border-color: #175eb6;
}
::v-deep .el-step__title.is-process {
  color: #175eb6;
}
::v-deep .el-tabs__nav-wrap {
  display: none;
}
::v-deep .el-tabs--card > .el-tabs__header {
  border: none;
}
::v-deep .el-step__main {
  text-align: center;
}
::v-deep .el-form-item__content {
  text-align: left;
}
.confide-content {
  width: 700px;
  margin: 0 auto;
}
.tabsTit {
  text-align: left;
  margin-bottom: 30px;
}
.tabsTit span {
  font-size: 16px;
  border-bottom: 4px solid #175eb6;
  margin-left: 66px;
  font-weight: bold;
  color: #333333;
}
.btnBox {
  text-align: right;
}
.btnBox span {
  font-size: 14px;
  font-weight: bold;
  float: left;
}
.btnBox span i {
  font-size: 20px;
  font-weight: bold;
  color: #fa0000;
  font-style: normal;
}
.titBox {
  padding: 10px 0 30px;
  border-bottom: 1px solid rgba(196, 196, 196, 0.4);
  margin-bottom: 16px;
}
.titBox span {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-right: 60px;
}
.titBox span i {
  font-style: normal;
  font-size: 20px;
  font-weight: bold;
  color: #fa7600;
}
.titBox span:nth-child(2) i {
  color: #03af48;
}
.titBox span:nth-child(3) i {
  color: #fe0808;
}
.btnCont {
  float: right;
}
.chaxun {
  background: #175eb6;
  color: #fff;
}
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

.page-tit {
  font-size: 18px;
  background: #ffffff;
  height: 45px;
  line-height: 45px;
  margin-bottom: 10px;
  padding-left: 15px;
  border-radius: 5px;
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
  content: "";
  width: 4px;
  height: 20px;
  background: rgba(13, 116, 215, 1);
  vertical-align: -4px;
  margin-right: 9px;
}
</style>
