<template>
  <div class="app-container">
    <el-form :inline="true" ref="form" :model="form" label-width="100px">
      <el-form-item label="检查类别">
        <el-select
          v-model="form.region"
          placeholder="检查类别"
          style="width:100%"
        >
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="组织部门">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="组织人">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item prop="status" label="计划检查时间">
        <el-date-picker
          v-model="dateList"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="被检查单位">
        <el-select
          v-model="form.region"
          placeholder="被检查单位"
          style="width:100%"
        >
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审批">
        <el-radio-group v-model="form.resource">
          <el-radio label="是"></el-radio>
          <el-radio label="否"></el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <!-- <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="节点名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="候选角色"
        width="180">
        <el-select v-model="form.region" placeholder="业务模块">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
      </el-table-column>
      <el-table-column
        prop="address"
        label="节点别名">
         <el-select v-model="form.region" placeholder="业务模块">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
      </el-table-column>

        <el-form-item>
   
  </el-form-item>
    </el-table> -->

    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      stripe
    >
      <el-table-column type="selection"> </el-table-column>
      <el-table-column label="项目">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column prop="address" label="检车责任部门">
        <el-select v-model="form.region" placeholder="业务模块">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-table-column>
      <el-table-column prop="address" label="检车责任人">
        <el-select v-model="form.region" placeholder="业务模块">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            v-has="has.see"
            size="mini"
            @click="handleSee(scope)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            v-has="has.remove"
            size="mini"
            @click="handleDelete(scope)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      has: {
        remove: 'system:menu:remove',
        query: 'system:menu:query',
        add: 'system:menu:add',
        edit: 'system:menu:edit'
      },

      //表单
      form: {
        name: '',
        region: ''
      },
      //表格
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      multipleSelection: []
    }
  },
  watch: {},
  computed: {},
  created() {},
  methods: {
    handleNodeClick(data) {
      console.log(data)
    },
    onSubmit() {
      console.log('submit!')
    },
    //表格
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .menus-table {
    margin-top: 15px;
  }

  .permission-tree {
    margin-bottom: 15px;
  }
  .upload-demo {
    display: inline-block;
  }
}

.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;

  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .icon-item {
    margin: 10px;
    height: 65px;
    text-align: center;
    width: 80px;
    float: left;
    font-size: 20px;
    color: #ffffff;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>
