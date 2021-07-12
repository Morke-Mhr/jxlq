<template>
  <!-- 培训计划 -->
  <div class="plan app-container">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="制定计划" name="first">
        <div class="app-container">
          <div class="sxForm">
            <el-form
              :inline="true"
              :model="pageForm"
              ref="pageForm"
              class="demo-form-inline"
            >
              <el-form-item label="培训类别" prop="pxClassId">
                <el-select
                  v-model="pageForm.pxClassId"
                  placeholder="请选择类别"
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
                  v-model="pageForm.pxTitleId"
                  placeholder="请选择主题"
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
              <div class="btnCont">
                <el-button
                  class="chaxun"
                  v-has="has.query"
                  @click="handleSearach"
                  >查询</el-button
                >
                <el-button @click="resetForm('pageForm')" class="chongzhi"
                  >重置</el-button
                >
              </div>
            </el-form>
          </div>
          <div class="sxTable">
            <el-button class="blue" @click="exportExcel">导出Excel</el-button>
            <!-- <el-button v-has="has.add" @click="handleAdd()">新增</el-button>
            <el-button v-has="has.delete" @click="handleDelete()">批量删除</el-button>-->
            <el-table
              :data="tableData"
              v-loading="loading"
              ref="multipleTable"
              tooltip-effect="light"
              style="width: 100%"
              height="calc(100vh - 380px)"
              @selection-change="handleSelectionChange"
              row-key="safebookId"
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
              stripe
            >
              <!-- <el-table-column type="selection" width="55"></el-table-column> -->
              <el-table-column
                align="center"
                label="类型"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{ scope.row.pxClass }}</template>
              </el-table-column>
              <el-table-column
                align="center"
                label="主题"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{ scope.row.pxTitle }}</template>
              </el-table-column>
              <el-table-column align="center" label="课时(小时)">
                <template slot-scope="scope">{{
                  scope.row.classHour
                }}</template>
              </el-table-column>
              <el-table-column align="center" label="应参与人数">
                <template slot-scope="scope">{{
                  scope.row.mustFinishCount
                }}</template>
              </el-table-column>
              <el-table-column align="center" label="课时达标人数">
                <template slot-scope="scope">{{
                  scope.row.finishCount
                }}</template>
              </el-table-column>
              <el-table-column
                align="center"
                label="完成率"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{
                  scope.row.finishRate
                }}</template>
              </el-table-column>
              <!-- <el-table-column
                align="center"
                label="已安排人数"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{
                  scope.row.unfinishCount
                }}</template>
              </el-table-column>
              <el-table-column align="center" label="未安排人数">
                <template slot-scope="scope">
                  {{ scope.row.unPlanCount }}
                </template>
              </el-table-column> -->
              <el-table-column
                fixed="right"
                width="210"
                align="center"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="parseInt(scope.row.unPlanCount) > 0"
                    type="text"
                    size="medium"
                    v-has="has.add"
                    @click="handleAdd(scope)"
                    >制定计划</el-button
                  >
                  <el-button
                    type="text"
                    size="medium"
                    v-has="has.query"
                    @click="handleDetail(scope)"
                    >查看计划</el-button
                  >
                  <!-- <el-button
                    :disabled="scope.row.status == '1'"
                    type="text"
                    size="medium"
                    v-has="has.delete"
                    @click.native.prevent="deleteRow(scope.row.trainplanId)"
                  >删除</el-button>-->
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
            <el-dialog
              title="新增培训计划"
              :visible.sync="planFlag"
              v-if="planFlag"
              @close="closeDialog"
              custom-class="large"
              :close-on-click-modal="false"
            >
              <!-- @close="stepbuttom = false" -->
              <Add
                ref="Add"
                @fatherMethod="fatherMethod"
                :trainpxdata="trainpxdata"
                :trainDemandId="trainDemandId"
                :addeitd="addeitd"
              ></Add>
              <span slot="footer" class="dialog-footer" v-if="stepbuttom">
                <el-button class="fBtn" @click="cancel()">取 消</el-button>
                <el-button
                  v-if="$refs.Add.lastbuttoms"
                  class="fBtn"
                  @click="$refs.Add.last()"
                  >上一步</el-button
                >
                <el-button
                  v-if="$refs.Add.buttoms"
                  v-has="addeitd ? has.add : has.details"
                  class="tBtn"
                  @click="$refs.Add.bootn_type == '提交' ? $refs.Add.confirm() : $refs.Add.next()"
                  >{{ $refs.Add.bootn_type }}</el-button
                >
              </span>
            </el-dialog>
            <el-dialog
              :visible.sync="dialogVisible"
              :title="lookTit"
              custom-class="large"
              :close-on-click-modal="false"
            >
              {{ detailDate.trainPersonList.user }}
              <div class="safety-table">
                <div id="printForm">
                  <el-form
                    :model="detailDate"
                    ref="itemSelInfo"
                    label-width="150px"
                    class="form-table clearfix"
                  >
                    <el-form-item
                      label="主题"
                      prop="pxTitle"
                      style="width: 50%; float: left"
                    >
                      <el-input
                        type="input"
                        v-model="detailDate.pxTitle"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="类别"
                      prop="pxClass"
                      style="width: 50%; float: left"
                    >
                      <el-input
                        type="input"
                        v-model="detailDate.pxClass"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="计划培训开始时间"
                      prop="planStartTime"
                      style="width: 50%; float: left"
                    >
                      <el-input
                        type="input"
                        v-model="detailDate.planStartTime"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="计划培训结束时间"
                      prop="planEndTime"
                      style="width: 50%; float: left"
                    >
                      <el-input
                        type="input"
                        v-model="detailDate.planEndTime"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="课时"
                      prop="pxClassHour"
                      style="width: 50%; float: left"
                      v-show="showPxClassHour"
                    >
                      <el-input
                        type="input"
                        v-model="detailDate.pxClassHour"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="地点"
                      prop="pxPlace"
                      style="width: 50%; float: left"
                      v-show="showPxPlace"
                    >
                      <el-input
                        type="input"
                        v-model="detailDate.pxPlace"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="培训机构"
                      prop="pxAgency"
                      style="width: 50%; float: left"
                    >
                      <el-input
                        type="input"
                        v-model="detailDate.pxAgency"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="授课老师"
                      prop="pxTeacher"
                      style="width: 50%; float: left"
                    >
                      <el-input
                        type="input"
                        v-model="detailDate.pxTeacher"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="内容">
                      <span class="text_area">
                        <el-input
                          type="textarea"
                          v-model="detailDate.pxContent"
                          :autosize="{ minRows: 3 }"
                          style="float: left"
                        ></el-input>
                      </span>
                    </el-form-item>
                    <el-form-item
                      label="关联测验计划"
                      v-show="showExamPlan"
                      style="width: 50%; float: right"
                    >
                      <el-input
                        type="input"
                        v-model="detailDate.relationExamName"
                      ></el-input>
                    </el-form-item>

                    <el-form-item label prop="createByDept"></el-form-item>
                    <el-form-item
                      label="关联课件"
                      style="width: 100%"
                      v-show="showDowloadFj"
                    >
                      <el-button
                        class="p15"
                        icon="el-icon-paperclip"
                        @click="downLoadFile"
                        >下载附件</el-button
                      >
                    </el-form-item>
                    <el-form-item
                      style="width: 100%"
                      v-show="!showDowloadFj"
                    ></el-form-item>
                    <!--
							<el-form-item label="培训人员">
								<div  v-for="(item,index) in this.detailDate.trainPersonList">
								<el-input type="textarea" v-model="item.user"></el-input>
								</div>
                    </el-form-item>-->
                    <div class="clearfix">
                      <div class="area-confide" style="margin-bottom: 10px">
                        <div class="clearfix confide">
                          <label
                            style="text-align: right;float:left; inline-block;width: 120px;padding: 0 12px 0 0;color: #606266;width: 150px;"
                            >培训人员</label
                          >
                          <table style="float: left; width:300px">
                            <tr
                              v-for="(item,
                              index) in detailDate.trainPersonList"
                              :key="index"
                            >
                              <td>&nbsp;{{ item.user }}</td>
                            </tr>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div>
                      <approval ref="mychild"></approval>
                    </div>
                  </el-form>
                </div>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button class="fBtn" @click="dialogVisible = false"
                  >关闭</el-button
                >
              </span>
            </el-dialog>

            <el-dialog
              title="查看培训计划"
              :visible.sync="seePopup"
              v-if="seePopup"
              custom-class="large"
              :close-on-click-modal="false"
            >
              <see
                :seepxTitle="seepxTitle"
                :seepxTitletrainDemandId="seepxTitletrainDemandId"
                :seepxClass="seepxClass"
              ></see>
              <span slot="footer" class="dialog-footer">
                <el-button class="fBtn" @click="seePopup = false"
                  >取 消</el-button
                >
              </span>
            </el-dialog>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="培训计划台账" name="second">
        <standing :classRes="classRes" :themeRes="themeRes"></standing>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getPlanDetail2, getDelete, clearData } from '@/api/safety/plan.js'
import { getSelectTheme } from '@/api/system/class'
import Add from './add'
import see from './see'
import standing from './standing'
import Approval from '@/components/approvalProcess/index'
import elementIcons from '@/views/system/menu/element-icons.js'
import axios from 'axios'
import { getToken } from '@/utils/auth'
export default {
  components: { Add, Approval, see, standing },
  data() {
    return {
      activeName: 'first',
      has: {
        query: 'train:trainPlan:list',
        details: 'train:trainPlan:query',
        add: 'train:trainPlan:add',
        delete: 'train:trainPlan:remove'
      },
      stepbuttom: false,
      addeitd: true,
      showPxClassHour: true,
      seePopup: false,
      seepxClass: {},
      seepxTitletrainDemandId: '',
      trainpxdata: {},
      seepxTitle: {},
      showPxPlace: true,
      showDowloadFj: true,
      showExamPlan: true,
      lookTit: '查看',
      tableData: [],
      total: 100,
      pageSizes: [10, 15, 20, 25, 30],
      dialogVisible: false,
      delarr: [], //全选
      approverStatus: {
        0: '待审批',
        1: '审批中',
        2: '已驳回',
        3: '已完成'
      },
      //搜索
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        pxClassId: '',
        pxTitleId: ''
      },
      //树形
      checkStrictly: true,
      defaultMenutree: [],
      deptOptions: [],
      multipleSelection: [],
      dialogType: 'new',
      defaultProps: {
        children: 'children',
        label: 'label',
        disabled: function(data) {
          if (data.flag == '1') {
            return true
          } else {
            return false
          }
        }
      },
      elementIcons,

      loading: false,
      trainDemandId: '',
      //表单验证方法
      formRules: {
        projectName: [
          {
            required: true,
            message: '请输入项目名称',
            trigger: 'blur'
          }
        ],
        projectDept: [
          {
            required: true,
            message: '请选择项目部',
            trigger: 'blur'
          }
        ],
        bid: [
          {
            required: true,
            message: '请输入标段',
            trigger: 'blur'
          }
        ],
        projectTypeId: [
          {
            required: true,
            message: '请选择项目类型',
            trigger: 'blur'
          }
        ],
        projectProcessId: [
          {
            required: true,
            message: '请选择项目进度',
            trigger: 'blur'
          }
        ],
        startTime: [
          {
            required: true,
            message: '请选择开始时间',
            trigger: 'blur'
          }
        ],
        endTime: [
          {
            required: true,
            message: '请选择结束时间',
            trigger: 'blur'
          }
        ]
      },
      //新增表单字段对象
      itemModel: {
        //项目名称
        projectName: '',
        //标段
        bid: '',
        //项目部编号
        projectDeptId: '',
        //项目部
        projectDept: '',
        //项目类型编号
        projectTypeId: '',
        //项目类型
        projectType: '',
        //项目进度编号
        projectProcessId: '',
        //项目进度
        projectProcess: '',
        //开始时间
        startTime: '',
        //结束时间
        endTime: ''
      },
      //查看详情字段
      detailDate: {
        //主题
        pxTitle: '',
        //培训类别
        pxClass: '',
        //培训内容
        pxContent: '',
        //计划培训开始时间
        planStartTime: '',
        //计划培训结束时间
        planEndTime: '',
        //授课老师
        pxTeacher: '',
        //培训机构
        pxAgency: '',
        //地点
        pxPlace: '',
        //培训课时
        pxClassHour: '',
        //培训人员集合
        trainPersonList: [
          {
            //人员
            user: ''
          }
        ],
        //课件集合
        trainCoursewareList: [
          {
            //课件名称
            kjName: '',
            //课件附件url
            kjFileUrl: ''
          }
        ],
        //培训附件list
        trainplanFileList: [
          {
            //附件名称
            pictureName: '',
            //附件url
            pictureUrl: ''
          }
        ]
      },
      classRes: [],
      themeRes: [],
      planFlag: false,
      EditTrainplanId: ''
      // personData:"",
    }
  },
  created: async function() {
    this.handleSearach()
    this.getClassSel()
    this.getThemeSel()
    this.$nextTick(() => {})
  },
  mounted() {},
  methods: {
    // 导出
    exportExcel() {
      // 导出当前页
      var data = this.pageForm
      axios({
        method: 'get',
        url:
          this.$store.state.apiConfiguration.url +
          this.$store.state.serviceName.safetyEdu +
          '/trainPlan/exportPlanMakeList',
        responseType: 'blob', // 表明返回服务器返回的数据类型
        headers: {
          'Content-Type': 'application/json',
          Authorization: getToken()
        },
        params: data
      }).then(function(response) {
        //创建一个隐藏的a连接，
        const link = document.createElement('a')
        let blob = new Blob([response.data], {
          type: 'application/vnd.ms-excel'
        })
        link.style.display = 'none'
        //设置连接
        link.href = URL.createObjectURL(blob)
        link.download = '培训计划清单.xlsx'
        document.body.appendChild(link)
        //模拟点击事件
        link.click()
      })
    },
    // 标签页切换
    handleClick() {},

    handleSearach() {
      this.pageForm.pageNum = 1
      this.getAllList()
    },

    //新增
    async handleAdd(scope) {
      //新增计划
      this.addeitd = true
      this.planFlag = true
      this.trainpxdata = {
        pxClassId: scope.row.pxClassId,
        pxTitleId: scope.row.pxTitleId,
        pxClass: scope.row.pxClass,
        pxTitle: scope.row.pxTitle,
        classHour: scope.row.classHour
      }
      this.trainDemandId = scope.row.trainDemandId + ''
      let addbuttom = setInterval(() => {
        if (this.$refs.Add) {
          this.stepbuttom = true
          clearInterval(addbuttom)
        }
      }, 200)
    },
    fatherMethod() {
      //新增或修改完成
      this.planFlag = false
      this.stepbuttom = false
      this.getAllList()
    },
    //编辑
    handleEdit(scope) {
      this.planFlag = true
      this.EditTrainplanId = scope.row.trainplanId
    },
    handleSelectionChange(val) {
      if (val) {
        let arr = []
        for (let i = 0; i < val.length; i++) {
          let itme = val[i]
          arr.push(itme.projectId)
        }
        this.multipleSelection = [...arr]
      }
    },
    //获取列表数据
    //获取列表
    async getAllList() {
      this.loading = true
      const res = await getPlanDetail2(this.pageForm)
      this.tableData = res.rows
      // this.tableData = res.rows.slice(
      //   (this.pageForm.pageNum - 1) * this.pageForm.pageSize,
      //   (this.pageForm.pageNum - 1) * this.pageForm.pageSize +
      //     this.pageForm.pageSize
      // );
      this.total = res.total
      this.loading = false
    },
    //获取分类下拉列表
    async getClassSel() {
      let dictName = 'train_type'
      this.classRes = await getSelectTheme(dictName)
    },
    //获取项目类型下拉id
    peojectTypeFunc(val) {
      let resultArr = this.classRes.filter((item) => {
        return item.dictCode === val
      })
      //把值赋给要传给后台的表单对象中
      this.need.pxClassId = resultArr[0].dictCode
      this.need.pxClass = resultArr[0].dictLabel //直接写val也可以
    },
    //下载附件
    async downLoadFile() {
      let data = this.detailDate
      let fileForm = {
        name: data.trainCoursewareList[0].kjName,
        path: data.trainCoursewareList[0].kjFileUrl
      }
      // this.fileDowloadName =
      //   this.$store.state.apiConfiguration.url +
      //   "jxlq-system-service" +
      //   "/fs/download?name=" +
      //   fileForm.name +
      //   "&path=" +
      //   fileForm.path;
      // location.href = this.fileDowloadName;
      let nameS = fileForm.path.substring(fileForm.path.lastIndexOf('.') + 1)
      this.fileDowloadName =
        this.$store.state.apiConfiguration.url +
        'fs/download?name=' +
        encodeURI(encodeURI(fileForm.name + '.' + nameS)) +
        '&path=' +
        fileForm.path
      location.href = this.fileDowloadName
    },
    //获取主题下拉列表
    async getThemeSel() {
      let dictType = 'training_topics'
      this.themeRes = await getSelectTheme(dictType)
    },
    //获取项目进度下拉id
    peojectFunc(val) {
      let resultArr = this.themeRes.filter((item) => {
        return item.dictCode === val
      })
      //把值赋给要传给后台的表单对象中
      this.need.pxTitleId = resultArr[0].dictCode
      this.need.pxTitle = resultArr[0].dictLabel //直接写val也可以
    },

    //查看
    async handleDetail(scope) {
      this.seepxClass = {
        pxClass: scope.row.pxClass,
        pxClassId: scope.row.pxClassId,
        classHour: scope.row.classHour
      }
      this.seepxTitle = {
        pxTitle: scope.row.pxTitle,
        pxTitleId: scope.row.pxTitleId,
        classHour: scope.row.classHour
      }
      this.seepxTitletrainDemandId = scope.row.trainDemandId
      this.seePopup = true
      // this.dialogType = "new";
      // this.dialogVisible = true;
      // let trainplanId = scope.row.trainplanId;
      // // this.$nextTick();
      // setTimeout(() => {
      //   this.$refs.mychild.getList(scope.row.trainplanId); //调用子组件的审批记录
      // }, 500);
      // this.detailDate = await getPlanDetail(trainplanId);
      // if (this.detailDate.pxWay) {
      //   //附件
      //   this.showDowloadFj = false;
      //   //地点
      //   this.showPxPlace = true;
      //   //课时
      //   this.showPxClassHour = true;
      //   this.showExamPlan = false;
      // } else {
      //   //为false是线上
      //   //地点
      //   this.showPxPlace = false;
      //   //课时
      //   this.showPxClassHour = false;
      //   //附件
      //   this.showDowloadFj = true;
      //   this.showExamPlan = true;
      // }
    },

    //删除单个
    deleteRow(row) {
      this.$confirm('确定删除吗?', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await getDelete(row)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getAllList()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    //删除多个
    handleDelete() {
      if (this.multipleSelection != '') {
        //审批中和审批完成的数据不允许删除
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (
            this.multipleSelection[i].status == '1' ||
            this.multipleSelection[i].status == '3'
          ) {
            this.$message({
              type: 'warning',
              message: '存在审批中或者审批已完成的数据，不能执行删除操作!'
            })
            return
          }
        }
        this.$confirm('确定删除吗?', '删除', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            const length = this.multipleSelection.length
            for (let i = 0; i < length; i++) {
              this.delarr.push(this.multipleSelection[i].trainplanId)
              //审批中的数据不允许删除，给出相应友好提示
            }
            const yourArr = this.delarr
            await getDelete(yourArr)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getAllList()
            this.$refs.multipleTable.clearSelection()
          })
          .catch((err) => {
            console.error(err)
          })
      } else {
        this.$message.error('请选择要删除项')
      }
    },
    //关闭
    async closeDialog() {
      this.stepbuttom = false
      await clearData()
    },
    //取消
    async cancel() {
      this.planFlag = false
      this.stepbuttom = false
      await clearData()
    },

    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.handleSearach()
    },
    ///页脚
    handleSizeChange(val) {
      this.pageForm.pageSize = val
      this.handleSearach()
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val
      this.getAllList()
    }
  }
}
</script>

<style lang="scss" scoped>
// .text_area /deep/ {
//   .el-textarea {
//     width: 300px;
//   }
// }
// .safety-table .el-form-item {
//   width: 50%;
//   float: left;
// }

// .confide tr td {
//   width: 25%;
//   border-bottom: 1px solid #dcdfe6;
// }

// .confide table {
//   width: 82%;
//   float: right;
//   border-radius: 4px;
//   border: 1px solid #dcdfe6;
//   text-align: center;
//   border-bottom: none;
// }

// .confide tr {
//   height: 32px;
//   line-height: 32px;
// }

// .confide-content .upload-demo,
// .confide-content .upload {
//   width: 70%;
// }

// .confede-content .el-transfer {
//   text-align: center;
// }

// .area-confide {
//   margin-top: 20px;
// }

// .upload {
//   display: inline-block;
// }

// .confide-content .el-tree {
//   width: 30%;
//   height: 40vh;
//   float: left;
//   overflow-y: scroll;
// }

// .confide-content .el-transfer {
//   width: 70%;
//   float: left;
// }
// .safe_main .sxForm::after {
//   display: none;
// }
// .sxTable {
//   padding: 0;
// }
</style>
