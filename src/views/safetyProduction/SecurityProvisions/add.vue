<template>
  <div class="content_add_box">
    <div class="content_add">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="130px"
        class="demo-ruleForm"
      >
        <el-form-item label="经费类别" prop="fundType">
          <el-select
            v-model="ruleForm.fundType"
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
        <el-form-item label="单位名称" prop="deptId">
          <el-cascader
            v-model="deptIds"
            ref="myCascader"
            :options="treeselectA"
            :props="optionProps"
            @change="handleChange"
            style="width: 100%"
            placeholder="请选择部门"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model="ruleForm.projectName"
            disabled
            placeholder="请选择"
            style="width: 70%"
          ></el-input>
          <el-button
            class="table-add-btn"
            @click="chooseList"
            style="width: auto"
            >获取列表</el-button
          >
        </el-form-item>
        <el-form-item label="项目标段" prop="bid">
          <el-input
            v-model="ruleForm.bid"
            disabled
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="计划实施时间" prop="planTime">
          <div class="block">
            <el-date-picker
              v-model="ruleForm.planTime"
              type="date"
              format="yyyy-MM-dd "
              value-format="yyyy-MM-dd "
              placeholder="选择日期时间"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="预计金额" prop="money">
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
        <el-form-item label="经费内容" prop="fundContent">
          <el-input
            type="textarea"
            :rows="5"
            maxlength="350"
            show-word-limit
            v-model="ruleForm.fundContent"
            placeholder="请输入"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="4"
            maxlength="350"
            show-word-limit
            v-model="ruleForm.remark"
            placeholder="请输入"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- 审批流程 -->
        <el-form-item label="流程设置 ：">
          <!-- <div class="tit">流程设置</div> -->
        </el-form-item>
        <el-form-item label="下一个审批节点" prop="modelName">
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
            <el-col :span="19" style="padding-left: 48px">
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

      <!-- <div class="dialog-footer">
        <el-button class="confirm-btn" @click="addOpen()">确 定</el-button>
        <el-button class="cancel-btn" @click="resetForm('ruleForm')"
          >取 消</el-button
        >
      </div> -->
      <!--项目盒子-->
      <el-dialog
        :visible.sync="dialogVisible"
        custom-class="small"
        :title="'新增列表'"
        :close-on-click-modal="false"
        append-to-body
      >
        <div class="safe_main" style="background: #f2f2f2">
          <div class="sxForm">
            <el-form
              :inline="true"
              :model="formInline"
              ref="formInline"
              class="demo-form-inline"
            >
              <el-form-item label="项目名称" prop="projectName">
                <el-input
                  v-model="formInline.projectName"
                  placeholder="项目名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="项目标段" prop="bid">
                <el-input
                  v-model="formInline.bid"
                  placeholder="项目标段"
                ></el-input>
              </el-form-item>
              <div class="btnCont">
                <el-button class="chaxun" @click="onSubmit">查询</el-button>
                <el-button class="chongzhi" @click="onClear('formInline')"
                  >重置</el-button
                >
              </div>
            </el-form>
          </div>
          <div class="sxTable" style="padding: 20px 10px 0px">
            <el-table
              :data="addTableData"
              ref="multipleTable"
              tooltip-effect="light"
              height="calc(100vh - 370px)"
              v-loading="loading"
              style="width: 100%"
              stripe
            >
              <el-table-column
                show-overflow-tooltip
                align="center"
                label="项目名称"
              >
                <template slot-scope="scope">{{
                  scope.row.projectName
                }}</template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                align="center"
                label="标段"
              >
                <template slot-scope="scope">{{ scope.row.bid }}</template>
              </el-table-column>
              <el-table-column
                prop="cz"
                align="center"
                label="操作"
                width="150"
              >
                <template slot-scope="scope">
                  <!-- 这里可以拿到当前行的内容 row -->
                  <el-button
                    size="small"
                    type="text"
                    style="margin-left: 10px"
                    @click="goRedact(scope, addTableData)"
                    >确定</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
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
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  Classification,
  getProject,
  getAddList,
  getBusinessList,
  getChangeJobNextNode,
  treeselect,
} from "@/api/safetyProduction/SecurityProvisions";
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
        add: "laws:projectDoc:add",
      },
      isDx: true, //是否单选 子组件
      sNeed: true, //是否传值
      nextData: [], //审批流
      toUserName: "",
      nodeName: "",

      optionProps: {
        value: "id",
        label: "label",
        checkStrictly: true,
      },
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
        projectName: "",
        bid: "",
      },
      deptIds: "", //多个部门编号
      ruleForm: {
        fundType: "", //经费类别
        fundTypeId: "", //经费类别编号
        deptName: "", //部门名称
        deptId: "", //部门编号
        planTime: "", //计划实施时间
        fundContent: "", // 经费内容
        money: "", //预计金额
        remark: "", //备注
        projectName: "", //项目名称
        projectId: "", //项目名称ID
        bid: "", //标段
        modelName: "", //选择审批流
        businessCode: "",
        toUser: "",
      },
      rules: {
        fundType: [
          { required: true, message: "选择经费类别", trigger: "blur" },
        ],
        deptId: [{ required: true, message: "选择部门", trigger: "blur" }],
        planTime: [
          { required: true, message: "计划实施时间", trigger: "blur" },
        ],
        fundContent: [{ required: true, message: "经费内容", trigger: "blur" }],
        money: [{ required: true, validator: validateMoney, trigger: "blur" }],
        remark: [{ required: true, message: "备注", trigger: "blur" }],
        projectName: [{ required: true, message: "项目名称", trigger: "blur" }],
        bid: [{ required: true, message: "标段", trigger: "blur" }],
        modelName: [{ required: true, message: "审批流程", trigger: "blur" }],
        toUser: [{ required: true, message: "选择审批人", trigger: "blur" }],
      },
      treeselect: [], //获取部门
      treeselectA: [], //获取部门
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
    this.department();
    //根据用户登录名获取部门
    this.departments();
    this.Classifications();
    // 获取审批流
    this.autoFlow();
  },
  methods: {
    //审批流程
    async autoFlow() {
      let businessCode = this.$store.state.approvalProcess.safefundplan;
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
          this.ruleForm.fundTypeId = item.dictCode;
        }
      });
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

    //项目获取
    async chooseList() {
      this.dialogVisible = true;
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      let res = await getProject(data);
      this.addTableData = res.rows;
      this.total = res.total;
      this.loading = false;
    },
    //获取部门
    async department() {
      this.treeselect = await getTreeSelect();
    },
    ////根据用户登录名获取部门
    async departments() {
      this.treeselectA = await treeselect();
    },

    //弹窗带出数据
    goRedact(scope) {
      let data = scope.row;
      this.ruleForm.projectName = data.projectName;
      this.ruleForm.bid = data.bid;
      this.ruleForm.projectId = data.projectId;
      this.dialogVisible = false;
    },
    //选中部门
    handleChange(value) {
      if (value != undefined) {
        let deptname = this.$refs.myCascader.getCheckedNodes()[0].pathLabels;
        this.ruleForm.deptName = deptname[deptname.length - 1];
      }
      if (this.deptIds != undefined) {
        this.ruleForm.deptId = value[value.length - 1];
      }
    },

    //置空
    onClear(formName) {
      this.$refs[formName].resetFields();
      this.chooseList();
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
        this.$confirm("正在执行新增操作, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            let data = null;
            try {
              delete this.ruleForm.modelName;
              let resdata = this.ruleForm;
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
        let datas = {
          pageNum: 1,
          pageSize: this.pageSize,
          projectName: this.formInline.projectName,
          bid: this.formInline.bid,
        };
        let data = await getProject(datas);
        this.addTableData = data.rows;
        console.log(this.addTableData);
        this.loading = false;
      } catch (e) {
        console.error("接口异常");
      }
    },
    //提交查询
    async onPaging() {
      try {
        let datas = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          projectName: this.formInline.projectName,
          bid: this.formInline.bid,
        };
        let data = await getProject(datas);
        this.addTableData = data.rows;
        console.log(this.addTableData);
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
<style lang="scss" scoped>
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
