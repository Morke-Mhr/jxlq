<template>
  <!-- 培训课件 -->
  <div class="book-index app-container">
    <div class="left">
      <el-input
        class="search inputAuto"
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        style="padding: 0 10px 10px;width: 100%"
      >
      </el-input>
      <el-tree
        class="filter-tree"
        :data="treeData"
        :props="defaultProps"
        :filter-node-method="filterNode"
        check-strictly
        ref="tree"
        @node-click="handleNodeClick"
        node-key="id"
      >
      </el-tree>
    </div>
    <div class="right safe_main">
      <div class="sxForm">
        <el-form
          :inline="true"
          :model="pageForm"
          ref="pageForm"
          class="demo-form-inline"
        >
          <el-form-item label="课件名称" prop="kjName">
            <el-input
              v-model="pageForm.kjName"
              placeholder="课件名称"
            ></el-input>
          </el-form-item>
          <div class="btnCont">
            <el-button class="chaxun" v-has="has.query" @click="getAllList()"
              >查询</el-button
            >
            <el-button @click="resetForm('pageForm')" class="chongzhi"
              >重置</el-button
            >
          </div>
        </el-form>
      </div>
      <div class="sxTable">
        <el-button class="blue" v-has="has.add" @click="handleAdd()">
          新增
        </el-button>
        <el-button class="blue" v-has="has.remove" @click="handleDel(scope)">
          批量删除
        </el-button>
        <el-table
          :data="tableData"
          v-loading="loading"
          tooltip-effect="light"
          style="width: 100%"
          height="calc(100vh - 380px)"
          @selection-change="handleSelectionChange"
          row-key="safebookId"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          stripe
        >
          <el-table-column type="selection" width="55"> </el-table-column>

          <el-table-column
            show-overflow-tooltip
            align="center"
            label="课件名称"
          >
            <template slot-scope="scope">
              {{ scope.row.kjName }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="培训类别"
          >
            <template slot-scope="scope">
              {{ scope.row.pxClass }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="类型"
            width="100px"
          >
            <template slot-scope="scope">
              {{ scope.row.kjClass }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="主题">
            <template slot-scope="scope">
              {{ scope.row.pxTitle }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="公开"
            width="100px"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.isPublic == false">否</span>
              <span v-if="scope.row.isPublic == true">是</span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="状态"
            width="100px"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status == '0'">转码中</span>
              <span v-if="scope.row.status == '1'">成功</span>
              <span v-if="scope.row.status == '2'">失败</span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="上传人"
            width="150px"
          >
            <template slot-scope="scope">
              {{ scope.row.createBy }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="上传时间"
          >
            <template slot-scope="scope">
              {{ scope.row.createTime }}
            </template>
          </el-table-column>

          <el-table-column width="140" align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-has="has.edit"
                style="margin-left: 0px"
                :disabled="scope.row.status == '0'"
                @click="handleEdit(scope)"
              >
                编辑
              </el-button>
              <el-button
                type="text"
                v-has="has.remove"
                class="red"
                style="margin-left: 0px"
                :disabled="scope.row.status == '0'"
                @click="handleDel(scope)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-sizes="pageSizes"
          :current-page="pageForm.pageNum"
          :page-size="pageForm.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>

        <el-dialog
          :visible.sync="dialogVisible"
          @close="closeDialog"
          :title="dialogType === 'edit' ? '修改培训课件' : '添加培训课件'"
          :close-on-click-modal="false"
          custom-class="small"
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
                type="textarea"
                :autosize="{ minRows: 3}"
                show-word-limit
                placeholder="请输入课件名称"
              />
            </el-form-item>

            <el-form-item label="课件类别" prop="kjClassId">
              <el-select
                v-model="addBook.kjClassId"
                placeholder="请选择类别"
                @change="bookTypeFunc"
                :disabled="UploadStatus == false"
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

            <el-form-item
              label="课件附件"
              :rules="{
                required: true,
                message: '请选择课件附件',
                trigger: 'blur'
              }"
            >
              <div class="upload">
                <el-upload
                  ref="upload"
                  class="upload-demo"
                  :action="getUrl"
                  :before-remove="beforeRemove"
                  :on-preview="handlePreview"
                  :on-exceed="handleExceed"
                  :on-remove="handleRemove"
                  :on-change="changeFile"
                  :auto-upload="false"
                  multiple
                  :limit="1"
                  :file-list="fileLists"
                  name="file"
                >
                  <el-button
                    class="p15 blue"
                    v-if="UploadStatus == true"
                    @click="chooseFile"
                    >选择文件</el-button
                  >
                  <span
                    slot="tip"
                    class="el-upload__tip"
                    v-if="UploadStatus == false"
                    >点击文件下载</span
                  >

                  <!--上传视频-->
                  <video
                    v-if="videoForm.showVideoPath != '' && !videoFlag"
                    v-bind:src="videoForm.showVideoPath"
                    class="avatar video-avatar"
                    controls="controls"
                  >
                    您的浏览器不支持视频播放
                  </video>

                  <el-progress
                    v-if="videoFlag == true"
                    type="circle"
                    v-bind:percentage="videoUploadPercent"
                    style="margin-top: 7px"
                  ></el-progress>
                </el-upload>
                <div class="shade" v-if="UploadStatus == false"></div>
              </div>
            </el-form-item>
            <el-form-item label="公开" prop="isPublic">
              <el-radio-group v-model="addBook.isPublic">
                <el-radio :label="false">不开放</el-radio>
                <el-radio :label="true">开放</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button class="fBtn" @click="dialogVisible = false">
              取消
            </el-button>
            <el-button class="tBtn" @click="confirm" :loading="smenload">
              提交
            </el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getBookList,
  getAddBook,
  getEditBook,
  getBookDetail,
  getDeleteBook,
  getPxleibiePxzhutiTreeData
} from '@/api/safety/book.js'
import { getSelectTheme } from '@/api/system/class'
import elementIcons from '@/views/system/menu/element-icons.js'
export default {
  data() {
    return {
      has: {
        remove: 'train:trainCourseware:remove',
        query: 'train:trainCourseware:list',
        details: 'train:trainCourseware:query',
        add: 'train:trainCourseware:add',
        edit: 'train:trainCourseware:edit'
      },
      smenload: false,
      // 文件是否符合要求
      isNext: false,
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
      pageSizes: [10, 15, 20, 25, 30],
      dialogVisible: false,

      //搜索
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        pxClassId: '',
        pxTitleId: '',
        kjName: ''
      },
      //树形
      checkStrictly: true,
      defaultMenutree: [],
      deptOptions: [],
      multipleSelection: [],
      UploadStatus: true, //控制编辑是否上传附件
      dialogType: 'new',
      elementIcons,

      loading: false,
      fileLists: [],
      flag: true,
      //表单验证方法
      formRules: {
        kjName: [
          {
            required: true,
            message: '请输入课件名称',
            trigger: 'blur'
          }
        ],
        kjClassId: [
          {
            required: true,
            message: '请选择课件类型',
            trigger: 'blur'
          }
        ],
        pxClassId: [
          {
            required: true,
            message: '请选择培训类别',
            trigger: 'blur'
          }
        ],
        pxTitleId: [
          {
            required: true,
            message: '请选择培训主题',
            trigger: 'blur'
          }
        ],
        file: [
          {
            required: true,
            message: '请选择课件附件',
            trigger: 'blur'
          }
        ],
        isPublic: [
          {
            required: true,
            message: '请选择是否开放',
            trigger: 'blur'
          }
        ]
      },
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
        file: '',
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
      dataRes: null,
      // 树形控件数据
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      filterText: ''
    }
  },
  async created() {
    this.getAllList()
    this.getClassSel()
    this.getThemeSel()
    this.getBookSel()
    this.treeData = await getPxleibiePxzhutiTreeData()
  },
  computed: {
    getUrl() {
      return (
        this.$store.state.apiConfiguration.url +
        this.$store.state.serviceName.safetyEdu +
        '/trainCourseware/'
      )
    }
  },
  methods: {
    handleNodeClick(data, node) {
      this.pageForm.pageNum = 1
      if (data.children) {
        this.pageForm.pxClassId = data.id
        this.pageForm.pxTitleId = ''
      } else {
        this.pageForm.pxClassId = node.parent.key
        this.pageForm.pxTitleId = data.id
      }
      this.getAllList()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleSelectionChange(val) {
      if (val) {
        let arr = []
        for (let i = 0; i < val.length; i++) {
          let itme = val[i]
          arr.push(itme.traincoursewareId)
        }
        this.multipleSelection = [...arr]
      }
    },
    //获取列表数据
    //获取列表
    async getAllList() {
      this.loading = true
      const res = await getBookList(this.pageForm)
      this.tableData = res.rows
      this.total = res.total
      this.loading = false
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
      this.fileLists = [] //类型改变，上传框清空
    },
    changeFile(file) {
      console.log(file, 1)
      if (this.addBook.kjClassId == '1301053601032040449') {
        let extension = file.name.split('.')[1]
        let extensionList = [
          'xls',
          'xlsx',
          'doc',
          'docx',
          'pdf',
          'XLS',
          'XLSX',
          'DOC',
          'DOCX',
          'PDF',
          'TXT',
          'txt'
        ]
        if (extensionList.indexOf(extension) < 0) {
          this.$message.error('上传失败！只能上传word,excel,pdf,txt文件!')
          return false
          // return this.$refs.upload.abort();
        }
        const isLt2M = file.size / 1024 / 1024 < 100
        if (!isLt2M) {
          alert('上传文件大小不能超过 100MB')
          return false
        }
        this.isNext = true
      } else if (this.addBook.kjClassId == '1301053632397045762') {
        let extension = file.name.split('.')[1]
        let extensionList = ['RAR', 'ZIP', 'MP3', 'rar', 'zip', 'mp3']
        if (extensionList.indexOf(extension) < 0) {
          this.$message.error('上传失败！只能上传RAR,ZIP,MP3格式文件!')
          return false
          // return this.$refs.upload.abort();
        }
        const isLt2M = file.size / 1024 / 1024 < 50
        if (!isLt2M) {
          alert('上传文件大小不能超过 50MB')
          return false
        }
        this.isNext = true
      } else if (this.addBook.kjClassId == '1288290797423185922') {
        let extension = file.name.split('.')[1]
        let extensionList = ['bmp', 'jpg', 'png', 'gif', 'jepg']
        if (extensionList.indexOf(extension) < 0) {
          this.$message.error('上传失败！只能上传bmp,jpg,png,gif,jepg格式文件!')
          return false
          // return this.$refs.upload.abort();
        }
        const isLt2M = file.size / 1024 / 1024 < 10
        if (!isLt2M) {
          alert('上传文件大小不能超过 10MB')
          return false
        }
        this.isNext = true
      } else if (this.addBook.kjClassId == '1288290883351969793') {
        let extension = file.name.split('.')[1]
        let extensionList = [
          'AVI',
          'rmvb',
          'FLV',
          'mp4',
          '3GP',
          'avi',
          'RMVB',
          'flv',
          'MP4',
          '3gp'
        ]
        if (extensionList.indexOf(extension) < 0) {
          this.$message.error('上传失败！只能上传AVI,rmvb,FLV,mp4,3GP格式文件!')
          return false
        }
        const isLt2M = file.size / 1024 / 1024 < 1024
        if (!isLt2M) {
          alert('上传文件大小不能超过 1GB')
          return false
        }
        this.isNext = true
      }
      this.addBook.file = file.raw
      this.$refs.upload.submit()
    },
    //进度条
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true
      this.videoUploadPercent = file.percentage.toFixed(0) * 1
    },
    // 下载
    handlePreview(file) {
      if (this.dialogVisible == true) {
        let dds = file.url.indexOf('https')
        if (dds == -1) {
          let nameS = file.url.substring(file.url.lastIndexOf('.') + 1)
          this.fileDowloadName =
            this.$store.state.apiConfiguration.url +
            `fs/download?name=${encodeURI(
              encodeURI(file.name + '.' + nameS)
            )}&path=${file.url}`
          location.href = this.fileDowloadName
        } else {
          let a = document.createElement('a')
          a.download = file.name //这里是文件名称，这里暂时用链接代替，可以替换
          a.href = file.url
          a.target = '_blank'
          a.style.display = 'none'
          document.body.appendChild(a)
          a.click()
          a.remove()
          // location.href = file.url
        }
      }
    },
    // 上传成功时的钩子
    // onProgress(event, file, fileList) {
    //   this.fileList = [];
    //   this.isShowUploadVideo = true;
    //   this.videoFlag = false;
    //   this.videoUploadPercent = 0;
    //   // this.arr.push(res);
    //   let formImgList = [];
    //   fileList.forEach((item) => {
    //     formImgList.push({
    //       name: item.name,
    //       url: "",
    //     });
    //   });
    //   this.addBook.file = formImgList[0].url;
    //   this.fileList = formImgList;
    //   // this.fileLists='文件名';

    //   console.log(this.fileLists);
    // },
    //移除上一个文件
    // removeLastFile(files, fileList) {
    //   if (fileList) {
    //     this.filesUpload = fileList.slice(-1);
    //   }
    // },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 文件列表移除文件时的钩子
    handleRemove() {
      this.fileLists = []
    },
    //超出限制时的行为
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    //新增
    async handleAdd(scope) {
      this.dialogType = 'new'
      this.dialogVisible = true
      this.UploadStatus = true
      this.addBook.file = ''
      this.fileLists = []
      console.log('file:' + this.addBook.file)
      if (this.$refs['operationFome']) {
        this.$refs['operationFome'].resetFields()
      }
    },
    //编辑
    async handleEdit(scope) {
      this.isNext = true
      this.UploadStatus = false
      this.dialogType = 'edit'
      this.dialogVisible = true
      console.log(this.fileLists)
      if (this.$refs['operationFome']) {
        this.$refs['operationFome'].resetFields()
      }
      let traincoursewareId = scope.row.traincoursewareId
      let resData = await getBookDetail(traincoursewareId)
      this.addBook = resData
      this.fileLists.push(
        Object.assign({}, { name: resData.kjName, url: resData.kjFileUrl })
      )
    },
    async chooseFile() {},
    confirm() {
      //校验表单
      this.$refs.operationFome.validate(async (valid) => {
        if (!valid || !this.isNext) {
          this.$notify({
            title: '操作失败',
            dangerouslyUseHTMLString: true,
            message: this.isNext ? '请填写完整' : '文件不符合要求,请重新上传',
            type: 'warning'
          })
          return
        }
        const isEdit = this.dialogType === 'edit'

        //取得选中菜单id集合
        let data = null
        delete this.addBook.traindemandId
        delete this.addBook.status
        delete this.addBook.kjFileUrl
        this.smenload = true
        try {
          if (isEdit) {
            data = await getEditBook(this.addBook)
          } else {
            delete this.addBook.traincoursewareId
            data = await getAddBook(this.addBook)
          }
        } catch (e) {
          console.error('接口异常')
        }
        this.smenload = false
        console.log(this.itemModel)
        this.dialogVisible = false
        this.$notify({
          title: data ? '操作成功' : '操作失败',
          dangerouslyUseHTMLString: true,
          type: data ? 'success' : 'warning'
        })
        let res = await getBookList(this.pageForm)
        this.dataRes = res.rows
        this.tableData = res.rows
        this.total = res.total
        for (let i = 0; i < this.dataRes.length; i++) {
          if (this.dataRes[i].status == '0') {
            this.$notify({
              title: '提示',
              message: this.dataRes[i].kjName + '上传的文件正在转码中!',
              duration: 8000
            })
          } else if (this.dataRes[i] == '1') {
            this.$notify({
              title: '提示',
              message: this.dataRes[i].kjName + '文件上传成功!',
              duration: 8000
            })
          } else if (this.dataRes[i] == '2') {
            this.$notify({
              title: '提示',
              message: this.dataRes[i].kjName + '文件上传失败!',
              duration: 8000
            })
          }
        }
      })
    },
    //删除
    async handleDel(scope) {
      if (!scope && this.multipleSelection.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的选项！'
        })
        return
      }
      let row = scope ? scope.row : null
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await getDeleteBook(
            row ? row.traincoursewareId : this.multipleSelection
          )
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
          this.getAllList()
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

    ///页脚
    handleSizeChange(val) {
      this.pageForm.pageSize = val
      this.getAllList()
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val
      this.getAllList()
    },
    //关闭弹框的事件
    closeDialog(formName) {
      this.isNext = false
      this.fileLists = []
      this.$refs.upload.clearFiles()
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container /deep/ {
  .el-icon-close-tip {
    display: none !important;
  }
  // .el-upload-list__item:hover .el-icon-close{
  // display:none !important;
  // }
}

.book-index {
  .el-pagination {
    padding-bottom: 20px;
  }
  .safety-table .el-form-item {
    width: 50%;
    float: left;
  }
  .upload-demo {
    position: relative;
  }
  .shade {
    position: absolute;
    right: 0;
    height: 100%;
    width: 10%;
    top: 0;
    z-index: 999999;
    background-color: #fff;
  }
}
</style>
