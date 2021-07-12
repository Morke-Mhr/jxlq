<template>
  <!-- 安全日志 -->
  <div class="yhReport safe_main">
    <lookSecurity v-if="isadd" :person="personData" @func="getMsgFormSon" />
    <div v-if="!isadd">
      <!-- 查询 -->
      <div class="sxForm">
        <el-form
          :inline="true"
          :model="formInline"
          ref="formInline"
          class="demo-form-inline"
        >
          <el-form-item label="部门" prop="deptName">
            <el-input
              v-model="formInline.deptName"
              placeholder="部门"
            ></el-input>
          </el-form-item>
          <el-form-item label="岗位" prop="deptName">
            <el-input
              v-model="formInline.postName"
              placeholder="岗位"
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="createBy">
            <el-input
              v-model="formInline.createBy"
              placeholder="姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="日期" prop="logTime">
            <div class="block">
              <el-date-picker
                v-model="formInline.logTime"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="天气" prop="weatherName">
            <el-input
              v-model="formInline.weatherName"
              placeholder="天气"
            ></el-input>
          </el-form-item>
          <div class="btnCont">
            <el-button v-has="has.query" class="chaxun" @click="onSubmit"
              >查询</el-button
            >
            <el-button class="chongzhi" @click="onClear('formInline')"
              >重置</el-button
            >
          </div>
        </el-form>
      </div>
      <!-- 新增及删除 -->
      <div class="sxTable">
        <el-button
          v-has="has.delete"
          class="table-default-btn"
          @click="handleDelete()"
          >批量删除</el-button
        >

        <!-- 表格 -->
        <el-table
          ref="multipleTable"
          :data="tableData"
          v-loading="loading"
          tooltip-effect="light"
          style="width: 100%"
          height="calc(100vh - 370px)"
          @selection-change="handleSelectionChange"
          :header-cell-style="{ color: '#000000' }"
          stripe
        >
          <!-- 表格部分 -->
          <el-table-column
            type="selection"
            label="全选"
            width="55"
          ></el-table-column>
          <el-table-column label="部门" align="center">
            <template slot-scope="scope">{{ scope.row.deptName }}</template>
          </el-table-column>
          <el-table-column label="岗位" align="center">
            <template slot-scope="scope">{{ scope.row.postName }}</template>
          </el-table-column>
          <el-table-column label="姓名" align="center">
            <template slot-scope="scope">{{ scope.row.createBy }}</template>
          </el-table-column>
          <el-table-column label="日期" align="center">
            <template slot-scope="scope">{{ scope.row.logTime }}</template>
          </el-table-column>
          <el-table-column label="天气" align="center">
            <template slot-scope="scope">{{ scope.row.weatherName }}</template>
          </el-table-column>
          <!-- 根据权限列表显示当前列的内容 -->
          <el-table-column prop="cz" label="操作" align="center">
            <template slot-scope="scope">
              <!-- 这里可以拿到当前行的内容 row -->
              <el-button
                size="small"
                type="text"
                @click="goCheck(scope, tableData)"
                >查看</el-button
              >
              <el-button
                size="small"
                type="text"
                v-has="has.delete"
                @click.native.prevent="deleteRow(scope.row.safelogId)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
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
</template>

<script>
import {
  getList,
  getInquire,
  getPaging,
  getCheck,
  getDelete
} from '@/api/hiddenDanger/security'
import LookSecurity from './lookSecurity'
export default {
  components: { LookSecurity },
  data() {
    return {
      has: {
        delete: 'hiddenPerils.safeLog.deleteData',
        query: 'hiddenPerils.safeLog.findWrapper',
        add: 'hiddenPerils.safeLog.saveOrUpdate',
        idQuery: 'hiddenPerils.safeLog.findById'
      },
      tableData: [],
      loading: true,
      total: 0,
      multipleSelection: [], //全选
      delarr: [],
      pageNum: 0, //默认当前页
      pageSize: 10,
      formInline: {
        deptName: '',
        postName: '',
        createBy: '',
        logTime: '',
        weatherName: ''
      },
      hiddenTableHeader: false,
      isadd: false,
      personData: ''
    }
  },
  created() {
    this.getClass()
  },
  methods: {
    //创建请求列表
    async getClass() {
      let data = await getList()
      this.tableData = data.rows
      this.total = data.total
      this.loading = false
    },
    onClear(formName) {
      this.$refs[formName].resetFields()
      this.getClass()
    },

    //提交查询
    async onSubmit() {
      // if (
      //   this.formInline.deptName != "" ||
      //   this.formInline.postName != "" ||
      //   this.formInline.createBy != "" ||
      //   this.formInline.logTime != "" ||
      //   this.formInline.weatherName != ""
      // ) {
      try {
        let resdata = JSON.parse(JSON.stringify(this.formInline))
        let { deptName, postName, createBy, logTime, weatherName } = resdata
        let data = await getInquire(
          deptName,
          postName,
          createBy,
          logTime,
          weatherName
        )
        this.tableData = data.rows
        this.total = data.total
        this.loading = false
      } catch (e) {
        console.error('接口异常')
      }
      // } else {
      //   this.$message.error("请填写最少一条查询条件");
      // }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //删除单个
    deleteRow(row) {
      console.log(row)
      this.$confirm('确定删除吗?', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await getDelete(row)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getClass()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    //删除多个
    handleDelete() {
      if (this.multipleSelection != '') {
        this.$confirm('确定删除吗?', '删除', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            const length = this.multipleSelection.length
            for (let i = 0; i < length; i++) {
              this.delarr.push(this.multipleSelection[i].safelogId)
            }
            const yourArr = JSON.parse(JSON.stringify(this.delarr))
            await getDelete(yourArr)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getClass()
            this.$refs.multipleTable.clearSelection()
          })
          .catch((err) => {
            console.error(err)
          })
      } else {
        this.$message.error('请选择要删除项')
      }
    },
    //查看
    goCheck(scope) {
      this.isadd = true
      this.personData = scope.row.safelogId
    },
    //完成后回调
    getMsgFormSon() {
      this.isadd = false
      this.getClass()
    },

    /**
     * 分页器
     */
    handleSizeChange(val) {
      this.pageSize = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getData()
    },
    async getData() {
      let data = await getPaging(this.pageNum, this.pageSize)
      this.tableData = data.rows
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.content-box {
  background-color: #f4f1f2;
  .content {
    padding: 15px 25px;
    .inquire {
      display: flex;
      padding-top: 15px;
      margin-bottom: 15px;
      background-color: #fff;
      .demo-form-inline {
        margin-left: 20px;
      }
    }
    .content-bottom {
      background-color: #fff;
      padding: 15px;
      .upload {
        position: relative;
        .el-upload-list--picture .el-upload-list__item {
          border: none;
        }
        .shade {
          position: absolute;
          right: 0;
          height: 100%;
          width: 30%;
          top: 0;
          z-index: 999999;
          background-color: #fff;
        }
      }

      .header-right {
        margin-bottom: 15px;
        margin-left: 20px;
      }
      .el-table th.gutter {
        /*
    * 解决element-ui 表格篡位的问题 👇
    */
        display: table-cell !important;
      }
      .el-button--small,
      .el-button--small.is-round {
        margin-left: 20px;
      }
      .el-pagination {
        display: flex;
        justify-content: flex-end;
        margin-top: 15px;
      }
    }
  }
}
</style>
