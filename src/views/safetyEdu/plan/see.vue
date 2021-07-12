<template>
  <div>
    <h3>{{ seepxClass.pxClass }}类型--{{ seepxTitle.pxTitle }}主题</h3>
    <div class="see_title">
      <p>
        应参与人数：
        <span>{{ statistics[0].mustFinishCount }}</span>
      </p>
      <p>
        课时达标人数：
        <span>{{ statistics[0].finishCount }}</span>
      </p>
      <p>
        完成率：
        <span>{{ statistics[0].finishRate }}</span>
      </p>
      <!-- <p>
        已安排人数：
        <span>{{ statistics.rows[0].unfinishCount }}</span>
      </p>
      <p>
        未安排人数：
        <span>{{ statistics.rows[0].unPlanCount }}</span>
      </p> -->
    </div>
    <el-table
      :data="tableData"
      ref="multipleTable"
      tooltip-effect="light"
      stripe
      height="calc(100vh - 370px)"
      v-loading="loading"
    >
      <el-table-column align="center" label="组织部门" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.deptName }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="组织人"
        show-overflow-tooltip
        width="110"
      >
        <template slot-scope="scope">{{ scope.row.createBy }}</template>
      </el-table-column>
      <el-table-column align="center" label="培训开始时间">
        <template slot-scope="scope">{{ scope.row.planStartTime }}</template>
      </el-table-column>
      <el-table-column align="center" label="培训结束时间">
        <template slot-scope="scope">{{ scope.row.planEndTime }}</template>
      </el-table-column>
      <el-table-column align="center" label="培训方式" width="110">
        <template slot-scope="scope">{{
          scope.row.pxWay == 0 ? '线上' : '线下'
        }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="培训课时(单位:时)"
        show-overflow-tooltip
        width="150"
      >
        <template slot-scope="scope">{{ scope.row.pxClassHour }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="参与人数"
        show-overflow-tooltip
        width="110"
      >
        <template slot-scope="scope">{{ scope.row.personCount }}</template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">{{
          scope.row.status | approverStatusxx
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="是否考试" width="110">
        <template slot-scope="scope">{{
          scope.row.trainflag == 0 ? '不需要' : '需要'
        }}</template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="medium"
            @click="checks(scope.row.trainplanId)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-sizes="pageSizes"
      :page-size="pageForm.pageSize"
      @size-change="handleSizeChange"
      :current-page.sync="pageForm.pageNum"
      @current-change="handleCurrentChange"
    ></el-pagination>

    <!-- 查看 -->
    <el-dialog
      :visible.sync="dialogVisibleDept"
      :close-on-click-modal="false"
      :title="'培训计划详情'"
      custom-class="s_dialog large"
      append-to-body
      @close='closeDialog'
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="计划详情" name="plandetails">
          <div class="container-table safety-plan">
            <div class="confide-content">
              <div class="tabsTit"><span>详情</span></div>
              <el-form
                :model="addPlan"
                class="clearfix"
                ref="operationFome"
                label-width="135px"
                label-position="right"
              >
                <el-form-item label="培训类别" prop="pxClass">
                  <el-input
                    v-model="addPlan.pxClass"
                    show-word-limit
                    disabled
                  />
                </el-form-item>
                <el-form-item label="培训主题" prop="pxTitle">
                  <el-input
                    v-model="addPlan.pxTitle"
                    show-word-limit
                    disabled
                  />
                </el-form-item>
                <!-- 线下 -->
                <el-form-item label="需求课时(单位:时)">
                  <el-input
                    v-model.number="addPlan.classHour"
                    :disabled="true"
                    show-word-limit
                  />
                </el-form-item>
                <el-form-item label="培训方式" prop="pxWay">
                  <el-radio-group v-model="addPlan.pxWay">
                    <el-radio :label="false" disabled>线上</el-radio>
                    <el-radio :label="true" disabled>线下</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="计划培训开始时间" prop="planStartTime">
                  <el-input
                    v-model="addPlan.planStartTime"
                    show-word-limit
                    disabled
                  />
                </el-form-item>
                <el-form-item label="计划培训结束时间" prop="planEndTime">
                  <el-input
                    v-model="addPlan.planEndTime"
                    show-word-limit
                    disabled
                  />
                </el-form-item>
                <el-form-item label="内容" prop="pxContent">
                  <span class="text_area">
                    <el-input
                      v-model="addPlan.pxContent"
                      show-word-limit
                      type="textarea"
                      :autosize="{ minRows: 5, maxRows: 9 }"
                      disabled
                      resize="none"
                    />
                  </span>
                </el-form-item>
                <el-form-item label="培训机构" v-if="addPlan.pxWay == 1">
                  <el-input
                    v-model="addPlan.pxAgency"
                    show-word-limit
                    disabled
                  />
                </el-form-item>
                <el-form-item label="授课老师" v-if="addPlan.pxWay == 1">
                  <el-input
                    v-model="addPlan.pxTeacher"
                    show-word-limit
                    disabled
                  />
                </el-form-item>
                <el-form-item
                  label="课时(单位:时)"
                  prop="pxClassHour"
                  v-if="addPlan.pxWay == 1"
                >
                  <el-input
                    v-model.number="addPlan.pxClassHour"
                    show-word-limit
                    disabled
                  />
                </el-form-item>
                <el-form-item
                  label="关联课件"
                  prop="trainCoursewareList.kjName"
                  v-if="addPlan.pxWay == 0"
                >
                  <!-- <div
                    v-for="items in addPlan.trainCoursewareList"
                    :key="items"
                    :label="items"
                  > -->
                  <el-input
                    v-for="items in addPlan.trainCoursewareList"
                    :key="items.kjClassId"
                    v-model="items.kjName"
                    show-word-limit
                    disabled
                  />
                  <!-- </div> -->
                </el-form-item>
                <el-form-item
                  label="培训时长(单位:时)"
                  prop="pxClassHour"
                  v-if="addPlan.pxWay == 0"
                >
                  <el-input v-model="addPlan.pxClassHour" disabled> </el-input>
                </el-form-item>
                <el-form-item label="关联考试" prop="relationExamName">
                  <el-input v-model="addPlan.relationExamName" disabled>
                  </el-input>
                </el-form-item>
                <el-form-item
                  label="培训地点"
                  prop="pxPlace"
                  v-if="addPlan.pxWay == 1"
                >
                  <el-input
                    v-model="addPlan.pxPlace"
                    show-word-limit
                    disabled
                  />
                </el-form-item>
              </el-form>
              <div v-if="addPlan.isApply == 1">
                <div class="tabsTit" style="margin-top: 60px;">
                  <span>流程设置</span>
                </div>
                <!-- 状态|0待审批,1审批中,2审批驳回,3审批通过 -->
                <div class="inStatusBox">
                  <i></i>
                  <span v-if="addPlan.status == 0">待审批</span>
                  <span v-else-if="addPlan.status == 1">审批中</span>
                  <span v-else-if="addPlan.status == 2">审批驳回</span>
                  <span v-else-if="addPlan.status == 3">审批通过</span>
                </div>
                <div
                  v-for="item in nextData"
                  :key="item"
                  :name="item"
                  class="inProBox"
                >
                  <div class="processList">
                    <i></i>
                    <span>{{ item.applyStatus }}</span>
                    <p>
                      {{ item.applyTime }}
                      <span
                        >{{ item.applyDeptName }}/{{ item.applyNode }}/{{
                          item.applyUserName
                        }}</span
                      >
                    </p>
                    <p>{{ item.applyOpnion }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="培训人员" name="trainee">
          <div class="titBox">
            <span
              >培训人员列表：合计：<i>{{ totaladdPlan }}</i
              >人</span
            >
          </div>
          <el-table
            :data="addPlan.trainPersonList"
            height="calc(100vh - 370px)"
            row-key="safebookId"
            v-loading="loading"
            :tree-props="{
              children: 'children',
              hasChildren: 'hasChildren'
            }"
            tooltip-effect="light"
            stripe
          >
            <el-table-column align="center" label="部门" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.dept }}</template>
            </el-table-column>
            <el-table-column align="center" label="岗位" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.postName }}</template>
            </el-table-column>
            <el-table-column align="center" label="姓名" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.user }}</template>
            </el-table-column>
            <el-table-column
              align="center"
              label="时长要求"
              show-overflow-tooltip
            >
              <template slot-scope="scope">{{ scope.row.classHour }}</template>
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
              label="线上培训时长"
              show-overflow-tooltip
            >
              <template slot-scope="scope">{{
                scope.row.xianshangHour
              }}</template>
            </el-table-column>
            <el-table-column
              align="center"
              label="线下培训时长"
              show-overflow-tooltip
            >
              <template slot-scope="scope">{{
                scope.row.xiangxiaHour
              }}</template>
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
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="qux"
          >取消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getPlanDetail,
  getPlanDetail2,
  getPlanDetailTrainp,
  getTrainPlanSumData,
  getTrainPlanSumData2
} from '@/api/safety/plan.js'
import { getApproval } from '@/api/approval/approvalProcess'
export default {
  props: {
    seepxTitle: {
      type: Object,
      default: {}
    },
    seepxClass: {
      type: Object,
      default: {}
    },
    seepxTitletrainDemandId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 权限
      has: {},
      pageSizes: [10, 20, 30, 40],
      tableData: [],
      total: 0,
      pageForm: {
        pageNum: 1,
        pageSize: 10
      },
      loading: false,
      statistics: [
        {
          mustFinishCount: '',
          finishCount: '',
          finishRate: ''
        }
      ],
      //tab
      activeName: 'plandetails',
      dialogVisibleDept: false,
      //选择列表 项目清单
      addPlan: {
        trainCoursewareList: [
          {
            //课件id
            traincoursewareId: ''
          }
        ],
        //培训人员集合
        trainPersonList: [],
        //任务id
        taskId: '1301097346164154369',
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
        classHour: '',
        //培训形式
        pxWay: '',
        //培训机构
        pxAgency: '',
        //授课老师
        pxTeacher: '',
        //培训地点
        pxPlace: '',
        //是否需要审批
        isApply: '',
        //关联的考试名称
        relationExamName: '',
        //关联的考试ID
        relationExamId: '',
        //学习时长
        timess: ''
      },
      nextData: {
        applyTime: '',
        applyNode: '',
        applyDeptName: '',
        applyUserName: '',
        applyOpnion: '',
        applyStatus: ''
      },
      totaladdPlan: 0,
      addPlanpageNum: 1,
      addPlanpageSize: 10,
      idPlan: 0
    }
  },
  mounted() {
    this.loading = true
    this.getAllList()
  },
  methods: {
    //  查询详情
    async getAllList() {
      this.loading = true
      let rdata = await getPlanDetail2({
        // trainDemandId: this.seepxTitletrainDemandId,
        pxTitleId: this.seepxTitle.pxTitleId,
        pxClassId: this.seepxClass.pxClassId,
        classHour: this.seepxClass.classHour
      })
      this.statistics = rdata.rows
      let data = {
        // trainDemandId: this.seepxTitletrainDemandId,
        pxTitleId: this.seepxTitle.pxTitleId,
        pxClassId: this.seepxClass.pxClassId,
        classHour: this.seepxClass.classHour,
        pageSize: this.pageForm.pageSize,
        pageNum: this.pageForm.pageNum
      }
      let res = await getTrainPlanSumData(data)
      this.tableData = res.rows
      this.total = res.total
      this.loading = false
    },
    //  查询详情
    async getAllLists(id) {
      this.addPlan = await getPlanDetail(id)
      this.idPlan = id
      this.getAllListsP()
      this.nextData = await getApproval(id)
    },
    // 查询人员详情
    async getAllListsP() {
      let datap = {
        trainplanId: this.idPlan,
        pageNum: this.addPlanpageNum,
        pageSize: this.addPlanpageSize
      }
      let row = await getPlanDetailTrainp(datap)
      console.log(row,"9999999")
      this.addPlan.trainPersonList = row.rows
      this.totaladdPlan = row.total
    },
    //tab切换
    handleClick(tab, event) {
      console.log(tab, event)
    },
    //查看详情弹窗
    async checks(id) {
      this.dialogVisibleDept = true
      this.getAllLists(id)
    },
    //取消详情弹窗
    qux() {
      this.dialogVisibleDept = false
      this.addPlanpageNum = 1
      this.totaladdPlan= 0
      this.addPlanpageSize=10;
      this.activeName= 'plandetails'
      // this.getAllLists()
    },
    closeDialog() {
      this.dialogVisibleDept = false
      this.addPlanpageNum = 1
      this.totaladdPlan= 0
      this.addPlanpageSize=10;
      this.activeName= 'plandetails'
    },
    ///页脚
    handleSizeChange(val) {
      this.pageForm.pageSize = val
      this.getAllList()
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val
      this.getAllList()
    },
    //页脚
    handleSizeChangeaddPlan(val) {
      console.log(val,"11111111")
      this.addPlanpageSize = val
      this.getAllListsP()
    },
    handleCurrentChangeaddPlan(val) {
      console.log(val,"22222")
      this.addPlanpageNum = val
      this.getAllListsP()
    }
  }
}
</script>
<style lang="scss" scoped>
.confide-content {
  width: 700px;
  margin: 15px auto;
}
.tabsTit {
  text-align: left;
  margin-bottom: 20px;
}
.tabsTit span {
  font-size: 16px;
  border-bottom: 4px solid #175eb6;
  margin-left: 66px;
  font-weight: bold;
  color: #333333;
}
h3 {
  text-align: center;
}
.see_title {
  display: flex;
  margin-bottom: 10px;
}
.see_title > p {
  margin: 0 10px;
}
.see_title span {
  color: #175eb6;
}
.titBox {
  padding: 10px 0 30px;
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
  color: #fe0808;
}
.inStatusBox {
  margin-left: 135px;
  min-height: 68px;
  border-left: 1px dashed #dcdcdc;
  position: relative;
}
.inStatusBox i {
  position: absolute;
  top: 1px;
  left: -8px;
  display: block;
  width: 14px;
  height: 14px;
  background: #208cd8;
  border-radius: 50%;
  box-shadow: 0 0 5px #208cd8;
}
.inStatusBox span {
  font-size: 16px;
  margin-left: 20px;
  font-weight: bold;
  color: #208cd8;
}
.processList {
  margin-left: 135px;
  min-height: 68px;
  border-left: 1px dashed #dcdcdc;
  position: relative;
}
.inProBox:last-of-type .processList {
  border-left: none;
}
.processList i {
  position: absolute;
  top: 1px;
  left: -8px;
  display: block;
  width: 14px;
  height: 14px;
  background: #d5d5d5;
  border-radius: 50%;
}
.processList span {
  font-size: 16px;
  margin-left: 20px;
  font-weight: bold;
  color: #999999;
}
.processList p {
  font-size: 16px;
  font-weight: 500;
  color: #999999;
  margin: 18px 27px 13px 20px;
}
.processList p:last-child {
  font-size: 14px;
  padding-bottom: 48px;
  margin-bottom: 0;
}
.processList p span {
  font-size: 14px;
  font-weight: normal;
}
</style>
