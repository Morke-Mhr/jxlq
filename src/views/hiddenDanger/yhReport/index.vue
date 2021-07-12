<template>
  <!-- 隐患上报 新1-->
  <div class="yhReport safe_main">
    <div class="sxForm">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="检查类别">
          <el-select
            v-model="formInline.checkCategoryId"
            placeholder="请选择"
            @visible-change="$forceUpdate()"
          >
            <el-option
              v-for="item in jcList"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="隐患级别">
          <el-select
            v-model="formInline.hdLevel"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in yhjbList"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登记时间">
          <el-date-picker
            v-model="dateList"
            @change="dateChange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="问题描述">
          <el-input v-model="formInline.problemDesc"></el-input>
        </el-form-item>
        <div class="btnCont">
          <el-button class="chaxun" @click="onSubmit" v-has="has.queryAll"
            >查询
          </el-button>
          <el-button class="chongzhi" @click="resetBtn" v-has="has.queryAll"
            >重置
          </el-button>
        </div>
      </el-form>
    </div>
    <div class="sxTable">
      <el-button @click="repBtn" class="blue" v-has="has.submitHiddendanger"
        >隐患上报
      </el-button>
      <!--      <el-button @click="ewmBtn" class="cz" v-has="has.getQrCode">二维码</el-button>-->
      <el-button @click="open(true)" class="blue" v-has="has.deletes"
        >批量删除</el-button
      >
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="light"
        style="width: 100%"
        height="calc(100vh - 370px)"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column
          prop="checkCategory"
          label="检查类别"
          align="center"
          width="170px"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="yhName"
          label="隐患级别"
          align="center"
          width="90px"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="createBy"
          label="登记人"
          align="center"
          width="100px"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="登记时间"
          align="center"
          width="200px"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="status" align="center" label="状态" width="90px">
        </el-table-column>
        <el-table-column
          prop="createDept"
          label="登记部门"
          align="center"
          width="280px"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="问题描述"
          prop="problemDesc"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column label="操作" width="160px" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="chakan('查看', scope.row.hyId)"
              v-has="has.editView"
              >查看
            </el-button>
            <el-button
              type="text"
              @click="chakan('编辑', scope.row.hyId)"
              v-has="has.submitHiddendanger"
              v-if="scope.row.status != '已完成'"
              >编辑
            </el-button>
            <el-button
              class="red"
              type="text"
              @click="open(false, scope.row.hyId)"
              v-has="has.deletes"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[1, 5, 10, 20, 30]"
        :page-size="formInline.pageSize"
        background
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <!-- 查看、上报 -->
    <el-dialog
      :title="tDialog"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      custom-class="small"
    >
      <el-form
        v-if="dialogVisible"
        ref="form"
        :model="formDia"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="关联隐患" v-if="tDialog != '查看'">
          <el-button
            class="p15"
            :disabled="czlx == 'ck' ? true : false"
            @click="associated"
            >从隐患知识库关联
          </el-button>
        </el-form-item>
        <el-form-item label="检查类别" prop="checkCategory">
          <el-select
            :disabled="czlx == 'ck' ? true : false"
            v-model="formDia.checkCategory"
            placeholder="请选择"
            @change="(val) => selectFun(val, 'checkCategoryTxt')"
            id="checkCategoryTxt"
          >
            <el-option
              v-for="item in jcList"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictCode"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="问题描述" prop="problemDesc">
          <el-input
            class="inputAuto"
            :disabled="czlx == 'ck' ? true : false"
            style="width: 100% !important"
            v-model="formDia.problemDesc"
            type="textarea"
            :autosize="{ minRows: 3 }"
            maxlength="300"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="违反法规">
          <el-input
            :disabled="czlx == 'ck' ? true : false"
            type="textarea"
            :autosize="{ minRows: 3 }"
            v-model="formDia.violationLaw"
            maxlength="300"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="隐患类别" prop="lhCategory">
          <el-select
            :disabled="czlx == 'ck' ? true : false"
            v-model="formDia.lhCategory"
            @change="(val) => selectFun(val, 'hdClassTxt')"
            id="hdClassTxt"
            placeholder="请选择"
          >
            <el-option
              v-for="item in yhList"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三违行为">
          <el-select
            :disabled="czlx == 'ck' ? true : false"
            v-model="formDia.threeBehavior"
            @change="(val) => selectFun(val, 'threeBehaviorTxt')"
            id="threeBehaviorTxt"
            placeholder="请选择"
          >
            <el-option
              v-for="item in swList"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="隐患级别" prop="hdLevel">
          <el-select
            :disabled="czlx == 'ck' ? true : false"
            v-model="formDia.hdLevel"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in yhjbList"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictCode"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <template v-if="formDia.hdLevel && formDia.hdLevel == 0">
          <el-form-item
            label="选择部门"
            prop="dutyDeptId"
            v-if="czlx == 'ck' ? false : true"
          >
            <el-cascader
              v-model="formDia.dutyDeptId"
              :show-all-levels="false"
              :disabled="czlx == 'ck' ? true : false"
              :options="cascaderList"
              :props="{ checkStrictly: true, value: 'id' }"
              @change="getDutyUser"
              placeholder="选择部门"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="责任人" prop="dutyUserId">
            <el-select
              :disabled="czlx == 'ck' ? true : false"
              v-model="formDia.dutyUserId"
              placeholder="请先选择部门"
              @change="(val) => selectFun(val, 'dutyUserTxt')"
              id="dutyUserTxt"
              @visible-change="$forceUpdate()"
            >
              <el-option
                v-for="item in dutyUserList"
                :key="item.userId"
                :label="item.realName"
                :value="item.userId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="整改人" prop="implementerId">
            <el-select
              :disabled="czlx == 'ck' ? true : false"
              v-model="formDia.implementerId"
              @change="(val) => selectFun(val, 'implementerTxt')"
              id="implementerTxt"
              placeholder="请先选择部门"
              @visible-change="$forceUpdate()"
            >
              <el-option
                v-for="item in dutyUserList"
                :key="item.userId"
                :label="item.realName"
                :value="item.userId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <el-form-item label="隐患图片" prop="hiddendangerFiles">
          <el-upload
            v-if="tDialog != '查看'"
            :disabled="czlx == 'ck' ? true : false"
            :action="getUrl"
            :headers="geHeaders"
            :on-success="sucUpload"
            :on-remove="remUpload"
            :before-upload="beforeAvatarUpload"
            :file-list="formDia.hiddendangerFiles"
            :on-preview="openImgViewer"
            list-type="picture"
          >
            <el-button class="p15">点击上传</el-button>
          </el-upload>
          <div class="uploadImg" v-else>
            <div v-if="formDia.hiddendangerFiles.length <= 0">暂无数据</div>
            <img
              v-for="(hItem, idx) in formDia.hiddendangerFiles"
              :key="idx"
              @click="openImgViewer(hItem)"
              :src="hItem.url"
            />
          </div>
        </el-form-item>
        <template v-if="formDia.hdLevel == 0">
          <el-form-item label="整改图片" prop="rectificationFiles">
            <el-upload
              v-if="tDialog != '查看'"
              :disabled="czlx == 'ck' ? true : false"
              :action="getUrl"
              :headers="geHeaders"
              :on-success="sucUpload2"
              :on-remove="remUpload2"
              :before-upload="beforeAvatarUpload"
              :file-list="formDia.rectificationFiles"
              :on-preview="openImgViewer"
              list-type="picture"
            >
              <el-button class="p15" v-if="tDialog != '查看'"
                >点击上传</el-button
              >
            </el-upload>
            <div class="uploadImg" v-else>
              <div v-if="formDia.rectificationFiles.length <= 0">暂无数据</div>
              <img
                v-for="(hItem, idx) in formDia.rectificationFiles"
                :key="idx"
                @click="openImgViewer(hItem)"
                :src="hItem.url"
              />
            </div>
          </el-form-item>
        </template>
        <!-- 图片查看器 -->
        <el-image-viewer
          v-if="showImgViewer"
          :on-close="closeImgViewer"
          :url-list="imgPreviewList"
        />
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="dialogVisible = false">取 消</el-button>
        <el-button class="tBtn" v-if="czlx != 'ck'" @click="subBtn()"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 二维码 -->
    <el-dialog
      title="二维码"
      :close-on-click-modal="false"
      :visible.sync="ewmVisible"
      custom-class="small"
      @close="ewmClose"
    >
      <div id="qrcode"></div>
      <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="ewmVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <!-- 从隐患知识库关联 -->
    <el-dialog
      title="隐患知识库"
      :close-on-click-modal="false"
      :visible.sync="isAssociated"
      custom-class="small"
    >
      <div class="safe_main">
        <div class="sxForm">
          <el-form :inline="true" :model="yhzsData" class="demo-form-inline">
            <template v-for="item in yhzsList">
              <el-form-item :key="item.value" :label="item.txt">
                <el-select
                  v-if="item.txt == '隐患级别'"
                  v-model="yhzsData[item.value]"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="item in yhjbList"
                    :key="item.dictCode"
                    :label="item.dictLabel"
                    :value="item.dictCode"
                  >
                  </el-option>
                </el-select>
                <el-input v-else v-model="yhzsData[item.value]"></el-input>
              </el-form-item>
            </template>
            <div class="btnCont">
              <el-button
                class="chaxun"
                @click="getYhzsList"
                icon="el-icon-search"
                >查询
              </el-button>
              <el-button class="chongzhi" @click="resetListBtn">重置</el-button>
            </div>
          </el-form>
        </div>

        <div class="sxTable">
          <el-table
            ref="multipleTable"
            :data="yhzsListData"
            tooltip-effect="light"
            style="width: 100%"
            height="calc(100vh - 370px)"
            stripe
          >
            <el-table-column
              v-for="(item, index) in yhzsTableCol"
              :key="index"
              :label="item.label"
              :prop="item.propVal"
              :width="item.width"
              :align="item.align"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              label="操作"
              width="90px"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-button type="text" @click="glBtn(scope.row)"
                  >关联
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page.sync="currentPage2"
            :page-sizes="[1, 10, 20, 30]"
            :page-size="yhzsData.pageSize"
            background
            layout=" total,prev, pager, next,sizes,jumper"
            :total="yhzsTotal"
          ></el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import { getToken } from "@/utils/auth";
import { getBranchS, getPeople } from "@/api/job/salary";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import {
  hQueryAll,
  hDeletes,
  getQrCodeData,
  dictType,
  editView,
  submitHiddendanger,
} from "@/api/hiddenDanger/security";
import { getKnowledgeList2 as getKnowledgeList } from "@/api/regulation/Knowledge";

const defaultPageSize = 10;
export default {
  components: { ElImageViewer },
  data() {
    return {
      // 显示图片查看器
      showImgViewer: false,
      // 查看大图列表
      imgPreviewList: [],
      dateList: "",
      rules: {
        checkCategory: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        hdLevel: [{ required: true, message: "请选择", trigger: "change" }],
        dutyDeptId: [
          { required: true, message: "请选择部门", trigger: "change" },
        ],
        dutyUserId: [
          { required: true, message: "请选择责任人", trigger: "change" },
        ],
        implementerId: [
          { required: true, message: "请选择整改人", trigger: "change" },
        ],
        problemDesc: [{ required: true, message: "请输入", trigger: "blur" }],
        violationLaw: [{ required: true, message: "请输入", trigger: "blur" }],
        // lhCategory: [{ required: true, message: "请选择", trigger: "change" }],
        threeBehavior: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        hiddendangerFiles: [
          { required: true, message: "请上传图片", trigger: "change" },
        ],
        rectificationFiles: [
          { required: true, message: "请上传整改图片", trigger: "change" },
        ],
      },
      has: {
        // 隐患上报记录全部查询
        queryAll: "hiddendanger:post:queryAll",
        // 隐患上报记录提交(新增或修改)
        submitHiddendanger: "hiddendanger:post:submitHiddendanger",
        // 隐患上报记录删除
        deletes: "hiddendanger:post:deletes",
        // 隐患上报记录编辑查看
        editView: "hiddendanger:post:editView",
        // 隐患上报二维码
        getQrCode: "hiddendanger:post:getQrCode",
      },
      // 级联选择绑定数据
      cascaderList: [],
      // 责任人列表
      dutyUserList: [],
      formInline: {
        checkCategoryId: "",
        hdLevel: "",
        problemDesc: "",
        createDept: "",
        startTime: null,
        endTime: null,
        pageSize: defaultPageSize,
        pageNum: "1",
      },
      formDia: {
        // 类别
        checkCategory: "",
        // 隐患级别
        hdLevel: "",
        // 问题描述
        problemDesc: "",
        // 违反法规
        violationLaw: "",
        // 隐患类别
        lhCategory: "",
        // 三违行为
        threeBehavior: "",
        hiddendangerFiles: [],
        rectificationFiles: [],
        // 责任人id
        dutyUserId: "",
        // 整改人
        implementerId: "",
        // 所选部门id
        dutyDeptId: "",
      },
      tableData: [],
      //总条目
      total: 0,
      // 当前页数
      currentPage: 1,
      //默认当前页
      pageNum: 1,
      // 所选中项的id
      delArr: [],
      // 查看、上报
      dialogVisible: false,
      // 二维码
      ewmVisible: false,
      // 从隐患知识库关联
      isAssociated: false,
      jcList: [],
      yhjbList: [
        { dictCode: "0", dictLabel: "微小" },
        { dictCode: "1", dictLabel: "一般" },
        { dictCode: "2", dictLabel: "重大" },
      ],
      yhList: [],
      swList: [],
      tDialog: "查看",
      // 检查类别文字
      checkCategoryTxt: "",
      // 三违行为文字
      threeBehaviorTxt: "",
      // 隐患类别文字
      hdClassTxt: "",
      // 责任人文字
      dutyUserTxt: "",
      implementerTxt: "",
      // 操作类型
      czlx: "",
      // 当前的隐患id
      nowHyId: null,
      yhTxtList: {
        0: "微小",
        1: "一般",
        2: "重大",
      },
      // 选中行的隐患id
      rowYhid: "",
      isSelectDel: false,
      // 隐患知识库参数表
      yhzsList: [
        {
          value: "yhkProblem",
          txt: "问题描述",
        },
        {
          value: "yhkType",
          txt: "隐患类别",
        },
      ],
      // 获取数据用的参数对象
      yhzsData: {
        yhkProblem: "",
        yhkType: "",
        pageSize: defaultPageSize,
        pageNum: "1",
      },
      // 表格数据
      yhzsListData: [],
      yhzsTableCol: [
        { label: "类别", propVal: "yhkType", width: "160px", align: "center" },
        { label: "问题描述", propVal: "yhkProblem" },
      ],
      yhzsTotal: 0,
      // 当前页数
      currentPage2: 1,
    };
  },
  methods: {
    // 打开图片查看器
    openImgViewer(file) {
      // 获取要查看的图片临时地址
      this.imgPreviewList = [file.url]; // 显示图片查看器
      this.showImgViewer = true;
    },
    // 关闭图片查看器
    closeImgViewer() {
      this.showImgViewer = false;
    },
    // 时间区间选择改变事件
    dateChange(val) {
      if (!val) {
        this.dateList = [];
        this.formInline.startTime = "";
        this.formInline.endTime = "";
      } else {
        this.formInline.startTime = val[0];
        this.formInline.endTime = val[1];
      }
    },
    // 新增前确认
    addOpen() {
      if (this.czlx == "ck") {
        this.dialogVisible = false;
        return;
      }
      this.$confirm("正在执行新增/编辑操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.subBtn("form");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    selectFun(val, txt) {
      // val为当前选中的值  txt为传过来的字符串
      if (txt) {
        this[txt] = event.target.innerText;
      }
    },
    onSubmit() {
      this.getData("cx");
    },
    handleSizeChange(val) {
      this.formInline.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.formInline.pageNum = val;
      this.getData();
    },
    handleSizeChange2(val) {
      this.yhzsData.pageSize = val;
      this.getYhzsData(this.yhzsData);
    },
    handleCurrentChange2(val) {
      this.yhzsData.pageNum = val;
      this.getYhzsData(this.yhzsData);
    },
    async getData(cx) {
      // console.log(this.formInline)
      if (cx == "cx") {
        this.formInline.pageNum = 1;
        this.currentPage = 1;
      }
      let res = await hQueryAll(this.formInline);
      this.total = res.total;
      this.tableData = res.rows.map((item) => {
        item.yhName = this.yhTxtList[item.hdLevel];
        return item;
      });
    },
    async selDelect() {
      let newArr = this.delArr.map((item) => {
        return item.hyId;
      });
      if (newArr.length > 0) {
        var res = await hDeletes(newArr);
        this.$message.success(res);

        const totalPage = Math.ceil(
          (this.total - newArr.length) / this.formInline.pageSize
        );
        //记录当前页码
        console.log(totalPage);
        const pagenum =
          this.formInline.pageNum > totalPage
            ? totalPage
            : this.formInline.pageNum;
        //实现跳转
        this.formInline.pageNum = pagenum < 1 ? 1 : pagenum;

        this.getData();
      } else {
        this.$message.warning("请确认是否勾选");
      }
    },
    handleSelectionChange(val) {
      this.delArr = val;
    },
    async delBtn() {
      var res = await hDeletes([this.rowYhid]);
      this.$message.success(res);

      const totalPage = Math.ceil((this.total - 1) / this.formInline.pageSize);
      //记录当前页码
      //记住删除最后一条数据时当前码是最后一页
      const pagenum =
        this.formInline.pageNum > totalPage
          ? totalPage
          : this.formInline.pageNum;
      //实现跳转
      this.formInline.pageNum = pagenum < 1 ? 1 : pagenum;
      this.getData();
    },
    async chakan(txt, rowhyId) {
      this.formDia.threeBehavior = null;
      if (txt == "查看") {
        this.czlx = "ck";
      } else {
        this.czlx = "bj";
      }
      this.nowHyId = rowhyId;
      this.tDialog = txt;
      let res = await editView({ hyId: rowhyId });
      res.hiddendangerFiles.forEach((item) => {
        if (
          item.pictureUrl.indexOf(
            this.$store.state.apiConfiguration.url +
              this.$store.state.serviceName.jurisdiction
          ) == "-1"
        ) {
          item.url =
            this.$store.state.apiConfiguration.url +
            this.$store.state.serviceName.jurisdiction +
            item.pictureUrl;
        } else {
          item.url = item.pictureUrl;
        }
        item.name = item.pictureName;
        // console.log(item)
      });
      console.log(res.hiddendangerFiles, 8888887777);
      let hiddFiles = [];
      let rectFiles = [];
      for (let v of res.hiddendangerFiles) {
        if (v.pictureType == 1) {
          rectFiles.push(v);
        } else if (v.pictureType == 0) {
          hiddFiles.push(v);
        }
      }
      res.hiddendangerFiles = hiddFiles;
      res.rectificationFiles = rectFiles;
      this.formDia = {
        ...(this.formDia = {
          // 类别
          checkCategory: "",
          // 隐患级别
          hdLevel: "",
          // 问题描述
          problemDesc: "",
          // 违反法规
          violationLaw: "",
          // 隐患类别
          lhCategory: "",
          // 三违行为
          threeBehavior: "",
          hiddendangerFiles: [],
          rectificationFiles: [],
          // 责任人id
          dutyUserId: "",
          // 整改人
          implementerId: "",
        }),
        ...res,
      };
      console.log(this.formDia.hiddendangerFiles, res, this.formDia, 489);
      this.dialogVisible = true;
    },
    repBtn() {
      this.formDia = {
        // 类别
        checkCategory: "",
        // 隐患级别
        hdLevel: "",
        // 问题描述
        problemDesc: "",
        // 违反法规
        violationLaw: "",
        // 隐患类别
        lhCategory: "",
        // 三违行为
        threeBehavior: "",
        hiddendangerFiles: [],
        rectificationFiles: [],
        // 责任人id
        dutyUserId: "",
        // 整改人
        implementerId: "",
      };
      this.czlx = "xz";
      this.tDialog = "隐患上报";
      this.dialogVisible = true;
    },
    ewmBtn() {
      // 防止网络不佳时重复生成
      if (
        document.getElementById("qrcode") &&
        document.getElementById("qrcode").innerHTML != ""
      ) {
        this.ewmClose();
      }
      this.ewmVisible = true;
      this.$nextTick(async () => {
        var res = await getQrCodeData();
        let qrcode = new QRCode(document.getElementById("qrcode"), {});
        qrcode.makeCode(JSON.stringify(res));
      });
    },
    // 二维码关闭
    ewmClose() {
      document.getElementById("qrcode").innerHTML = "";
    },
    // 文件上传前
    beforeAvatarUpload(file) {
      let extension = file.name.split(".")[1];
      let extensionList = ["bmp", "jpg", "png", "gif", "jepg"];
      if (extensionList.indexOf(extension) < 0) {
        this.$message.error("上传失败！只能上传bmp,jpg,png,gif,jepg格式文件!");
        return false;
        // return this.$refs.upload.abort();
      }
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 10MB!");
      }
      return isLt2M;
    },
    // 文件上传成功后
    sucUpload(response, file, fileList) {
      this.formDia.hiddendangerFiles = fileList;
      console.log(response, file);
    },
    sucUpload2(response, file, fileList) {
      this.formDia.rectificationFiles = fileList;
      console.log(response, file);
    },
    remUpload(file, fileList) {
      this.formDia.hiddendangerFiles = fileList;
    },
    remUpload2(file, fileList) {
      this.formDia.rectificationFiles = fileList;
    },
    // 确定提交
    subBtn(formName) {
      this.$refs["form"].validate(async (valid) => {
        if (!valid) {
          this.$notify({
            title: "操作失败",
            dangerouslyUseHTMLString: true,
            message: "请填写完整",
            type: "warning",
          });
          return;
        }
        if (this.czlx == "ck") {
          this.dialogVisible = false;
          return;
        }
        this.$confirm("正在执行新增/编辑操作, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            if (valid) {
              var pictureType = "0";
              console.log(this.formDia, 1, this.threeBehaviorTxt);
              let paramsData = {
                problemDesc: this.formDia.problemDesc,
                checkCategoryId: this.formDia.checkCategory,
                checkCategory:
                  this.checkCategoryTxt || this.getText("checkCategoryTxt"),
                violationLaw: this.formDia.violationLaw,
                hdLevel: this.formDia.hdLevel,
                threeBehavior:
                  this.threeBehaviorTxt || this.getText("threeBehaviorTxt"),
                threeBehaviorId: this.formDia.threeBehavior,
                hdClass: this.hdClassTxt || this.getText("hdClassTxt"),
                hdClassId: this.formDia.lhCategory,
              };
              if (this.czlx == "ck" || this.czlx == "bj") {
                paramsData.hyId = this.nowHyId;
              } else {
                paramsData.hyId = null;
              }
              if (this.formDia.hdLevel == 0) {
                paramsData.dutyUserId = this.formDia.dutyUserId;
                paramsData.dutyUser =
                  this.dutyUserTxt || this.getText("dutyUserTxt");
                paramsData.implementerId = this.formDia.implementerId;
                paramsData.implementer =
                  this.implementerTxt || this.getText("implementerTxt");
                paramsData.dutyDeptId = Array.isArray(this.formDia.dutyDeptId)
                  ? this.formDia.dutyDeptId[this.formDia.dutyDeptId.length - 1]
                  : this.formDia.dutyDeptId;
              }
              // 对需要上传的文件做处理
              // console.log(this.formDia.hiddendangerFiles)
              paramsData.hiddendangerFiles = this.formDia.hiddendangerFiles.map(
                (item) => {
                  if (item.status == "success" && item.response) {
                    console.log(item, 11111);
                    return {
                      pictureName: item.response.body.fileName,
                      pictureUrl: item.response.body.url,
                      pictureType: pictureType,
                    };
                  } else if (item.status == "success") {
                    console.log(item, 222222);
                    return {
                      pictureName: item.fileName,
                      pictureUrl: item.url,
                      pictureType: pictureType,
                      pictureId: item.pictureId,
                    };
                  }
                }
              );
              // 微小隐患上传整改图片
              if (this.formDia.hdLevel == 0) {
                console.log(111111111111111111);
                let rectificationFiles = this.formDia.rectificationFiles.map(
                  (item) => {
                    if (item.status == "success" && item.response) {
                      console.log(item, 11111);
                      return {
                        pictureName: item.response.body.fileName,
                        pictureUrl: item.response.body.url,
                        pictureType: "1",
                      };
                    } else if (item.status == "success") {
                      console.log(item, 222222);
                      return {
                        pictureName: item.fileName,
                        pictureUrl: item.url,
                        pictureType: "1",
                        pictureId: item.pictureId,
                      };
                    }
                  }
                );
                paramsData.hiddendangerFiles = [
                  ...paramsData.hiddendangerFiles,
                  ...rectificationFiles,
                ];
              }

              console.log(paramsData, 999);
              let res = await submitHiddendanger(paramsData);
              this.$message.success(res);
              this.getData("cx");
              this.dialogVisible = false;
            } else {
              console.log("error submit!!");
              return false;
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      });
    },
    // 获取级联选择数据
    async getCascader() {
      this.cascaderList = await getBranchS();
    },
    // 获取责任人列表
    async getDutyUser(arr) {
      // this.formDia.dutyUserId = '' dutyDeptId
      if (arr.length > 0) {
        this.formDia.dutyUserId = "";
        this.dutyUserList = await getPeople(arr[arr.length - 1]);
      } else {
        this.formDia.dutyUserId = "";
        this.formDia.implementerId = "";
        this.dutyUserList = [];
      }
      console.log(this.dutyUserList);
    },
    open(isbool, hyId) {
      this.$confirm("正在执行删除操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (!isbool) {
            this.rowYhid = hyId;
            this.delBtn();
          } else if (isbool) {
            this.selDelect();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 关联
    async associated() {
      this.getYhzsData(this.yhzsData);
      console.log(this.yhzsData, "this.yhzsData");
      this.isAssociated = true;
    },
    // 隐患知识查询
    getYhzsList() {
      this.getYhzsData(this.yhzsData, "cx");
    },
    // 隐患知识库重置
    resetListBtn() {
      this.yhzsData = {
        pageNum: "1",
        pageSize: 10,
        yhkLevel: "",
        yhkProblem: "",
        yhkType: "",
      };
      this.getYhzsData(this.yhzsData, "cx");
    },
    async getYhzsData(val, cx) {
      // console.log(this.formInline)
      if (cx == "cx") {
        this.yhzsData.pageNum = 1;
        this.currentPage2 = 1;
      }
      var res = await getKnowledgeList(val);
      this.yhzsListData = res.rows.map((item) => {
        item.yhName = this.yhTxtList[item.yhkLevel];
        return item;
      });
      console.log(res);
      this.yhzsTotal = res.total;
    },
    // 关联
    glBtn(val) {
      console.log(this.formDia, val);
      this.formDia = {
        ...this.formDia,
        ...{
          hdLevel: val.yhkLevel,
          problemDesc: val.yhkProblem,
          violationLaw: val.yhkViolationLaw,
          lhCategory: val.yhkTypeId,
          threeBehavior: val.threeViolationId,
        },
      };
      this.isAssociated = false;
      this.$message.success("关联成功");
      console.log(val);
    },
    // 重置
    resetBtn() {
      this.formInline = {
        ...this.formInline,
        ...{
          checkCategoryId: "",
          hdLevel: "",
          problemDesc: "",
          createDept: "",
          startTime: null,
          endTime: null,
        },
      };
      this.getData("cx");
    },
    getText(vid) {
      var inputs = document.getElementById(vid);
      console.log(inputs.value, 55122);
      return inputs.value;
    },
  },
  async created() {
    this.jcList = await dictType("safecheck_category");
    this.yhList = await dictType("Hazard_category");
    this.swList = await dictType("three_defy");
    this.getCascader();
    this.getData();
  },
  computed: {
    getUrl() {
      return (
        this.$store.state.apiConfiguration.url + "jxlq-system-service/fs/upload"
      );
    },
    geHeaders() {
      return { Authorization: getToken() };
    },
  },
  watch: {
    "formDia.dutyDeptId": {
      async handler(n) {
        console.log(n);
        if (
          (this.czlx == "ck" && this.formDia.hdLevel == 0) ||
          (this.czlx == "bj" && this.formDia.hdLevel == 0)
        ) {
          this.dutyUserList = await getPeople(n);
        }
      },
    },
  },
};
</script>
<style lang="scss" scoped></style>
