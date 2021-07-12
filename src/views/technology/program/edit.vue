<template>
  <div class="container-table">
    <div class="page-tit">编辑</div>
    <div class="table-list">
      <el-form
        :model="addProgram"
        :rules="formRules"
        ref="operationFome"
        label-width="120px"
        label-position="left"
      >
        <el-form-item label="方案性质" prop="natureId">
          <el-select
            v-model="addProgram.natureId"
            placeholder="请选择方案性质"
            style="width:100%"
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
            style="width:100%"
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
            style="width:70%"
            maxlength="30"
            show-word-limit
            placeholder="请输入项目名称"
          />
          <span @click="chooseList">选择列表</span>
        </el-form-item>
        <el-form-item label="标段" prop="bid">
          <el-input
            v-model="addProgram.bid"
            maxlength="30"
            show-word-limit
            placeholder="标段"
          />
        </el-form-item>
        <el-form-item
          label="参建子公司"
          prop="projectDeptId"
          style="width: 100%;"
          v-show="true"
        >
          <el-cascader
            ref="cascader"
            v-model="addProgram.projectDeptId"
            :options="this.deptOptions"
            :props="jobProps"
            style="width: 100%;"
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
        <el-form-item label="附件" prop="workProgramFileList">
          <div class="upload">
            <el-upload
              ref="upload"
              class="upload-demo"
              :action="getUrl"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :on-success="uploadSuccess"
              :on-change="removeLastFile"
              multiple
              :limit="1"
              :file-list="fileLists"
              name="file"
            >
              <el-button size="small" type="primary" v-if="flag == true"
                >选择文件</el-button
              >
              <span v-if="flag == false">点击文件下载</span>
            </el-upload>
            <div class="shade" v-if="flag == false"></div>
          </div>
        </el-form-item>
        <!-- <el-form-item label="审批" prop="isApply">
          <el-radio-group v-model="addProgram.isApply">
            <el-radio :label="false">不需要</el-radio>
            <el-radio :label="true">需要</el-radio>
          </el-radio-group>
        </el-form-item> -->
      </el-form>
      <div style="text-align:right;">
        <el-button class="confirm-btn" @click="confirm">
          提交
        </el-button>
        <el-button class="cancel-btn" @click="cancelBtn">
          取消
        </el-button>
      </div>

      <!--新增盒子-->
      <el-dialog
        :visible.sync="dialogVisible"
        custom-class="large"
        :title="'新增列表'"
      >
        <el-table
          :data="addTableData"
          v-loading="loading"
          style="width: 100%;margin-top:30px;"
          @selection-change="handleSelectionChange"
          row-key="menuId"
          @select="selectItem"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          stripe
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column align="center" label="项目名称">
            <template slot-scope="scope">
              {{ scope.row.projectName }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="标段">
            <template slot-scope="scope">
              {{ scope.row.bid }} </template
            >>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="addTotal"
          :page-sizes="addPageSizes"
          :page-size="addPageForm.pageSize"
          @size-change="addHandleSizeChange"
          @current-change="addHandleCurrentChange"
        >
        </el-pagination>
        <div style="text-align:right;">
          <el-button class="confirm-btn" @click="dialogVisible = false">
            提交
          </el-button>
          <el-button class="cancel-btn" @click="dialogVisible = false">
            取消
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getLoginDept } from '@/api/system/dept'
import {
  getEditProgram,
  getProgramItem
} from '@/api/technology/program/program.js'
import { getSelectTechItem } from '@/api/system/class'
import { getTechnologyList } from '@/api/technology/item/item.js'

export default {
  props: {
    editProgram: String
  },
  name: 'index',
  data() {
    return {
      has: {
        remove: 'system:dept:remove',
        query: 'system:dept:query',
        add: 'system:dept:add',
        edit: 'system:dept:edit'
      },
      //选择列表 项目清单
      addTotal: '',
      id: '',
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
        workProgramFileList: [
          {
            fileName: '',
            fileUrl: ''
          }
        ],
        isApply: ''
      },
      workprogramId: this.$route.query.workprogramId,
      flag: true,
      defaultMenutree: [],
      multipleSelection: [],
      //选择列表
      addTableData: [],
      loading: false,
      tableData: [],
      tableKey: 0,
      listLoading: false,
      dialogVisible: false,
      dialogType: 'new',
      deptOptions: [],
      fileLists: [],
      checkStrictly: true,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
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
        ],
        isApply: [
          {
            required: true,
            message: '请选择是否需要审批',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    getUrl() {
      return this.$store.state.apiConfiguration.url + '/fs/upload'
    }
  },
  created: async function() {
    this.getNatureSel()
    this.getTypeSel()
    this.deptOptions = await getLoginDept()
    this.id = this.editProgram
    this.addProgram = await getProgramItem(this.id)
  },
  methods: {
    //取消操作
    cancelBtn() {
      history.go(-1)
    },
    //选择项目清单分页列表接口
    async chooseList() {
      this.dialogVisible = true
      let res = await getTechnologyList(this.addPageForm)
      this.addTableData = res.rows
      this.addTotal = res.total
    },
    //选择项目清单分页列表触发事件
    selectItem(data) {
      this.addProgram.projectName = data[0].projectName
      this.addProgram.projectId = data[0].projectId
      this.addProgram.bid = data[0].bid
    },
    //新增页脚
    addHandleSizeChange(val) {
      this.pageForm.pageSize = val
    },
    addHandleCurrentChange(val) {
      this.pageForm.pageNum = val
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
    async handleRemove(file, fileList) {
      let row = JSON.parse(JSON.stringify(file))
      let roaw = JSON.stringify(file)
      await fsDelete(row.fileId)
      this.ruleForm.fileList = []
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
        this.addProgram.workProgramFileList.push(arry)
      } else {
        this.addProgram.workProgramFileList = formImgList
      }
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
    async handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      if (this.$refs['operationFome']) {
        this.$refs['operationFome'].resetFields()
      }
    },
    async confirm() {
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
        let data = null
        data = await getEditProgram(this.addProgram)
        this.$notify({
          title: data ? '修改成功' : '修改失败',
          dangerouslyUseHTMLString: true,
          message: data ? data.message : '系统正在维护中，请与管理员联系',
          type: data ? 'success' : 'warning'
        })
        this.$router.push({
          path: '/program/index'
        })
      })
    },
    handleSelectionChange(val) {
      if (val) {
        let arr = []
        for (let i = 0; i < val.length; i++) {
          let itme = val[i]
          arr.push(itme.deptId)
        }
        this.multipleSelection = [...arr]
      }
    },
    treeCheck(data, isCheck, isChildrenCheck) {
      if (isCheck) {
        let keys = this.$refs.deptTree.getCheckedKeys()
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
</style>
