<template>
  <div class="container-table">
    <div class="table-list confide-content">
      <el-form
        :model="addConfide"
        :rules="formRules"
        class="clearfix"
        ref="operationFome"
        label-width="150px"
        label-position="right"
      >
        <el-form-item
          label="方案名称"
          prop="programName"
          style="margin-bottom:0px"
        >
          <el-input
            v-model="addConfide.programName"
            maxlength="30"
            readonly="true"
            show-word-limit
            placeholder="请输入方案名称"
          />
        </el-form-item>
        <el-form-item >
        <div @click="chooseList"  class="choose-list">选择列表</div>
        </el-form-item>

      </el-form>
      <!-- <div style="text-align:right;marigin-top:20px">
        <el-button class="confirm-btn" @click="confirm">
          提交
        </el-button>
        <el-button class="cancel-btn" @click="cancelBtn">
          取消
        </el-button>
      </div>-->

      <!--新增盒子-->
      <el-dialog
        :visible.sync="dialogVisible"
        custom-class="large"
        append-to-body
        :title="'技术方案列表'"
      >
        <el-form :inline="true" :model="addPageForm" ref="pageForm" class="demo-form-inline">
          <el-form-item prop="programName" label="方案名称">
            <el-input v-model="addPageForm.programName" maxlength="30" placeholder="请输入技术方案名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="chaxun"
              icon="el-icon-search"
              v-has="has.query"
              @click="getTech('cx')"
            >查询</el-button>
            <el-button @click="resetForm('pageForm')" class="chongzhi">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="addTableData"
          v-loading="loading"
          style="width: 100%;margin-top:30px;"
          @selection-change="handleSelectionChange"
          row-key="menuId"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          stripe
        >
          <el-table-column align="left" label="方案名称">
            <template slot-scope="scope">
              <el-radio
                @change="selectData"
                v-model="radio"
                :label="scope.row"
              >{{ scope.row.programName }}</el-radio>
            </template>
          </el-table-column>
          <el-table-column align="left" label="方案性质">
            <template slot-scope="scope">{{ scope.row.nature }}</template>>
          </el-table-column>
          <el-table-column align="left" label="方案类别">
            <template slot-scope="scope">{{ scope.row.category }}</template>>
          </el-table-column>
          <el-table-column align="left" label="项目名称">
            <template slot-scope="scope">{{ scope.row.projectDept }}</template>>
          </el-table-column>
          <el-table-column align="left" label="标段">
            <template slot-scope="scope">{{ scope.row.bid }}</template>>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="addTotal"
          :current-page.sync="currentPage"
          :page-sizes="addPageSizes"
          :page-size="addPageForm.pageSize"
          @size-change="addHandleSizeChange"
          @current-change="addHandleCurrentChange"
        ></el-pagination>
        <div style="text-align:right;margin-top:20px">
          <el-button class="confirm-btn" @click="selectItem">提交</el-button>
          <el-button class="cancel-btn" @click="fBtn">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getSpecia } from "@/api/technology/specialist/specialist.js";
import { getSelectTechItem } from "@/api/system/class";
import { getTechnologyList } from "@/api/technology/item/item.js";
import { getWorkProgramList } from "@/api/technology/item/item.js";

export default {
  name: "index",
  data() {
    return {
      radio: 1,
      selData: "",
      // 当前页数
      currentPage: 1,
      thirdLevelCheckboxModel: [],
      checkedDeptIndex: 0,

      jdUserOption: [],
      firstLevelRadio: {
        checkerUserId: "",
        nextChargerUserId: ""
      },
      secondLevelRadio: {
        checkerUserId: "",
        nextChargerUserId: ""
      },
      thirdLevelRadio: {
        checkerUserId: "",
        nextChargerUserId: ""
      },

      firstLevel: {
        level: 1,
        type: "oneLevel"
      },
      secondLevel: {
        level: 2,
        type: "twoLevel"
      },
      thirdLevel: {
        level: 3,
        type: "threeLevel"
      },
      disabledChoose: false,
      disabledChooseNext: false,
      disabledChooseTwo: false,
      disabledChooseNextTwo: false,
      disabledChooseOne: false,
      disabledChooseNextOne: false,
      oneJd: "",
      oneNext: "",
      twoJd: "",
      twoNext: "",
      threeJd: "",
      threeNext: "",
      deptPersonProps: {
        key: "userId",
        label: "realName",
        disabled: false
      },
      selectDeptIndex: 1,
      data: [],
      value: [],
      has: {
        remove: "system:dept:remove",
        query: "system:dept:query",
        add: "system:dept:add",
        edit: "system:dept:edit"
      },
      dialogVisibleDept: false,
      //搜索  项目清单
      confideItem: ["1"],
      //选择列表 项目清单
      addTotal: 0,
      addPageSizes: [5],
      addPageForm: {
        pageNum: 1,
        pageSize: 5,
        jdTypeId: "",
        programName: "",
        bid: "",
        engineName: "",
        jdUser: "",
        projectTypeId: "",
        projectProcessId: ""
      },
      jobProps: {
        value: "id",
        label: "label",
        checkStrictly: true
      },
      arr: [],
      //类别
      categoryRes: [],
      addConfide: {
        programName: "",
        programId: "",
        natureId: "",
        nature: "",
        categoryId: "",
        category: "",
        projectName: "",
        projectId: "",
        bid: "",
        expertReviewFileList: []
      },
      confideItemList: false,
      flag: true,
      defaultMenutree: [],
      multipleSelection: [],
      //穿梭框列表
      transferList: [],
      //穿梭框文件id数组
      transferListId: [],

      //选择列表
      addTableData: [],
      loading: false,
      tableData: [],
      tableKey: 0,
      listLoading: false,
      dialogVisible: false,
      dialogType: "new",
      deptOptions: [],
      fileLists: [],
      checkStrictly: true,
      defaultProps: {
        children: "children",
        label: "label"
      },
      //部门名称
      deptLabel: [],
      currentChecke: "",
      //性质
      natureRes: [],
      //方案类别数组
      typeRes: [],
      //类别
      confideRes: [],
      //选择的部门id
      chooseDeptId: "",
      deptPerson: null,
      //表单验证方法
      formRules: {
        programName: [
          {
            required: true,
            message: "请输入方案名称",
            trigger: "change"
          }
        ],
        natureId: [
          {
            required: true,
            message: "请选择方案性质",
            trigger: "blur"
          }
        ],
        categoryId: [
          {
            required: true,
            message: "请选择方案类别",
            trigger: "blur"
          }
        ],
        projectName: [
          {
            required: true,
            message: "请选择项目名称",
            trigger: "blur"
          }
        ],
        bid: [
          {
            required: true,
            message: "请选择标段",
            trigger: "blur"
          }
        ],
        expertReviewFileList: [
          {
            required: true,
            message: "请选择附件",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    getUrl() {
      return (
        this.$store.state.apiConfiguration.url +
        "jxlq-system-service" +
        "/fs/upload"
      );
    }
  },
  created: async function() {
    this.getNatureSel();
    this.getTypeSel();
  },
  methods: {
    //取消操作

    //获取方案性质下拉
    async getNatureSel() {
      let dictName = "program_nature";
      this.natureRes = await getSelectTechItem(dictName);
    },
    //选择项目清单分页列表触发事件
    selectData(val) {
      console.log(val, this.radio);
      this.selData = val;
    },
    //获取方案类别下拉
    //获取方案类别下拉
    async getTypeSel() {
      let dictName = "scheme_category";
      this.categoryRes = await getSelectTechItem(dictName);
    },
    //获取方案性质id
    peojectFunc(val, vIndex) {
      let resultArr = this.natureRes.filter(item => {
        return item.dictCode === val;
      });
      //把值赋给要传给后台的表单对象中
      this.addConfide.natureId = resultArr[0].dictCode;
      this.addConfide.nature = resultArr[0].dictLabel; //直接写val也可以
    },
    //获取项目类型下拉id
    peojectTypeFunc(val, vIndex) {
      let resultArr = this.categoryRes.filter(item => {
        return item.dictCode === val;
      });
      //把值赋给要传给后台的表单对象中
      this.addConfide.categoryId = resultArr[0].dictCode;
      this.addConfide.category = resultArr[0].dictLabel; //直接写val也可以
    },
    //对否为下级交底人 change 事件
    radioGroupNextChargerChange(label, index, userIndex, name) {
      console.log(
        "radioGroupNextChargerChange:",
        label,
        index,
        userIndex,
        name
      );
      let checkedIndexFlag;
      let checkedNextUserId = "";
      let indexFlag;
      if (label === "1") {
        switch (index) {
          case 1:
            for (let temUserIndex in this.firstLevel.userList) {
              this.firstLevel.userList[temUserIndex].isNextCharger = "0";
              //获取已经选中的下级交底人在用户列表中的下标
              if (
                this.firstLevel.userList[temUserIndex].bottonUserId ==
                this.firstLevelRadio.nextChargerUserId
              ) {
                checkedIndexFlag = temUserIndex;
              }
              //获取当前选中下级交底人在用户列表的下标和用户id
              if (temUserIndex == userIndex) {
                indexFlag = temUserIndex;
                checkedNextUserId = this.firstLevel.userList[temUserIndex]
                  .bottonUserId;
              }
            }
            if (this.firstLevelRadio.checkerUserId == checkedNextUserId) {
              if (checkedNextUserId && checkedIndexFlag) {
                this.firstLevel.userList[checkedIndexFlag].isNextCharger = "1";
              }
              this.firstLevel.userList[indexFlag].isNextCharger = "0";
              //不能同一人
              this.$message({
                message: "监督人和技术交底人不能为同一人",
                type: "warning"
              });
              return false;
            }
            this.firstLevel.userList[indexFlag].isNextCharger = "1";
            this.firstLevelRadio.nextChargerUserId = checkedNextUserId;
            break;
          case 2:
            for (let temUserIndex in this.secondLevel.userList) {
              this.secondLevel.userList[temUserIndex].isNextCharger = "0";
              //获取已经选中的下级交底人在用户列表中的下标
              if (
                this.secondLevel.userList[temUserIndex].bottonUserId ==
                this.secondLevelRadio.nextChargerUserId
              ) {
                checkedIndexFlag = temUserIndex;
              }
              //获取当前选中下级交底人在用户列表的下标和用户id
              if (temUserIndex == userIndex) {
                indexFlag = temUserIndex;
                checkedNextUserId = this.secondLevel.userList[temUserIndex]
                  .bottonUserId;
              }
            }
            if (this.secondLevelRadio.checkerUserId == checkedNextUserId) {
              if (checkedNextUserId && checkedIndexFlag) {
                this.secondLevel.userList[checkedIndexFlag].isNextCharger = "1";
              }
              this.secondLevel.userList[indexFlag].isNextCharger = "0";
              //不能同一人
              this.$message({
                message: "监督人和技术交底人不能为同一人",
                type: "warning"
              });
              return false;
            }
            this.secondLevel.userList[indexFlag].isNextCharger = "1";
            this.secondLevelRadio.nextChargerUserId = checkedNextUserId;
            this.twoJd = true;
            break;
          case 3:
            for (let temUserIndex in this.thirdLevel.userList) {
              this.thirdLevel.userList[temUserIndex].isNextCharger = "0";
              //获取已经选中的下级交底人在用户列表中的下标
              if (
                this.thirdLevel.userList[temUserIndex].bottonUserId ==
                this.thirdLevelRadio.nextChargerUserId
              ) {
                checkedIndexFlag = temUserIndex;
              }
              //获取当前选中下级交底人在用户列表的下标和用户id
              if (temUserIndex == userIndex) {
                indexFlag = temUserIndex;
                checkedNextUserId = this.thirdLevel.userList[temUserIndex]
                  .bottonUserId;
              }
            }
            if (this.thirdLevelRadio.checkerUserId == checkedNextUserId) {
              if (checkedNextUserId && checkedIndexFlag) {
                this.thirdLevel.userList[checkedIndexFlag].isNextCharger = "1";
              }
              this.thirdLevel.userList[indexFlag].isNextCharger = "0";
              //不能同一人
              this.$message({
                message: "监督人和技术交底人不能为同一人",
                type: "warning"
              });
              return false;
            }
            this.thirdLevel.userList[indexFlag].isNextCharger = "1";
            this.thirdLevelRadio.nextChargerUserId = checkedNextUserId;
            this.threeJd = true;
            break;
          default:
            break;
        }
      } else {
        switch (index) {
          case 1:
            for (let temUserIndex in this.firstLevel.userList) {
              if (temUserIndex == userIndex) {
                this.firstLevel.userList[temUserIndex].isNextCharger = "0";
                this.firstLevelRadio.nextChargerUserId = "";
              }
            }
            this.oneJd = false;
            break;
          case 2:
            for (let temUserIndex in this.secondLevel.userList) {
              if (temUserIndex == userIndex) {
                this.secondLevel.userList[temUserIndex].isNextCharger = "0";
                this.secondLevelRadio.nextChargerUserId = "";
              }
            }
            this.twoJd = false;
            break;
          case 3:
            for (let temUserIndex in this.thirdLevel.userList) {
              if (temUserIndex == userIndex) {
                this.thirdLevel.userList[temUserIndex].isNextCharger = "0";
                this.thirdLevelRadio.nextChargerUserId = "";
              }
            }
            this.threeJd = false;
            break;
          default:
            break;
        }
      }
    },
    //是否为监督人
    radioGroupMonitor(label, index, userIndex, name) {
      console.log("radioGroupMonitor:", label, index, userIndex, name);
      let checkedIndexFlag;
      let checkedCheckUserId = "";
      let indexFlag;
      if (label === "1") {
        switch (index) {
          case 1:
            for (let temUserIndex in this.firstLevel.userList) {
              this.firstLevel.userList[temUserIndex].isChecker = "0";
              //记录选中监督人的index
              if (
                this.firstLevel.userList[temUserIndex].bottonUserId ==
                this.firstLevelRadio.checkerUserId
              ) {
                checkedIndexFlag = temUserIndex;
              }
              //获取当前选中监督人的id,和index
              if (temUserIndex == userIndex) {
                indexFlag = temUserIndex;
                checkedCheckUserId = this.firstLevel.userList[temUserIndex]
                  .bottonUserId;
              }
            }
            if (checkedCheckUserId === this.firstLevelRadio.nextChargerUserId) {
              if (checkedCheckUserId && checkedIndexFlag) {
                this.firstLevel.userList[checkedIndexFlag].isChecker = "1";
              }
              this.firstLevel.userList[indexFlag].isChecker = "0";
              //不能同一人
              this.$message({
                message: "监督人和技术交底人不能为同一人",
                type: "warning"
              });
              return false;
            }
            this.firstLevelRadio.checkerUserId = checkedCheckUserId;
            this.firstLevel.userList[indexFlag].isChecker = "1";
            break;
          case 2:
            for (let temUserIndex in this.secondLevel.userList) {
              this.secondLevel.userList[temUserIndex].isChecker = "0";
              //记录选中监督人的index
              if (
                this.secondLevel.userList[temUserIndex].bottonUserId ==
                this.secondLevelRadio.checkerUserId
              ) {
                checkedIndexFlag = temUserIndex;
              }
              //获取当前选中监督人的id,和index
              if (temUserIndex == userIndex) {
                indexFlag = temUserIndex;
                checkedCheckUserId = this.secondLevel.userList[temUserIndex]
                  .bottonUserId;
              }
            }
            console.log(
              "checkedCheckUserId:",
              checkedCheckUserId,
              "checkedIndexFlag:",
              checkedIndexFlag
            );
            console.log(
              "nextChargerUserId:",
              this.secondLevelRadio.nextChargerUserId
            );
            if (
              checkedCheckUserId === this.secondLevelRadio.nextChargerUserId
            ) {
              if (checkedCheckUserId && checkedIndexFlag) {
                this.secondLevel.userList[checkedIndexFlag].isChecker = "1";
              }
              this.secondLevel.userList[indexFlag].isChecker = "0";
              //不能同一人
              this.$message({
                message: "监督人和技术交底人不能为同一人",
                type: "warning"
              });
              return false;
            }
            this.secondLevelRadio.checkerUserId = checkedCheckUserId;
            this.secondLevel.userList[indexFlag].isChecker = "1";
            break;
          case 3:
            for (let temUserIndex in this.thirdLevel.userList) {
              this.thirdLevel.userList[temUserIndex].isChecker = "0";
              //记录选中监督人的index
              if (
                this.thirdLevel.userList[temUserIndex].bottonUserId ==
                this.thirdLevelRadio.checkerUserId
              ) {
                checkedIndexFlag = temUserIndex;
              }
              //获取当前选中监督人的id,和index
              if (temUserIndex == userIndex) {
                indexFlag = temUserIndex;
                checkedCheckUserId = this.thirdLevel.userList[temUserIndex]
                  .bottonUserId;
              }
            }
            if (checkedCheckUserId === this.thirdLevelRadio.nextChargerUserId) {
              if (checkedCheckUserId && checkedIndexFlag) {
                this.thirdLevel.userList[checkedIndexFlag].isChecker = "1";
              }
              this.thirdLevel.userList[indexFlag].isChecker = "0";
              //不能同一人
              this.$message({
                message: "监督人和技术交底人不能为同一人",
                type: "warning"
              });
              return false;
            }
            this.thirdLevelRadio.checkerUserId = checkedCheckUserId;
            this.thirdLevel.userList[indexFlag].isChecker = "1";
            break;
        }
      } else {
        switch (index) {
          case 1:
            for (let temUserIndex in this.firstLevel.userList) {
              if (temUserIndex == userIndex) {
                this.firstLevel.userList[temUserIndex].isChecker = "0";
                this.firstLevelRadio.checkerUserId = "";
              }
            }
            break;
          case 2:
            for (let temUserIndex in this.secondLevel.userList) {
              if (temUserIndex == userIndex) {
                this.secondLevel.userList[temUserIndex].isChecker = "0";
                this.secondLevelRadio.checkerUserId = "";
              }
            }
            break;
          case 3:
            for (let temUserIndex in this.thirdLevel.userList) {
              if (temUserIndex == userIndex) {
                this.thirdLevel.userList[temUserIndex].isChecker = "0";
                this.thirdLevelRadio.checkerUserId = "";
              }
            }
            break;
        }
      }
    },

    selectChangeJdPerson(value) {
      for (let i in this.jdUserOption) {
        if (this.jdUserOption[i].userId == value) {
          this.addConfide.jdUser = this.jdUserOption[i].realName;
          this.addConfide.jdUserId = this.jdUserOption[i].userId;
        }
      }
    },

    levelRadioLabel(level, label, index) {
      console.log("reruenLabel-------:", level, label, index);
      let reruenLabel = "";
      switch (level) {
        case 1:
          reruenLabel = "level1";
          break;
        default:
          break;
      }
      reruenLabel += label + index;
      console.log("reruenLabel:", reruenLabel);
      return reruenLabel;
    },

    //添加技术交底项
    addConfideItem() {
      this.confideItemList = true;
    },

    async chooseList() {
      this.dialogVisible = true;
      let res = await getWorkProgramList(this.addPageForm);
      this.addTableData = res.rows;
      this.addTotal = res.total;
    },
    async getTech(cx) {
      if (cx == "cx") {
        this.addPageForm.pageNum = 1;
        this.currentPage = 1;
      }
      let res = await getWorkProgramList(this.addPageForm);
      this.addTableData = res.rows;
      this.addTotal = res.total;
    },
    // 提交触发
    selectItem() {
      if (this.selData && this.selData != "") {
        this.addConfide.programName = this.selData.programName;
        this.addConfide.programId = this.selData.workprogramId;
      } else {
        this.addConfide.programName = "";
        this.addConfide.programId = "";
        this.radio = 1;
      }
      this.selData = "";
      this.radio = "";
      this.dialogVisible = false;
    },
    fBtn() {
      this.selData = "";
      this.radio = "";
      this.dialogVisible = false;
    },
    //新增页脚
    addHandleSizeChange(val) {
      this.addPageForm.pageSize = val;
      this.getTech();
    },
    addHandleCurrentChange(val) {
      this.addPageForm.pageNum = val;
      this.getTech();
    },

    // 文件列表移除文件时的钩子
    async handleRemove(file, fileList) {
      let row = JSON.parse(JSON.stringify(file));
      let roaw = JSON.stringify(file);
      await fsDelete(row.fileId);
      this.ruleForm.fileList = [];
      this.$refs.upload.clearFiles();
    },
    // 下载
    handlePreview(file) {
      if (this.flag == false) {
        let row = JSON.parse(JSON.stringify(file));
        this.fileDowloadName =
          this.$store.state.apiConfiguration.url +
          "jxlq-system-service" +
          `/fs/download?name=${encodeURI(encodeURI(row.name))}&path=${row.url}`;
        location.href = this.fileDowloadName;
      }
    },
    // 文件列表移除文件时的钩子
    async handleRemove(file, fileList) {
      let row = JSON.parse(JSON.stringify(file));
      let roaw = JSON.stringify(file);
      await fsDelete(row.fileId);
      this.ruleForm.fileList = [];
      this.$refs.upload.clearFiles();
    },
    // 上传成功时的钩子
    uploadSuccess(res, file, fileList) {
      if (res.code !== 200) {
        return this.$message.error(res.msg);
      }
      this.arr.push(res);
      let formImgList = [];
      this.arr.forEach(item => {
        formImgList.push({
          fileName: item.body.fileName,
          fileUrl: item.body.url
        });
      });
      if (formImgList.length > 1) {
        let arry = formImgList.pop();
        this.addConfide.expertReviewFileList.push(arry);
      } else {
        this.addConfide.expertReviewFileList = formImgList;
      }
    },
    //移除上一个文件
    removeLastFile(files, fileList) {
      if (fileList) {
        this.filesUpload = fileList.slice(-1);
      }
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    async handleAdd(scope) {
      this.dialogType = "new";
      this.dialogVisible = true;
      if (this.$refs["operationFome"]) {
        this.$refs["operationFome"].resetFields();
      }
      if (this.$refs.deptTree) {
        this.deptOptions = await getLoginDept();
        this.$refs.deptTree.setCheckedKeys([], false);
      }
      if (scope) {
        let deptId = scope.row.projectDeptId;
        this.defaultMenutree = [projectDeptId];
      }
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.addPageForm.pageNum = this.currentPage = 1;
      this.getTech();
    },
    async confirm() {
      this.$refs.operationFome.validate(async valid => {
        if (!valid) {
          this.$notify({
            title: "操作失败",
            dangerouslyUseHTMLString: true,
            message: "请填写完整",
            type: "warning"
          });
          return;
        }
        let data = null;
        data = await getSpecia(this.addConfide);
        this.$notify({
          title: data ? "添加成功" : "添加失败",
          dangerouslyUseHTMLString: true,
          message: data ? data.message : "系统正在维护中，请与管理员联系",
          type: data ? "success" : "warning"
        });
        this.$emit("complete");
      });
    },
    handleSelectionChange(val) {
      if (val) {
        let arr = [];
        for (let i = 0; i < val.length; i++) {
          let itme = val[i];
          arr.push(itme.deptId);
        }
        this.multipleSelection = [...arr];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.page-tit {
  font-size: 18px;
  background: #ffffff;
  height: 45px;
  line-height: 45px;
  margin-bottom: 10px;
  padding-left: 15px;
  border-radius: 5px;
}
.choose-list {
  color: #409eff;
  cursor: pointer;
  font-weight: 600;
  margin-left: 10px;
  // display: inline-block;
}

.table-list /deep/{
  .el-form-item{
    width: 45%;
    float: left;
  }
}
.choose-color {
  color: #409eff;
  cursor: pointer;
  font-weight: 600;
}
.confide tr td {
  width: 25%;
  border-bottom: 1px solid #dcdfe6;
}

.confide table {
  width: 82%;
  float: right;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  text-align: center;
  border-bottom: none;
}

.confide tr {
  height: 32px;
  line-height: 32px;
}

.confide-content .upload-demo,
.confide-content .upload {
  width: 70%;
}

.confede-content .el-transfer {
  text-align: center;
}

.area-confide {
  margin-top: 20px;
}

.upload {
  display: inline-block;
}

.confide-content .el-tree {
  width: 30%;
  height: 40vh;
  float: left;
  overflow-y: scroll;
}

.confide-content .el-transfer {
  width: 70%;
  float: left;
}
</style>
