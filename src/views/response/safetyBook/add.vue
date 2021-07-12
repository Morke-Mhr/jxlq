<template>
  <div class="content_add_box">
    <div class="content_add" v-loading="loading">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="110px"
        class="demo-ruleForm"
      >
        <!-- 部门 -->
        <el-row>
          <el-col :span="8">
            <el-form-item label="部门" prop="deptName">
              <el-cascader
                ref="cascader"
                v-model="department"
                :options="treedataDept"
                :props="optionProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <!-- 岗位 -->
          <el-col :span="8">
            <el-form-item label="岗位" prop="postName">
              <el-select
                value-key="postId"
                @change="handlepost"
                v-model="postName"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in getPostsByDept"
                  :key="item.postId"
                  :label="item.name"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 人员 -->
          <el-col :span="8">
            <el-form-item label="人员" prop="userName">
              <el-select
                value-key="userId"
                @change="handleuser"
                v-model="userName"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in UserList"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!--  -->

        <!-- <el-form-item label="签订人" prop="userName">
          <el-cascader
            v-model="dept"
            ref="myCascader"
            :options="treeselect"
            :props="optionProps"
            @change="handleChange"
            style="width: 40%"
          ></el-cascader>
          <el-select
            v-model="ruleForm.userName"
            @change="selectedCag"
            value-key="userId"
            placeholder="请选择员工"
            style="width: 30%"
          >
            <el-option
              v-for="item in UserList"
              :key="item.userId"
              :label="item.realName"
              :value="item"
            >
              <span style="float: left">{{ item.realName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.cardId
              }}</span>
            </el-option>
          </el-select>
          <span>{{ ruleForm.postName }}</span>
        </el-form-item> -->
        <el-form-item label="安全责任" prop="safeDuty">
          <el-input
            type="textarea"
            :rows="8"
            v-model="ruleForm.safeDuty"
            placeholder="请输入"
            maxlength="4000"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="安全目标" prop="safebookTargets">
          <!-- <el-button v-has="has.add" class="table-add-btn" @click="dialogVisible = true">新增</el-button> -->

          <el-table :data="ruleForm.safebookTargets" style="width: 100%" stripe>
            <el-table-column label="工作内容" width="200">
              <template slot-scope="scope">
                <el-select
                  value-key="classdictId"
                  @change="dictNumbers(scope.$index)"
                  v-model="scope.row.workContent"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in dictNumber"
                    :key="item.classdictId"
                    :label="item.dictName"
                    :value="item"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="指标" width="200">
              <template slot-scope="scope">
                <el-select
                  value-key="classdictId"
                  v-model="scope.row.workIndex"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in scope.row.work"
                    :key="index"
                    :label="item.dictName"
                    :value="item"
                  ></el-option>
                </el-select>
                <!-- <el-input v-model="scope.row.workIndex.dictName" disabled></el-input> -->
              </template>
            </el-table-column>
            <el-table-column label="起始范围" align="center">
              <el-table-column label="比较符号" width="130">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.qualifiedRange"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in options2"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="目标值" width="100">
                <template slot-scope="scope">
                  <el-input
                    @mousewheel.native.prevent
                    oninput="value=value.replace(/[^\d]/g,'')"
                    type="number"
                    v-model="scope.row.targetValue"
                  ></el-input>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="目标值类型" width="120">
              <template slot-scope="scope">
                <el-select v-model="scope.row.dataType" placeholder="请输入">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="截止范围" align="center">
              <el-table-column label="比较符号" width="130">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.qualifiedRangeEnd"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in options2"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="目标值" width="100">
                <template slot-scope="scope">
                  <el-input
                    @mousewheel.native.prevent
                    oninput="value=value.replace(/[^\d]/g,'')"
                    type="number"
                    v-model="scope.row.targetValueEnd"
                  ></el-input>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="开始时间" width="180">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.startTime"
                  :picker-options="pickerIssueOptions"
                  @focus="startTimesr(scope.$index)"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择开始日期"
                ></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="结束时间" width="180">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.endTime"
                  :picker-options="pickerExpireOptions"
                  @focus="endTimesr(scope.$index)"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择结束日期"
                ></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button type="text" @click="addsafety">添加</el-button>
                <el-button
                  type="text"
                  class="red"
                  @click="delesafety(scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="审批">
          <el-radio v-model="radio" label="1">是</el-radio>
          <el-radio v-model="radio" label="2">否</el-radio>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item v-show="radio == 1">
          <div class="tit">流程设置</div>
          <el-form
            :model="ruleForm"
            :rules="rules"
            label-width="100px"
            class="change-form"
          >
            <el-form-item label="选择审批流" prop="processDefinitionKey">
              <el-select
                v-model="ruleForm.processDefinitionKey"
                @change="processNode"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in nextData"
                  :key="item.id"
                  :label="item.businessName"
                  :value="item.processDefinitionKey"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="审批岗位">
              <el-input v-model="nodeName" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="审批人" prop="toUser">
              <el-input
                v-model="toUserName"
                readonly
                @focus="alertChooseSp"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-form-item>
      </el-form>
      <!-- 选择审批流 -->
      <sdialog
        ref="sdialog"
        @choiceUser="choiceUser"
        :isDx="isDx"
        :sNeed="sNeed"
        :transferProps="{
          key: 'userId',
          label: 'realName',
        }"
        :treedata="treeselect"
      ></sdialog>
      <!-- <div class="dialog-footer">
        <el-button class="confirm-btn" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
        <el-button class="cancel-btn" @click="resetForm">取 消</el-button>
      </div> -->
    </div>
  </div>
</template>

<script>
import {
  addLookSafety,
  getTreeSelect,
  getdictNumber,
  getBusinessList,
  getBusinesspost,
  getPostWprocessGuide,
} from "@/api/job/safety";
import Sdialog from "@/components/selectDialog"; //通过部门选择人
import {
  getTreeDeptSelect, //部门岗位列表
  getPostsByDeptId, //根据部门ID获取岗位
  getUsersByDeptPost,
} from "@/api/job/safety";
export default {
  components: {
    Sdialog,
  },
  data() {
    return {
      nextData: [],
      nodeName: "",
      Datas: {
        processDefinitionKey: "",
        userName: "",
      },
      optionProps: {
        value: "id",
        checkStrictly: true,
      },
      options: [
        {
          value: "0",
          label: "百分比",
        },
        {
          value: "1",
          label: "数值",
        },
      ],
      options2: [
        {
          value: "0",
          label: "大于",
        },
        {
          value: "1",
          label: "等于",
        },
        {
          value: "2",
          label: "小于",
        },
        {
          value: "3",
          label: "大于等于",
        },
        {
          value: "4",
          label: "小于等于",
        },
      ],
      isDx: true, //是否单选 子组件
      sNeed: true, //是否传值
      dictNumber: [],
      loading: false,
      dictNumberlower: {},
      //分类字典
      value: "",
      radio: "2",
      dept: [],
      toUserName: "",
      startTimes: 0,
      endTimes: 0,
      pickerIssueOptions: {
        disabledDate: (time) => {
          if (!this.ruleForm.safebookTargets[this.startTimes].endTime) {
            return false;
          }
          return (
            time.getTime() >
            new Date(
              this.ruleForm.safebookTargets[this.startTimes].endTime.replace(
                /-/g,
                "/"
              )
            ).getTime()
          );
        },
      },
      pickerExpireOptions: {
        disabledDate: (time) => {
          if (!this.ruleForm.safebookTargets[this.endTimes].startTime) {
            return false;
          }
          return (
            time.getTime() <
            new Date(
              this.ruleForm.safebookTargets[this.endTimes].startTime.replace(
                /-/g,
                "/"
              )
            ).getTime()
          );
        },
      },
      ruleForm: {
        //新增表单数据
        postName: "", //岗位名称
        postId: "",
        deptName: "", //部门名称
        deptId: "", //部门Id
        userId: "", //人员id
        userName: "", //人员名称
        safebookTargets: [{ work: [], targetValue: "", targetValueEnd: "" }], //责任列表
        safeDuty: "", //安全责任
      },
      department: [], //选择的当前部门
      postName: {}, //选择的岗位
      userName: {}, //选择的人员
      deptId: "",
      postId: "",
      rules: {
        deptName: [
          { required: true, message: "请选择部门", trigger: "change" },
        ],
        postName: [
          { required: true, message: "请选择岗位", trigger: "change" },
        ],
        userName: [
          { required: true, message: "请选择签订人", trigger: "change" },
        ],
        safeDuty: [
          { required: true, message: "请选择输入安全责任", trigger: "blur" },
        ],
        safebookTargets: [
          { required: true, message: "请输入安全目标 ", trigger: "blur" },
        ],
        processDefinitionKey: [
          { required: true, message: "请选择审批流程", trigger: "blur" },
        ],
        toUser: [
          { required: true, message: "请选择审批人", trigger: "change" },
        ],
      },
      treedataDept: [],
      treeselect: [], //选择部门
      UserList: [], //选择人员
      addList: [], //提交数组
      dialogVisible: false,
      deparobjk: {}, //部门
      getPostsByDept: [], //岗位可选列表
    };
  },
  computed: {},
  created() {
    // this.SQstatus();
    // this.department();
    this.loading = true;
    this.getTreSelect();
    // 获取审批流
    this.getNextProce();
  },
  methods: {
    // 选择审批流
    async processNode(v) {
      let data = {
        processDefinitionKey: v,
      };
      let nodeName = await getBusinesspost(data);
      this.nodeName = nodeName.nodeName;
      // console.log(nodeName.nodeName)
    },
    // 选择开始时间
    startTimesr(index) {
      this.startTimes = index;
      console.log(index, 8888);
    },
    // 结束开始时间
    endTimesr(index) {
      this.endTimes = index;
      console.log(index);
    },
    //获取部门列表
    async getTreSelect() {
      this.treedataDept = await getTreeDeptSelect();
      this.treeselect = await getTreeSelect();
      this.dictNumber = await getdictNumber("DICT_WORKCONTENT");
      this.loading = false;
    },
    //
    //部门
    async handleChange(value) {
      if (value.length <= 0) {
        this.$message({
          message: "请选择部门",
          type: "warning",
        });
        return;
      }
      this.deparobjk = this.$refs["cascader"].getCheckedNodes();
      this.ruleForm.deptName = this.deparobjk[0].label;
      this.deptId = value[value.length - 1];
      this.ruleForm.deptId = value[value.length - 1];
      this.getPostsByDept = await getPostsByDeptId(value[value.length - 1]);
      if (this.getPostsByDept.length < 0) {
        //如果没有结果着为空
        return;
      }
      this.$set(
        this.ruleForm,
        "postName",
        this.getPostsByDept.length == 0 ? "" : this.getPostsByDept[0].name
      );
      this.postName = this.getPostsByDept[0];
      this.postId = this.getPostsByDept[0].postId;
      this.ruleForm.postId = this.getPostsByDept[0].postId;

      this.People();

      // if (value.length > 0) {
      //   this.ruleForm.deptId = value[value.length - 1];
      //   // 重新选择部门将清空人员
      //   this.ruleForm.userName = "";
      //   this.userId = "";
      //   this.ruleForm.postName = "";
      //   this.People();
      // }
      // console.log(this.ruleForm,999)
    },
    handlepost(value) {
      this.postId = value.postId;
      this.$set(this.ruleForm, "postName", value.name);
      this.People();
    },
    // 查询指标
    async dictNumbers(index) {
      const res = await getdictNumber(
        this.ruleForm.safebookTargets[index].workContent.dictNumber
      );
      if (res.length < 0) {
        //如果没有结果着为空
        this.ruleForm.safebookTargets[index].work = [];
        return;
      }
      // this.ruleForm.safebookTargets[index].workIndex =res[0] //每次改变第一选项时，清空已选第二选项
      this.$set(this.ruleForm.safebookTargets[index], "workIndex", res[0]); //每次改变第一选项时，清空已选第二选项默认为可选项的第一个
      this.$set(this.ruleForm.safebookTargets[index], "work", res);
      // this.ruleForm.safebookTargets[index].work = res; //第二选项 可选项
    },
    //
    //获取人员
    async People() {
      let parms = {
        postId: this.postId,
        deptId: this.deptId,
      };
      this.UserList = await getUsersByDeptPost(parms);
      if (this.UserList.length == 0) {
        this.$set(this.ruleForm, "userId", "");
        this.$set(this.ruleForm, "userName", "");
        this.userName = {};
        return;
      }
      this.$set(
        this.ruleForm,
        "userId",
        this.UserList.length == 0 ? "" : this.UserList[0].userId
      );
      this.$set(
        this.ruleForm,
        "userName",
        this.UserList.length == 0 ? "" : this.UserList[0].userName
      );
      this.userName = this.UserList.length == 0 ? "" : this.UserList[0];
    },
    handleuser() {
      this.$set(this.ruleForm, "userName", this.userName.userName);
      this.$set(this.ruleForm, "userId", this.userName.userId);

      console.log(this.ruleForm, 10101010);
    },
    //获取人员的value和label值
    selectedCag(e) {
      let user = this.ruleForm.userName;
      this.ruleForm.userName = user.realName;
      this.ruleForm.userId = user.userId;
      this.getPostDept();
    },

    //获取岗位
    async getPostDept() {
      const res = await getPostAndDept(this.ruleForm.userId); //查找岗位
      //  this.ruleForm.deptName =res.deptName
      this.ruleForm.postName = res.beforePost; //岗位名称
      this.ruleForm.deptName = res.beforeDept; //部门名称
    },
    // 新增安全目标
    addsafety() {
      this.ruleForm.safebookTargets.push({
        work: [],
        targetValue: "",
        targetValueEnd: "",
      });
    },
    // 删除
    delesafety(index) {
      if (this.ruleForm.safebookTargets.length < 2) {
        this.$message({
          message: "最少要有一个安全目标考核项",
          type: "warning",
        });
        return;
      }
      this.ruleForm.safebookTargets.splice(index, 1);
    },
    // 获取审批流
    async getNextProce() {
      let pamrs = {
        businessCode: this.$store.state.approvalProcess.safebook,
      };
      this.nextData = await getBusinessList(pamrs);
    },
    // 获取审批人
    alertChooseSp() {
      this.isDx = true;
      this.sNeed = true;
      this.$refs.sdialog.isShow = true;
    },
    // 新增审批人 完成后的事件
    choiceUser(UserID, UserObject) {
      if (UserID.length == 0) {
        this.$message({
          message: "请选择审批人",
          type: "warning",
        });
        return;
      }
      this.toUserName = UserObject[0].realName;
      this.$set(this.ruleForm, "toUser", UserObject[0].userId);
      this.$refs.sdialog.isShow = false;
    },
    //新增表单
    async submitForm(ruleForm) {
      let current = false;
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          current = true;
        } else {
          return false;
        }
      });
      if (!current) {
        return;
      }
      if (this.radio == "2") {
        delete this.ruleForm.processDefinitionKey; //流程key
        delete this.ruleForm.toUser; //指派人
      } else if (!this.ruleForm.toUser || !this.ruleForm.processDefinitionKey) {
        this.$message({
          message: "请选择审批流或审批人",
          type: "warning",
        });
        return;
      }

      for (let item of this.ruleForm.safebookTargets) {
        if (Object.getOwnPropertyNames(item).length < 9) {
          this.$message({
            message: "填写完整安全责任书表单",
            type: "warning",
          });
          return;
        }
        let wct = item.workContent;
        let wix = item.workIndex;
        item.workContent = wct.dictName;
        item.workContentId = wct.classdictId;
        item.workIndex = wix.dictName;
        item.workIndexId = wix.classdictId;
        delete item.work;
      }
      this.ruleForm.isApply = this.radio == 2 ? "0" : "1";
      this.$confirm("是否确认新增安全责任书", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await addLookSafety(this.ruleForm);
          this.$message({
            message: res,
            type: "success",
          });
          this.$emit("addsafetyok");
        })
        .catch(() => {});
    },
    // 取消
    resetForm() {
      this.$emit("addsafetyok");
    },
  },
  watch: {
    postId: {
      async handler(postId) {
        let { safeDuty } = await getPostWprocessGuide(postId);
        this.ruleForm.safeDuty = safeDuty;
      },
    },
  },
};
</script>
<style scoped>
.content_add_box {
  background-color: #fff;
  padding: 15px 0;
}
.content_add {
  margin: 2rem auto;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
.content_add_box .el-input__inner {
  border: none !important;
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
