<template>
  <div class="content-box">
    <div class="content safe_main">
      <div class="content-bottom">
        <div class="ve_line">
          <div class="ve_line_top">
            <div class="title_box">
              <span>技术交底完成量</span>
              <p></p>
            </div>
            <div class="year">
              <el-select
                v-model="value"
                placeholder="年度筛选"
                @change="ChangeYear"
                style="width: 110px"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="table-box">
            <el-table
              :data="tableData"
              style="width: 100%"
              tooltip-effect="light"
              height="calc(100vh - 380px)"
              :row-class-name="tableRowClassName"
            >
              <el-table-column
                prop="projectName"
                label="项目名称"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="targetNumber"
                label="交底次数"
                width="200"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column label="交底完成率">
                <template slot-scope="scope">
                  <el-progress
                    :percentage="scope.row.completionRate"
                  ></el-progress>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <el-pagination
              style="text-align:right"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNum"
              :page-sizes="[5, 10, 20, 50]"
              :page-size="pageSize"
              background
              layout="total, prev, pager, next, sizes, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
      <div class="content-bottom chart">
        <div class="ve_line">
          <div class="title_box">
            <span>技术交底趋势</span>
            <p></p>
          </div>
          <ve-line :data="chartData" :settings="chartSettings"></ve-line>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getLists,
  getChartData
} from '@/api/technology/disclosureStatistical/disclosureStatistical.js'

export default {
  components: {},
  data() {
    this.chartSettings = {}
    return {
      value: '', //选择的年份
      CurrentYear: '', //当前年份
      options: [],
      pageNum: 1, //默认当前页
      pageSize: 10,
      total: 0,
      chartData: {
        columns: ['日期', '一级技术交底', '二级技术交底', '三级技术交底'],
        rows: []
      },
      tableData: []
    }
  },
  created() {
    let nowDate = new Date()
    this.CurrentYear = nowDate.getFullYear()
    this.getListData()
    this.getStudyData()
    /**
     * 获取当前时间
     * 格式YYYY-MM-DD
     */
    var aData = new Date()
    this.value = aData.getFullYear()
    this.date_year = aData.getFullYear() + ''
    this.options = [
      {
        value: aData.getFullYear() - 3,
        label: aData.getFullYear() - 3
      },
      {
        value: aData.getFullYear() - 2,
        label: aData.getFullYear() - 2
      },
      {
        value: aData.getFullYear() - 1,
        label: aData.getFullYear() - 1
      },
      {
        value: aData.getFullYear(),
        label: aData.getFullYear()
      }
    ]
  },

  methods: {
    tableRowClassName({ row, rowIndex }) {
      if ((rowIndex + 1) % 2 === 0) {
        return 'warning-row'
      }
      return ''
    },
    //获取表格的数据
    async getListData() {
      let data = await getLists(this.pageNum, this.pageSize, this.CurrentYear)
      this.tableData = data.rows
      this.total = data.total
    },
    //选中的年份
    ChangeYear(e) {
      //请求其它年份前清除数据
      this.chartData.rows = []
      this.CurrentYear = e
      this.getListData()
      this.getStudyData()
    },
    //获取
    async getStudyData() {
      let resTechnology = await getChartData(this.CurrentYear)
      //技术交底趋势
      for (var i = 0; i < resTechnology.length; i++) {
        this.chartData.rows.push({
          日期: resTechnology[i].month,
          一级技术交底: resTechnology[i].oneNumber,
          二级技术交底: resTechnology[i].twoNumber,
          三级技术交底: resTechnology[i].threeNumber
        })
      }
    },

    /**
     * 分页器
     */
    handleSizeChange(val) {
      this.pageSize = val
      this.getListData()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getListData()
    }
  }
}
</script>
<style lang="scss">
//@import url(); 引入公共css类
.el-table .warning-row {
  background: #f2f2f2;
}
.content-box {
  background-color: #f4f1f2;
  .content {
    // margin: 15px 25px;
    .content-bottom {
      background-color: #fff;
      //   height: 59px;
      .ve_line_top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 16px;
        .title_box {
          height: 59px;
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          color: #175eb6;
          line-height: 59px;
          display: grid;
          border-bottom: 2px solid #f2f2f2;
          p {
            margin: -3px 0 0 0;
            width: 98px;
            height: 3px;
            background: #366dbb;
          }
        }
      }
      .table-box {
        margin: 30px 16px 0 16px;
      }
    }
    .chart {
      margin-top: 10px;
      .title_box {
        height: 59px;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        color: #175eb6;
        line-height: 59px;
        display: grid;
        margin: 0 16px;
        border-bottom: 2px solid #f2f2f2;
        p {
          margin: -3px 0 0 0;
          width: 98px;
          height: 3px;
          background: #366dbb;
        }
      }
    }
  }
}
</style>
