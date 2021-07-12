<template>
  <div class="table-list confide-content">
    <el-form
      :model="addProgram"
      :rules="formRules"
      ref="operationFome"
      label-width="125px"
      label-position="left"
    >
      <el-form-item label="方案性质" prop="natureId">
        <el-select
          v-model="addProgram.natureId"
          placeholder="请选择方案性质"
          style="width: 100%"
          @change="peojectFunc"
        >
          <el-option
            :value="item.dictCode"
            v-for="item in natureRes"
            :key="item.dictCode"
            :label="item.dictLabel"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="方案名称" prop="programName">
        <el-input
          v-model="addProgram.programName"
          maxlength="30"
          show-word-limit
          placeholder="请输入方案名称"
        />
      </el-form-item>

      <el-form-item label="类别" prop="categoryId">
        <el-select
          v-model="addProgram.categoryId"
          placeholder="请选择方案类别"
          style="width: 100%"
          @change="peojectTypeFunc"
        >
          <el-option
            :value="item.dictCode"
            v-for="item in categoryRes"
            :key="item.dictCode"
            :label="item.dictLabel"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="addProgram.projectName"
          style="width: 70%"
          maxlength="30"
          show-word-limit
          placeholder="请输入项目名称"
          :disabled="true"
        />
        <span @click="chooseList" class="choose-list">选择列表</span>
      </el-form-item>
      <el-form-item label="标段" prop="bid">
        <el-input
          v-model="addProgram.bid"
          maxlength="30"
          show-word-limit
          placeholder="标段"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item
        label="参建子公司"
        prop="projectDeptId"
        style="width: 100%"
        v-show="true"
      >
        <el-cascader
          ref="cascader"
          v-model="addProgram.projectDeptId"
          :options="this.deptOptions"
          :props="jobProps"
          style="width: 100%"
          @change="handleDeptFun"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="addProgram.content"
        ></el-input>
      </el-form-item>
	<el-form-item label="分步分项开工时间" prop="startTime">
	  <div class="block">
		  <el-date-picker
			v-model="addProgram.startTime"
			type="date"
			format="yyyy-MM-dd"
			value-format="yyyy-MM-dd"
			placeholder="请选择分步分项开工时间">
		   </el-date-picker>
	   </div>
	</el-form-item>
      <el-form-item label="附件" prop="workProgramFileList">
        <!-- :on-remove="handleRemove"  :before-remove="beforeRemove"-->
        <div class="upload">
          <el-upload
            ref="upload"
            class="upload-demo"
            :action="getUrl"
            :on-success="uploadSuccess"
            :on-remove="remUpload"
            :before-upload="beforeUpload"
            multiple
            :limit="5"
            :file-list="fileLists"
            name="file"
          >
            <el-button class="blue" v-if="flag == true"
              >选择文件</el-button
            >
            <div slot="tip" class="el-upload__tip" style="line-height: 16px">
              只能上传bmp、jpg，png，gif（10M）；AVI、rmvb、FLV、mp4、3GP（1G）；Doc、docx、xls、xlsx、txt、PDF（100M）；RAR、ZIP（50M）；MP3（50M）格式文件，
            </div>
            <span v-if="flag == false">点击文件下载</span>
          </el-upload>
          <div class="shade" v-if="flag == false"></div>
        </div>
      </el-form-item>
    </el-form>

    <el-form
      :model="nextData"
      :rules="nextDataFormRules"
      ref="nextDataFormRules"
      class="change-form"
      label-width="100px"
      label-position="left"
    >
      <el-form-item
        label="审批人"
        prop="userName"
        :rules="{
          required: true,
          message: '请选择审批人',
          trigger: ['blur', 'change']
        }"
      >
        <el-input
          v-model="nextData.userName"
          maxlength="30"
          placeholder="点击选择审批人"
          readonly
          @focus="alertChooseSp"
        ></el-input>
        <!-- <span
              style="color:#0d74d7;font-size: 14px;float: right;cursor: pointer;"
              @click="alertChooseSp"
              >选择审批人</span
            > -->
      </el-form-item>
    </el-form>

    <!--新增盒子-->
    <el-dialog
      :visible.sync="dialogVisible"
      append-to-body
      custom-class="large"
      :title="'新增列表'"
    >
      <el-form
        :inline="true"
        :model="addPageForm"
        ref="pageForm"
        class="demo-form-inline"
      >
        <el-form-item prop="projectName" label="项目名称">
          <el-input
            v-model="addPageForm.projectName"
            maxlength="30"
            placeholder="请输入项目名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            class="chaxun"
            icon="el-icon-search"
            v-has="has.query"
            @click="getTech('cx')"
            >查询</el-button
          >
          <el-button @click="resetForm('pageForm')" class="chongzhi"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        :data="addTableData"
        v-loading="loading"
        style="width: 100%; margin-top: 30px"
        row-key="menuId"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        stripe
      >
        <el-table-column align="left" label="项目名称">
          <template slot-scope="scope">
            <el-radio @change="selectData" v-model="radio" :label="scope.row">
              {{ scope.row.projectName }}
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column align="left" label="标段">
          <template slot-scope="scope">
            {{ scope.row.bid }} </template
          >>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="addTotal"
        :current-page.sync="currentPage"
        :page-sizes="addPageSizes"
        :page-size="addPageForm.pageSize"
        @size-change="addHandleSizeChange"
        @current-change="addHandleCurrentChange"
      >
      </el-pagination>
      <div style="text-align: right">
        <el-button class="confirm-btn" @click="selectItem"> 提交 </el-button>
        <el-button class="cancel-btn" @click="fBtn"> 取消 </el-button>
      </div>
    </el-dialog>
    <!--选择审批人盒子-->
    <sdialog
      ref="sdialog"
      @choiceUser="choiceUser"
      :sNeed="true"
      dxId="user"
      :transferProps="{
        key: 'userId',
        label: 'realName'
      }"
      :treedata="treedata"
    ></sdialog>
  </div>
</template>

<script>
import Sdialog from '@/components/selectDialog'
import { viewBusinessInfo } from '@/api/system/process'
import { getLoginDeptPerson, getTreeSelect } from '@/api/system/dept'
import {
  getAddProgram,
  getProgramNextNode
} from '@/api/technology/program/program.js'
import { getSelectTechItem } from '@/api/system/class'
import { getTechnologyList } from '@/api/technology/item/item.js'
//引入防抖文件
import { antiShake } from '@/utils/debounce.js' //防抖

export default {
  props: {
    businessKey: String,
    businessCode: String,
    scopeRow: {}
  },
  name: 'index',
  components: {
    Sdialog: Sdialog
  },
  data() {
    return {
      radio: 1,
      // 选中的数据
      selData: '',
      // 当前页数
      currentPage: 1,
      treedata: [],
      deptOptions: [],
      businessName: '',
      chooseDeptId: '',
      deptPersonProps: {
        key: 'userId',
        label: 'realName',
        disabled: false
      },
      deptPerson: null,
      deptLabel: [],
      has: {
        remove: 'system:dept:remove',
        query: 'system:dept:query',
        add: 'system:dept:add',
        edit: 'system:dept:edit'
      },
      //选择列表 项目清单
      addTotal: 0,
      nextData: { userName: '' },
      toUser: null,
      chooseUserId: null,
      addPageSizes: [5],
      addPageForm: {
        pageNum: 1,
        pageSize: 5,
        projectName: '',
        bid: '',
        projectTypeId: '',
        projectProcessId: ''
      },
      label: [],
      jobProps: {
        value: 'id',
        label: 'label',
        checkStrictly: true
      },
      addProgram: {
        //方案名称
        programName: '',
        natureId: '',
        nature: '',
        categoryId: '',
        category: '',
        projectName: '',
        projectId: '',
        bid: '',
        content: '',

        projectDept: '',
        projectDeptId: '',
        workProgramFileList: [],
        toUser: ''
      },
      flag: true,
      multipleSelection: [],
      //选择列表
      addTableData: [],
      loading: false,
      tableData: [],
      tableKey: 0,
      listLoading: false,
      dialogVisible: false,
      dialogType: 'new',
      fileLists: [],
      currentChecke: '',
      //性质
      natureRes: [],
      //类别
      categoryRes: [],
      arr: [],
      //表单验证方法
      formRules: {
        programName: [
          {
            required: true,
            message: '请选择方案名称',
            trigger: 'blur'
          }
        ],
        natureId: [
          {
            required: true,
            message: '请选择方案性质',
            trigger: 'blur'
          }
        ],
        categoryId: [
          {
            required: true,
            message: '请选择方案类别',
            trigger: 'blur'
          }
        ],
        projectName: [
          {
            required: true,
            message: '请选择项目名称',
            trigger: 'blur'
          }
        ],
        bid: [
          {
            required: true,
            message: '请选择标段',
            trigger: 'blur'
          }
        ],
        projectDeptId: [
          {
            required: true,
            message: '请选择参建子公司',
            trigger: 'blur'
          }
        ],
        content: [
          {
            required: true,
            message: '请输入内容',
            trigger: 'blur'
          }
        ],
        workProgramFileList: [
          {
            required: true,
            message: '请选择附件',
            trigger: 'blur'
          }
        ]
      },
      nextDataFormRules: {
        userName: [
          {
            required: true,
            message: '请选择审批人',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    getUrl() {
      return (
        this.$store.state.apiConfiguration.url +
        'jxlq-system-service' +
        '/fs/upload'
      )
    }
  },
  created: async function() {
    this.getNatureSel()
    this.getTypeSel()
    this.deptOptions = await getTreeSelect()
    if (this.$refs['operationFome']) {
      this.$refs['operationFome'].resetFields()
    }
    this.getSelInfo()
  },
  methods: {
    closeFun() {
      this.$emit('closeDialog')
    },
    //获取方案设计信息
    async getSelInfo() {
      this.loading = true
      const res = await viewBusinessInfo(this.businessCode, this.businessKey)
      //  res.body.createTime=(res.body.createTime.slice(0,3)).join("-")
      this.addProgram = res.body

      let fileData = res.body.workProgramFileList
      fileData.forEach((file) => {
        file.name = file.fileName
        file.url = file.fileUrl
        delete file.fileName // 删除原有的字段，也可以不删除
      })
      this.fileLists = [...fileData]
      this.loading = false
    },
    async getTech(cx) {
      if (cx == 'cx') {
        this.addPageForm.pageNum = 1
        this.currentPage = 1
      }
      let res = await getTechnologyList(this.addPageForm)
      this.addTableData = res.rows
      this.addTotal = res.total
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.addPageForm.pageNum = this.currentPage = 1
      this.getTech()
    },
    // 大小限制
    // beforeAvatarUpload(file) {
    //   let extension = file.name.split(".")[1];
    //   let extensionList = ["doc", "docx", "xls", "xlsx", "txt", "pdf"];
    //    let testmsg = extension.toLowerCase();
    //   if (extensionList.indexOf(testmsg) < 0) {
    //     this.$message.error("doc,docx,xls,xlsx,txt,pdf格式文件!");
    //     return false;
    //     // return this.$refs.upload.abort();
    //   }
    //   const isLt100M = file.size / 1024 / 1024 < 100;
    //   if (!isLt100M) {
    //     this.$message.error("文件大小不能超过 100MB!");
    //   }
    //   return isLt100M;
    // },
    hiddenApply() {
      this.nextData.userName = ''
    },
    //单击单选按钮审批弹出窗口
    visibleApply() {
      this.getNextProcess()
    },
    //获取部门id
    async deptChange(val) {
      this.addConfide.jdDeptId = val[val.length - 1]
      this.jdUserOption = await getLoginDeptPerson(this.addConfide.jdDeptId)
      this.addConfide.jdDept = this.$refs.cascader
        .getCheckedNodes()[0]
        .pathLabels.pop()
    },
    //map 去重
    deWeightThree(deWeightKey, arrayObj) {
      let name = deWeightKey
      let map = new Map()
      for (let item of arrayObj) {
        if (!map.has(item[name])) {
          map.set(item[name], item)
        }
      }
      return [...map.values()]
    },
    //下拉根据部门id获取部门下的人
    async getPerson() {
      let deptId = this.addConfide.jdDeptId
      let personRes = await getLoginDeptPerson(deptId)
      console.log('部门：' + personRes)
    },
    //选择审批的部门弹窗
    async alertChooseSp() {
      this.treedata = await getTreeSelect()
      this.$refs.sdialog.isShow = true
    },
    choiceUser(UserID, UserObject) {
      //子组件 选择参与人 完成后调用的事件
      this.sprData = UserObject[0]
      console.log(this.sprData, 999, UserID)
      if (this.sprData && this.sprData.realName) {
        this.nextData.userName = this.sprData.realName
        this.addProgram.toUser = this.sprData.userId
      } else {
        this.nextData.userName = ''
      }
      this.$refs.sdialog.isShow = false
    },
    //选择项目清单分页列表接口
    async chooseList() {
      this.dialogVisible = true
      let res = await getTechnologyList(this.addPageForm)
      this.addTableData = res.rows
      this.addTotal = res.total
    },
    //选择项目清单分页列表触发事件
    selectData(val) {
      console.log(val, this.radio)
      this.selData = val
    },
    // 提交触发
    selectItem() {
      if (this.selData && this.selData != '') {
        this.addProgram.projectName = this.selData.projectName
        this.addProgram.projectId = this.selData.projectId
        this.addProgram.bid = this.selData.bid
      } else {
        this.addProgram.projectName = ''
        this.addProgram.projectId = ''
        this.addProgram.bid = ''
        this.radio = 1
      }
      this.selData = ''
      this.radio = ''
      this.dialogVisible = false
    },
    fBtn() {
      this.selData = ''
      this.radio = ''
      this.dialogVisible = false
    },
    //新增页脚
    addHandleSizeChange(val) {
      this.addPageForm.pageSize = val
      this.getTech()
    },
    addHandleCurrentChange(val) {
      this.addPageForm.pageNum = val
      this.getTech()
    },
    //获取方案性质下拉
    async getNatureSel() {
      let dictName = 'program_nature'
      this.natureRes = await getSelectTechItem(dictName)
    },
    //获取方案类别下拉
    async getTypeSel() {
      let dictName = 'scheme_category'
      this.categoryRes = await getSelectTechItem(dictName)
    },
    handleDeptFun(val, addProgram, thsAreaCode) {
      // 注意1：获取value值   //注意2： 获取label值
      this.addProgram.projectDeptId = val[val.length - 1]
      this.addProgram.projectDept = this.$refs[
        'cascader'
      ].getCheckedNodes()[0].data.label
    },
    //获取方案性质id
    peojectFunc(val, vIndex) {
      let resultArr = this.natureRes.filter((item) => {
        return item.dictCode === val
      })
      //把值赋给要传给后台的表单对象中
      this.addProgram.natureId = resultArr[0].dictCode
      this.addProgram.nature = resultArr[0].dictLabel //直接写val也可以
    },
    //获取项目类型下拉id
    peojectTypeFunc(val, vIndex) {
      let resultArr = this.categoryRes.filter((item) => {
        return item.dictCode === val
      })
      //把值赋给要传给后台的表单对象中
      this.addProgram.categoryId = resultArr[0].dictCode
      this.addProgram.category = resultArr[0].dictLabel //直接写val也可以
    },
    // 文件列表移除文件时的钩子
    // async handleRemove(file, fileList) {
    //   let row = JSON.parse(JSON.stringify(file))
    //   let roaw = JSON.stringify(file)
    //   await fsDelete(row.fileId)
    //   this.ruleForm.fileList = []
    //   this.$refs.upload.clearFiles()
    // },
    // 上传成功时的钩子
    uploadSuccess(res, file, fileList) {
      this.addProgram.workProgramFileList = fileList
    },
    // 移除
    remUpload(file, fileList) {
      this.addProgram.workProgramFileList = fileList
    },
    //文件大小
    beforeUpload(file) {
      console.log(file)
      let FileFormat = file.name.substring(file.name.lastIndexOf('.') + 1)
      let testmsg = FileFormat.toLowerCase()
      const extension = testmsg === 'xls'
      const extension2 = testmsg === 'xlsx'
      const extension3 = testmsg === 'doc'
      const extension4 = testmsg === 'docx'
      const extension5 = testmsg === 'txt'
      const extension6 = testmsg === 'pdf'
      const extension7 = testmsg === 'bmp'
      const extension8 = testmsg === 'jpg'
      const extension9 = testmsg === 'png'
      const extension10 = testmsg === 'gif'
      const extension11 = testmsg === 'avi'
      const extension12 = testmsg === 'rmvb'
      const extension13 = testmsg === 'flv'
      const extension14 = testmsg === 'mp4'
      const extension15 = testmsg === '3gp'
      const extension16 = testmsg === 'rar'
      const extension17 = testmsg === 'zip'
      const extension18 = testmsg === 'mp3'

      const isLt2M = file.size / 1024 / 1024 < 1000
      if (
        !extension &&
        !extension2 &&
        !extension3 &&
        !extension4 &&
        !extension5 &&
        !extension6 &&
        !extension7 &&
        !extension8 &&
        !extension9 &&
        !extension10 &&
        !extension11 &&
        !extension12 &&
        !extension13 &&
        !extension14 &&
        !extension15 &&
        !extension16 &&
        !extension17 &&
        !extension18
      ) {
        this.addProgram.workProgramFileList = []
        this.fileLists = []
        this.$message({
          message: '请上传正确的格式!',
          type: 'warning'
        })
        return false
      }
      if (!isLt2M) {
        this.addProgram.workProgramFileList = []
        this.fileLists = []
        this.$message({
          message: '上传文件大小超过限制!',
          type: 'warning'
        })
        return false
      }
    },

    confirm: antiShake(function() {
      let errorMessage = () => {
        this.$notify({
          title: '操作失败',
          dangerouslyUseHTMLString: true,
          message: '请填写完整',
          type: 'warning'
        })
        return
      }
      this.$refs.operationFome.validate(async (valid) => {
        if (!valid) {
          return errorMessage()
        }
        // if (this.addProgram.isApply == false) {
        //   let data = null
        //   data = await getAddProgram(this.addProgram)
        //   this.$notify({
        //     title: data ? '添加成功' : '添加失败',
        //     dangerouslyUseHTMLString: true,
        //     message: data ? data.message : '系统正在维护中，请与管理员联系',
        //     type: data ? 'success' : 'warning'
        //   })
        //   this.$emit('fatherMethod')
        // } else if (this.addProgram.isApply == true) {
        this.$refs.nextDataFormRules.validate(async (valid) => {
          if (!valid) {
            return errorMessage()
          }
          let data = null
          this.addProgram.businessCode = this.businessCode
          this.addProgram.taskNumer = this.scopeRow.taskId
          this.addProgram.workProgramFileList = this.addProgram.workProgramFileList.map(
            (item) => {
              if (item.response) {
                return {
                  fileName: item.response.body.fileName,
                  fileUrl: item.response.body.url
                }
              } else {
                return {
                  fileName: item.name,
                  fileUrl: item.fileUrl
                }
              }
            }
          )
          console.log(this.addProgram, 998)
          data = await getAddProgram(this.addProgram, 'put')
          this.$message.success(data)
          this.closeFun()
        })
      })
    }, 2000),
    treeCheck(data, isCheck, isChildrenCheck) {
      if (isCheck) {
        let keys = this.$refs.deptTree.getCheckedKeys()
        // let itme = [keys[keys.length-1]]
        if (this.currentChecke && this.currentChecke == '') {
          this.currentChecke = keys[0]
        } else {
          let this_ = this
          keys.some((value) => {
            if (value != this_.currentChecke) {
              this_.currentChecke = value
              return true
            }
          })
        }
        let itme = [this.currentChecke]
        this.$refs.deptTree.setCheckedKeys(itme, true)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-tit {
  font-size: 18px;
  background: #ffffff;
  height: 45px;
  line-height: 45px;
  margin-bottom: 10px;
  padding-left: 15px;
  border-radius: 5px;
}
.choose-list {
  color: #409eff;
  cursor: pointer;
  font-weight: 600;
  margin-left: 10px;
  display: inline-block;
}
.confide-content .el-tree {
  width: 30%;
  height: 40vh;
  float: left;
  overflow-y: scroll;
}

.confide-content .el-transfer {
  width: 70%;
  float: left;
}
.tit {
  font-size: 18px;
  height: 50px;
  line-height: 50px;
  color: #333;
  padding-left: 15px;
  margin-top: 18px;
  border-bottom: 1px solid #d7d7d7;
  margin-bottom: 25px;
}
.tit::before {
  display: inline-block;
  content: '';
  width: 4px;
  height: 20px;
  background: rgba(13, 116, 215, 1);
  vertical-align: -4px;
  margin-right: 9px;
}
</style>
