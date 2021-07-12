<template>
  <div >
    <!-- <add
          v-if="flag === 'Add'"
          @complete="complete"
          @fatherMethod="fatherMethod"
        ></add>-->
    <!-- 新增专家会审 -->
    <el-dialog
      title="新增专家会审"
      :close-on-click-modal="false"
      custom-class="small"
      :visible.sync="flag"
      v-if="flag"
    >
      <add @complete="complete" ref="add"></add>
      <span slot="footer" class="dialog-footer">
        <el-button class="tBtn" @click="$refs.add.confirm()">提 交</el-button>
        <el-button class="fBtn" @click="flag = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 查看 -->
    <el-dialog
      title="查看"
      :close-on-click-modal="false"
      custom-class="large"
      :visible.sync="getflag"
      v-if="getflag"
    >
      <spe-details :speId="EditData" />
      <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="getflag = false">取 消</el-button>
      </span>
    </el-dialog>

    <div class="safe_main">
      <div class="sxForm">
        <el-form
          :inline="true"
          :model="pageForm"
          ref="pageForm"
          class="demo-form-inline"
        >
          <el-form-item prop="programName" label="方案名称">
            <el-input
              v-model="pageForm.programName"
              maxlength="30"
              placeholder="请输入方案名称"
            ></el-input>
          </el-form-item>
          <el-form-item prop="natureId" label="方案性质">
            <el-select
              v-model="pageForm.natureId"
              placeholder="请选择方案性质"
              style="width: 100%"
            >
              <el-option
                :value="item.dictCode"
                v-for="item in natureRes"
                :key="item.dictCode"
                :label="item.dictLabel"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="categoryId" label="方案类别">
            <el-select
              v-model="pageForm.categoryId"
              placeholder="请选择方案类别"
              style="width: 100%"
            >
              <el-option
                :value="item.dictCode"
                v-for="item in typeRes"
                :key="item.dictCode"
                :label="item.dictLabel"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="projectName" label="项目名称">
            <el-input
              v-model="pageForm.projectName"
              maxlength="30"
              placeholder="请输入项目名称"
            ></el-input>
          </el-form-item>
          <el-form-item prop="bid" label="标段">
            <el-input
              v-model="pageForm.bid"
              maxlength="30"
              placeholder="请输入标段"
            ></el-input>
          </el-form-item>
          <div class="btnCont">
            <el-button
              class="chaxun"
              icon="el-icon-search"
              v-has="has.query"
              @click="onSubmit()"
              >查询
            </el-button>
            <el-button @click="resetForm('pageForm')" class="chongzhi"
              >重置</el-button
            >
          </div>
        </el-form>
      </div>
      <div class="sxTable">
        <div class="table-list">
          <el-button class="blue" @click="handleAdd(scope)"
            >新增</el-button
          >
          <el-button
            class="blue"
            v-has="has.remove"
            @click="handleDel(scope)"
            >批量删除</el-button
          >

          <el-table
            :data="tableData"
            v-loading="loading"
            style="width: 100%; "
            @selection-change="handleSelectionChange"
            height="calc(100vh - 370px)"
            row-key="workprogramId"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            stripe
          >
            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column align="center" label="项目名称">
              <template slot-scope="scope">{{
                scope.row.projectName
              }}</template>
            </el-table-column>
            <el-table-column align="center" label="方案名称">
              <template slot-scope="scope">{{
                scope.row.programName
              }}</template>
            </el-table-column>
            <el-table-column align="center" label="性质">
              <template slot-scope="scope">{{ scope.row.nature }}</template>
            </el-table-column>
            <el-table-column align="center" label="类别">
              <template slot-scope="scope">{{ scope.row.category }}</template>
            </el-table-column>
            <el-table-column align="center" label="标段">
              <template slot-scope="scope">{{ scope.row.bid }}</template>
            </el-table-column>
            <el-table-column align="center" label="编写人">
              <template slot-scope="scope">{{ scope.row.createBy }}</template>
            </el-table-column>
            <el-table-column align="center" label="编写时间">
              <template slot-scope="scope">{{ scope.row.createTime }}</template>
            </el-table-column>

            <el-table-column
              fixed="right"
              width="210"
              align="center"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="medium"
                  @click="saveQrcode(scope.row.expertreviewId)"
                  >会审二维码
                </el-button>
                <el-button
                  type="text"
                  size="medium"
                  v-has="has.query"
                  @click="handleDetail(scope)"
                  >查看
                </el-button>
                <!--    <el-button type="text" size="medium"  @click="handleDetail(scope)">
                          修改
                            </el-button>-->
                <el-button
                  type="text"
                  size="medium"
                  v-has="has.remove"
                  @click="handleDel(scope)"
                  >删除
                </el-button>
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
          ></el-pagination>

          <!-- 二维码 -->
          <el-dialog
            title="二维码"
            :close-on-click-modal="false"
            :visible.sync="ewmVisible"
            custom-class="small"
            @close="ewmClose"
          >
            <div id="qrcode"></div>
          </el-dialog>

          <el-dialog
            :visible.sync="dialogVisible"
            custom-class="large"
            :title="lookTit"
          >
            <div class="safety-table">
              <div id="printForm">
                <el-form
                  :model="detailDate"
                  ref="itemSelInfo"
                  label-width="120px"
                  class="form-table clearfix"
                >
                  <el-form-item
                    label="类别"
                    prop="jdType"
                    style="width: 50%; float: left"
                  >
                    <el-input
                      type="input"
                      v-model="detailDate.jdType"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="项目名称"
                    prop="projectName"
                    style="width: 50%; float: left"
                  >
                    <el-input
                      type="input"
                      v-model="detailDate.projectName"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="标段"
                    prop="bid"
                    style="width: 50%; float: left"
                  >
                    <el-input type="input" v-model="detailDate.bid"></el-input>
                  </el-form-item>
                  <el-form-item
                    label="单位工程名称"
                    prop="engineName"
                    style="width: 50%; float: left"
                  >
                    <el-input
                      type="input"
                      v-model="detailDate.engineName"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="分项工程名称"
                    prop="worktype"
                    style="width: 50%; float: left"
                  >
                    <el-input
                      type="input"
                      v-model="detailDate.worktype"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="交底时间"
                    prop="jdTime"
                    style="width: 50%; float: left"
                  >
                    <el-input
                      type="input"
                      v-model="detailDate.jdTime"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="交底人"
                    prop="jdUser"
                    style="width: 50%; float: left"
                  >
                    <el-input
                      type="input"
                      v-model="detailDate.jdUser"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="交底部门"
                    prop="jdDept"
                    style="width: 50%; float: left"
                  >
                    <el-input
                      type="input"
                      v-model="detailDate.jdDept"
                    ></el-input>
                  </el-form-item>

                  <el-form-item label="技术交底内容">
                    <el-input
                      type="textarea"
                      v-model="detailDate.jdContent"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label prop="createByDept"></el-form-item>
                  <el-form-item
                    label="技术交底附件"
                    prop="createByDept"
                    style="width: 100%"
                  >
                    <el-button icon="el-icon-paperclip" @click="downLoadFile"
                      >下载附件</el-button
                    >
                  </el-form-item>
                </el-form>
                <div class="clearfix">
                  <label
                    style="
                      text-align: right;
                      display: inline-block;
                      width: 120px;
                      padding: 0 12px 0 0;
                      color: #606266;
                    "
                    >被交底人</label
                  >
                  <table
                    style="
                      width: 83%;
                      float: right;
                      border-radius: 4px;
                      border: 1px solid #dcdfe6;
                      text-align: center;
                      border-bottom: none;
                    "
                  >
                    <tr style="height: 32px; line-height: 32px">
                      <td style="border-bottom: 1px solid #dcdfe6">部门</td>
                      <td
                        style="
                          border-bottom: 1px solid #dcdfe6;
                          border-left: 1px solid #dcdfe6;
                        "
                      >
                        人员
                      </td>
                      <td
                        style="
                          border-bottom: 1px solid #dcdfe6;
                          border-left: 1px solid #dcdfe6;
                        "
                      >
                        电子签名
                      </td>
                    </tr>
                    <tr
                      v-for="(item, index) in this.detailDate
                        .technologyBottomList"
                      :key="index"
                      style="height: 32px; line-height: 32px"
                    >
                      <td style="border-bottom: 1px solid #dcdfe6">
                        &nbsp;{{ item.bottonDept }}
                      </td>
                      <td
                        style="
                          border-bottom: 1px solid #dcdfe6;
                          border-left: 1px solid #dcdfe6;
                        "
                      >
                        &nbsp;{{ item.bottonUser }}
                      </td>
                      <td
                        style="
                          border-bottom: 1px solid #dcdfe6;
                          border-left: 1px solid #dcdfe6;
                        "
                      >
                        <img
                          :src="getImage"
                          style="width: 32px; height: 32px"
                        />
                      </td>
                    </tr>
                    <!--  <tr v-for="(item,index) in this.detailDate.technologyBottomList" style="height: 32px;line-height: 32px;border-bottom: 1px solid #DCDFE6;">
                                     <td></td>
                                     <td style="border-left:1px solid #DCDFE6;"></td>
                                    </tr>-->
                  </table>
                </div>
              </div>
              <div style="text-align: right; margin-top: 20px">
                <el-button class="confirm-btn" v-print="'#printForm'"
                  >打印</el-button
                >
                <el-button class="cancel-btn" @click="dialogVisible = false"
                  >取消</el-button
                >
              </div>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getSpeciaList,
  getDeleteSpecia,
} from "@/api/technology/specialist/specialist.js";
import { getSelectTechItem } from "@/api/system/class";
import Add from "./add";
import speDetails from "./details";
// import {
//   getTechnologyList,
//   getSelectTechItem,
//   getAddTech
// } from '@/api/technology/item/itemMock.js'
// import {
//   isBasicDate,
// } from '@/utils/date.js'
import elementIcons from "@/views/system/menu/element-icons.js";
import QRCode from "qrcodejs2";

export default {
  components: { Add, speDetails },
  data() {
    return {
      has: {
        remove: "safemanage:technologyConfess:remove",
        query: "safemanage:technologyConfess:query",
      },
      // 二维码
      ewmVisible: false,
      addTit: "新增",
      tableData: [],
      total: 100,
      pageSizes: [10, 15, 20, 25, 30],
      dialogVisible: false,
      flag: false,
      getflag: false,
      //搜索
      pageNum: 1, //默认当前页
      pageSize: 10,
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        programName: "",
        natureId: "",
        categoryId: "",
        projectName: "",
        bid: "",
      },
      //方案性质数组
      natureRes: [],
      //方案类别数组
      typeRes: [],
      // 当前页数
      currentPage: 1,
      //树形
      checkStrictly: true,
      defaultMenutree: [],
      deptOptions: [],
      multipleSelection: [],
      dialogType: "new",
      defaultProps: {
        children: "children",
        label: "label",
        disabled: function (data, node) {
          if (data.flag == "1") {
            return true;
          } else {
            return false;
          }
        },
      },
      elementIcons,
      EditData: {},
      loading: false,
      //表单验证方法
      formRules: {
        projectName: [
          {
            required: true,
            message: "请输入项目名称",
            trigger: "blur",
          },
        ],
        projectDept: [
          {
            required: true,
            message: "请选择项目部",
            trigger: "blur",
          },
        ],
        bid: [
          {
            required: true,
            message: "请输入标段",
            trigger: "blur",
          },
        ],
        projectTypeId: [
          {
            required: true,
            message: "请选择项目类型",
            trigger: "blur",
          },
        ],
        projectProcessId: [
          {
            required: true,
            message: "请选择项目进度",
            trigger: "blur",
          },
        ],
        startTime: [
          {
            required: true,
            message: "请选择开始时间",
            trigger: "blur",
          },
        ],
        endTime: [
          {
            required: true,
            message: "请选择结束时间",
            trigger: "blur",
          },
        ],
      },
      //新增表单字段对象
      itemModel: {
        //项目名称
        projectName: "",
        //标段
        bid: "",
        //项目部编号
        projectDeptId: "",
        //项目部
        projectDept: "",
        //项目类型编号
        projectTypeId: "",
        //项目类型
        projectType: "",
        //项目进度编号
        projectProcessId: "",
        //项目进度
        projectProcess: "",
        //开始时间
        startTime: "",
        //结束时间
        endTime: "",
      },
      itemSelInfo: {},
      lookTit: "查看",
      detailDate: {},
    };
  },
  created: async function () {
    this.getAllList();
    this.getNatureSel();
    this.getTypeSel();
  },
  computed: {
    getImage: function () {
      if (
        this.detailDate.technologyBottomList.signUrl == "" ||
        this.detailDate.technologyBottomList.signUrl === undefined
      ) {
        return "";
      } else {
        return (
          this.$store.state.apiConfiguration.imgFileUrl +
          this.detailDate.signUrl
        );
      }
    },
  },
  mounted() {},
  methods: {
    saveQrcode(expertreviewId) {
      if (expertreviewId) {
        // 防止网络不佳时重复生成
        if (
          document.getElementById("qrcode") &&
          document.getElementById("qrcode").innerHTML != ""
        ) {
          this.ewmClose();
        }
        this.ewmVisible = true;
        this.$nextTick(() => {
          let ewmText = JSON.stringify({ expertreviewId: expertreviewId });
          let qrcode = new QRCode(document.getElementById("qrcode"), {
            // text: 'http://www.baidu.com',
            width: 128,
            height: 128,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H,
          });
          // 第一次生成还有问题
          qrcode.makeCode(
            `${this.$store.state.apiConfiguration.htmlUrl}#/expertsBusiness?expertreviewId=${expertreviewId}`
          );
        });
      } else {
        this.$message.error("获取数据失败");
      }
    },
    // 二维码关闭
    ewmClose() {
      document.getElementById("qrcode").innerHTML = "";
    },
    async onSubmit() {
      let { programName, natureId, categoryId, projectName, bid } =
        this.pageForm;
      let params = {
        pageNum: 1,
        pageSize: this.pageSize,
        programName: this.pageForm.programName,
        natureId: this.pageForm.natureId,
        categoryId: this.pageForm.categoryId,
        projectName: this.pageForm.projectName,
        bid: this.pageForm.bid,
      };
      let data = await getSpeciaList(params);
      this.tableData = data.rows;
      this.loading = false;
      this.total = data.total;
      this.currentPage = 1;
    },
    //获取方案性质下拉
    async getNatureSel() {
      let dictName = "program_nature";
      this.natureRes = await getSelectTechItem(dictName);
    },
    //获取方案类别下拉
    async getTypeSel() {
      let dictName = "scheme_category";
      this.typeRes = await getSelectTechItem(dictName);
    },
    //新增
    async handleAdd(scope) {
      this.flag = true;
    },
    // 新增完成刷新页面
    complete() {
      this.flag = false;
      console.log("执行新增完成刷新页面");
      this.getAllList();
    },

    handleSelectionChange(val) {
      if (val) {
        let arr = [];
        for (let i = 0; i < val.length; i++) {
          let itme = val[i];
          arr.push(itme.expertreviewId);
        }
        this.multipleSelection = [...arr];
      }
    },
    //获取列表数据
    //获取列表
    async getAllList() {
      this.loading = true;
      const res = await getSpeciaList(this.pageForm);
      this.tableData = res.rows;
      this.total = res.total;
      console.log(res);
      console.log(res.rows);
      this.loading = false;
    },
    //获取方案性质下拉
    //获取技术交底下拉id
    peojectTypeFunc(val, vIndex) {
      let resultArr = this.typeRes.filter((item) => {
        return item.dictCode === val;
      });
      //把值赋给要传给后台的表单对象中
      this.itemModel.projectTypeId = resultArr[0].dictCode;
      this.itemModel.projectType = resultArr[0].dictLabel; //直接写val也可以
    },
    //删除
    async handleDel(scope) {
      if (!scope && this.multipleSelection.length <= 0) {
        this.$message({
          type: "warning",
          message: "请选择要删除的选项!",
        });
        return;
      }
      let row = scope ? scope.row : null;
      this.$confirm("确定删除吗?", "删除", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await getDeleteSpecia(
            row ? row.expertreviewId : this.multipleSelection
          );
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getAllList();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    //查看
    async handleDetail(scope) {
      this.getflag = true;
      // console.log(this.flag + "");
      this.EditData = scope.row.expertreviewId;
    },
    //下载附件
    async downLoadFile() {
      let data = this.detailDate;
      let fileForm = {
        name: data.technologyConfessFileList[0].fileName,
        path: data.technologyConfessFileList[0].fileUrl,
      };
      this.fileDowloadName =
        this.$store.state.apiConfiguration.url +
        "jxlq-system-service" +
        "/fs/download?name=" +
        fileForm.name +
        "&path=" +
        fileForm.path;
      location.href = this.fileDowloadName;
    },
    treeCheck(data, isCheck, isChildrenCheck) {
      if (isCheck) {
        this.itemModel.projectDeptId = data.id;
        this.itemModel.projectDept = data.label;
        let keys = this.$refs.deptTree.getCheckedKeys();
        // let itme = [keys[keys.length-1]]
        if (this.currentChecke && this.currentChecke == "") {
          this.currentChecke = keys[0];
        } else {
          let this_ = this;
          keys.some((value) => {
            if (value != this_.currentChecke) {
              this_.currentChecke = value;
              return true;
            }
          });
        }
        let itme = [this.currentChecke];
        this.$refs.deptTree.setCheckedKeys(itme, true);
      }
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getAllList();
    },

    ///页脚
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

<style>
.safety-table .el-form-item {
  width: 50%;
  float: left;
}
</style>
