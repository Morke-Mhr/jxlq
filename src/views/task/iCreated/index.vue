<template>
  <div class="app-container">
    <!-- 标签页 -->
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
      <el-tab-pane label="批量新增" name="added">
        <!-- 新增 -->
        <div class="app-container">
          <div class="sxForm" style="padding-right: 0">
            <el-button
              v-has="has.delete"
              @click="deleteTabledata"
              class="p15 blue"
              >批量删除
            </el-button>
            <el-button
              v-has="has.add"
              @click="addTask(1)"
              :loading="addloading"
              class="p15 blue"
              >仅保存
            </el-button>
            <el-button
              v-has="has.add"
              @click="addTask(2)"
              :loading="addloading"
              class="p15 blue"
              >保存并发送
            </el-button>
            <!-- <el-button  type="primary">导入</el-button> -->
            <el-button
              @click="addTabledata"
              icon="el-icon-plus"
              circle
              style="float: right"
            ></el-button>
          </div>
          <div class="sxTable">
            <!-- 任务表格 -->
            <el-table
              :data="tableData"
              style="width: 100%"
              tooltip-effect="light"
              height="calc(100vh - 380px)"
              @selection-change="handleSelectionChange"
              v-loading="loading"
              stripe
            >
              <!-- <el-table-column label="选择" width="60">
                              <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.choice"></el-checkbox>
                              </template>
                            </el-table-column> -->
              <el-table-column
                type="selection"
                width="55"
                align="center"
              ></el-table-column>
              <!-- 类型选择 -->
              <el-table-column label="类型" width="180" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.typeId" placeholder="请选择">
                    <el-option
                      v-for="item in optionsTypeId"
                      :label="item.dictLabel"
                      :key="item.dictCode"
                      :value="item.dictCode"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <!-- 名称 -->
              <el-table-column label="名称" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.name"
                    type="text"
                    maxlength="25"
                    show-word-limit
                    placeholder="请输入内容"
                    style="width: 85%"
                  ></el-input>
                </template>
              </el-table-column>
              <!-- 目标 -->
              <el-table-column label="目标" align="center">
                <template slot-scope="scope">
                  <el-input
                    type="text"
                    placeholder="请输入任务完成的目标(限35字)"
                    v-model="scope.row.content"
                    maxlength="35"
                    show-word-limit
                    style="width: 90%"
                  ></el-input>
                </template>
              </el-table-column>
              <!-- 说明/提示 -->
              <!-- <el-table-column label="说明/提示" >
                              <template slot-scope="scope">
                                <el-input v-model="scope.row.hintMessage"  type="text"  show-word-limit  maxlength="50" placeholder="请输入任务注意事项.相关经验等"></el-input>
                              </template>
                            </el-table-column> -->
              <!-- 权重 -->
              <!-- <el-table-column label="权重" width="150" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.priority" placeholder="请选择">
                    <el-option
                      v-for="item in optionspriority"
                      :label="item.label"
                      :key="item.value"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column> -->
              <!-- 责任人 -->
              <el-table-column label="责任人" width="150" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.responsibilityName"
                    readonly
                    @focus="respeople(true, 1, scope.$index)"
                    placeholder="选择责任人"
                  ></el-input>
                  <!-- <el-select
                                      v-model="scope.row.responsibilityName"
                                      value-key="userId"
                                      placeholder="请选择"
                                      @focus="respeople(true,1,scope.$index)"
                                    >
                                      <el-option
                                        v-for="item in optionsResponsibility"
                                        :label="item.userName"
                                        :key="item.userId"
                                        :value="item.userName"
                                      ></el-option>
                                    </el-select> -->
                </template>
              </el-table-column>
              <!-- 验收 -->
              <!-- <el-table-column label="验收" width="120">
                              <template slot-scope="scope">
                                <el-select v-model="scope.row.checkedFlag" placeholder="是/否">
                                  <el-option
                                    v-for="item in optionscheckedFlag"
                                    :label="item.label"
                                    :key="item.value"
                                    :value="item.value"
                                  ></el-option>
                                </el-select>
                              </template>
                            </el-table-column> -->
              <!-- 任务开始日期 -->
              <el-table-column label="开始时间" width="220" align="center">
                <template slot-scope="scope">
                  <el-date-picker
                        v-model="scope.row.startTime"
                        type="date"
						:picker-options='pickerStartTime'
						@focus='handleStartTime(scope.$index)'
                        placeholder="选择开始时间">
                      </el-date-picker>
                </template>
              </el-table-column>
			<!-- 任务截止日期 -->
			<el-table-column label="结束时间" width="220" align="center">
			  <template slot-scope="scope">
				<el-date-picker
					  v-model="scope.row.endTime"
					  type="date"
					  :picker-options='pickerEndTime'
					  @focus='handleEndTime(scope.$index)'
					  placeholder="选择结束时间">
					</el-date-picker>
			  </template>
			</el-table-column>
              <!-- 操作 -->
              <el-table-column
                label="操作"
                width="100"
                fixed="right"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button type="text" @click="getenclosure(scope.$index)"
                    >附件
                  </el-button>
                  <el-button
                    type="text"
                    v-has="has.detailed"
                    @click="editTabledata(scope.$index)"
                    >详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 编辑按钮  弹出层表单 -->
        <el-dialog
          title="任务编辑"
          :close-on-click-modal="false"
          custom-class="small"
          class="dialog"
          :visible.sync="dialogFormVisible"
        >
          <div class="tit">任务信息</div>

          <!-- <el-divider content-position="left">任务信息</el-divider> -->

          <el-form
            :rules="rules"
            ref="form"
            :model="form"
            class="tag"
            label-width="100px"
          >
            <!-- 类型 -->
            <el-form-item prop="typeId" label="任务类型">
              <el-select v-model="form.typeId" placeholder="请选择任务类型">
                <el-option
                  v-for="item in optionsTypeId"
                  :label="item.dictLabel"
                  :key="item.dictCode"
                  :value="item.dictCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- 任务名称 -->
            <el-form-item label="任务名称" prop="name">
              <el-input
                maxlength="25"
                type="textarea"
                :autosize="{ minRows: 3 }"
                show-word-limit
                v-model="form.name"
              ></el-input>
            </el-form-item>
            <!-- 任务目标 -->
            <el-form-item label="任务目标" prop="content">
              <el-input
                type="textarea"
                maxlength="35"
                :autosize="{ minRows: 3 }"
                show-word-limit
                v-model="form.content"
              ></el-input>
            </el-form-item>
            <!-- 提示 -->
            <el-form-item label="提示">
              <el-input
                type="textarea"
                maxlength="50"
                :autosize="{ minRows: 3 }"
                show-word-limit
                v-model="form.hintMessage"
              ></el-input>
            </el-form-item>
            <!-- 任务开始时间和结束时间 -->
            <el-row>
              <el-col :span="12">
                <el-form-item label="开始时间" prop="startTime">
				  <template slot-scope="scope">
                  <el-date-picker
                        v-model="form.startTime"
                        type="date"
						:picker-options='pickerStartTime'
						@focus='handleStartTime(UserIDIndex)'
                        placeholder="选择任务开始时间">
                   </el-date-picker>
				   </template>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结束时间" prop="endTime">
					<template slot-scope="scope">
					<el-date-picker
                        v-model="form.endTime"
                        type="date"
						:picker-options='pickerEndTime'
						@focus='handleEndTime(UserIDIndex)'
                        placeholder="选择任务结束时间">
                      </el-date-picker>
					</template>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 权重 -->
            <el-row>
              <el-col :span="12">
                <el-form-item label="权重">
                  <el-select v-model="form.priority" placeholder="请选择权重">
                    <el-option
                      v-for="item in optionspriority"
                      :label="item.label"
                      :key="item.value"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- 难度 -->
              <el-col :span="12">
                <el-form-item label="难度">
                  <el-select
                    v-model="form.difficultDegree"
                    placeholder="请选择难度"
                  >
                    <el-option
                      v-for="item in optionsdifficultDegree"
                      :label="item.label"
                      :key="item.value"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 责任人 -->
            <el-row>
              <el-col :span="12">
                <el-form-item label="责任人" prop="responsibility">
                  <el-input
                    v-model="form.responsibilityName"
                    readonly
                    @focus="respeople(true, 1)"
                    placeholder="选择责任人"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-divider content-position="left">其他信息</el-divider> -->
            <div class="tit">其他信息</div>
            <!-- 协同人 -->
            <el-row>
              <el-col :span="12">
                <el-form-item label="协同人">
                  <el-select
                    no-data-text=" "
                    v-model="form.coordinationName"
                    @focus="respeople(false, 2, undefined, true)"
                    value-key="userId"
                    multiple
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in optionsCoordination"
                      :label="item"
                      :key="index"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- 抄送人 -->
              <el-col :span="12">
                <el-form-item label="抄送人">
                  <el-select
                    no-data-text=" "
                    v-model="form.transcriptionName"
                    @focus="respeople(false, 3, undefined, true)"
                    multiple
                    value-key="userId"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in optionsTranscription"
                      :label="item"
                      :key="index"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="13">
                <!-- 任务附件 -->
                <el-form-item label="任务附件">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    multiple
                    :limit="6"
                    :action="fileUrl"
                    :file-list="fileList"
                    :on-success="handleSuccess"
                    :on-error="handleError"
                    :on-remove="handleDelete"
                  >
                    <el-button slot="trigger" class="p15">选取附件 </el-button>
                    <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
                    <p slot="tip" class="el-upload__tip">
                      最多只能上传六个附件
                    </p>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <!-- 照片 -->
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="处理需要图片">
                      <el-switch
                        v-model="form.finishRequiredImgFlag"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                </el-row>

                <!-- 附件 -->
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="处理需要文件">
                      <el-switch
                        v-model="form.finishRequiredAttachedFileFlag"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                </el-row>

                <!-- 验收 -->
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="处理需要验收">
                      <el-switch
                        v-model="form.checkedFlag"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <el-row class="zhus">
                            <el-col :span="24">
                                *注：图片为png、jpg后缀的，文件为doc、xls、zip等后缀的
                            </el-col>
                        </el-row> -->
            <el-divider></el-divider>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button class="fBtn" @click="dialogFormVisible = false"
              >取 消</el-button
            >
            <el-button class="tBtn" @click="formSubmit('form')">确定</el-button>
          </span>
        </el-dialog>
        <sdialog
          ref="sdialog"
          @choiceUser="choiceUser"
          :showclose="true"
          :isDx="isDX"
          :isCheckbox="isCheckbox"
          :sNeed="sNeed"
          needData="zrUser"
          dxId="zrUserId"
          :transferProps="{
            key: 'userId',
            label: 'realName',
          }"
          :treedata="treedata"
        ></sdialog>
        <!-- 查看附件弹出层 -->
        <el-dialog
          title="附件"
          :visible.sync="getenclosures"
          :close-on-click-modal="false"
          custom-class="small"
        >
          <el-table
            :data="getgetenclosurelist"
            stripe
            height="calc(100vh - 380px)"
            style="width: 100%"
          >
            <el-table-column prop="name" label="附件名称"></el-table-column>
            <el-table-column label="附件大小">
              <template slot-scope="scope">
                <p>{{ scope.row.size ? scope.row.size / 1000 + " KB" : "" }}</p>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="text" @click="downloads(scope.$index)"
                  >下载
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button class="fBtn" @click="getenclosures = false"
              >关闭</el-button
            >
          </span>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="我发起的" name="launch">
        <launch ref="launch"></launch>
      </el-tab-pane>
      <el-tab-pane label="我分解的" name="decompose">
        <decompose ref="decompose"></decompose>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import launch from "./launch"; //我发起的子组件
import decompose from "./decompose"; //我分解的子组件
import { addtask } from "@/api/task/iCreated/index"; //新增任务接口
import { puttask } from "@/api/task/iCreated/index"; //修改任务接口
import { gettask } from "@/api/task/iCreated/index"; //查询任务接口
import { deleteTaskId } from "@/api/task/iCreated/index"; //根据ID删除任务的信息
import Sdialog from "@/components/selectDialog"; //通过部门选择人
import { getTreeSelect } from "@/api/system/process"; // 部门列表
import { getSelectType, getTreeDeptByLogin } from "@/api/task/iCreated/index"; //字典

export default {
  name: "index",
  components: {
    launch: launch,
    decompose: decompose,
    Sdialog: Sdialog,
  },
  watch: {
    $route: {
      handler(val, oldval) {
        console.log(val, 222); //新路由信息
        console.log(oldval); //老路由信息
      },
      // 深度观察监听
      deep: true,
    },
  },
  data() {
    return {
      has: {
        delete: "task:task:remove", //删除
        add: "task:task:add", //新增
        detailed: "task:task:query", //查询详细信息
      },
	  timeIndex:0,
      loading: false,
      addloading: false,
      getenclosures: false, //查看附件
      getgetenclosurelist: [],
      treedata: [], //部门树形
      isDX: false, //是否多选
      isCheckbox: false, //是否复选
      sNeed: true, //是否返回值
      UserIDIndex: 0, //责任人表单index
      fileUrl: "", //文件上传地址
      activeName: "added", //当前标签页
      fileList: [],
      // tableData:[{choice:false,typeId:"",name:"",content:"",hintMessage:"",priority:"",responsibility:"",checkedFlag:false,costTime:''}],    //新增数组
      // 选中		类型		名称			目标		说明/提示		权重				责任人				验收			时长
      tableData: [
        {
          subId: 0,
          priority: 1,
          difficultDegree: 1,
          checkedFlag: false,
          costTimeUnit: 0,
          hintMessage: "无",
          costTime: "",
        },
        {
          subId: 1,
          priority: 1,
          difficultDegree: 1,
          checkedFlag: false,
          costTimeUnit: 0,
          hintMessage: "无",
          costTime: "",
        },
        {
          subId: 2,
          priority: 1,
          difficultDegree: 1,
          checkedFlag: false,
          costTimeUnit: 0,
          hintMessage: "无",
          costTime: "",
        },
        {
          subId: 3,
          priority: 1,
          difficultDegree: 1,
          checkedFlag: false,
          costTimeUnit: 0,
          hintMessage: "无",
          costTime: "",
        },
        {
          subId: 4,
          priority: 1,
          difficultDegree: 1,
          checkedFlag: false,
          costTimeUnit: 0,
          hintMessage: "无",
          costTime: "",
        },
        {
          subId: 5,
          priority: 1,
          difficultDegree: 1,
          checkedFlag: false,
          costTimeUnit: 0,
          hintMessage: "无",
          costTime: "",
        },
        {
          subId: 6,
          priority: 1,
          difficultDegree: 1,
          checkedFlag: false,
          costTimeUnit: 0,
          hintMessage: "无",
          costTime: "",
        },
        {
          subId: 7,
          priority: 1,
          difficultDegree: 1,
          checkedFlag: false,
          costTimeUnit: 0,
          hintMessage: "无",
          costTime: "",
        },
        {
          subId: 8,
          priority: 1,
          difficultDegree: 1,
          checkedFlag: false,
          costTimeUnit: 0,
          hintMessage: "无",
          costTime: "",
        },
        {
          subId: 9,
          priority: 1,
          difficultDegree: 1,
          checkedFlag: false,
          costTimeUnit: 0,
          hintMessage: "无",
          costTime: "",
        },
      ], //新增数组
      pickerStartTime:{
			 disabledDate:time=>{
				 const startTime = this.tableData[this.timeIndex].startTime?this.tableData[this.timeIndex].startTime:''
				 const endTime = this.tableData[this.timeIndex].endTime?this.tableData[this.timeIndex].endTime:''
				 if(endTime){
					 return time.getTime()>endTime.getTime()||time.getTime() < Date.now()-1*24*60*60*1000
				 }
				if(!startTime||(!endTime&&startTime)){
					return time.getTime() < Date.now()-1*24*60*60*1000;
				}
			 }
		},
		pickerEndTime:{
			 disabledDate:time=>{
				const startTime = this.tableData[this.timeIndex].startTime?this.tableData[this.timeIndex].startTime:''
				if(startTime){
					 return time.getTime()<startTime.getTime()
				}
				return time.getTime() < Date.now()-1*24*60*60*1000;
			 }
		},
	  subId: 10,
      optionsTypeId: [
        //类型选择 ？
      ],
      optionspriority: [
        //权重选择
        { label: "一级", value: 1 },
        { label: "二级", value: 2 },
        { label: "三级", value: 3 },
      ],
      optionsResponsibility: [], //责任人选择
      optionscheckedFlag: [
        //验收选择
        { label: "是", value: true },
        { label: "否", value: false },
      ],
      // optionscostTime: [
      //   //时长选择
      //   { label: "1", value: 1 },
      //   { label: "3", value: 3 },
      //   { label: "5", value: 5 },
      //   { label: "10", value: 10 },
      //   { label: "15", value: 15 },
      //   { label: "30", value: 30 },
      // ],
      optionsCoordination: [
        //协同人选择
      ],
      optionsTranscription: [
        //抄送人选择
      ],
      // 时间单位
      optionscostTimeUnit: [
        { label: "天", value: 0 },
        { label: "小时", value: 1 },
        { label: "月", value: 2 },
      ],
      optionsdifficultDegree: [
        //难度选择
        { label: "简单", value: 1 },
        { label: "一般", value: 2 },
        { label: "较难", value: 3 },
        { label: "很难", value: 4 },
      ],
      dialogFormVisible: false, //表单弹出层
      form: {}, //表单内容
      multipleSelection: [],
      multipleSelectionIndex: [],
      rules: {
        //表单验证
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: ["blur", "change"],
          }, //名称
        ],
        typeId: [
          { required: true, message: "请选择类型", trigger: "change" }, //类型
        ],
        content: [
          {
            required: true,
            message: "请输入目标",
            trigger: ["blur", "change"],
          }, //目标
          {
            min: 0,
            max: 35,
            message: "长度在 0 到 35 个字符",
            trigger: ["blur", "change"],
          },
        ],
        // hintMessage: [
        //   {
        //     required: true,
        //     message: "请输入说明提示",
        //     trigger: ["blur", "change"]
        //   } //说明提示
        // ],
        // priority: [
        //   { required: true, message: "请选择权重", trigger: "change" } //权重
        // ],
        responsibility: [
          { required: true, message: "请选择负责人", trigger: "change" }, //负责人
        ],
        startTime: [
          { required: true, message: "请输入开始时间", trigger: "blur" }, //任务开始时间
        ],
		endTime: [
		  { required: true, message: "请输入结束时间", trigger: "blur" }, //任务结束时间
		],
        // costTimeUnit: [
        //   { required: true, message: "请选择时长单位", trigger: "change" } //时长单位
        // ],
        // checkedFlag: [
        //   { required: true, message: "请选择是否验收", trigger: "change" } //是否
        // ],
        // coordination: [
        //   {
        //     type: "array",
        //     required: true,
        //     message: "请至少选择一个协同人",
        //     trigger: "change"
        //   } //协同人
        // ],
        // transcription: [
        //   {
        //     type: "array",
        //     required: true,
        //     message: "请至少选择一个抄送人",
        //     trigger: "change"
        //   } //抄送人
        // ],
        // difficultDegree: [
        //   { required: true, message: "请选择难度", trigger: "change" } //难度
        // ]
      },
    };
  },

  // 页面销毁
  destroyed() {
    console.log("ymxh");
    setTimeout(() => {
      let pathHeader = sessionStorage.getItem("pathHeader");
      if (pathHeader == "/task") {
        return;
      }
      let addTask = this.tableData.filter(
        (item) => !item.hasOwnProperty("taskId")
      );
      sessionStorage.setItem("addTask", JSON.stringify(addTask));
    }, 600);
  },
  created() {
    //文件上传地址
    this.fileUrl = this.$store.state.apiConfiguration.fileUrl + "/fs/upload";
    this.getTask();
    this.$store.state.tabActive = "iCreated";
  },
  methods: {
    async getTask() {
      this.loading = true;
      this.subId = 10;
      //查找仅保存任务
      let params = {
        operateType: "temp",
        isInitiate: "0", //查询没有父任务ID的
        pageNum: "",
        pageSize: "",
      };
      const res = await gettask(params);

      for (let item of res.rows) {
        item.responsibility = item.taskUserList.filter(
          (obj) => obj.userType === 1
        )[0]; //责任人
        item.coordination = item.taskUserList.filter(
          (obj) => obj.userType === 2
        ); //协同人
        item.transcription = item.taskUserList.filter(
          (obj) => obj.userType === 3
        ); //抄送人
        item.checkedFlag = item.checkedFlag == 1 ? true : false; //是否验收
        item.finishRequiredAttachedFileFlag =
          item.finishRequiredAttachedFileFlag == 1 ? true : false; //是否文件
        item.finishRequiredImgFlag =
          item.finishRequiredImgFlag == 1 ? true : false; //是否照片
      }
      let lastname = JSON.parse(sessionStorage.getItem("addTask"));
      this.optionsTypeId = await getSelectType("task_Type");

      if (lastname === null && res.rows.length == 0) {
        this.loading = false;
        return;
      }
      if (lastname === null) {
        lastname = [];
      }
      if (JSON.stringify(lastname) !== "[{ subId: 0 }]") {
        res.rows = res.rows.concat(lastname);
      }
      if (!res.rows.length == 0) {
        this.tableData = res.rows;
      }
      for (let v of this.tableData) {
        v.subId = this.subId++;
      }
      console.log(this.tableData);

      // 回显责任人 审批人 负责人
      let transcription = [];
      let coordination = [];
      // let responsibility = [];
      for (let v of this.tableData) {
        if (!(typeof v.transcription == "undefined")) {
          let transcriptionName = [];
          for (let t of v.transcription) {
            transcriptionName.push(t.userName);
          }
          v.transcriptionName = transcriptionName;
        }
        if (!(typeof v.coordination == "undefined")) {
          let coordinationName = [];
          for (let t of v.coordination) {
            coordinationName.push(t.userName);
          }
          v.coordinationName = coordinationName;
        }
        if (!(typeof v.responsibility == "undefined")) {
          v.responsibilityName = v.responsibility.userName;
        }
      }
      // this.optionsCoordination = coordination;
      // this.optionsTranscription = transcription;
      this.loading = false;
    },
    handleClick(tab, event) {
      //切换标签页触发
      if (tab.name == "added") {
        this.getTask();
      }
      if (tab.name == "launch") {
        this.$refs.launch.getTask();
      }
      if (tab.name == "decompose") {
        this.$refs.decompose.getTask();
      }
    },

    //全选
    handleSelectionChange(val) {
      let t = [];
      val.forEach((val, index) => {
        this.tableData.forEach((v, i) => {
          //  subId是每一行的数据subId
          if (val.subId == v.subId) {
            t.push(i);
          }
        });
      });
      this.multipleSelectionIndex = t;
      console.log(t, this.tableData);
      this.multipleSelection = val;
    },
    // 选择责任人
    respeople(isDX, people, index, isCheckbox) {
      //isDX：是否单选 true false people：选择的是什么人 1 责任人 2协同人 3抄送人 index：在 tableData中的下标
      this.showSdialog(people);
      this.isDX = isDX;
      if (isCheckbox) {
        this.isCheckbox = isCheckbox;
      } else {
        this.isCheckbox = false;
      }
      this.UserIDpeople = people;
      if (index === undefined) {
        return;
      }
      this.UserIDIndex = index;
    },
    async showSdialog(v) {
      // 树形结构 如果是抄送人 更改部门树请求
      if (v == 3) {
        this.treedata = await getTreeDeptByLogin();
      } else {
        this.treedata = await getTreeSelect();
      }
      this.sNeed = true;
      this.$refs.sdialog.isShow = true;
    },
    choiceUser(UserID, UserObject) {
      // 子组件 选择部门人 完成后调用的事件
      if (this.UserIDpeople == 1) {
        if (UserID.length == 0) {
          this.$message({
            message: "请选择人员",
            type: "warning",
          });
          return;
        }
      }

      UserObject = JSON.parse(
        JSON.stringify(UserObject).replace(/realName/g, "userName")
      );
      for (let item of UserObject) {
        item.userType = this.UserIDpeople;
      }
      let people = "";
      let peopleSelect = "";
      if (this.UserIDpeople == 1) {
        // people = "optionsResponsibility";
        peopleSelect = "responsibility";
      } else if (this.UserIDpeople == 2) {
        // people = "optionsCoordination";
        peopleSelect = "coordination";
      } else {
        // people = "optionsTranscription";
        peopleSelect = "transcription";
      }
      // this[people] = UserObject;
      if (this.isDX) {
        this.$set(
          this.tableData[this.UserIDIndex],
          [peopleSelect],
          UserObject[0]
        );
        this.$set(
          this.tableData[this.UserIDIndex],
          [peopleSelect + "Name"],
          UserObject[0].userName
        );
        console.log(UserObject[0].userName, 999);
        // this.tableData = JSON.parse(JSON.stringify(this.tableData))
      } else {
        this.$set(this.tableData[this.UserIDIndex], [peopleSelect], UserObject);
        let name = [];
        for (let v of UserObject) {
          name.push(v.userName);
        }
        this.$set(
          this.tableData[this.UserIDIndex],
          [peopleSelect + "Name"],
          name
        );
      }
      console.log(this.tableData);
      this.$forceUpdate();
      this.$refs.sdialog.isShow = false;
    },
    addTabledata() {
      const v = {
        subId: this.subId++,
        priority: 1,
        difficultDegree: 1,
        checkedFlag: false,
        costTimeUnit: 0,
        hintMessage: "无",
        costTime: "",
      };
      this.tableData.push(v);
    },
    async deleteTabledata() {
      //删除数组按钮
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "请选择要删除的任务",
          type: "warning",
        });
        return;
      }
      this.$confirm("是否确定删除已选中任务", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let tempTask = this.multipleSelection.filter((obj) =>
            obj.hasOwnProperty("taskId")
          ); //在所有选中删除数组里找  仅保存的
          //在所有选中删除数组里找  仅保存的
          this.multipleSelectionIndex
            .sort(function (a, b) {
              return a - b;
            })
            .reverse(); //将已选中数组在原数组下标排序并倒序
          for (let i of this.multipleSelectionIndex) {
            //逆向循环
            this.tableData.splice(i, 1);
          }
          if (tempTask.length == 0) {
            this.$message({
              message: "删除成功！",
              type: "success",
            });
          }
          // this.tableData = this.tableData.filter(item => item.choice === false); //筛选choice为true的
          let v = [];
          for (let item of tempTask) {
            v.push(item.taskId);
          }
          if (v.length != 0) {
            const res = await deleteTaskId(v); //找到所有选中删除  仅保存的Id 发送删除请求
            this.$message({
              message: res,
              type: "success",
            });
            this.getTask();
            let addTask = this.tableData.filter(
              (item) => !item.hasOwnProperty("taskId")
            );
            sessionStorage.setItem("addTask", JSON.stringify(addTask));
          }
        })
        .catch(() => {
          return;
        });
    },

    handleSuccess(response, file, fileList) {
      //文件上传成功的回调
      console.log(response, fileList);
      if (fileList.length > 6) {
        this.$message({
          message: "最多只能上传六个附件",
          type: "warning",
        });
        this.fileList = this.fileList.slice(0, 6);
        console.log(this.form);
        return;
      }
      if (response.code != 200) {
        //判断当前文件是否上传失败
        this.$message({
          message: "附件上传失败," + response.message,
          type: "warning",
        });
        this.fileList = [];
        return;
      }
      let v = [];
      for (let item of fileList) {
        let t = {};
        if (item.hasOwnProperty("response")) {
          let type = item.response.body.fileName.split(".").slice(-1); //type  文件格式 ：png doc 。。。
          console.log(type);
          if (type == "jpg" || type == "png") {
            t.type = 1;
          } else if (type == "mp3") {
            t.type = 2;
          } else if (type == "mp4") {
            t.type = 3;
          } else {
            t.type = 4;
          }
          t.name = item.response.body.fileName;
          t.path = item.response.body.url;
          t.size = item.size;
          t.executeFlag = "1";
        } else {
          t = item;
        }
        v.push(t);
      }
      if (typeof this.form.taskFileList == "undefined") {
        this.form.taskFileList = [];
      }
      this.$refs.upload.clearFiles();
      this.form.taskFileList = v; //上传成功，将返回结果保存到当前对象表单
      this.fileList = v;
      console.log(this.form);
    },
	handleStartTime(index){
		console.log(index)
		this.timeIndex = index
	},
	handleEndTime(index){
		this.timeIndex = index
	},
    handleError(err, file, fileList) {
      //文件上传失败的回调
      console.log(err, file);
    },
    handleDelete(file, fileList) {
      //从已上传文件删除文件回调
      console.log(fileList);
      this.form.taskFileList = fileList; //删除成功，将返回结果保存到当前对象表单
      this.fileList = fileList;
    },
    // 查看附件
    getenclosure(index) {
      if (
        typeof this.tableData[index].taskFileList == "undefined" ||
        this.tableData[index].taskFileList.length == 0
      ) {
        this.$message({
          message: "该任务暂未上传附件",
          type: "warning",
        });
        return;
      }
      this.getenclosures = true;
      this.getgetenclosurelist = this.tableData[index].taskFileList;
    },
    // 点击下载附件
    downloads(index) {
      let download = this.$store.state.apiConfiguration.url; //下载地址
      let fileDowloadName =
        download +
        `fs/download?name=${encodeURI(
          encodeURI(this.getgetenclosurelist[index].name)
        )}&path=${this.getgetenclosurelist[index].path}`;
      location.href = fileDowloadName;
    },
    editTabledata(v) {
      //编辑按钮
      this.dialogFormVisible = true;
      this.form = this.tableData[v]; // v:tableData对应选中的下标
      this.fileList = this.form.taskFileList;
      this.UserIDIndex = v;
      // this.$refs["form"].resetFields();
    },
    formSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //   this.addTask(1);       单独提交
          this.dialogFormVisible = false;
          console.log(this.form);
          // this.$refs[formName].resetFields();
        } else {
          this.$message({
            message: "请填写完整任务信息",
            type: "warning",
          });
          return false;
        }
      });
    },
    async addTask(status) {
      let listTable = [];
      // status 1：仅保存 2;保存并发送
      //  this.tableData.filter(item => item.choice === true) 已选中任务
      if (this.multipleSelection.length == 0) {
        //判断有无选中任务 true:选中
        this.$message({
          message: "请选择要提交的任务",
          type: "warning",
        });
        return;
      } else {
        for (let item of this.multipleSelection) {
          if (Object.getOwnPropertyNames(item).length < 13) {
            //判断每个任务属性是否为空      填写后清空无法识别
            this.$message({
              message: "请填写完整任务信息",
              type: "warning",
            });
            return;
          }
          if (!item.typeId) {
				this.$message({
				  message: "请选择任务类型",
				  type: "warning",
				});
				return;
			  }
			if (!item.name) {
			  this.$message({
				message: "请填写任务名称",
				type: "warning",
			  });
			  return;
			}
		  if (!item.content) {
			this.$message({
			  message: "请输入目标",
			  type: "warning",
			});
			return;
		  }
		  if (!item.responsibility) {
			this.$message({
			  message: "请选择负责人",
			  type: "warning",
			});
			return;
		  }
		  if (!item.startTime) {
			this.$message({
			  message: "请输入开始时间",
			  type: "warning",
			});
			return;
		  }
		  if (!item.endTime) {
			this.$message({
			  message: "请输入结束时间",
			  type: "warning",
			});
			return;
		  }
        }
        listTable = this.multipleSelection;
      }
      this.addloading = true;
      let v = [];
      for (let item of listTable) {
        let taskList = {};
        taskList = JSON.parse(JSON.stringify(item)); //不影响原数据
        delete taskList.subId;
        taskList.checkedFlag = taskList.checkedFlag ? 1 : 0; //是否验收
        taskList.finishRequiredAttachedFileFlag = taskList.finishRequiredAttachedFileFlag
          ? 1
          : 0; //是否文件
        taskList.finishRequiredImgFlag = taskList.finishRequiredImgFlag ? 1 : 0; //是否照片
        // taskList.costTime = parseInt(taskList.costTime); //任务时长
        // taskList.costTimeUnit = 0; //时长单位 暂时
        taskList.createById = this.$store.getters.userId;
        taskList.status = status; //保存类型
        // for (let item of taskList.coordination) {
        //   //协同人
        //   item.userType = 2;
        // }
        // for (let item of taskList.transcription) {
        //   //抄送人
        //   item.userType = 3;
        // }
        // taskList.responsibility.userType = 1; //责任人
        if (!taskList.hasOwnProperty("coordination")) {
          taskList.coordination = [];
        }
        if (!taskList.hasOwnProperty("transcription")) {
          taskList.transcription = [];
        }
        let taskUserList = taskList.coordination.concat(taskList.transcription); //合并抄送人协同人数组
        taskUserList.push(taskList.responsibility); //加上责任人 对象 {}
        taskList.taskUserList = taskUserList;
        if (taskList.hintMessage == "") {
          taskList.hintMessage = "无";
        }
        delete taskList.transcription; //删除多余的数据
        delete taskList.responsibility;
        delete taskList.coordination;
        delete taskList.transcriptionName; //删除多余的数据
        delete taskList.responsibilityName;
        delete taskList.coordinationName;
        v.push(taskList);
      }
      console.log(v, "结果");

      let res = await addtask(v); //提交
      this.$message({
        message: res,
        type: "success",
      });
      this.addloading = false;
      this.getTask();
      this.dialogFormVisible = false;
      //在所有选中删除数组里找  仅保存的
      this.multipleSelectionIndex
        .sort(function (a, b) {
          return a - b;
        })
        .reverse(); //将已选中数组在原数组下标排序并倒序
      for (let i of this.multipleSelectionIndex) {
        //逆向循环
        this.tableData.splice(i, 1);
      }
      let addTask = this.tableData.filter(
        (item) => !item.hasOwnProperty("taskId")
      );
      sessionStorage.setItem("addTask", JSON.stringify(addTask));
      // this.tableData = this.tableData.filter(item => item.choice === false); //提交完成的去掉
    },
  },
};
</script>

<style lang="scss" scoped>
// 按钮
.oprate-btn {
  text-align: right;
}

.form-submit {
  text-align: right;
}

.tag /deep/ {
  //修改element组件样式  但只作用于当前页面
  .el-tag .el-icon-close {
    display: none;
  }
}
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  appearance: none !important;
}

.tit {
  font-size: 18px;
  height: 50px;
  line-height: 50px;
  color: #333;
  padding-left: 15px;
  border-bottom: 1px solid #d7d7d7;
  margin-bottom: 20px;
}

.el-divider--horizontal:last-of-type {
  margin: 0px;
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

.zhus {
  font-size: 12px;
  color: #797979;
}
</style>
