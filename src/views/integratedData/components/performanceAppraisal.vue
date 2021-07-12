<template>
  <!-- 摄像头初稿样品 -->
  <div class="list_box_mo">
    <el-row :gutter="32" class="chart-row">
      <el-col :lg="32" class="chart-box">
        <el-header>
          <span class="title">绩效考核</span>
          <span class="close">
            <img
              @click="fuanStatus"
              src="../../../../public/img/close1.png"
              alt=""
            />
          </span>
        </el-header> </el-col
    ></el-row>

    <div class="chart-row rowTab">
      <div class="chart-box">
        <div class="treeBox">
          <el-tree
            :highlight-current="true"
            node-key="id"
            class="permission-tree"
            ref="deptTree"
            :check-strictly="true"
            :default-expanded-keys="defaultMenutree"
            :default-checked-keys="defaultMenutree"
            :data="deptOptions"
            :props="defaultProps"
            @node-click="handleNodeClick"
            v-loading="treeloading"
          />
        </div>
      </div>
      <div class="tabBox" v-if="departmentAcc == '1'">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column
            prop="department"
            label="部门名称"
            align="center"
            width="476"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="good"
            label="优秀 （90-100分）"
            align="center"
            width="206"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="goods"
            label="良好 （80-89分）"
            align="center"
            width="206"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="general"
            label="一般 （70-79分）"
            align="center"
            width="206"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="qualified"
            label="合格 （69-70分）"
            align="center"
            width="206"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="poor"
            label="较差 （60分以下）"
            align="center"
            width="206"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
        </el-table>
      </div>
      <div
        class="tabBoxs"
        v-if="
          departmentAcc == '2' || departmentAcc == '3' || departmentAcc == '4'
        "
      >
        <el-table :data="tableDatas" style="width: 100%">
          <el-table-column
            prop="jobs"
            label="岗位名称"
            align="center"
            width="154"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            align="center"
            width="114"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="annualTarget"
            label="制定培训 计划数"
            align="center"
            width="124"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="training"
            label="培训时长"
            align="center"
            width="124"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="signed"
            label="发起安全责任书 签署数"
            align="center"
            width="184"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="responsibility"
            label="签署安全 责任书数"
            align="center"
            width="126"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="security"
            label="制定安全检查 计划数"
            align="center"
            width="166"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="check"
            label="安 全 检 查 计划次数 "
            align="center"
            width="136"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <!-- <el-table-column
            prop="hddenTrouble"
            label="隐患整改 完成数"
            align="center"
            width="116"
            :show-overflow-tooltip="true"
          >
          </el-table-column> -->
          <el-table-column
            prop="rectification"
            label="隐患整改 完成数"
            align="center"
            width="126"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="complete"
            label="技术交底 完成数"
            align="center"
            width="126"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="standard"
            label="达标情况"
            align="center"
            width="126"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { getTreeDeptSelect2 } from '@/api/job/workChart'
export default {
  name: 'performanceAppraisal',
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      departmentAcc: '1',
      defaultMenutree: ['200'],
      deptOptions: [],
      treeloading: false,
      tableData: [
        {
          department: '安全生产部',
          good: '100',
          goods: '70',
          general: '56',
          qualified: '37',
          poor: '14'
        },
        {
          department: '党委办公室',
          good: '93',
          goods: '77',
          general: '60',
          qualified: '40',
          poor: '17'
        },
        {
          department: '纪检监察室',
          good: '99',
          goods: '70',
          general: '56',
          qualified: '37',
          poor: '14'
        },
        {
          department: '人力资源部',
          good: '91',
          goods: '70',
          general: '56',
          qualified: '37',
          poor: '14'
        },
        {
          department: '工程部',
          good: '100',
          goods: '70',
          general: '56',
          qualified: '37',
          poor: '14'
        },
        {
          department: '财务及资产管理部',
          good: '96',
          goods: '70',
          general: '56',
          qualified: '37',
          poor: '14'
        },
        {
          department: '综合事物部',
          good: '92',
          goods: '70',
          general: '56',
          qualified: '37',
          poor: '14'
        },
        {
          department: '工会',
          good: '95',
          goods: '70',
          general: '56',
          qualified: '37',
          poor: '14'
        },
        {
          department: '风控审计部',
          good: '100',
          goods: '70',
          general: '56',
          qualified: '37',
          poor: '14'
        },
        {
          department: '第一分公司',
          good: '97',
          goods: '70',
          general: '56',
          qualified: '37',
          poor: '14'
        },
        {
          department: '第二分公司',
          good: '98',
          goods: '70',
          general: '56',
          qualified: '37',
          poor: '14'
        },
        {
          department: '第三分公司',
          good: '97',
          goods: '70',
          general: '56',
          qualified: '37',
          poor: '14'
        },
        {
          department: '第四分公司',
          good: '98',
          goods: '70',
          general: '56',
          qualified: '37',
          poor: '14'
        },
        {
          department: '第五分公司',
          good: '98',
          goods: '70',
          general: '56',
          qualified: '37',
          poor: '14'
        },
        {
          department: '经营公司',
          good: '98',
          goods: '70',
          general: '56',
          qualified: '37',
          poor: '14'
        },
        {
          department: '养护公司',
          good: '98',
          goods: '70',
          general: '56',
          qualified: '37',
          poor: '14'
        },
        {
          department: '开发公司',
          good: '98',
          goods: '70',
          general: '56',
          qualified: '37',
          poor: '14'
        },
        {
          department: '试验检测中心有限公司',
          good: '98',
          goods: '70',
          general: '56',
          qualified: '37',
          poor: '14'
        },
        {
          department: '临时',
          good: '98',
          goods: '70',
          general: '56',
          qualified: '37',
          poor: '14'
        }
      ],
      tableDatass: [
        {
          jobs: '部长',
          name: '刘彧辉',
          annualTarget: '达标',
          training: '14/20',
          signed: '不考核',
          responsibility: '10',
          security: '12',
          check: '22',
          hddenTrouble: '不考核',
          rectification: '达标',
          complete: '达标',
          standard: '73'
        },
        {
          jobs: '副部长',
          name: '付琦',
          annualTarget: '90%',
          training: '4',
          signed: '16',
          responsibility: '100',
          security: '不考核',
          check: '达标',
          hddenTrouble: '47',
          rectification: '60',
          complete: '40',
          standard: '90'
        },

        {
          jobs: '科员',
          name: '周丁丁',
          annualTarget: '不考核',
          training: '19',
          signed: '18',
          responsibility: '达标',
          security: '57',
          check: '达标',
          hddenTrouble: '13',
          rectification: '23',
          complete: '2',
          standard: '45'
        },
        {
          jobs: '科员',
          name: '刘君',
          annualTarget: '83%',
          training: '17',
          signed: '26',
          responsibility: '78',
          security: '达标',
          check: '100',
          hddenTrouble: '达标',
          rectification: '不考核',
          complete: '达标',
          standard: '82'
        },
        {
          jobs: '科员',
          name: '肖利平',
          annualTarget: '达标',
          training: '4/20',
          signed: '不考核',
          responsibility: '11',
          security: '100',
          check: '不考核',
          hddenTrouble: '80',
          rectification: '60',
          complete: '不考核',
          standard: '85'
        },
        {
          jobs: '科员',
          name: '王建峰',
          annualTarget: '39%',
          training: '19',
          signed: '100',
          responsibility: '达标',
          security: '23',
          check: '达标',
          hddenTrouble: '不考核',
          rectification: '12',
          complete: '40',
          standard: '97'
        }
        // {
        //   jobs: '生产组长',
        //   name: '金钟国',
        //   annualTarget: '73%',
        //   training: '24',
        //   signed: '不考核',
        //   responsibility: '96',
        //   security: '达标',
        //   check: '33',
        //   hddenTrouble: '84',
        //   rectification: '不考核',
        //   complete: '达标',
        //   standard: '83'
        // },
        // {
        //   jobs: '科长',
        //   name: '苏志燮',
        //   annualTarget: '达标',
        //   training: '47',
        //   signed: '24',
        //   responsibility: '47',
        //   security: '不考核',
        //   check: '达标',
        //   hddenTrouble: '20',
        //   rectification: '21',
        //   complete: '47',
        //   standard: '57'
        // },
        // {
        //   jobs: '安全副部长',
        //   name: '李光洙',
        //   annualTarget: '不考核',
        //   training: '19',
        //   signed: '19',
        //   responsibility: '不考核',
        //   security: '达标',
        //   check: '12',
        //   hddenTrouble: '达标',
        //   rectification: '达标',
        //   complete: '84',
        //   standard: '84'
        // },
        // {
        //   jobs: '生产副组长',
        //   name: '池石镇',
        //   annualTarget: '68%',
        //   training: '11',
        //   signed: '54',
        //   responsibility: '19',
        //   security: '100',
        //   check: '不考核',
        //   hddenTrouble: '32',
        //   rectification: '60',
        //   complete: '不考核',
        //   standard: '77'
        // },
        // {
        //   jobs: '安全副组长',
        //   name: '刘在石',
        //   annualTarget: '达标',
        //   training: '10/20',
        //   signed: '100',
        //   responsibility: '不考核',
        //   security: '达标',
        //   check: '45',
        //   hddenTrouble: '达标',
        //   rectification: '达标',
        //   complete: '85',
        //   standard: '90'
        // }
      ],
      tableDataslevel: [
        {
          jobs: '科员',
          name: '徐燕珍',
          annualTarget: '73%',
          training: '24',
          signed: '不考核',
          responsibility: '96',
          security: '达标',
          check: '33',
          hddenTrouble: '84',
          rectification: '不考核',
          complete: '达标',
          standard: '83'
        }
      ],
      tableDataslevels: [
        {
          jobs: '部长',
          name: '罗燕',
          annualTarget: '达标',
          training: '47',
          signed: '24',
          responsibility: '47',
          security: '不考核',
          check: '达标',
          hddenTrouble: '20',
          rectification: '21',
          complete: '47',
          standard: '57'
        },
        {
          jobs: '科员',
          name: '唐雅琴',
          annualTarget: '不考核',
          training: '19',
          signed: '19',
          responsibility: '不考核',
          security: '达标',
          check: '12',
          hddenTrouble: '达标',
          rectification: '达标',
          complete: '84',
          standard: '84'
        },
        {
          jobs: '科员',
          name: '张薇',
          annualTarget: '68%',
          training: '11',
          signed: '54',
          responsibility: '19',
          security: '100',
          check: '不考核',
          hddenTrouble: '32',
          rectification: '60',
          complete: '不考核',
          standard: '77'
        },
        {
          jobs: '科员',
          name: '朱鸿飞',
          annualTarget: '达标',
          training: '10/20',
          signed: '100',
          responsibility: '不考核',
          security: '达标',
          check: '45',
          hddenTrouble: '达标',
          rectification: '达标',
          complete: '85',
          standard: '90'
        }
      ]
    }
  },
  created: async function() {
    this.treeloading = true
    this.deptOptions = await getTreeDeptSelect2()
    this.treeloading = false
  },
  methods: {
    //关闭列表
    fuanStatus() {
      this.$emit('fuan', false)
    },
    //tree 选中 实践
    async handleNodeClick(data, keys) {
      // this.departmentAcc 1/2/3/4  1:江西省公路桥梁工程有限公司/2:安全生产部/3:第一分公司工程部/4:第一分公司综合部
      if (keys.key == '200') {
        this.departmentAcc = '1'
      } else if (keys.key == '412') {
        console.log("/////////////")
        this.departmentAcc = '2'
        this.tableDatas = this.tableDatass
      } else if (keys.key == '442') {
        this.departmentAcc = '3'
        this.tableDatas = this.tableDataslevel
      } else if (keys.key == '447') {
        this.departmentAcc = '4'
        this.tableDatas = this.tableDataslevels
      } else {
        this.departmentAcc = ''
      }
    }
  }
}
</script>

<style lang="scss">
.list_box_mo {
  .el-header {
    height: 60px;
    background: #0a1d73;
    padding: 0 40px;
    .title {
      font-size: 21px;
      font-weight: 500;
      color: #0096ff;
      line-height: 54px;
      background: linear-gradient(
        92deg,
        #81b8fc 0%,
        #00eaff 48.8525390625%,
        #5bc5fa 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .close {
      float: right;
      width: 40px;
      height: 40px;
      margin: 10px 0;
    }
  }
  .rowTab {
    margin: 20px 0 0;
    overflow: hidden;
    .chart-box {
      max-height: 800px;
      overflow: auto;
      width: 348px;
      float: left;
      .treeBox {
        margin: 0;
        .permission-tree {
          padding: 0 8px 0 40px;
          height: auto;
          background: none;
          .el-tree-node__content {
            height: 54px;
            line-height: 54px;
            .el-tree-node__label {
              font-weight: 500;
              color: #ffffff;
              font-size: 20px !important;
            }
          }
        }
      }
    }
    .tabBox {
      .el-table {
        background: rgba($color: #000000, $alpha: 0) !important;
        th {
          background: rgba($color: #000000, $alpha: 0) !important;
        }
        td {
          background: rgba($color: #000000, $alpha: 0) !important;
        }
      }
    }
    .tabBoxs {
      .el-table {
        background: rgba($color: #000000, $alpha: 0) !important;
        th {
          background: rgba($color: #000000, $alpha: 0) !important;
        }
        td {
          background: rgba($color: #000000, $alpha: 0) !important;
        }
      }
    }
  }
}
.treeBox .el-tree-node__content {
  &:hover {
    background: #0a1d73;
    color: #0096ff;
  }
}
.treeBox .el-tree-node:focus > .el-tree-node__content {
  background: #0a1d73;
  color: #0096ff;
}
.treeBox
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background: #0a1d73 !important;
  color: #0096ff;
}
.tabBox,
.tabBoxs {
  width: calc(100% - 410px);
  float: left;
  margin-left: 20px;
  border: 2px solid #1032ca;
}

.tabBox .el-table,
.tabBoxs .el-table {
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  line-height: 54px;
}
.tabBox .el-table thead,
.tabBoxs .el-table thead {
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  line-height: 54px;
}
.tabBox .el-table .el-table__body-wrapper,
.tabBoxs .el-table .el-table__body-wrapper {
  max-height: 734px;
}
.tabBox .el-table th,
.tabBoxs .el-table th {
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #1032ca !important;
  border-right: 1px solid #1032ca !important;
}
.tabBoxs .el-table th {
  height: 80px;
  line-height: 80px;
  color: #00eaff;
}
.tabBox .el-table td,
.tabBoxs .el-table td {
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #1032ca !important;
  border-right: 1px solid #1032ca !important;
}
.tabBox .el-table tr th:last-child,
.tabBoxs .el-table tr th:last-child {
  border-right: none !important;
}
.list_box_mo .rowTab .tabBox .el-table tr th:nth-child(2) {
  background: rgba(36, 38, 114, 0.8) !important;
}
.list_box_mo .rowTab .tabBox .el-table tr th:nth-child(3) {
  background: rgba(10, 46, 91, 0.8) !important;
}
.list_box_mo .rowTab .tabBox .el-table tr th:nth-child(4) {
  background: rgba(35, 59, 58, 0.8) !important;
}
.list_box_mo .rowTab .tabBox .el-table tr th:nth-child(5) {
  background: rgba(74, 77, 62, 0.8) !important;
}
.list_box_mo .rowTab .tabBox .el-table tr th:nth-child(6) {
  background: rgba(91, 11, 52, 0.8) !important;
}
.tabBox .el-table tr td:last-child,
.tabBoxs .el-table tr td:last-child {
  border-right: none !important;
}
.tabBox .el-table tr:last-child td,
.tabBoxs .el-table tr:last-child td {
  border-bottom: none !important;
}
.list_box_mo .rowTab .tabBox .el-table tr td:nth-child(2) {
  background: rgba(36, 38, 114, 0.8) !important;
}
.list_box_mo .rowTab .tabBox .el-table tr td:nth-child(3) {
  background: rgba(10, 46, 91, 0.8) !important;
}
.list_box_mo .rowTab .tabBox .el-table tr td:nth-child(4) {
  background: rgba(35, 59, 58, 0.8) !important;
}
.list_box_mo .rowTab .tabBox .el-table tr td:nth-child(5) {
  background: rgba(74, 77, 62, 0.8) !important;
}
.list_box_mo .rowTab .tabBox .el-table tr td:nth-child(6) {
  background: rgba(91, 11, 52, 0.8) !important;
}
.tabBox .el-table tbody tr:hover > td,
.tabBoxs .el-table tbody tr:hover > td {
  border-bottom: 1px solid #1032ca !important;
  border-right: 1px solid #1032ca !important;
}
/* 删除表格下横线 */
.tabBox .el-table::before,
.tabBoxs .el-table::before {
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0px;
}

.tabBox .el-table,
.tabBox .el-table__expanded-cell,
.tabBoxs .el-table,
.tabBoxs .el-table__expanded-cell {
  background-color: transparent;
}

.tabBox .el-table tr,
.tabBoxs .el-table tr {
  background-color: transparent !important;
}
.tabBox .el-table--enable-row-transition .el-table__body td,
.tabBox .el-table .cell,
.tabBoxs .el-table--enable-row-transition .el-table__body td,
.tabBoxs .el-table .cell {
  background-color: transparent;
}
</style>
