<template>
  <div class="table-wrapper">
    <div class="head_query">
      <div class="base-main">
        <el-form ref="form" :model="form">
          <el-form-item label="地区" label-width="80px">
            <el-select
              v-model="provinceCode"
              placeholder="请选择省"
              @change="getProvince"
              style="width: 180px"
            >
              <el-option
                v-for="item in provinceList"
                :key="item.provinceCode"
                :label="item.areaName"
                :value="{ value: item.provinceCode, label: item.areaName }"
              ></el-option>
            </el-select>
            <el-select
              v-model="cityCode"
              placeholder="请选择市"
              @change="getCity"
              style="width: 180px"
            >
              <el-option
                v-for="item in cityList"
                :key="item.cityCode"
                :label="item.cityName"
                :value="{ value: item.cityCode, label: item.cityName }"
              ></el-option>
            </el-select>
            <el-select
              v-model="countryCode"
              placeholder="请选择县/区"
              @change="getArea"
              style="width: 200px"
            >
              <el-option
                v-for="item in countryList"
                :key="item.countryCode"
                :label="item.countryName"
                :value="{ value: item.countryCode, label: item.countryName }"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目进度：" label-width="200px">
            <el-select
              v-model="dictLabel"
              placeholder="请选进度"
              style="width: 200px"
              @change="peojectFunc"
            >
              <el-option
                :value="item.dictCode"
                v-for="item in classResD"
                :key="item.dictCode"
                :label="item.dictLabel"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属公司：" label-width="300px">
            <el-cascader
              ref="cascader"
              v-model="deptId"
              :options="treeResDept"
              :props="jobProps"
              @change="change"
              clearable
              :show-all-levels="false"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span class="close">
          <img
            @click="fuanStatus"
            src="../../../../public/img/close1.png"
            alt=""
          />
        </span>
      </div>
    </div>
    <el-table
      ref="singleTable"
      :data="tableData"
      border
      highlight-current-row
      style="width: 1920px"
      tooltip-effect="light"
      :row-style="{ background: '#3f5c6d2c', 'text-align': 'center',height:'70px' }"
      :header-row-style="{
        color: '#0096FF',
        background: '#3f5c6d2c',
        'text-align': 'center',
        fontSize: '20px',
      }"
      :header-cell-style="{
        color: '#0096FF',
        background: '#3f5c6d2c',
        'text-align': 'center',
        fontSize: '20px',
        fontFamily: 'PingFang SC',
      }"
      :cell-style="{
        color: '#FFFFFF',
        fontFamily: 'PingFang SC',
        fontSize: '20px',
        'text-align': 'center',
        bordercolor: '#1032CA',
      }"
    >
      <el-table-column type="index" label="序号" width="120" ></el-table-column>
      <el-table-column property="position" label="具体位置" show-overflow-tooltip >
      </el-table-column>
      <el-table-column
        property="projectName"
        label="项目名称"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column property="bid" label="标段" width="160" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="projectType" label="项目类型" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="projectProcess" label="项目进度" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        property="startTime"
        label="开始时间"
        width="300"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column property="projectDept" label="所属公司/部门" show-overflow-tooltip>
      </el-table-column>
      <!-- <el-table-column property="name" label="现场情况" width="120">
        <img
          style="cursor: pointer"
          src="../../../../public/img/hanhan-01-01.png"
          alt=""
        />
      </el-table-column> -->
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="pageSize"
      background
      layout="total, prev, pager, next, sizes, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import city from "./mapJS/city.json";
import { getSelectTheme } from "@/api/system/class";
import { mapListData } from "@/api/dataBulletinBoard/index";
import { getTreeDeptSelect } from "@/api/system/user";
export default {
  props: {
    person: String,
  },
  data() {
    return {
      jobProps: {
        value: "id",
        label: "label",
        checkStrictly: true,
      },

      tableData: [],
      pageNum: 1, //默认当前页
      pageSize: 10,
      total: 0,
      form: {},
      //记录省市县
      provinceList: [],
      dataprovinceList: [],
      provinceCode: "", //省份的数据
      dictLabel: [],
      cityList: [],
      datacityList: [],
      cityCode: "", //市区的数据

      countryList: [],
      datacountryList: [],
      countryCode: "", //县的数据

      personData: "", //传过来的

      classResD: [],
      projectProcessId: [], //项目进度id
      treeResDept: [],
      deptId: "",
    };
  },
  mounted() {
    this.showcity();
  },
  created() {},
  methods: {
    async refreshA(e) {
      if (e != undefined && e != "") {
        this.personData = e;
      }
      let res = await mapListData(
        this.personData,
        this.pageNum,
        this.pageSize,
        this.projectProcessId,
        this.deptId
      );
      this.total = res.total;
      this.tableData = res.rows;
      this.getClassSel();
    },
    //获取分类下拉列表
    async getClassSel() {
      let dictName = "project_schdule";
      this.classResD = await getSelectTheme(dictName);
      this.treeResDept = await getTreeDeptSelect(); //获取部门
    },
    //获取项目进度下拉id
    peojectFunc(val, vIndex) {
      let resultArr = this.classResD.filter((item) => {
        return item.dictCode === val;
      });
      //把值赋给要传给后台的表单对象中
      this.projectProcessId = resultArr[0].dictCode;
      this.refreshA();
    },
    //选择岗位
    async change(val) {
      if (val.length > 0) {
        this.treeArr = val;
        this.deptId = this.treeArr[this.treeArr.length - 1];
        this.refreshA();
      }
    },

    //关闭列表
    fuanStatus() {
      this.$emit("fuan", true);
    },
    showcity() {
      var provinceArr = [];
      var cityArr = [];
      var countryArr = [];
      for (let i = 0; city.length > i; i++) {
        //循环获取省级单位
        for (var key in city[i]) {
          let provinceCode = city[i].areaId;
          let areaName = city[i].areaName;
          var cities = city[i].cities;
          var pro = { provinceCode, areaName };
        }
        //循环获取市级单位
        for (var j = 0; cities.length > j; j++) {
          let cityName = cities[j].areaName;
          let cityCode = cities[j].areaId;
          var counties = cities[j].counties;
          var citiesres = { cityName, cityCode };
          cityArr.push(citiesres);
          //循环获取县级单位
          for (var n = 0; counties.length > n; n++) {
            let countryName = counties[n].areaName;
            let countryCode = counties[n].areaId;
            var countiesres = { countryName, countryCode };
            countryArr.push(countiesres);
          }
          //console.log(countiesres);
        }

        provinceArr.push(pro);
      }
      this.provinceList = provinceArr;
      this.cityList = cityArr;
      this.countryList = countryArr;
      this.dataprovinceList = provinceArr;
      this.datacityList = cityArr;
      this.datacountryList = countryArr;
      //console.log(this.cityList);
      //console.log(this.cityArr);
      //console.log(this.countryList);
    },
    //省和市的联动,根据市/100的整数商进行遍历
    getProvince(e) {
      this.personData = e.label;
      this.cityList = this.datacityList;
      if (this.provinceCode.value != 0) {
        let cArray = this.cityList;
        let cArrres = [];
        for (var i = 0; cArray.length > i; i++) {
          if (parseInt(cArray[i].cityCode / 100) == this.provinceCode.value) {
            cArrres.push(cArray[i]);
          } else {
          }
        }
        this.cityList = cArrres;
        // this.cityCode = this.cityList[0].cityCode;
        //回调自动获取当前选择的县区

        // this.getCity();
        this.refreshA();
      }
    },
    //市县联动
    getCity(e) {
      this.personData = e.label;
      this.countryList = this.datacountryList;
      if (this.cityCode.value != 0) {
        let cArray = this.countryList;
        let cArrres = [];
        for (var i = 0; cArray.length > i; i++) {
          if (parseInt(cArray[i].countryCode / 100) == this.cityCode.value) {
            cArrres.push(cArray[i]);
          } else {
          }
        }
        this.countryList = cArrres;
        this.refreshA();
        // this.countryCode = this.countryList[0].countryCode;
      }
    },
    // 县区
    getArea(e) {
      this.personData = e.label;
      this.refreshA();
      console.log(this.countryCode);
    },

    /**
     * 分页器
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.refreshA();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.refreshA();
    },
  },
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类

.table-wrapper .head_query {
  width: 1920px;
  height: 60px;
  background: #0a1d73;
  .base-main {
    display: flex;
    .close {
      height: 59px;
      margin-left: 220px;
      img {
        width: 40px;
        margin-top: 10px;
        height: 40px;
        cursor: pointer;
      }
    }
  }
  /deep/.el-form {
    display: flex;
  }
  /deep/ .el-form-item__label {
    font-size: 21px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #0096ff;
    margin-top: 10px;
  }
  /deep/ .el-select {
    line-height: 59px;
  }
  /deep/ .el-icon-arrow-up:before {
    content: "\e790";
  }
  /deep/ .el-icon-arrow-down:before {
    content: "\e790";
  }
  /deep/ .el-input__suffix {
    height: 63px;
    color: #0096ff;
  }
}

.table-wrapper /deep/ input::-webkit-input-placeholder {
  color: #0096ff;
}
.table-wrapper .base-main /deep/ .el-input__inner {
  background-color: #0a1d73;
  border: none;
  color: #0096ff;
  font-size: 21px;
  font-family: PingFang SC;
  font-weight: 500;
  margin-top: 10px;
}
.table-wrapper /deep/ input::-moz-input-placeholder {
  color: #0096ff;
}
.table-wrapper /deep/ input::-ms-input-placeholder {
  color: #0096ff;
}
.table-wrapper /deep/ .el-select .el-input .el-select__caret {
  color: #0096ff;
}
.table-wrapper /deep/ .el-table,
.el-table__expanded-cell {
  background-color: transparent;
}

.table-wrapper /deep/ .el-table tr {
  background-color: transparent !important;
}
.table-wrapper /deep/ .el-table--enable-row-transition .el-table__body td,
.el-table .cell {
  background-color: transparent;
}
.table-wrapper /deep/ .el-table::before {
  height: 0;
}
.table-wrapper /deep/ .el-table th.gutter {
  /*
    * 解决element-ui 表格篡位的问题 👇
    */
  display: table-cell !important;
}
.table-wrapper /deep/ .el-table {
  border: 1px solid #1032ca;
  border-bottom: none;
  border-right: none;
}
.table-wrapper /deep/ .el-table--border th,
.el-table--border td,
.el-table th.is-leaf {
  border-right: 1px solid #1032ca;
  border-bottom: 1px solid #1032ca;
}
.table-wrapper /deep/ .el-table--border td {
  border-right: 1px solid #1032ca;
  border-bottom: 1px solid #1032ca !important;
}
.table-wrapper /deep/ .el-pagination__total,
.el-pagination__jump {
  color: #ffffff;
}
.table-wrapper /deep/ .el-pagination__jump {
  color: #ffffff;
}
.table-wrapper /deep/ .el-table--border::after {
  width: 0;
}
.table-wrapper /deep/ .el-table .el-table__body tr.el-table__row:hover > td {
  color: #fff;
  background-color: #0a1d73 !important;
}
</style>