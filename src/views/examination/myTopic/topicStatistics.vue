<template>
  <div class="app-container">
    <el-row :gutter="40">
      <el-col :span="4">
        <div class="Statisticsletf">
          <el-tree
            :data="data"
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
              <div class="btnCont">
                <el-button class="chaxun" v-has="has.getexam" @click="query"
                  >查询</el-button
                >
                <el-button class="chongzhi" @click="Reset">重置</el-button>
              </div>
            </el-form>
          </el-col>
          <el-col :span="6" align="right">
            <el-button
              class="blue"
              :loading="exportloading"
              @click="examTopicexport"
              >导出</el-button
            >
          </el-col>
        </el-row>
        <!-- 统计表单 -->
        <el-table :data="this.dictionaries.subject" stripe style="width: 100%">
          <el-table-column
            prop="dictLabel"
            label="日期"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="dictCode"
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
import axios from 'axios'
import { getToken } from '@/utils/auth'
export default {
  props: {
    dictionaries: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      form: {},
      has: {
        getexam: 'exam:question:query'
      },
      exportloading: false,
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      data: [
        {
          label: '全部',
          children: [
            {
              label: '初一上'
            },
            {
              label: '初一下'
            },
            {
              label: '初二上'
            },
            {
              label: '初二下'
            },
            {
              label: '初三上'
            },
            {
              label: '初三下'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },

  created() {
    console.log(this.dictionaries, 7877878)
  },
  methods: {
    handleNodeClick(data) {
      console.log(data)
    },
    // 查询
    query() {
      this.pageSize = 10
      this.currentPage = 1
      console.log(this.form)
      // this.getTopicList();
    },
    // 重置
    Reset() {
      this.form = {}
      this.pageSize = 10
      this.currentPage = 1
      console.log(this.form)
      // this.getTopicList();
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
        link.download = '题目统计.xlsx'
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
.el-tree {
  background: #f2f2f2;
}
</style>
