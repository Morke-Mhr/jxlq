<template>
  <div class="safe_main container-table AAAA">
    <div class="sxForm">
      <el-form
        :inline="true"
        :model="pageForm"
        ref="pageForm"
        class="demo-form-inline"
      >
        <el-form-item prop="userName" label="责任人">
          <el-input
            v-model="pageForm.userName"
            maxlength="30"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-select v-model="pageForm.status" placeholder="状态">
            <el-option label="请选择" value></el-option>
            <el-option label="待签署" value="0"></el-option>
            <el-option label="已签署" value="1"></el-option>
          </el-select>
        </el-form-item>
        <div class="btnCont">
          <el-button
            class="chaxun"
            icon="el-icon-search"
            v-has="has.query"
            @click="getAllList()"
            >查询
          </el-button>
          <el-button @click="resetForm('pageForm')" class="chongzhi"
            >重置
          </el-button>
        </div>
      </el-form>
    </div>

    <div class="sxTable">
      <template>
        <div class="header-right">
          <el-button v-has="has.add" class="blue" @click="handleAddS()">
            新增
          </el-button>
          <el-button class="blue" v-has="has.remove" @click="handleDel()">
            批量删除
          </el-button>
        </div>
      </template>

      <el-table
        tooltip-effect="light"
        :data="tableData"
        v-loading="loading"
        style="width: 100%"
        height="calc(100vh - 370px)"
        @selection-change="handleSelectionChange"
        row-key="safebookId"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        stripe
      >
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column align="center"  label="部门" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.deptName }}</template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="岗位" width="150px">
          <template slot-scope="scope">{{ scope.row.postName }}</template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="责任人" style="el-table-column">
          <template slot-scope="scope">{{ scope.row.userName }}</template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="安全责任" width="400">
          <template slot-scope="scope">{{ scope.row.safeDuty }}</template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="创建时间" width="400">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="审批状态" width="100px">
          <template slot-scope="scope">
            <span
              v-if="
                scope.row.applyStatus == '0' || scope.row.applyStatus == null
              "
              >不审批</span
            >
            <span v-if="scope.row.applyStatus == '1'" style="color: #409eff"
              >审批中</span
            >
            <span v-if="scope.row.applyStatus == '2'" style="color: #ff0000"
              >已驳回</span
            >
            <span v-if="scope.row.applyStatus == '3'" style="color: #0eb83a"
              >已完成</span
            >
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.status == '0'">待签署</span>
            <span v-if="scope.row.status == '1'" style="color: #409eff"
              >已签署</span
            >
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="100px"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              v-has="has.query"
              size="medium"
              style="margin-left: 0px"
              @click="handleAdd(scope)"
              >查看
            </el-button>
            <el-button
              :disabled="scope.row.applyStatus != '0'"
              type="text"
               class="red"
              size="medium"
              v-has="has.remove"
              @click.native.prevent="deleteRow(scope.row.safebookId)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="pageSizes"
        :page-size="pageForm.pageSize"
        :current-page="pageForm.pageNum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>

      <el-dialog
        :visible.sync="dialogVisible"
        :title="this.lookTit"
        v-if="dialogVisible"
        custom-class="small"
        :close-on-click-modal="false"
        @close="closeDialog"
      >
        <div class="safety-table">
          <div id="printForm">
            <h3 class="title">江西省公路桥梁工程有限公司</h3>
            <h3 class="title1">安全生产目标管理</h3>
            <h1 class="title2">责 任 书</h1>
            <div class="title3">
              <div style="height: 35px; line-height: 35px">
                <sapn>部门 : </sapn>
                <span> &nbsp;{{ this.detailDate.deptName }}</span>
              </div>
              <div style="height: 35px; line-height: 35px">
                <sapn>岗位 : </sapn>
                <span> &nbsp;{{ this.detailDate.postName }}</span>
              </div>
            </div>
            <div class="title-footr">
              江西省公路桥梁工程有限公司安全生产委员会
            </div>
            <div class="title-yearStr">
              {{ yearStr }}
            </div>
            <hr style="width: 80%; margin: 40px auto" />
            <p class="title-text">
              为认真贯彻落实“安全第一、预防为主、综合治理、持续改进”的安全生产方针，全面落实安全生产责任制，强化企业职工的安全责任意识，确保安全生产，促进企业发展。根据国家有关安全生产法及我公司相关安全生产管理办法，特制定本年度安全生产目标责任书。
            </p>
            <h3>一、安全生产职责：</h3>
            <p class="title-text">
              {{ detailDate.safeDuty }}
            </p>
            <h3>二、目标及考核内容：</h3>
            <table
              cellspacing="1"
              cellpadding="0"
              style="width: 80%; text-align: center; margin: 0 auto"
            >
              <tr style="height: 35px; line-height: 35px">
                <td
                  :rowspan="this.formLength + 1"
                  style="
                    border-top: 1px solid #ddd;
                    border-left: 1px solid #ddd;
                    border-right: 1px solid #ddd;
                    border-bottom: 1px solid #ddd;
                    border-collapse: collapse;
                    text-align: center;
                    padding: 0 20px;
                  "
                >
                  安全目标
                </td>
                <td
                  style="
                    border-top: 1px solid #ddd;
                    border-bottom: 1px solid #ddd;
                    border-collapse: collapse;
                    text-align: center;
                  "
                >
                  指标
                </td>
                <td
                  style="
                    border-top: 1px solid #ddd;
                    border-left: 1px solid #ddd;
                    border-bottom: 1px solid #ddd;
                    border-collapse: collapse;
                    text-align: center;
                  "
                >
                  目标
                </td>
                <td
                  style="
                    border-top: 1px solid #ddd;
                    border-left: 1px solid #ddd;
                    border-bottom: 1px solid #ddd;
                    border-collapse: collapse;
                    text-align: center;
                  "
                >
                  开始时间
                </td>
                <td
                  style="
                    border-top: 1px solid #ddd;
                    border-left: 1px solid #ddd;
                    border-right: 1px solid #ddd;
                    border-bottom: 1px solid #ddd;
                    border-collapse: collapse;
                    text-align: center;
                  "
                >
                  结束时间
                </td>
              </tr>
              <tr
                v-for="(item, index) in this.detailDate.safebookTargets"
                :key="index"
                style="height: 35px"
              >
                <td
                  style="
                    border-right: 1px solid #ddd;
                    border-bottom: 1px solid #ddd;
                    border-collapse: collapse;
                    text-align: center;
                  "
                >
                  &nbsp;{{ item.workIndex }}
                </td>
                <td
                  style="
                    border-bottom: 1px solid #ddd;
                    border-collapse: collapse;
                    text-align: center;
                  "
                >
                  &nbsp;{{ item.targetShow }}
                </td>
                <td
                  style="
                    border-left: 1px solid #ddd;
                    border-bottom: 1px solid #ddd;
                    border-collapse: collapse;
                    text-align: center;
                  "
                >
                  &nbsp;{{ item.startTime }}
                </td>
                <td
                  style="
                    border-left: 1px solid #ddd;
                    border-right: 1px solid #ddd;
                    border-bottom: 1px solid #ddd;
                    border-collapse: collapse;
                    text-align: center;
                  "
                >
                  &nbsp;{{ item.endTime }}
                </td>
              </tr>
            </table>

            <h3>
              三、奖励与处罚按《江西省公路桥梁工程有限公司安全生产奖惩办法》办理。
            </h3>
            <h3>
              四、本责任书一式二份。公司安全生产部执一份，责任部门执一份。
            </h3>
            <h3>
              五、本责任书期限{{ Years }}年1月1日至{{ Years }}年12月31日止。
            </h3>
            <div v-for="(item, i) in leadership" :key="i">
              <h4>{{ item.signPost }}</h4>
              <img
                :v-show="signShow"
                :src="$store.state.apiConfiguration.imgFileUrl + item.signUrl"
                style="width: 150px; height: 100px; margin-left: 90px"
              />
            </div>
            <hr style="width: 80%; margin: 40px auto; border-style: dotted" />

            <div style="width: 80%; margin: 30px auto; text-align: right">
              <div v-for="(item, i) in personCharge" :key="i">
                <h4>责任人：{{ item.signPost }}</h4>
                <img
                  :v-show="signShow"
                  :src="$store.state.apiConfiguration.imgFileUrl + item.signUrl"
                  style="width: 150px; height: 100px; margin-left: 90px"
                />
                <p>{{ item.signTime }}</p>
              </div>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button class="tBtn" @click="exportBtn">打印</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 新增弹出层 -->
    <el-dialog
      title="新增安全责任书"
      :visible.sync="dialogsafetyVisible"
      v-if="dialogsafetyVisible"
      custom-class="large"
      :close-on-click-modal="false"
    >
      <addsafety ref="safetyAddsafety" @addsafetyok="addsafetyok"></addsafety>
      <span slot="footer" class="dialog-footer">
        <el-button class="tBtn" @click="tBtnFun()">确 定</el-button>
        <el-button class="fBtn" @click="fBtnFun()">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSafetyList,
  getLookSafety,
  exportWord,
  getDelSafety,
} from "@/api/job/safety";
import addsafety from "./add";

// import {
//   isBasicDate,
// } from '@/utils/date.js'
import elementIcons from "@/views/system/menu/element-icons.js";
import { getDelete } from "@/api/safety/plan";

export default {
  components: { addsafety },
  data() {
    return {
      has: {
        remove: "system:userSafebook:remove",
        query: "system:userSafebook:list",
        add: "system:userSafebook:add",
        edit: "",
      },
      tableData: [],
      role: "",
      roleSelect: [],
      roleId: [],
      roleIdList: [],
      fromData: [],
      modelId: "",
      total: 0,
      pageSizes: [10, 15, 20, 25, 30],
      lookTit: "查看",
      //业务模块弹窗里的
      bussiness: {
        startRole: "",
        businessId: "",
        modelId: "",
        startDept: "",
      },
      userName: "",
      roleData: [],
      dialogVisible: false,
      dialogVisibleBussines: false,
      dialogsafetyVisible: false,
      //获取角色下拉
      //获取业务模块角色下拉

      bussiRoleSel: [],
      //获取业务模块下拉

      bussiModuleSel: [],

      //搜索
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        userName: "",
        createBy: "",
        createByTime: "",
        status: "",
      },
      fromBussiness: {
        bussiRolId: "",
        bussiModule: "",
      },
      //树形
      checkStrictly: true,
      defaultMenutree: [],
      deptOptions: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      workprocessId: "",
      itmeLabel: "",
      loading: false,
      //表单验证方法
      formRules: {},
      detailDate: {},
      flag: "",
      formLength: "",
      signShow: true,
      yearStr: "", //中文当前年
      Years: "", //字符串当前年
      leadership: [], //领导
      personCharge: [], //责任人
      delarr: [],
      multipleSelection: [],
    };
  },
  created: async function () {
    this.getAllList();
    this.convert();
  },
  computed: {},
  methods: {
    tBtnFun() {
      this.$refs.safetyAddsafety.submitForm("ruleForm");
    },
    fBtnFun() {
      this.$refs.safetyAddsafety.resetForm();
    },
    convert() {
      let dict = {
        0: "零",
        1: "一",
        2: "二",
        3: "三",
        4: "四",
        5: "五",
        6: "六",
        7: "七",
        8: "八",
        9: "九",
        10: "十",
      };
      let d = new Date();
      let year = d.toLocaleDateString();
      let date = year.split("/");
      let yy = date[0];
      this.Years = yy; //字符串年
      this.yearStr =
        dict[yy[0]] + dict[yy[1]] + dict[yy[2]] + dict[yy[3]] + "年";
      console.log(this.yearStr);
    },

    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    //新增
    handleAddS() {
      // this.flag = "Add";
      this.dialogsafetyVisible = true;
    },
    // 完成
    addsafetyok() {
      this.dialogsafetyVisible = false;
      this.getAllList();
    },
    //获取列表数据
    //获取列表
    async getAllList() {
      this.loading = true;
      const res = await getSafetyList(this.pageForm);
      this.tableData = res.rows;
      this.total = res.total;
      this.loading = false;
    },
    //查看
    async handleAdd(scope) {
      let safebookId = scope.row.safebookId;
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.detailDate = await getLookSafety(safebookId);
      this.formLength = this.detailDate.safebookTargets.length;
      if (
        this.detailDate.signUrl == "" ||
        this.detailDate.signUrl === undefined ||
        this.detailDate.signUrl === null
      ) {
        this.signShow = true;
      } else {
        this.signShow = false;
      }
      this.detailDate.safebookSigns.map((item) => {
        if (item.signType == 0) {
          this.leadership.push(item); //分管领导
        }
        if (item.signType == 1) {
          this.personCharge.push(item); //责任人
        }
      });
      // debugger
    },
    // async handleSet(scope) {
    //   this.$router.push({
    //     path: '/workChart/setJob',
    //     query: {
    //       'workprocessId': scope.row.workprocessId
    //     }
    //   })
    // },
    // 单个删除
    async deleteRow(row) {
      this.$confirm("确定删除吗?", "删除", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await getDelSafety(row);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getAllList();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // 批量删除
    async handleDel() {
      if (this.multipleSelection != "") {
        //审批中和审批完成的数据不允许删除
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].applyStatus != "0") {
            this.$message({
              type: "warning",
              message: "存在审批中或者审批已完成的数据，不能执行删除操作!",
            });
            return;
          }
        }
        this.$confirm("确定删除吗?", "删除", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            const length = this.multipleSelection.length;
            for (let i = 0; i < length; i++) {
              this.delarr.push(this.multipleSelection[i].safebookId);
              //审批中的数据不允许删除，给出相应友好提示
            }
            const yourArr = this.delarr;
            await getDelSafety(yourArr);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getAllList();
            this.$refs.multipleTable.clearSelection();
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        this.$message.error("请选择要删除项");
      }
    },
    //查看
    async handleDetail() {
      this.$router.push({
        path: "/people/lookPeople",
      });
    },
    //编辑
    async handleEdit(scope) {
      this.$router.push({
        path: "/workChart/edit",
        query: {
          workprocessId: scope.row.workprocessId,
        },
      });
    },
    //提交
    async handleSubmit(scope) {
      this.workprocessId = scope.row.workprocessId;
      var data = await getSubmitWorkchart(this.workprocessId);
      this.$notify({
        title: data ? "操作成功" : "操作失败",
        dangerouslyUseHTMLString: true,
        message: data ? data.message : "系统正在维护中，请与管理员联系",
        type: data ? "success" : "warning",
      });
      this.getAllList();
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getAllList();
    },

    ///页脚
    handleSizeChange(val) {
      this.pageForm.pageSize = val;
      this.getAllList();
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val;
      this.getAllList();
    },
    exportBtn() {
      exportWord({ safebookId: this.detailDate.safebookId });
    },
    //关闭弹框的事件
    closeDialog(formName) {
      this.leadership = []; //领导
      this.personCharge = []; //责任人
    },
  },
};
</script>

<style>
h3,
h4 {
  width: 80%;
  margin: 15px auto;
}

.title {
  width: 80%;
  margin: 0 auto;
  font-size: 22px;
  text-align: center;
  height: 35px;
  line-height: 35px;
  margin-bottom: 10px;
}

.title1 {
  width: 80%;
  margin: 0 auto;
  font-size: 22px;
  text-align: center;
  margin-bottom: 60px;
}

.title2 {
  width: 80%;
  margin: 0 auto;
  font-size: 36px;
  text-align: center;
  margin-bottom: 100px;
}

.title3 {
  width: 60%;
  margin: 0 auto;
  font-size: 16px;
  margin-bottom: 20px;
  padding-left: 90px;
}

.title-footr {
  font-size: 26px;
  text-align: center;
  margin-top: 100px;
  margin-bottom: 10px;
  font-family: cursive;
}

.title-yearStr {
  font-size: 26px;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  font-family: cursive;
}

.title-text {
  width: 80%;
  font-size: 16px;
  line-height: 30px;
  text-align: left;
  margin: 0 auto;
  text-indent: 2em;
}

.AAAA .el-table .cell {
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
}
</style>
<style lang="scss" scoped>
</style>