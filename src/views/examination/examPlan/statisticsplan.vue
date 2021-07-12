<template>
  <div class="app-container">
    <el-row :gutter="40">
      <el-col :span="4">
        <div class="Statisticsletf">
          <el-tree
            :data="data"
            node-key="dictCode"
            :props="defaultProps"
            @node-click="handleNodeClick"
          ></el-tree>
        </div>
      </el-col>
      <el-col :span="20">
        <el-row :gutter="20" class="task-header">
          <el-col :span="18" class="task-header-sort">
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
                  <!-- exam_paperType -->
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
                  <!-- exam_paperType -->
                  <el-option
                    v-for="(item, index) of dictionaries.discipline"
                    :key="index"
                    :label="item.dictLabel"
                    :value="item.dictCode"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-button class="chaxun" v-has="has.getplan" @click="query"
                  >查询</el-button
                >
                <el-button class="chongzhi" @click="Reset">重置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="6" align="right">
            <el-button
              type="primary"
              :loading="exportloading"
              @click="examTopicexport"
              >导出</el-button
            >
          </el-col>
        </el-row>
        <!-- 统计表单 -->
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column
            prop="date"
            label="日期"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            width="180"
          ></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getStatisticsList } from '@/api/examination/index' //查询测验计划接口
import { getSelectType } from '@/api/examination/index' //字典
import axios from 'axios'
import { getToken } from '@/utils/auth'
export default {
  props: {
    dictionaries: {
      type: Object
    }
  },
  data() {
    return {
      has: {
        getplan: 'exam:plan:query'
      },
      form: {},
      exportloading: false,
      tableData: [],
      data: [
        {
          label: '全部',
          children: []
        }
      ],

      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    console.log(this.dictionaries)
    this.getSelectType()
  },
  methods: {
    async getSelectType() {
      let res = await getSelectType('exam_grade')
      res = JSON.parse(JSON.stringify(res).replace(/dictLabel/g, 'label'))
      this.data[0].children = res
    },
    // 查询年级数据
    async getStatilist(dictCode) {
      let params = {
        flag: 'question',
        gradeId: dictCode
      }
      const res = await getStatisticsList(params)
      console.log(res)
    },
    handleNodeClick(data) {
      // this.getStatilist(data.dictCode)
    },
    // 查询
    query() {
      this.pageSize = 10
      this.currentPage = 1
      // this.getExamPlanTable();
    },
    // 重置
    Reset() {
      this.form = {}
      this.pageSize = 10
      this.currentPage = 1
      // this.getExamPlanTable();
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
        params: {}
      }).then((response) => {
        //创建一个隐藏的a连接，
        const link = document.createElement('a')
        let blob = new Blob([response.data], {
          type: 'application/vnd.ms-excel'
        })
        link.style.display = 'none'
        //设置连接
        link.href = URL.createObjectURL(blob)
        link.download = '测验统计.xlsx'
        document.body.appendChild(link)
        //模拟点击事件
        link.click()
        this.exportloading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.Statisticsletf {
  height: 62vh;
  border-right: 1px solid #000000;
}
.el-tree {
  background: #f2f2f2;
}
</style>
