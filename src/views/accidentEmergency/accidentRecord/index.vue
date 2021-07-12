<template>
  <div class="content-box">
    <!-- 事故记录-->
    <div class="safe_main">
      <el-dialog
        :title="titleType + '事故记录'"
        :close-on-click-modal="false"
        custom-class="small"
        :visible.sync="dialogsgjlVisible"
        v-if="dialogsgjlVisible"
      >
        <add v-if="flag == 'add'" @func="getMsgFormSon" ref="add"></add>
        <examine
          @func="getMsgFormSon"
          :person="personData"
          v-if="flag == 'examine'"
        ></examine>
        <edit
          @func="getMsgFormSon"
          :person="personData"
          v-if="flag == 'edit'"
          ref="edit"
        ></edit>
        <span slot="footer" class="dialog-footer">
          <el-button
            class="tBtn"
            v-if="titleType != '查看'"
            @click="sume(titleType)"
            >提 交</el-button
          >
          <el-button class="fBtn" @click="dialogsgjlVisible = false"
            >取 消</el-button
          >
        </span>
      </el-dialog>
      <!-- 续报 -->
      <continue
        :person="personData"
        v-if="htmltype == 'continue'"
        @func="typehtml"
      ></continue>

      <div v-else-if="htmltype == 'index'">
        <!-- 查询 -->
        <template>
          <div class="sxForm">
            <el-form
              :inline="true"
              :model="formInline"
              ref="formInline"
              class="demo-form-inline"
            >
              <el-form-item label="事故性质" prop="natureNam">
                <el-select
                  v-model="formInline.natureNam"
                  @change="ChangeStatus"
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
              <el-form-item label="发生时间" prop="occurTime">
                <div class="block">
                  <el-date-picker
                    @change="changeTime"
                    v-model="formInline.occurTime"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期"
                  ></el-date-picker>
                </div>
              </el-form-item>
              <el-form-item label="发生地点" prop="occurPlace">
                <el-input
                  v-model="formInline.occurPlace"
                  placeholder="发生地点"
                ></el-input>
              </el-form-item>
              <!-- <el-form-item label="信息来源" prop="infoSource">
                <el-input v-model="formInline.infoSource" placeholder="信息来源"></el-input>
              </el-form-item> -->
              <el-form-item label="报送人" prop="createBy">
                <el-input
                  v-model="formInline.createBy"
                  placeholder="报送人"
                ></el-input>
              </el-form-item>
              <el-form-item label="报送部门" prop="createByDept">
                <el-input
                  v-model="formInline.createByDept"
                  placeholder="报送部门"
                ></el-input>
              </el-form-item>
              <!-- <el-form-item label="联系方式" prop="iphone">
                <el-input v-model="formInline.iphone" type="number" placeholder="联系方式"></el-input>
              </el-form-item> -->
              <div class="btnCont">
                <el-button v-has="has.query" class="chaxun" @click="onSubmit"
                  >查询</el-button
                >
                <el-button class="chongzhi" @click="onClear('formInline')"
                  >重置</el-button
                >
              </div>
            </el-form>
          </div>
        </template>
        <div class="sxTable">
          <!-- 新增及删除 -->
          <template>
            <div class="header-right">
              <el-button class="blue" v-has="has.add" @click="handleAdd()"
                >新增</el-button
              >
              <el-button class="blue" v-has="has.delete" @click="handleDelete()"
                >批量删除</el-button
              >
            </div>
          </template>
          <!-- 新增盒子 -->
          <!-- <el-dialog :title="titleType" :visible.sync="dialogFormVisible" @close="closeDialog">
            <el-form
              v-loading="loading"
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="80px"
              class="demo-ruleForm"
            >
            <div slot="footer" class="dialog-footer" v-show="flag">
              <el-button
                v-has="has.add"
                class="confirm-btn"
                @click="submitForm('ruleForm')"
                v-if="isShow==false"
              >确 定</el-button>
              <el-button v-has="has.edit" class="table-add-btn" @click="changeForm()" v-else>修改</el-button>
              <el-button class="cancel-btn" @click="resetForm('ruleForm')">取 消</el-button>
            </div>
          </el-dialog>-->
          <!-- 表格 -->
          <template>
            <el-table
              ref="multipleTable"
              v-loading="loading"
              :data="tableList"
              tooltip-effect="dark"
              style="width: 100%"
              height="calc(100vh - 370px)"
              @selection-change="handleSelectionChange"
              stripe
            >
              <!-- 表格部分 -->
              <template>
                <el-table-column
                  type="selection"
                  label="全选"
                  width="55"
                ></el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  label="事故性质"
                >
                  <template slot-scope="scope">{{ scope.row.nature }}</template>
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  label="发生时间"
                >
                  <template slot-scope="scope">
                    {{ scope.row.occurTime }}
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  label="联系方式"
                >
                  <template slot-scope="scope">{{ scope.row.iphone }}</template>
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  label="发生地点"
                >
                  <template slot-scope="scope">
                    {{ scope.row.occurPlace }}
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  label="信息来源"
                >
                  <template slot-scope="scope">
                    {{ scope.row.infoSource }}
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  label="报送人"
                >
                  <template slot-scope="scope">
                    {{ scope.row.createBy }}
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  label="报送部门"
                >
                  <template slot-scope="scope">
                    {{ scope.row.createByDept }}
                  </template>
                </el-table-column>

                <!-- 根据权限列表显示当前列的内容 -->
                <el-table-column prop="cz" label="操作">
                  <template slot-scope="scope">
                    <!-- 这里可以拿到当前行的内容 row -->
                    <el-button
                      v-has="has.idAdd"
                      size="small"
                      type="text"
                      style="margin-left: 10px"
                      @click="goContinue(scope, tableList)"
                      >续报</el-button
                    >
                    <el-button
                      v-has="has.idQuery"
                      size="small"
                      type="text"
                      style="margin-left: 10px"
                      @click="goCheck(scope, tableList)"
                      >查看</el-button
                    >

                    <el-button
                      v-has="has.idQuery"
                      size="small"
                      type="text"
                      style="margin-left: 10px"
                      @click="goRedact(scope, tableList)"
                      >编辑</el-button
                    >
                    <el-button
                      v-has="has.delete"
                      size="small"
                      class="red"
                      type="text"
                      style="margin-left: 10px"
                      @click.native.prevent="deleteRow(scope.row.accidentId)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </template>
            </el-table>
          </template>
          <!-- 分页器 -->
          <template>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNum"
              :page-sizes="[5, 10, 20, 50]"
              :page-size="pageSize"
              layout="total, prev, pager, next, sizes, jumper"
              :total="total"
            ></el-pagination>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getList,
  Classification,
  getInquire,
  getDelete,
} from "@/api/accidentEmergency/accidentRecord";
import add from "./add";
import examine from "./examine";
import edit from "./edit";
import Continue from "./continue";
export default {
  components: {
    add,
    examine,
    edit,
    Continue,
  },

  data() {
    return {
      has: {
        delete: "safemanage:accident:remove",
        query: "safemanage:accident:list",
        add: "safemanage:accident:add",
        edit: "safemanage:accident:edit",
        idQuery: "safemanage:accident:query",
        idAdd: "safemanage:accidentRenewal:list",
      },

      tableList: [],
      htmltype: "index",
      flag: "",
      dialogsgjlVisible: false,
      titleType: "",
      dialogFormVisible: false,
      loading: true,
      isShow: false,
      total: 0,
      multipleSelection: [],
      delarr: [], //全选
      pageNum: 1, //默认当前页
      pageSize: 10,
      fileDowloadName: "",
      //头部查询
      formInline: {
        nature: "",
        natureNam: "",
        occurTime: "",
        occurPlace: "",
        infoSource: "",
        createBy: "",
        createByDept: "",
        iphone: "",
      },

      options: [],
      //新增表单数据
      fileLists: [],
      hiddenTableHeader: false,
      personData: "",
    };
  },
  created() {
    this.getLists();
    this.Classifications();
  },
  computed: {},
  methods: {
    typehtml() {
      this.htmltype = "index";
    },
    // 提交
    sume(titleType) {
      if (titleType == "新增") {
        this.$refs.add.submitForm();
      } else if (titleType == "编辑") {
        this.$refs.edit.submitForm();
      }
    },
    //获取事故性质字典
    async Classifications() {
      let data = "accident_nature";
      this.options = await Classification(data);
    },
    //选择事故性质
    ChangeStatus(e) {
      let operUserIds = [];
      this.options.map((item) => {
        if (item.dictLabel == e) {
          operUserIds.push(item.dictCode);
        }
      });
      this.formInline.nature = operUserIds.toString();
    },

    //创建请求列表
    async getLists() {
      let data = await getList();
      this.tableList = data.rows;
      this.total = data.total;
      this.loading = false;
    },
    //重置
    onClear(formName) {
      this.$refs[formName].resetFields();
      this.getLists();
    },
    //时间置空
    changeTime(value) {
      this.$nextTick(() => {
        if (value == null) {
          this.formInline.occurTime = "";
          // this.formInline.testTime=""
        }
      });
    },

    //提交查询
    async onSubmit() {
      try {
        let {
          nature,
          occurTime,
          occurPlace,
          infoSource,
          createBy,
          createByDept,
          iphone,
        } = this.formInline;
        let data = await getInquire(
          1,
          this.pageSize,
          nature,
          occurTime,
          occurPlace,
          infoSource,
          createBy,
          createByDept,
          iphone
        );
        this.tableList = data.rows;
        this.total = data.total;
        this.loading = false;
      } catch (e) {
        console.error("接口异常");
      }
    },
    //提交查询
    async onPaging() {
      try {
        let {
          nature,
          occurTime,
          occurPlace,
          infoSource,
          createBy,
          createByDept,
          iphone,
        } = this.formInline;
        let data = await getInquire(
          this.pageNum,
          this.pageSize,
          nature,
          occurTime,
          occurPlace,
          infoSource,
          createBy,
          createByDept,
          iphone
        );
        this.tableList = data.rows;
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
          this.getLists();
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
              this.delarr.push(this.multipleSelection[i].accidentId);
            }
            const yourArr = this.delarr;
            await getDelete(yourArr);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getLists();
            this.$refs.multipleTable.clearSelection();
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        this.$message.error("请选择要删除项");
      }
    },
    //新增
    handleAdd() {
      this.flag = "add";
      this.titleType = "新增";
      this.dialogsgjlVisible = true;
    },
    //完成后回调
    getMsgFormSon() {
      this.dialogsgjlVisible = false;
      this.flag = "";
      this.getLists();
    },
    //查看
    goCheck(scope) {
      this.titleType = "查看";
      this.flag = "examine";
      this.personData = scope.row.accidentId;
      this.dialogsgjlVisible = true;
    },
    //编辑
    goRedact(scope) {
      this.titleType = "编辑";
      this.flag = "edit";
      this.personData = scope.row.accidentId;
      this.dialogsgjlVisible = true;
    },
    //续报
    goContinue(scope) {
      this.personData = scope.row.accidentId;
      this.htmltype = "continue";
    },

    //提交新增表单
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
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
        } catch (e) {
          console.error("接口异常");
        }
        this.dialogFormVisible = false;
        this.$refs.upload.clearFiles();
        this.getLists();
        this.$notify({
          title: data ? "成功" : "失败",
          dangerouslyUseHTMLString: true,
          message: data ? data.message : "服务器开小差了，请稍后再试",
          type: data ? "success" : "warning",
        });
      });
    },
    //修改
    async changeForm() {
      let data = null;
      try {
        let resdata = JSON.parse(JSON.stringify(this.ruleForm));
        data = await getChangeList(resdata);
      } catch (e) {
        console.error("接口异常");
      }
      this.dialogFormVisible = false;
      this.getLists();
      this.$notify({
        title: data ? "成功" : "失败",
        dangerouslyUseHTMLString: true,
        message: data ? data.message : "服务器开小差了，请稍后再试",
        type: data ? "success" : "warning",
      });
    },
    // 表单取消
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
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
      this.ruleForm.fileList = [];
      this.$refs.upload.clearFiles();
    },
  },
};
</script>

<style lang="scss" scoped>
.content-box {
  background-color: #f4f1f2;
  .inquire {
    display: flex;
    padding-top: 15px;
    margin-bottom: 15px;
    background-color: #fff;
    .demo-form-inline {
      margin-left: 20px;
    }
  }
  .content-bottom {
    background-color: #fff;
    padding: 15px;
    .upload {
      position: relative;
      .shade {
        position: absolute;
        right: 0;
        height: 100%;
        width: 30%;
        top: 0;
        z-index: 999999;
        background-color: #fff;
      }
    }

    .el-table th.gutter {
      /*
    * 解决element-ui 表格篡位的问题 👇
    */
      display: table-cell !important;
    }
    .el-button--small,
    .el-button--small.is-round {
      margin-left: 15px;
    }
    .el-pagination {
      display: flex;
      justify-content: flex-end;
      margin-top: 15px;
    }
  }
}
</style>
