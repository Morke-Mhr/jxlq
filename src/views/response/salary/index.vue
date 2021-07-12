<template>
  <!--  人员薪酬-->
  <div class="safe_main">
    <!-- 查询 -->
    <div class="sxForm">
      <el-form :inline="true" :model="formInline" ref="formInline">
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="formInline.userName" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="发放日期" prop="payTime">
          <el-date-picker
            v-model="formInline.payTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="身份证号" prop="cardNum">
          <el-input
            v-model="formInline.cardNum"
            placeholder="身份证号"
          ></el-input>
        </el-form-item> -->
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model="formInline.deptName"
            placeholder="部门名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="岗位名称" prop="postName">
          <el-input
            v-model="formInline.postName"
            placeholder="岗位名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="薪酬月份" prop="salaryMonth">
          <el-date-picker
            v-model="formInline.salaryMonth"
            type="month"
            format="yyyy-MM"
            value-format="yyyy-MM"
            placeholder="选择月"
          ></el-date-picker>
        </el-form-item>
        <div class="btnCont">
          <el-button class="chaxun" @click="onSubmit">查询</el-button>
          <el-button class="chongzhi" @click="onClear('formInline')"
            >重置
          </el-button>
        </div>
      </el-form>
    </div>
    <div class="sxTable">
      <!-- 新增及删除 -->
      <el-button class="blue" v-has="has.import" @click="handleUpload()"
        >导入</el-button
      >
      <el-button class="blue" v-has="has.export" @click="handleDownload()"
        >导出</el-button
      >
      <el-button class="blue" v-has="has.add" @click="handleAdd()"
        >新增</el-button
      >
      <el-button class="blue" v-has="has.delete" @click="handleDelete()"
        >批量删除</el-button
      >
      <!-- 表格 -->
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
        height="calc(100vh - 370px)"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        stripe
      >
        <!-- 表格部分 -->
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          label="姓名"
          show-overflow-tooltip
          align="center"
          width="100px"
        >
          <template slot-scope="scope">{{ scope.row.userName }}</template>
        </el-table-column>
        <el-table-column label="身份证号" show-overflow-tooltip align="center">
          <template slot-scope="scope">{{ scope.row.cardNum }}</template>
        </el-table-column>
        <el-table-column label="部门名称" show-overflow-tooltip align="center">
          <template slot-scope="scope">{{ scope.row.deptName }}</template>
        </el-table-column>
        <el-table-column label="岗位名称" show-overflow-tooltip align="center">
          <template slot-scope="scope">{{ scope.row.postName }}</template>
        </el-table-column>
        <el-table-column
          label="薪酬月份"
          show-overflow-tooltip
          align="center"
          width="110px"
        >
          <template slot-scope="scope">{{ scope.row.salaryMonth }}</template>
        </el-table-column>
        <el-table-column
          label="发放日期"
          show-overflow-tooltip
          align="center"
          width="110px"
        >
          <template slot-scope="scope">{{ scope.row.payTime }}</template>
        </el-table-column>
        <el-table-column
          label="工资总额"
          show-overflow-tooltip
          align="center"
          width="110px"
        >
          <template slot-scope="scope">{{ scope.row.payMoney }}</template>
        </el-table-column>
        <el-table-column label="备注" show-overflow-tooltip align="center">
          <template slot-scope="scope">{{ scope.row.remark }}</template>
        </el-table-column>
        <el-table-column prop="cz" label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <!-- 这里可以拿到当前行的内容 row -->
            <el-button
              v-has="has.idQuery"
              size="small"
              type="text"
              style="margin-left: 0px"
              @click="goRedact(scope, tableData)"
              >编辑
            </el-button>
            <el-button
              size="small"
              class="red"
              type="text"
              v-has="has.delete"
              style="margin-left: 0px"
              @click.native.prevent="deleteRow(scope.row.userchangeId)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
      ></el-pagination>
      <el-dialog
        :title="titleType"
        :visible.sync="dialogFormVisible"
        @close="closeDialog"
        :close-on-click-modal="false"
        custom-class="small"
      >
        <template v-if="flag == false">
          <div style="margin-bottom: 20px">选择文件:</div>

          <el-upload
            ref="upload"
            :action="getUrl"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="1"
            :on-success="onSuccess"
            :headers="geHeaders"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :auto-upload="false"
          >
            <el-button>选取文件</el-button>
            <span slot="tip" class="el-upload__tip"
              >(请先下载模版，再根据下载的模版上传文件!!!)</span
            >
          </el-upload>
          <span slot="footer" class="dialog-footer">
            <el-button class="tBtn" @click="fileDownload()">下载模版</el-button>
            <el-button class="tBtn" @click="submitUpload">提交</el-button>
          </span>
        </template>
        <template v-else>
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="80px"
          >
            <el-form-item label="部门" prop="deptId">
              <el-cascader
                v-model="ruleForm.deptId"
                ref="myCascader"
                :options="arr"
                :props="optionProps"
                @change="handleChange"
                style="width: 100%"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="姓名" prop="realName">
              <el-select
                v-model="ruleForm.realName"
                placeholder="请选择"
                @change="ChangeNature"
              >
                <el-option
                  :props="PeopleProps"
                  v-for="item in nameArr"
                  :key="item.index"
                  :label="item.realName"
                  :value="item.realName"
                >
                  <span style="float: left">{{ item.realName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{
                    item.cardId
                  }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="薪酬月份" prop="salaryMonth">
              <el-date-picker
                v-model="ruleForm.salaryMonth"
                type="month"
                format="yyyy-MM"
                value-format="yyyy-MM"
                placeholder="选择月"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="发放日期" prop="payTime">
              <el-date-picker
                v-model="ruleForm.payTime"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="工资总额" prop="payMoney">
              <el-input
                v-model.number="ruleForm.payMoney"
                type="number"
                autocomplete="off"
                oninput="if(value.length>8)value=value.slice(0,8)"
                placeholder="请输入不超8位的数字"
              ></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                :rows="5"
                placeholder="请输入内容"
                maxlength="200"
                show-word-limit
                v-model="ruleForm.remark"
              ></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button
              v-has="has.add"
              class="tBtn"
              @click="submitForm('ruleForm')"
              v-if="isShow == false"
              >保存</el-button
            >
            <el-button
              v-has="has.edit"
              class="tBtn"
              @click="submitForm('ruleForm')"
              v-else
              >修改</el-button
            >
            <el-button class="fBtn" @click="resetForm('ruleForm')"
              >取 消</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getAddList,
  getList,
  getDelete,
  getInquire,
  getCheck,
  getBranch,
  getPeople,
} from "@/api/job/salary";
import axios from "axios";
import { getToken } from "@/utils/auth";

export default {
  data() {
    const validator = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入工资金额"));
      } else {
        if (value > 9999999.99) {
          callback(new Error("请输入工资金额不大于9999999.99"));
        }
        callback();
      }
    };

    return {
      has: {
        delete: "post.userSalary.deleteByIds",
        query: "post.userSalary.findListToWrapper",
        add: "post.userSalary.saveOrModify",
        idQuery: "post.userSalary.findById",
        import: "post.userSalary.importUserSalary",
        export: "post.userSalary.exportUserSalary",
      },
      optionProps: {
        value: "id",
        label: "label",
        checkStrictly: true,
      },
      PeopleProps: {
        value: "cardId",
        label: "realName",
      },
      arr: [],
      nameArr: [],
      tableData: [],
      flag: true, //查看按钮显示
      titleType: "",
      dialogFormVisible: false, //打开弹框
      loading: true,
      isShow: false,
      total: 0,
      multipleSelection: [], //全选
      delarr: [], //全选
      pageNum: 1, //默认当前页
      pageSize: 10,
      fileList: [],
      formInline: {
        userName: "",
        payTime: "",
        cardNum: "",
        deptName: "",
        postName: "",
        salaryMonth: "",
      },
      ruleForm: {
        //新增表单数据
        deptId: "",
        deptName: "",
        realName: "", //姓名
        userId: "",
        cardNum: "", //身份证号码
        salaryMonth: "",
        payTime: "",
        payMoney: "",
        remark: "",
      },
      rules: {
        deptId: [{ required: true, message: "部门", trigger: "change" }],
        realName: [{ required: true, message: "姓名", trigger: "change" }],
        salaryMonth: [
          { required: true, message: "薪酬月份", trigger: "change" },
        ],
        payTime: [{ required: true, message: "发放日期", trigger: "change" }],
        payMoney: [
          {
            required: true,
            trigger: "blur",
            validator: validator,
          },
        ],
      },
      hiddenTableHeader: false,
    };
  },
  created() {
    this.getList();
  },
  computed: {
    getUrl() {
      return (
        this.$store.state.apiConfiguration.url +
        this.$store.state.serviceName.regulation +
        "/userSalary/importUserSalary"
      );
    },
    geHeaders() {
      return {
        Authorization: getToken(),
      };
    },
  },
  watch: {},
  methods: {
    /**
     * 三级联动选择部门，名字，
     */
    handleChange(value) {
      if (value != undefined) {
        let deptname = this.$refs.myCascader.getCheckedNodes()[0].pathLabels;
        this.ruleForm.deptName = deptname.toString();
      }
      if (this.ruleForm.deptId != undefined) {
        this.ruleForm.deptId =
          this.ruleForm.deptId[this.ruleForm.deptId.length - 1];
        this.People();
      }
    },
    async People() {
      if (this.ruleForm.deptId != undefined) {
        var end = this.ruleForm.deptId;
        if (end != "") {
          this.nameArr = await getPeople(end);
        }
      }
    },
    //创建请求列表
    async getList() {
      let data = await getList();
      this.tableData = data.rows;
      this.total = data.total;
      this.loading = false;
    },
    //置空
    onClear(formName) {
      console.log(formName);
      this.$refs[formName].resetFields();
      this.onSubmit();
    },
    //选取人员的详细
    ChangeNature(e) {
      this.nameArr.map((item) => {
        if (item.realName == e) {
          this.ruleForm.userId = item.userId;
          this.ruleForm.cardNum = item.cardId;
        }
      });
    },

    //提交查询
    async onSubmit() {
      try {
        let { userName, payTime, cardNum, deptName, postName, salaryMonth } =
          this.formInline;
        this.pageNum = 1;
        this.pagesize = 10;
        let data = await getInquire(
          1,
          this.pageSize,
          userName,
          payTime,
          cardNum,
          deptName,
          postName,
          salaryMonth
        );
        this.tableData = data.rows;
        this.total = data.total;
        this.loading = false;
      } catch (e) {
        console.error("接口异常");
      }
    },
    //分页查询
    async onPaging() {
      try {
        let { userName, payTime, cardNum, deptName, postName, salaryMonth } =
          this.formInline;
        let data = await getInquire(
          this.pageNum,
          this.pageSize,
          userName,
          payTime,
          cardNum,
          deptName,
          postName,
          salaryMonth
        );
        this.tableData = data.rows;
        this.loading = false;
      } catch (e) {
        console.error("接口异常");
      }
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //删除单个
    deleteRow(row) {
      this.$confirm("确定删除吗?", "删除", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await getDelete(row);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.onPaging();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    //删除多个
    handleDelete() {
      console.log(this.multipleSelection);
      if (this.multipleSelection != "") {
        this.$confirm("确定删除吗?", "删除", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            const length = this.multipleSelection.length;
            for (let i = 0; i < length; i++) {
              this.delarr.push(this.multipleSelection[i].userchangeId);
            }
            const yourArr = JSON.parse(JSON.stringify(this.delarr));
            await getDelete(yourArr);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.onPaging();
            this.$refs.multipleTable.clearSelection();
          })
          .catch((err) => {
            console.error(err);
            this.$refs.multipleTable.clearSelection();
          });
      } else {
        this.$message.error("请选择要删除项");
      }
    },
    //新增
    async handleAdd() {
      this.titleType = "新增信息";
      this.dialogFormVisible = true;
      this.isShow = false;
      this.flag = true;
      this.arr = await getBranch();
      console.log(this.arr);
    },
    //编辑
    async goRedact(scope) {
      try {
        this.titleType = "编辑信息";
        this.dialogFormVisible = true;
        this.loading = false;
        this.isShow = true;
        let userchangeId = scope.row.userchangeId;
        let data = await getCheck(userchangeId);
        this.ruleForm = data;
        // this.ruleForm.realName = data.userInfoParam.realName;
        this.arr = await getBranch();
        this.People();
      } catch (e) {
        console.error("接口异常");
      }
    },
    //提交表单
    submitForm(formName) {
      console.log(this.ruleForm);
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) {
          this.$notify({
            title: "操作失败",
            dangerouslyUseHTMLString: true,
            message: "请填写完整",
            type: "warning",
          });
          return;
        }
        let data = null;
        try {
          let resdata = this.ruleForm;
          data = await getAddList(resdata);
          this.$refs[formName].resetFields();
          this.getList();
        } catch (e) {
          console.error("接口异常");
        }
        this.dialogFormVisible = false;
        this.$notify({
          title: data ? "成功" : "失败",
          dangerouslyUseHTMLString: true,
          message: data ? data.message : "添加失败 ",
          type: data ? "success" : "warning",
        });
      });
    },
    // 表单取消
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
    /**
     * 上传附件
     *
     */
    //导入
    handleUpload() {
      this.titleType = "导入";
      this.flag = false;
      this.dialogFormVisible = true;
    },
    submitUpload() {
      this.$refs.upload.submit();
      this.dialogFormVisible = false;
    },
    //导出
    async handleDownload() {
      // 导出接口
      axios({
        method: "get",
        url:
          this.$store.state.apiConfiguration.url +
          this.$store.state.serviceName.regulation +
          "/userSalary/exportUserSalary",
        responseType: "blob", // 表明返回服务器返回的数据类型
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken(),
        },
        data: {
          //接口参数
        },
      }).then(function (response) {
        //创建一个隐藏的a连接，
        const link = document.createElement("a");
        let blob = new Blob([response.data], {
          type: "application/vnd.ms-excel",
        });
        link.style.display = "none";
        //设置连接
        link.href = URL.createObjectURL(blob);
        link.download = "人员薪酬表.xlsx";
        document.body.appendChild(link);
        //模拟点击事件
        link.click();
      });
    },
    //下载模板
    async fileDownload() {
      // 导出接口
      axios({
        method: "get",
        url:
          this.$store.state.apiConfiguration.url +
          this.$store.state.serviceName.regulation +
          "/userSalary/downLoadTemplate",
        responseType: "blob", // 表明返回服务器返回的数据类型
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken(),
        },
        data: {
          //接口参数
        },
      }).then(function (response) {
        //创建一个隐藏的a连接，
        const link = document.createElement("a");
        let blob = new Blob([response.data], {
          type: "application/vnd.ms-excel",
        });
        link.style.display = "none";
        //设置连接
        link.href = URL.createObjectURL(blob);
        link.download = "人员薪酬表.xlsx";
        document.body.appendChild(link);
        //模拟点击事件
        link.click();
      });
    },
    onSuccess(response, file, fileList) {
      this.$notify({
        title: response.code == 200 ? "成功" : "失败",
        dangerouslyUseHTMLString: true,
        message: response.code != 200 ? response.body : "导入成功",
        type: response.code == 200 ? "success" : "warning",
      });
      this.getList();
      this.$refs.upload.clearFiles();
    },
    //文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    //文件超出个数限制时的钩子
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
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
    //关闭弹框的事件
    closeDialog(formName) {
      this.flag = true;
      this.ruleForm = {};
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  appearance: none !important;
}
</style>
