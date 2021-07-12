<template>
  <div v-loading="loading">
    <el-steps :active="active" finish-status="success" style="padding: 10px">
      <el-step title="设置属性"></el-step>
      <el-step title="选择题组"></el-step>
      <el-step title="选择参考人员"></el-step>
      <el-step title="完成计划创建"></el-step>
    </el-steps>
    <el-tabs v-model="activeName" type="card" ref="tabs">
      <el-tab-pane label="计划属性" name="planattribute">
        <examPlanAttribute
          ref="examPlan"
          @submitFtrue="submitFtrue"
          @submitFfalse="submitFfalse"
        ></examPlanAttribute>
      </el-tab-pane>
      <el-tab-pane label="测验题组" name="exampaper">
        <div class="sxTable">
          <el-button class="blue" @click="paperseleted">题组选择</el-button>
          <el-button class="blue" @click="deleteexamplan">删除</el-button>
          <!-- 已选题组表格 -->
          <el-table
            :data="tableData"
            tooltip-effect="light"
            style="width: 100%"
            height="calc(100vh - 385px)"
            @selection-change="Selectedpaperchoice"
            v-loading="Selectedpaperchoiceloading"
            stripe
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="分类" show-overflow-tooltip width="110">
              <template slot-scope="scope">
                {{ scope.row.subjectName }}
              </template>
            </el-table-column>
            <el-table-column
              prop="disciplineName"
              label="主题"
              show-overflow-tooltip
            ></el-table-column>
            <!-- <el-table-column
              prop="gradeName"
              label="适应班级"
              width="200"
              show-overflow-tooltip
            ></el-table-column>-->
            <el-table-column
              prop="name"
              label="题组名称"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="paperTypeName"
              label="模板"
              show-overflow-tooltip
              width="110"
            ></el-table-column>
            <el-table-column
              prop="questionNum"
              label="题目数量"
              show-overflow-tooltip
              width="110"
            ></el-table-column>
            <el-table-column
              prop="totalScore"
              label="总分值"
              show-overflow-tooltip
              width="110"
            ></el-table-column>
            <el-table-column
              prop="passScore"
              label="及格分值"
              show-overflow-tooltip
              width="110"
            ></el-table-column>
          </el-table>
        </div>
        <!-- 所有选题组表格 -->
        <el-dialog
          title="题组"
          :visible.sync="dialogpaperVisible"
          custom-class="large"
          v-if="dialogpaperVisible"
          :close-on-click-modal="false"
          append-to-body
        >
          <el-table
            ref="table"
            :data="alltableData"
            tooltip-effect="light"
            style="width: 100%"
            row-key="paperId"
            @selection-change="allpaperchoice"
            v-loading="allpaperchoiceloading"
            stripe
          >
            <el-table-column
              :reserve-selection="true"
              type="selection"
              width="55"
            ></el-table-column>
            <el-table-column
              prop="subjectName"
              label="分类"
              width="110"
            ></el-table-column>
            <el-table-column
              prop="disciplineName"
              label="主题"
              show-overflow-tooltip
            ></el-table-column>
            <!-- <el-table-column
                prop="gradeName"
                label="适应班级"
                width="200"
                show-overflow-tooltip
              ></el-table-column>-->
            <el-table-column
              prop="name"
              label="题组名称"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="paperTypeName"
              label="模板"
              width="110"
            ></el-table-column>
            <el-table-column
              prop="questionNum"
              label="题目数量"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="totalScore"
              label="总分值"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="passScore"
              label="及格分值"
              width="100"
            ></el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            style="text-align: right"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            background
            layout="total, prev, pager, next,sizes,jumper"
            :total="total"
          ></el-pagination>

          <span slot="footer" class="dialog-footer">
            <el-button class="tBtn" @click="allpaper">确 定</el-button>
            <el-button class="fBtn" @click="dialogpaperVisible = false"
              >取 消</el-button
            >
          </span>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="参考人员" name="joinUserCount">
        <!--选择审批人盒子-->
        <sdialog
          ref="sdialog"
          @choiceUser="choiceUser"
          :isDx="false"
          :sNeed="true"
          :isCheckbox="true"
          needData="AAA"
          dxId="user"
          :transferProps="{
            key: 'userId',
            label: 'realName',
          }"
          :treedata="treedata"
        ></sdialog>
        <div class="sxTable">
          <!-- <span v-for="(item,i) in UserName" :key="i">
            </span>-->
          <el-button class="blue" @click="showSdialog">选择人员</el-button>

          <el-table
            :data="UserName"
            tooltip-effect="light"
            style="width: 100%"
            height="calc(100vh - 450px)"
            stripe
          >
            <el-table-column label="序号">
              <template slot-scope="scope">{{ scope.$index }}</template>
            </el-table-column>
            <!-- <el-table-column label="部门名称" >
                <template slot-scope="scope">{{ scope.row.deptName ? scope.row.deptName : scope.row.deptName }}</template>
              </el-table-column>-->
            <el-table-column label="人员名称">
              <template slot-scope="scope">
                {{
                  scope.row.realName ? scope.row.realName : scope.row.userName
                }}
              </template>
            </el-table-column>
          </el-table>
          <el-row>
            <el-col :offset="12" :span="12" style="text-align: right">
              <el-button class="tBtn" @click="preservation(1)"
                >仅保存</el-button
              >
              <el-button class="tBtn" @click="preservation(4)">提交</el-button>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="流程记录" name="Process">
        <div v-if="addeitd" class="planComplete">
          <i class="el-icon-success"></i>
          <h2>创建成功</h2>
          <p>已完成计划创建，待审核通过将发送给参考人员</p>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import examPlanAttribute from "./examPlanAttribute"; //计划属性表单
import Sdialog from "@/components/selectDialog";
import { getTreeSelect } from "@/api/system/process"; // 部门列表
import { postexamPlan } from "@/api/examination/index"; //新增计划
import { getExamPlanID } from "@/api/examination/index"; //根据ID获取计划详细信息
import { putexamPlan } from "@/api/examination/index"; //修改计划
import { getPaperList } from "@/api/examination/index"; //查询题组列表接口
import { getSelectType, getExamPlanIDuser } from "@/api/examination/index"; //字典 当前题组人员

export default {
  props: {
    addeitd: Boolean, //添加 true 修改false
    examIDPlan: String,
  },
  components: {
    examPlanAttribute: examPlanAttribute,
    Sdialog: Sdialog,
  },
  data() {
    return {
      has: {
        addplan: "exam:plan:add",
        putplan: "exam:plan:edit",
      },
      lastbuttoms: false,
      buttoms: true,
      active: 0,
      activeName: "planattribute",
      submitFome: false,
      dialogpaperVisible: false,
      bootn_type: "下一步",
      multipleSelection: [], //已选题组 列表 全选
      multipleSelectionIndex: [], //已选题组 列表 全选 ID
      allmultipleSelection: [], //所有题组 列表 全选
      treedata: [],
      ruleForm: {}, //填写的表单
      UserID: [], //选择的用户ID
      UserName: [],
      loading: false,
      allpaperchoiceloading: false, // 所有题组 加载状态
      Selectedpaperchoiceloading: false, // 已选题组 加载状态
      alltableData: [], //所有题组
      tableData: [
        //已选 题组
      ],
      step: [],
      // 分页
      currentPage: 1,
      pageSize: 10,
      total: 0,
    };
  },
  created() {
    if (!this.addeitd) {
      this.loading = true;
      this.getExamPlanID();
    }
  },
  mounted() {
    //   判断是新增还是修改
    // if (this.addeitd) {
    this.$refs.tabs.$children[0].$el.style.display = "none";
    // } else {
    // this.$refs.tabs.$children[0].$el.style.display = "block";
    // }
  },
  methods: {
    async getExamPlanID() {
      //如果是修改 获取当前计划详情
      //获取计划详情
      const res = await getExamPlanID(this.examIDPlan);
      console.log(res, 778787);
      delete res.paperList;
      delete res.userList;
      this.$refs.examPlan.getditeplanType(res, false);
      this.loading = false;
    },
    // 如果是修改的换 查题组
    async getpapermodify() {
      let paramsData = {
        flag: "paper",
      };
      const res = await getExamPlanID(this.examIDPlan, paramsData);
      let examIDPlan = {
        examPlanId: this.examIDPlan,
      };
      const userlist = await getExamPlanIDuser(examIDPlan);
      this.UserName = userlist;
      let userID = [];
      for (let item of userlist) {
        userID.push(item.userId);
      }
      this.UserID = userID;
      for (let item of res.paperList) {
        //根据当前ID对比字典 获取当前名称
        item.subjectName = this.filet(item.subjectId, this.subject);
        item.gradeName = this.filet(item.gradeId, this.grade);
        item.paperTypeName = this.filet(item.paperTypeId, this.paperType);
        item.disciplineName = this.filet(item.disciplineId, this.discipline);
      }
      this.tableData = res.paperList;
    },
    // 部门
    async showSdialog() {
      // 树形结构
      this.treedata = await getTreeSelect();
      this.$refs.sdialog.isShow = true;
    },
    choiceUser(UserID, UserObject) {
      //子组件 选择参与人 完成后调用的事件
      this.UserID = UserID;

      if (this.UserID.length == 0) {
        this.$message({
          message: "请选择参考人员",
          type: "warning",
        });
        return;
      }
      console.log(UserObject, 88888);
      this.UserName = UserObject; //获取选中的名字

      this.$refs.sdialog.isShow = false;
    },
    // 上一步
    last() {
      if (this.active == 1) {
        this.lastbuttoms = false;
        this.active = 0;
        this.activeName = "planattribute";
      } else if (this.active == 2) {
        this.buttoms = true;
        this.active = 1;
        this.activeName = "exampaper";
      }
    },
    //   下一步
    next() {
      if (this.active++ > 3) {
        // 所有 步骤完成 提交 +
        this.$emit("planComplete");
        this.active = 0;
      }
      if (this.active == 0) {
        this.bootn_type = "下一步";
        this.activeName = "planattribute";
        this.lastbuttoms = false;
      } else if (this.active == 1) {
        this.$refs.examPlan.submitForm("ruleForm");
        if (this.submitFome) {
          this.getselect();
          this.activeName = "exampaper";
          this.lastbuttoms = true;
        } else {
          this.active = 0;
        }
      } else if (this.active == 2) {
        if (this.tableData.length > 0) {
          this.activeName = "joinUserCount";
          this.buttoms = false;
          if (this.addeitd) {
            this.showSdialog();
          }
        } else {
          this.active = 1;
          this.$message({
            message: "题组不能为空喔",
            type: "warning",
          });
        }
      } else if (this.active == 4) {
        this.lastbuttoms = false;
        this.activeName = "Process";
        this.bootn_type = "完成";
      }
    },
    // 题组新增按钮
    paperseleted() {
      this.pageSize = 10;
      this.currentPage = 1;
      this.getPaper();
      this.dialogpaperVisible = true;
    },
    // 查找题组
    async getPaper() {
      this.allpaperchoiceloading = true;
      let params = {
        flag: "official",
        pageSize: this.pageSize,
        pageNum: this.currentPage,
      };
      console.log(params, 777);
      const res = await getPaperList(params); //sadasd
      this.alltableData = res.rows;
      this.total = res.total;
      for (let item of this.alltableData) {
        //根据当前ID对比字典 获取当前名称
        item.subjectName = this.filet(item.subjectId, this.subject);
        item.gradeName = this.filet(item.gradeId, this.grade);
        item.paperTypeName = this.filet(item.paperTypeId, this.paperType);
        item.disciplineName = this.filet(item.disciplineId, this.discipline);
      }
      this.allpaperchoiceloading = false;
      console.log(this.alltableData, 12199);
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPaper();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPaper();
    },
    async getselect() {
      this.subject = await getSelectType("exam_subject");
      this.grade = await getSelectType("exam_grade");
      this.paperType = await getSelectType("exam_paperType");
      this.discipline = await getSelectType("exam_discipline");
      //如果是修改
      if (!this.addeitd) {
        this.getpapermodify();
      }
    },
    // 从所有题组中确定选择
    allpaper() {
      this.dialogpaperVisible = false;
      this.tableData = this.allmultipleSelection;
      this.$refs.table.clearSelection();
    },
    // 过滤器
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

    // 修改的确定按钮
    determine() {
      if (this.tableData.length < 1) {
        //题组不为空
        this.$message({
          message: "测验计划至少要有一个题组",
          type: "warning",
        });
        return;
      }
      this.$refs.examPlan.submitForm("ruleForm"); //调用子组件的表单验证
      if (!this.submitFome) {
        //this.submitFome   子组件返回1的验证结果
        this.$message({
          message: "请填写完整计划属性",
          type: "warning",
        });
        return;
      }
      this.addexampaln(); //如果 通过 执行发送请求
    },
    submitFtrue(ruleForm) {
      //表单验证成功
      this.submitFome = true;
      this.ruleForm = ruleForm;
      console.log(ruleForm, "true");
    },
    submitFfalse() {
      //表单验证失败
      this.submitFome = false;
    },
    //全选
    Selectedpaperchoice(val) {
      let t = [];
      val.forEach((val, index) => {
        this.tableData.forEach((v, i) => {
          //  paperId是每一行的数据subId
          if (val.paperId == v.paperId) {
            t.push(i);
          }
        });
      });
      this.multipleSelectionIndex = t;
      this.multipleSelection = val;
    },
    // 所有题组列表 全选
    allpaperchoice(v) {
      this.allmultipleSelection = v;
    },
    // 仅保存  发送
    preservation(statu) {
      if (statu != 4) {
        if (this.addeitd) {
          this.active++;
        }
        this.next();
      }
      this.loading = true;
      this.addexampaln(statu);
    },

    async addexampaln(statu) {
      //发送 新增或者修改请求
      let planPaperIdList = []; //把题组id合成数组
      for (let t of this.tableData) {
        planPaperIdList.push(t.paperId + "");
      }
      if (!this.addeitd) {
        //如果是修改的话 加上当前修改的计划ID
        this.ruleForm.examPlanId = this.examIDPlan;
      }
      this.ruleForm.planPaperIdList = planPaperIdList;
      this.ruleForm.planUserIdList = this.UserID;
      if (statu == 1) {
        this.ruleForm.status = 1;
      } else if (statu == 4) {
        this.ruleForm.status = 4;
      }
      if (this.addeitd) {
        let resData = await postexamPlan(this.ruleForm);
        if (resData != "false") {
          this.active++;
          this.next();
          let myVar = setTimeout(() => {
            this.$emit("planComplete");
            clearTimeout(myVar);
          }, 1200);
        } else {
          this.$message({
            message: "测验数据已存在",
            type: "warning",
          });
          this.loading = false;
          console.log(resData, "有数据");

          return;
        }
      } else {
        const res = await putexamPlan(this.ruleForm);
        if (res == "数据已提交，不能再次修改！") {
          this.$message({
            message: res,
            type: "warning",
          });
          this.$emit("planComplete");
        } else {
          this.$message.success(res);
        }
      }
      if (!this.addeitd) {
        //如果是修改的话 直接关闭当前弹出层
        this.$emit("planComplete");
      }
      this.loading = false;
    },
    // 删除
    deleteexamplan() {
      if (this.multipleSelectionIndex.length == 0) {
        this.$message({
          message: "请选择题组",
          type: "warning",
        });
        return;
      }
      this.multipleSelectionIndex
        .sort(function (a, b) {
          return a - b;
        })
        .reverse(); //将已选中数组在原数组下标排序并倒序
      for (let i of this.multipleSelectionIndex) {
        //逆向循环
        this.tableData.splice(i, 1);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.planComplete {
  margin-top: 2rem;
  text-align: center;
}
.planComplete > i {
  font-size: 6rem;
}
</style>
