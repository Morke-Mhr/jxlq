<template>
  <!-- 培训记录 -->
  <div class="app-container">
    <el-tabs type="border-card" v-model="activeName" @tab-click="fun1">
      <el-tab-pane label="统计报表" name="tjbb">
        <pxTroubleshoot v-if="isShow"></pxTroubleshoot>
      </el-tab-pane>
      <el-tab-pane label="培训记录" name="pxjl">
        <div class="app-container">
          <div class="sxForm">
            <el-form
              :inline="true"
              :model="pageForm"
              ref="pageForm"
              class="demo-form-inline"
            >
              <el-form-item label="培训类别" prop="pxClassId">
                <el-select
                  v-model="pageForm.pxClassId"
                  placeholder="请选择培训类别"
                  style="width: 100%"
                  @change="peojectTypeFunc"
                >
                  <el-option
                    :value="item.dictCode"
                    v-for="item in classRes"
                    :key="item.dictCode"
                    :label="item.dictLabel"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="培训主题" prop="pxTitleId">
                <el-select
                  v-model="pageForm.pxTitleId"
                  placeholder="请选择培训主题"
                  style="width: 100%"
                  @change="peojectFunc"
                >
                  <el-option
                    :value="item.dictCode"
                    v-for="item in themeRes"
                    :key="item.dictCode"
                    :label="item.dictLabel"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="授课老师" prop="pxTeacher">
                <el-input
                  v-model="pageForm.pxTeacher"
                  placeholder="授课老师"
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
            <el-table
              :data="tableData"
              v-loading="loading"
              tooltip-effect="light"
              style="width: 100%"
              height="calc(100vh - 380px)"
              @selection-change="handleSelectionChange"
              row-key="safebookId"
              stripe
            >
              <el-table-column
                align="center"
                label="培训类别"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.pxClass }}
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="培训主题"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.pxTitle }}
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="培训地点"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.pxPlace }}
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="课件名称"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.kjName }}
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="培训课时"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.pxClassHour }}
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="培训方式"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.pxWay == false">线上</span>
                  <span v-if="scope.row.pxWay == true">线下</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="培训状态"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.pxStatus == 0">未开始</span>
                  <span v-if="scope.row.pxStatus == 1">进行中</span>
                  <span v-if="scope.row.pxStatus == 2">已结束</span>
                </template>
              </el-table-column>
              <el-table-column label="培训内容" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.pxContent }}
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                width="80"
                align="center"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="medium"
                    v-has="has.details"
                    @click="handleDetail(scope)"
                  >
                    查看
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
            >
            </el-pagination>

            <el-dialog
              :visible.sync="dialogVisible"
              :title="dialogType === 'edit' ? '修改培训课件' : '添加培训课件'"
              :close-on-click-modal="false"
              custom-class="large"
            >
              <el-form
                :model="addBook"
                :rules="formRules"
                ref="operationFome"
                label-width="80px"
                label-position="left"
              >
                <el-form-item label="课件名称" prop="kjName">
                  <el-input
                    v-model="addBook.kjName"
                    maxlength="30"
                    show-word-limit
                    placeholder="请输入课件名称"
                  />
                </el-form-item>

                <el-form-item label="课件类别" prop="kjClassId">
                  <el-select
                    v-model="addBook.kjClassId"
                    placeholder="请选择类别"
                    style="width: 100%"
                    @change="bookTypeFunc"
                  >
                    <el-option
                      :value="item.dictCode"
                      v-for="item in bookRes"
                      :key="item.dictCode"
                      :label="item.dictLabel"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="培训类别" prop="pxClassId">
                  <el-select
                    v-model="addBook.pxClassId"
                    placeholder="请选择类别"
                    style="width: 100%"
                    @change="peojectTypeFunc"
                  >
                    <el-option
                      :value="item.dictCode"
                      v-for="item in classRes"
                      :key="item.dictCode"
                      :label="item.dictLabel"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="主题" prop="pxTitleId">
                  <el-select
                    v-model="addBook.pxTitleId"
                    placeholder="请选择主题"
                    style="width: 100%"
                    @change="peojectFunc"
                  >
                    <el-option
                      :value="item.dictCode"
                      v-for="item in themeRes"
                      :key="item.dictCode"
                      :label="item.dictLabel"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="课件附件" prop="kjFileUrl">
                  <div class="upload">
                    <el-upload
                      ref="upload"
                      class="upload-demo"
                      :action="getUrl"
                      :on-remove="handleRemove"
                      :before-remove="beforeRemove"
                      :on-preview="handlePreview"
                      :on-exceed="handleExceed"
                      :on-success="uploadSuccess"
                      :on-change="changeFile"
                      :before-upload="beforeUploadFile"
                      :auto-upload="false"
                      multiple
                      :limit="1"
                      :file-list="fileLists"
                      name="file"
                    >
                      <el-button size="small" type="primary" v-if="flag == true"
                        >选择文件</el-button
                      >
                      <span v-if="flag == false">点击文件下载</span>
                      <!--上传视频-->
                      <video
                        v-if="videoForm.showVideoPath != '' && !videoFlag"
                        v-bind:src="videoForm.showVideoPath"
                        class="avatar video-avatar"
                        controls="controls"
                      >
                        您的浏览器不支持视频播放
                      </video>
                      <i
                        v-else-if="videoForm.showVideoPath == '' && !videoFlag"
                        class="el-icon-plus avatar-uploader-icon"
                      ></i>
                      <el-progress
                        v-if="videoFlag == true"
                        type="circle"
                        v-bind:percentage="videoUploadPercent"
                        style="margin-top: 7px"
                      ></el-progress>
                    </el-upload>
                    <div class="shade" v-if="flag == false"></div>
                  </div>
                </el-form-item>
                <el-form-item label="公开" prop="isPublic">
                  <el-radio-group v-model="addBook.isPublic">
                    <el-radio :label="false">不开放</el-radio>
                    <el-radio :label="true">开放</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
              <div style="text-align: right">
                <el-button class="confirm-btn" @click="confirm">
                  提交
                </el-button>
                <el-button class="cancel-btn" @click="dialogVisible = false">
                  取消
                </el-button>
              </div>
            </el-dialog>
          </div>
        </div>
        <el-dialog
          title="培训记录详情"
          :visible.sync="manageFlag"
          v-if="manageFlag"
          custom-class="large"
          :close-on-click-modal="false"
        >
          <manage-details :manage="manageData" />
          <span slot="footer" class="dialog-footer">
            <el-button class="fBtn" @click="manageFlag = false"
              >取 消</el-button
            >
          </span>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="统计跟踪" name="tjgz">
        <trainingTracks></trainingTracks>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getSafetyList, getLookSafety } from "@/api/job/safety";
import { getManageList } from "@/api/safety/manage.js";
import { getSelectTheme, getSelectClass } from "@/api/system/class";
import { getTreeDeptSelect } from "@/api/job/org";
import elementIcons from "@/views/system/menu/element-icons.js";
import manageDetails from "./manageDetails";
import pxTroubleshoot from "../pxTroubleshoot/index";
import trainingTracks from "../trainingTracks/index";

//新增表单字段对象
const defaultItem = {
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
};
export default {
  components: { manageDetails, pxTroubleshoot, trainingTracks },
  data() {
    return {
      isShow: true,
      has: {
        query: "train:trainPlan:trainRecordList",
        details: "train:trainPlan:query",
      },
      activeName: "tjbb",
      videoFlag: false,
      //是否显示进度条
      videoUploadPercent: "",
      //进度条的进度，
      isShowUploadVideo: false,
      //显示上传按钮
      videoForm: {
        showVideoPath: "",
      },
      lookTit: "查看",
      tableData: [],
      total: 100,
      pageSizes: [10, 15, 20, 25, 30],
      dialogVisible: false,

      //搜索
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        pxClassId: "",
        pxTitleId: "",
        pxTeacher: "",
      },
      pageNum: 1, //默认当前页
      pageSize: 10,
      //树形
      checkStrictly: true,
      defaultMenutree: [],
      deptOptions: [],
      multipleSelection: [],
      dialogVisible: false,
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

      loading: false,
      fileLists: [],
      flag: true,
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
      //查看详情字段
      detailDate: {
        //主题
        pxTitle: "",
        //培训类别
        pxClass: "",
        //培训内容
        pxContent: "",
        //计划培训开始时间
        planStartTime: "",
        //计划培训结束时间
        planEndTime: "",
        //授课老师
        pxTeacher: "",
        //培训机构
        pxAgency: "",
        //地点
        pxPlace: "",
        //培训课时
        pxClassHour: "",
        //培训人员集合
        trainPersonList: [
          {
            //人员
            user: "",
          },
        ],
        //课件集合
        trainCoursewareList: [
          {
            //课件名称
            kjName: "",
            //课件附件url
            kjFileUrl: "",
          },
        ],
        //培训附件list
        trainplanFileList: [
          {
            //附件名称
            pictureName: "",
            //附件url
            pictureUrl: "",
          },
        ],
      },
      classRes: [],
      themeRes: [],
      bookRes: [],
      arr: [],
      manageData: {},
      manageFlag: false,
      // 当前页数
      currentPage: 1,
    };
  },
  created: async function () {
    this.isShow = false;
    this.getAllList();
    this.getClassSel();
    this.getThemeSel();
    this.getBookSel();
  },
  mounted() {
    // let safety=sessionStorage.getItem("safety");
    // if(safety=="safety"){
    // this.activeName="tjbb"
    this.$nextTick().then(() => {
      this.isShow = true;
    });
    // }
  },
  // beforeDestroy(){
  // sessionStorage.removeItem("safety");
  // },
  // destroyed(){
  // sessionStorage.removeItem("safety");
  // },
  computed: {
    getUrl() {
      return this.$store.state.apiConfiguration.url + "/fs/upload";
    },
  },
  methods: {
    fun1(val) {
      this.$nextTick().then(() => {
        this.isShow = true;
      });
    },
    async onSubmit() {
      let { pxClassId, pxTitleId, pxTeacher } = this.pageForm;
      let params = {
        pageNum: 1,
        pageSize: this.pageSize,
        pxClassId: this.pageForm.pxClassId,
        pxTitleId: this.pageForm.pxTitleId,
        pxTeacher: this.pageForm.pxTeacher,
      };
      let data = await getManageList(params);
      this.tableData = data.rows;
      this.loading = false;
      this.total = data.total;
      this.currentPage = 1;
    },
    //分页查询
    // async onPaging() {
    //   // let params={
    //   //    'pageNum':this.pageNum,
    //   //    'pageSize':this.pageSize,
    //   //    'pxClassId': this.pageForm.pxClassId,
    //   //    'pxTitleId':this.pageForm.pxTitleId,
    //   //    'pxTeacher':this.pageForm.pxTeacher,
    //   //  }
    //   try {
    //     let data = await getManageList(this.pageForm);
    //     this.tableData = data.rows;
    //     this.loading = false;
    //   } catch (e) {
    //     console.error("接口异常");
    //   }
    // },
    handleSelectionChange(val) {
      if (val) {
        let arr = [];
        for (let i = 0; i < val.length; i++) {
          let itme = val[i];
          arr.push(itme.traincoursewareId);
        }
        this.multipleSelection = [...arr];
      }
    },
    //查看详情

    handleDetail(scope) {
      // this.$router.push({
      //   path: "/manage/details",
      //   query: {
      //     trainplanId: scope.row.trainplanId
      //   }
      // });
      this.manageFlag = true;
      this.manageData = scope.row.trainplanId;
    },
    //获取列表
    async getAllList() {
      this.loading = true;
      const res = await getManageList(this.pageForm);
      this.tableData = res.rows;
      this.total = res.total;
      this.loading = false;
    },
    //获取分类下拉列表
    async getClassSel() {
      let dictName = "train_type";
      this.classRes = await getSelectTheme(dictName);
    },
    //获取课件类别下拉列表
    async getBookSel() {
      let dictName = "courseware_classification";
      this.bookRes = await getSelectTheme(dictName);
    },
    //获取项目类型下拉id
    peojectTypeFunc(val, vIndex) {
      let resultArr = this.classRes.filter((item) => {
        return item.dictCode === val;
      });
      //把值赋给要传给后台的表单对象中
      this.addBook.pxClassId = resultArr[0].dictCode;
      this.addBook.pxClass = resultArr[0].dictLabel; //直接写val也可以
    },
    //下载附件
    async downLoadFile() {
      let data = this.detailDate;
      let fileForm = {
        name: data.trainCoursewareList[0].kjName,
        path: data.trainCoursewareList[0].kjFileUrl,
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
    //获取主题下拉列表
    async getThemeSel() {
      let dictType = "training_topics";
      this.themeRes = await getSelectTheme(dictType);
    },
    //获取项目进度下拉id
    peojectFunc(val, vIndex) {
      let resultArr = this.themeRes.filter((item) => {
        return item.dictCode === val;
      });
      //把值赋给要传给后台的表单对象中
      this.addBook.pxTitleId = resultArr[0].dictCode;
      this.addBook.pxTitle = resultArr[0].dictLabel; //直接写val也可以
    },
    //获取课件类型下拉id
    bookTypeFunc(val, vIndex) {
      let resultArr = this.bookRes.filter((item) => {
        return item.dictCode === val;
      });
      //把值赋给要传给后台的表单对象中
      this.addBook.kjClassId = resultArr[0].dictCode;
      this.addBook.kjClass = resultArr[0].dictLabel; //直接写val也可以
    },
    //文件上传前的操作
    async beforeUploadFile(file) {
      console.log(file);
      //1301053601032040449文档的code码
      //1301053632397045762其他的code码
      //1288290797423185922图片的code码
      //1288290883351969793视频的code码
      // if(this.addBook.kjClassId=='1301053601032040449'){
      // 	 let extension = file.name.split(".")[1];
      // 	       let extensionList = ["xls", "xlsx","doc","docx","pdf","txt"];
      // 	       if (extensionList.indexOf(extension) < 0) {
      // 	         this.$message.error("上传失败！只能上传word,excel,pdf,txt格式文件!");
      // 	        return false;
      // 	 // return this.$refs.upload.abort();
      // 	       }
      // }else if(this.addBook.kjClassId=='1301053632397045762'){
      //  let extension = file.name.split(".")[1];
      //        let extensionList = ["RAR", "ZIP","MP3"];
      //        if (extensionList.indexOf(extension) < 0) {
      //          this.$message.error("上传失败！只能上传RAR,ZIP,MP3格式文件!");
      //         return false;
      //  					 // return this.$refs.upload.abort();
      //        }
      // }else if(this.addBook.kjClassId=='1288290797423185922'){
      //  let extension = file.name.split(".")[1];
      //        let extensionList = ["bmp", "jpg","png","gif"];
      //        if (extensionList.indexOf(extension) < 0) {
      //          this.$message.error("上传失败！只能上传bmp,jpg,png,gif格式文件!");
      //         return false;
      //  					 // return this.$refs.upload.abort();
      //        }
      // }else if(this.addBook.kjClassId=='1288290883351969793'){
      //  let extension = file.name.split(".")[1];
      //        let extensionList = ["AVI", "rmvb","FLV","mp4","3GP"];
      //        if (extensionList.indexOf(extension) < 0) {
      //          this.$message.error("上传失败！只能上传AVI,rmvb,FLV,mp4,3GP格式文件!");
      //         return false;
      //  					 // return this.$refs.upload.abort();
      //        }
      // }else{
      //  this.$refs.upload.submit();
      //  }
    },
    changeFile(file) {
      if (this.addBook.kjClassId == "1301053601032040449") {
        let extension = file.name.split(".")[1];
        let extensionList = [
          "xls",
          "xlsx",
          "doc",
          "docx",
          "pdf",
          "XLS",
          "XLSX",
          "DOC",
          "DOCX",
          "PDF",
          "TXT",
          "txt",
        ];
        if (extensionList.indexOf(extension) < 0) {
          this.$message.error("上传失败！只能上传word,excel,pdf,txt文件!");
          return false;
          // return this.$refs.upload.abort();
        }
      } else if (this.addBook.kjClassId == "1301053632397045762") {
        let extension = file.name.split(".")[1];
        let extensionList = ["RAR", "ZIP", "MP3", "rar", "zip", "mp3"];
        if (extensionList.indexOf(extension) < 0) {
          this.$message.error("上传失败！只能上传RAR,ZIP,MP3格式文件!");
          return false;
          // return this.$refs.upload.abort();
        }
      } else if (this.addBook.kjClassId == "1288290797423185922") {
        let extension = file.name.split(".")[1];
        let extensionList = ["bmp", "jpg", "png", "gif", "jepg"];
        if (extensionList.indexOf(extension) < 0) {
          this.$message.error(
            "上传失败！只能上传bmp,jpg,png,gif,jepg格式文件!"
          );
          return false;
          // return this.$refs.upload.abort();
        }
      } else if (this.addBook.kjClassId == "1288290883351969793") {
        // var fileSize = file.size / 1024 / 1024 < 50;
        //                if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'].indexOf(file.type) == -1) {
        //                    this.$message.error("请上传正确的视频格式");
        //                    return false;
        //                }
        //         if (!fileSize) {
        //                             this.$message.error("视频大小不能超过50MB");
        //                             return false;
        //                         }
        //                         this.isShowUploadVideo = false;
        let extension = file.name.split(".")[1];
        let extensionList = [
          "AVI",
          "rmvb",
          "FLV",
          "mp4",
          "3GP",
          "avi",
          "RMVB",
          "flv",
          "MP4",
          "3gp",
        ];
        if (extensionList.indexOf(extension) < 0) {
          this.$message.error(
            "上传失败！只能上传AVI,rmvb,FLV,mp4,3GP格式文件!"
          );
          return false;
        }
      }
      this.$refs.upload.submit();
    },
    //进度条
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true;
      this.videoUploadPercent = file.percentage.toFixed(0) * 1;
    },
    // 文件列表移除文件时的钩子
    async handleRemove(file, fileList) {
      let row = JSON.parse(JSON.stringify(file));
      let roaw = JSON.stringify(file);
      await fsDelete(row.fileId);
      this.addBook.kjFileUrl = "";
      this.$refs.upload.clearFiles();
    },
    // 下载
    handlePreview(file) {
      if (this.flag == false) {
        let row = file;
        this.fileDowloadName =
          this.$store.state.apiConfiguration.url +
          `/fs/download?name=${encodeURI(encodeURI(row.name))}&path=${row.url}`;
        location.href = this.fileDowloadName;
      }
    },
    // 上传成功时的钩子
    uploadSuccess(res, file, fileList) {
      this.isShowUploadVideo = true;
      this.videoFlag = false;
      this.videoUploadPercent = 0;
      if (res.code !== 200) {
        return this.$message.error(res.msg);
      }
      this.arr.push(res);
      let formImgList = [];
      this.arr.forEach((item) => {
        formImgList.push({
          fileName: item.body.fileName,
          url: item.body.url,
        });
      });
      this.addBook.kjFileUrl = formImgList[0].url;
    },
    //移除上一个文件
    // removeLastFile(files, fileList) {
    //   if (fileList) {
    //     this.filesUpload = fileList.slice(-1);
    //   }
    // },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    //超出限制时的行为
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    //查看
    async handleAdd(scope) {
      this.dialogType = "new";
      this.dialogVisible = true;
      this.addBook.kjFileUrl = "";
      this.fileLists = [];
      console.log("kjFileUrl:" + this.addBook.kjFileUrl);
      if (this.$refs["operationFome"]) {
        this.$refs["operationFome"].resetFields();
      }
    },
    //编辑
    async handleEdit(scope) {
      this.dialogType = "edit";
      this.dialogVisible = true;
      if (this.$refs["operationFome"]) {
        this.$refs["operationFome"].resetFields();
      }
      let traincoursewareId = scope.row.traincoursewareId;
      this.addBook = await getBookDetail(traincoursewareId);
    },
    confirm() {
      //校验表单
      this.$refs.operationFome.validate(async (valid) => {
        if (!valid) {
          this.$notify({
            title: "操作失败",
            dangerouslyUseHTMLString: true,
            message: "请填写完整",
            type: "warning",
          });
          return;
        }
        const isEdit = this.dialogType === "edit";

        //取得选中菜单id集合
        let data = null;
        try {
          if (isEdit) {
            data = await getEditBook(this.addBook);
          } else {
            data = await getAddBook(this.addBook);
          }
        } catch (e) {
          console.error("接口异常");
        }
        console.log(this.itemModel);
        this.dialogVisible = false;
        this.$notify({
          title: data ? "成功" : "失败",
          dangerouslyUseHTMLString: true,
          message: data ? data.message : "服务器开小差了，请稍后再试",
          type: data ? "success" : "warning",
        });
        this.getAllList();
      });
    },
    //删除
    async handleDel(scope) {
      if (!scope && this.multipleSelection.length <= 0) {
        this.$message({
          type: "warning",
          message: "请选择要删除的菜单!",
        });
        return;
      }
      let row = scope ? scope.row : null;
      this.$confirm("确定删除菜单吗?", "删除菜单", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await getDeleteBook(
            row ? row.traincoursewareId : this.multipleSelection
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
    //完成后回调
  },
};
</script>
