<template>
  <!-- 培训跟踪 -->
  <div class="app-container">
    <div class="sxForm">
      <el-form
        :inline="true"
        :model="pageForm"
        ref="pageForm"
        class="demo-form-inline"
      >
        <el-form-item label="年份" prop="year">
          <el-date-picker
            v-model="pageForm.year"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="选择年"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader
            ref="refLeadDept"
            v-model="pageForm.deptId"
            :options="this.departments"
            :props="deptProps"
            @change="peojectTypePost"
            clearable
            class="deptLabel"
            :show-all-levels="false"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="岗位" prop="postId">
          <el-select
            v-model="pageForm.name"
            placeholder="请先选择部门"
            style="width: 100%"
            @change="handleChangePost"
          >
            <el-option
              v-for="item in jobss"
              :key="item.postId"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input
            v-model="pageForm.userName"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <div class="btnCont">
          <el-button class="chaxun" v-has="has.query" @click="onSubmit()"
            >查询</el-button
          >
          <el-button @click="resetForm('pageForm')" class="chongzhi"
            >重置</el-button
          >
        </div>
      </el-form>
    </div>
    <div class="sxTable">
      <div class="header-right">
        <el-button class="blue" v-has="has.add" @click="exportExcel()"
          >导出</el-button
        >
        <el-button class="blue" v-has="has.delete" @click="handleDelete()"
          >下载二维码
        </el-button>
        <div id="qrcodeD" style="display: none"></div>
      </div>

      <el-table
        :data="tableData"
        v-loading="loading"
        tooltip-effect="light"
        style="width: 100%"
        height="calc(100vh - 380px)"
        @selection-change="handleSelectionChange"
        @row-click="rowClick"
        row-key="safebookId"
        stripe
      >
        <el-table-column
          type="selection"
          label="全选"
          align="center"
          width="55"
        ></el-table-column>
        <el-table-column align="center" label="部门" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.deptName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="岗位" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.postName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="姓名" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.userName }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="培训需求(小时)"
          width="150"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.needPxhour }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="已培训课时(小时)"
          width="150"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.areadyPxhour }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="培训完成率"
          width="150"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.finishstatPx >= 100 ? 100 : scope.row.finishstatPx }}%
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="参加培训次数"
          width="150"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.countPx }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="线上培训(小时)"
          width="150"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.onlinePxhour }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="线下培训(小时)"
          width="150"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.offlinePxhour }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="自学(小时)"
          width="150"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.selfPxhour }}
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="pageSizes"
        :page-size="pageForm.pageSize"
        @size-change="handleSizeChange"
        :current-page.sync="currentPage"
        @current-change="handleCurrentChange"
      >
      </el-pagination>

      <!-- 培训详情 -->
      <el-dialog
        title="个人培训记录"
        :visible.sync="dialogVisible"
        custom-class="small"
      >
        <children v-if="dialogVisible == true" :person="personData"></children>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { traintrack, getPostsByDeptId } from "@/api/safety/plan.js";
import { getLoginDept } from "@/api/system/dept.js";
import axios from "axios";
import { getToken } from "@/utils/auth";
import children from "../dialog/index.vue";
import QRCode from "qrcodejs2";
import JSZip from "jszip";
import FileSaver from "file-saver";
export default {
  components: { children: children },
  data() {
    return {
      isShow: true,
      has: {
        query: "train:trainPlan:trainRecordList",
        details: "train:trainPlan:query",
      },
      videoFlag: false,
      tableData: [],
      total: 100,
      pageSizes: [10, 15, 20, 25, 30],
      dialogVisible: false,
      //搜索
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        year: "",
        deptId: "",
        postId: "",
        userName: "",
      },
      pageNum: 1, //默认当前页
      pageSize: 10,
      loading: false,
      flag: true,
      multipleSelection: [], //全选
      //表单验证方法
      formRules: {
        kjName: [
          {
            required: true,
            message: "请输入课件名称",
            trigger: "blur",
          },
        ],
        kjClassId: [
          {
            required: true,
            message: "请选择课件类型",
            trigger: "blur",
          },
        ],
        pxClassId: [
          {
            required: true,
            message: "请选择培训类别",
            trigger: "blur",
          },
        ],
        pxTitleId: [
          {
            required: true,
            message: "请选择培训主题",
            trigger: "blur",
          },
        ],
        kjFileUrl: [
          {
            required: true,
            message: "请选择课件附件",
            trigger: "blur",
          },
        ],
        isPublic: [
          {
            required: true,
            message: "请选择是否开放",
            trigger: "blur",
          },
        ],
      },
      //新增表单字段对象
      addBook: {
        //课件分类id
        kjClassId: "",
        //课件分类
        kjClass: "",
        //培训类别id
        pxClassId: "",
        //培训类别
        pxClass: "",
        //培训主题id
        pxTitleId: "",
        //培训主题
        pxTitle: "",
        //课件名称
        kjName: "",
        //课件附件url
        kjFileUrl: "",
        //开始时间
        isPublic: "",
      },
      classRes: [],
      departments: [],
      deptProps: {
        value: "id",
        label: "label",
        checkStrictly: true,
      },
      jobss: [],
      // 当前页数
      currentPage: 1,
      personData: "",
      qrcodeArr: [],
    };
  },
  created: async function () {
    this.isShow = false;
    this.getAllList();
    this.peojectTypeFunc();
    this.peojectTypePost()
  },
  mounted() {
    this.$nextTick().then(() => {
      this.isShow = true;
    });
  },
  computed: {},
  methods: {
    //点击某一行
    async rowClick(row, column, event) {
      this.personData = row.userId;
      this.dialogVisible = true;
    },

    // 导出
    exportExcel() {
      // 导出当前页
      var data = this.pageForm;
      axios({
        method: "get",
        url:
          this.$store.state.apiConfiguration.url +
          this.$store.state.serviceName.safetyEdu +
          "/trainPlan/traintrack/export",
        responseType: "blob", // 表明返回服务器返回的数据类型
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken(),
        },
        params: data,
      }).then(function (response) {
        //创建一个隐藏的a连接，
        const link = document.createElement("a");
        let blob = new Blob([response.data], {
          type: "application/vnd.ms-excel",
        });
        link.style.display = "none";
        //设置连接
        link.href = URL.createObjectURL(blob);
        link.download = "培训跟踪列表.xlsx";
        document.body.appendChild(link);
        //模拟点击事件
        link.click();
      });
    },
    //下载二维码
    handleDelete() {
      let newArr = this.multipleSelection;
      let that = this;
      if (newArr.length == 0) {
        this.$message({
          message: "请选择要下载二维码!",
          type: "warning",
        });
        return false;
      }
      document.getElementById("qrcodeD").innerHTML = "";
      this.$nextTick(() => {
        newArr.map((item, i) => {
          (function (code) {
            new QRCode("qrcodeD", {
              width: 200,
              height: 200, // 高度
              text: code, // 二维码内容
              correctLevel: QRCode.CorrectLevel.H,
            });
          })(
            `${this.$store.state.apiConfiguration.htmlUrl}#/personalDetails?userId=${item.userId}`
          );
          downloadQrCode(item.userName, i);
        });
      });

      function downloadQrCode(e, v) {
        let myselfCanvas = document
          .getElementById("qrcodeD")
          .getElementsByTagName("canvas");
        let img = document
          .getElementById("qrcodeD")
          .getElementsByTagName("img");
        let ah = document.createElement("a");
        img.src = myselfCanvas[v].toDataURL("image/jpg");
        that.qrcodeArr.push({
          url: img.src,
          name: e,
        });
        ah.href = img.src;
        ah.download = e;
        ah.click();

        // if (newArr.length == that.qrcodeArr.length) {
        //   that.BatchDownload();
        // }
      }
    },
    //文件打包
    // BatchDownload() {
    //   let that = this;
    //   const zip = new JSZip();
    //   const cache = {};
    //   setTimeout((_) => {
    //     let arr = that.qrcodeArr;
    //     arr.forEach((item, index) => {
    //       let fileName = item.name;
    //       zip.file(fileName + ".png", item.url.substring(22), { base64: true });
    //       cache[fileName] = item.url;
    //     });
    //     zip.generateAsync({ type: "blob" }).then((content) => {
    //       FileSaver.saveAs(content, "二维码.zip");
    //     });
    //   }, 0);
    // },

    async onSubmit() {
      let params = {
        pageNum: 1,
        pageSize: this.pageSize,
        year: this.pageForm.year,
        deptId: this.pageForm.deptId,
        postId: this.pageForm.postId,
        userName: this.pageForm.userName,
      };
      let data = await traintrack(params);
      this.tableData = data.rows;
      this.loading = false;
      this.total = data.total;
      this.currentPage = 1;
    },
    //获取部门
    async peojectTypeFunc() {
      this.departments = await getLoginDept();
      console.log(this.departments, "111");
    },
    //获取岗位
    async peojectTypePost(arr) {
      if (arr.length > 0) {
        this.pageForm.deptId = arr[arr.length - 1];
        this.jobss = await getPostsByDeptId(arr[arr.length - 1]);
      } else {
        this.pageForm.deptId = "";
        this.jobss = [];
      }
    },
    handleChangePost(value) {
      console.log(value, "666");
      this.jobss.map((item) => {
        if (item.name == value) {
          this.pageForm.postId = item.postId;
        }
      });
      console.log(this.pageForm.postId);
    },
    //全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //获取列表
    async getAllList() {
      this.loading = true;
      const res = await traintrack(this.pageForm);
      this.tableData = res.rows;
      this.total = res.total;
      this.loading = false;
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getAllList();
      this.pageForm.name = "";
      this.deptProps.value=''
    },
    //页脚
    handleSizeChange(val) {
      this.pageForm.pageSize = val;
      this.onSubmit();
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val;
      this.getAllList();
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .deptLabel .el-input .el-input__inner {
  width: 350px !important;
}
/deep/.el-dialog .el-dialog__body {
  height: auto;
}

.top_Box {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #c4c4c4;
  padding: 0 10px 20px 10px;
  .leftBox {
    width: 80%;
    // display: flex;
    // justify-content: space-between;
    ul {
      display: inline-block;
      padding-left: 15px;
      margin: 0;
      li {
        list-style: none;
        height: 40px;
        line-height: 40px;
      }
    }
    .avatarBox {
      width: 100px;
      height: 100px;
      display: inline-block;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
  #qrcode {
    width: 90px;
    height: 90px;
    margin-top: 20px;
  }
}
.bottom_Box {
  display: flex;
  margin-top: 20px;
  .left_time {
    width: 400px;
    position: relative;
    .progress {
      position: absolute;
      top: 22%;
      left: 15%;
    }
    .areadyPxhour {
      position: absolute;
      top: 45%;
      left: 35%;
      text-align: center;
    }
    p {
      display: flex;
      i {
        display: inline-block;
        width: 4px;
        height: 22px;
        background: #5683fe;
        font-size: 18px;
      }
      span {
        margin-left: 10px;
        font-size: 18px;
      }
    }
  }
  .right_plan {
    width: 50%;
    p {
      display: flex;
      i {
        display: inline-block;
        width: 4px;
        height: 22px;
        background: #5683fe;
      }
      span {
        margin-left: 10px;
        font-size: 18px;
      }
    }
    ul {
      padding: 0 10px;
      height: 400px;
      overflow: auto;
      li {
        list-style: none;
        p {
          display: flex;
          justify-content: space-between;
          .stime {
            font-size: 12px;
          }
          .pxWay {
            font-size: 13px;
            padding: 0 10px;
            line-height: 20px;
            border-radius: 5px;
          }
        }
      }
    }
  }
}
</style>
