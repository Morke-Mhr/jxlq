<template>
  <div class="app-container">
    <el-row>
      <el-col :span="4">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          @node-click="handleNodeClick"
        ></el-tree>
      </el-col>
      <el-col :span="20">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="流程名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="业务模块">
            <el-select
              v-model="form.region"
              placeholder="业务模块"
              style="width:100%"
            >
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <el-table :data="tableData" style="width: 100%" stripe>
          <el-table-column prop="name" label="节点名称" width="180">
          </el-table-column>
          <el-table-column prop="name" label="候选角色" width="180">
            <el-select v-model="form.region" placeholder="业务模块">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-table-column>
          <el-table-column prop="address" label="节点别名">
            <el-select v-model="form.region" placeholder="业务模块">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-table-column>

          <el-form-item> </el-form-item>
        </el-table>
        <div style="text-align:right;margin-top:20px">
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button>关闭</el-button>
        </div>
      </el-col>
    </el-row>
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
      //树形结构
      treeData: [
        {
          label: '一级 1',
          children: [
            {
              label: '二级 1-1',
              children: [
                {
                  label: '三级 1-1-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 2',
          children: [
            {
              label: '二级 2-1',
              children: [
                {
                  label: '三级 2-1-1'
                }
              ]
            },
            {
              label: '二级 2-2',
              children: [
                {
                  label: '三级 2-2-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 3',
          children: [
            {
              label: '二级 3-1',
              children: [
                {
                  label: '三级 3-1-1'
                }
              ]
            },
            {
              label: '二级 3-2',
              children: [
                {
                  label: '三级 3-2-1'
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      //表单
      form: {
        name: '',
        region: ''
      },
      //表格
      tableData: [
        {
          date: '2016-05-02',
          name: '发起流程',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '指定角色审批01',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '指定角色审批02',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '结束',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
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
