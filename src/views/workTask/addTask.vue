<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="流程名称">
        <el-select
          v-model="form.region"
          placeholder="业务模块"
          style="width:30%"
        >
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
        <el-select
          v-model="form.region"
          placeholder="业务模块"
          style="width:30%"
        >
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间">
        <div class="block">
          <el-date-picker v-model="value1" type="date" placeholder="选择日期">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="结束时间">
        <div class="block">
          <el-date-picker v-model="value2" type="date" placeholder="选择日期">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="责任人">
        <el-select
          v-model="form.region"
          placeholder="业务模块"
          style="width:30%"
        >
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
        <el-select
          v-model="form.region"
          placeholder="业务模块"
          style="width:30%"
        >
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="协助人">
        <div class="choose-help" @click="openHelp">选择协助人</div>
        <el-input
          type="textarea"
          v-model="form.desc"
          placeholder="选择协助人"
        ></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input
          type="textarea"
          v-model="form.desc"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <el-form-item label="目标">
        <el-input
          type="textarea"
          v-model="form.desc"
          placeholder="请输入目标"
        ></el-input>
      </el-form-item>
      <el-form-item label="周期">
        <el-radio-group v-model="form.resource">
          <el-radio label="是"></el-radio>
          <el-radio label="否"></el-radio>
          <el-input
            type="input"
            v-model="form.desc"
            placeholder="请输入数量"
            style="width:30%"
          ></el-input>
          <el-select
            v-model="form.region"
            placeholder="请选择"
            style="width:30%;margin-left:20px"
          >
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="验收">
        <el-radio-group v-model="form.resource">
          <el-radio label="是"></el-radio>
          <el-radio label="否"></el-radio>
        </el-radio-group>
        <el-select
          v-model="form.region"
          placeholder="请选择"
          style="width:30%;margin-left:20px"
        >
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
        <el-select
          v-model="form.region"
          placeholder="请选择"
          style="width:30%;margin-left:20px"
        >
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提醒">
        <el-input
          type="textarea"
          v-model="form.desc"
          placeholder="请输入提醒"
        ></el-input>
      </el-form-item>
      <el-form-item label="申请延期">
        <el-radio-group v-model="form.resource">
          <el-radio label="是"></el-radio>
          <el-radio label="否"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="优先级">
        <el-input
          type="textarea"
          v-model="form.desc"
          placeholder="请输入优先级"
        ></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align:right;">
      <el-button type="primary" @click="confirmmenu">
        确定
      </el-button>
      <el-button type="primary" @click="confirmmenu">
        下一步
      </el-button>
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      custom-class="large"
      :title="dialogType === 'edit' ? '修改' : '新增'"
    >
      <el-row>
        <el-col :span="7">
          <el-tree
            :data="treeData"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps"
          >
          </el-tree>
        </el-col>
        <el-col :span="17">
          <el-transfer v-model="value" :data="data"></el-transfer>
        </el-col>
      </el-row>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmmenu">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'addTask',
  data() {
    const generateData = (_) => {
      const data = []
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${i}`,
          disabled: i % 4 === 0
        })
      }
      return data
    }
    return {
      data: generateData(),
      value: [1, 4],
      //表单
      form: {
        name: '',
        region: ''
      },
      value1: '',
      value2: '',
      itmeLabel: '',
      dialogVisible: false,
      dialogType: 'new',
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
      }
      //弹窗里面的穿梭框
    }
  },
  computed: {},
  created() {},
  methods: {
    openHelp() {
      this.itmeLabel = ''
      this.dialogType = 'new'
      this.dialogVisible = true
    }
  }
}
</script>

<style type="css">
.choose-help {
  cursor: pointer;
}
</style>
