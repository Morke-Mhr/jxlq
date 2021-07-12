<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="我的题库" name="myTopic">
        <div class="app-container">
          <!-- 搜索头 -->
          <div class="sxForm">
            <el-form
              ref="form"
              :model="form"
              :inline="true"
              class="demo-form-inline"
            >
              <el-form-item label="分类">
                <el-select
                  v-model="form.subjectId"
                  clearable
                  placeholder="请选择分类"
                >
                  <el-option
                    v-for="(item, index) of dictionaries.subject"
                    :key="index"
                    :label="item.dictLabel"
                    :value="item.dictCode"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="主题">
                <el-select
                  v-model="form.disciplineId"
                  clearable
                  placeholder="请选择主题"
                >
                  <el-option
                    v-for="(item, index) of dictionaries.discipline"
                    :key="index"
                    :label="item.dictLabel"
                    :value="item.dictCode"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="题型">
                <el-select
                  v-model="form.questionTypeId"
                  clearable
                  placeholder="请选择题型"
                >
                  <el-option
                    v-for="(item, index) of dictionaries.questiontype"
                    :key="index"
                    :label="item.dictLabel"
                    :value="item.dictCode"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="题目名称">
                <el-input
                  v-model="form.content"
                  clearable
                  placeholder="请输入题目名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="状态">
                <el-select
                  v-model="form.status"
                  clearable
                  placeholder="请选择状态"
                >
                  <el-option
                    v-for="(item, index) of dictionaries.status"
                    :key="index"
                    :label="item.dictLabel"
                    :value="item.dictCode"
                  ></el-option>
                </el-select>
              </el-form-item>
              <div class="btnCont">
                <el-button class="chaxun" v-has="has.getexam" @click="query"
                  >查询</el-button
                >
                <el-button class="chongzhi" @click="Reset">重置</el-button>
              </div>
            </el-form>
          </div>
          <!-- 表格 -->
          <div class="sxTable">
            <el-button class="blue" @click="show_openTopic(true)"
              >新增</el-button
            >
            <el-button class="blue" @click="examTopicimport">导入</el-button>
            <el-button class="blue" v-has="has.delexam" @click="handleDelete()"
              >批量删除
            </el-button>

            <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="light"
              style="width: 100%"
              height="calc(100vh - 380px)"
              @selection-change="handleSelectionChange"
              v-loading="loading"
              stripe
            >
              <el-table-column
                type="selection"
                width="55"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="subjectName"
                label="分类"
                width="150"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="disciplineName"
                label="主题"
                width="240"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                label="题目名称"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    v-has="has.getexam"
                    @click="seeContent(scope.row.questionId, 'get')"
                    >{{ scope.row.content }}</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="questiontypeName"
                align="center"
                label="题型"
                width="110"
                show-overflow-tooltip
              ></el-table-column>
              <!-- <el-table-column prop="gradeName" label="适应班级" width="130" show-overflow-tooltip></el-table-column> -->
              <el-table-column
                prop="difficultDegreeName"
                align="center"
                label="难度等级"
                width="110"
              ></el-table-column>
              <el-table-column label="状态" width="110" align="center">
                <template slot-scope="scope">{{
                  scope.row.status | exam_topicState
                }}</template>
              </el-table-column>
              <!-- <el-table-column
                prop="usedCount"
                align="center"
                label="使用次数"
                width="110"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column label="正确率" align="center" width="100">
                <template slot-scope="scope">{{
                  scope.row.rightProportion
                    ? scope.row.rightProportion + '%'
                    : ''
                }}</template>
              </el-table-column> -->
              <el-table-column label="操作" align="center" width="110">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    v-has="has.putexam"
                    @click="putTopic(scope.row.questionId)"
                    >编辑</el-button
                  >
                  <el-button
                    type="text"
                    class="red"
                    v-has="has.delexam"
                    @click="delTopic(scope.row.questionId)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageSize"
              background
              layout="total, prev, pager, next,sizes,jumper"
              :total="total"
            ></el-pagination>
            <!-- 新增题目 -->
            <el-dialog
              title="题目详情"
              :close-on-click-modal="false"
              custom-class="small"
              :visible.sync="dialogFormVisible"
            >
              <subjectDetails
                @show_openTopic="show_openTopic"
                @mounted="subjectDetails = true"
                ref="subjectDetails"
              ></subjectDetails>
              <span slot="footer" class="dialog-footer">
                <el-button
                  v-if="!mask"
                  class="tBtn"
                  v-has="has.add"
                  @click="$refs.subjectDetails.submitForm('ruleForm', 1)"
                  >仅保存</el-button
                >
                <el-button
                  v-if="!mask"
                  class="tBtn"
                  v-has="has.add"
                  @click="$refs.subjectDetails.submitForm('ruleForm', 4)"
                  >提交</el-button
                >
                <el-button
                  v-if="mask"
                  class="fBtn"
                  @click="dialogFormVisible = false"
                  >关 闭</el-button
                >
              </span>
            </el-dialog>
            <!-- 导入页面-->
            <el-dialog
              :title="titleType"
              :visible.sync="dialogimportVisible"
              @close="closeDialog"
              :close-on-click-modal="false"
              custom-class="small"
            >
              <div v-if="flag == false">
                <div style="margin-bottom: 20px">选择文件:</div>
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  :action="getUrl"
                  multiple
                  :limit="1"
                  :headers="geHeaders"
                  :file-list="fileList"
                  :on-success="onSuccess"
                  :auto-upload="false"
                >
                  <el-button>选取文件</el-button>
                </el-upload>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button class="tBtn" @click="fileDownload()"
                  >下载模版</el-button
                >
                <el-button
                  class="tBtn"
                  @click="submitUpload"
                  :loading="exportloading"
                  >提 交</el-button
                >
              </span>
            </el-dialog>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="公开题库" name="second">
        <openTopic ref="second" :dictionaries="dictionaries"></openTopic>
      </el-tab-pane>
      <!-- <el-tab-pane label="题目统计" name="topicStatistics">
        <topicStatistics ref="topicStatistics" :dictionaries="dictionaries"></topicStatistics>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
import { getTopicList } from "@/api/examination/index"; //查询题目接口
import subjectDetails from "./subjectDetails"; //题目详情  新增  编辑
import openTopic from "./openTopic"; //公开题目
// import topicStatistics from "./topicStatistics"; //题目统计
import { deleteTopicDtails } from "@/api/examination/index"; //删除题目接口
import { getSelectType } from "@/api/examination/index"; //字典
import axios from "axios";
import { getToken } from "@/utils/auth";
export default {
  components: {
    subjectDetails: subjectDetails, //题目详情子组件
    openTopic: openTopic, //公开题库
    //topicStatistics: topicStatistics //题目统计
  },
  data() {
    return {
      has: {
        getexam: "exam:question:query",
        putexam: "exam:question:edit",
        delexam: "exam:question:remove",
        add: "exam:question:add",
      },
      mask: false,
      activeName: "myTopic", // 当前标签页
      search: "", // 搜索
      tableData: [], //列表 list
      multipleSelection: [], //已选中数组
      total: 0, //条目
      pageSize: 10,
      currentPage: 1,
      fileList: [],
      flag: true, //查看按钮显示
      dialogFormVisible: false, //新增 或 编辑 弹出层
      dialogimportVisible: false, //导入
      subjectDetails: false,
      loading: false,
      titleType: "",
      delarr: [], //全选
      dictionaries: {
        status: [
          {
            dictLabel: "禁用",
            dictCode: 0,
          },
          {
            dictLabel: "待提交",
            dictCode: 1,
          },
          {
            dictLabel: "已提交",
            dictCode: 4,
          },
        ],
      },
      form: {}, //搜索列表
      // path: "ws://192.168.16.175:8874/websocket/1",
      // token: getToken(),
      // websock: null
      exportloading: false,
    };
  },
  created() {
    this.loading = true;
    this.getdictionaries();
  },
  mounted() {},
  destroyed() {},
  computed: {
    getUrl() {
      return (
        this.$store.state.apiConfiguration.url +
        this.$store.state.serviceName.examination +
        "/question/questionImport"
      );
    },
    geHeaders() {
      return {
        Authorization: getToken(),
      };
    },
  },
  methods: {
  //获取列表
    async getTopicList() {
      //查找题目
      this.loading = true;
      let params = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        subjectId: this.form.subjectId,
        disciplineId: this.form.disciplineId,
        questionTypeId: this.form.questionTypeId,
        content: this.form.content,
        status: this.form.status,
      };
      const res = await getTopicList(params);
      this.total = res.total;
      this.dict(res);
    },
    dict(res) {
      let dict = setInterval(() => {
        console.log("执行");
        if (!(Object.getOwnPropertyNames(this.dictionaries).length < 5)) {
          console.log(this.dictionaries, 11);
          console.log("结束");
          clearInterval(dict);
          this.fortableData(res.rows);
        }
      }, 100);
    },
    fortableData(res) {
      for (let item of res) {
        //根据当前id对比字典 获取当前名称
        item.subjectName = this.filet(
          item.subjectId,
          this.dictionaries.subject
        );
        item.gradeName = this.filet(item.gradeId, this.dictionaries.grade);
        item.difficultDegreeName = this.filet(
          item.difficultDegreeId,
          this.dictionaries.difficultDegree
        );
        item.disciplineName = this.filet(
          item.disciplineId,
          this.dictionaries.discipline
        );
        item.questiontypeName = this.filet(
          item.typeId,
          this.dictionaries.questiontype
        );
      }
      //  this.tableData = res;
      this.$set(this, "tableData", res);
      this.loading = false;
    },
    //查询字典
    async getdictionaries() {
      this.dictionaries.subject = await getSelectType("exam_subject");
      this.dictionaries.grade = await getSelectType("exam_grade");
      this.dictionaries.questiontype = await getSelectType("exam_type");
      this.dictionaries.discipline = await getSelectType("exam_discipline");
      this.dictionaries.difficultDegree = await getSelectType(
        "exam_difficultDegree"
      );
      this.getTopicList();
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
    // 点击题目内容 查看详情
    seeContent(questionId, t) {
      this.dialogFormVisible = true;
      this.mask = true;
      let int = setInterval(() => {
        if (this.subjectDetails) {
          this.$refs.subjectDetails.getTopicId(questionId, t);
          clearInterval(int);
        }
      }, 100);
    },
    handleClick(tab) {
      //切换标签页触发
      if (tab.name == "myTopic") {
        // this.getTopicList();
      } else if (tab.name == "second") {
        this.$refs.second.getTopicList();
      }
    },
    //批量删除
    handleDelete() {
      console.log(this.multipleSelection);
      if (this.multipleSelection != "") {
        this.$confirm("确定删除吗?", "删除", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            for (let i = 0; i < this.multipleSelection.length; i++) {
              this.delarr.push(this.multipleSelection[i].questionId);
            }
            await deleteTopicDtails(this.delarr);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getTopicList();
            this.$refs.multipleTable.clearSelection();
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        this.$message.error("请选择要删除项");
      }
    },

    // 查询
    query() {
      this.pageSize = 10;
      this.currentPage = 1;
      this.getTopicList();
    },
    // 重置
    Reset() {
      this.form = {};
      this.pageSize = 10;
      this.currentPage = 1;
      this.getTopicList();
    },
    //全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    handleSizeChange(val) {
      //分页
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getTopicList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getTopicList();
    },
    // 删除题目
    async delTopic(questionId) {
      this.$confirm("是否确定删除此题目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await deleteTopicDtails(questionId);
          this.$message({
            message: res,
            type: "success",
          });
          this.getTopicList();
        })
        .catch(() => {});
    },
    // 修改题目
    putTopic(questionId) {
      this.seeContent(questionId, "put");
      this.mask = false;
    },
    // 新增 表单弹出层
    show_openTopic(v) {
      this.dialogFormVisible = v;
      this.mask = false;
      if (!v) {
        this.getTopicList();
      }
      let int = setInterval(() => {
        if (this.subjectDetails) {
          this.$refs.subjectDetails.addTopic();
          this.$refs.subjectDetails.resetForm("ruleForm");
          clearInterval(int);
        }
      }, 100);
    },
    // 导出
    async examTopicexport() {
      this.exportloading = true;
      axios({
        method: "get",
        url:
          this.$store.state.apiConfiguration.url +
          this.$store.state.serviceName.examination +
          "/exam/export",
        responseType: "blob", // 表明返回服务器返回的数据类型
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken(),
        },
        //接口参数
        params: {
          subjectId: this.form.subjectId,
          disciplineId: this.form.disciplineId,
          questionTypeId: this.form.questionTypeId,
          status: this.form.status,
        },
      }).then((response) => {
        //创建一个隐藏的a连接，
        const link = document.createElement("a");
        let blob = new Blob([response.data], {
          type: "application/vnd.ms-excel",
        });
        link.style.display = "none";
        //设置连接
        link.href = URL.createObjectURL(blob);
        link.download = "我的题目.xlsx";
        document.body.appendChild(link);
        //模拟点击事件
        link.click();
        this.exportloading = false;
      });
    },
    // 导入
    async examTopicimport() {
      this.titleType = "题目导入";
      this.flag = false;
      this.dialogimportVisible = true;
    },
    submitUpload() {
      this.$refs.upload.submit();
      this.exportloading = true;
    },
    onSuccess(response) {
      this.$notify({
        title: response.code == 200 ? "成功" : "失败",
        dangerouslyUseHTMLString: true,
        message: response.body == null ? response.message : response.body,
        type: response.code == 200 ? "success" : "warning",
      });
      this.exportloading = false;
      this.flag = true;
      this.dialogimportVisible = false;
      this.$refs.upload.clearFiles();
      this.getdictionaries();
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
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 导出导入模板
    async fileDownload() {
      // 导出接口
      axios({
        method: "get",
        url:
          this.$store.state.apiConfiguration.url +
          this.$store.state.serviceName.examination +
          "/question/downloadTemplate",
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
        link.download = "题目导入模板.xlsx";
        document.body.appendChild(link);
        //模拟点击事件
        link.click();
      });
    },
    closeDialog() {
      this.flag = true;
      this.dialogimportVisible = false;
      this.ruleForm = {};
    },
  },
};
</script>
