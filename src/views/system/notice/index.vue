<template>
  <div class="app-container container-table">
    <div class="sxForm">
      <el-form
        :inline="true"
        :model="formInline"
        ref="formInline"
        class="demo-form-inline"
      >
        <el-form-item prop="title" label="标题">
          <el-input
            v-model="formInline.title"
            maxlength="30"
            placeholder="请输入标题"
          ></el-input>
        </el-form-item>
        <el-form-item>
        <el-button
          class="chaxun"
          icon="el-icon-search"
          v-has="has.query"
          @click="getNotice"
          >查询</el-button
        >
        <el-button @click="resetForm('formInline')" class="chongzhi"
          >重置</el-button
        >
        </el-form-item>
      </el-form>
    </div>
    <div class="table-list">
      <el-button class="table-add-btn" v-has="has.add" @click="handleAdd">
        新增
      </el-button>
      <el-button class="table-default-btn" @click="handleDelete(scope)">
        批量删除
      </el-button>
      <el-button
        class="table-default-btn"
        v-has="has.top"
        @click="handleTop(scope)"
      >
        批量置顶
      </el-button>
      <el-table
        :data="rolesList"
        v-loading="loading"
        style="width: 100%; margin-top: 30px"
        @selection-change="handleSelectionChange"
        class="tableBox"
        stripe
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column align="center" label="标题">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="发布人">
          <template slot-scope="scope">
            {{ scope.row.createBy }}
          </template>
        </el-table-column>
        <!-- <el-table-column align="header-center" label="发布内容" >
          <template slot-scope="scope" >
            <span v-html="scope.row.content"></span>
          </template>
        </el-table-column> -->
        <el-table-column align="center" label="发布状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == '0'">未发布</span>
            <span v-if="scope.row.status == '1'">已发布</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="发布时间">
          <template slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="公告类型名称">
          <template slot-scope="scope">
            {{ scope.row.noticeType }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="240" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-has="has.check"
              size="medium"
              @click="handleRead(scope)"
            >
              查阅
            </el-button>
            <el-button
              type="text"
              size="medium"
              @click="handleIssue(scope)"
              v-if="scope.row.status == '0'"
            >
              发布
            </el-button>
            <el-button type="text" size="medium" @click="handleCheck(scope)">
              查看
            </el-button>
            <el-button
              type="text"
              v-has="has.top"
              size="medium"
              @click="handleTop(scope)"
            >
              置顶
            </el-button>
            <el-button type="text" size="medium" @click="handleDelete(scope)">
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
        :page-size="formInline.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>

      <el-dialog
        :visible.sync="dialogVisible"
        :title="dialogType === 'check' ? '查看信息' : '添加信息'"
        custom-class="large"
        v-if="dialogVisible"
        @close="closeDialog"
      >
        <el-form
          :model="notice"
          :rules="loginRules"
          ref="noticeFome"
          label-width="120px"
          label-position="left"
        >
          <el-form-item label="标题" prop="title">
            <el-input
              :disabled="checkFlag == false"
              v-model="notice.title"
              maxlength="30"
              show-word-limit
              placeholder="请输入标题"
            />
          </el-form-item>
          <el-form-item label="通知公告类型" prop="noticeTypeId">
            <el-select
              v-model="notice.noticeTypeId"
              placeholder="请选择项目类型"
              style="width: 100%"
              @change="peojectTypeFunc"
              :disabled="checkFlag == false"
            >
              <el-option
                :value="item.dictCode"
                v-for="item in itemRes"
                :key="item.dictCode"
                :label="item.dictLabel"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否置顶" prop="isTop">
            <el-radio-group v-model="notice.isTop" v-if="checkFlag == true">
              <el-radio :label="'0'">否</el-radio>
              <el-radio :label="'1'">是</el-radio>
            </el-radio-group>
            <div v-if="checkFlag == false">
              <span v-if="notice.isTop == '0'">否</span>
              <span v-if="notice.isTop == '1'">是</span>
            </div>
          </el-form-item>
          <el-form-item label="发布范围" prop="area">
            <el-radio-group v-model="notice.area" v-if="checkFlag == true">
              <el-radio :label="'0'" @change="allCompany">全公司</el-radio>
              <el-radio :label="'1'" @change="chooseDept">选择部门</el-radio>
            </el-radio-group>
            <div v-if="checkFlag == false">{{ notice.area }}</div>
          </el-form-item>
          <el-form-item label="已选部门" prop="area" v-show="aleadyShow">
            <el-input
              v-model="deptLabel"
              maxlength="30"
              show-word-limit
              :disabled="true"
            />
          </el-form-item>
          <el-form-item label="是否发布" prop="isRelease">
            <el-radio-group v-model="notice.isRelease" v-if="checkFlag == true">
              <el-radio :label="'0'">否</el-radio>
              <el-radio :label="'1'">是</el-radio>
            </el-radio-group>
            <div v-if="checkFlag == false">
              <span v-if="notice.status == '0'">否</span>
              <span v-if="notice.status == '1'">是</span>
            </div>
          </el-form-item>
          <el-form-item label="有效日期" prop="effectiveTime">
            <div class="block">
              <el-date-picker
                :disabled="checkFlag == false"
                v-model="notice.effectiveTime"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="附件" prop="noticeFileList">
            <div class="upload">
              <el-upload
                ref="upload"
                class="upload-demo"
                :action="getUrl"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :on-success="uploadSuccess"
                :on-change="removeLastFile"
                :on-preview="handlePreview"
                multiple
                :limit="1"
                :file-list="fileLists"
                name="file"
              >
                <el-button size="small" type="primary" v-if="checkFlag == true"
                  >选择文件</el-button
                >
                <span
                  slot="tip"
                  class="el-upload__tip"
                  v-if="checkFlag == false"
                  >点击文件下载</span
                >
              </el-upload>
              <div class="shade" v-if="checkFlag == false"></div>
            </div>
          </el-form-item>

          <el-form-item label="公告内容" prop="content">
            <Editor v-model="notice.content" v-if="checkFlag == true" />
            <div
              class="announcement"
              v-html="notice.content"
              v-if="checkFlag == false"
            />
          </el-form-item>
        </el-form>
        <div style="text-align: right">
          <el-button
            class="confirm-btn"
            @click="confirmRole"
            v-if="checkFlag == true"
          >
            提交
          </el-button>
          <el-button class="cancel-btn" @click="dialogVisible = false">
            取消
          </el-button>
        </div>
      </el-dialog>

      <el-dialog
        :visible.sync="dialogVisibleDept"
        custom-class="small"
        :title="'选择部门'"
      >
        <el-tree
          class="permission-tree"
          node-key="id"
          ref="deptTree"
          :check-strictly="checkStrictly"
          :default-expanded-keys="defaultMenutree"
          :default-checked-keys="defaultMenutree"
          :data="deptOptions"
          :props="defaultProps"
          @check-change="setCheckedNodes"
          show-checkbox
        />

        <div style="text-align: right">
          <el-button type="danger" @click="dialogVisibleDept = false">
            取消
          </el-button>
          <el-button type="primary" @click="dialogVisibleDept = false">
            提交
          </el-button>
        </div>
      </el-dialog>

      <!--查阅窗口-->
      <el-dialog
        :visible.sync="dialogVisibleRead"
        custom-class="small"
        :title="'查阅信息'"
      >
        <el-form
          :model="readRes"
          :rules="loginRules"
          ref="noticeFome"
          label-width="80px"
          label-position="left"
          class="read-box"
        >
          <el-form-item label="已读">
            <div class="read-num">
              <span class="aleady-read"
                >{{ this.readRes.readPeople }}/{{
                  this.readRes.totalPeople
                }}</span
              >
            </div>
            <el-input
              v-model="readRes.readPeopleName"
              :autosize="{ minRows: 3, maxRows: 5 }"
              type="textarea"
              show-word-limit
              :disabled="true"
            />
          </el-form-item>
          <el-form-item label="未读">
            <div class="read-num">
              <span class="un-read"
                >{{ this.readRes.unreadPeople }}/{{
                  this.readRes.totalPeople
                }}</span
              >
            </div>
            <el-input
              v-model="readRes.unreadPeopleName"
              :autosize="{ minRows: 3, maxRows: 5 }"
              type="textarea"
              show-word-limit
              :disabled="true"
            />
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getNoticeList,
  addNotice,
  noticeTop,
  noticeRead,
  deleteNotice,
  issueNotice,
  oneNotice
} from '@/api/system/notice'
import { getTreeSelect } from '@/api/system/dept'
import { getRoleMenuTreeSelect, getMenutreeSelect } from '@/api/system/menu'
import { getSelectTechItem } from '@/api/system/class'
import { isEnglish } from '@/utils/validate.js'
import Editor from '../../../components/quillEditor'
export default {
  components: {
    Editor
  },

  data() {
    return {
      has: {
        // 'remove': 'system:role:remove',
        query: 'tbNotice:post:queryAll',
        add: 'tbNotice:post:noticeSubmit',
        top: 'tbNotice:post:noticeTop',
        check: 'tbNotice:post:noticeCheck'
      },
      notice: {
        title: '',
        area: '',
        effectiveTime: '',
        isTop: '',
        content: '',
        isRelease: '',
        deptLabel: '',
        noticeFileList: [],
        noticeTypeId: '',
        noticeType: ''
      },
      formInline: {
        pageNum: 1,
        pageSize: 10,
        title: ''
      },
      readRes: {
        totalPeople: '',
        readPeople: '',
        unreadPeople: '',
        readPeopleName: '',
        unreadPeopleName: ''
      },
      deptOptions: [],
      fileLists: [],
      noticeFileList: [
        {
          fileName: '',
          fileUrl: ''
        }
      ],
      flag: true,
      dialogVisibleDept: false,
      dialogVisibleRead: false,
      //类型数组
      itemRes: [],
      arr: [],
      aleadyShow: false,
      loading: false,
      total: 100,
      pageSizes: [10, 15, 20, 25, 30],
      menutreeSelect: [],
      rolesList: [],
      deptLabel: '',
      deptLabelId: [],
      defaultMenutree: [],
      multipleSelection: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: true,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      checkFlag: true, //查看
      //表单验证方法
      loginRules: {
        title: [
          {
            required: true,
            message: '请输入公告标题',
            trigger: 'blur'
          }
        ],
        area: [
          {
            required: true,
            message: '请选择公布范围',
            trigger: 'blur'
          }
        ],
        effectiveTime: [
          {
            required: true,
            message: '请选择有效时间',
            trigger: 'blur'
          }
        ],
        isTop: [
          {
            required: true,
            message: '请选择是否置顶',
            trigger: 'blur'
          }
        ],
        content: [
          {
            required: true,
            message: '请输入公告内容',
            trigger: 'blur'
          }
        ],
        isRelease: [
          {
            required: true,
            message: '请选择是否发布',
            trigger: 'blur'
          }
        ],
        noticeTypeId: [
          {
            required: true,
            message: '请选择通知公告类型',
            trigger: 'blur'
          }
        ]
        // noticeFileList: [
        //   {
        //     required: true,
        //     message: "请上传附件",
        //     trigger: "blur",
        //   },
        // ],
      }
    }
  },
  computed: {
    depttreeSelectData() {
      return this.depttreeSelect
    },
    menutreeSelectData() {
      return this.menutreeSelect
    },
    getUrl() {
      return (
        this.$store.state.apiConfiguration.url +
        this.$store.state.serviceName.jurisdiction +
        '/fs/upload'
      )
    }
  },
  async created() {
    this.getNotice()
    this.getItemSel()
    this.deptOptions = await getTreeSelect()
  },
  methods: {
    //获取项目类型下拉列表
    async getItemSel() {
      let dictName = 'announcement_type'
      this.itemRes = await getSelectTechItem(dictName)
    },
    //获取类型下拉id
    peojectTypeFunc(val, vIndex) {
      let resultArr = this.itemRes.filter((item) => {
        return item.dictCode === val
      })
      //把值赋给要传给后台的表单对象中
      this.notice.noticeTypeId = resultArr[0].dictCode
      this.notice.noticeType = resultArr[0].dictLabel //直接写val也可以
    },
    //查阅
    async handleRead(scope) {
      this.dialogVisibleRead = true
      let noticeId = scope.row.noticeId
      this.readRes = await noticeRead(noticeId)
    },
    //查看
    async handleCheck(scope) {
      this.dialogVisible = true
      this.dialogType = 'check'
      this.checkFlag = false
      let resDete = await oneNotice(scope.row.noticeId)
      this.notice = resDete
      this.fileLists.push(
        Object.assign({}, { name: resDete.fileName, url: resDete.fileUrl })
      )
    },
    //发布
    async handleIssue(scope) {
      let noticeId = scope.row.noticeId
      let data = await issueNotice(noticeId)
      this.$notify({
        title: data ? '操作成功' : '操作失败',
        dangerouslyUseHTMLString: true,
        message: data ? data.message : '系统正在维护中，请与管理员联系',
        type: data ? 'success' : 'warning'
      })
      this.getNotice()
    },
    //置顶
    async handleTop(scope) {
      if (!scope && this.multipleSelection.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请选择置顶选项!'
        })
        return
      }
      let row = scope ? scope.row : null
      let data = await noticeTop(row ? row.noticeId : this.multipleSelection)
      this.$notify({
        title: data ? '操作成功' : '操作失败',
        dangerouslyUseHTMLString: true,
        message: data ? data.message : '系统正在维护中，请与管理员联系',
        type: data ? 'success' : 'warning'
      })
      this.getNotice()
    },
    // 文件列表移除文件时的钩子
    async handleRemove(file, fileList) {
      let row = file
      await fsDelete(row.fileId)
      this.notice.noticeFileList = []
      this.$refs.upload.clearFiles()
    },
    // 上传成功时的钩子
    uploadSuccess(res, file, fileList) {
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.arr.push(res)
      let formImgList = []
      this.arr.forEach((item) => {
        formImgList.push({
          fileName: item.body.fileName,
          fileUrl: item.body.url
        })
      })
      if (formImgList.length > 1) {
        let arry = formImgList.pop()
        this.notice.noticeFileList.push(arry)
      } else {
        this.notice.noticeFileList = formImgList
      }
    },
    //下载附件
    handlePreview(file) {
      let row = file
      this.fileDowloadName =
        this.$store.state.apiConfiguration.url +
        `fs/download?name=${encodeURI(encodeURI(row.name))}&path=${row.url}`
      location.href = this.fileDowloadName
    },

    //移除上一个文件
    removeLastFile(files, fileList) {
      if (fileList) {
        this.filesUpload = fileList.slice(-1)
      }
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    allCompany() {
      this.deptLabel = []
      this.aleadyShow = false
    },
    //穿梭框获取人员
    async setCheckedNodes(nodes, checked, indeterminate) {
      console.log('setCheckedNodes', nodes, checked, indeterminate)
      if (checked) {
        this.deptLabel = nodes.label
        this.deptLabelId = nodes.id
        //  this.notice.area.push(nodes.id)
        this.notice.area = this.deptLabelId
        console.log(this.notice.area)
      } else {
        //根据id寻找下标
        const index = this.deptLabel.findIndex((item) => item.id === nodes.id)
        this.deptLabel.splice(index, 1)
        const indexId = this.deptLabelId.findIndex(
          (item) => item.id === nodes.id
        )
        this.deptLabelId.splice(index, 1)
        this.notice.area = this.deptLabelId.join()
        console.log(this.notice.area)
      }
    },
    chooseDept() {
      this.dialogVisibleDept = true
      this.aleadyShow = true
      // this.label='1';
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getNotice()
    },
    handleSelectionChange(val) {
      if (val) {
        let arr = []
        for (let i = 0; i < val.length; i++) {
          let itme = val[i]
          arr.push(itme.noticeId)
        }
        this.multipleSelection = [...arr]
      }
    },
    handleSizeChange(val) {
      this.formInline.pageSize = val
      this.getNotice()
    },
    handleCurrentChange(val) {
      this.formInline.pageNum = val
      this.getNotice()
    },
    async getNotice() {
      this.loading = true
      const res = await getNoticeList(this.formInline)
      this.rolesList = res.rows
      this.total = res.total
      this.loading = false
    },
    async handleAdd() {
      this.dialogType = 'new'
      this.checkFlag = true
      this.dialogVisible = true
      // this.deptOptions = [];
      if (this.$refs.deptTree) {
        this.deptOptions = await getTreeDeptSelect()
        this.$refs.deptTree.setCheckedKeys([], false)
      }
      this.notice.noticeFileList = []
      if (this.$refs['noticeFome']) {
        this.$refs['noticeFome'].resetFields()
      }
    },
    handleDelete(scope) {
      if (!scope && this.multipleSelection.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的公告!'
        })
        return
      }
      let row = scope ? scope.row : null
      this.$confirm('确定删除公告吗?', '删除公告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteNotice(row ? row.noticeId : this.multipleSelection)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getNotice()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    async confirmRole() {
      //取得选中菜单id集合
      if (this.$refs.menuTree) {
        const menuTreeKeys = this.$refs.menuTree.getCheckedKeys()

        this.role.menuIds = menuTreeKeys
      }

      this.$refs.noticeFome.validate(async (valid) => {
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

        let data = null
        try {
          if (isEdit) {
            delete this.notice.deptLabel
            data = await updateRole(this.role)
          } else {
            delete this.notice.deptLabel
            if (this.notice.area == '1') {
              this.notice.area = this.deptLabelId.join()
            }
            data = await addNotice(this.notice)
          }
        } catch (e) {
          console.error('接口异常')
        }
        this.dialogVisible = false
        this.$notify({
          title: data ? '成功' : '失败',
          dangerouslyUseHTMLString: true,
          message: data ? data.message : '服务器开小差了，请稍后再试',
          type: data ? 'success' : 'warning'
        })
        this.getNotice()
      })
    },
    //关闭弹框的事件
    closeDialog(formName) {
      this.notice = {}
      this.fileList = []
      this.$refs.upload.clearFiles()
      this.deptLabel = ''
    }
  }
}
</script>

<style lang="scss">
.app-container {
  .announcement {
    width: 100%;
    height: 400px;
    overflow: auto;
    border: 1px solid #606266;
    padding: 10px;
  }
  .roles-table {
    margin-top: 15px;
  }

  .permission-tree {
    margin-bottom: 15px;
  }
  .read-box {
    .el-form-item {
      position: relative;
      .read-num {
        position: absolute;
        left: -80px;
        top: 20px;
        display: inline-block;
        font-size: 12px;
      }
    }
  }
  .aleady-read {
    color: #6bc4bd;
  }
  .un-read {
    color: #d9001b;
  }
}
.upload {
  position: relative;
  .shade {
    position: absolute;
    right: 0;
    height: 100%;
    width: 15%;
    top: 0;
    z-index: 999999;
    background-color: #fff;
  }
}
.ql-editor{
    // height:150px;
     }
// .tableBox{
//   td{
//     div{
//       max-height: 120px;
//     }
//   }
// }
</style>
