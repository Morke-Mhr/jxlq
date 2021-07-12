<template>
  <div class="handle-decompose">
    <el-tag effect="dark">父级任务</el-tag>
    <el-table
      :data="[...task]"
      style="width: 100%; margin-top: 1rem; margin-bottom: 2rem"
	  tooltip-effect="light"
      stripe
    >
      <el-table-column
        prop="name"
        label="任务名称"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="content"
        label="任务目标"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="hintMessage"
        label="任务说明"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="发起人" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.createBy }}发起</template>
      </el-table-column>
	  <el-table-column label="开始时间" show-overflow-tooltip>
	    <template slot-scope="scope">{{ scope.row.startTime }}</template>
	  </el-table-column>
      <el-table-column label="结束时间" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.endTime }}</template>
      </el-table-column>
      <el-table-column label="任务类型" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.typeName }}</template>
      </el-table-column>
      <!-- <el-table-column label="任务权重" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.priority }}级权重</template>
      </el-table-column> -->
      <el-table-column label="任务难度" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.difficultDegree | difficulty }}
        </template>
      </el-table-column>
    </el-table>

    <!-- <el-row type="flex" align="middle" :gutter="20" class="task-handle-decompose-row">
      <el-col :span="3">{{task.name}}</el-col>
      <el-col :span="6">{{task.content}}</el-col>
      <el-col :span="6">{{task.hintMessage}}</el-col>
      <el-col :span="3">{{task.createBy}}发起</el-col>
      <el-col :span="2">{{task.costTime}}{{task.costTimeUnit | costTimeUnit}}后到期</el-col>
      <el-col :span="3">
        任务类型
        <el-tag effect="dark">{{task.typeName}}</el-tag>
        <el-tag type="danger">{{task.priority}} 级权重</el-tag>
        <el-tag type="success">{{task.difficultDegree |difficulty}}</el-tag>
      </el-col>
    </el-row>-->

    <el-row>
      <el-col :span="14">
        <el-tag effect="dark">子级任务</el-tag>
      </el-col>
      <el-col :span="10" class="task-handle-decompose-flexRight">
        <el-button
          class="bottom-top-mag table-add-btn blue"
          @click="deleteTabledata"
          >批量删除</el-button
        >
        <el-upload
          class="upload-demo inline-block bottom-top-mag"
          :action="fileUrl"
          ref="upload"
          :on-success="handleSuccessBatch"
          :on-error="handleErrorBatch"
          multiple
          :limit="6"
          :show-file-list="false"
        >
          <el-button class="bottom-top-mag table-add-btn blue"
            >批量上传附件</el-button
          >
        </el-upload>
        <el-button
          v-has="has.add"
          class="bottom-top-mag table-add-btn blue"
          @click="savesend(2)"
          >保存并发送</el-button
        >
        <el-button
          v-has="has.add"
          class="bottom-top-mag table-add-btn blue"
          style="margin-left: 0px"
          @click="savesend(1)"
          >仅保存</el-button
        >
      </el-col>
    </el-row>
    <div style="margin-top: 1rem"></div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="light"
      style="width: 100%"
      height="calc(100vh - 485px)"
      :row-class-name="tableRowClassName"
      @row-click="clickline"
      @selection-change="handleSelectionChange"
      stripe
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      ></el-table-column>
      <!-- 类型选择 -->
      <el-table-column label="类型" width="150" align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.typeId" placeholder="请选择">
            <el-option
              v-for="item in dictionaries.typeType"
              :label="item.dictLabel"
              :key="item.dictCode"
              :value="item.dictCode"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <!-- 名称 -->
      <el-table-column label="名称" width="150" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.name"
            type="text"
            maxlength="25"
            show-word-limit
            placeholder="请输入内容"
          ></el-input>
        </template>
      </el-table-column>
      <!-- 目标 -->
      <el-table-column
        label="目标"
        width="300"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="scope">
          <el-input
            type="text"
            placeholder="请输入任务完成的目标(限35字)"
            v-model="scope.row.content"
            maxlength="35"
            show-word-limit
          ></el-input>
        </template>
      </el-table-column>
      <!-- 说明/提示 -->
      <el-table-column label="说明/提示" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.hintMessage"
            type="text"
            maxlength="50"
            show-word-limit
            placeholder="请输入任务注意事项.相关经验等"
          ></el-input>
        </template>
      </el-table-column>
      <!-- 权重 -->
      <!-- <el-table-column label="权重" width="120" align="center">
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
            @focus="respeople(scope.$index)"
            placeholder="选择责任人"
          ></el-input>
          <!-- <el-select
            v-model="scope.row.responsibility"
            value-key="userId"
            @focus="respeople(scope.$index)"
            placeholder="请选择"
          >
            <el-option
              v-for="(item,index) in  optionalResponsibility"
              :label="item.userName ? item.userName:item.realName"
              :key="index"
              :value="item"
            ></el-option>
          </el-select>-->
        </template>
      </el-table-column>
      <!-- 验收 -->
      <el-table-column label="验收" width="120" align="center">
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
      </el-table-column>
      <!-- 时长 -->
      <!-- <el-table-column label="时长" width="120" align="center">
        <template slot-scope="scope">
          <el-input
            @mousewheel.native.prevent
            oninput="if(value.length>3)value=value.slice(0,3)"
            type="number"
            v-model.number="scope.row.costTime"
            placeholder="请输入(限3位数)"
          ></el-input>

           <el-select v-model="scope.row.costTime" placeholder="请选择">
             <el-option
              v-for="item in optionscostTime"
              :label="item.label"
              :key="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column> -->
	  <!-- 任务开始日期 -->
	          <el-table-column label="开始时间" width="210" align="center">
	            <template slot-scope="scope">
	              <el-date-picker
	                    v-model="scope.row.startTime"
	                    type="date"
	                    placeholder="选择开始时间">
	                  </el-date-picker>
	            </template>
	          </el-table-column>
	  <!-- 任务截止日期 -->
	  <el-table-column label="结束时间" width="210" align="center">
	    <template slot-scope="scope">
	  	<el-date-picker
	  		  v-model="scope.row.endTime"
	  		  type="date"
	  		  placeholder="选择结束时间">
	  		</el-date-picker>
	    </template>
	  </el-table-column>
      <!-- 时长单位 -->
      <!-- <el-table-column label="时长单位" width="120" align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.costTimeUnit" placeholder="请选择">
            <el-option
              v-for="item in optionscostTimeUnit"
              :label="item.label"
              :key="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column> -->
      <!-- 操作 -->
      <el-table-column
        label="操作"
        width="80"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="scope">
          <el-upload
            class="upload-demo"
            :action="fileUrl"
            :on-preview="handlePreview"
            :on-success="handleSuccess"
            :on-error="handleError"
            multiple
            :limit="6"
            :file-list="scope.row.taskFileList"
            :on-remove="handleDelete"
          >
            <el-button
              size="small"
              type="text"
              @click="tableDatafileindex = scope.$index"
              >点击上传</el-button
            >
          </el-upload>
        </template>
      </el-table-column>
    </el-table>
    <!-- 选择责任人 -->
    <sdialog
      ref="sdialog"
      @choiceUser="choiceUser"
      :showclose="true"
      :isDx="true"
      :sNeed="true"
      needData="zrUser"
      :transferProps="{
        key: 'userId',
        label: 'realName',
      }"
      dxId="zrUserId"
      :treedata="treedata"
    ></sdialog>
    <!-- 子任务设置 -->
    <el-dialog
      title="子任务设置"
      :visible.sync="dialogSubtaskSettings"
      custom-class="small"
      class="dialog"
      append-to-body
      :close-on-click-modal="false"
    >
      <h2>在发送任务前面请确定子级任务的以下相关设置</h2>
      <el-form
        label-position="top"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item
          label="在查看子级任务时是否可以查看父级任务信息"
          prop="getFatherTaskInformation"
        >
          <el-radio-group v-model="ruleForm.getFatherTaskInformation">
            <el-radio label="1">可查看</el-radio>
            <el-radio label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="在查看子级任务时是否可以下载父级任务附件"
          prop="downloadFatherTaskEnclosure"
        >
          <el-radio-group v-model="ruleForm.downloadFatherTaskEnclosure">
            <el-radio label="1">可下载</el-radio>
            <el-radio label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item>
          <el-divider></el-divider>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="tBtn" @click="onSubmit('ruleForm')">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { addtask } from "@/api/task/iCreated/index"; //新增任务接口
import Sdialog from "@/components/selectDialog"; //通过部门选择人
import { getTreeSelect } from "@/api/system/process"; // 部门列表
import { gettask } from "@/api/task/iCreated/index"; //查询任务接口
import { deleteTaskId } from "@/api/task/iCreated/index"; //根据ID删除任务的信息
import { number } from "echarts/lib/export";

export default {
  components: {
    Sdialog: Sdialog,
  },
  props: {
    task: {
      type: Object,
      default: {},
    },
    dictionaries: {
      type: Object,
      default: {},
    },
  },
  filters: {
    costTimeUnit: function (value) {
      //时长单位
      if (value == 0) {
        return "天";
      } else if (value == 1) {
        return "小时";
      } else if (value == 2) {
        return "月";
      }
    },
    difficulty: function (value) {
      //难度
      if (value == 1) {
        return "简单";
      } else if (value == 2) {
        return "一般";
      } else if (value == 3) {
        return "较难";
      } else if (value == 4) {
        return "很难";
      }
    },
  },
  data() {
    return {
      has: {
        add: "task:task:add",
      },
      tableData: [{ subId: 0, costTime: "" }],
      multipleSelection: [], //已选中数组
      multipleSelectionIndex: [], //已选中数组在原数组的下标
      fileUrl: "", //文件上传地址
      tableDatafileindex: 0, //上传文件当前对象
      subId: 1,
      batchFileList: [], //批量上传列表
      optionspriority: [
        //权重选择
        { label: "一级", value: 1 },
        { label: "二级", value: 2 },
        { label: "三级", value: 3 },
      ],
      optionalResponsibility: [
        //责任人选择
      ],
      optionscheckedFlag: [
        //验收选择
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      // 时间单位
      optionscostTimeUnit: [
        { label: "天", value: 0 },
        { label: "小时", value: 1 },
        { label: "月", value: 2 },
      ],
      treedata: [], //部门树形
      responsibilityID: "",
      dialogSubtaskSettings: false,
      ruleForm: {}, //子任务选项
      thindex: 0,
      rules: {
        getFatherTaskInformation: [
          { required: true, message: "请选择是否可查看", trigger: "change" },
        ],
        downloadFatherTaskEnclosure: [
          { required: true, message: "请选择是否可下载", trigger: "change" },
        ],
      },
    };
  },
  created() {
    console.log(this.task);
    this.loading = true;
    //文件上传地址
    this.fileUrl = this.$store.state.apiConfiguration.fileUrl + "/fs/upload";
    this.task.typeName = this.filet(
      this.task.typeId,
      this.dictionaries.typeType
    );
    this.getselect();
  },
  methods: {
    async getTask() {
      this.loading = true;
      //查找父任务下 仅保存任务
      let params = {
        operateType: "temp",
        parentTaskId: this.task.taskId, //父任务ID
      };
      const res = await gettask(params);
      for (let item of res.rows) {
        item.responsibility = item.taskUserList.filter(
          (obj) => obj.userType === 1
        )[0]; //责任人
      }
      this.tableData = res.rows;
      console.log(this.tableData);
      this.tableData.push({ subId: 0, costTime: "" });
      // 回显责任人
      let responsibility = [];
      for (let v of this.tableData) {
        if (!(typeof v.responsibility == "undefined")) {
          v.responsibilityName = v.responsibility.userName;
        }
      }
      // this.optionalResponsibility = responsibility;
      this.loading = false;
    },

    refresh() {
      this.tableData = [{ subId: 0, costTime: "" }];
      this.multipleSelection = [];
      this.multipleSelectionIndex = [];
      this.subId = 1;
    },
    async getselect() {
      this.treedata = await getTreeSelect();
      this.getTask();
    },
    // 选择责任人
    respeople(index) {
      this.$refs.sdialog.isShow = true;
      this.responsibilityID = index;
    },
    // 选择责任人回调
    choiceUser(UserID, UserList) {
      if (UserID.length == 0) {
        this.$message({
          message: "请选择责任人",
          type: "warning",
        });
        return;
        handleUpload;
      }
      console.log(UserList);
      this.$set(
        this.tableData[this.responsibilityID],
        "responsibility",
        UserList[0]
      );
      this.$set(
        this.tableData[this.responsibilityID],
        "responsibilityName",
        UserList[0].userName ? UserList[0].userName : UserList[0].realName
      );
      console.log(UserList[0].userName, 999);

      this.tableData = JSON.parse(JSON.stringify(this.tableData));
      console.log(this.tableData);
      this.$refs.sdialog.isShow = false;
    },
    // 过滤
    filet(id, idList) {
      if (!Array.isArray(idList)) {
        return;
      }
      id = idList.filter((item) => item.dictCode == id);
      if (id.length > 0) {
        id = id[0].dictLabel;
      } else {
        id = "";
      }
      return id;
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
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    addTabledata() {
      const v = { subId: this.subId++, costTime: "" };
      this.tableData.push(v);
    },
    // 批量上传
    handleSuccessBatch(response, file, fileList) {
      // console.log(fileList)
      // if(fileList.length>2){
      //     this.$message({
      //     message: "最多只能上传六个文件",
      //     type: 'warning'
      //   });
      //   fileList=fileList.filter(item=>{return item.hasOwnProperty('type')})
      //   console.log(this.tableData,1)
      //   console.log(fileList,2)
      //   return
      // }
      let v = [];
      console.log(fileList);
      for (let item of fileList) {
        console.log(item);
        if (item.response.code == 200) {
          const t = JSON.parse(
            JSON.stringify(item.response.body)
              .replace(/fileName/g, "name")
              .replace(/url/g, "path")
          );
          t.size = item.size;
          t.type = "batch";
          t.executeFlag = "1";
          v.push(t);
        } else {
          this.$message.error(
            "文件" + item.name + "上传失败,错误提示:" + item.response.message
          );
          return;
        }
      }
      console.log(v, 111);
      let newtable = [];
      //将上传结果保存到所以数组里面
      for (let index in this.tableData) {
        if (!this.tableData[index].hasOwnProperty("taskFileList")) {
          this.tableData[index].taskFileList = [];
        }
        this.tableData[index].taskFileList = this.tableData[
          index
        ].taskFileList.filter((item) => {
          return !item.hasOwnProperty("type");
        });

        let t = this.tableData[index].taskFileList.concat(v);

        this.$set(this.tableData[index], "taskFileList", t);

        newtable.push(this.tableData[index]);
      }
      this.tableData = newtable;
      console.log(this.tableData);
    },
    handleErrorBatch(err, file, fileList) {},
    handlePreview(file) {
      console.log(file);
    },
    handleSuccess(response, file, fileList) {
      // 文件上传成功的回调
      console.log(fileList);
      if (fileList.length > 6) {
        this.$message({
          message: "最多只能上传六个文件",
          type: "warning",
        });
        fileList = fileList.slice(0, 6);
        return;
      }
      let v = [];
      for (let item of fileList) {
        if (item.hasOwnProperty("response")) {
          if (item.response.code == 200) {
            const t = JSON.parse(
              JSON.stringify(item.response.body)
                .replace(/fileName/g, "name")
                .replace(/url/g, "path")
            );
            t.size = item.size;
            t.executeFlag = "1";

            v.push(t);
          } else {
            this.$message.error(
              "文件" + item.name + "上传失败,错误提示:" + item.response.message
            );
            this.$set(
              this.tableData[this.tableDatafileindex],
              "taskFileList",
              []
            );
            return;
          }
        } else {
          v.push(item);
        }
      }
      this.$set(this.tableData[this.tableDatafileindex], "taskFileList", v); //上传成功，将返回结果保存到当前对象表单
      // this.tableData[this.tableDatafileindex].taskFileList = v;
    },
    handleError(err, file, fileList) {
      //文件上传失败的回调
      console.log(err, file);
    },
    tableRowClassName({ row, rowIndex }) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },
    //鼠标点击某一行
    clickline(row, t, index) {
      this.thindex = row.index;
      console.log(this.thindex, 1);
    },
    handleDelete(file, fileList) {
      //从已上传文件删除文件回调
      setTimeout(() => {
        console.log(this.thindex, 2);
        this.tableData[this.thindex].taskFileList = fileList; //删除成功，将返回结果保存到当前对象表单
      }, 600);
      console.log(this.tableData);
    },
    //   批量删除子数据
    async deleteTabledata() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "请先选择任务",
          type: "warning",
        });
        return;
      } else {
        // 删除
        let tempTask = this.multipleSelection.filter((obj) =>
          obj.hasOwnProperty("taskId")
        ); //在所有选中删除数组里找  仅保存的
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
        }
      }
    },
    // 发送
    savesend(status) {
      if (this.multipleSelection.length == 0) {
        //判断有无选中任务 true:选中
        this.$message({
          message: "请选择要提交的任务",
          type: "warning",
        });
        return;
      } else {
        for (let item of this.multipleSelection) {
          console.log(item);
          if (Object.getOwnPropertyNames(item).length < 9) {
            //判断每个任务属性是否为空 bug:填写后清空无法识别
            this.$message({
              message: "请填写完整任务信息",
              type: "warning",
            });
            return;
          }
        }
      }
      this.status = status;
      this.dialogSubtaskSettings = true;
    },
    // 子任务选项
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm);
          this.addTask();
          this.dialogSubtaskSettings = false;
        } else {
          return false;
        }
      });
    },
    // 上传
    async addTask() {
      let status = this.status;
      let listTable = [];
      listTable = this.multipleSelection;
      let v = [];
      for (let item of listTable) {
        let taskList = {};
        taskList = JSON.parse(JSON.stringify(item)); //不影响原数据
        taskList.checkedFlag = taskList.checkedFlag ? 1 : 0; //是否验收
        taskList.costTime = parseInt(taskList.costTime); //任务时长
        taskList.costTimeUnit = taskList.costTimeUnit; //时长单位 暂时
        taskList.status = status; //保存类型
        // taskList.createById=this.$store.getters.userId  创建人ID
        taskList.getFatherTaskInformation = this.ruleForm.getFatherTaskInformation; //子任务属性 查看父任务信息
        taskList.downloadFatherTaskEnclosure = this.ruleForm.downloadFatherTaskEnclosure; //子任务属性 下载父任务附件
        taskList.responsibility.userType = 1; //责任人
        let taskUserList = [];
        taskUserList.push(taskList.responsibility);
        taskList.taskUserList = taskUserList;
        taskList.parentTaskId = this.task.taskId; //父任务ID
        delete taskList.responsibility; //删除多余的数据
        delete taskList.subId;
        delete taskList.index;
        delete taskList.responsibilityName;
        for (let tem in taskList.taskFileList) {
          if (taskList.taskFileList[tem].hasOwnProperty("type")) {
            delete taskList.taskFileList[tem].type;
          }
        }
        v.push(taskList);
      }
      console.log(v, "结果");

      const res = await addtask(v); //提交
      // this.dialogFormVisible=false        //关闭弹窗
      this.$message({
        message: res,
        type: "success",
      });

      console.log(this.tableData, 33333);

      // 删除
      this.multipleSelectionIndex
        .sort(function (a, b) {
          return a - b;
        })
        .reverse();
      console.log(this.multipleSelectionIndex);
      for (let i of this.multipleSelectionIndex) {
        this.tableData.splice(i, 1);
      }
      // this.tableData = this.tableData.filter(item => item.choice === false);  //提交完成的去掉
      this.getTask();
    },

    //  未：批量上传
  },
};
</script>
<style lang="scss" scoped>
.table-add-btn {
  width: auto;
}
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  appearance: none !important;
}

.task-handle-decompose-row {
  margin: 1rem 0;
  background: #f2f2f2;
}
.task-handle-decompose-row > .el-col {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.task-handle-decompose-flexRight {
  text-align: right;
}
.inline-block {
  display: inline-block;
}
.dialog {
  height: 45rem;
}
.bottom-top-mag {
  margin-bottom: 1rem;
}
</style>
