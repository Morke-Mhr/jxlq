<template>
  <div class="app-container" v-loading="loading">
    <!-- 搜索头 -->
    <div class="sxForm">
      <el-form ref="form" :model="form" :inline="true" class="demo-form-inline">
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
          <el-select v-model="form.status" clearable placeholder="请选择状态">
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
    <div class="sxTable">
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
          width="150"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="题目名称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button
              type="text"
              v-has="has.getexam"
              @click="seeContent(scope.row.questionId)"
              >{{ scope.row.content }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="questiontypeName"
          label="题型"
          width="110"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          prop="difficultDegreeName"
          label="难度等级"
          width="110"
        ></el-table-column>
        <el-table-column align="center" label="状态" width="110">
          <template slot-scope="scope">
            {{ scope.row.status | exam_topicState }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="usedCount"
          label="使用次数"
          width="130"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="center" label="正确率" width="100">
          <template slot-scope="scope">
            {{
              scope.row.rightProportion ? scope.row.rightProportion + '%' : ''
            }}
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
    <el-dialog
      title="题目详情"
      :close-on-click-modal="false"
      custom-class="small"
      :visible.sync="dialogFormVisible"
    >
      <subjectDetails
        @mounted="subjectDetails = true"
        ref="subjectDetails"
      ></subjectDetails>
      <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="dialogFormVisible = false"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getTopicList } from '@/api/examination/index' //查询题目接口
import subjectDetails from './subjectDetails' //题目详情  新增  编辑
import { getSelectType } from '@/api/examination/index' //字典
import axios from 'axios'
import { getToken } from '@/utils/auth'
export default {
  components: {
    subjectDetails: subjectDetails //题目详情子组件
  },
  props: {
    dictionaries: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      has: {
        getexam: 'exam:question:query'
      },
      search: '', // 搜索
      tableData: [], //列表 list
      multipleSelection: [], //已选中数组
      total: 0, //条目
      pageSize: 10,
      currentPage: 1,
      subjectDetails: false,
      dialogFormVisible: false, //新增 或 编辑
      loading: false,
      form: {},
      exportloading: false
    }
  },
  created() {
    this.loading = true
    this.getTopicList()
  },
  methods: {
    async getTopicList() {
      //查找公开题目
      let params = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        flag: 'official',
        subjectId: this.form.subjectId,
        disciplineId: this.form.disciplineId,
        questionTypeId: this.form.questionTypeId,
        content: this.form.content,
        status: this.form.status
      }
      const res = await getTopicList(params)
      this.tableData = res.rows
      for (let item of this.tableData) {
        item.subjectName = this.filet(
          //根据当前ID对比字典 获取当前名称
          item.subjectId,
          this.dictionaries.subject
        )
        item.gradeName = this.filet(item.gradeId, this.dictionaries.grade)
        item.difficultDegreeName = this.filet(
          item.difficultDegreeId,
          this.dictionaries.difficultDegree
        )
        item.disciplineName = this.filet(
          item.disciplineId,
          this.dictionaries.discipline
        )
        item.questiontypeName = this.filet(
          item.typeId,
          this.dictionaries.questiontype
        )
      }
      this.total = res.total
      this.loading = false
    },
    // 查询
    query() {
      this.pageSize = 10
      this.currentPage = 1
      this.getTopicList()
    },
    // 重置
    Reset() {
      this.form = {}
      this.pageSize = 10
      this.currentPage = 1
      this.getTopicList()
    },
    filet(id, idList) {
      if (!Array.isArray(idList)) {
        return
      }
      id = idList.filter((item) => item.dictCode == id)
      if (id.length > 0) {
        id = id[0].dictLabel
      } else {
        id = ''
      }
      return id
    },
    // 点击题目内容 查看详情
    seeContent(questionId) {
      this.dialogFormVisible = true
      console.log(this.subjectDetails)
      let int = setInterval(() => {
        if (this.subjectDetails) {
          this.$refs.subjectDetails.getTopicId(questionId, 'get')
          clearInterval(int)
        }
      }, 250)
    },
    handleClick(tab, event) {
      //切换标签页触发
      console.log(tab, event)
    },
    //全选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      //分页
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.getTopicList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.getTopicList()
    },
    // 导出
    async examTopicexport() {
      this.exportloading = true
      axios({
        method: 'get',
        url:
          this.$store.state.apiConfiguration.url +
          this.$store.state.serviceName.examination +
          '/exam/export',
        responseType: 'blob', // 表明返回服务器返回的数据类型
        headers: {
          'Content-Type': 'application/json',
          Authorization: getToken()
        },
        //接口参数
        params: {
          subjectId: this.form.subjectId,
          disciplineId: this.form.disciplineId,
          questionTypeId: this.form.questionTypeId,
          status: this.form.status
        }
      }).then((response) => {
        //创建一个隐藏的a连接，
        const link = document.createElement('a')
        let blob = new Blob([response.data], {
          type: 'application/vnd.ms-excel'
        })
        link.style.display = 'none'
        //设置连接
        link.href = URL.createObjectURL(blob)
        link.download = '公开题目.xlsx'
        document.body.appendChild(link)
        //模拟点击事件
        link.click()
        this.exportloading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
