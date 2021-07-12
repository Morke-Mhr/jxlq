<template>
  <!-- 安全检查记录 -->
  <div class="safe_main">
    <div class="sxForm">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="检查类别">
          <el-select
            v-model="formInline.checkCategoryId"
            placeholder="请选择"
            @visible-change="$forceUpdate()"
          >
            <el-option
              v-for="item in jcList"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组织人">
          <el-input v-model="formInline.leadUser"></el-input>
        </el-form-item>
        <el-form-item label="被检查部门">
          <el-input v-model="formInline.becheckDept"></el-input>
        </el-form-item>
        <el-form-item label="完成时间">
          <el-date-picker
            v-model="formInline.finishTime"
            type="datetime"
            placeholder="选择日期时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="检查状态">
          <el-select v-model="formInline.safeCheckStatus" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <div class="btnCont">
          <el-button class="chaxun" @click="onSubmit" v-has="has.query"
            >查询
          </el-button>
          <el-button class="chongzhi" @click="resetBtn" v-has="has.query"
            >重置
          </el-button>
        </div>
      </el-form>
    </div>
    <div class="sxTable">
      <el-button @click="addSafety" class="blue" v-has="has.submitSafecheck"
        >新增安全检查计划
      </el-button>
      <el-button @click="open(true)" class="blue" v-has="has.deletes"
        >批量删除</el-button
      >
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="light"
        style="width: 100%"
        height="calc(100vh - 370px)"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column
          label="计划检查日期"
          prop="planCheckTime"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="checkClass"
          label="检查分类"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="checkCategory"
          label="检查类别"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="leadUser"
          label="组织人"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="becheckDept"
          label="被检查部门"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="safeCheckStatus"
          label="检查状态"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.safeCheckStatus == '0'">未完成</span>
            <span v-if="scope.row.safeCheckStatus == '1'">已完成</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="finishTime"
          label="完成时间"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column align="center" label="审批状态" width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.status == '0'">不审批</span>
            <span v-if="scope.row.status == '1'" style="color: #409eff"
              >审批中</span
            >
            <span v-if="scope.row.status == '2'" style="color: #ff0000"
              >已驳回</span
            >
            <span v-if="scope.row.status == '3'" style="color: #0eb83a"
              >已完成</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="chakan(scope.row)"
              v-has="has.viewDetail"
              >查看
            </el-button>
            <el-button
              type="text"
              @click="associatedBtn(scope.row.safecheckId)"
              v-has="has.getRelatedYhList"
              >查看关联隐患
            </el-button>
            <el-button
              type="text"
              :disabled="scope.row.status != '0'"
              class="red"
              @click="deleteRow(scope.row.safecheckId)"
              v-has="has.deletes"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[1, 10, 20, 30]"
        :page-size="formInline.pageSize"
        background
        layout=" total, prev, pager, next, sizes, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog
      title="查看"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      custom-class="large"
    >
      <div class="formTitle height40">详情</div>
      <div style="overflow: auto">
        <el-form
          ref="form"
          :model="diaDataList"
          style="width: 100%; padding: 1rem"
        >
          <el-row
            :gutter="20"
            v-for="(rowItem, rowIndex) in [rowsOne, rowsTwo]"
            :key="rowIndex"
          >
            <el-col
              :span="6"
              v-for="(colItem, colIndex) in rowItem"
              :key="colIndex"
            >
              <el-form-item :label="colItem.label">
                <span>{{ diaDataList[colItem.propVal] }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="formTitle height40">检查内容</div>
      <el-table
        ref="multipleTable"
        :data="diaDataList.contentList"
        tooltip-effect="light"
        style="width: 100%"
        stripe
      >
        <el-table-column
          v-for="(item, index) in diaTable"
          :key="index"
          :label="item.label"
          :prop="item.propVal"
          show-overflow-tooltip
        >
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="新增安全检查计划"
      :close-on-click-modal="false"
      :visible.sync="addVisible"
      custom-class="large"
    >
      <add-safety-record
        v-if="addVisible"
        @callFather="getData('cx')"
        ref="addSafetyRecord"
      ></add-safety-record>
      <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="addVisible = false">取 消</el-button>
        <el-button class="tBtn" @click="submitFun">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      title="已关联的隐患"
      :visible.sync="recordVisible"
      custom-class="large"
    >
      <yh-record v-if="recordVisible" :safecheckId="rowSafecheckId"></yh-record>
      <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="recordVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryAll,
  deletes,
  viewDetail,
  dictType,
} from "@/api/hiddenDanger/security";
import addSafetyRecord from "../addSafetyRecord";
import yhRecord from "../yhRecord";
import { getDelSafety } from "@/api/job/safety";

const defaultPageSize = 10;
export default {
  components: {
    addSafetyRecord,
    yhRecord,
  },
  data() {
    return {
      // 检查类别
      jcList: [],
      formInline: {
        checkCategoryId: "",
        leadUser: "",
        becheckDept: "",
        finishTime: null,
        pageSize: defaultPageSize,
        pageNum: "1",
        safeCheckStatus: "",
      },
      has: {
        // 安全检查记录 查询
        query: "safecheck:post:queryAll",
        // 安全检查记录 删除
        deletes: "safecheck:post:deletes",
        // 安全检查记录 详情查看
        viewDetail: "safecheck:post:viewDetail",
        // 安全检查记录 新增
        submitSafecheck: "safecheck:post:submitSafecheck",
        // 安全检查记录 关联隐患查询
        getRelatedYhList: "hiddendanger:safecheck:getRelatedYhList",
      },
      tableData: [],
      //总条目
      total: 0,
      // 当前页数
      currentPage: 1,
      //默认当前页
      pageNum: 1,
      // 所选中项的id
      delArr: [],
      dialogVisible: false,
      addVisible: false,
      recordVisible: false,
      diaDataList: {},
      // 选中行的隐患id
      rowSafecheckId: "",
      rowsOne: [
        { label: "检查类别", propVal: "checkCategory" },
        { label: "计划检查时间", propVal: "planCheckTime" },
        { label: "组织部门", propVal: "leadDept" },
        { label: "组织人", propVal: "leadUser" },
      ],
      rowsTwo: [
        { label: "检查分类", propVal: "checkClass" },
        { label: "被检查单位", propVal: "becheckDept" },
        { label: "完成时间", propVal: "finishTime" },
        // { label: '验收人', propVal: 'ysr' },
        // { label: '验收意见', propVal: 'ysyj' }
      ],
      diaTable: [
        { label: "项目", propVal: "projectName" },
        { label: "检查内容", propVal: "checkContent" },
        { label: "检查责任部门", propVal: "checkDutyDept" },
        { label: "检查责任人", propVal: "checkDutyUser" },
        { label: "是否安全", propVal: "problemTxt" },
        { label: "检查时间", propVal: "planCheckTime" },
      ],
      problemList: { 0: "否 ", 1: "是" },
      multipleSelection: [],
      delarr: [],
      options: [
        {
          value: 0,
          label: "未完成",
        },
        {
          value: 1,
          label: "已完成",
        },
      ],
    };
  },
  methods: {
    submitFun() {
      this.$refs.addSafetyRecord.submitFun("form");
    },
    onSubmit() {
      this.getData("cx");
    },
    handleSizeChange(val) {
      this.formInline.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.formInline.pageNum = val;
      this.getData();
    },
    async getData(cx) {
      console.log(this.formInline);
      if (cx == "cx") {
        this.formInline.pageNum = 1;
        this.currentPage = 1;
      }
      let res = await queryAll(this.formInline);
      this.total = res.total;
      this.tableData = res.rows;
      console.log(this.tableData, "this.tableData");
    },
    async selDelect() {
      let newArr = this.delArr.map((item) => {
        return item.safecheckId;
      });
      if (newArr.length > 0) {
        var res = await deletes(newArr);
        this.$message.success(res);

        const totalPage = Math.ceil(
          (this.total - newArr.length) / this.formInline.pageSize
        );
        //记录当前页码
        console.log(totalPage);
        const pagenum =
          this.formInline.pageNum > totalPage
            ? totalPage
            : this.formInline.pageNum;
        //实现跳转
        this.formInline.pageNum = pagenum < 1 ? 1 : pagenum;

        this.getData();
      } else {
        this.$message.warning("请确认是否勾选");
      }
    },
    handleSelectionChange(val) {
      this.delArr = val;
      this.multipleSelection = val;
    },
    async delBtn() {
      // console.log(this.rowSafecheckId)
      // var res = await deletes([this.rowSafecheckId])
      // this.$message.success(res)
      // const totalPage = Math.ceil((this.total - 1) / this.formInline.pageSize)
      // //记录当前页码
      // //记住删除最后一条数据时当前码是最后一页
      // const pagenum =
      //     this.formInline.pageNum > totalPage
      //         ? totalPage
      //         : this.formInline.pageNum
      // //实现跳转
      // this.formInline.pageNum = pagenum < 1 ? 1 : pagenum
      // this.getData()
    },
    async chakan(val) {
      this.diaDataList = await viewDetail({ safecheckId: val.safecheckId });
      this.diaDataList.contentList.forEach((item) => {
        item.problemTxt = this.problemList[item.problem];
      });
      this.dialogVisible = true;
      console.log("查看", this.diaDataList);
    },
    addSafety() {
      this.addVisible = true;
    },
    // 单个删除
    async deleteRow(row) {
      let rowArr = [];
      rowArr.push(row);
      this.$confirm("确定删除吗?", "删除", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await deletes(rowArr);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getData();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // 批量删除
    open(isbool, safecheckId) {
      if (this.multipleSelection != "") {
        //审批中和审批完成的数据不允许删除
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].status != "0") {
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
              this.delarr.push(this.multipleSelection[i].safecheckId);
              //审批中的数据不允许删除，给出相应友好提示
            }
            const yourArr = this.delarr;
            await deletes(yourArr);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getData();
            this.$refs.multipleTable.clearSelection();
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        this.$message.error("请选择要删除项");
      }
      // this.$confirm('正在执行删除操作, 是否继续?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      // })
      //     .then(() => {
      //         if (!isbool) {
      //             this.rowSafecheckId = safecheckId
      //             this.delBtn()
      //         } else if (isbool) {
      //             this.selDelect()
      //         }
      //     })
      //     .catch(() => {
      //         this.$message({
      //             type: 'info',
      //             message: '已取消删除'
      //         })
      //     })
    },
    associatedBtn(safecheckId) {
      this.rowSafecheckId = safecheckId;
      this.recordVisible = true;
    },
    // 重置
    resetBtn() {
      this.formInline = {
        ...this.formInline,
        ...{
          checkCategoryId: "",
          leadUser: "",
          becheckDept: "",
          finishTime: null,
          safeCheckStatus:'',
        },
      };
      this.getData("cx");
    },
  },
  async created() {
    this.getData();
    // 检查类别
    this.jcList = await dictType("safecheck_category");
  },
};
</script>
<style lang="scss" scoped></style>
