<template>
  <div class="app-container look-people" style="background: #ffffff">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="basic">
        <div class="table-form clearfix">
          <div class="table-content">
            <div class="table-content-header">个人名片</div>
            <div class="table-content-body">
              <div class="fr-photo">
                <img :src="getImge" />
              </div>
              <div class="body-left">
                <span class="name">{{ basicInfo.userName }}</span>
                <span>{{ basicInfo.postName }}</span>
                <span>{{ basicInfo.phonenumber }}</span>
              </div>
            </div>
          </div>
          <div class="table-content inform">
            <div class="table-content-header">基本信息</div>
            <div class="table-content-body" style="padding:0">
              <div class="is-table" style="border-right: 1px solid #f2f2f2;">
                <div class="table-cell">
                  <div class="cell-title">性别:</div>
                  <div class="cell-text">{{ basicInfo.gender }}</div>
                </div>
                <div class="table-cell">
                  <div class="cell-title">毕业学校:</div>
                  <div class="cell-text">{{ basicInfo.graduateSchool }}</div>
                </div>
                <div class="table-cell">
                  <div class="cell-title">毕业日期:</div>
                  <div class="cell-text">{{ basicInfo.graduateDate }}</div>
                </div>
                <div class="table-cell">
                  <div class="cell-title">出生日期:</div>
                  <div class="cell-text">{{ basicInfo.userBirth }}</div>
                </div>
                <div class="table-cell">
                  <div class="cell-title">学历:</div>
                  <div class="cell-text">{{ basicInfo.education }}</div>
                </div>
              </div>
              <div class="is-table">
                <div class="table-cell">
                  <div class="cell-title">部门:</div>
                  <div class="cell-text">{{ basicInfo.deptName }}</div>
                </div>
                <div class="table-cell">
                  <div class="cell-title">入司日期:</div>
                  <div class="cell-text">{{ basicInfo.joinTime }}</div>
                </div>
                <div class="table-cell">
                  <div class="cell-title">电子邮箱:</div>
                  <div class="cell-text">{{ basicInfo.email }}</div>
                </div>
                <div class="table-cell">
                  <div class="cell-title">是否是安全员:</div>
                  <div class="cell-text">
                    {{ basicInfo.isSafeperson == 0 ? '不是' : '是' }}
                  </div>
                </div>
                <div class="table-cell">
                  <div class="cell-title">证件号:</div>
                  <div class="cell-text">{{ basicInfo.cardId }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="remark">
          {{ '备注: ' + (basicInfo.remark ? basicInfo.remark : '暂无') }}
        </div>
      </el-tab-pane>
      <el-tab-pane label="执证情况" name="zzqk">
        <div v-show="hintText">暂无数据</div>
        <div
          class="table-form-cer clearfix"
          v-for="(list, index) in lceData"
          :key="index"
          style="margin-bottom: 20px"
          v-show="cerTable"
        >
          <ul>
            <li class="form-label">
              <span>证书类别</span>
            </li>
            <li>
              <span>{{ list.category }}</span>
            </li>
            <li class="form-label">
              <span>证书名称</span>
            </li>
            <li>
              <span>{{ list.name }}</span>
            </li>
          </ul>
          <ul>
            <li class="form-label">
              <span>领证日期</span>
            </li>
            <li>
              <span>{{ list.useTime }}</span>
            </li>
            <li class="form-label">
              <span>有效期</span>
            </li>
            <li>
              <span>{{ lceData.effectiveTime }}</span>
            </li>
          </ul>
          <ul>
            <li class="form-label">
              <span>证书附件</span>
            </li>
            <li>
              <span>{{ list.effectiveTime }}</span>
            </li>
          </ul>
        </div>
      </el-tab-pane>
      <el-tab-pane label="岗位变更" name="gwbg">
        <el-table
          :data="tableData"
          v-loading="loading"
          style="width: 100%; margin-top: 30px"
          @selection-change="handleSelectionChange"
          row-key="modelId"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          stripe
        >
          <!--  <el-table-column type="selection" width="55">
          </el-table-column> -->

          <el-table-column align="center" label="姓名">
            <template slot-scope="scope">
              {{ scope.row.userName }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="身份证号码">
            <template slot-scope="scope">
              {{ scope.row.cardId }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="变更前部门">
            <template slot-scope="scope">
              {{ scope.row.beforeDept }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="变更前岗位">
            <template slot-scope="scope">
              {{ scope.row.beforePost }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="变更后部门">
            <template slot-scope="scope">
              {{ scope.row.afterDept }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="变更后岗位">
            <template slot-scope="scope">
              {{ scope.row.afterPost }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="变更日期">
            <template slot-scope="scope">
              {{ scope.row.changeTime }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="变更原因">
            <template slot-scope="scope">
              {{ scope.row.reason }}
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
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="岗位职责" name="gwzz">
        <el-row :gutter="20">
          <el-col :span="8">
            <div>
              <div class="look-tit">岗位职责</div>
              <div class="look-tab-content">
                <p>{{ this.response }}</p>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <div class="look-tit">流程</div>
              <div>
                <div v-show="processShow" style="margin: 16px 0px">
                  暂无数据
                </div>
                <div
                  v-for="(item, index) in this.jobContent.workProcessList"
                  :key="index"
                >
                  <p class="text-Content" @click="getProcess(index)">
                    {{ item.workprocessName }}
                  </p>
                </div>
                <el-dialog
                  title="流程图"
                  :visible.sync="dialogVisibleT"
                  custom-class="large"
                  append-to-body
                >
                  <div id="vue-g6-editor">
                    <div class="editor" style="width: 100%">
                      <!-- 画布 -->
                      <div
                        id="page"
                        style="width: 100%; display: block; height: 92vh;"
                      ></div>
                      <!-- 属性栏 -->
                    </div>
                  </div>
                  <!-- <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisibleT = false">取 消</el-button>
                  </span> -->
                </el-dialog>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <div class="look-tit">作业规范</div>
              <div v-show="workShow" style="margin: 16px 0px">暂无数据</div>
              <div
                v-for="(item, index) in this.jobContent.workstandardFiles"
                :key="index"
              >
                <p class="text-Content" @click="lookDetail(index)">
                  {{ item.fileName }}
                </p>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="培训情况" name="pxqk">
        <el-form
          :inline="true"
          :model="pxqkPageForm"
          ref="pxqkPageForm"
          class="demo-form-inline"
        >
          <el-form-item label="培训类别" prop="pxClassId">
            <el-select
              v-model="pxqkPageForm.pxClassId"
              placeholder="请选择培训类别"
              style="width: 100%"
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
              v-model="pxqkPageForm.pxTitleId"
              placeholder="请选择培训主题"
              style="width: 100%"
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
          <el-form-item>
            <el-button
              class="chaxun"
              icon="el-icon-search"
              @click="getPxqkList()"
              >查询</el-button
            >
            <el-button @click="resetForm('pxqkPageForm')" class="chongzhi"
              >重置</el-button
            >
          </el-form-item>
        </el-form>

        <el-table
          :data="tableDataPxqk"
          v-loading="loading"
          style="width: 100%; margin-top: 30px"
          @selection-change="handleSelectionChange"
          row-key="modelId"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          stripe
        >
          <!--  <el-table-column type="selection" width="55">
          </el-table-column> -->

          <el-table-column align="center" label="培训主题">
            <template slot-scope="scope">
              {{ scope.row.pxTitle }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="培训类别">
            <template slot-scope="scope">
              {{ scope.row.pxClass }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="培训形式">
            <template slot-scope="scope">
              <!-- <span v-if="scope.row.beforeDept"></span> -->
              <span v-if="scope.row.pxWay == false">线上</span>
              <span v-if="scope.row.pxWay == true">线下</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="课时">
            <template slot-scope="scope">
              {{ scope.row.pxClassHour }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="签到时间">
            <template slot-scope="scope">
              {{ scope.row.signinTime }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="实际培训开始时间">
            <template slot-scope="scope">
              {{ scope.row.realStartTime }}
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="pxqkTotal"
          :page-sizes="pxqkPageSizes"
          :page-size="pxqkPageForm.pageSize"
          @size-change="pxqkHandleSizeChange"
          @current-change="pxqkHandleCurrentChange"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="安全检查" name="aqjc">
        <el-table
          :data="tableDataSafe"
          v-loading="loading"
          style="width: 100%; margin-top: 30px"
          @selection-change="handleSelectionChange"
          row-key="modelId"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          stripe
        >
          <!--  <el-table-column type="selection" width="55">
          </el-table-column> -->

          <el-table-column align="center" label="检查类别">
            <template slot-scope="scope">
              {{ scope.row.checkClass }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="完成时间">
            <template slot-scope="scope">
              {{ scope.row.finishTime }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="组织部门">
            <template slot-scope="scope">
              {{ scope.row.leadDept }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="组织人">
            <template slot-scope="scope">
              {{ scope.row.leadUser }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="检查人员">
            <template slot-scope="scope">
              {{ scope.row.createBy }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="safeTotal"
          :page-sizes="safePageSizes"
          :page-size="safePageForm.pageSize"
          @size-change="safeHandleSizeChange"
          @current-change="safeHandleCurrentChange"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="安全技术交底" name="aqjs">
        <el-table
          :data="tableDataTech"
          v-loading="loading"
          style="width: 100%; margin-top: 30px"
          @selection-change="handleSelectionChange"
          row-key="modelId"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          stripe
        >
          <!--  <el-table-column type="selection" width="55">
          </el-table-column> -->

          <el-table-column align="center" label="技术交底类型">
            <template slot-scope="scope">
              {{ scope.row.jdType }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="项目名称">
            <template slot-scope="scope">
              {{ scope.row.projectName }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="标段">
            <template slot-scope="scope">
              {{ scope.row.bid }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="单位工程名称">
            <template slot-scope="scope">
              {{ scope.row.engineName }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="分项工程">
            <template slot-scope="scope">
              {{ scope.row.worktype }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="交底时间">
            <template slot-scope="scope">
              {{ scope.row.jdTime }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="交底人">
            <template slot-scope="scope">
              {{ scope.row.jdUser }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="techTotal"
          :page-sizes="techPageSizes"
          :page-size="techPageForm.pageSize"
          @size-change="techHandleSizeChange"
          @current-change="techHandleCurrentChange"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="隐患整改" name="yhzg">
        <el-table
          :data="tableDataHidden"
          v-loading="loading"
          style="width: 100%; margin-top: 30px"
          @selection-change="handleSelectionChange"
          row-key="modelId"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          stripe
        >
          <!--  <el-table-column type="selection" width="55">
          </el-table-column> -->

          <el-table-column align="center" label="登记时间">
            <template slot-scope="scope">
              {{ scope.row.createTime }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="登记人">
            <template slot-scope="scope">
              {{ scope.row.createBy }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="隐患级别">
            <template slot-scope="scope">
              {{ yhList[scope.row.hdLevel] }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="问题描述">
            <template slot-scope="scope">
              {{ scope.row.problemDesc }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="隐患类别">
            <template slot-scope="scope">
              {{ scope.row.checkCategory }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="整改人">
            <template slot-scope="scope">
              {{ scope.row.implementer }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="hiddenTotal"
          :page-sizes="hiddenPageSizes"
          :page-size="hiddenPageForm.pageSize"
          @size-change="hiddenHandleSizeChange"
          @current-change="hiddenHandleCurrentChange"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="奖罚记录" name="jfjl">
        <el-table
          :data="tableDataReward"
          v-loading="loading"
          style="width: 100%; margin-top: 30px"
          @selection-change="handleSelectionChange"
          row-key="modelId"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          stripe
        >
          <!--  <el-table-column type="selection" width="55">
          </el-table-column> -->

          <el-table-column align="center" label="类型">
            <template slot-scope="scope">
              {{ scope.row.jfType == 0 ? '奖励' : '惩罚' }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="事项">
            <template slot-scope="scope">
              {{ scope.row.matter }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="金额">
            <template slot-scope="scope">
              {{ scope.row.money }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="其他奖罚">
            <template slot-scope="scope">
              {{ scope.row.jfOther }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="创建时间">
            <template slot-scope="scope">
              {{ scope.row.createTime }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="rewardTotal"
          :page-sizes="rewardPageSizes"
          :page-size="rewardPageForm.pageSize"
          @size-change="hiddenHandleSizeChange"
          @current-change="rewardHandleCurrentChange"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="绩效考核" name="jxkh">
        <el-form
          :inline="true"
          :model="perfPageForm"
          ref="perfPageForm"
          class="demo-form-inline"
        >
          <el-form-item label="选择年" prop="year">
            <el-date-picker
              v-model="perfPageForm.year"
              type="year"
              placeholder="选择年"
              format="yyyy"
              value-format="yyyy"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="选择月" prop="year">
            <el-date-picker
              v-model="perfPageForm.month"
              type="month"
              placeholder="选择月"
              format="MM"
              value-format="MM"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button
              class="chaxun"
              icon="el-icon-search"
              @click="onSubmit()"
              >查询</el-button
            >
            <el-button @click="resetFormPerf('perfPageForm')" class="chongzhi"
              >重置</el-button
            >
          </el-form-item>
        </el-form>

        <el-table
          :data="tableDataPerf"
          v-loading="loading"
          style="width: 100%; margin-top: 30px"
          @selection-change="handleSelectionChange"
          row-key="modelId"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          stripe
        >
          <!--  <el-table-column type="selection" width="55">
          </el-table-column> -->

          <el-table-column align="center" label="年份">
            <template slot-scope="scope">
              {{ scope.row.year }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="月份">
            <template slot-scope="scope">
              {{ scope.row.month }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="分值">
            <template slot-scope="scope">
              {{ scope.row.totalScore }}
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="perfTotal"
          :page-sizes="perfPageSizes"
          :page-size="perfPageForm.pageSize"
          @size-change="perfHandleSizeChange"
          :current-page.sync="currentPagePerf"
          @current-change="perfHandleCurrentChange"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :visible.sync="dialogVisible"
      title="作业规范详情"
      custom-class="large"
      :close-on-click-modal="false"
    >
      <el-form
        :model="lookForm"
        ref="operationFome"
        label-width="80px"
        label-position="left"
      >
        <!-- <el-form-item label="类别" prop="workType">
          <el-input v-model="lookForm.workType" maxlength="30" show-word-limit placeholder="类别" />
        </el-form-item> -->
        <el-form-item label="类别">
          <el-select
            v-model="lookForm.workType"
            placeholder="请选择类别"
            style="width: 100%"
          >
            <el-option
              v-for="item in workRes"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictLabel"
              :disabled="true"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="workName">
          <el-input
            v-model="lookForm.workName"
            maxlength="30"
            show-word-limit
            placeholder="名称"
            :disabled="true"
          />
        </el-form-item>

        <!--     <el-form-item label="附件" prop="fileName">
          <el-input v-model="lookForm.fileName" maxlength="11" show-word-limit :disabled="true"  />
        </el-form-item> -->

        <el-form-item label="附件" prop="fileName">
          <template>
            <span
              style="color: #096dd9; cursor: pointer"
              @click="fileDownload"
              >{{ lookForm.fileName }}</span
            >
          </template>
        </el-form-item>

        <el-form-item label="要求" prop="workRequire">
          <el-input
            v-model="lookForm.workRequire"
            maxlength="30"
            show-word-limit
            placeholder="要求"
            :disabled="true"
          />
        </el-form-item>

        <el-form-item label="内容" prop="workContent">
          <el-input
            v-model="lookForm.workContent"
            placeholder="内容"
            :disabled="true"
          />
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- <div style="text-align: right; margin-top: 20px">
      <el-button class="cancel-btn" @click="cancelBtn"> 取消 </el-button>
    </div> -->
  </div>
</template>

<script>
import {
  getPeopleInfo,
  getPeopleInfoCer,
  getBasicJobList,
  getTrainQkList,
  getTechList,
  getPeoSafetyList,
  getPeoHiddenList,
  getPeoRewardList,
  getPeoPerfList
} from '@/api/system/people'
import { getJobPosition, getLookWorkAlert } from '@/api/job/jobPosition'
import {
  getlookWorkchart,
  getNodeIdJob,
  getNodeIdBook
} from '@/api/job/workChart'
import G6Editor from '@antv/g6-editor'
import { getSelectTheme, getSelectWorkType } from '@/api/system/class'
export default {
  props: {
    editPrograms: {
      type: Object,
      default: {}
    }
    // editProgram: Object,
  },
  data() {
    return {
      has: {
        getProcess: 'system:workProcess:getWorkProcess'
      },
      // 节点属性表单
      nodeAttributeForm: {
        label: '',
        width: '',
        height: ''
      },
      // SVG节点图片URL地址
      startNodeSVGUrl: require('../../../assets/start-node.svg'),
      endNodeSVGUrl: require('../../../assets/end-node.svg'),
      regularNodeSVGUrl: require('../../../assets/regular-node.svg'),
      conditionNodeSVGUrl: require('../../../assets/condition-node.svg'),
      modelNodeSVGUrl:
        'https://gw.alipayobjects.com/zos/rmsportal/rQMUhHHSqwYsPwjXxcfP.svg',
      // 编辑器
      editor: null,
      saveAsImageDialogVisible: false,
      saveAsImageFormat: 'jpg',
      //表单验证方法
      activeName: 'basic',
      userId: this.editPrograms.userId,
      postId: this.editPrograms.postId,
      basicInfo: {
        userName: '',
        cardId: '',
        gender: '',
        deptName: '',
        postName: '',
        joinTime: '',
        phonenumber: '',
        email: '',
        graduateSchool: '',
        education: '',
        graduateDate: '',
        userBirth: '',
        remark: '',
        avatar: ''
      },
      loading: false,
      lceData: [],
      tableData: [],
      cerTable: true,
      hintText: false,
      need: {
        pxTitleId: '',
        pxTitle: '',
        pxClassId: '',
        pxClass: ''
      },
      //搜索
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        userId: this.editPrograms.userId
      },
      total: 100,
      pageSizes: [10, 15, 20, 25, 30],
      //培训情况 搜索
      tableDataPxqk: [],
      classRes: [],
      themeRes: [],
      pxqkPageForm: {
        pageNum: 1,
        pageSize: 10,
        userId: this.editPrograms.userId,
        pxTitleId: '',
        pxClassId: ''
      },
      pxqkTotal: 100,
      pxqkPageSizes: [10, 15, 20, 25, 30],
      //安全技术 搜索
      tableDataTech: [],
      techPageForm: {
        pageNum: 1,
        pageSize: 10,
        userId: this.editPrograms.userId
      },
      techTotal: 100,
      techPageSizes: [10, 15, 20, 25, 30],
      //安全检查
      tableDataSafe: [],
      safePageForm: {
        pageNum: 1,
        pageSize: 10,
        createById: this.editPrograms.userId
      },
      safeTotal: 100,
      safePageSizes: [10, 15, 20, 25, 30],
      //隐患整改
      tableDataHidden: [],
      hiddenPageForm: {
        pageNum: 1,
        pageSize: 10,
        createById: this.editPrograms.userId
      },
      hiddenTotal: 100,
      hiddenPageSizes: [10, 15, 20, 25, 30],
      yhList: {
        0: '微小',
        1: '一般',
        2: '重大'
      },

      //奖罚记录
      //隐患整改
      tableDataReward: [],
      rewardPageForm: {
        pageNum: 1,
        pageSize: 10,
        createById: this.editPrograms.userId
      },
      rewardTotal: 100,
      rewardPageSizes: [10, 15, 20, 25, 30],
      //绩效考核 搜索
      tableDataPerf: [],
      pageNumPref: 1, //默认当前页
      pageSizePref: 10,
      perfPageForm: {
        pageNum: 1,
        pageSize: 10,
        createById: this.editPrograms.userId,
        year: '',
        month: ''
      },
      perfTotal: 100,
      perfPageSizes: [10, 15, 20, 25, 30],
      currentPagePerf: '',
      //岗位职责
      response: '暂无数据',
      //作业规范
      workstandardFiles: '暂无数据',
      //流程图
      workProcessList: '暂无数据',
      //画布属性
      // 画布属性栏表单
      showProcess: true,
      processMap: '',
      dialogVisibleEdit: false,
      index: '',
      curID: '',
      curBookId: '',
      lookParams: {
        workstandardId: '',
        fileId: ''
      },
      jobContent: {
        workProcessList: [
          {
            workprocessName: '暂无数据'
          }
        ],
        workstandardFiles: [
          {
            fileName: '暂无数据'
          }
        ]
      },
      processShow: false,
      workShow: false,
      dialogVisibleT: false,
      dialogVisible: false,
      lookForm: {
        workType: '',
        workName: '',
        workContent: '',
        workRequire: '',
        fileName: '',
        fileUrl: ''
      },
      workRes: []
    }
  },
  created: async function() {
    this.getBasicInfo()
    this.lceData = await getPeopleInfoCer(this.userId)
    this.getJobList()
    this.getPxqkList()
    this.getJsjdList()
    //安全检查
    this.getSafeList()
    //隐患整改
    this.getHiddenList()
    //奖罚记录
    this.getRewardList()
    //绩效考核
    this.getPerfList()
    //岗位职责
    this.getJobPost()
    //下拉选择
    this.getClassSel()
    this.getThemeSel()
    if (this.lceData.length == 0) {
      this.cerTable = false
      this.hintText = true
    }
  },
  computed: {
    getImge: function() {
      if (this.basicInfo.avatar == '' || this.basicInfo.avatar === undefined) {
        return ''
      } else {
        return (
          this.$store.state.apiConfiguration.url +
          this.$store.state.serviceName.jurisdiction +
          '/' +
          this.basicInfo.avatar
        )
      }
    }
  },
  methods: {
    // 初始化
    initG6Editor() {
      const _this = this
      if (_this.editor) {
        return false
      }
      const editor = new G6Editor()
      this.editor = editor

      G6Editor.track(false)
      const Command = G6Editor.Command
      // 注册新命令save
      Command.registerCommand('save', {
        // 禁止保存命令进入队列
        queue: false,
        // 命令是否可用
        enable: (editor) => {
          return true
        },
        // 正向命令
        execute(editor) {
          let needSaveData = editor.getCurrentPage().save()
          console.log(needSaveData)
          localStorage.setItem('flowData', JSON.stringify(needSaveData))
          _this.save(needSaveData)
          // _this.$message.success("数据已保存");
        },
        // 反向命令
        back(editor) {
          console.log('反向命令')
          console.log(editor)
        },
        // 快捷键：Ctrl + S
        shortcutCodes: [['metaKey', 's'], ['ctrlKey', 's']]
      })
      // 画布
      this.flow = new G6Editor.Flow({
        graph: {
          container: 'page',
          fitView: 'autoZoom'
        },
        align: {
          line: {
            // 对齐线颜色
            stroke: '#FA8C16',
            // 对齐线粗细
            lineWidth: 1
          },
          // 开启全方位对齐
          item: true,
          // 网格对齐
          grid: true
        },
        grid: {
          // 网孔尺寸
          cell: 18
        },
        shortcut: {
          // 开启自定义命令保存的快捷键
          save: true
        }
      })
      window.flow = this.flow

      // 设置边
      this.flow.getGraph().edge({
        shape: 'flow-polyline'
      })

      // 元素面板栏
      const itempannel = new G6Editor.Itempannel({
        container: 'itempannel'
      })
      // // 属性栏
      // const detailpannel = new G6Editor.Detailpannel({
      //   container: "detailpannel"
      // });
      // // 缩略图
      // let minimapWidth = getComputedStyle(document.querySelector(".right-part")).width;
      // minimapWidth = Number(minimapWidth.replace(/px$/, ""));
      // const minimap = new G6Editor.Minimap({
      //   container: "minimap",
      //   width: minimapWidth,
      //   height: 200
      // });
      // 右键菜单
      // const contextmenu = new G6Editor.Contextmenu({
      //   container: "contextmenu"
      // });
      // 挂载以上组件到Editor
      editor.add(flow)
      editor.add(itempannel)
      // editor.add(toolbar);
      // editor.add(detailpannel);
      // editor.add(minimap);
      // editor.add(contextmenu);
      // 挂载到window，方便调试
      window.editor = editor

      // 获取当前画布
      var currentPage = editor.getCurrentPage()
      console.log('currentPage:' + currentPage)
      currentPage.on('afterchange', (e) => {
        if (e.action === 'add') {
          if (
            e.model.nodetype === 'startNode' ||
            e.model.nodetype === 'endNode'
          ) {
            let nodes = this.editor.getCurrentPage().getNodes()
            for (const item of nodes) {
              if (
                item.model.nodetype === e.model.nodetype &&
                item.model.id !== e.model.id
              ) {
                this.editor.getCurrentPage().remove(e.item)
                this.$message.warning('只能有一个开始节点或结束节点')
              }
            }
          }
        }
      })
      // 监听（选择对象后）事件
      // 获取流图的graph示例
      // this.graph = this.flow.getGraph();
      // console.log(this.graph);
      // // 居中画布中的内容
      //   this.graph.setFitView('cc');
      currentPage.on('node:click', (ev) => {
        console.log('打印所选对象属性', ev.item)
        console.log('打印所选对象数据模型', ev.item.model)
        var selectedItemDataModel = ev.item.model
        let self = this
        // 如果选择的对象是节点
        if (ev.item.isNode) {
          this.nodeAttributeForm.label = selectedItemDataModel.label
          this.nodeAttributeForm.width = selectedItemDataModel.size.split(
            '*'
          )[0]
          this.nodeAttributeForm.height = selectedItemDataModel.size.split(
            '*'
          )[1]
          this.nodeAttributeForm.color = selectedItemDataModel.color
          this.jobForm.nodeId = selectedItemDataModel.id
          this.getTree()
          this.defaultMenutree = []
          //根据节点显示工作岗位
          getNodeIdJob(this.jobForm.nodeId).then(function(response) {
            for (var i = 0; i < response.length; i++) {
              self.jobForm.postName.push(response[i].postName)
              self.jobForm.postId.push(response[i].postId)
              self.$refs.deptTree.setCheckedKeys(self.jobForm.postId, true)
            }
          })
          this.jobForm.postName.splice(0, this.jobForm.postName.length)
          this.jobForm.postId.splice(0, this.jobForm.postName.length)
          //根据节点显示作业指导书
          getNodeIdBook(this.jobForm.nodeId).then(function(response) {
            self.tableData = response.rows
            self.total = response.total
          })
          this.addBtn = true
        }
        // 如果选择的对象是边
        if (ev.item.isEdge) {
          ev.item.graph.edge({
            shape: 'flow-polyline-round'
          })
          this.edgeAttributeForm.label = selectedItemDataModel.label
          this.edgeAttributeForm.shape = selectedItemDataModel.shape
        }
      })
      // 监听（删除后）事件
      currentPage.on('afterdelete', (ev) => {})
    },
    async onSubmit() {
      let { createById, year, month } = this.perfPageForm
      let params = {
        pageNum: 1,
        pageSize: this.pageSizePref,
        createById: this.perfPageForm.createById,
        year: this.perfPageForm.year,
        month: this.perfPageForm.month
      }
      let data = await getPeoPerfList(params)
      this.tableDataPerf = data.rows
      this.loading = false
      this.perfTotal = data.total
      this.currentPagePerf = 1
    },
    cancelBtn() {
      this.$store.state.tabActive = 'people'
      console.log(this.$store.state.tabActive)
      this.$emit('fatherMethod')
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    async getBasicInfo() {
      this.basicInfo = await getPeopleInfo(this.userId)
      if (this.basicInfo.gender == '0') {
        this.basicInfo.gender = '男'
      } else if (this.basicInfo.gender == '1') {
        this.basicInfo.gender = '女'
      }
      console.log(this.basicInfo)
    },
    //获取岗位变更列表
    async getJobList() {
      this.loading = true
      const res = await getBasicJobList(this.pageForm)
      this.tableData = res.rows
      this.total = res.total
      this.loading = false
    },
    //获取培训情况列表
    async getPxqkList() {
      this.loading = true
      const res = await getTrainQkList(this.pxqkPageForm)
      this.tableDataPxqk = res.rows
      this.pxqkTotal = res.total
      console.log(res)
      console.log(res.total)
      this.loading = false
    },

    //获取技术交底列表
    async getJsjdList() {
      this.loading = true
      const res = await getTechList(this.techPageForm)
      this.tableDataTech = res.rows
      this.techTotal = res.total
      console.log(res)
      console.log(res.total)
      this.loading = false
    },
    //获取安全检查列表
    async getSafeList() {
      this.loading = true
      const res = await getPeoSafetyList(this.safePageForm)
      this.tableDataSafe = res.rows
      this.safeTotal = res.total
      console.log(res)
      console.log(res.total)
      this.loading = false
    },
    //获取安隐患整改列表
    async getHiddenList() {
      this.loading = true
      const res = await getPeoHiddenList(this.hiddenPageForm)
      this.tableDataHidden = res.rows
      this.hiddenTotal = res.total
      console.log(res)
      console.log(res.total)
      this.loading = false
    },
    //获取奖罚记录列表
    async getRewardList() {
      this.loading = true
      const res = await getPeoRewardList(this.rewardPageForm)
      this.tableDataReward = res.rows
      this.rewardTotal = res.total
      console.log(res)
      console.log(res.total)
      this.loading = false
    },
    //获取绩效考核列表
    async getPerfList() {
      this.loading = true
      const res = await getPeoPerfList(this.perfPageForm)
      this.tableDataPerf = res.rows
      this.perfTotal = res.total
      console.log(res)
      console.log(res.total)
      this.loading = false
    },
    //获取岗位职责接口
    async getJobPost() {
      if (!this.postId) {
        console.log('岗位为空')
        return
      }
      // const res = await getJobPosition(this.postId);
      let res = await getJobPosition(this.postId)
      this.jobContent = res
      //判断岗位职责
      console.log(res, 'ressss')
      if (res.responsibility == '' || res.responsibility == null) {
        this.response = '暂无数据'
      } else {
        this.response = res.responsibility
      }

      //判断流程图
      if (res.workProcessList == '' || res.workProcessList == null) {
        this.processShow = true
      } else {
        this.processShow = false
      }

      //判断作业指导书
      if (res.workstandardFiles == '' || res.workstandardFiles == null) {
        this.workShow = true
      } else {
        this.workShow = false
      }
    },
    async getLookChart() {
      this.loading = true
      this.processMap = await getlookWorkchart(
        this.jobContent.workProcessList[this.curID].workprocessId,
        {
          selectNodeIds: this.jobContent.workProcessList[this.curID]
            .selectNodeIds
        }
      )
      this.flow.read(this.processMap)
      this.loading = false
    },
    getProcess(index) {
      if (this.postId != '') {
        this.dialogVisibleT = true
        setTimeout(() => {
          this.curID = index
          this.initG6Editor()
          this.getLookChart()
        }, 100)
      }
      // console.log("index", index);
      // this.curID = index;
      // console.log("getProcess", this.curID);
      // this.initG6Editor();
      // this.getLookChart();
    },
    async getWorkSel() {
      let dictName = 'Job_category'
      this.workRes = await getSelectWorkType(dictName)
      console.log(this.workRes)
    },
    //查看
    async lookDetail(index) {
      if (this.postId != '') {
        this.curBookId = index
        this.getWorkSel()
        this.dialogVisible = true
        this.lookParams.workstandardId = this.jobContent.workstandardFiles[
          this.curBookId
        ].workstandardId
        this.lookParams.fileId = this.jobContent.workstandardFiles[
          this.curBookId
        ].fileId
        try {
          let checkData = await getLookWorkAlert(this.lookParams)
          if (checkData) {
            this.lookForm = checkData
            this.lookForm.workType = checkData.dictDataWorkType.dictLabel
            this.lookForm.fileName = checkData.fileList[0].fileName
            this.lookForm.fileUrl = checkData.fileList[0].fileUrl
          }
        } catch (e) {
          console.error('接口异常')
        }
      }
    },
    //附件下载
    async fileDownload(index) {
      // let fileForm = {
      //   name: this.jobContent.workstandardFiles[index].fileName,
      //   path: this.jobContent.workstandardFiles[index].fileUrl
      // }
      // this.fileDowloadName =
      //   this.$store.state.apiConfiguration.url +
      //   'jxlq-system-service' +
      //   '/fs/download?name=' +
      //   fileForm.name +
      //   '&path=' +
      //   fileForm.path
      // location.href = this.fileDowloadName
      let fileForm = {
        name: this.lookForm.fileName,
        path: this.lookForm.fileUrl
      }
      this.fileDowloadName =
        this.$store.state.apiConfiguration.url +
        'jxlq-system-service' +
        `/fs/download?name=${encodeURI(encodeURI(fileForm.name))}
        ` +
        '&path=' +
        fileForm.path
      location.href = this.fileDowloadName
    },
    //获取分类下拉列表
    async getClassSel() {
      let dictName = 'train_type'
      this.classRes = await getSelectTheme(dictName)
    },
    //获取项目类型下拉id
    peojectTypeFunc(val, vIndex) {
      let resultArr = this.classRes.filter((item) => {
        return item.dictCode === val
      })
      //把值赋给要传给后台的表单对象中
      this.pxqkPageForm.pxClassId = resultArr[0].dictCode
      this.pxqkPageForm.pxClass = resultArr[0].dictLabel //直接写val也可以
    },
    //获取主题下拉列表
    async getThemeSel() {
      let dictType = 'training_topics'
      this.themeRes = await getSelectTheme(dictType)
    },
    //获取项目进度下拉id
    peojectFunc(val, vIndex) {
      let resultArr = this.themeRes.filter((item) => {
        return item.dictCode === val
      })
      //把值赋给要传给后台的表单对象中
      this.pxqkPageForm.pxTitleId = resultArr[0].dictCode
      this.pxqkPageForm.pxTitle = resultArr[0].dictLabel //直接写val也可以
    },
    ///页脚
    handleSizeChange(val) {
      this.pageForm.pageSize = val
      this.getJobList()
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val
      this.getJobList()
    },
    //培训情况页脚
    pxqkHandleSizeChange(val) {
      this.pxqkPageForm.pageSize = val
      this.getPxqkList()
    },
    pxqkHandleCurrentChange(val) {
      this.pxqkPageForm.pageNum = val
      this.getPxqkList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getPxqkList()
    },
    //绩效考核重置
    resetFormPerf(formName) {
      this.$refs[formName].resetFields()
      this.getPerfList()
    },
    //技术交底页脚
    techHandleSizeChange(val) {
      this.techPageForm.pageSize = val
      this.getJsjdList()
    },
    techHandleCurrentChange(val) {
      this.techPageForm.pageNum = val
      this.getJsjdList()
    },
    //安全检查页脚
    safeHandleSizeChange(val) {
      this.safePageForm.pageSize = val
      this.getSafeList()
    },
    safeHandleCurrentChange(val) {
      this.safePageForm.pageNum = val
      this.getSafeList()
    },
    //隐患整改页脚
    hiddenHandleSizeChange(val) {
      this.hiddenPageForm.pageSize = val
      this.getHiddenList()
    },
    hiddenHandleCurrentChange(val) {
      this.hiddenPageForm.pageNum = val
      this.getHiddenList()
    },
    //奖罚记录页脚
    rewardHandleSizeChange(val) {
      this.hiddenPageForm.pageSize = val
      this.getHiddenList()
    },
    rewardHandleCurrentChange(val) {
      this.hiddenPageForm.pageNum = val
      this.getHiddenList()
    },
    //绩效考核页脚
    perfHandleSizeChange(val) {
      this.perfPageForm.pageSize = val
      this.onSubmit()
    },
    perfHandleCurrentChange(val) {
      this.perfPageForm.pageNum = val
      this.getPerfList()
    },
    handleSelectionChange(val) {
      if (val) {
        let arr = []
        for (let i = 0; i < val.length; i++) {
          let itme = val[i]
          arr.push(itme.id)
        }
        this.multipleSelection = [...arr]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  margin: 0;
  padding: 0;
}
ul li {
  padding: 0;
  margin: 0;
  list-style: none;
}
.table-form .fl-table,
.table-form-cer .fl-table {
  width: 70%;
  float: left;
}
.table-content.inform {
  width: 69%;
  float: right;
}
.table-content {
  width: 30%;
  float: left;
  border-radius: 4px;
  overflow: hidden;
  height: 291px;
  border: 1px solid #f2f2f2;
  .table-content-header {
    background-color: #d8e4f3;
    font-size: 14px;
    color: #333333;
    height: 45px;
    line-height: 45px;
    width: 100%;
    text-align: center;
  }
  .table-content-body {
    padding: 6px;
    .fr-photo {
      width: 45%;
      background: #ffffff;
      img {
        width: 100%;
        height: 230px;
      }
    }
    .body-left {
      width: 55%;
    }
    .is-table {
      padding: 12px 10px;
      width: 50%;
      height: 245px;
      float: left;
      .table-cell {
        width: 100%;
        height: 44px;
        line-height: 44px;
        .cell-title {
          float: left;
          width: 25%;
          text-align: right;
          overflow: hidden; //超出的文本隐藏
          text-overflow: ellipsis; //溢出用省略号显示
          white-space: nowrap; //溢出不换行
        }
        .cell-text {
          float: right;
          width: 72%;
        }
      }
      .table-cell:nth-of-type(2n + 1) {
        background: #f2f2f2;
      }
    }
    .fr-photo,
    .body-left {
      height: 245px;
      float: left;
      text-align: center;
      span {
        display: block;
        color: #333333;
        font-size: 18px;
        margin-top: 18px;
      }
      .name {
        color: #333333;
        font-size: 36px;
        font-weight: bold;
        margin-top: 46px;
      }
    }
  }
}

.remark {
  width: 100%;
  height: 60px;
  line-height: 60px;
  background: #ffffff;
  border: 1px solid #f2f2f2;
  border-radius: 4px;
  font-size: 16px;
  margin-top: 8px;
  padding-left: 20px;
}

.clearfix,
.table-form ul,
.table-form-cer ul {
  zoom: 1;
}
.clearfix::after,
.table-form ul::after,
.table-form-cer ul::after {
  display: block;
  content: '';
  overflow: hidden;
  clear: both;
}
.table-form ul li,
.table-form-cer ul li {
  height: 45px;
  line-height: 45px;
  text-align: center;
  border: 1px solid #e0e0e0;
}
.table-form ul li:nth-of-type(1),
.table-form ul li:nth-of-type(3) {
  float: left;
  width: 20%;
}
.table-form ul li:nth-of-type(2),
.table-form ul li:nth-of-type(4) {
  float: left;
  width: 30%;
}
.table-form-cer ul li:nth-of-type(1),
.table-form-cer ul li:nth-of-type(3) {
  float: left;
  width: 20%;
}
.table-form-cer ul li:nth-of-type(2),
.table-form-cer ul li:nth-of-type(4) {
  float: left;
  width: 30%;
}
.el-tabs__header {
  margin-bottom: 30px;
}
/* .el-tabs__content {
  overflow: auto;
} */
.el-pagination {
  padding: 10px 5px;
}
.look-people .look-tit {
  font-size: 18px;
  background: #5583fe;
  color: #fff;
  height: 50px;
  line-height: 50px;
  padding-left: 10px;
}

.job-position #vue-g6-editor {
  /*  position: fixed;
     top: 80px;
     left: 115px;
     right: 0;
     bottom: 0px;
     width: 100%;
     overflow-y: scroll;
     padding: 30px; */
  width: 100%;
  height: 100%;
  z-index: -1;
}

.text-Content {
  color: #5583fe;
  font-size: 14px;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
}
.text-Content::before {
  width: 6px;
  height: 6px;
  background: #d8d8d8;
  border-radius: 50%;
  margin: 0px 5px;
  display: inline-block;
  content: '';
  vertical-align: middle;
  cursor: pointer;
  margin-left: 15px;
}

/* .right-bottom canvas {
  height: 80% !important;
  position: relative;
  top: 0;
  right: 0;
} */
.panel-text {
  color: #333333;
  font-size: 14px;
  line-height: 30px;
  /* overflow: overlay; */
  overflow-y: auto;
  height: 25vh;
}
</style>
