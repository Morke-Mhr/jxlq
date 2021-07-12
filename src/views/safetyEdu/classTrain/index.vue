<template>
  <!-- 班前培训 -->
  <div class="app-container">
    <el-dialog
      title="班前会详情"
      :visible.sync="classFlag"
      v-if="classFlag"
      custom-class="large"
      :close-on-click-modal="false"
    >
      <class-details ref="classDetails" :classD="classId" :type="type" />
      <span slot="footer" class="dialog-footer">
        <el-button v-if="type == 1" class="tBtn" @click="printings"
          >打印</el-button
        >
        <el-button v-else class="fBtn" @click="classFlag = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>

    <!-- <class-details v-if="classFlag==='Details'" @cancel="cancel" :classD="classId" :type="type" /> -->
    <!-- <div v-else> -->
    <el-tabs type="border-card">
      <el-tab-pane label="我参与的">
        <div class="app-container">
          <div class="sxForm">
            <el-form
              :inline="true"
              :model="pageForm"
              ref="pageForm"
              class="demo-form-inline"
            >
              <el-form-item label="会议名称" prop="meetingName">
                <el-input
                  v-model="pageForm.meetingName"
                  placeholder="请输入会议名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="开始时间" prop="startTime">
                <el-date-picker
                  v-model="pageForm.startTime"
                  type="date"
                  placeholder="选择开始时间"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间" prop="endTime">
                <el-date-picker
                  v-model="pageForm.endTime"
                  type="date"
                  placeholder="选择结束时间"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="主持人" prop="userName">
                <el-input
                  v-model="pageForm.userName"
                  placeholder="请输入主持人"
                ></el-input>
              </el-form-item>
              <div class="btnCont">
                <el-button
                  class="chaxun"
                  v-has="has.query"
                  @click="getAllList()"
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
              style="width: 100%"
              height="calc(100vh - 380px)"
              row-key="safebookId"
              tooltip-effect="light"
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
              stripe
            >
              <el-table-column
                align="center"
                label="会议名称"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{
                  scope.row.meetingName
                }}</template>
              </el-table-column>
              <el-table-column
                align="center"
                label="会议主题"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{
                  scope.row.meetingTheme
                }}</template>
              </el-table-column>
              <el-table-column
                align="center"
                label="开始时间"
                show-overflow-tooltip
                width="200"
              >
                <template slot-scope="scope">{{
                  scope.row.startTime
                }}</template>
              </el-table-column>
              <el-table-column
                align="center"
                label="结束时间"
                show-overflow-tooltip
                width="200"
              >
                <template slot-scope="scope">{{ scope.row.endTime }}</template>
              </el-table-column>
              <el-table-column
                align="center"
                label="地点"
                width="200"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{ scope.row.place }}</template>
              </el-table-column>
              <el-table-column
                align="center"
                label="主持部门"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{ scope.row.dept }}</template>
              </el-table-column>
              <el-table-column
                align="center"
                label="主持人"
                show-overflow-tooltip
                width="110"
              >
                <template slot-scope="scope">{{ scope.row.userName }}</template>
              </el-table-column>
              <el-table-column
                fixed="right"
                width="110"
                align="center"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="medium"
                    @click="handleDetail(scope)"
                    >查看</el-button
                  >
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
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="我组织的">
        <div class="app-container">
          <div class="sxForm">
            <el-form :inline="true" :model="pageForms" ref="pageForms">
              <el-form-item label="会议名称" prop="meetingName">
                <el-input
                  v-model="pageForms.meetingName"
                  placeholder="请输入会议名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="开始时间" prop="startTime">
                <el-date-picker
                  v-model="pageForms.startTime"
                  type="date"
                  placeholder="选择开始时间"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间" prop="endTime">
                <el-date-picker
                  v-model="pageForms.endTime"
                  type="date"
                  placeholder="选择结束时间"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="主持人" prop="userName">
                <el-input
                  v-model="pageForms.userName"
                  placeholder="请输入主持人"
                ></el-input>
              </el-form-item>
              <div class="btnCont">
                <el-button
                  class="chaxun"
                  v-has="has.query"
                  @click="getAllLists()"
                  >查询</el-button
                >
                <el-button @click="resetForms('pageForms')" class="chongzhi"
                  >重置</el-button
                >
              </div>
            </el-form>
          </div>
          <div class="sxTable">
            <el-button class="blue" v-has="has.del" @click="del('pl')">批量删除</el-button>
            <el-table
              :data="tableDatas"
              v-loading="loadings"
              tooltip-effect="light"
              style="width: 100%;"
              height="calc(100vh - 380px)"
              @selection-change="handleSelectionChange"
              row-key="safebookId"
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
              stripe
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column
                align="center"
                label="会议名称"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{
                  scope.row.meetingName
                }}</template>
              </el-table-column>
              <el-table-column
                align="center"
                label="会议主题"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{
                  scope.row.meetingTheme
                }}</template>
              </el-table-column>
              <el-table-column
                align="center"
                label="开始时间"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{
                  scope.row.startTime
                }}</template>
              </el-table-column>
              <el-table-column
                align="center"
                label="结束时间"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{ scope.row.endTime }}</template>
              </el-table-column>
              <el-table-column
                align="center"
                label="地点"
                show-overflow-tooltip
                width="110"
              >
                <template slot-scope="scope">{{ scope.row.place }}</template>
              </el-table-column>
              <el-table-column
                align="center"
                label="主持部门"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{ scope.row.dept }}</template>
              </el-table-column>
              <el-table-column align="center" label="主持人" width="110">
                <template slot-scope="scope">{{ scope.row.userName }}</template>
              </el-table-column>
              <el-table-column
                fixed="right"
                width="110"
                align="center"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="medium"
                    @click="handleDetails(scope.row.preclassmeetId)"
                    >查看</el-button
                  >
                  <el-button
                    type="text"
                    class="red"
                    v-has="has.del"
                    @click="del(scope.row.preclassmeetId)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>

            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="totals"
              :page-sizes="pageSizes"
              :page-size="pageForms.pageSize"
              @size-change="handleSizeChanges"
              @current-change="handleCurrentChanges"
            ></el-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- </div> -->
  </div>
</template>

<script>
import { getClassTrainList, delpreclassMeet } from '@/api/safety/classTrain.js'
import { getSelectTheme } from '@/api/system/class'
import { getLoginDept, getLoginDeptPerson } from '@/api/system/dept'
import classDetails from './classDetails'
import elementIcons from '@/views/system/menu/element-icons.js'
export default {
  components: { classDetails },
  data() {
    return {
      has: {
        query: 'train:preclassMeet:list',
        del: 'train:preclassMeet:remove'
      },
      classFlag: false,
      classId: '',
      jobProps: {
        value: 'id',
        label: 'label',
        checkStrictly: true
      },
      videoFlag: false,
      //是否显示进度条
      videoUploadPercent: '',
      //进度条的进度，
      isShowUploadVideo: false,
      //显示上传按钮
      videoForm: {
        showVideoPath: ''
      },
      lookTit: '查看',
      tableData: [],
      total: 100,
      totals: 0,
      pageSizes: [10, 15, 20, 25, 30],
      dialogVisible: false,
      type: 0,
      //搜索
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        type: 0,
        meetingName: '',
        userName: '',
        startTime: '',
        endTime: ''
      },
      pageForms: {
        pageNum: 1,
        pageSize: 10,
        type: 1,
        meetingName: '',
        userName: '',
        startTime: '',
        endTime: ''
      },
      //树形
      checkStrictly: true,
      defaultMenutree: [],
      deptOptions: [],
      multipleSelection: [],
      dialogType: 'new',
      defaultProps: {
        children: 'children',
        label: 'label',
        disabled: function(data) {
          if (data.flag == '1') {
            return true
          } else {
            return false
          }
        }
      },
      elementIcons,

      loading: false,
      loadings: false,
      tableDatas: [],
      fileLists: [],
      flag: true,
      //新增表单字段对象
      addBook: {
        //课件分类id
        kjClassId: '',
        //课件分类
        kjClass: '',
        //培训类别id
        pxClassId: '',
        //培训类别
        pxClass: '',
        //培训主题id
        pxTitleId: '',
        //培训主题
        pxTitle: '',
        //课件名称
        kjName: '',
        //课件附件url
        kjFileUrl: '',
        //开始时间
        isPublic: ''
      },
      //查看详情字段
      detailDate: {
        //主题
        pxTitle: '',
        //培训类别
        pxClass: '',
        //培训内容
        pxContent: '',
        //计划培训开始时间
        planStartTime: '',
        //计划培训结束时间
        planEndTime: '',
        //授课老师
        pxTeacher: '',
        //培训机构
        pxAgency: '',
        //地点
        pxPlace: '',
        //培训课时
        pxClassHour: '',
        //培训人员集合
        trainPersonList: [
          {
            //人员
            user: ''
          }
        ],
        //课件集合
        trainCoursewareList: [
          {
            //课件名称
            kjName: '',
            //课件附件url
            kjFileUrl: ''
          }
        ],
        //培训附件list
        trainplanFileList: [
          {
            //附件名称
            pictureName: '',
            //附件url
            pictureUrl: ''
          }
        ]
      },
      classRes: [],
      themeRes: [],
      bookRes: [],
      arr: [],
      userName: ''
    }
  },
  created: async function() {
    this.getAllList()
    this.getAllLists()
    this.getClassSel()
    this.getThemeSel()
    this.getBookSel()
    this.deptOptions = await getLoginDept()
  },
  computed: {
    getUrl() {
      return this.$store.state.apiConfiguration.url + '/fs/upload'
    }
  },
  methods: {
    printings() {
      this.$refs.classDetails.printings()
    },
    handleDetail(scope) {
      this.type = 0
      this.classFlag = true
      this.classId = scope.row.preclassmeetId
    },
    handleDetails(Id) {
      this.type = 1
      this.classFlag = true
      this.classId = Id
    },
    //获取部门id
    async deptChange(val) {
      let deptId = val[val.length - 1]
      this.pageForm.userName = await getLoginDeptPerson(deptId)
      //获取级联选择的label值
      let chooseDept = this.$refs['cascader'].getCheckedNodes()[0].data.label
      //  this.pageForm.dept=
      console.log('选择的部门:' + this.pageForm.dept)
    },
    handleSelectionChange(val) {
      if (val) {
        let arr = []
        for (let i = 0; i < val.length; i++) {
          let itme = val[i]
          arr.push(itme.preclassmeetId)
        }
        this.multipleSelection = [...arr]
      }
    },
    //获取列表数据
    //获取列表
    async getAllList() {
      this.loading = true
      const res = await getClassTrainList(this.pageForm)
      this.tableData = res.rows
      this.total = res.total
      this.loading = false
    },
    async getAllLists() {
      this.loadings = true
      const res = await getClassTrainList(this.pageForms)
      this.tableDatas = res.rows
      this.totals = res.total
      this.loadings = false
    },

    //获取分类下拉列表
    async getClassSel() {
      let dictName = 'train_type'
      this.classRes = await getSelectTheme(dictName)
    },
    //获取课件类别下拉列表
    async getBookSel() {
      let dictName = 'courseware_classification'
      this.bookRes = await getSelectTheme(dictName)
    },
    //获取项目类型下拉id
    peojectTypeFunc(val, vIndex) {
      let resultArr = this.classRes.filter((item) => {
        return item.dictCode === val
      })
      //把值赋给要传给后台的表单对象中
      this.addBook.pxClassId = resultArr[0].dictCode
      this.addBook.pxClass = resultArr[0].dictLabel //直接写val也可以
    },
    //下载附件
    async downLoadFile() {
      let data = this.detailDate
      let fileForm = {
        name: data.trainCoursewareList[0].kjName,
        path: data.trainCoursewareList[0].kjFileUrl
      }
      this.fileDowloadName =
        this.$store.state.apiConfiguration.url +
        'jxlq-system-service' +
        '/fs/download?name=' +
        fileForm.name +
        '&path=' +
        fileForm.path
      location.href = this.fileDowloadName
    },
    //获取主题下拉列表
    async getThemeSel() {
      let dictType = 'training_topics'
      this.themeRes = await getSelectTheme(dictType)
    },
    //获取项目进度下拉id
    peojectFunc(val, vIndex) {
      let resultArr = this.themeRes.filter((item) => {
        return item.dictCode === val
      })
      //把值赋给要传给后台的表单对象中
      this.addBook.pxTitleId = resultArr[0].dictCode
      this.addBook.pxTitle = resultArr[0].dictLabel //直接写val也可以
    },
    //获取课件类型下拉id
    bookTypeFunc(val, vIndex) {
      let resultArr = this.bookRes.filter((item) => {
        return item.dictCode === val
      })
      //把值赋给要传给后台的表单对象中
      this.addBook.kjClassId = resultArr[0].dictCode
      this.addBook.kjClass = resultArr[0].dictLabel //直接写val也可以
    },
    //文件上传前的操作
    async beforeUploadFile(file) {
      console.log(file)
    },
    //进度条
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true
      this.videoUploadPercent = file.percentage.toFixed(0) * 1
    },
    // 文件列表移除文件时的钩子
    async handleRemove(file, fileList) {
      let row = JSON.parse(JSON.stringify(file))
      let roaw = JSON.stringify(file)
      await fsDelete(row.fileId)
      this.addBook.kjFileUrl = ''
      this.$refs.upload.clearFiles()
    },
    // 下载
    handlePreview(file) {
      if (this.flag == false) {
        let row = JSON.parse(JSON.stringify(file))
        this.fileDowloadName =
          this.$store.state.apiConfiguration.url +
          `/fs/download?name=${encodeURI(encodeURI(row.name))}&path=${row.url}`
        location.href = this.fileDowloadName
      }
    },
    // 上传成功时的钩子
    uploadSuccess(res, file, fileList) {
      this.isShowUploadVideo = true
      this.videoFlag = false
      this.videoUploadPercent = 0
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.arr.push(res)
      let formImgList = []
      this.arr.forEach((item) => {
        formImgList.push({
          fileName: item.body.fileName,
          url: item.body.url
        })
      })
      this.addBook.kjFileUrl = formImgList[0].url
    },
    //移除上一个文件
    // removeLastFile(files, fileList) {
    //   if (fileList) {
    //     this.filesUpload = fileList.slice(-1);
    //   }
    // },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    //超出限制时的行为
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    //查看
    async handleAdd(scope) {
      this.dialogType = 'new'
      this.dialogVisible = true
      this.addBook.kjFileUrl = ''
      this.fileLists = []
      console.log('kjFileUrl:' + this.addBook.kjFileUrl)
      if (this.$refs['operationFome']) {
        this.$refs['operationFome'].resetFields()
      }
    },
    //编辑
    async handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      if (this.$refs['operationFome']) {
        this.$refs['operationFome'].resetFields()
      }
      let traincoursewareId = scope.row.traincoursewareId
      this.addBook = await getBookDetail(traincoursewareId)
    },
    confirm() {
      //校验表单
      this.$refs.operationFome.validate(async (valid) => {
        if (!valid) {
          this.$notify({
            title: '操作失败',
            dangerouslyUseHTMLString: true,
            message: '请填写完整',
            type: 'warning'
          })
          return
        }
        const isEdit = this.dialogType === 'edit'

        //取得选中菜单id集合
        let data = null
        try {
          if (isEdit) {
            data = await getEditBook(this.addBook)
          } else {
            data = await getAddBook(this.addBook)
          }
        } catch (e) {
          console.error('接口异常')
        }
        console.log(this.itemModel)
        this.dialogVisible = false
        this.$notify({
          title: data ? '成功' : '失败',
          dangerouslyUseHTMLString: true,
          message: data ? data.message : '服务器开小差了，请稍后再试',
          type: data ? 'success' : 'warning'
        })
        this.getAllList()
      })
    },
    //删除
    // async handleDel(scope) {
    //   if (!scope && this.multipleSelection.length <= 0) {
    //     this.$message({
    //       type: "warning",
    //       message: "请选择要删除的菜单!",
    //     });
    //     return;
    //   }
    //   let row = scope ? scope.row : null;
    //   this.$confirm("确定删除菜单吗?", "删除菜单", {
    //     confirmButtonText: "确认",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(async () => {
    //       await getDeleteBook(
    //         row ? row.traincoursewareId : this.multipleSelection
    //       );
    //       this.$message({
    //         type: "success",
    //         message: "删除成功!",
    //       });
    //       this.getAllList();
    //     })
    //     .catch((err) => {
    //       console.error(err);
    //     });
    // },
    // 删除
    async del(id) {
      console.log(id, this.multipleSelection, 898989898989)
      if (id == 'pl') {
        if (this.multipleSelection.length <= 0) {
          this.$message({
            type: 'warning',
            message: '请选择要删除的班前培训！'
          })
          return
        } else {
          id = this.multipleSelection.toString()
        }
      }
      this.$confirm('确定删除此次班前培训吗?', '删除班前培训', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await delpreclassMeet(id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getAllLists()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getAllList()
    },
    resetForms(formName) {
      this.$refs[formName].resetFields()
      this.getAllLists()
    },

    ///页脚
    handleSizeChange(val) {
      this.pageForm.pageSize = val
      this.getAllList()
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val
      this.getAllList()
    },
    ///页脚
    handleSizeChanges(val) {
      this.pageForms.pageSize = val
      this.getAllLists()
    },
    handleCurrentChanges(val) {
      this.pageForms.pageNum = val
      this.getAllLists()
    }
  }
}
</script>

<style>
.safety-table .el-form-item {
  width: 50%;
  float: left;
}
</style>

<style scoped>
.table-list {
  margin-top: 0;
  padding-top: 0;
}
</style>
