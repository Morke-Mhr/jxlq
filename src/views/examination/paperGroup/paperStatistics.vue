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
          <el-col :span="16" class="task-header-sort">
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
              <el-form-item>
                <el-button class="chaxun" v-has="has.getpaper" @click="query"
                  >查询</el-button
                >
                <el-button class="chongzhi" @click="Reset">重置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8" align="right">
            <el-button type="primary">导出</el-button>
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
export default {
  props: {
    dictionaries: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      has: {
        getpaper: 'exam:paper:query'
      },
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
      form: {},
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
    console.log(this.dictionaries)
  },
  methods: {
    handleNodeClick(data) {
      console.log(data)
    },
    // 查询
    query() {
      this.pageSize = 10
      this.currentPage = 1
      // this.getPapertable();
    },
    // 重置
    Reset() {
      this.form = {}
      this.pageSize = 10
      this.currentPage = 1
      // this.getPapertable();
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
