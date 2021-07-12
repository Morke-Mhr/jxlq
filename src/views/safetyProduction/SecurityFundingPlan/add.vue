<template>
  <div class="content_add_box">
    <div class="content_add">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="类别" prop="fundType">
          <el-input
            v-model="ruleForm.fundType"
            disabled
            placeholder="请输入"
            style="width: 75%"
          ></el-input>
          <el-button
            class="table-add-btn"
            @click="chooseList"
            style="width: auto"
            >获取计提计划</el-button
          >
        </el-form-item>
        <el-form-item label="单位名称" prop="deptName">
          <el-input
            v-model="ruleForm.deptName"
            disabled
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="标段" prop="bid">
          <el-input
            v-model="ruleForm.bid"
            disabled
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="本次申报金额" prop="money">
          <el-input
            v-model="ruleForm.money"
            placeholder="请输入"
            autocomplete="off"
            maxlength="20"
            show-word-limit
            :controls="false"
            type="number"
            onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )"
            :min="0"
          ></el-input>
        </el-form-item>
        <el-form-item label="安全经费概述" prop="overview">
          <el-input
            type="textarea"
            :rows="4"
            maxlength="350"
            show-word-limit
            v-model="ruleForm.overview"
            placeholder="请输入"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <!-- 审批流程 -->
        <el-form-item label="流程设置 ：">
          <!-- <div class="tit">流程设置</div> -->
        </el-form-item>
        <el-form-item label="选择审批流" prop="modelName">
          <el-input v-model="ruleForm.modelName" disabled></el-input>
        </el-form-item>
        <el-form-item label="审批岗位">
          <el-input v-model="nodeName" disabled></el-input>
        </el-form-item>
        <el-form-item label="审批人" prop="toUser" style="margin-top: 25px">
          <el-row :gutter="30" type="flex">
            <el-col :span="5">
              <el-input
                v-model="toUserName"
                disabled
                style="width: 100px"
              ></el-input>
            </el-col>
            <el-col :span="19" style="padding-left: 50px">
              <el-button type="text" @click="alertChooseSp"
                >选择审批人</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <!-- 选择审批流 -->
      <Sdialog
        ref="sdialog"
        @choiceUser="choiceUser"
        :isDx="isDx"
        :sNeed="sNeed"
        :transferProps="{ key: 'userId', label: 'realName' }"
        :treedata="treeselect"
      ></Sdialog>

      <!-- <div class="dialog-footer" v-show="flag">
        <el-button
          class="confirm-btn"
          v-has="has.add"
          @click="addOpen()"
          >确 定</el-button
        >
        <el-button class="cancel-btn" @click="resetForm('ruleForm')"
          >取 消</el-button
        >
      </div> -->
      <!--项目盒子-->
      <el-dialog
        :visible.sync="dialogVisible"
        custom-class="large"
        :title="'新增列表'"
        :close-on-click-modal="false"
        append-to-body
      >
        <div class="inquire">
          <el-form
            :inline="true"
            :model="formInline"
            ref="formInline"
            class="demo-form-inline"
          >
            <el-form-item label=" 经费类别" prop="fundType">
              <el-select
                v-model="formInline.fundType"
                @change="ChangeStatus"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.dictCode"
                  :label="item.dictLabel"
                  :value="item.dictLabel"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="单位名称" prop="deptName">
              <el-input
                v-model="formInline.deptName"
                placeholder="单位名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="计划实施时间" prop="planTime">
              <div class="block">
                <el-date-picker
                  v-model="formInline.planTime"
                  type="date"
                  format="yyyy-MM-dd "
                  value-format="yyyy-MM-dd "
                  placeholder="选择日期时间"
                ></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="项目标段" prop="projectName">
              <el-input
                v-model="formInline.projectName"
                placeholder="项目标段"
              ></el-input>
            </el-form-item>
            <el-form-item label="本次申报金额" prop="money">
              <el-input
                v-model="formInline.money"
                placeholder="本次申报金额"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button v-has="has.query" class="chaxun" @click="onSubmit"
                >查询</el-button
              >
              <el-button class="chongzhi" @click="onClear('formInline')"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <el-table
          :data="addTableData"
          ref="multipleTable"
          tooltip-effect="dark"
          v-loading="loading"
          style="width: 100%"
          :header-cell-style="{ color: '#000000', 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
          stripe
        >
          <el-table-column label="经费类别">
            <template slot-scope="scope">{{ scope.row.fundType }}</template>
          </el-table-column>
          <el-table-column label="单位名称">
            <template slot-scope="scope">{{ scope.row.deptName }}</template>
          </el-table-column>
          <el-table-column label="计划实施时间">
            <template slot-scope="scope">{{ scope.row.planTime }}</template>
          </el-table-column>
          <el-table-column label="预计金额">
            <template slot-scope="scope">{{ scope.row.money }}</template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">{{ scope.row.remark }}</template>
          </el-table-column>
          <el-table-column prop="cz" label="操作">
            <template slot-scope="scope">
              <!-- 这里可以拿到当前行的内容 row -->
              <el-button
                v-has="has.delete"
                size="small"
                type="text"
                style="margin-left: 10px"
                @click="goRedact(scope)"
                >确定</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <template>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="pageSize"
            background
            layout="total, prev, pager, next, sizes, jumper"
            :total="total"
          ></el-pagination>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getAddList,
  Classification,
  getProject,
  getProjectList,
  getBusinessList,
  getChangeJobNextNode,
} from "@/api/safetyProduction/SecurityFundingPlan";
import { getTreeSelect } from "@/api/job/safety"; //获取部门

import Sdialog from "@/components/selectDialog"; //通过部门选择人

export default {
  components: { Sdialog },
  data() {
    const validateMoney = (rule, value, callback) => {
      if (!value) {
        callback(new Error("预计金额不能为空"));
      } else if (value.indexOf(".") != -1 && value.split(".").length > 2) {
        callback(new Error("请输入正确格式的金额")); //防止输入多个小数点
      } else if (value.indexOf(".") != -1 && value.split(".")[1].length > 2) {
        callback(new Error("请输入正确额格式,可保留两位小数")); //小数点后两位
      } else {
        callback();
      }
    };

    return {
      has: {
        add: "fundPlan:get:list",
      },
      isDx: true, //是否单选 子组件
      sNeed: true, //是否传值
      nextData: [], //审批流
      toUserName: "",
      nodeName: "",

      addTableData: [],
      fileList: [],
      flag: true,
      loading: true,
      project: [],
      arr: [],
      dialogVisible: false,
      total: 0,
      pageNum: 1,
      pageSize: 5,
      //头部查询
      formInline: {
        fundTypeId: "",
        fundType: "",
        deptName: "",
        planTime: "",
        projectName: "",
        money: "",
      },
      ruleForm: {
        fundplanId: "", //计提计划编号
        overview: "", // 安全经费概述
        money: "", //本次申请金额
        fundType: "", //类别
        deptName: "", //单位名称
        bid: "", //标段
        modelName: "", //选择审批流
        businessCode: "",
        toUser: "",
      },
      rules: {
        overview: [
          { required: true, message: "安全经费概述", trigger: "blur" },
        ],
        money: [{ required: true, validator: validateMoney, trigger: "blur" }],
        fundType: [{ required: true, message: "类别", trigger: "blur" }],
        deptName: [{ required: true, message: "单位名称", trigger: "blur" }],
        bid: [{ required: true, message: "标段", trigger: "blur" }],
        modelName: [{ required: true, message: "审批流程", trigger: "blur" }],
        toUser: [{ required: true, message: "选择审批人", trigger: "blur" }],
      },
      treeselect: [], //获取部门
      options: {}, //经费类别
    };
  },
  computed: {
    getUrl() {
      return (
        this.$store.state.apiConfiguration.url +
        this.$store.state.serviceName.jurisdiction +
        "/fs/upload"
      );
    },
  },
  created() {
    this.Classifications();
    this.getNextProce();
    this.department();
    // 获取审批流
    this.autoFlow();
  },
  methods: {
    //审批流程
    async autoFlow() {
      let businessCode = this.$store.state.approvalProcess.safefundget;
      let data = await getChangeJobNextNode(businessCode);
      this.ruleForm.modelName = data.modelName;
      this.toUserName = data.userName;
      this.nodeName = data.nodeName;
      this.ruleForm.toUser = data.userId;
      this.ruleForm.businessCode = data.processDefinitionKey;
    },

    //经费类别
    async Classifications() {
      this.options = await Classification("Funding_category");
    },
    //选择经费类别
    ChangeStatus(e) {
      this.options.map((item) => {
        if (item.dictLabel == e) {
          this.formInline.fundTypeId = item.dictCode;
        }
      });
    },

    // 获取审批流
    async getNextProce() {
      let pamrs = {
        businessCode: this.$store.state.approvalProcess.safefundget,
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
      console.log(UserObject);
      this.toUserName = UserObject[0].realName;
      this.ruleForm.toUser = UserObject[0].userId;

      this.$refs.sdialog.isShow = false;
    },
    //获取部门
    async department() {
      this.treeselect = await getTreeSelect();
    },

    //项目获取
    async chooseList() {
      this.dialogVisible = true;
      let res = await getProjectList();
      this.addTableData = res.rows;
      this.total = res.total;
      this.loading = false;
    },
    //弹窗带出数据
    goRedact(scope) {
      let data = scope.row;
      this.ruleForm.fundplanId = data.fundplanId;
      this.ruleForm.fundType = data.fundType;
      this.ruleForm.bid = data.bid;
      this.ruleForm.deptName = data.deptName;
      this.dialogVisible = false;
    },
    //置空
    onClear(formName) {
      this.$refs[formName].resetFields();
      this.chooseList();
    },

    addOpen() {
      this.$confirm("正在执行新增/编辑操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.submitForm();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },

    //取消
    resetForm() {
      this.$emit("func");
    },

    //新增表单
    submitForm(formName) {
      this.$refs["ruleForm"].validate((valid) => {
        if (!valid) {
          this.$notify({
            title: "操作失败",
            dangerouslyUseHTMLString: true,
            message: "请填写完整",
            type: "warning",
          });
          return;
        }
        this.$confirm("正在执行新增/编辑操作, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            let data = null;
            try {
              let { fundType, deptName, bid, modelName, ...arry } =
                this.ruleForm;
              let resdata = { ...arry };
              data = await getAddList(resdata);
              this.$refs["ruleForm"].resetFields();
              this.$emit("func");
            } catch (e) {
              console.error("接口异常");
            }
            this.$notify({
              title: data ? "成功" : "失败",
              dangerouslyUseHTMLString: true,
              message: data ? data.message : "服务器开小差了，请稍后再试",
              type: data ? "success" : "warning",
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      });
    },
    //提交查询
    async onSubmit() {
      try {
        let resdata = this.formInline;
        let { fundTypeId, deptName, planTime, projectName, money } = resdata;
        let data = await getProject(
          1,
          this.pageSize,
          fundTypeId,
          deptName,
          planTime,
          projectName,
          money
        );
        this.addTableData = data.rows;
        this.loading = false;
      } catch (e) {
        console.error("接口异常");
      }
    },
    //分页查询
    async onPaging() {
      try {
        let resdata = this.formInline;
        let { fundTypeId, deptName, planTime, projectName, money } = resdata;
        let data = await getProject(
          this.pageNum,
          this.pageSize,
          fundTypeId,
          deptName,
          planTime,
          projectName,
          money
        );
        this.addTableData = data.rows;
        this.loading = false;
      } catch (e) {
        console.error("接口异常");
      }
    },

    /**
     * 分页器
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.onPaging();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.onPaging();
    },
  },
};
</script>
<style lang='scss' scoped>
.content_add_box {
  background-color: #fff;
  padding: 15px 0;
  .content_add {
    // width: 50%;
    // margin: 30px auto;
    .dialog-footer {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
