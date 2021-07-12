<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="我的组卷" name="paperGroup" v-loading="loading">
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
              <el-form-item label="组卷模板">
                <el-select
                  v-model="form.paperTypeId"
                  clearable
                  placeholder="请选择题型"
                >
                  <el-option
                    v-for="(item, index) of dictionaries.paperType"
                    :key="index"
                    :label="item.dictLabel"
                    :value="item.dictCode"
                  ></el-option>
                </el-select>
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
                <el-button class="chaxun" v-has="has.getpaper" @click="query"
                  >查询
                </el-button>
                <el-button class="chongzhi" @click="Reset">重置</el-button>
              </div>
            </el-form>
          </div>
          <div class="sxTable">
            <el-button class="blue" v-has="has.add" @click="addpaperGroup"
              >新增</el-button
            >
            <el-button class="blue" v-has="has.del" @click="handleDelete()"
              >批量删除
            </el-button>

            <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="light"
              style="width: 100%"
              height="calc(100vh - 380px)"
              @selection-change="handleSelectionChange"
              stripe
            >
              <el-table-column
                align="center"
                type="selection"
                :selectable="checkSelectable"
                width="55"
              ></el-table-column>
              <el-table-column
                align="center"
                prop="subjectName"
                label="分类"
                width="160"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                align="center"
                label="主题"
                width="160"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <!-- <el-button type="text">{{ scope.row.disciplineName }}</el-button> -->
                  {{ scope.row.disciplineName }}
                </template>
              </el-table-column>
              <!-- <el-table-column
                          prop="gradeName"
                          label="适应班级"
                          width="130"
                          show-overflow-tooltip
                        ></el-table-column> -->

              <el-table-column
                align="center"
                label="组卷名称"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    v-has="has.getpaper"
                    @click="paperDetailsVisible(scope.row.paperId)"
                    >{{ scope.row.name }}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="paperTypeName"
                label="组卷模板"
                width="120"
                align="center"
                show-overflow-tooltip
              ></el-table-column>

              <el-table-column
                prop="questionNum"
                label="题目数量"
                width="120"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="totalScore"
                label="总分值"
                width="110"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="createBy"
                label="创始人"
                width="130"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                align="center"
                label="创建时间"
                width="200"
                show-overflow-tooltip
              >
                <template slot-scope="scope"
                  >{{ scope.row.createTime }}
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="状态"
                width="100"
                show-overflow-tooltip
              >
                <template slot-scope="scope"
                  >{{ scope.row.status | exam_topicState }}
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                label="操作"
                width="120"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <!-- <el-button type="text">编辑</el-button> -->
                  <el-button
                    type="text"
                    v-has="has.put"
                    @click="compile(scope.row.paperId)"
					v-if="scope.row.status==1"
                    >编辑
                  </el-button>
                  <el-button
                    class="red"
                    type="text"
                    v-has="has.del"
                    @click="delectpaper(scope.row.paperId)"
                    >删除
                  </el-button>
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
          </div>
          <!-- 组卷详情 -->
          <el-dialog
            title="组卷详情"
            :close-on-click-modal="false"
            custom-class="large"
            :visible.sync="dialogDetailsVisible"
            v-if="dialogDetailsVisible"
          >
            <paperDetails :paperId="paperId"></paperDetails>
            <span slot="footer" class="dialog-footer">
              <el-button class="fBtn" @click="dialogDetailsVisible = false"
                >关 闭</el-button
              >
            </span>
          </el-dialog>
          <!-- 新增题组 -->
          <el-dialog
            title="组卷属性"
            :close-on-click-modal="false"
            custom-class="large"
            :visible.sync="dialogFormVisible"
          >
            <papertype
              @choicePaper="choicePaper"
              :person="personData"
              v-if="reFresh"
              ref="papertype"
            ></papertype>
            <span slot="footer" class="dialog-footer">
              <el-button class="fBtn" @click="dialogFormVisible = false"
                >取 消</el-button
              >
              <el-button
                class="tBtn"
                @click="$refs.papertype.submitForm('ruleForm')"
                >开始选题</el-button
              >
            </span>
          </el-dialog>
          <!-- 选题 -->
          <el-dialog
            title="选题"
            custom-class="large"
            :close-on-click-modal="false"
            v-if="dialoChoicePaperVisible"
            :close-on-press-escape="false"
            :visible.sync="dialoChoicePaperVisible"
          >
            <choicePaper
              ref="choicePaper"
              :dictionaries="dictionaries"
              @func="getMsgFormSon"
              v-on="{ edittype: edittype }"
            ></choicePaper>
            <span slot="footer" class="dialog-footer">
              <el-button class="fBtn" @click="edittype">返 回</el-button>
              <el-button
                class="tBtn"
                @click="$refs.choicePaper.addpaperGroup(1)"
                >仅保存</el-button
              >
              <el-button
                class="tBtn"
                @click="$refs.choicePaper.addpaperGroup(4)"
                >提 交</el-button
              >
            </span>
          </el-dialog>
        </div>
      </el-tab-pane>
      <el-tab-pane label="公开组卷" name="paperSecond">
        <openPaper ref="openPaper" :dictionaries="dictionaries"></openPaper>
      </el-tab-pane>
      <!-- <el-tab-pane label="题组统计" name="paperStatistics">
              <paperStatistics :dictionaries="dictionaries"></paperStatistics>
            </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
import {
  getPaperList,
  getFindOne,
  getPaperQuery,
} from "@/api/examination/index"; //查询题组列表接口
import openPaper from "./openPaper"; //题组详情  新增  编辑
import paperStatistics from "./paperStatistics"; //题组统计
import papertype from "./papertype"; //题组属性
import choicePaper from "./choicePaper"; //选题
import paperDetails from "./paperDetails"; //题组详情
import { getSelectType } from "@/api/examination/index"; //字典
import { delPaper } from "@/api/examination/index"; //字典

export default {
  components: {
    openPaper: openPaper,
    paperStatistics: paperStatistics,
    papertype: papertype,
    choicePaper: choicePaper,
    paperDetails: paperDetails,
  },
  data() {
    return {
      has: {
        add: "exam:paper:add",
        put: "exam:paper:edit",
        del: "exam:paper:remove",
        getpaper: "exam:paper:query",
      },
      activeName: "paperGroup", // 当前标签页
      search: "", // 搜索
      tableData: [], //列表 list
      multipleSelection: [], //已选中数组
      total: 0, //条目
      paperId: 0, // 当前题组id
      pageSize: 10,
      currentPage: 1,
      dialogFormVisible: false, //题组属性
      dialoChoicePaperVisible: false, //选题
      dialogDetailsVisible: false, //题组详情
      loading: false,
      delarr: [], //全选
      dictionaries: {
        status: [
          { dictLabel: "禁用", dictCode: 0 },
          { dictLabel: "待提交", dictCode: 1 },
          { dictLabel: "已提交", dictCode: 4 },
        ],
      },
      form: {
        subjectId: "",
        disciplineId: "",
        paperTypeId: "",
        status: "",
      }, //搜索列表
      personData: {}, //传ID过去
      reFresh: true,
    };
  },
  created() {
    this.loading = true;
    this.getselect();
    this.getPapertable();
  },
  watch: {
    "personData.paperId"() {
      this.reFresh = false;
      this.$nextTick(() => {
        this.reFresh = true;
      });
    },
  },
  methods: {
    checkSelectable(row) {
      return row.status != 4;
    },
    // 新增
    addpaperGroup() {
      this.dialogFormVisible = true;
      this.personData = {};
    },
    //完成后回调
    getMsgFormSon() {
      this.dialogFormVisible = false;
      this.dialoChoicePaperVisible = false;
      this.getPapertable();
    },
    //编辑
    async compile(id) {
      this.personData = await getFindOne(id);
      this.dialogFormVisible = true;
    },
    // 获取题组（试卷）列表
    async getPapertable() {
      let params = {
        flag: "",
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        subjectId: this.form.subjectId,
        disciplineId: this.form.disciplineId,
        paperTypeId: this.form.paperTypeId,
        status: this.form.status,
      };
      let res = await getPaperList(params);
      for (let item of res.rows) {
        //根据当前ID对比字典 获取当前名称
        item.subjectName = this.filet(
          item.subjectId,
          this.dictionaries.subject
        );
        item.gradeName = this.filet(item.gradeId, this.dictionaries.grade);
        item.paperTypeName = this.filet(
          item.paperTypeId,
          this.dictionaries.paperType
        );
        item.disciplineName = this.filet(
          item.disciplineId,
          this.dictionaries.discipline
        );
      }
      this.tableData = res.rows;
      this.total = res.total;
      this.loading = false;
    },
    async getselect() {
      this.dictionaries.subject = await getSelectType("exam_subject");
      this.dictionaries.grade = await getSelectType("exam_grade");
      this.dictionaries.paperType = await getSelectType("exam_paperType");
      this.dictionaries.discipline = await getSelectType("exam_discipline");
      let dict = setInterval(() => {
        if (!(Object.getOwnPropertyNames(this.dictionaries).length < 4)) {
          clearInterval(dict);
          this.getPapertable();
        }
      }, 100);
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
    // 查询
    async query() {
      this.pageSize = 10;
      this.currentPage = 1;
      this.getPapertable();
    },
    // 重置
    Reset() {
      this.form = {};
      this.pageSize = 10;
      this.currentPage = 1;
      this.getPapertable();
    },
    handleClick(tab, event) {
      //切换标签页触发
      // console.log(tab)
      if (tab.name == "paperGroup") {
        this.getPapertable();
      } else if (tab.name == "paperSecond") {
        this.$refs.openPaper.getPapertable();
      }
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
            for (let i = 0; i < this.multipleSelection.length; i++) {
              this.delarr.push(this.multipleSelection[i].paperId);
            }
            await delPaper(this.delarr);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getPapertable();
            this.$refs.multipleTable.clearSelection();
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        this.$message.error("请选择要删除项");
      }
    },

    // 删除
    delectpaper(paperId) {
      this.$confirm("确定是否删除该组卷？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await delPaper(paperId);
          this.getPapertable();
          this.$message({
            message: "删除成功",
            type: "success",
          });
        })
        .catch(() => {});
    },
    //全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      //分页
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getPapertable();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getPapertable();
    },
    // 选题事件
    choicePaper() {
      this.dialogFormVisible = false;
      this.dialoChoicePaperVisible = true;
    },
    // 属性编辑
    edittype() {
      this.dialogFormVisible = true;
      this.dialoChoicePaperVisible = false;
    },
    //打开题组详情 并传入 当前题组ID
    paperDetailsVisible(paperId) {
      this.dialogDetailsVisible = true;
      this.paperId = paperId;
    },
  },
};
</script>
<style lang="scss">
.task-header {
  margin: 1.5rem;
}

.task-header-sort {
  display: flex;
}

.task-header-sort > div {
  width: 15%;
  height: 100%;
  align-self: center;
  cursor: pointer;
}
</style>
